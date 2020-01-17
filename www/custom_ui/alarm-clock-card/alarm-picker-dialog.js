import {AlarmController, AlarmConfiguration} from './alarm-controller.js';

class AlarmPickerScheduleDialog extends Polymer.Element {

    static get template() {
      return Polymer.html`
        <style>
          dialog[open] {
            border: 1px solid var(--secondary-background-color);
            z-index: 99;
          }
          .alarm-picker-dialog {
            min-width: 350px;
            font-size: 14px;
            border-radius: 2px;
            padding: 0;
            border: none;
          }

          .alarm-picker-dialog-content, .alarm-picker-dialog-buttons {
            background: var(--paper-dialog-background-color, var(--primary-background-color));
            color: var(--paper-dialog-color, var(--primary-text-color));
            padding: 0 16px;
          }

          .workweek {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }

            paper-input {
                width: 3em;
            }

          .alarm-picker-dialog-buttons {
            display: flex;
            padding: 16px;
            justify-content: flex-end;
          }

          alarm-picker span {
              width: 7em;
              text-align: right;
          }

          app-toolbar {
            margin: 0;
            padding: 0 16px;
            color: var(--primary-text-color);
            background-color: var(--secondary-background-color);
          }
          app-toolbar [main-title] {
            margin-left: 16px;
          }

          #moreInfo {
            padding: 16px;
          }

          @media all and (max-width: 450px), all and (max-height: 500px) {
            .alarm-picker-dialog {
              max-height: 100%;
            }
            .alarm-picker-dialog::before {
              content: "";
              position: fixed;
              z-index: -1;
              top: 0px;
              left: 0px;
              right: 0px;
              bottom: 0px;
              background-color: inherit;
            }
            app-toolbar {
              color: var(--text-primary-color);
              background-color: var(--primary-color);
            }
          }
        </style>
          
        <dialog id="scheduledialog" class="alarm-picker-dialog">
            <app-toolbar>
                <paper-icon-button icon="hass:close" tabindex="0" on-click="close"></paper-icon-button>
                <div class="main-title" main-title="">Set your schedule</div>
                <paper-toggle-button
                    id="alarmEnabledToggleButton"
                    checked="{{alarmsEnabled}}"
                ></paper-toggle-button>
            </app-toolbar>
          <div class="alarm-picker-dialog-content">
            <div class="workweek">
                <alarm-picker id="alarmPickerMo" alarm="[[_getAlarmForDay('mo')]]" disabled="[[!alarmsEnabled]]"><span>[[_getDayOfWeek(0)]]: </span></alarm-picker>
                <alarm-picker id="alarmPickerTu" alarm="[[_getAlarmForDay('tu')]]" disabled="[[!alarmsEnabled]]"><span>[[_getDayOfWeek(1)]]: </span></alarm-picker>
                <alarm-picker id="alarmPickerWe" alarm="[[_getAlarmForDay('we')]]" disabled="[[!alarmsEnabled]]"><span>[[_getDayOfWeek(2)]]: </span></alarm-picker>
                <alarm-picker id="alarmPickerTh" alarm="[[_getAlarmForDay('th')]]" disabled="[[!alarmsEnabled]]"><span>[[_getDayOfWeek(3)]]: </span></alarm-picker>
                <alarm-picker id="alarmPickerFr" alarm="[[_getAlarmForDay('fr')]]" disabled="[[!alarmsEnabled]]"><span>[[_getDayOfWeek(4)]]: </span></alarm-picker>
                <alarm-picker id="alarmPickerSa" alarm="[[_getAlarmForDay('sa')]]" disabled="[[!alarmsEnabled]]"><span>[[_getDayOfWeek(5)]]: </span></alarm-picker>
                <alarm-picker id="alarmPickerSu" alarm="[[_getAlarmForDay('su')]]" disabled="[[!alarmsEnabled]]"><span>[[_getDayOfWeek(6)]]: </span></alarm-picker>
                <div id="moreInfo"></div>
            </div>
          </div>
          <div class="alarm-picker-dialog-buttons">
            <paper-button on-click="saveAndClose" raised>Save</paper-button>
          </div>
        </dialog>
      `;
    }

    static get properties() {
        return {
          alarmController: AlarmController,
          alarmsEnabled: {
            type: Boolean,
            observer: '_alarmsEnabledChanged'
          }
        }
      }

    ready() {
        super.ready();
        this.alarmsEnabled = this.alarmController.alarmClockConfiguration.alarmsEnabled;
        this._alarmsEnabledChanged();
    }

    _getDayOfWeek(days) {
      return moment('2018-08-27').add(days,'days').format('dddd');
    }

    _getAlarmForDay(day) {
      return this.alarmController.alarmClockConfiguration[day];
    }

    _alarmsEnabledChanged(newValue, oldValue) {
      if(this.alarmController.workdaySensorContainsSaturdayOrSunday()) {
        this.$.alarmPickerSa.disabled = true;
        this.$.alarmPickerSu.disabled = true;
        this.$.moreInfo.innerHTML = `
          Saturday and Sunday are disabled because of workday sensor.<br />
          Configure only holiday in workday sensor to make them available.`;
      }
    }

    saveAndClose() {
        let alarmClockConfiguration = Object.assign(new AlarmConfiguration, {
            ...this.alarmController.alarmClockConfiguration,
            alarmsEnabled: this.alarmsEnabled,
            mo: this.$.alarmPickerMo.value,
            tu: this.$.alarmPickerTu.value,
            we: this.$.alarmPickerWe.value,
            th: this.$.alarmPickerTh.value,
            fr: this.$.alarmPickerFr.value,
            sa: this.$.alarmPickerSa.value,
            su: this.$.alarmPickerSu.value,
        });
        alarmClockConfiguration.dismiss();
        this.alarmController.saveAlarmClockConfiguration(alarmClockConfiguration);
        this.close();
    }

    show() {
      this.alarmsEnabled = this.alarmController.alarmClockConfiguration.alarmsEnabled;
      this.$.alarmPickerMo.alarm = this._getAlarmForDay('mo'),
      this.$.alarmPickerTu.alarm = this._getAlarmForDay('tu'),
      this.$.alarmPickerWe.alarm = this._getAlarmForDay('we'),
      this.$.alarmPickerTh.alarm = this._getAlarmForDay('th'),
      this.$.alarmPickerFr.alarm = this._getAlarmForDay('fr'),
      this.$.alarmPickerSa.alarm = this._getAlarmForDay('sa'),
      this.$.alarmPickerSu.alarm = this._getAlarmForDay('su'),
      this.$.scheduledialog.show();
    }

    close() {
        this.$.scheduledialog.close();
    }
}

customElements.define('alarm-picker-schedule-dialog', AlarmPickerScheduleDialog);
