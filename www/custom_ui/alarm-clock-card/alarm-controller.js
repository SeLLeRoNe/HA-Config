export class AlarmController {

    constructor(config) {
        this.config = config;
        this._isAlarmRinging = false;
        this._mappingMediaPlayer = {'turn_on': 'media_play', 'turn_off': 'media_pause'};
        this._scripts = [];

    }

    set hass(hass) {
        this._hass = hass;
        this._alarmClockConfiguration = null;
        this._evaluate();
    }

    get alarmRingingEntity() {
        return this._hass.states[`input_boolean.${this.config.name}_ringing`];
    }

    get alarmClockVariableEntity() {
        return this._hass.states[`variable.${this.config.name}`];
    }

    get alarmClockConfiguration() {
        if(! this._alarmClockConfiguration) {
            this._alarmClockConfiguration = Object.assign(new AlarmConfiguration, this.alarmClockVariableEntity.attributes);
        }
        return this._alarmClockConfiguration;
    }

    saveAlarmClockConfiguration(configuration) {
        this._saveConfiguration(configuration);
    }

    isConfigCorrect() {
        return this.alarmClockVariableEntity
            && this.alarmRingingEntity;
    }

    snooze() {
        let alarmClockConfiguration = this.alarmClockConfiguration;
        alarmClockConfiguration.snooze(this.config.snooze_time);
        this._saveConfiguration(alarmClockConfiguration);
        if(this.config.actions) {
            this.config.actions
                .filter((action) => script.when == 'on_snooze')
                .forEach(action => this._runAction(action));
        }
        this._alarmRingingOff(); //must be at end
    }

    dismiss() {
        let alarmClockConfiguration = this.alarmClockConfiguration;
        alarmClockConfiguration.dismiss();
        this._saveConfiguration(alarmClockConfiguration);
        if(this.config.actions) {
            this.config.actions
                .filter((action) => action.when == 'on_dismiss')
                .forEach(action => this._runAction(action));
            this._scripts = [];
        }
        this._alarmRingingOff(); //must be at end
    }

    get nextAlarm() {
        let nextAlarm = this.alarmClockConfiguration.nextAlarm;

        if(!nextAlarm) {
            return {enabled: false};
        }

        if(nextAlarm.overriden) {
            return nextAlarm;
        }

        if(this._nextAlarmIsAHolidayAccordingToCalendar(nextAlarm) 
            || this._nextAlarmIsAHolidayAccordingToWorkdaySensor(nextAlarm)) {
            return {
                ...nextAlarm,
                enabled: false,
                holiday: true
            };
        }

        return nextAlarm;
    }

    _nextAlarmIsAHolidayAccordingToCalendar(nextAlarm) {
        if(this.config.holiday && this.config.holiday.calendars) {
            for(let calendar_entity_id of this.config.holiday.calendars) {
                if(this._hass.states[calendar_entity_id]) {
                    const startDate = moment(this._hass.states[calendar_entity_id].attributes.start_time, "YYYY-MM-DD HH:mm:ss");
                    const endDate = moment(this._hass.states[calendar_entity_id].attributes.end_time, "YYYY-MM-DD HH:mm:ss");
    
                    if(moment(`${nextAlarm.date} ${nextAlarm.time}`, 'YYYY-MM-DD HH:mm').isBetween(startDate, endDate, 'minutes', '[]')) {
                        return true;
                    }
                } else {
                    if(!this.warning_logged) {
                        console.warn(`Could not find calendar ${calendar_entity_id} in hass.states`);
                        this.warning_logged = true;
                    }
                    
                }
            }
        }
        return false;
    }

    _nextAlarmIsAHolidayAccordingToWorkdaySensor(nextAlarm) {
        let { workdaySensor, workdayTomorrowSensor } = this._getWorkdaySensors();
        if(workdaySensor && workdayTomorrowSensor) {
            let now = moment().format('HH:mm');
            if(now <= nextAlarm.time && workdaySensor.state == 'off') {
                return true;
            } else if(now >= nextAlarm.time && workdayTomorrowSensor.state == 'off') {
                return true;
            }
        }
        return false;
    }

    workdaySensorContainsSaturdayOrSunday() {
        let { workdaySensor } = this._getWorkdaySensors();
        if(workdaySensor) {
            if(workdaySensor.attributes.excludes.includes('sat') || workdaySensor.attributes.excludes.includes('sun')) {
                return true;
            }
        }
        return false;
    }

    _getWorkdaySensors() {
        if(this.config.holiday && this.config.holiday.workday_sensor && this.config.holiday.workday_sensor_tomorrow) {
            return { workdaySensor: this._hass.states[this.config.holiday.workday_sensor], workdayTomorrowSensor: this._hass.states[this.config.holiday.workday_sensor_tomorrow] };
        }
        return { workdaySensor: null, workdayTomorrowSensor: null} ;
    }

    set nextAlarm(nextAlarm) {
        let alarmClockConfiguration = this.alarmClockConfiguration;
        alarmClockConfiguration.nextAlarm = {
            ...AlarmConfiguration.createNextAlarm(nextAlarm),
            overriden: true
        };
        this._saveConfiguration(alarmClockConfiguration);
    }

    get isAlarmEnabled() {
        let nextAlarm = this.nextAlarm;

        if(nextAlarm.overriden && nextAlarm.enabled) {
            return true;
        }
        return this.alarmClockConfiguration.alarmsEnabled && nextAlarm.enabled;
    }

    isAlarmRinging() {
        return this._isAlarmRinging;
    }

    _evaluate() {
        if(!this.alarmClockConfiguration.alarmsEnabled) {
            return;
        }

        let nextAlarm = this.nextAlarm;
        if(! nextAlarm.enabled) {
            return;
        }
        
        if(!this.isAlarmRinging() && moment().format('HH:mm') == nextAlarm.time) {
            this._alarmRingingOn();
        } else if(this.isAlarmRinging()) {
            if(moment(nextAlarm.time, "HH:mm").add(moment.duration(this.config.auto_disable)).format('HH:mm') == moment().format('HH:mm')) {
                this.dismiss();
            }
        } else if(!nextAlarm.snooze && !nextAlarm.nap && this.config.actions) {
            this.config.actions
                .filter(action => action.when !== 'on_snooze' && action.when !== 'on_dismiss' && !this._scripts[`${action.entity}-${action.when}`])
                .filter(action => moment(nextAlarm.time, "HH:mm").add(moment.duration(action.when)).format('HH:mm') == moment().format('HH:mm'))
                .forEach(action => this._runAction(action));
        }
    }

    _runAction(action) {
        let tempAction = {
            service: 'homeassistant.turn_on',
            ...action
        }
        let actualService = tempAction.service.split('.');
        this._hass.callService(actualService[0], actualService[1], {"entity_id": tempAction.entity});
        this._scripts[`${tempAction.entity}-${tempAction.when}`] = true;
    }

    _alarmRingingOn() {
        this._isAlarmRinging = true;
        this._callAlarmRingingService('turn_on');
    }

    _alarmRingingOff() {
        this._isAlarmRinging = false;
        this._callAlarmRingingService('turn_off');
    }

    _callAlarmRingingService(action) {
        if(this.config.alarm_entities) {
            for(let alarm_entity of this.config.alarm_entities) {
                if(alarm_entity.entity_id.startsWith('media_player')) {
                    this._hass.callService('media_player', this._mappingMediaPlayer[action], {"entity_id": alarm_entity.entity_id});
                } else {
                    this._hass.callService('homeassistant', action, {"entity_id": alarm_entity.entity_id});
                }
            }
        }
    }

    _saveConfiguration(configuration) {
        let actualConfiguration = configuration;
        if(! (configuration instanceof AlarmConfiguration)) {
            actualConfiguration = Object.assign(new AlarmConfiguration, configuration);
        }

        //reset next alarm after being disabled and now being re-enabled
        if(actualConfiguration.alarmsEnabled && this.alarmClockConfiguration.alarmsEnabled == false) {
            actualConfiguration.dismiss();
        }

        let configurationWithLastUpdated = {
            ...actualConfiguration,
            lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const param = {
            variable: "alarm_clock",
            attributes: configurationWithLastUpdated,
            replace_attributes: true
        };
        this._hass.callService('variable', 'set_variable', param);
        this._alarmClockConfiguration = Object.assign(new AlarmConfiguration, configurationWithLastUpdated);
    }
}

export class AlarmConfiguration {
    
    constructor() {
        this.alarmsEnabled = false;
        this.nextAlarm = {enabled: false, time: "08:00"};
        this.mo = {enabled: false, time: "07:00"}
        this.tu = {enabled: false, time: "07:00"}
        this.we = {enabled: false, time: "07:00"}
        this.th = {enabled: false, time: "07:00"}
        this.fr = {enabled: false, time: "07:00"}
        this.sa = {enabled: false, time: "09:00"}
        this.su = {enabled: false, time: "09:00"}
    }

    snooze(snoozeTime) {
        let nextAlarmTime = moment(this.nextAlarm.time, 'HH:mm').add(moment.duration(snoozeTime));
        this.nextAlarm = {
            ...this.nextAlarm,
            enabled: true,
            snooze: true,
            time: nextAlarmTime.format('HH:mm'),
            dateTime: nextAlarmTime.format('YYYY-MM-DD HH:mm')
        }
    }

    dismiss() {
        const momentTomorrow = moment().add(1, 'days');
        const alarmTomorrow = this[momentTomorrow.format('dd').toLowerCase()];
        this.nextAlarm = AlarmConfiguration.createNextAlarm(alarmTomorrow);
    }

    static createNextAlarm(alarm) {
        let now = moment();
        if(alarm.time <= now.format('HH:mm')) {
            now.add(1, 'days');
        }
        return {
            ...alarm,
            date: now.format('YYYY-MM-DD'),
            dateTime: `${now.format('YYYY-MM-DD')} ${alarm.time}`,
        }
    }
}