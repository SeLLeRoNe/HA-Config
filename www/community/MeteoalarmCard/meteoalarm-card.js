/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,t=(e,t,n=null)=>{for(;t!==n;){const n=t.nextSibling;e.removeChild(t),t=n}},n=`{{lit-${String(Math.random()).slice(2)}}}`,s=`\x3c!--${n}--\x3e`,r=new RegExp(`${n}|${s}`);class i{constructor(e,t){this.parts=[],this.element=t;const s=[],i=[],a=document.createTreeWalker(t.content,133,null,!1);let d=0,u=-1,h=0;const{strings:p,values:{length:m}}=e;for(;h<m;){const e=a.nextNode();if(null!==e){if(u++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:n}=t;let s=0;for(let e=0;e<n;e++)o(t[e].name,"$lit$")&&s++;for(;s-- >0;){const t=p[h],n=c.exec(t)[2],s=n.toLowerCase()+"$lit$",i=e.getAttribute(s);e.removeAttribute(s);const o=i.split(r);this.parts.push({type:"attribute",index:u,name:n,strings:o}),h+=o.length-1}}"TEMPLATE"===e.tagName&&(i.push(e),a.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(n)>=0){const n=e.parentNode,i=t.split(r),a=i.length-1;for(let t=0;t<a;t++){let s,r=i[t];if(""===r)s=l();else{const e=c.exec(r);null!==e&&o(e[2],"$lit$")&&(r=r.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),s=document.createTextNode(r)}n.insertBefore(s,e),this.parts.push({type:"node",index:++u})}""===i[a]?(n.insertBefore(l(),e),s.push(e)):e.data=i[a],h+=a}}else if(8===e.nodeType)if(e.data===n){const t=e.parentNode;null!==e.previousSibling&&u!==d||(u++,t.insertBefore(l(),e)),d=u,this.parts.push({type:"node",index:u}),null===e.nextSibling?e.data="":(s.push(e),u--),h++}else{let t=-1;for(;-1!==(t=e.data.indexOf(n,t+1));)this.parts.push({type:"node",index:-1}),h++}}else a.currentNode=i.pop()}for(const e of s)e.parentNode.removeChild(e)}}const o=(e,t)=>{const n=e.length-t.length;return n>=0&&e.slice(n)===t},a=e=>-1!==e.index,l=()=>document.createComment(""),c=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function d(e,t){const{element:{content:n},parts:s}=e,r=document.createTreeWalker(n,133,null,!1);let i=h(s),o=s[i],a=-1,l=0;const c=[];let d=null;for(;r.nextNode();){a++;const e=r.currentNode;for(e.previousSibling===d&&(d=null),t.has(e)&&(c.push(e),null===d&&(d=e)),null!==d&&l++;void 0!==o&&o.index===a;)o.index=null!==d?-1:o.index-l,i=h(s,i),o=s[i]}c.forEach(e=>e.parentNode.removeChild(e))}const u=e=>{let t=11===e.nodeType?0:1;const n=document.createTreeWalker(e,133,null,!1);for(;n.nextNode();)t++;return t},h=(e,t=-1)=>{for(let n=t+1;n<e.length;n++){const t=e[n];if(a(t))return n}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const p=new WeakMap,m=e=>"function"==typeof e&&p.has(e),g={},f={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class _{constructor(e,t,n){this.__parts=[],this.template=e,this.processor=t,this.options=n}update(e){let t=0;for(const n of this.__parts)void 0!==n&&n.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),n=[],s=this.template.parts,r=document.createTreeWalker(t,133,null,!1);let i,o=0,l=0,c=r.nextNode();for(;o<s.length;)if(i=s[o],a(i)){for(;l<i.index;)l++,"TEMPLATE"===c.nodeName&&(n.push(c),r.currentNode=c.content),null===(c=r.nextNode())&&(r.currentNode=n.pop(),c=r.nextNode());if("node"===i.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(c.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,i.name,i.strings,this.options));o++}else this.__parts.push(void 0),o++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const v=` ${n} `;class y{constructor(e,t,n,s){this.strings=e,this.values=t,this.type=n,this.processor=s}getHTML(){const e=this.strings.length-1;let t="",r=!1;for(let i=0;i<e;i++){const e=this.strings[i],o=e.lastIndexOf("\x3c!--");r=(o>-1||r)&&-1===e.indexOf("--\x3e",o+1);const a=c.exec(e);t+=null===a?e+(r?v:s):e.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+n}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const w=e=>null===e||!("object"==typeof e||"function"==typeof e),S=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class b{constructor(e,t,n){this.dirty=!0,this.element=e,this.name=t,this.strings=n,this.parts=[];for(let e=0;e<n.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new x(this)}_getValue(){const e=this.strings,t=e.length-1;let n="";for(let s=0;s<t;s++){n+=e[s];const t=this.parts[s];if(void 0!==t){const e=t.value;if(w(e)||!S(e))n+="string"==typeof e?e:String(e);else for(const t of e)n+="string"==typeof t?t:String(t)}}return n+=e[t],n}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===g||w(e)&&e===this.value||(this.value=e,m(e)||(this.committer.dirty=!0))}commit(){for(;m(this.value);){const e=this.value;this.value=g,e(this)}this.value!==g&&this.committer.commit()}}class M{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(l()),this.endNode=e.appendChild(l())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=l()),e.__insert(this.endNode=l())}insertAfterPart(e){e.__insert(this.startNode=l()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(null===this.startNode.parentNode)return;for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}const e=this.__pendingValue;e!==g&&(w(e)?e!==this.value&&this.__commitText(e):e instanceof y?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):S(e)?this.__commitIterable(e):e===f?(this.value=f,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,n="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=n:this.__commitNode(document.createTextNode(n)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof _&&this.value.template===t)this.value.update(e.values);else{const n=new _(t,e.processor,this.options),s=n._clone();n.update(e.values),this.__commitNode(s),this.value=n}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let n,s=0;for(const r of e)n=t[s],void 0===n&&(n=new M(this.options),t.push(n),0===s?n.appendIntoPart(this):n.insertAfterPart(t[s-1])),n.setValue(r),n.commit(),s++;s<t.length&&(t.length=s,this.clear(n&&n.endNode))}clear(e=this.startNode){t(this.startNode.parentNode,e.nextSibling,this.endNode)}}class P{constructor(e,t,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=n}setValue(e){this.__pendingValue=e}commit(){for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=g}}class N extends b{constructor(e,t,n){super(e,t,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new C(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class C extends x{}let A=!1;(()=>{try{const e={get capture(){return A=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}})();class T{constructor(e,t,n){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=n,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=this.__pendingValue,t=this.value,n=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),s=null!=e&&(null==t||n);n&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),s&&(this.__options=E(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=g}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const E=e=>e&&(A?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function k(e){let t=O.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},O.set(e.type,t));let s=t.stringsArray.get(e.strings);if(void 0!==s)return s;const r=e.strings.join(n);return s=t.keyString.get(r),void 0===s&&(s=new i(e,e.getTemplateElement()),t.keyString.set(r,s)),t.stringsArray.set(e.strings,s),s}const O=new Map,D=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const z=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(e,t,n,s){const r=t[0];if("."===r){return new N(e,t.slice(1),n).parts}return"@"===r?[new T(e,t.slice(1),s.eventContext)]:"?"===r?[new P(e,t.slice(1),n)]:new b(e,t,n).parts}handleTextExpression(e){return new M(e)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const V=(e,...t)=>new y(e,t,"html",z)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,Y=(e,t)=>`${e}--${t}`;let j=!0;void 0===window.ShadyCSS?j=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),j=!1);const U=e=>t=>{const s=Y(t.type,e);let r=O.get(s);void 0===r&&(r={stringsArray:new WeakMap,keyString:new Map},O.set(s,r));let o=r.stringsArray.get(t.strings);if(void 0!==o)return o;const a=t.strings.join(n);if(o=r.keyString.get(a),void 0===o){const n=t.getTemplateElement();j&&window.ShadyCSS.prepareTemplateDom(n,e),o=new i(t,n),r.keyString.set(a,o)}return r.stringsArray.set(t.strings,o),o},H=["html","svg"],R=new Set,$=(e,t,n)=>{R.add(e);const s=n?n.element:document.createElement("template"),r=t.querySelectorAll("style"),{length:i}=r;if(0===i)return void window.ShadyCSS.prepareTemplateStyles(s,e);const o=document.createElement("style");for(let e=0;e<i;e++){const t=r[e];t.parentNode.removeChild(t),o.textContent+=t.textContent}(e=>{H.forEach(t=>{const n=O.get(Y(t,e));void 0!==n&&n.keyString.forEach(e=>{const{element:{content:t}}=e,n=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{n.add(e)}),d(e,n)})})})(e);const a=s.content;n?function(e,t,n=null){const{element:{content:s},parts:r}=e;if(null==n)return void s.appendChild(t);const i=document.createTreeWalker(s,133,null,!1);let o=h(r),a=0,l=-1;for(;i.nextNode();){for(l++,i.currentNode===n&&(a=u(t),n.parentNode.insertBefore(t,n));-1!==o&&r[o].index===l;){if(a>0){for(;-1!==o;)r[o].index+=a,o=h(r,o);return}o=h(r,o)}}}(n,o,a.firstChild):a.insertBefore(o,a.firstChild),window.ShadyCSS.prepareTemplateStyles(s,e);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(n){a.insertBefore(o,a.firstChild);const e=new Set;e.add(o),d(n,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const L={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},W=(e,t)=>t!==e&&(t==t||e==e),F={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:W};class q extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,n)=>{const s=this._attributeNameForProperty(n,t);void 0!==s&&(this._attributeToPropertyMap.set(s,n),e.push(s))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=F){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const n="symbol"==typeof e?Symbol():"__"+e,s=this.getPropertyDescriptor(e,n,t);void 0!==s&&Object.defineProperty(this.prototype,e,s)}static getPropertyDescriptor(e,t,n){return{get(){return this[t]},set(n){const s=this[e];this[t]=n,this._requestUpdate(e,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||F}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const n of t)this.createProperty(n,e[n])}}static _attributeNameForProperty(e,t){const n=t.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,n=W){return n(e,t)}static _propertyValueFromAttribute(e,t){const n=t.type,s=t.converter||L,r="function"==typeof s?s:s.fromAttribute;return r?r(e,n):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const n=t.type,s=t.converter;return(s&&s.toAttribute||L.toAttribute)(e,n)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,n){t!==n&&this._attributeToProperty(e,n)}_propertyToAttribute(e,t,n=F){const s=this.constructor,r=s._attributeNameForProperty(e,n);if(void 0!==r){const e=s._propertyValueToAttribute(t,n);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(r):this.setAttribute(r,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const n=this.constructor,s=n._attributeToPropertyMap.get(e);if(void 0!==s){const e=n.getPropertyOptions(s);this._updateState=16|this._updateState,this[s]=n._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}_requestUpdate(e,t){let n=!0;if(void 0!==e){const s=this.constructor,r=s.getPropertyOptions(e);s._valueHasChanged(this[e],t,r.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==r.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,r))):n=!1}!this._hasRequestedUpdate&&n&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const e=this.performUpdate();return null!=e&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(t){throw e=!1,this._markUpdated(),t}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}}q.finalized=!0;
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const I="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol();class K{constructor(e,t){if(t!==B)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(I?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const J={};class Z extends q{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const e=this.getStyles();if(void 0===e)this._styles=[];else if(Array.isArray(e)){const t=(e,n)=>e.reduceRight((e,n)=>Array.isArray(n)?t(n,e):(e.add(n),e),n),n=t(e,new Set),s=[];n.forEach(e=>s.unshift(e)),this._styles=s}else this._styles=[e]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?I?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){const t=this.render();super.update(e),t!==J&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){return J}}Z.finalized=!0,Z.render=(e,n,s)=>{if(!s||"object"!=typeof s||!s.scopeName)throw new Error("The `scopeName` option is required.");const r=s.scopeName,i=D.has(n),o=j&&11===n.nodeType&&!!n.host,a=o&&!R.has(r),l=a?document.createDocumentFragment():n;if(((e,n,s)=>{let r=D.get(n);void 0===r&&(t(n,n.firstChild),D.set(n,r=new M(Object.assign({templateFactory:k},s))),r.appendInto(n)),r.setValue(e),r.commit()})(e,l,Object.assign({templateFactory:U(r)},s)),a){const e=D.get(l);D.delete(l);const s=e.value instanceof _?e.value.template:void 0;$(r,l,s),t(n,n.firstChild),n.appendChild(l),D.set(n,e)}!i&&o&&window.ShadyCSS.styleElement(n.host)};var G=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,Q="[^\\s]+",X=/\[([^]*?)\]/gm;function ee(e,t){for(var n=[],s=0,r=e.length;s<r;s++)n.push(e[s].substr(0,t));return n}var te=function(e){return function(t,n){var s=n[e].map((function(e){return e.toLowerCase()})).indexOf(t.toLowerCase());return s>-1?s:null}};function ne(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];for(var s=0,r=t;s<r.length;s++){var i=r[s];for(var o in i)e[o]=i[o]}return e}var se=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],re=["January","February","March","April","May","June","July","August","September","October","November","December"],ie=ee(re,3),oe={dayNamesShort:ee(se,3),dayNames:se,monthNamesShort:ie,monthNames:re,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}},ae=ne({},oe),le=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},ce={D:function(e){return String(e.getDate())},DD:function(e){return le(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return le(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return le(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return le(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return le(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return le(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return le(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return le(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return le(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return le(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return le(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+le(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+le(Math.floor(Math.abs(t)/60),2)+":"+le(Math.abs(t)%60,2)}},de=function(e){return+e-1},ue=[null,"[1-9]\\d?"],he=[null,Q],pe=["isPm",Q,function(e,t){var n=e.toLowerCase();return n===t.amPm[0]?0:n===t.amPm[1]?1:null}],me=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(e){var t=(e+"").match(/([+-]|\d\d)/gi);if(t){var n=60*+t[1]+parseInt(t[2],10);return"+"===t[0]?n:-n}return 0}],ge=(te("monthNamesShort"),te("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var fe=function(e,t,n){if(void 0===t&&(t=ge.default),void 0===n&&(n={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var s=[];t=(t=ge[t]||t).replace(X,(function(e,t){return s.push(t),"@@@"}));var r=ne(ne({},ae),n);return(t=t.replace(G,(function(t){return ce[t](e,r)}))).replace(/@@@/g,(function(){return s.shift()}))};(function(){try{(new Date).toLocaleDateString("i")}catch(e){return"RangeError"===e.name}})(),function(){try{(new Date).toLocaleString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}}();var _e={name:"Meteoalarm-Karte",description:"Die Meteoalarm-Karte warnt dich vor bevorstehenden Wetterereignissen.",not_available:"Meteoalarm ist nicht verfügbar"},ve={missing_entity:"Die angegebene Entität ist nicht vorhanden!"},ye={no_warnings:"Keine Warnungen",wind:"Wind",snow_ice:"Schnee/Eis",thunderstorms:"Gewitter",fog:"Nebel",hight_temperature:"Extrem hohe Temperaturen",low_temperature:"Extrem niedrige Temperaturen",coastal_event:"Küstenereignis",forest_fire:"Waldbrand",avalanches:"Lawinen",rain:"Regen",flood:"Überflutung",rain_flood:"Regenüberflutung"},we={yellow:"{0} der Warnstufe Gelb",orange:"{0} der Warnstufe Orange",red:"{0} der Warnstufe Rot"},Se={common:_e,error:ve,events:ye,messages:we},be=Object.freeze({__proto__:null,common:_e,error:ve,events:ye,messages:we,default:Se}),xe={name:"Meteoalarm Card",description:"Meteoalarm card warns you about current weather events.",not_available:"Meteoalarm is not available"},Me={missing_entity:"Specifying entity is required!"},Pe={no_warnings:"No warnings",wind:"wind",snow_ice:"snow/ice",thunderstorms:"thunderstorms",fog:"fog",hight_temperature:"extreme high temperature",low_temperature:"extreme low temperature",coastal_event:"coastal event",forest_fire:"forest fire",avalanches:"avalanches",rain:"rain",flood:"flood",rain_flood:"rain flood"},Ne={yellow:"Yellow {0} warning",orange:"Orange {0} warning",red:"Red {0} warning"},Ce={common:xe,error:Me,events:Pe,messages:Ne},Ae=Object.freeze({__proto__:null,common:xe,error:Me,events:Pe,messages:Ne,default:Ce}),Te={name:"Carte Meteoalarm",description:"Carte Meteoalarm vous alerte des conditions météorologique courante.",not_available:"Meteoalarm n'est pas disponible"},Ee={missing_entity:"L'entité est requise!"},ke={no_warnings:"Aucune alerte",wind:"vent",snow_ice:"neige/verglas",thunderstorms:"orages",fog:"brouillard",hight_temperature:"température extrêmement élevée",low_temperature:"température extrêmement basse",coastal_event:"événement côtier",forest_fire:"feu de forêt",avalanches:"avalanches",rain:"pluie",flood:"inondation",rain_flood:"pluie d'inondation"},Oe={yellow:"Alerte jaune {0}",orange:"Alerte orange {0}",red:"Alerte rouge {0}"},De={common:Te,error:Ee,events:ke,messages:Oe},ze=Object.freeze({__proto__:null,common:Te,error:Ee,events:ke,messages:Oe,default:De}),Ve={name:"Scheda Meteoalarm",description:"La scheda Meteoalarm ti informa degli eventi meteorologici in corso.",not_available:"Meteoalarm non è disponibile"},Ye={missing_entity:"È necessario specificare un'entità!"},je={no_warnings:"Nessun allarme",wind:"vento",snow_ice:"neve/ghiaccio",thunderstorms:"temporali",fog:"nebbia",hight_temperature:"alte temperature",low_temperature:"basse temperature",coastal_event:"eventi costieri",forest_fire:"incendi boschivi",avalanches:"valanghe",rain:"pioggia",flood:"inondazioni",rain_flood:"acquazzoni"},Ue={yellow:"Allarme Giallo {0}",orange:"Allarme Arancione {0}",red:"Allarme Rosso {0}"},He={common:Ve,error:Ye,events:je,messages:Ue},Re=Object.freeze({__proto__:null,common:Ve,error:Ye,events:je,messages:Ue,default:He}),$e={name:"Meteoalarm Kaart",description:"Meteoalarm kaart waarschuwt u voor actuele weersomstandigheden.",not_available:"Meteoalarm is niet beschikbaar"},Le={missing_entity:"Het specificeren van de entiteit is vereist!"},We={no_warnings:"Geen waarschuwingen",wind:"wind",snow_ice:"sneeuw/ijzel/bevriezing",thunderstorms:"onweer",fog:"mist",hight_temperature:"hitte",low_temperature:"koude",coastal_event:"kustbedreiging",forest_fire:"bos- en heidebranden",avalanches:"lawines",rain:"regen",flood:"hoogwater",rain_flood:"wateroverlast"},Fe={yellow:"Geel {0} waarschuwing",orange:"Oranje {0} waarschuwing",red:"Rood {0} waarschuwing"},qe={common:$e,error:Le,events:We,messages:Fe},Ie={name:"Karta Meteoalarm",description:"Meteoalarm ostrzega cię przed aktualnymi zdarzeniami pogodowymi.",not_available:"Meteoalarm nie jest dostępny"},Be={missing_entity:"Podanie encji jest wymagane!"},Ke={no_warnings:"Brak ostrzeżeń",wind:"wiatr",snow_ice:"śnieg/oblodzenie",thunderstorms:"burze",fog:"mgły",hight_temperature:"upały",low_temperature:"silne Mrozy",coastal_event:"zjawiska strefy brzegowej",forest_fire:"pożary lasu",avalanches:"lawiny",rain:"deszcz",flood:"powodzie",rain_flood:"ulewy"},Je={yellow:"Żółty alert na {0}",orange:"Pomarańczowy alert na {0}",red:"Czerwony alert na {0}"},Ze={common:Ie,error:Be,events:Ke,messages:Je},Ge={name:"Ohtlike ilmanähtuste kaart",description:"Ohtlike ilmanähtuste kaart hoiatab ilmaohtude eest.",not_available:"Meteoalarm pole saadaval"},Qe={missing_entity:"Vajalik on Meteoalarmi olem!"},Xe={no_warnings:"Hoiatusi hetkel pole",wind:"tugev tuul",snow_ice:"lumi/jää",thunderstorms:"äike",fog:"udu",hight_temperature:"kuumalaine",low_temperature:"külmalaine",coastal_event:"rannikumeri",forest_fire:"metsapõleng",avalanches:"laviin",rain:"sademed",flood:"üleujutus",rain_flood:"paduvihm"},et={yellow:"Kollane hoiatus {0}",orange:"Oranž hoiatus {0}",red:"Punane hoiatus {0}"},tt={common:Ge,error:Qe,events:Xe,messages:et},nt={de:be,en:Ae,nl:Object.freeze({__proto__:null,common:$e,error:Le,events:We,messages:Fe,default:qe}),pl:Object.freeze({__proto__:null,common:Ie,error:Be,events:Ke,messages:Je,default:Ze}),et:Object.freeze({__proto__:null,common:Ge,error:Qe,events:Xe,messages:et,default:tt}),fr:ze,it:Re};function st(e,t,n){const[s,r]=e.toLowerCase().split(".");let i;try{i=JSON.parse(localStorage.getItem("selectedLanguage"))}catch(e){i=localStorage.getItem("selectedLanguage")}const o=(i||navigator.language.split("-")[0]||"en").replace(/['"]+/g,"").replace("-","_");let a;try{a=nt[o][s][r]}catch(e){a=nt.en[s][r]}if(void 0===a&&(a=nt.en[s][r]),void 0!==a)return""!==t&&""!==n&&(a=a.replace(t,n)),a}var rt=((e,...t)=>{const n=t.reduce((t,n,s)=>t+(e=>{if(e instanceof K)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+e[s+1],e[0]);return new K(n,B)})`
  :host 
  {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  ha-card 
  {
    flex-direction: column;
    flex: 1;
    position: relative;
    padding: 0px;
    border-radius: 4px;
    overflow: hidden;
  }

  .container 
  {
    background: var(--card-background-color);
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }

  .content
  {
    display: flex;
    padding: 32px 28px;
  }

  .main-icon 
  {
    --mdc-icon-size: 50px;
    height: 50px;
    flex: 0;
    margin-right: 18px;
  }

  .status
  {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 22px;
    line-height: normal;
    margin: auto;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;class it{constructor(e,t,n){this.name=e,this.icon=t,this.translationKey=n}}class ot{constructor(e,t,n){this.name=e,this.color=t,this.translationKey=n}}const at=[new it("Wind","windsock","events.wind"),new it("Snow/Ice","weather-snowy-heavy","events.snow_ice"),new it("Thunderstorms","weather-lightning","events.thunderstorms"),new it("Fog","weather-fog","events.fog"),new it("Extreme high temperature","thermometer-chevron-up",'events."hight_temperature'),new it("Extreme low temperature","snowflake","events.low_temperature"),new it("Coastal Event","waves","events.coastal_event"),new it("Forestfire","pine-tree-fire","events.forest_fire"),new it("Avalanches","image-filter-hdr","events.avalanches"),new it("Rain","weather-pouring","events.rain"),new it("Flood","home-flood","events.flood"),new it("Rain-Flood","weather-pouring","events.rain_flood")],lt=[new ot("Yellow","#ff9800","messages.yellow"),new ot("Orange","#EE5A24","messages.orange"),new ot("Red","#db4437","messages.red")];customElements.define("meteoalarm-card",class extends Z{static get properties(){return{hass:Object,config:Object,requestInProgress:Boolean}}static get styles(){return rt}static getStubConfig(e,t){const[n]=t.filter(e=>e.includes("meteoalarm"));return{entity:n||""}}get entity(){return this.hass.states[this.config.entity]}setConfig(e){if(!e.entity)throw new Error(st("error.missing_entity"));this.config=e}getCardSize(){return 2}shouldUpdate(e){return function(e,t,n){if(t.has("config")||n)return!0;if(e.config.entity){var s=t.get("hass");return!s||s.states[e.config.entity]!==e.hass.states[e.config.entity]}return!1}(this,e)}updated(e){e.get("hass")&&e.get("hass").states[this.config.entity].state!==this.hass.states[this.config.entity].state&&(this.requestInProgress=!1)}handleMore(){!function(e,t,n,s){s=s||{},n=null==n?{}:n;var r=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});r.detail=n,e.dispatchEvent(r)}(this,"hass-more-info",{entityId:this.entity.entity_id},{bubbles:!0,composed:!0})}getAttributes(e){const{status:t,state:n,event:s,headline:r,awareness_type:i,awareness_level:o}=e.attributes;let a={isWarningActive:"off"!=(t||n||e.state)};return a.isWarningActive&&(a=o.includes(";")?{...a,headline:s||r,awarenessLevel:lt[Number(o.split(";")[0])-2],awarenessType:at[Number(i.split(";")[0])-2]}:{...a,awarenessLevel:lt.find(e=>e.name==o),awarenessType:at.find(e=>e.name==i)}),null==a.headline&&a.isWarningActive&&(a.headline=this.generateHeadline(a.awarenessType,a.awarenessLevel)),a}generateHeadline(e,t){return st(t.translationKey).replace("{0}",st(e.translationKey))}getBackgroundColor(){const{isWarningActive:e,awarenessLevel:t}=this.getAttributes(this.entity);return e?t.color:"inherit"}getFontColor(){const{isWarningActive:e}=this.getAttributes(this.entity);return e?"#fff":"--primary-text-color"}renderIcon(){let e="";if(this.entity){const{isWarningActive:t,awarenessType:n}=this.getAttributes(this.entity);e=t?n.icon:"shield-outline"}else e="cloud-question";return V`
			<ha-icon class="main-icon" icon="mdi:${e}"></ha-icon>
		`}renderStatus(){const{isWarningActive:e,headline:t}=this.getAttributes(this.entity);return e?V`
				<div class="status"> 
					${t}
				</div> 
			`:V`
				<div class="status"> 
					${st("events.no_warnings")}
				</div> 
			`}render(){return this.entity?V`
			<ha-card>
				<div 
					class="container"
					style="background-color: ${this.getBackgroundColor()}; color: ${this.getFontColor()};"
					@click="${()=>this.handleMore()}"
					?more-info="true" 
				>
					<div class="content">
						${this.renderIcon()} ${this.renderStatus()}
					</div>
				</div>
			</ha-card>
		`:V`
			  <ha-card>
				<div class="container">
					<div class="content"> 
						${this.renderIcon()}
						<div class="status"> 
							${st("common.not_available")}
						</div>
					</div> 
				</div>
			  </ha-card>
			`}}),window.customCards=window.customCards||[],window.customCards.push({preview:!0,type:"meteoalarm-card",name:st("common.name"),description:st("common.description")});
