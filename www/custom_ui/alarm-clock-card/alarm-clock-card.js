import { AlarmController } from './alarm-controller.js';
import './alarm-picker.js';
import './alarm-picker-dialog.js';
import './alarm-snooze-dialog.js';

class AlarmClockCard extends Polymer.Element {

  static get template() {
    return Polymer.html`
    <style>
          body {
              overflow:hidden;
          }
          .alarm-clock {
            padding: 20px;
            height: 65vh;
            box-sizing: border-box;
            display:flex;
            flex-direction: column;
            justify-content: space-between;
          }

          #clock {
            font-size: 50vh;
          }

          #alarm-top {
            font-size: 20px;
            display: flex;
            justify-content: space-between;
            height: 20px;
          }

          .options {
            font-size: 20px;
            display: flex;
            justify-content: space-between;
          }

          .options > * {
            flex: 1 1 auto;
          }

          .sleepTime {
            text-align: center;
          }

          .optionButtons {
            text-align: right;
          }

          #alarmButtons, #extraInfo {
            display: flex;
            justify-content: space-between;
            height: 35vh;
            box-sizing: border-box;
          }

          #alarmButtons > *, #extraInfo > * {
            flex: 1 1 0;
          }
        </style>
      <ha-card>
        <div>  
          <alarm-picker-schedule-dialog
            id="alarmPickerScheduleDialog"
            alarm-controller=[[_alarmController]]
            ></alarm-picker-schedule-dialog>

          <alarm-snooze-dialog
            id="alarmSnoozeDialog"
            alarm-controller=[[_alarmController]]
            ></alarm-snooze-dialog>
          <div id="alarmclock" class="alarm-clock">
            <div id="alarm-top" class="meta">
              <div id="date">
              </div>
    
              <template is="dom-if" if="[[_alarmsEnabled]]">
                <alarm-picker id="alarmpicker" show-icon="true" alarm="[[nextAlarm]]" 
                              on-alarm-button-clicked="_showAlarmScheduleDialog"
                              on-alarm-changed="_onAlarmChanged"></alarm-picker>
              </template>
              <template is="dom-if" if="[[!_alarmsEnabled]]">
                <paper-icon-button id="alarmpickerButton" icon="mdi:alarm" 
                                    on-click="_showAlarmScheduleDialog"></paper-icon-button>
              </template>
            </div>
            <div id="clock" class="clock" on-click="_toggleAlarmFullScreen">HH:mm</div>
            <div class="options">
              <div></div>
              <div id="sleepTime" class="sleepTime"></div>
              <div class="optionButtons">
                <paper-icon-button id="alarmSnoozeButton" icon="mdi:sleep" 
                  on-click="_showAlarmSnoozeDialog"></paper-icon-button>
              </div>
            </div>
            
          </div>
        </div>
      </ha-card>

      <div id="extraInfo">
          <div style="text-align: center;">Your cards will display here shortly...</div>
      </div>
      <div id="alarmButtons">
        <alarm-snooze-button-card alarm-controller=[[_alarmController]]></alarm-snooze-button-card>
        <alarm-dismiss-button-card alarm-controller=[[_alarmController]]></alarm-dismiss-button-card>
      </div>
    `
  }

  static get properties() {
    return {
      _hass: Object,
      nextAlarm: {
        type: Object,
        computed: 'getNextAlarm(_hass)'
      },
      _alarmsEnabled: {
        type: Boolean,
        computed: '_areAlarmsEnabled(_hass)'
      }
    }
  }

  ready() {
    super.ready();
    this.clock = this.$.clock;
    this.date = this.$.date;
    this.$.alarmButtons.style.display = 'none';

    this._updateTime();
    setInterval(() => this._updateTime(), 500);
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Card config incorrect.');
    }

    if(config.name && config.name.indexOf('alarm_clock') < 0) {
      throw new Error('Alarm Clock name should start with alarm_clock');
    }

    if(!config.cards || !Array.isArray(config.cards)) {
      throw new Error('Card config is missing cards.');
    }

    this.config = {
      name: 'alarm_clock',
      time_format: 'HH:mm',
      snooze_time: '00:10',
      auto_disable: '00:30',
      ...config
    };
    this._alarmController = new AlarmController(this.config);

