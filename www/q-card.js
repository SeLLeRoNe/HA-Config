/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/card-tools/src/event.js":
/*!**********************************************!*\
  !*** ./node_modules/card-tools/src/event.js ***!
  \**********************************************/
/*! exports provided: fireEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fireEvent\", function() { return fireEvent; });\n/* harmony import */ var _hass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hass */ \"./node_modules/card-tools/src/hass.js\");\n\n\nfunction fireEvent(ev, detail, entity=null) {\n  ev = new Event(ev, {\n    bubbles: true,\n    cancelable: false,\n    composed: true,\n  });\n  ev.detail = detail || {};\n  if(entity) {\n    entity.dispatchEvent(ev);\n  } else {\n    var root = Object(_hass__WEBPACK_IMPORTED_MODULE_0__[\"lovelace_view\"])();\n    if (root) root.dispatchEvent(ev);\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/card-tools/src/event.js?");

/***/ }),

/***/ "./node_modules/card-tools/src/hass.js":
/*!*********************************************!*\
  !*** ./node_modules/card-tools/src/hass.js ***!
  \*********************************************/
/*! exports provided: hass, provideHass, lovelace, lovelace_view, load_lovelace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hass\", function() { return hass; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"provideHass\", function() { return provideHass; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"lovelace\", function() { return lovelace; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"lovelace_view\", function() { return lovelace_view; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"load_lovelace\", function() { return load_lovelace; });\nfunction hass() {\n  if(document.querySelector('hc-main'))\n    return document.querySelector('hc-main').hass;\n\n  if(document.querySelector('home-assistant'))\n    return document.querySelector('home-assistant').hass;\n\n  return undefined;\n};\n\nfunction provideHass(element) {\n  if(document.querySelector('hc-main'))\n    return document.querySelector('hc-main').provideHass(element);\n\n  if(document.querySelector('home-assistant'))\n    return document.querySelector(\"home-assistant\").provideHass(element);\n\n  return undefined;\n}\n\nfunction lovelace() {\n  var root = document.querySelector(\"hc-main\");\n  if(root) {\n    var ll = root._lovelaceConfig;\n    ll.current_view = root._lovelacePath;\n    return ll;\n  }\n\n  root = document.querySelector(\"home-assistant\");\n  root = root && root.shadowRoot;\n  root = root && root.querySelector(\"home-assistant-main\");\n  root = root && root.shadowRoot;\n  root = root && root.querySelector(\"app-drawer-layout partial-panel-resolver\");\n  root = root && root.shadowRoot || root;\n  root = root && root.querySelector(\"ha-panel-lovelace\")\n  root = root && root.shadowRoot;\n  root = root && root.querySelector(\"hui-root\")\n  if (root) {\n    var ll =  root.lovelace\n    ll.current_view = root.___curView;\n    return ll;\n  }\n\n  return null;\n}\n\nfunction lovelace_view() {\n  var root = document.querySelector(\"hc-main\");\n  if(root) {\n    root = root && root.shadowRoot;\n    root = root && root.querySelector(\"hc-lovelace\");\n    root = root && root.shadowRoot;\n    root = root && root.querySelector(\"hui-view\");\n    return root;\n  }\n\n  root = document.querySelector(\"home-assistant\");\n  root = root && root.shadowRoot;\n  root = root && root.querySelector(\"home-assistant-main\");\n  root = root && root.shadowRoot;\n  root = root && root.querySelector(\"app-drawer-layout partial-panel-resolver\");\n  root = root && root.shadowRoot || root;\n  root = root && root.querySelector(\"ha-panel-lovelace\");\n  root = root && root.shadowRoot;\n  root = root && root.querySelector(\"hui-root\");\n  root = root && root.shadowRoot;\n  root = root && root.querySelector(\"ha-app-layout #view\");\n  root = root && root.firstElementChild;\n  return root;\n}\n\nfunction load_lovelace() {\n  if(customElements.get(\"hui-view\")) return true;\n\n  const res = document.createElement(\"partial-panel-resolver\");\n  res.hass = hass();\n  if(!res.hass || !res.hass.panels)\n    return false;\n  res.route = {path: \"/lovelace/\"};\n  res._updateRoutes();\n  try {\n    document.querySelector(\"home-assistant\").appendChild(res);\n  } catch (error) {\n  } finally {\n    document.querySelector(\"home-assistant\").removeChild(res);\n  }\n  if(customElements.get(\"hui-view\")) return true;\n  return false;\n}\n\n\n//# sourceURL=webpack:///./node_modules/card-tools/src/hass.js?");

/***/ }),

