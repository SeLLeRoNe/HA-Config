!function(){"use strict";var e=e||Object.getPrototypeOf(customElements.get("home-assistant-main"));const{html:t,css:i}=e.prototype;console.info("%c BATTERY-STATE-CARD %c 1.0.0 ","color: white; background: forestgreen; font-weight: 700;","color: forestgreen; background: white; font-weight: 700;");const r=(e,t="warn")=>{console[t]("[battery-state-card] "+e)},a=e=>(e=e.replace("#",""),{r:parseInt(e.substr(0,2),16),g:parseInt(e.substr(2,2),16),b:parseInt(e.substr(4,2),16)});class s{constructor(e,t){this.entity=e,this.config=t,this._name="",this._level=0,this.updated=!1,this.colorPattern=/^#[A-Fa-f0-9]{6}$/}set name(e){this.updated=this._name!=e,this._name=e}get name(){return this._name}set level(e){this.updated=this._level!=e,this._level=e}get level(){return this._level}get levelColor(){var e;if(this.config.color_gradient&&this.isColorGradientValid(this.config.color_gradient))return function(e,t){t/=100;const i=e.map((t,i)=>({pct:1/(e.length-1)*i,color:a(t)}));let r=1;for(r=1;r<i.length-1&&!(t<i[r].pct);r++);const s=i[r-1],l=i[r],o=l.pct-s.pct,n=(t-s.pct)/o,c=1-n,d=n,h={r:Math.floor(s.color.r*c+l.color.r*d),g:Math.floor(s.color.g*c+l.color.g*d),b:Math.floor(s.color.b*c+l.color.b*d)};return"rgb("+[h.r,h.g,h.b].join(",")+")"}(this.config.color_gradient,this.level);return(null===(e=(this.config.color_thresholds||[{value:20,color:"var(--label-badge-red)"},{value:55,color:"var(--label-badge-yellow)"},{value:101,color:"var(--label-badge-green)"}]).find(e=>this.level<=e.value))||void 0===e?void 0:e.color)||"inherit"}get icon(){const e=10*Math.round(this.level/10);switch(e){case 100:return"mdi:battery";case 0:return"mdi:battery-outline";default:return"mdi:battery-"+e}}isColorGradientValid(e){if(!(e.length<2)){for(const t of e)if(!this.colorPattern.test(t))return r("Color '${color}' is not valid. Please provide valid HTML hex color in #XXXXXX format."),!1;return!0}r("Value for 'color_gradient' should be an array with at least 2 colors.")}}const l=e=>t`
<div class="battery">
    <div class="icon">
        <ha-icon
            style="color: ${e.levelColor}"
            icon="${e.icon}"
        ></ha-icon>
    </div>
    <div class="name">
        ${e.name}
    </div>
    <div class="state">
        ${e.level} %
    </div>
</div>
`,o=(e,i)=>{return t`
<ha-card>
    ${r=e,t`
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
`;var r},n=(e,i)=>{const r="expander"+Math.random().toString().substr(2);return t`
    ${e.slice(0,i)}
    <input type="checkbox" class="expand" id="${r}" />
    <label for="${r}"><div>&lsaquo;</div></label>
    <div>${e.slice(i)}</div>
    `},c=i`
.battery {
    display: flex;
    line-height: 40px;
}
.battery .name {
    flex: 1 0 60px;
    margin-left: 16px;
}
.battery .icon {
    flex: 0 0 40px;
    border-radius: 50%;
    text-align: center;
}


.expand {
    display: none;
}
.expand + label {
    display: block;
    text-align: right;
    cursor: pointer;
}
.expand + label > div {
    display: inline-block;
    transform: rotate(-90deg);
    font-size: 26px;
    height: 29px;
    width: 29px;
    text-align: center;
}
.expand + label > div,
.expand + label + div {
    transition: 0.5s ease-in-out;
}
.expand:checked + label > div {
    transform: rotate(-90deg) scaleX(-1);
}
.expand + label + div {
    max-height: 0;
    overflow: hidden;
}
.expand:checked + label + div {
    max-height: 1000px;
}
`;customElements.define("battery-state-card",class extends e{constructor(){super(...arguments),this.config={},this.simpleView=!1,this.batteries=[]}static get properties(){return{batteries:Array,config:Object}}static get styles(){return c}setConfig(e){if(!e.entities&&!e.entity)throw new Error("You need to define entities");this.config=e,this.simpleView=!!e.entity;let t=e.entity?[e]:e.entities.map(e=>("string"==typeof e&&(e={entity:e}),e));this.batteries=t.map(e=>new s(e,this.config))}set hass(e){let t=!1;if(this.batteries.forEach((i,r)=>{this.updateBattery(i,e),t=t||i.updated}),t){switch(this.config.sort_by_level){case"asc":this.batteries.sort((e,t)=>e.level-t.level);break;case"desc":this.batteries.sort((e,t)=>t.level-e.level);break;default:this.config.sort_by_level&&r("Unknown sort option. Allowed values: 'asc', 'desc'")}this.batteries=[...this.batteries]}}render(){if(this.simpleView)return l(this.batteries[0]);const e=this.batteries.map(e=>l(e));return o(this.config.name||"Battery levels",this.config.collapse?[n(e,this.config.collapse)]:e)}getCardSize(){let e=this.batteries.length;return this.config.collapse&&(e=this.config.collapse+1),e+1}updateBattery(e,t){const i=t.states[e.entity.entity];if(!i)return r("Entity not found: "+e.entity.entity,"error"),null;e.name=e.entity.name||i.attributes.friendly_name;let a=0;if(e.entity.attribute)a=i.attributes[e.entity.attribute];else{a=[i.attributes.battery_level,i.attributes.battery,i.state,0].find(e=>null!==e&&!isNaN(e))||0}e.entity.multiplier&&(a*=e.entity.multiplier),e.level=void 0===e.entity.value_override?a:e.entity.value_override}})}();
//# sourceMappingURL=battery-state-card.js.map
