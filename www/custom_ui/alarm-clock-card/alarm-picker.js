class AlarmPicker extends Polymer.Element {

    static get template() {
      return Polymer.html`
        <style>
          .alarm {
            display:inline-flex;
            justify-content: space-between;
            align-items: center;
          }

          .alarm > #alarmTimeInput {
            margin: 0 15px;
            width: 3em;
          }
        </style>

        <div class="alarm">
            <template is="dom-if" if="[[showIcon]]">
                <paper-icon-button icon="[[_getAlarmPickerIcon(alarm)]]" on-click="openSchedule"></paper-icon-button>
            </template>
            <slot></slot>

            <paper-input 
                id="alarmTimeInput" 
                no-label-float
                pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]" 
                placeholder="00:00"
                maxlength="5" size="5"
                disabled=[[disabled]]
                >
            </paper-input>

            <paper-toggle-button
                id="alarmEnabledToggleButton"
                checked="[[alarm.enabled]]"
                on-change="toggleAlarmEnabled"
                disabled=[[disabled]]
            ></paper-toggle-button>
        </div>
      `;
    }

    static get properties() {
        return {
          showIcon: {
            type: Boolean,
            value: false
          },
          showToggleButton: {
            type: String, //why: edge case in Polymer (https://www.polymer-project.org/3.0/docs/devguide/properties#configuring-boolean-properties)
            value: 'true'
          },
          disabled: {
            type: Boolean,
            value: false
          },
          alarm: {
              type: Object,
              observer: '_alarmChanged'
          },
        }
      }

    ready() {
        super.ready();
        if(this.showToggleButton == 'false') {
            this.$.alarmEnabledToggleButton.style.display = 'none';
        }

        this.flatpickr = flatpickr(this.$.alarmTimeInput, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            disableMobile: true,
            defaultDate: this.alarm.time,
            onOpen: () => { this._onPickerOpened() },
            onClose: (selectedDates, timeStr, instance) => this._onTimeChanged(timeStr),
        });
    }

    _alarmChanged(newValue, oldValue) {
        if(!this.alarmPickerOpen && newValue) {
            this.$.alarmTimeInput.value = newValue.time;
            if(this.flatpickr && this.flatpickr.setDate) {
                this.flatpickr.setDate(newValue.time);
            }
        }
    }

    _getAlarmPickerIcon(alarm) {
        if(!alarm.enabled) {
            return 'mdi:alarm-off';
        } else if (alarm.snooze) {
            return 'mdi:alarm-snooze';
        } else if (alarm.holiday) {
            return 'mdi:cake';
        }
        return 'mdi:alarm';
    }

    _mustShowToggleButton() {
        return this.showToggleButton === 'true';
    }

    _onPickerOpened() {
        this.alarmPickerOpen = true;
        this.dispatchEvent(new CustomEvent('picker-opened'));
    }

    _onTimeChanged(timeStr) {
        let alarmTime = moment(timeStr, 'HH:mm:ss').format('HH:mm');
        this.alarm = {
            ...this.alarm,
            time: alarmTime,
            enabled: true
        }
        this.dispatchEvent(new CustomEvent('alarm-changed', {detail: {alarm: this.value}}));
        this.alarmPickerOpen = false;
    }

    toggleAlarmEnabled() {
        this.alarm = {
            ...this.alarm,
            enabled: this.$.alarmEnabledToggleButton.checked
        }
        this.dispatchEvent(new CustomEvent('alarm-changed', {detail: {alarm: this.alarm}}));
    }

    openSchedule() {
        this.dispatchEvent(new CustomEvent('alarm-button-clicked'));
    }

    get value() {
        return this.alarm;
    }

}

customElements.define('alarm-picker', AlarmPicker);  