/***/ "./node_modules/card-tools/src/lit-element.js":
/*!****************************************************!*\
  !*** ./node_modules/card-tools/src/lit-element.js ***!
  \****************************************************/
/*! exports provided: LitElement, html, css */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LitElement\", function() { return LitElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"html\", function() { return html; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"css\", function() { return css; });\nconst LitElement = customElements.get('home-assistant-main')\n  ? Object.getPrototypeOf(customElements.get('home-assistant-main'))\n  : Object.getPrototypeOf(customElements.get('hui-view'));\n\nconst html = LitElement.prototype.html;\n\nconst css = LitElement.prototype.css;\n\n\n//# sourceURL=webpack:///./node_modules/card-tools/src/lit-element.js?");

/***/ }),

/***/ "./node_modules/card-tools/src/lovelace-element.js":
/*!*********************************************************!*\
  !*** ./node_modules/card-tools/src/lovelace-element.js ***!
  \*********************************************************/
/*! exports provided: CUSTOM_TYPE_PREFIX, DOMAINS_HIDE_MORE_INFO, createCard, createElement, createEntityRow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CUSTOM_TYPE_PREFIX\", function() { return CUSTOM_TYPE_PREFIX; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DOMAINS_HIDE_MORE_INFO\", function() { return DOMAINS_HIDE_MORE_INFO; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createCard\", function() { return createCard; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createElement\", function() { return createElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createEntityRow\", function() { return createEntityRow; });\n/* harmony import */ var _event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./event.js */ \"./node_modules/card-tools/src/event.js\");\n\n\nconst CUSTOM_TYPE_PREFIX = \"custom:\";\n\nconst DOMAINS_HIDE_MORE_INFO = [\n  \"input_number\",\n  \"input_select\",\n  \"input_text\",\n  \"scene\",\n  \"weblink\",\n];\n\nfunction errorElement(error, origConfig) {\n  const el = document.createElement(\"hui-error-card\");\n  el.setConfig({\n    type: \"error\",\n    error,\n    origConfig,\n  });\n  return el;\n}\n\nfunction _createElement(tag, config) {\n  const el = document.createElement(tag);\n  try {\n    el.setConfig(config);\n  } catch (err) {\n    return errorElement(err, config);\n  }\n  return el;\n}\n\nfunction createLovelaceElement(thing, config) {\n  if(!config || typeof config !== \"object\" || !config.type)\n    return errorElement(`No ${thing} type configured`, config);\n\n  let tag = config.type;\n  if(tag.startsWith(CUSTOM_TYPE_PREFIX))\n    tag = tag.substr(CUSTOM_TYPE_PREFIX.length);\n  else\n    tag = `hui-${tag}-${thing}`;\n\n  if(customElements.get(tag))\n    return _createElement(tag, config);\n\n  const el = errorElement(`Custom element doesn't exist: ${tag}.`, config);\n  el.style.display = \"None\";\n\n  const timer = setTimeout(() => {\n    el.style.display = \"\";\n  }, 2000);\n\n  customElements.whenDefined(tag).then(() => {\n    clearTimeout(timer);\n    Object(_event_js__WEBPACK_IMPORTED_MODULE_0__[\"fireEvent\"])(\"ll-rebuild\", {}, el);\n  });\n\n  return el;\n}\n\nfunction createCard(config) {\n  return createLovelaceElement('card', config);\n}\nfunction createElement(config) {\n  return createLovelaceElement('element', config);\n}\nfunction createEntityRow(config) {\n  const SPECIAL_TYPES = new Set([\n    \"call-service\",\n    \"divider\",\n    \"section\",\n    \"weblink\",\n  ]);\n  const DEFAULT_ROWS = {\n    alert: \"toggle\",\n    automation: \"toggle\",\n    climate: \"climate\",\n    cover: \"cover\",\n    fan: \"toggle\",\n    group: \"group\",\n    input_boolean: \"toggle\",\n    input_number: \"input-number\",\n    input_select: \"input-select\",\n    input_text: \"input-text\",\n    light: \"toggle\",\n    lock: \"lock\",\n    media_player: \"media-player\",\n    remote: \"toggle\",\n    scene: \"scene\",\n    script: \"script\",\n    sensor: \"sensor\",\n    timer: \"timer\",\n    switch: \"toggle\",\n    vacuum: \"toggle\",\n    water_heater: \"climate\",\n    input_datetime: \"input-datetime\",\n  };\n\n  if(!config)\n    return errorElement(\"Invalid configuration given.\", config);\n  if(typeof config === \"string\")\n    config = {entity: config};\n  if(typeof config !== \"object\" || (!config.entity && !config.type))\n    return errorElement(\"Invalid configuration given.\", config);\n\n  const type = config.type || \"default\";\n  if(SPECIAL_TYPES.has(type) || type.startsWith(CUSTOM_TYPE_PREFIX))\n    return createLovelaceElement('row', config);\n\n  const domain = config.entity.split(\".\", 1)[0];\n  Object.assign(config, {type: DEFAULT_ROWS[domain] || \"text\"});\n\n  return createLovelaceElement('entity-row', config);\n}\n\n\n//# sourceURL=webpack:///./node_modules/card-tools/src/lovelace-element.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var card_tools_src_lit_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! card-tools/src/lit-element */ \"./node_modules/card-tools/src/lit-element.js\");\n/* harmony import */ var card_tools_src_hass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! card-tools/src/hass */ \"./node_modules/card-tools/src/hass.js\");\n/* harmony import */ var card_tools_src_lovelace_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! card-tools/src/lovelace-element */ \"./node_modules/card-tools/src/lovelace-element.js\");\n\n\n\n\nclass QCard extends card_tools_src_lit_element__WEBPACK_IMPORTED_MODULE_0__[\"LitElement\"] {\n\n  setConfig(config) {\n    this.name = config.card;\n    this.localname = `__local_${Object(card_tools_src_hass__WEBPACK_IMPORTED_MODULE_1__[\"lovelace\"])().current_view}_${config.card}`;\n    if(!window.qCards)\n      window.qCards = {};\n\n    const globals = Object(card_tools_src_hass__WEBPACK_IMPORTED_MODULE_1__[\"lovelace\"])().config.q_cards;\n    const locals = Object(card_tools_src_hass__WEBPACK_IMPORTED_MODULE_1__[\"lovelace\"])().config.views[Object(card_tools_src_hass__WEBPACK_IMPORTED_MODULE_1__[\"lovelace\"])().current_view].q_cards;\n\n    if(globals && globals[this.name] && !window.qCards[this.name]) {\n      this.buildCard(this.name, globals[this.name]);\n    }\n    if(locals && locals[this.name] && !window.qCards[this.localname]) {\n      this.buildCard(this.localname, locals[this.name]);\n    }\n\n    window.addEventListener(\"location-changed\", () => this.update());\n    this.update();\n  }\n\n  connectedCallback() {\n    this.update();\n  }\n\n  buildCard(name, config) {\n    const card = Object(card_tools_src_lovelace_element__WEBPACK_IMPORTED_MODULE_2__[\"createCard\"])(config);\n    card.addEventListener(\"ll-rebuild\", () => {\n      this.buildCard(name, config);\n      if(card.qcard) card.qcard.update();\n    });\n    window.qCards[name] = card;\n  }\n\n  update() {\n    window.setTimeout(() => {\n      if(!window.qCards || Object.keys(window.qCards).length === 0) return;\n      if(!this.shadowRoot.firstElementChild && this.offsetParent)\n        this.shadowRoot.appendChild(window.qCards[this.localname]\n          || window.qCards[this.name]);\n      if(this.shadowRoot.firstElementChild){\n        this.shadowRoot.firstElementChild.hass = this._hass;\n        this.shadowRoot.firstElementChild.qcard = this;\n      }\n    }, 1);\n  }\n\n  set hass(hass) {\n    this._hass = hass;\n    this.update();\n  }\n}\n\nif(!customElements.get(\"q-card\"))\n  customElements.define(\"q-card\", QCard);\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });