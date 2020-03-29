class CustomLightBrightnessRow extends Polymer.Element {

	static get template() {
		return Polymer.html`
			<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
			<style>
				:host {
					line-height: inherit;
				}
				.brightness {
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
				}
				
				</style>
					<hui-generic-entity-row hass="[[hass]]" config="[[_config]]">
						<div class='horizontal justified layout' on-click="stopPropagation">
						<button
							class='brightness'
							style='[[_lowOnColor]]'
							toggles name="low"
							on-click='setBrightness'
							disabled='[[_isOnLow]]'>LOW</button>
						<button
							class='brightness'
							style='[[_medOnColor]]'
							toggles name="medium"
							on-click='setBrightness'
							disabled='[[_isOnMed]]'>MED</button>
						<button
							class='brightness'
							style='[[_highOnColor]]'
							toggles name="high"
							on-click='setBrightness'
							disabled='[[_isOnHigh]]'>HIGH</button>
						<button
							class='brightness'
							style='[[_offColor]]'
							toggles name="off"
							on-click='setBrightness'
							disabled='[[_isOffState]]'>OFF</button>
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
				_lowOnColor: String,
				_medOnColor: String,
				_highOnColor: String,
				_offColor: String,
				_isOffState: Boolean,
				_isOnState: Boolean,
				_isOnLow: Boolean,
				_isOnMed: Boolean,
				_isOnHigh: Boolean,
				_lowSP: Number,
				_medSP: Number,
				_highSP: Number,
		}
	}

	setConfig(config) {
		this._config = config;
		
		this._config = {
			customTheme: false,
			customSetpoints: false,
			LowBrightness: 43,
			MedBrightness: 128,
			HiBrightness: 213,
			IsOffColor: '#f44c09',
			IsOnLowColor: '#43A047',
			IsOnMedColor: '#43A047',
			IsOnHiColor: '#43A047',
			ButtonInactiveColor: '#759aaa',
			...config
		};
	}

	hassChanged(hass) {

		const config = this._config;
		const stateObj = hass.states[config.entity];
		const custTheme = config.customTheme;
		const custSetpoint = config.customSetpoints;
		const OnLowClr = config.IsOnLowColor;
		const OnMedClr = config.IsOnMedColor;
		const OnHiClr = config.IsOnHiColor;
		const OffClr = config.IsOffColor;
		const buttonOffClr = config.ButtonInactiveColor;
		const LowSetpoint = config.LowBrightness;
		const MedSetpoint = config.MedBrightness;
		const HiSetpoint = config.HiBrightness;
						
		
		let lowSetpoint;
		let medSetpoint;
		let hiSetpoint;
		let low;
		let med;
		let high;
		let offstate;
		
		if (custSetpoint) {
			//lowSetpoint =  parseInt(LowSetpoint);
			medSetpoint = parseInt(MedSetpoint);
			//hiSetpoint = parseInt(HiSetpoint);
			if (parseInt(LowSetpoint) < 1) {
				lowSetpoint = 1;
			} else {
				lowSetpoint =  parseInt(LowSetpoint);
			}
			//if (parseInt(MedSetpoint) < 86) {
			//	medSetpoint = 86;
			//} else if (parseInt(MedSetpoint) > 170) {
			//	medSetpoint = 170;
			//} else {
			//	medSetpoint = parseInt(MedSetpoint);
			//}
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
	
			
		this.setProperties({
			_stateObj: stateObj,
			_isOffState: stateObj.state == 'off',
			_isOnLow: low === 'on',
			_isOnMed: med === 'on',
			_isOnHigh: high === 'on',
			_lowOnColor: lowcolor,
			_medOnColor: medcolor,
			_highOnColor: hicolor,
			_offColor: offcolor,
			_lowSP: lowSetpoint,
			_medSP: medSetpoint,
			_highSP: hiSetpoint,
		});
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
