"""HASP components module."""
import hashlib
import json
import logging
import os
import pathlib
import re
import jsonschema

from homeassistant.components.binary_sensor import DOMAIN as BINARY_SENSOR_DOMAIN
from homeassistant.components.light import DOMAIN as LIGHT_DOMAIN
from homeassistant.components.switch import DOMAIN as SWITCH_DOMAIN
from homeassistant.const import CONF_NAME, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import callback
from homeassistant.exceptions import TemplateError
from homeassistant.helpers import device_registry as dr, entity_registry
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.entity_component import EntityComponent
from homeassistant.helpers.event import TrackTemplate, async_track_template_result
from homeassistant.helpers.network import get_url
from homeassistant.helpers.reload import async_integration_yaml_config
from homeassistant.helpers.restore_state import RestoreEntity
from homeassistant.helpers.service import async_call_from_config
from homeassistant.util import slugify
import voluptuous as vol

from .common import HASP_IDLE_SCHEMA
from .const import (
    ATTR_CONFIG_SUBMODULE,
    ATTR_HEIGHT,
    ATTR_IDLE,
    ATTR_IMAGE,
    ATTR_OBJECT,
    ATTR_PAGE,
    ATTR_PATH,
    ATTR_COMMAND_KEYWORD,
    ATTR_COMMAND_PARAMETERS,
    ATTR_CONFIG_PARAMETERS,
    ATTR_WIDTH,
    CONF_COMPONENT,
    CONF_EVENT,
    CONF_HWID,
    CONF_OBJECTS,
    CONF_OBJID,
    CONF_PAGES,
    CONF_PAGES_PATH,
    CONF_PLATE,
    CONF_PROPERTIES,
    CONF_TOPIC,
    CONF_TRACK,
    DATA_IMAGES,
    DATA_LISTENER,
    DISCOVERED_MANUFACTURER,
    DISCOVERED_MODEL,
    DISCOVERED_VERSION,
    DOMAIN,
    EVENT_HASP_PLATE_OFFLINE,
    EVENT_HASP_PLATE_ONLINE,
    HASP_EVENT,
    HASP_EVENT_DOWN,
    HASP_EVENT_RELEASE,
    HASP_EVENT_UP,
    HASP_EVENTS,
    HASP_LWT,
    HASP_NUM_PAGES,
    HASP_ONLINE,
    HASP_VAL,
    MAJOR,
    MINOR,
    SERVICE_CLEAR_PAGE,
    SERVICE_LOAD_PAGE,
    SERVICE_PAGE_CHANGE,
    SERVICE_PAGE_NEXT,
    SERVICE_PAGE_PREV,
    SERVICE_PUSH_IMAGE,
    SERVICE_WAKEUP,
    SERVICE_COMMAND,
    SERVICE_CONFIG,
)
from .image import ImageServeView, image_to_rgb565

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [LIGHT_DOMAIN, SWITCH_DOMAIN, BINARY_SENSOR_DOMAIN]


def hasp_object(value):
    """Validade HASP-LVGL object format."""
    if re.match("p[0-9]+b[0-9]+", value):
        return value
    raise vol.Invalid("Not an HASP-LVGL object p#b#")


# Configuration YAML schemas
EVENT_SCHEMA = cv.schema_with_slug_keys([cv.SERVICE_SCHEMA])

PROPERTY_SCHEMA = cv.schema_with_slug_keys(cv.template)

OBJECT_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_OBJID): hasp_object,
        vol.Optional(CONF_TRACK, default=None): vol.Any(cv.entity_id, None),
        vol.Optional(CONF_PROPERTIES, default={}): PROPERTY_SCHEMA,
        vol.Optional(CONF_EVENT, default={}): EVENT_SCHEMA,
    }
)

PLATE_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_OBJECTS): vol.All(cv.ensure_list, [OBJECT_SCHEMA]),
    },
)

CONFIG_SCHEMA = vol.Schema(
    {DOMAIN: vol.Schema({cv.slug: PLATE_SCHEMA})}, extra=vol.ALLOW_EXTRA
)

# JSON Messages from HASP schemas
HASP_VAL_SCHEMA = vol.Schema(
    {vol.Required(HASP_VAL): vol.All(int, vol.Range(min=0, max=1))},
    extra=vol.ALLOW_EXTRA,
)
HASP_EVENT_SCHEMA = vol.Schema(
    {vol.Required(HASP_EVENT): vol.Any(*HASP_EVENTS)}, extra=vol.ALLOW_EXTRA
)

