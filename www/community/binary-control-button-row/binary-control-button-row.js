class CustomBinaryRow extends Polymer.Element {

	static get template() {
        return Polymer.html`
            <style is="custom-style" include="iron-flex iron-flex-alignment"></style>
            <style>
                :host {
                    line-height: inherit;
				}
                .switch {
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
			class='switch'
			style='[[_onColor]]'
			toggles name="on"
			on-click='setState'
			disabled='[[_isOnState]]'>[[_onText]]</button>
			<button
			class='switch'
			style='[[_offColor]]'
			toggles name="off"
			on-click='setState'
			disabled='[[_isOffState]]'>[[_offText]]</button>
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
		_onColor: String,
		_offColor: String,
		_onText: String,
		_offText: String,
		_isOffState: Boolean,
            	_isOnState: Boolean,
        }
    }

    setConfig(config) {
        this._config = config;
		
	this._config = {
		customTheme: false,
		IsOnColor: '#43A047',
		IsOffColor: '#f44c09',
		ButtonInactiveColor: '#759aaa',
		customOffText: 'OFF',
		customOnText: 'ON',
            	...config
        };
    }

    hassChanged(hass) {

        const config = this._config;
        const stateObj = hass.states[config.entity];
	const custTheme = config.customTheme;
	const custOnClr = config.IsOnColor;
	const custOffClr = config.IsOffColor;
	const custInactiveClr = config.ButtonInactiveColor;
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
			
	this.setProperties({
		_stateObj: stateObj,
		_isOffState: stateObj.state == 'off',
		_isOnState: stateObj.state === 'on',
		_onColor: oncolor,
		_offColor: offcolor,
		_offText: offtext,
		_onText: ontext,
	});
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
