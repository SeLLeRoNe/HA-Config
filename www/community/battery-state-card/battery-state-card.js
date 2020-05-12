!function(){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */function t(t,i,e,n){return new(e||(e=Promise))((function(a,r){function o(t){try{c(n.next(t))}catch(t){r(t)}}function s(t){try{c(n.throw(t))}catch(t){r(t)}}function c(t){var i;t.done?a(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(o,s)}c((n=n.apply(t,i||[])).next())}))}var i=i||Object.getPrototypeOf(customElements.get("home-assistant-main"));const{html:e,css:n}=i.prototype;console.info("%c BATTERY-STATE-CARD %c 1.2.1","color: white; background: forestgreen; font-weight: 700;","color: forestgreen; background: white; font-weight: 700;");const a=(t,i="warn")=>{console[i]("[battery-state-card] "+t)},r=t=>(t=t.replace("#",""),{r:parseInt(t.substr(0,2),16),g:parseInt(t.substr(2,2),16),b:parseInt(t.substr(4,2),16)}),o=t=>!isNaN(Number(t)),s=t=>Array.isArray(t)?t:t?[t]:[];class c{constructor(t,i){this.config=t,this.action=i,this._level="Unknown",this._charging=!1,this.updated=!1,this.colorPattern=/^#[A-Fa-f0-9]{6}$/,this._name=t.name||t.entity}get data_required_for(){var t;return(null===(t=this.config.charging_state)||void 0===t?void 0:t.entity_id)?[this.config.entity,this.config.charging_state.entity_id]:[this.config.entity]}set name(t){this.updated=this._name!=t,this._name=t}get name(){return this._name}set level(t){this.updated=this._level!=t,this._level=t}get level(){return this._level}set charging(t){this.updated=this.updated||this.charging!=t,this._charging=t}get charging(){return this._charging}get levelColor(){var t,i;const e=Number(this._level);return this.charging&&(null===(t=this.config.charging_state)||void 0===t?void 0:t.color)?this.config.charging_state.color:isNaN(e)?"inherit":this.config.color_gradient&&this.isColorGradientValid(this.config.color_gradient)?function(t,i){i/=100;const e=t.map((i,e)=>({pct:1/(t.length-1)*e,color:r(i)}));let n=1;for(n=1;n<e.length-1&&!(i<e[n].pct);n++);const a=e[n-1],o=e[n],s=o.pct-a.pct,c=(i-a.pct)/s,l=1-c,h=c,g={r:Math.floor(a.color.r*l+o.color.r*h),g:Math.floor(a.color.g*l+o.color.g*h),b:Math.floor(a.color.b*l+o.color.b*h)};return"rgb("+[g.r,g.g,g.b].join(",")+")"}(this.config.color_gradient,e):(null===(i=(this.config.color_thresholds||[{value:20,color:"var(--label-badge-red)"},{value:55,color:"var(--label-badge-yellow)"},{value:101,color:"var(--label-badge-green)"}]).find(t=>e<=t.value))||void 0===i?void 0:i.color)||"inherit"}get icon(){var t;const i=Number(this._level);if(this.charging&&(null===(t=this.config.charging_state)||void 0===t?void 0:t.icon))return this.config.charging_state.icon;if(isNaN(i))return"mdi:battery-unknown";const e=10*Math.round(i/10);switch(e){case 100:return this.charging?"mdi:battery-charging-100":"mdi:battery";case 0:return this.charging?"mdi:battery-charging-outline":"mdi:battery-outline";default:return(this.charging?"mdi:battery-charging-":"mdi:battery-")+e}}get classNames(){return this.action?"clickable":""}update(t){var i;const e=t.states[this.config.entity];if(!e)return void a("Entity not found: "+this.config.entity,"error");let n;if(this.name=this.config.name||e.attributes.friendly_name,this.config.attribute)n=e.attributes[this.config.attribute];else{const t=[e.attributes.battery_level,e.attributes.battery,e.state];n=(null===(i=t.find(t=>null!=t))||void 0===i?void 0:i.toString())||"Unknown"}if(this.config.state_map){const t=this.config.state_map.find(t=>t.from==n);null==t?a(`Missing option for '${n}' in 'state_map'`):n=t.to.toString()}this.config.multiplier&&o(n)&&(n=(this.config.multiplier*Number(n)).toString()),this.level=void 0===this.config.value_override?n:this.config.value_override,o(this.level)||(this.level=this.level.charAt(0).toUpperCase()+this.level.slice(1)),this.setChargingState(t)}setChargingState(t){const i=this.config.charging_state;if(!i)return;let e=this.level,n=t.states[this.config.entity];if(i.entity_id){if(n=t.states[i.entity_id],!n)return void a(`'charging_state' entity id (${i.entity_id}) not found`);e=n.state}const r=s(i.attribute);if(0!=r.length){const t=r.find(t=>null!=n.attributes[t.name]);if(t)return void(this.charging=null==t.value||n.attributes[t.name]==t.value)}const o=s(i.state);this.charging=0==o.length?!!e:o.some(t=>t==e)}isColorGradientValid(t){if(!(t.length<2)){for(const i of t)if(!this.colorPattern.test(i))return a("Color '${color}' is not valid. Please provide valid HTML hex color in #XXXXXX format."),!1;return!0}a("Value for 'color_gradient' should be an array with at least 2 colors.")}}const l=t=>e`
<div class="battery ${t.classNames}" @click=${t.action}>
    <div class="icon">
        <ha-icon
            style="color: ${t.levelColor}"
            icon="${t.icon}"
        ></ha-icon>
    </div>
    <div class="name truncate">
        ${t.name}
    </div>
    <div class="state">
        ${t.level}${o(t.level)?e`&nbsp;%`:""}
    </div>
</div>
`,h=(t,i)=>{return e`
<ha-card>
    ${t?(n=t,e`
<div class="card-header">
    <div class="truncate">
        ${n}
    </div>
</div>
`):""}
    <div class="card-content">
        ${i}
    </div>
</ha-card>
`;var n},g=(t,i)=>{const n="expander"+Math.random().toString().substr(2);return e`
    ${t.slice(0,i)}
    <input type="checkbox" class="expand" id="${n}" />
    <label for="${n}"><div>&lsaquo;</div></label>
    <div>${t.slice(i)}</div>
    `},d=()=>e``,f=n`.clickable{cursor: pointer;}.truncate{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}.battery{display: flex;line-height: 40px;margin: 8px 0;}.battery .name{flex: 1 0 60px;margin: 0 5px 0 16px;}.battery .icon{flex: 0 0 40px;border-radius: 50%;text-align: center;}.expand{display: none;}.expand + label{display: block;text-align: right;cursor: pointer;}.expand + label > div{display: inline-block;transform: rotate(-90deg);font-size: 26px;height: 29px;width: 29px;text-align: center;}.expand + label > div,.expand + label + div{transition: 0.5s ease-in-out;}.expand:checked + label > div{transform: rotate(-90deg) scaleX(-1);}.expand + label + div{max-height: 0;overflow: hidden;}.expand:checked + label + div{max-height: 10000px;}`,u={"more-info":t=>{const i=new Event("hass-more-info",{composed:!0});i.detail={entityId:t.entity.entity},t.card.dispatchEvent(i)},navigate:t=>{if(!t.config.navigation_path)return void a("Missing 'navigation_path' for 'navigate' tap action");window.history.pushState(null,"",t.config.navigation_path);const i=new Event("location-changed",{composed:!0});i.detail={replace:!1},window.dispatchEvent(i)},"call-service":t=>{if(!t.config.service)return void a("Missing 'service' for 'call-service' tap action");const[i,e]=t.config.service.split(".",2),n=Object.assign({},t.config.service_data);v.hass.callService(i,e,n)},url:t=>{t.config.url_path?window.location.href=t.config.url_path:a("Missing 'url_path' for 'url' tap action")}};class v{static getAction(t){return t.config&&"none"!=t.config.action?i=>{i.stopPropagation(),t.config.action in u?u[t.config.action](t):a("Unknown tap action type: "+t.config.action)}:null}}customElements.define("battery-state-card",class extends i{constructor(){super(...arguments),this.rawConfig="",this.config={},this.simpleView=!1,this.batteries=[]}static get properties(){return{batteries:Array}}static get styles(){return f}setConfig(t){if(!t.entities&&!t.entity)throw new Error("You need to define entities");const i=JSON.stringify(t);this.rawConfig!==i&&(this.rawConfig=i,this.config=JSON.parse(i),this.onConfigUpdate())}set hass(t){v.hass=t,this.updateBatteries(t)}render(){if(this.simpleView)return l(this.batteries[0]);if(0==this.batteries.length)return d;const t=this.batteries.map(t=>l(t));return h(this.config.name||this.config.title,this.config.collapse?[g(t,this.config.collapse)]:t)}getCardSize(){let t=this.batteries.length;return this.config.collapse&&(t=this.config.collapse+1),t+1}onConfigUpdate(){return t(this,void 0,void 0,(function*(){this.simpleView=!!this.config.entity;let t=this.config.entity?[this.config]:this.config.entities.map(t=>("string"==typeof t&&(t={entity:t}),t));const i=["tap_action","state_map","charging_state","color_thresholds","color_gradient"];this.batteries=t.map(t=>(i.filter(i=>null==t[i]).forEach(i=>t[i]=this.config[i]),new c(t,v.getAction({card:this,config:t.tap_action||this.config.tap_action||null,entity:t}))))}))}updateBatteries(i){return t(this,void 0,void 0,(function*(){let t=!1;if(this.batteries.forEach((e,n)=>{e.update(i),t=t||e.updated}),t){switch(this.config.sort_by_level){case"asc":this.batteries.sort((t,i)=>this.sort(t.level,i.level));break;case"desc":this.batteries.sort((t,i)=>this.sort(i.level,t.level));break;default:this.config.sort_by_level&&a("Unknown sort option. Allowed values: 'asc', 'desc'")}this.batteries=[...this.batteries]}}))}sort(t,i){let e=Number(t),n=Number(i);return e=isNaN(e)?-1:e,n=isNaN(n)?-1:n,e-n}})}();
//# sourceMappingURL=battery-state-card.js.map
