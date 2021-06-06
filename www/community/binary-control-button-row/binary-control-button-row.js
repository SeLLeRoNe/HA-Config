window.customCards = window.customCards || [];
window.customCards.push({
  type: "binary-control-button-row",
  name: "binary control button row",
  description: "A plugin to display your binary entity controls in a button row.",
  preview: false,
});

class CustomBinaryRow extends Polymer.Element {

	static get template() {
		return Polymer.html`
		<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
		<style>
			:host {
				line-height: inherit;
			}
			.switch {
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
					class='switch'
					style='[[_leftColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
					toggles name='[[_leftName]]'
					on-click='setState'
					disabled='[[_leftState]]'>[[_leftText]]</button>
				<button
					class='switch'
					style='[[_rightColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
					toggles name='[[_rightName]]'
					on-click='setState'
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
			_width: String,
			_height: String,
			_leftColor: String,
			_leftText: String,
			_leftName: String,
			_leftState: Boolean,
			_rightColor: String,
			_rightText: String,
			_rightName: String,
			_rightState: Boolean,
	        }
    	}

	setConfig(config) {
		this._config = config;

		this._config = {
			customTheme: false,
			reverseButtons: false,
			width: '30px',
			height: '30px',
			isOnColor: '#43A047',
			isOffColor: '#f44c09',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			customOnText: 'ON',
			...config
		};
	}

	hassChanged(hass) {

		const config = this._config;
		const stateObj = hass.states[config.entity];
		const custTheme = config.customTheme;
		const revButtons = config.reverseButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const custOnClr = config.isOnColor;
		const custOffClr = config.isOffColor;
		const custInactiveClr = config.buttonInactiveColor;
		const custOffTxt = config.customOffText;
		const custOnTxt = config.customOnText;
			
		let state;
			if (stateObj) {
				state = stateObj.state;
			}
	
		let onstate;
		let offstate;
		
		if (stateObj) {
			if (stateObj.state == 'on') {
				onstate = 'on';
			} else {
				offstate = 'on';
			}
		}
	
		let oncolor;
		let offcolor;
			
		if (custTheme) {
			if (onstate == 'on') {
				oncolor = 'background-color:' + custOnClr;
			} else {
				oncolor = 'background-color:' + custInactiveClr;
			}

			if (offstate == 'on') {
				offcolor = 'background-color:'  + custOffClr;
			} else {
				offcolor = 'background-color:' + custInactiveClr;
			}
		} else {
			if (onstate == 'on') {
				oncolor = 'background-color: var(--primary-color)';
			} else {
				oncolor = 'background-color: var(--disabled-text-color)';
			}
	
			if (offstate == 'on') {
				offcolor = 'background-color: var(--primary-color)';
			} else {
				offcolor = 'background-color: var(--disabled-text-color)';
			}
		}
	
		let offtext = custOffTxt;
		let ontext = custOnTxt;
		
		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;
	
		let offname = 'off';
		let onname = 'on';
	
		if (revButtons) {
			this.setProperties({
				_stateObj: stateObj,
				_rightState: stateObj.state === 'on',
				_leftState: stateObj.state == 'off',
				_width: buttonwidth,
				_height: buttonheight,
				_rightName: onname,
				_leftName: offname,
				_rightColor: oncolor,
				_leftColor: offcolor,
				_rightText: ontext,
				_leftText: offtext,
			});
		} else {
			this.setProperties({
				_stateObj: stateObj,
				_leftState: stateObj.state === 'on',
				_rightState: stateObj.state == 'off',
				_width: buttonwidth,
				_height: buttonheight,
				_leftName: onname,
				_rightName: offname,
				_leftColor: oncolor,
				_rightColor: offcolor,
				_leftText: ontext,
				_rightText: offtext,	
			});
		}
    	}


	stopPropagation(e) {
		e.stopPropagation();
	}

	setState(e) {
		const state = e.currentTarget.getAttribute('name');
		if( state == 'off' ){
			this.hass.callService('homeassistant', 'turn_off', {entity_id: this._config.entity});
		} else {
			this.hass.callService('homeassistant', 'turn_on', {entity_id: this._config.entity});
		}
	}
}
	
customElements.define('binary-control-button-row', CustomBinaryRow);