HASP_STATUSUPDATE_SCHEMA = vol.Schema(
    {
        vol.Required("node"): cv.string,
        vol.Required("version"): cv.string,
        vol.Required("uptime"): int,
        vol.Required("canUpdate"): cv.boolean,
    },
    extra=vol.ALLOW_EXTRA,
)

HASP_LWT_SCHEMA = vol.Schema(vol.Any(*HASP_LWT))

HASP_PAGE_SCHEMA = vol.Schema(vol.All(vol.Coerce(int), vol.Range(min=0, max=12)))

PUSH_IMAGE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_IMAGE): vol.Any(cv.url, cv.isfile),
        vol.Required(ATTR_OBJECT): hasp_object,
        vol.Optional(ATTR_WIDTH): cv.positive_int,
        vol.Optional(ATTR_HEIGHT): cv.positive_int,
    },
    extra=vol.ALLOW_EXTRA,
)


async def async_setup(hass, config):
    """Set up the MQTT async example component."""
    conf = config.get(DOMAIN)

    if conf is None:
        # We still depend in YAML so we must fail
        _LOGGER.error(
            "openHASP requires you to setup your plate objects in your YAML configuration."
        )
        return False

    hass.data[DOMAIN] = {CONF_PLATE: {}}

    component = hass.data[DOMAIN][CONF_COMPONENT] = EntityComponent(
        _LOGGER, DOMAIN, hass
    )

    component.async_register_entity_service(SERVICE_WAKEUP, {}, "async_wakeup")
    component.async_register_entity_service(
        SERVICE_PAGE_NEXT, {}, "async_change_page_next"
    )
    component.async_register_entity_service(
        SERVICE_PAGE_PREV, {}, "async_change_page_prev"
    )
    component.async_register_entity_service(
        SERVICE_PAGE_CHANGE, {vol.Required(ATTR_PAGE): int}, "async_change_page"
    )
    component.async_register_entity_service(
        SERVICE_LOAD_PAGE, {vol.Required(ATTR_PATH): cv.isfile}, "async_load_page"
    )
    component.async_register_entity_service(
        SERVICE_CLEAR_PAGE, {vol.Optional(ATTR_PAGE): int}, "async_clearpage"
    )
    component.async_register_entity_service(
        SERVICE_COMMAND,
        {
            vol.Required(ATTR_COMMAND_KEYWORD): cv.string,
            vol.Optional(ATTR_COMMAND_PARAMETERS, default=""): cv.string,
        },
        "async_command_service",
    )

    component.async_register_entity_service(
        SERVICE_CONFIG,
        {
            vol.Required(ATTR_CONFIG_SUBMODULE): cv.string,
            vol.Required(ATTR_CONFIG_PARAMETERS): cv.string,
        },
        "async_config_service",
    )

    component.async_register_entity_service(
        SERVICE_PUSH_IMAGE, PUSH_IMAGE_SCHEMA, "async_push_image"
    )

    hass.data[DOMAIN][DATA_IMAGES] = dict()
    hass.http.register_view(ImageServeView)

    return True


async def async_update_options(hass, entry):
    """Handle options update."""
    _LOGGER.debug("Reloading")
    await hass.config_entries.async_reload(entry.entry_id)


async def async_setup_entry(hass, entry) -> bool:
    """Set up OpenHASP via a config entry."""
    plate = entry.data[CONF_NAME]
    _LOGGER.debug("Setup %s", plate)

    hass_config = await async_integration_yaml_config(hass, DOMAIN)

    if DOMAIN not in hass_config or slugify(plate) not in hass_config[DOMAIN]:
        _LOGGER.error(
            "No YAML configuration for %s, \
            please create an entry under 'openhasp' with the slug: %s",
            plate,
            slugify(plate),
        )
        return False

    config = hass_config[DOMAIN][slugify(plate)]

    # Register Plate device
    device_registry = await dr.async_get_registry(hass)
    device_registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, entry.data[CONF_HWID])},
        manufacturer=entry.data[DISCOVERED_MANUFACTURER],
        model=entry.data[DISCOVERED_MODEL],
        sw_version=entry.data[DISCOVERED_VERSION],
        name=plate,
    )

    # Add entity to component
    component = hass.data[DOMAIN][CONF_COMPONENT]
    plate_entity = SwitchPlate(hass, config, entry)
    await component.async_add_entities([plate_entity])
    hass.data[DOMAIN][CONF_PLATE][plate] = plate_entity

    for domain in PLATFORMS:
        hass.async_create_task(
            hass.config_entries.async_forward_entry_setup(entry, domain)
        )

    listener = entry.add_update_listener(async_update_options)
    hass.data[DOMAIN][CONF_PLATE][DATA_LISTENER] = listener

    return True


