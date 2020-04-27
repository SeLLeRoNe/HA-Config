!function(){"use strict";var t=t||Object.getPrototypeOf(customElements.get("home-assistant-main"));const{html:e,css:i}=t.prototype;console.info("%c BATTERY-STATE-CARD %c 1.0.1","color: white; background: forestgreen; font-weight: 700;","color: forestgreen; background: white; font-weight: 700;");const r=(t,e="warn")=>{console[e]("[battery-state-card] "+t)},s=t=>(t=t.replace("#",""),{r:parseInt(t.substr(0,2),16),g:parseInt(t.substr(2,2),16),b:parseInt(t.substr(4,2),16)});class a{constructor(t,e){this.entity=t,this.config=e,this._level="Unknown",this.updated=!1,this.colorPattern=/^#[A-Fa-f0-9]{6}$/,this._name=t.name||t.entity}set name(t){this.updated=this._name!=t,this._name=t}get name(){return this._name}set level(t){this.updated=this._level!=t,this._level=t}get level(){return isNaN(Number(this._level)),this._level}get levelColor(){var t;const e=Number(this._level);return isNaN(e)?"inherit":this.config.color_gradient&&this.isColorGradientValid(this.config.color_gradient)?function(t,e){e/=100;const i=t.map((e,i)=>({pct:1/(t.length-1)*i,color:s(e)}));let r=1;for(r=1;r<i.length-1&&!(e<i[r].pct);r++);const a=i[r-1],n=i[r],o=n.pct-a.pct,l=(e-a.pct)/o,c=1-l,d=l,h={r:Math.floor(a.color.r*c+n.color.r*d),g:Math.floor(a.color.g*c+n.color.g*d),b:Math.floor(a.color.b*c+n.color.b*d)};return"rgb("+[h.r,h.g,h.b].join(",")+")"}(this.config.color_gradient,e):(null===(t=(this.config.color_thresholds||[{value:20,color:"var(--label-badge-red)"},{value:55,color:"var(--label-badge-yellow)"},{value:101,color:"var(--label-badge-green)"}]).find(t=>e<=t.value))||void 0===t?void 0:t.color)||"inherit"}get icon(){const t=Number(this._level);if(isNaN(t))return"mdi:battery-unknown";const e=10*Math.round(t/10);switch(e){case 100:return"mdi:battery";case 0:return"mdi:battery-outline";default:return"mdi:battery-"+e}}isColorGradientValid(t){if(!(t.length<2)){for(const e of t)if(!this.colorPattern.test(e))return r("Color '${color}' is not valid. Please provide valid HTML hex color in #XXXXXX format."),!1;return!0}r("Value for 'color_gradient' should be an array with at least 2 colors.")}}const n=t=>e`
<div class="battery">
    <div class="icon">
        <ha-icon
            style="color: ${t.levelColor}"
            icon="${t.icon}"
        ></ha-icon>
    </div>
    <div class="name">
        ${t.name}
    </div>
    <div class="state">
        ${t.level}${isNaN(Number(t.level))?"":" %"}
    </div>
</div>
`,o=(t,i)=>{return e`
<ha-card>
    ${r=t,e`
<div class="card-header">
    <div class="name">
        ${r}
    </div>
</div>
`}
    <div class="card-content">
        ${i}
    </div>
</ha-card>
`;var r},l=(t,i)=>{const r="expander"+Math.random().toString().substr(2);return e`
    ${t.slice(0,i)}
    <input type="checkbox" class="expand" id="${r}" />
    <label for="${r}"><div>&lsaquo;</div></label>
    <div>${t.slice(i)}</div>
    `},c=i`.battery{display: flex;line-height: 40px;margin: 8px 0;}.battery .name{flex: 1 0 60px;margin-left: 16px;}.battery .icon{flex: 0 0 40px;border-radius: 50%;text-align: center;}.expand{display: none;}.expand + label{display: block;text-align: right;cursor: pointer;}.expand + label > div{display: inline-block;transform: rotate(-90deg);font-size: 26px;height: 29px;width: 29px;text-align: center;}.expand + label > div,.expand + label + div{transition: 0.5s ease-in-out;}.expand:checked + label > div{transform: rotate(-90deg) scaleX(-1);}.expand + label + div{max-height: 0;overflow: hidden;}.expand:checked + label + div{max-height: 1000px;}`;customElements.define("battery-state-card",class extends t{constructor(){super(...arguments),this.rawConfig="",this.config={},this.simpleView=!1,this.batteries=[]}static get properties(){return{batteries:Array,config:Object}}static get styles(){return c}setConfig(t){if(!t.entities&&!t.entity)throw new Error("You need to define entities");const e=JSON.stringify(t);if(this.rawConfig===e)return;this.rawConfig=e,this.config=t,this.simpleView=!!t.entity;let i=t.entity?[t]:t.entities.map(t=>("string"==typeof t&&(t={entity:t}),t));this.batteries=i.map(t=>new a(t,this.config))}set hass(t){let e=!1;if(this.batteries.forEach((i,r)=>{this.updateBattery(i,t),e=e||i.updated}),e){switch(this.config.sort_by_level){case"asc":this.batteries.sort((t,e)=>this.sort(t.level,e.level));break;case"desc":this.batteries.sort((t,e)=>this.sort(e.level,t.level));break;default:this.config.sort_by_level&&r("Unknown sort option. Allowed values: 'asc', 'desc'")}this.batteries=[...this.batteries]}}render(){if(this.simpleView)return n(this.batteries[0]);const t=this.batteries.map(t=>n(t));return o(this.config.name||"Battery levels",this.config.collapse?[l(t,this.config.collapse)]:t)}getCardSize(){let t=this.batteries.length;return this.config.collapse&&(t=this.config.collapse+1),t+1}updateBattery(t,e){var i;const s=e.states[t.entity.entity];if(!s)return r("Entity not found: "+t.entity.entity,"error"),null;let a;if(t.name=t.entity.name||s.attributes.friendly_name,t.entity.attribute)a=s.attributes[t.entity.attribute];else{a=(null===(i=[s.attributes.battery_level,s.attributes.battery,s.state].find(t=>null!=t))||void 0===i?void 0:i.toString())||"Unknown"}t.entity.multiplier&&!isNaN(Number(a))&&(a=(t.entity.multiplier*Number(a)).toString()),t.level=void 0===t.entity.value_override?a:t.entity.value_override}sort(t,e){let i=Number(t),r=Number(e);return i=isNaN(i)?-1:i,r=isNaN(r)?-1:r,i-r}})}();
//# sourceMappingURL=battery-state-card.js.map