    if (this.$) {
      this._buildConfig();
    } else {
      console.log('error....')
    }
  }

  set hass(hass) {
    this._hass = hass;
    this._alarmController.hass = hass;
    moment.locale(hass.language);

    this._updateAlarmFooter(hass);
  }

  _updateTime(force = false) {
    let time = moment().format(this.config.time_format);
    let isAlarmRinging = this._alarmController.isAlarmRinging();

    if (this.clock && 
          (force 
            || this._time !== time 
            || this._ringing !== isAlarmRinging 
            || this._alarmClockConfigurationLastUpdate !== this._alarmController.alarmClockConfiguration.lastUpdated)) {

      this._time = time;
      this._ringing = isAlarmRinging;
      this._alarmClockConfigurationLastUpdate = this._alarmController.alarmClockConfiguration.lastUpdated;
      this.clock.innerHTML = `
        <div class="clock-display" style="text-align: center;">
          ${time}
        </div>
      `;
      this.date.innerHTML = moment().format('ddd DD/MM/YYYY');
      if (this._alarmController.isAlarmRinging()) {
        this.$.sleepTime.innerHTML = `Time to rise and shine!`;
      } else if (this._alarmController.isAlarmEnabled) {
        this.$.sleepTime.innerHTML = `${moment(this._alarmController.nextAlarm.dateTime).toNow(true)} more of wonderful sleep...`;
      } else {
        this.$.sleepTime.innerHTML = `Sleep is the best meditation...`;
      }
    }
  }

  _toggleAlarmFullScreen() {
    if(this.$.alarmclock.style.height == '100vh') {
      this.$.alarmButtons.style.display = 'none';
      this.$.alarmclock.style.height = '65vh';
      this.$.extraInfo.style.display = 'flex';
    } else {
      this.$.alarmButtons.style.display = 'none';
      this.$.extraInfo.style.display = 'none';
      this.$.alarmclock.style.height = '100vh';
    }
  }

  _updateAlarmFooter(hass) {
    if (this.$) {
      if (this._alarmController.isAlarmRinging()) {
        this.$.alarmclock.style.height = '65vh';
        this.$.alarmButtons.style.display = 'flex';
        this.$.extraInfo.style.display = 'none';
      } else if (!this._alarmController.isAlarmRinging()) {
        this.$.alarmButtons.style.display = 'none';
        this.$.extraInfo.style.display = 'flex';
      }
    }
    this._updateChildCards(hass);
  }

  _updateChildCards(hass) {
    if(this.$) {
      if(! this._elements) {
        this._buildConfig();
      }
      this._elements.forEach((element) => {
        element.hass = hass;
      });
    }
  }

  _buildConfig() {
    const config = this.config;
    this._elements = [];
    const root = this.$.extraInfo;

    while (root.lastChild) {
      root.removeChild(root.lastChild);
    }

    const elements = [];
    config.cards.forEach((card) => {
      const element = this._createCardElement(card);
      elements.push(element);
      root.appendChild(element);
      HeightUpdater.updateHeight(card, element);
    });
    this._elements = elements;
  }

  _createCardElement(card) {
    let element;
    if (card.type.startsWith("custom:")) {
      element = document.createElement(`${card.type.substr("custom:".length)}`);
    } else {
      element = document.createElement(`hui-${card.type}-card`);
    }
    try {
      element.setConfig(card);
      if (this._hass)
        element.hass = this._hass;
    } catch (exc) {
      console.warn(`Could not set config on card ${card.type}`);
    }
    return element;
  }

  getNextAlarm() {
    return this._alarmController.nextAlarm;
  }

  _areAlarmsEnabled() {
    return this._alarmController.alarmClockConfiguration.alarmsEnabled || this._alarmController.nextAlarm.nap == true;
  }

  _showAlarmScheduleDialog() {
    this.$.alarmPickerScheduleDialog.show();
  }

  _showAlarmSnoozeDialog() {
    this.$.alarmSnoozeDialog.show();
  }

  _onAlarmChanged(event) {
    this._alarmController.nextAlarm = event.detail.alarm;
  }

  getCardSize() {
    return 3;
  }
}

class AlarmButtonCard extends Polymer.Element {
  static get template() {
    return Polymer.html`
    <style>
          ha-card {
            display: flex;
            justify-content: center;
            height: 100%;
          }

          ha-card paper-button {
            font-size: 50px;
            width: 100%;
          }
        </style>
      <ha-card>
      <paper-button on-click="handleClick">[[buttonText]]</paper-button>
      </ha-card>
    `
  }

  static get properties() {
    return {
      buttonText: {
        type: String,
        value: 'button'
      }
    }
  }

  ready() {
    super.ready();
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
  }
}

class AlarmSnoozeButtonCard extends AlarmButtonCard {

  static get properties() {
    return {
      alarmController: AlarmController,
      buttonText: {
        type: String,
        value: 'Snooze'
      }
    }
  }

  handleClick() {
    this.alarmController.snooze();
  }
}

class AlarmDismissButtonCard extends AlarmButtonCard {
  static get properties() {
    return {
      alarmController: AlarmController,
      buttonText: {
        type: String,
        value: 'Dismiss'
      }
    }
  }

  handleClick() {
    this.alarmController.dismiss();
  }
}

class HeightUpdater {

  static updateHeight(card, element) {
    if(this._updateHeightOnNormalCard(card, element)) return;
    if(this._updateHeightOnNestedCards(card, element)) return;
    if(this._updateHeightOnMediaControlCards(card, element)) return;
  }

  static _updateHeightOnNormalCard(card, element) {
    if (element.shadowRoot) {
      let cardTag = element.shadowRoot.querySelector('ha-card');
      if (cardTag) {
        cardTag.style.height = "100%";
        cardTag.style.boxSizing = "border-box";
        return true;
      }
    }
    return false;
  }

  static _updateHeightOnNestedCards(card, element) {
    if (element.firstChild && element.firstChild.shadowRoot) {
      let cardTag = element.firstChild.shadowRoot.querySelector('ha-card');
      if (cardTag) {
        cardTag.style.height = "100%";
        cardTag.style.boxSizing = "border-box";
        return true;
      }
    }
    return false;
  }

  static _updateHeightOnMediaControlCards(card, element) {
    if(card.type != 'media-control') {
      return;
    }
    if (element.firstChild && element.firstChild.shadowRoot) {
      element.firstChild.style.height = '100%';
      let bannerTag = element.firstChild.shadowRoot.querySelector('div.banner');
      if (bannerTag) {
        bannerTag.style.boxSizing = "border-box";
        bannerTag.style.height = "calc(100% - 72px)";
        return true;
      }
    }
    return false;
  }

}

customElements.define('alarm-clock-card', AlarmClockCard);
customElements.define('alarm-snooze-button-card', AlarmSnoozeButtonCard);
customElements.define('alarm-dismiss-button-card', AlarmDismissButtonCard);