async def async_unload_entry(hass, entry):
    """Remove a config entry."""
    plate = entry.data[CONF_NAME]

    _LOGGER.debug("Unload entry for plate %s", plate)

    listener = hass.data[DOMAIN][CONF_PLATE][DATA_LISTENER]

    # Only remove services if it is the last
    if len(hass.data[DOMAIN][CONF_PLATE]) == 1:
        hass.services.async_remove(DOMAIN, SERVICE_WAKEUP)
        hass.services.async_remove(DOMAIN, SERVICE_PAGE_NEXT)
        hass.services.async_remove(DOMAIN, SERVICE_PAGE_PREV)
        hass.services.async_remove(DOMAIN, SERVICE_PAGE_CHANGE)
        hass.services.async_remove(DOMAIN, SERVICE_LOAD_PAGE)
        hass.services.async_remove(DOMAIN, SERVICE_CLEAR_PAGE)
        hass.services.async_remove(DOMAIN, SERVICE_COMMAND)

    for domain in PLATFORMS:
        await hass.config_entries.async_forward_entry_unload(entry, domain)

    device_registry = await dr.async_get_registry(hass)
    dev = device_registry.async_get_device(
        identifiers={(DOMAIN, entry.data[CONF_HWID])}
    )
    if entry.entry_id in dev.config_entries:
        _LOGGER.debug("Removing device %s", dev)
        device_registry.async_remove_device(dev.id)

    component = hass.data[DOMAIN][CONF_COMPONENT]
    await component.async_remove_entity(hass.data[DOMAIN][CONF_PLATE][plate].entity_id)

    # Component does not remove entity from entity_registry, so we must do it
    registry = await entity_registry.async_get_registry(hass)
    registry.async_remove(hass.data[DOMAIN][CONF_PLATE][plate].entity_id)

    listener()

    # Remove Plate entity
    del hass.data[DOMAIN][CONF_PLATE][plate]

    return True


