import {AlarmController} from './alarm-controller.js';

class AlarmSnoozeDialog extends Polymer.Element {

    static get template() {
      return Polymer.html`
        <style>
          dialog[open] {
            border: 1px solid var(--secondary-background-color);
            z-index: 99;
          }

          paper-progress {
              width: 100%;
          }

          .alarm-snooze-dialog {
            margin-top: 10vh;
            min-width: 350px;
            font-size: 14px;
            border-radius: 2px;
            padding: 0;
            border: none;
          }

          .alarm-snooze-dialog-content, .alarm-snooze-dialog-buttons {
            background: var(--paper-dialog-background-color, var(--primary-background-color));
            color: var(--paper-dialog-color, var(--primary-text-color));
            padding: 0 16px;
          }

            paper-input {
                width: 3em;
            }

          .alarm-snooze-dialog-buttons {
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
          @media all and (max-width: 450px), all and (max-height: 500px) {
            .alarm-snooze-dialog {
              max-height: 100%;
            }
            .alarm-snooze-dialog::before {
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
          
        <dialog id="snoozedialog" class="alarm-snooze-dialog">
            <app-toolbar>
                <paper-icon-button icon="hass:close" tabindex="0" on-click="close"></paper-icon-button>
                <div class="main-title" main-title="">Set your nap time</div>
            </app-toolbar>
            <paper-progress id="progressTimer" value="0"></paper-progress>
            <div class="alarm-snooze-dialog-content">
                <alarm-picker id="snoozeTimePicker" alarm="[[alarm]]" show-toggle-button="false"
                    on-picker-opened="_hideAndResetTimer"><span>Nap time: </span></alarm-picker>
            </div>
            <div class="alarm-snooze-dialog-buttons">
                <paper-button on-click="saveAndClose" raised>Save</paper-button>
            </div>
        </dialog>
      `;
    }

    static get properties() {
        return {
          alarmController: AlarmController,
          alarm: {
              type: Object,
              value: () => ({enabled: true, time: '01:30'})
          }
        }
      }

    saveAndClose() {
        this._resetTimer();
        this._setAlarm();
        this.close();
    }

    show() {
      this._showAndScheduleTimer();
      this.$.snoozedialog.show();
    }

    close() {
        this._resetTimer();
        this.$.snoozedialog.close();
    }

    _setAlarm() {
        let alarm = this.$.snoozeTimePicker.value;
        let alarmTime = moment().add(moment.duration(alarm.time));
        this.alarmController.nextAlarm = {
            ...alarm,
            time: alarmTime.format('HH:mm'),
            nap: true,
            overriden: true
        }
    }

    _showAndScheduleTimer() {
        this.$.progressTimer.style.display = 'block';
        this.timer = setInterval(() => this._updateTimerProgress(), 100);
    }

    _hideAndResetTimer() {
        this._resetTimer();
        this.$.progressTimer.style.display = 'none';
    }
    
    _updateTimerProgress() {
        this.$.progressTimer.value += 1;
        if(this.$.progressTimer.value == 100) {
            this._setAlarm();
            this.close();
            this._resetTimer();
        }
    }

    _resetTimer() {
        this.$.progressTimer.value = 0;
        clearInterval(this.timer);
    }

}

customElements.define('alarm-snooze-dialog', AlarmSnoozeDialog);
