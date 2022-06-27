window.customCards = window.customCards || [];
window.customCards.push({
  type: "light-brightness-preset-row",
  name: "light brightness preset row",
  description: "A plugin to display your light controls in a button row.",
  preview: false,
});

class CustomLightBrightnessRow extends Polymer.Element {

	static get template() {
		return Polymer.html`
			<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
			<style>
				:host {
					line-height: inherit;
				}
				.brightness {
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
								class='brightness'
								style='[[_leftColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
								toggles name="[[_leftName]]"
								on-click='setBrightness'
								disabled='[[_leftState]]'>[[_leftText]]</button>
							<button
								class='brightness'
								style='[[_midLeftColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
								toggles name="[[_midLeftName]]"
								on-click='setBrightness'
								disabled='[[_midLeftState]]'>[[_midLeftText]]</button>
							<button
								class='brightness'
								style='[[_midRightColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
								toggles name="[[_midRightName]]"
								on-click='setBrightness'
								disabled='[[_midRightState]]'>[[_midRightText]]</button>
							<button
								class='brightness'
								style='[[_rightColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
								toggles name="[[_rightName]]"
								on-click='setBrightness'
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
				_lowSP: Number,
				_medSP: Number,
				_highSP: Number,
				_width: String,
				_height: String,
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
			customSetpoints: false,
			reverseButtons: false,
			width: '30px',
			height: '30px',
			lowBrightness: 43,
			medBrightness: 128,
			hiBrightness: 213,
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
		const custSetpoint = config.customSetpoints;
		const revButtons = config.reverseButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const OnLowClr = config.isOnLowColor;
		const OnMedClr = config.isOnMedColor;
		const OnHiClr = config.isOnHiColor;
		const OffClr = config.isOffColor;
		const buttonOffClr = config.buttonInactiveColor;
		const LowSetpoint = config.lowBrightness;
		const MedSetpoint = config.medBrightness;
		const HiSetpoint = config.hiBrightness;
		const custOffTxt = config.customOffText;
		const custLowTxt = config.customLowText;
		const custMedTxt = config.customMedText;
		const custHiTxt = config.customHiText;
						
		
		let lowSetpoint;
		let medSetpoint;
		let hiSetpoint;
		let low;
		let med;
		let high;
		let offstate;
		
		if (custSetpoint) {
			medSetpoint = parseInt(MedSetpoint);
			if (parseInt(LowSetpoint) < 1) {
				lowSetpoint = 1;
			} else {
				lowSetpoint =  parseInt(LowSetpoint);
			}
			if (parseInt(HiSetpoint) > 254) {	
				hiSetpoint = 254;
			} else {
				hiSetpoint = parseInt(HiSetpoint);
			}
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.brightness >= 0 && stateObj.attributes.brightness <= ((medSetpoint + lowSetpoint)/2 ) ) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness > ((medSetpoint + lowSetpoint)/2 ) && stateObj.attributes.brightness <= ((hiSetpoint + medSetpoint)/2) ) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness > ((hiSetpoint + medSetpoint)/2) && stateObj.attributes.brightness <= 255) {
					high = 'on';
				} else {
					offstate = 'on';
				}	
			}
		} else {
			lowSetpoint =  parseInt(LowSetpoint);
			medSetpoint = parseInt(MedSetpoint);
			hiSetpoint = parseInt(HiSetpoint);
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.brightness >= 0 && stateObj.attributes.brightness <= 85) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness >= 86 && stateObj.attributes.brightness <= 170) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness >= 171 && stateObj.attributes.brightness <= 255) {
					high = 'on';
				} else {
					offstate = 'on';
				}
			}
		}
		
		let lowcolor;
		let medcolor;
		let hicolor;
		let offcolor;

				
		if (custTheme) {
			if (low == 'on') {
				lowcolor = 'background-color:' + OnLowClr;
			} else {
				lowcolor = 'background-color:' + buttonOffClr;
			}
			if (med == 'on') {
				medcolor = 'background-color:'  + OnMedClr;
			} else {
				medcolor = 'background-color:' + buttonOffClr;
			}
			if (high == 'on') {
				hicolor = 'background-color:'  + OnHiClr;
			} else {
				hicolor = 'background-color:' + buttonOffClr;
			}
			if (offstate == 'on') {
				offcolor = 'background-color:'  + OffClr;
			} else {
				offcolor = 'background-color:' + buttonOffClr;
			}
		} else {
			if (low == 'on') {
				lowcolor = 'background-color: var(--switch-checked-color)';
			} else {
				lowcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (med == 'on') {
				medcolor = 'background-color: var(--switch-checked-color)';
			} else {
				medcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (high == 'on') {
				hicolor = 'background-color: var(--switch-checked-color)';
			} else {
				hicolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (offstate == 'on') {
				offcolor = 'background-color: var(--switch-checked-color)';
			} else {
				offcolor = 'background-color: var(--switch-unchecked-color)';
			}
		}

		let offtext = custOffTxt;
		let lowtext = custLowTxt;
		let medtext = custMedTxt;
		let hitext = custHiTxt;	
		
		let offname = 'off'
		let lowname = 'low'
		let medname = 'medium'
		let hiname = 'high'
		
		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;
		
		if (revButtons) {
			this.setProperties({
				_stateObj: stateObj,
				_leftState: offstate == 'on',
				_midLeftState: low === 'on',
				_midRightState: med === 'on',
				_rightState: high === 'on',
				_width: buttonwidth,
				_height: buttonheight,
				_leftColor: offcolor,
				_midLeftColor: lowcolor,
				_midRightColor: medcolor,
				_rightColor: hicolor,
				_lowSP: lowSetpoint,
				_medSP: medSetpoint,
				_highSP: hiSetpoint,
				_leftText: offtext,
				_midLeftText: lowtext,
				_midRightText: medtext,
				_rightText: hitext,
				_leftName: offname,
				_midLeftName: lowname,
				_midRightName: medname,
				_rightName: hiname,

			});
		} else {
			this.setProperties({
				_stateObj: stateObj,
				_leftState: high == 'on',
				_midLeftState: med === 'on',
				_midRightState: low === 'on',
				_rightState: offstate === 'on',
				_width: buttonwidth,
				_height: buttonheight,
				_leftColor: hicolor,
				_midLeftColor: medcolor,
				_midRightColor: lowcolor,
				_rightColor: offcolor,
				_lowSP: lowSetpoint,
				_medSP: medSetpoint,
				_highSP: hiSetpoint,
				_leftText: hitext,
				_midLeftText: medtext,
				_midRightText: lowtext,
				_rightText: offtext,
				_leftName: hiname,
				_midLeftName: medname,
				_midRightName: lowname,
				_rightName: offname,
			});
		}
				
		
	}

	stopPropagation(e) {
		e.stopPropagation();
	}
	
	setBrightness(e) {
		const level = e.currentTarget.getAttribute('name');
		const param = {entity_id: this._config.entity};
		if( level == 'off' ){
			this.hass.callService('light', 'turn_off', param);
		} else if (level == 'low') {
			param.brightness = this._lowSP;
			this.hass.callService('light', 'turn_on', param);
		} else if (level == 'medium') {
			param.brightness = this._medSP;
			this.hass.callService('light', 'turn_on', param);
		} else if (level == 'high') {
			param.brightness = this._highSP;
			this.hass.callService('light', 'turn_on', param);
		}
	}
}
	
customElements.define('light-brightness-preset-row', CustomLightBrightnessRow);