# pylint: disable=R0902
class SwitchPlate(RestoreEntity):
    """Representation of an openHASP Plate."""

    def __init__(self, hass, config, entry):
        """Initialize a plate."""
        super().__init__()
        self._entry = entry
        self._topic = entry.data[CONF_TOPIC]
        self._pages_jsonl = entry.options.get(
            CONF_PAGES_PATH, entry.data.get(CONF_PAGES_PATH)
        )

        self._objects = []
        for obj in config[CONF_OBJECTS]:
            new_obj = HASPObject(hass, self._topic, obj)

            self._objects.append(new_obj)
        self._statusupdate = {HASP_NUM_PAGES: entry.data[CONF_PAGES]}
        self._available = False
        self._page = 1

        self._subscriptions = []

        with open(
            pathlib.Path(__file__).parent.joinpath("pages_schema.json"), "r"
        ) as schema_file:
            self.json_schema = json.load(schema_file)

    async def async_will_remove_from_hass(self):
        """Run before entity is removed."""
        _LOGGER.debug("Remove plate %s", self._entry.data[CONF_NAME])

        for obj in self._objects:
            await obj.disable_object()

        for subscription in self._subscriptions:
            subscription()

    async def async_added_to_hass(self):
        """Run when entity about to be added."""
        await super().async_added_to_hass()

        state = await self.async_get_last_state()
        if state and state.state not in [STATE_UNAVAILABLE, STATE_UNKNOWN, None]:
            self._page = int(state.state)

        @callback
        async def page_update_received(msg):
            """Process page state."""
            try:
                self._page = HASP_PAGE_SCHEMA(msg.payload)
                _LOGGER.debug("Page changed to %s", self._page)
                self.async_write_ha_state()
            except vol.error.Invalid as err:
                _LOGGER.error("%s in %s", err, msg.payload)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/page", page_update_received
            )
        )

        @callback
        async def statusupdate_message_received(msg):
            """Process statusupdate."""

            try:
                message = HASP_STATUSUPDATE_SCHEMA(json.loads(msg.payload))

                major, minor, _ = message["version"].split(".")
                if (major, minor) != (MAJOR, MINOR):
                    self.hass.components.persistent_notification.create(
                        f"You require firmware version {MAJOR}.{MINOR}.x \
                            in plate {self._entry.data[CONF_NAME]} \
                            for this component to work properly.\
                            <br>Some features will simply not work!",
                        title="openHASP Firmware mismatch",
                        notification_id="openhasp_firmware_notification",
                    )
                    _LOGGER.error(
                        "%s firmware mismatch %s <> %s",
                        self._entry.data[CONF_NAME],
                        (major, minor),
                        (MAJOR, MINOR),
                    )
                self._available = True
                self._statusupdate = message

                self._page = message[ATTR_PAGE]
                self.async_write_ha_state()

            except vol.error.Invalid as err:
                _LOGGER.error("While processing status update: %s", err)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/statusupdate", statusupdate_message_received
            )
        )
        self.hass.components.mqtt.async_publish(
            f"{self._topic}/command", "statusupdate", qos=0, retain=False
        )

        @callback
        async def idle_message_received(msg):
            """Process idle message."""
            try:
                self._statusupdate[ATTR_IDLE] = HASP_IDLE_SCHEMA(msg.payload)
                self.async_write_ha_state()
            except vol.error.Invalid as err:
                _LOGGER.error("While processing idle message: %s", err)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/state/idle", idle_message_received
            )
        )

        @callback
        async def lwt_message_received(msg):
            """Process LWT."""
            _LOGGER.debug("Received LWT = %s", msg.payload)
            try:
                message = HASP_LWT_SCHEMA(msg.payload)

                if message == HASP_ONLINE:
                    self._available = True
                    self.hass.bus.async_fire(
                        EVENT_HASP_PLATE_ONLINE,
                        {CONF_PLATE: self._entry.data[CONF_HWID]},
                    )
                    if self._pages_jsonl:
                        await self.async_load_page(self._pages_jsonl)
                    else:
                        await self.refresh()

                    for obj in self._objects:
                        await obj.enable_object()
                else:
                    self._available = False
                    self.hass.bus.async_fire(
                        EVENT_HASP_PLATE_OFFLINE,
                        {CONF_PLATE: self._entry.data[CONF_HWID]},
                    )
                    for obj in self._objects:
                        await obj.disable_object()

                self.async_write_ha_state()

            except vol.error.Invalid as err:
                _LOGGER.error("While processing LWT: %s", err)

        self._subscriptions.append(
            await self.hass.components.mqtt.async_subscribe(
                f"{self._topic}/LWT", lwt_message_received
            )
        )

    @property
    def unique_id(self):
        """Return the plate identifier."""
        return self._entry.data[CONF_HWID]

    @property
    def name(self):
        """Return the name of the plate."""
        return self._entry.data[CONF_NAME]

    @property
    def icon(self):
        """Return the icon to be used for this entity."""
        return "mdi:gesture-tap-box"

    @property
    def state(self):
        """Return the state of the component."""
        return self._page

    @property
    def available(self):
        """Return if entity is available."""
        return self._available

    @property
    def state_attributes(self):
        """Return the state attributes."""
        attributes = {}

        if self._statusupdate:
            attributes = {**attributes, **self._statusupdate}

        if ATTR_PAGE in attributes:
            del attributes[
                ATTR_PAGE
            ]  # Page is tracked in the state, don't confuse users

        return attributes

    async def async_wakeup(self):
        """Wake up the display."""
        cmd_topic = f"{self._topic}/command"
        _LOGGER.warning("Wakeup will be deprecated in 0.8.0")  # remove in version 0.8.0
        self.hass.components.mqtt.async_publish(
            cmd_topic, "wakeup", qos=0, retain=False
        )

    async def async_change_page_next(self):
        """Change page to next one."""
        cmd_topic = f"{self._topic}/command/page"
        _LOGGER.warning(
            "page next service will be deprecated in 0.8.0"
        )  # remove in version 0.8.0

        self.hass.components.mqtt.async_publish(
            cmd_topic, "page next", qos=0, retain=False
        )

    async def async_change_page_prev(self):
        """Change page to previous one."""
        cmd_topic = f"{self._topic}/command/page"
        _LOGGER.warning(
            "page prev service will be deprecated in 0.8.0"
        )  # remove in version 0.8.0

        self.hass.components.mqtt.async_publish(
            cmd_topic, "page prev", qos=0, retain=False
        )

    async def async_clearpage(self, page="all"):
        """Clear page."""
        cmd_topic = f"{self._topic}/command"

        self.hass.components.mqtt.async_publish(
            cmd_topic, f"clearpage {page}", qos=0, retain=False
        )

        if page == "all":
            self.hass.components.mqtt.async_publish(
                cmd_topic, "page 1", qos=0, retain=False
            )

    async def async_change_page(self, page):
        """Change page to number."""
        cmd_topic = f"{self._topic}/command/page"

        if self._statusupdate:
            num_pages = self._statusupdate[HASP_NUM_PAGES]

            if page <= 0 or page > num_pages:
                _LOGGER.error(
                    "Can't change to %s, available pages are 1 to %s", page, num_pages
                )
                return

        self._page = page

        _LOGGER.debug("Change page %s", self._page)
        self.hass.components.mqtt.async_publish(
            cmd_topic, self._page, qos=0, retain=False
        )
        self.async_write_ha_state()

    async def async_command_service(self, keyword, parameters):
        """Sends commands directly to the plate entity"""
        self.hass.components.mqtt.async_publish(
            f"{self._topic}/command",
            f"{keyword} {parameters}".strip(),
            qos=0,
            retain=False,
        )

    async def async_config_service(self, submodule, parameters):
        """Sends configuration commands to plate entity"""
        self.hass.components.mqtt.async_publish(
            f"{self._topic}/config/{submodule}",
            f"{parameters}".strip(),
            qos=0,
            retain=False,
        )

    async def async_push_image(self, image, obj, width=None, height=None):
        """update object image."""

        image_id = hashlib.md5(image.encode("utf-8")).hexdigest()

        rgb_image = await self.hass.async_add_executor_job(
            image_to_rgb565, image, (width, height)
        )

        self.hass.data[DOMAIN][DATA_IMAGES][image_id] = rgb_image

        cmd_topic = f"{self._topic}/command/{obj}.src"

        rgb_image_url = (
            f"{get_url(self.hass, allow_external=False)}/api/openhasp/serve/{image_id}"
        )

        _LOGGER.debug("Push %s with %s", cmd_topic, rgb_image_url)

        self.hass.components.mqtt.async_publish(
            cmd_topic, rgb_image_url, qos=0, retain=False
        )

    async def refresh(self):
        """Refresh objects in the SwitchPlate."""

        _LOGGER.warning("Refreshing %s", self._entry.data[CONF_NAME])
        for obj in self._objects:
            await obj.refresh()

        await self.async_change_page(self._page)

    async def async_load_page(self, path):
        """Load pages file on the SwitchPlate, existing pages will not be cleared."""
        cmd_topic = f"{self._topic}/command"
        _LOGGER.info("Load page %s to %s", path, cmd_topic)

        if not self.hass.config.is_allowed_path(path):
            _LOGGER.error("'%s' is not an allowed directory", path)
            return

        def send_lines(lines):
            mqtt_payload_buffer = ""
            for line in lines:
                if len(mqtt_payload_buffer) + len(line) > 1000:
                    self.hass.components.mqtt.async_publish(
                        f"{cmd_topic}/jsonl", mqtt_payload_buffer, qos=0, retain=False
                    )
                    mqtt_payload_buffer = line
                else:
                    mqtt_payload_buffer = mqtt_payload_buffer + line
            self.hass.components.mqtt.async_publish(
                f"{cmd_topic}/jsonl", mqtt_payload_buffer, qos=0, retain=False
            )

        try:
            with open(path, "r") as pages_file:
                if path.endswith(".json"):
                    json_data = json.load(pages_file)
                    jsonschema.validate(instance=json_data, schema=self.json_schema)
                    lines = []
                    for item in json_data:
                        if isinstance(item, dict):
                            lines.append(json.dumps(item) + "\n")
                    send_lines(lines)
                else:
                    send_lines(pages_file)
            await self.refresh()

        except (IndexError, FileNotFoundError, IsADirectoryError, UnboundLocalError):
            _LOGGER.error(
                "File or data not present at the moment: %s",
                os.path.basename(path),
            )

        except json.JSONDecodeError:
            _LOGGER.error(
                "Error decoding .json file: %s",
                os.path.basename(path),
            )

        except jsonschema.ValidationError as e:
            _LOGGER.error(
                "Schema check failed for %s. Validation Error: %s",
                os.path.basename(path),
                e.message,
            )


