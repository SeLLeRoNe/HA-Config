!function(){"use strict";var t=t||Object.getPrototypeOf(customElements.get("home-assistant-main"));const{html:e,css:i}=t.prototype;console.info("%c BATTERY-STATE-CARD %c 1.3.4","color: white; background: forestgreen; font-weight: 700;","color: forestgreen; background: white; font-weight: 700;");const n=(t,e="warn")=>{console[e]("[battery-state-card] "+t)},s=t=>(t=t.replace("#",""),{r:parseInt(t.substr(0,2),16),g:parseInt(t.substr(2,2),16),b:parseInt(t.substr(4,2),16)}),r=t=>!isNaN(Number(t)),o=t=>Array.isArray(t)?t:t?[t]:[],a=t=>e`
<div class="battery ${t.classNames}" @click=${t.action}>
    <div class="icon">
        <ha-icon
            style="color: ${t.levelColor}"
            icon="${t.icon}"
        ></ha-icon>
    </div>
    <div class="name truncate">
        ${t.name}
        ${(t=>t.secondary_info&&e`
<div class="secondary">${t.secondary_info}</div>
`)(t)}
    </div>
    <div class="state">
        ${t.level}${r(t.level)?e`&nbsp;%`:""}
    </div>
</div>
`,c=(t,i)=>{return e`
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
`;var n},l=(t,i)=>{const n="expander"+Math.random().toString().substr(2);return e`
    ${t.slice(0,i)}
    <input type="checkbox" class="expand" id="${n}" />
    <label for="${n}"><div>&lsaquo;</div></label>
    <div>${t.slice(i)}</div>
    `},h=i`.clickable{cursor: pointer;}.truncate{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}.battery{display: flex;align-items: center;margin: 8px 0;}.battery:first-child{margin-top: 0;}.battery .name{flex: 1 0 60px;margin: 0 5px 0 16px;}.battery .secondary{color: var(--primary-color);}.battery .icon{flex: 0 0 40px;border-radius: 50%;text-align: center;line-height: 40px;}.expand{display: none;}.expand + label{display: block;text-align: right;cursor: pointer;}.expand + label > div{display: inline-block;transform: rotate(-90deg);font-size: 26px;height: 29px;width: 29px;text-align: center;}.expand + label > div,.expand + label + div{transition: 0.5s ease-in-out;}.expand:checked + label > div{transform: rotate(-90deg) scaleX(-1);}.expand + label + div{max-height: 0;overflow: hidden;}.expand:checked + label + div{max-height: 10000px;}`,d={"more-info":t=>{const e=new Event("hass-more-info",{composed:!0});e.detail={entityId:t.entity.entity},t.card.dispatchEvent(e)},navigate:t=>{if(!t.config.navigation_path)return void n("Missing 'navigation_path' for 'navigate' tap action");window.history.pushState(null,"",t.config.navigation_path);const e=new Event("location-changed",{composed:!0});e.detail={replace:!1},window.dispatchEvent(e)},"call-service":t=>{if(!t.config.service)return void n("Missing 'service' for 'call-service' tap action");const[e,i]=t.config.service.split(".",2),s=Object.assign({},t.config.service_data);g.hass.callService(e,i,s)},url:t=>{t.config.url_path?window.location.href=t.config.url_path:n("Missing 'url_path' for 'url' tap action")}};class g{static getAction(t){return t.config&&"none"!=t.config.action?e=>{e.stopPropagation(),t.config.action in d?d[t.config.action](t):n("Unknown tap action type: "+t.config.action)}:null}}class u{constructor(t,e){this.config=t,this.action=e,this._level="Unknown",this._charging=!1,this._secondary_info=null,this._is_hidden=!1,this.updated=!1,this.colorPattern=/^#[A-Fa-f0-9]{6}$/,this._name=t.name||t.entity}get entity_id(){return this.config.entity}get data_required_for(){var t;return(null===(t=this.config.charging_state)||void 0===t?void 0:t.entity_id)?[this.config.entity,this.config.charging_state.entity_id]:[this.config.entity]}set name(t){this.updated=this.updated||this._name!=t,this._name=t}get name(){let t=this._name;return o(this.config.bulk_rename).forEach(e=>{t="/"==e.from[0]&&"/"==e.from[e.from.length-1]?t.replace(new RegExp(e.from.substr(1,e.from.length-2)),e.to||""):t.replace(e.from,e.to||"")}),t}set level(t){this.updated=this.updated||this._level!=t,this._level=t}get level(){return this._level}set charging(t){this.updated=this.updated||this.charging!=t,this._charging=t}get charging(){return this._charging}get is_hidden(){return this._is_hidden}set is_hidden(t){this.updated=this.updated||this._is_hidden!=t,this._is_hidden=t}get secondary_info(){return this._secondary_info}set secondary_info(t){this.updated=this.updated||this._secondary_info!=t,this._secondary_info=t}get levelColor(){var t,e;const i=Number(this._level);return this.charging&&(null===(t=this.config.charging_state)||void 0===t?void 0:t.color)?this.config.charging_state.color:isNaN(i)?"inherit":this.config.color_gradient&&this.isColorGradientValid(this.config.color_gradient)?function(t,e){e/=100;const i=t.map((e,i)=>({pct:1/(t.length-1)*i,color:s(e)}));let n=1;for(n=1;n<i.length-1&&!(e<i[n].pct);n++);const r=i[n-1],o=i[n],a=o.pct-r.pct,c=(e-r.pct)/a,l=1-c,h=c,d={r:Math.floor(r.color.r*l+o.color.r*h),g:Math.floor(r.color.g*l+o.color.g*h),b:Math.floor(r.color.b*l+o.color.b*h)};return"rgb("+[d.r,d.g,d.b].join(",")+")"}(this.config.color_gradient,i):(null===(e=(this.config.color_thresholds||[{value:20,color:"var(--label-badge-red)"},{value:55,color:"var(--label-badge-yellow)"},{value:101,color:"var(--label-badge-green)"}]).find(t=>i<=t.value))||void 0===e?void 0:e.color)||"inherit"}get icon(){var t;const e=Number(this._level);if(this.charging&&(null===(t=this.config.charging_state)||void 0===t?void 0:t.icon))return this.config.charging_state.icon;if(isNaN(e))return"mdi:battery-unknown";const i=10*Math.round(e/10);switch(i){case 100:return this.charging?"mdi:battery-charging-100":"mdi:battery";case 0:return this.charging?"mdi:battery-charging-outline":"mdi:battery-outline";default:return(this.charging?"mdi:battery-charging-":"mdi:battery-")+i}}get classNames(){return this.action?"clickable":""}update(t){const e=t.states[this.config.entity];e?(this.updated=!1,this.name=this.config.name||e.attributes.friendly_name,this.level=this.getLevel(e),this.charging=this.getChargingState(t),this.secondary_info=this.setSecondaryInfo(t,e)):n("Entity not found: "+this.config.entity,"error")}getLevel(t){var e;let i;if(this.config.attribute)i=t.attributes[this.config.attribute];else{const n=[t.attributes.battery_level,t.attributes.battery,t.state];i=(null===(e=n.find(t=>null!=t))||void 0===e?void 0:e.toString())||"Unknown"}if(this.config.state_map){const t=this.config.state_map.find(t=>t.from==i);null==t?n(`Missing option for '${i}' in 'state_map'`):i=t.to.toString()}return this.config.multiplier&&r(i)&&(i=(this.config.multiplier*Number(i)).toString()),i=void 0===this.config.value_override?i:this.config.value_override,r(i)||(i=i.charAt(0).toUpperCase()+i.slice(1)),i}getChargingState(t){const e=this.config.charging_state;if(!e)return!1;let i=this.level,s=t.states[this.config.entity];if(e.entity_id){if(s=t.states[e.entity_id],!s)return n(`'charging_state' entity id (${e.entity_id}) not found`),!1;i=s.state}const r=o(e.attribute);if(0!=r.length){const t=r.find(t=>null!=s.attributes[t.name]);if(t)return null==t.value||s.attributes[t.name]==t.value}const a=o(e.state);return 0==a.length?!!i:a.some(t=>t==i)}setSecondaryInfo(t,e){var i;if(this.config.secondary_info){if("charging"==this.config.secondary_info)return this.charging?(null===(i=this.config.charging_state)||void 0===i?void 0:i.secondary_info_text)||"Charging":null;{const i=e[this.config.secondary_info]||e.attributes[this.config.secondary_info]||this.config.secondary_info;return isNaN(Date.parse(i))?i:((t,e)=>{let i=Date.parse(e);if(isNaN(i))return t.localize("ui.components.relative_time.never");i=Math.round((Date.now()-i)/1e3);let n="";return n=i<60?t.localize("ui.components.relative_time.duration.second","count",i):i<3600?t.localize("ui.components.relative_time.duration.minute","count",Math.round(i/60)):i<86400?t.localize("ui.components.relative_time.duration.hour","count",Math.round(i/3600)):i<604800?t.localize("ui.components.relative_time.duration.day","count",Math.round(i/86400)):t.localize("ui.components.relative_time.duration.week","count",Math.round(i/604800)),t.localize("ui.components.relative_time.past","time",n)})(t,i)}}return null}isColorGradientValid(t){if(!(t.length<2)){for(const e of t)if(!this.colorPattern.test(e))return n("Color '${color}' is not valid. Please provide valid HTML hex color in #XXXXXX format."),!1;return!0}n("Value for 'color_gradient' should be an array with at least 2 colors.")}}const f=["tap_action","state_map","charging_state","secondary_info","color_thresholds","color_gradient","bulk_rename"],p={exists:t=>void 0!==t,contains:(t,e)=>void 0!==t&&-1!=t.indexOf(e),"=":(t,e)=>t==e,">":(t,e)=>Number(t)>e,"<":(t,e)=>Number(t)<e,">=":(t,e)=>Number(t)>=e,"<=":(t,e)=>Number(t)<=e,matches:(t,e)=>{if(void 0===t)return!1;let i;return"/"==e[0]&&"/"==e[e.length-1]?i=new RegExp(e.substr(1,e.length-2)):-1!=e.indexOf("*")&&(i=new RegExp(e.replace(/\*/g,".*"))),i?i.test(t):t===e}};class v{constructor(t){this.config=t}get is_permanent(){return"state"!=this.config.name}isValid(t,e){const i=this.getValue(t,e);return this.meetsExpectations(i)}getValue(t,e){if(this.config.name)return 0==this.config.name.indexOf("attributes.")?t.attributes[this.config.name.substr(11)]:"state"==this.config.name&&void 0!==e?e:t[this.config.name];n("Missing filter 'name' property")}meetsExpectations(t){let e=this.config.operator;e||(e=void 0===t?"exists":"=");const i=p[e];return i?i(t,this.config.value):(n(`Operator '${this.config.operator}' not supported. Supported operators: ${Object.keys(p).join(", ")}`),!1)}}class m{constructor(t,e){var i,n,s,r;this.config=t,this.cardNode=e,this.batteries=[],this.initialized=!1,this.include=null===(n=null===(i=t.filter)||void 0===i?void 0:i.include)||void 0===n?void 0:n.map(t=>new v(t)),this.exclude=null===(r=null===(s=t.filter)||void 0===s?void 0:s.exclude)||void 0===r?void 0:r.map(t=>new v(t)),this.include||(this.initialized=!1),this.processExplicitEntities()}getBatteries(t){if(t){this.initialized||this.processIncludes(t),this.updateBatteries(t)&&this.processExcludes(t)}return this.batteries}createBattery(t){return f.filter(e=>null==t[e]).forEach(e=>t[e]=this.config[e]),new u(t,g.getAction({card:this.cardNode,config:t.tap_action||this.config.tap_action||null,entity:t}))}processExplicitEntities(){let t=this.config.entity?[this.config]:(this.config.entities||[]).map(t=>("string"==typeof t&&(t={entity:t}),t));this.batteries=t.map(t=>this.createBattery(t))}processIncludes(t){this.initialized=!0,this.include&&Object.keys(t.states).forEach(e=>{var i;(null===(i=this.include)||void 0===i?void 0:i.some(i=>i.isValid(t.states[e])))&&!this.batteries.some(t=>t.entity_id==e)&&this.batteries.push(this.createBattery({entity:e}))})}processExcludes(t){if(null==this.exclude)return;const e=this.exclude,i=[];this.batteries.forEach((n,s)=>{let r=!1;for(let o of e)o.isValid(t.states[n.entity_id],n.level)&&(o.is_permanent?i.push(s):r=!0);n.is_hidden=r}),i.forEach(t=>this.batteries.splice(t,1))}updateBatteries(t){let e=!1;if(this.batteries.forEach((i,n)=>{i.update(t),e=e||i.updated}),e){switch(this.config.sort_by_level){case"asc":this.batteries.sort((t,e)=>this.sort(t.level,e.level));break;case"desc":this.batteries.sort((t,e)=>this.sort(e.level,t.level));break;default:this.config.sort_by_level&&n("Unknown sort option. Allowed values: 'asc', 'desc'")}this.batteries=[...this.batteries]}return e}sort(t,e){let i=Number(t),n=Number(e);return i=isNaN(i)?-1:i,n=isNaN(n)?-1:n,i-n}}customElements.define("battery-state-card",class extends t{constructor(){super(...arguments),this.rawConfig="",this.config={},this.simpleView=!1,this.batteries=[],this.batteryProvider=null}static get properties(){return{batteries:Array}}static get styles(){return h}setConfig(t){var e;if(!t.entities&&!t.entity&&!(null===(e=t.filter)||void 0===e?void 0:e.include))throw new Error("You need to define entities or filter.include");const i=JSON.stringify(t);this.rawConfig!==i&&(this.rawConfig=i,this.config=JSON.parse(i),this.simpleView=!!this.config.entity,this.batteryProvider=new m(this.config,this),this.batteries=this.batteryProvider.getBatteries())}set hass(t){g.hass=t,setTimeout(()=>this.batteries=this.batteryProvider.getBatteries(t),0)}render(){if(this.simpleView)return a(this.batteries[0]);const t=this.batteries.filter(t=>!t.is_hidden).map(t=>a(t));return 0==t.length?e``:c(this.config.name||this.config.title,this.config.collapse?[l(t,this.config.collapse)]:t)}getCardSize(){let t=this.batteries.length;return this.config.collapse&&(t=this.config.collapse+1),t+1}})}();
//# sourceMappingURL=battery-state-card.js.map
