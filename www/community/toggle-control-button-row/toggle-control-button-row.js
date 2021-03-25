class CustomToggleRow extends Polymer.Element {

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
					style='[[_buttonColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]]'
					toggles name='[[_buttonName]]'
					on-click='setState'>
						[[_buttonText]]
				</button>
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
			_buttonColor: String,
			_buttonText: String,
			_buttonName: String,
			_buttonState: Boolean,
	        }
    	}

	setConfig(config) {
		this._config = config;

		this._config = {
			customTheme: false,
			width: '30px',
			height: '30px',
			isOnColor: '#43A047',
			isOffColor: '#f44c09',
			customOffText: 'OFF',
			customOnText: 'ON',
			...config
		};
	}

	hassChanged(hass) {

		const config = this._config;
		const stateObj = hass.states[config.entity];
		const custTheme = config.customTheme;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const custOnClr = config.isOnColor;
		const custOffClr = config.isOffColor;
		const custOffTxt = config.customOffText;
		const custOnTxt = config.customOnText;
	
		
		let state;
			if (stateObj) {
				state = stateObj.state;
			}
	
		let color;
			
		if (state == 'on' || state == 'off') {
			if (custTheme) {
				if (state == 'on') {
					color = 'background-color:' + custOnClr;
				} else {
					color = 'background-color:' + custOffClr;
				}
			} else {
				if (state == 'on') {
					color = 'background-color: var(--primary-color)';
				} else {
					color = 'background-color: var(--disabled-text-color)';
				}
			}
		} else {
			color = '#cfccc6';
		}
	
		let offtext = custOffTxt;
		let ontext = custOnTxt;
		let unavailtext = 'N/A';
		
		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;
	
		let offname = 'off';
		let onname = 'on';
		let unavailname = 'unavailable';
	
		if (state == 'off') {
			this.setProperties({
			_stateObj: stateObj,
			_buttonState: state,
			_buttonName: onname,
			_width: buttonwidth,
			_height: buttonheight,
			_buttonColor: color,
			_buttonText: offtext,
			});
		} else if (state == 'on') {
			this.setProperties({
			_stateObj: stateObj,
			_buttonState: state,
			_width: buttonwidth,
			_height: buttonheight,
			_buttonName: offname,
			_buttonColor: color,
			_buttonText: ontext,
			});
		} else {
			this.setProperties({
			_stateObj: stateObj,
			_buttonState: state,
			_buttonName: unavailname,
			_width: buttonwidth,
			_height: buttonheight,
			_buttonColor: color,
			_buttonText: unavailtext,
			});
		}
	}
	
	
	stopPropagation(e) {
		e.stopPropagation();
	}

	setState(e) {
		const state = e.currentTarget.getAttribute('name');
		if( state == 'on' ){
			this.hass.callService('homeassistant', 'turn_on', {entity_id: this._config.entity});
		} else if (state == 'off' ) {
			this.hass.callService('homeassistant', 'turn_off', {entity_id: this._config.entity});
		}
	}
}
	
customElements.define('toggle-control-button-row', CustomToggleRow);