# pylint: disable=R0902
class HASPObject:
    """Representation of an HASP-LVGL object."""

    def __init__(self, hass, plate_topic, config):
        """Initialize an object."""

        self.hass = hass
        self.obj_id = config[CONF_OBJID]
        self.command_topic = f"{plate_topic}/command/{self.obj_id}."
        self.state_topic = f"{plate_topic}/state/{self.obj_id}"
        self.cached_properties = {}

        self.properties = config.get(CONF_PROPERTIES)
        self.event_services = config.get(CONF_EVENT)
        self._tracked_property_templates = []
        self._freeze_properties = []
        self._subscriptions = []

    async def enable_object(self):
        """Initialize object events and properties subscriptions."""

        if self.event_services:
            _LOGGER.debug("Setup event_services for '%s'", self.obj_id)
            self._subscriptions.append(await self.async_listen_hasp_events())

        for _property, template in self.properties.items():
            self._tracked_property_templates.append(
                await self.async_set_property(_property, template)
            )

    async def disable_object(self):
        """Remove subscriptions and event tracking."""
        _LOGGER.debug("Disabling HASPObject %s", self.obj_id)
        for subscription in self._subscriptions:
            subscription()
        self._subscriptions = []

        for tracked_template in self._tracked_property_templates:
            tracked_template.async_remove()
        self._tracked_property_templates = []

    async def async_set_property(self, _property, template):
        """Set HASP Object property to template value."""

        @callback
        def _async_template_result_changed(event, updates):
            track_template_result = updates.pop()
            template = track_template_result.template
            result = track_template_result.result

            if isinstance(result, TemplateError) or result is None:
                entity = event and event.data.get("entity_id")
                _LOGGER.error(
                    "TemplateError('%s') "
                    "while processing template '%s' "
                    "in entity '%s'",
                    result,
                    template,
                    entity,
                )
                return

            self.cached_properties[_property] = result
            if _property in self._freeze_properties:
                # Skip update to plate to avoid feedback loops
                return

            _LOGGER.debug(
                "%s.%s - %s changed, updating with: %s",
                self.obj_id,
                _property,
                template,
                result,
            )

            self.hass.components.mqtt.async_publish(
                self.command_topic + _property, result
            )

        property_template = async_track_template_result(
            self.hass,
            [TrackTemplate(template, None)],
            _async_template_result_changed,
        )
        property_template.async_refresh()

        return property_template

    async def refresh(self):
        """Refresh based on cached values."""
        for _property, result in self.cached_properties.items():
            _LOGGER.debug("Refresh object %s.%s = %s", self.obj_id, _property, result)
            self.hass.components.mqtt.async_publish(
                self.command_topic + _property, result
            )

    async def async_listen_hasp_events(self):
        """Listen to messages on MQTT for HASP events."""

        @callback
        async def message_received(msg):
            """Process object state MQTT message."""
            try:
                message = HASP_EVENT_SCHEMA(json.loads(msg.payload))

                if message[HASP_EVENT] == HASP_EVENT_DOWN:
                    # store properties that shouldn't be updated while button pressed
                    self._freeze_properties = message.keys()
                elif message[HASP_EVENT] in [HASP_EVENT_UP, HASP_EVENT_RELEASE]:
                    self._freeze_properties = []

                for event in self.event_services:
                    if event in message[HASP_EVENT]:
                        _LOGGER.debug(
                            "Service call for '%s' triggered by '%s' on '%s' with variables %s",
                            event,
                            msg.payload,
                            msg.topic,
                            message,
                        )
                        for service in self.event_services[event]:
                            await async_call_from_config(
                                self.hass,
                                service,
                                validate_config=False,
                                variables=message,
                            )
            except vol.error.Invalid:
                _LOGGER.warning(
                    "Could not handle openHASP event: '%s' on '%s'",
                    msg.payload,
                    msg.topic,
                )
            except json.decoder.JSONDecodeError as err:
                _LOGGER.error(
                    "Error decoding received JSON message: %s on %s", err.doc, msg.topic
                )

        _LOGGER.debug("Subscribe to '%s' events on '%s'", self.obj_id, self.state_topic)
        return await self.hass.components.mqtt.async_subscribe(
            self.state_topic, message_received
        )
