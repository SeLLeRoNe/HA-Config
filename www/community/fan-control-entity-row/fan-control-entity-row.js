class CustomFanRow extends Polymer.Element {

	static get template() {
		return Polymer.html`
			<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
			<style>
				:host {
					line-height: inherit;
				}
				.speed {
					min-width: 30px;
					max-width: 30px;
					height: 30px;
					margin-left: 2px;
					margin-right: 2px;
					background-color: #759aaa;
					border: 1px solid lightgrey; 
					border-radius: 4px;
					font-size: 10px !important;
					color: inherit;
					text-align: center;
					float: right !important;
					padding: 1px;
					cursor: pointer;
				}
			</style>
			<hui-generic-entity-row hass="[[hass]]" config="[[_config]]">
				<div class='horizontal justified layout' on-click="stopPropagation">
					<button
						class='speed'
						style='[[_leftColor]]'
						toggles name="[[_leftName]]"
						on-click='setSpeed'
						disabled='[[_leftState]]'>[[_leftText]]</button>
					<button
						class='speed'
						style='[[_midLeftColor]];[[_hideMidLeft]]'
						toggles name="[[_midLeftName]]"
						on-click='setSpeed'
						disabled='[[_midLeftState]]'>[[_midLeftText]]</button>
					<button
						class='speed'
						style='[[_midRightColor]];[[_hideMidRight]]'
						toggles name="[[_midRightName]]"
						on-click='setSpeed'
						disabled='[[_midRightState]]'>[[_midRightText]]</button>
					<button
						class='speed'
						style='[[_rightColor]]'
						toggles name="[[_rightName]]"
						on-click='setSpeed'
						disabled='[[_rightState]]'>[[_rightText]]</button>
				</div>
			</hui-generic-entity-row>
        `;
    }

	static get properties() {
		return {
			hass: {
				type: Object,
				observer: 'hassChanged'
			},
			_config: Object,
			_stateObj: Object,
			_leftColor: String,
			_midLeftColor: String,
			_midRightColor: String,
			_rightColor: String,
			_leftText: String,
			_midLeftText: String,
			_midRightText: String,
			_rightText: String,
			_leftName: String,
			_midLeftName: String,
			_midRightName: String,
			_rightName: String,
			_hideMidLeft: String,
			_hideMidRight: String,
			_leftState: Boolean,
			_midLeftState: Boolean,
			_midRightState: Boolean,
			_rightState: Boolean,

		}
	}

	setConfig(config) {
		this._config = config;
		
		this._config = {
			customTheme: false,
			sendStateWithSpeed: false,
			reverseButtons: false,
			isTwoSpeedFan: false,
			isOffColor: '#f44c09',
			isOnLowColor: '#43A047',
			isOnMedColor: '#43A047',
			isOnHiColor: '#43A047',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			customLowText: 'LOW',
			customMedText: 'MED',
			customHiText: 'HIGH',
			...config
			};
	}

	hassChanged(hass) {

		const config = this._config;
		const stateObj = hass.states[config.entity];
		const custTheme = config.customTheme;
		const sendStateWithSpeed = config.sendStateWithSpeed;
		const revButtons = config.reverseButtons;
		const twoSpdFan = config.isTwoSpeedFan;
		const custOnLowClr = config.isOnLowColor;
		const custOnMedClr = config.isOnMedColor;
		const custOnHiClr = config.isOnHiColor;
		const custOffSpdClr = config.buttonInactiveColor;
		const custOffClr = config.isOffColor;
		const custOffTxt = config.customOffText;
		const custLowTxt = config.customLowText;
		const custMedTxt = config.customMedText;
		const custHiTxt = config.customHiText;
		
		let speed;
			if (stateObj && stateObj.attributes) {
				speed = stateObj.attributes.speed || 'off';
			}
		
		let low;
		let med;
		let high;
		let offstate;
		
		if (stateObj && stateObj.attributes) {
			if (stateObj.state == 'on' && stateObj.attributes.speed == 'low') {
				low = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.speed == 'medium') {
				med = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.speed == 'high') {
				high = 'on';
			} else {
				offstate = 'on';
			}
		}
		
		let lowcolor;
		let medcolor;
		let hicolor;
		let offcolor;
				
		if (custTheme) {
			if (low == 'on') {
				lowcolor = 'background-color:' + custOnLowClr;
			} else {
				lowcolor = 'background-color:' + custOffSpdClr;
			}

			if (med == 'on') {
				medcolor = 'background-color:'  + custOnMedClr;
			} else {
				medcolor = 'background-color:' + custOffSpdClr;
			}
			
			if (high == 'on') {
				hicolor = 'background-color:'  + custOnHiClr;
			} else {
				hicolor = 'background-color:' + custOffSpdClr;
			}
		
			if (offstate == 'on') {
				offcolor = 'background-color:'  + custOffClr;
			} else {
				offcolor = 'background-color:' + custOffSpdClr;
			}

		} else {

			if (low == 'on') {
				lowcolor = 'background-color: var(--primary-color)';
			} else {
				lowcolor = 'background-color: var(--disabled-text-color)';
			}
		
			if (med == 'on') {
				medcolor = 'background-color: var(--primary-color)';
			} else {
				medcolor = 'background-color: var(--disabled-text-color)';
			}
		
			if (high == 'on') {
				hicolor = 'background-color: var(--primary-color)';
			} else {
				hicolor = 'background-color: var(--disabled-text-color)';
			}
		
			if (offstate == 'on') {
				offcolor = 'background-color: var(--primary-color)';
			} else {
				offcolor = 'background-color: var(--disabled-text-color)';
			}
		}
	
		let offtext = custOffTxt;
		let lowtext = custLowTxt;
		let medtext = custMedTxt;
		let hitext = custHiTxt;
		
		let hiname = 'high';
		let medname = 'medium';
		let lowname = 'low';
		let offname = 'off';
		
		let hidemedium = 'display:block';
		let nohide = 'display:block';
		
		if (twoSpdFan) {
			hidemedium = 'display:none';
		} else {
			hidemedium = 'display:block';
		}
		
			
		if (revButtons) {
			this.setProperties({
				_stateObj: stateObj,
				_leftState: offstate == 'on',
				_midLeftState: low == 'on',
				_midRightState: med == 'on',
				_rightState: high == 'on',
				_leftColor: offcolor,
				_midLeftColor: lowcolor,
				_midRightColor: medcolor,
				_rightColor: hicolor,
				_leftText: offtext,
				_midLeftText: lowtext,
				_midRightText: medtext,
				_rightText: hitext,
				_leftName: offname,
				_midLeftName: lowname,
				_midRightName: medname,
				_rightName: hiname,
				_hideMidLeft: nohide,
				_hideMidRight: hidemedium,
			});
		} else {
			this.setProperties({
				_stateObj: stateObj,
				_leftState: high == 'on',
				_midLeftState: med == 'on',
				_midRightState: low == 'on',
				_rightState: offstate == 'on',
				_leftColor: hicolor,
				_midLeftColor: medcolor,
				_midRightColor: lowcolor,
				_rightColor: offcolor,
				_leftText: hitext,
				_midLeftText: medtext,
				_midRightText: lowtext,
				_rightText: offtext,
				_leftName: hiname,
				_midLeftName: medname,
				_midRightName: lowname,
				_rightName: offname,
				_hideMidRight: nohide,
				_hideMidLeft: hidemedium,
			});
		}
    }

	stopPropagation(e) {
		e.stopPropagation();
	}

	setSpeed(e) {
		const speed = e.currentTarget.getAttribute('name');
		if( speed == 'off' ){
			this.hass.callService('fan', 'turn_off', {entity_id: this._config.entity});
			this.hass.callService('fan', 'set_speed', {entity_id: this._config.entity, speed: speed});
		} else {
			if(this._config.sendStateWithSpeed){
			this.hass.callService('fan', 'turn_on', {entity_id: this._config.entity});
			}
			this.hass.callService('fan', 'set_speed', {entity_id: this._config.entity, speed: speed});
		}
	}
}
	
customElements.define('fan-control-entity-row', CustomFanRow);
