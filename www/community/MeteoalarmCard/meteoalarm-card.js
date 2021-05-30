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
const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,t=(e,t,n=null)=>{for(;t!==n;){const n=t.nextSibling;e.removeChild(t),t=n}},n=`{{lit-${String(Math.random()).slice(2)}}}`,r=`\x3c!--${n}--\x3e`,i=new RegExp(`${n}|${r}`);class s{constructor(e,t){this.parts=[],this.element=t;const r=[],s=[],a=document.createTreeWalker(t.content,133,null,!1);let u=0,d=-1,h=0;const{strings:p,values:{length:m}}=e;for(;h<m;){const e=a.nextNode();if(null!==e){if(d++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:n}=t;let r=0;for(let e=0;e<n;e++)o(t[e].name,"$lit$")&&r++;for(;r-- >0;){const t=p[h],n=c.exec(t)[2],r=n.toLowerCase()+"$lit$",s=e.getAttribute(r);e.removeAttribute(r);const o=s.split(i);this.parts.push({type:"attribute",index:d,name:n,strings:o}),h+=o.length-1}}"TEMPLATE"===e.tagName&&(s.push(e),a.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(n)>=0){const n=e.parentNode,s=t.split(i),a=s.length-1;for(let t=0;t<a;t++){let r,i=s[t];if(""===i)r=l();else{const e=c.exec(i);null!==e&&o(e[2],"$lit$")&&(i=i.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),r=document.createTextNode(i)}n.insertBefore(r,e),this.parts.push({type:"node",index:++d})}""===s[a]?(n.insertBefore(l(),e),r.push(e)):e.data=s[a],h+=a}}else if(8===e.nodeType)if(e.data===n){const t=e.parentNode;null!==e.previousSibling&&d!==u||(d++,t.insertBefore(l(),e)),u=d,this.parts.push({type:"node",index:d}),null===e.nextSibling?e.data="":(r.push(e),d--),h++}else{let t=-1;for(;-1!==(t=e.data.indexOf(n,t+1));)this.parts.push({type:"node",index:-1}),h++}}else a.currentNode=s.pop()}for(const e of r)e.parentNode.removeChild(e)}}const o=(e,t)=>{const n=e.length-t.length;return n>=0&&e.slice(n)===t},a=e=>-1!==e.index,l=()=>document.createComment(""),c=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function u(e,t){const{element:{content:n},parts:r}=e,i=document.createTreeWalker(n,133,null,!1);let s=h(r),o=r[s],a=-1,l=0;const c=[];let u=null;for(;i.nextNode();){a++;const e=i.currentNode;for(e.previousSibling===u&&(u=null),t.has(e)&&(c.push(e),null===u&&(u=e)),null!==u&&l++;void 0!==o&&o.index===a;)o.index=null!==u?-1:o.index-l,s=h(r,s),o=r[s]}c.forEach(e=>e.parentNode.removeChild(e))}const d=e=>{let t=11===e.nodeType?0:1;const n=document.createTreeWalker(e,133,null,!1);for(;n.nextNode();)t++;return t},h=(e,t=-1)=>{for(let n=t+1;n<e.length;n++){const t=e[n];if(a(t))return n}return-1};
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
class _{constructor(e,t,n){this.__parts=[],this.template=e,this.processor=t,this.options=n}update(e){let t=0;for(const n of this.__parts)void 0!==n&&n.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),n=[],r=this.template.parts,i=document.createTreeWalker(t,133,null,!1);let s,o=0,l=0,c=i.nextNode();for(;o<r.length;)if(s=r[o],a(s)){for(;l<s.index;)l++,"TEMPLATE"===c.nodeName&&(n.push(c),i.currentNode=c.content),null===(c=i.nextNode())&&(i.currentNode=n.pop(),c=i.nextNode());if("node"===s.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(c.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,s.name,s.strings,this.options));o++}else this.__parts.push(void 0),o++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const v=` ${n} `;class y{constructor(e,t,n,r){this.strings=e,this.values=t,this.type=n,this.processor=r}getHTML(){const e=this.strings.length-1;let t="",i=!1;for(let s=0;s<e;s++){const e=this.strings[s],o=e.lastIndexOf("\x3c!--");i=(o>-1||i)&&-1===e.indexOf("--\x3e",o+1);const a=c.exec(e);t+=null===a?e+(i?v:r):e.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+n}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}
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
 */const w=e=>null===e||!("object"==typeof e||"function"==typeof e),b=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class S{constructor(e,t,n){this.dirty=!0,this.element=e,this.name=t,this.strings=n,this.parts=[];for(let e=0;e<n.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new x(this)}_getValue(){const e=this.strings,t=e.length-1;let n="";for(let r=0;r<t;r++){n+=e[r];const t=this.parts[r];if(void 0!==t){const e=t.value;if(w(e)||!b(e))n+="string"==typeof e?e:String(e);else for(const t of e)n+="string"==typeof t?t:String(t)}}return n+=e[t],n}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===g||w(e)&&e===this.value||(this.value=e,m(e)||(this.committer.dirty=!0))}commit(){for(;m(this.value);){const e=this.value;this.value=g,e(this)}this.value!==g&&this.committer.commit()}}class M{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(l()),this.endNode=e.appendChild(l())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=l()),e.__insert(this.endNode=l())}insertAfterPart(e){e.__insert(this.startNode=l()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(null===this.startNode.parentNode)return;for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}const e=this.__pendingValue;e!==g&&(w(e)?e!==this.value&&this.__commitText(e):e instanceof y?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):b(e)?this.__commitIterable(e):e===f?(this.value=f,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,n="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=n:this.__commitNode(document.createTextNode(n)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof _&&this.value.template===t)this.value.update(e.values);else{const n=new _(t,e.processor,this.options),r=n._clone();n.update(e.values),this.__commitNode(r),this.value=n}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let n,r=0;for(const i of e)n=t[r],void 0===n&&(n=new M(this.options),t.push(n),0===r?n.appendIntoPart(this):n.insertAfterPart(t[r-1])),n.setValue(i),n.commit(),r++;r<t.length&&(t.length=r,this.clear(n&&n.endNode))}clear(e=this.startNode){t(this.startNode.parentNode,e.nextSibling,this.endNode)}}class E{constructor(e,t,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=n}setValue(e){this.__pendingValue=e}commit(){for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=g}}class A extends S{constructor(e,t,n){super(e,t,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new O(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class O extends x{}let C=!1;(()=>{try{const e={get capture(){return C=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}})();class N{constructor(e,t,n){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=n,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;m(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=this.__pendingValue,t=this.value,n=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),r=null!=e&&(null==t||n);n&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),r&&(this.__options=P(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=g}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const P=e=>e&&(C?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
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
 */;function T(e){let t=j.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},j.set(e.type,t));let r=t.stringsArray.get(e.strings);if(void 0!==r)return r;const i=e.strings.join(n);return r=t.keyString.get(i),void 0===r&&(r=new s(e,e.getTemplateElement()),t.keyString.set(i,r)),t.stringsArray.set(e.strings,r),r}const j=new Map,k=new WeakMap;
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
 */const $=new
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
class{handleAttributeExpressions(e,t,n,r){const i=t[0];if("."===i){return new A(e,t.slice(1),n).parts}return"@"===i?[new N(e,t.slice(1),r.eventContext)]:"?"===i?[new E(e,t.slice(1),n)]:new S(e,t,n).parts}handleTextExpression(e){return new M(e)}};
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
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const V=(e,...t)=>new y(e,t,"html",$)
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
 */,R=(e,t)=>`${e}--${t}`;let z=!0;void 0===window.ShadyCSS?z=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),z=!1);const D=e=>t=>{const r=R(t.type,e);let i=j.get(r);void 0===i&&(i={stringsArray:new WeakMap,keyString:new Map},j.set(r,i));let o=i.stringsArray.get(t.strings);if(void 0!==o)return o;const a=t.strings.join(n);if(o=i.keyString.get(a),void 0===o){const n=t.getTemplateElement();z&&window.ShadyCSS.prepareTemplateDom(n,e),o=new s(t,n),i.keyString.set(a,o)}return i.stringsArray.set(t.strings,o),o},L=["html","svg"],q=new Set,H=(e,t,n)=>{q.add(e);const r=n?n.element:document.createElement("template"),i=t.querySelectorAll("style"),{length:s}=i;if(0===s)return void window.ShadyCSS.prepareTemplateStyles(r,e);const o=document.createElement("style");for(let e=0;e<s;e++){const t=i[e];t.parentNode.removeChild(t),o.textContent+=t.textContent}(e=>{L.forEach(t=>{const n=j.get(R(t,e));void 0!==n&&n.keyString.forEach(e=>{const{element:{content:t}}=e,n=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{n.add(e)}),u(e,n)})})})(e);const a=r.content;n?function(e,t,n=null){const{element:{content:r},parts:i}=e;if(null==n)return void r.appendChild(t);const s=document.createTreeWalker(r,133,null,!1);let o=h(i),a=0,l=-1;for(;s.nextNode();){for(l++,s.currentNode===n&&(a=d(t),n.parentNode.insertBefore(t,n));-1!==o&&i[o].index===l;){if(a>0){for(;-1!==o;)i[o].index+=a,o=h(i,o);return}o=h(i,o)}}}(n,o,a.firstChild):a.insertBefore(o,a.firstChild),window.ShadyCSS.prepareTemplateStyles(r,e);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(n){a.insertBefore(o,a.firstChild);const e=new Set;e.add(o),u(n,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const W={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},U=(e,t)=>t!==e&&(t==t||e==e),Y={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:U};class I extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,n)=>{const r=this._attributeNameForProperty(n,t);void 0!==r&&(this._attributeToPropertyMap.set(r,n),e.push(r))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=Y){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const n="symbol"==typeof e?Symbol():"__"+e,r=this.getPropertyDescriptor(e,n,t);void 0!==r&&Object.defineProperty(this.prototype,e,r)}static getPropertyDescriptor(e,t,n){return{get(){return this[t]},set(n){const r=this[e];this[t]=n,this._requestUpdate(e,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||Y}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const n of t)this.createProperty(n,e[n])}}static _attributeNameForProperty(e,t){const n=t.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,n=U){return n(e,t)}static _propertyValueFromAttribute(e,t){const n=t.type,r=t.converter||W,i="function"==typeof r?r:r.fromAttribute;return i?i(e,n):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const n=t.type,r=t.converter;return(r&&r.toAttribute||W.toAttribute)(e,n)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,n){t!==n&&this._attributeToProperty(e,n)}_propertyToAttribute(e,t,n=Y){const r=this.constructor,i=r._attributeNameForProperty(e,n);if(void 0!==i){const e=r._propertyValueToAttribute(t,n);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(i):this.setAttribute(i,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const n=this.constructor,r=n._attributeToPropertyMap.get(e);if(void 0!==r){const e=n.getPropertyOptions(r);this._updateState=16|this._updateState,this[r]=n._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}_requestUpdate(e,t){let n=!0;if(void 0!==e){const r=this.constructor,i=r.getPropertyOptions(e);r._valueHasChanged(this[e],t,i.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==i.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,i))):n=!1}!this._hasRequestedUpdate&&n&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const e=this.performUpdate();return null!=e&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(t){throw e=!1,this._markUpdated(),t}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}}I.finalized=!0;
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
const F="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol();class K{constructor(e,t){if(t!==B)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(F?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const J=(e,...t)=>{const n=t.reduce((t,n,r)=>t+(e=>{if(e instanceof K)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+e[r+1],e[0]);return new K(n,B)};
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const G={};class Z extends I{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const e=this.getStyles();if(void 0===e)this._styles=[];else if(Array.isArray(e)){const t=(e,n)=>e.reduceRight((e,n)=>Array.isArray(n)?t(n,e):(e.add(n),e),n),n=t(e,new Set),r=[];n.forEach(e=>r.unshift(e)),this._styles=r}else this._styles=[e]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?F?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){const t=this.render();super.update(e),t!==G&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){return G}}Z.finalized=!0,Z.render=(e,n,r)=>{if(!r||"object"!=typeof r||!r.scopeName)throw new Error("The `scopeName` option is required.");const i=r.scopeName,s=k.has(n),o=z&&11===n.nodeType&&!!n.host,a=o&&!q.has(i),l=a?document.createDocumentFragment():n;if(((e,n,r)=>{let i=k.get(n);void 0===i&&(t(n,n.firstChild),k.set(n,i=new M(Object.assign({templateFactory:T},r))),i.appendInto(n)),i.setValue(e),i.commit()})(e,l,Object.assign({templateFactory:D(i)},r)),a){const e=k.get(l);k.delete(l);const r=e.value instanceof _?e.value.template:void 0;H(i,l,r),t(n,n.firstChild),n.appendChild(l),k.set(n,e)}!s&&o&&window.ShadyCSS.styleElement(n.host)};var Q=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,X="[^\\s]+",ee=/\[([^]*?)\]/gm;function te(e,t){for(var n=[],r=0,i=e.length;r<i;r++)n.push(e[r].substr(0,t));return n}var ne=function(e){return function(t,n){var r=n[e].map((function(e){return e.toLowerCase()})).indexOf(t.toLowerCase());return r>-1?r:null}};function re(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];for(var r=0,i=t;r<i.length;r++){var s=i[r];for(var o in s)e[o]=s[o]}return e}var ie=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],se=["January","February","March","April","May","June","July","August","September","October","November","December"],oe=te(se,3),ae={dayNamesShort:te(ie,3),dayNames:ie,monthNamesShort:oe,monthNames:se,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}},le=re({},ae),ce=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},ue={D:function(e){return String(e.getDate())},DD:function(e){return ce(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return ce(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return ce(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return ce(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return ce(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return ce(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return ce(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return ce(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return ce(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return ce(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return ce(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ce(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ce(Math.floor(Math.abs(t)/60),2)+":"+ce(Math.abs(t)%60,2)}},de=function(e){return+e-1},he=[null,"[1-9]\\d?"],pe=[null,X],me=["isPm",X,function(e,t){var n=e.toLowerCase();return n===t.amPm[0]?0:n===t.amPm[1]?1:null}],ge=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(e){var t=(e+"").match(/([+-]|\d\d)/gi);if(t){var n=60*+t[1]+parseInt(t[2],10);return"+"===t[0]?n:-n}return 0}],fe=(ne("monthNamesShort"),ne("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var _e=function(e,t,n){if(void 0===t&&(t=fe.default),void 0===n&&(n={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var r=[];t=(t=fe[t]||t).replace(ee,(function(e,t){return r.push(t),"@@@"}));var i=re(re({},le),n);return(t=t.replace(Q,(function(t){return ue[t](e,i)}))).replace(/@@@/g,(function(){return r.shift()}))},ve=(function(){try{(new Date).toLocaleDateString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}}(),function(e,t,n,r){r=r||{},n=null==n?{}:n;var i=new Event(t,{bubbles:void 0===r.bubbles||r.bubbles,cancelable:Boolean(r.cancelable),composed:void 0===r.composed||r.composed});return i.detail=n,e.dispatchEvent(i),i});var ye={name:"Meteoalarm-Karte",description:"Die Meteoalarm-Karte warnt dich vor bevorstehenden Wetterereignissen.",not_available:"Meteoalarm ist nicht verfügbar"},we={missing_entity:"Die angegebene Entität ist nicht vorhanden!",invalid_integration:null,automatic_failed:null,entity_not_supported:null},be={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},Se={no_warnings:"Keine Warnungen",wind:"Wind",snow_ice:"Schnee/Eis",thunderstorms:"Gewitter",fog:"Nebel",hight_temperature:"Extrem hohe Temperaturen",low_temperature:"Extrem niedrige Temperaturen",coastal_event:"Küstenereignis",forest_fire:"Waldbrand",avalanches:"Lawinen",rain:"Regen",flood:"Überflutung",rain_flood:"Regenüberflutung"},xe={yellow:"{0} der Warnstufe Gelb",orange:"{0} der Warnstufe Orange",red:"{0} der Warnstufe Rot"},Me={$schema:"./schema.json",common:ye,error:we,editor:be,events:Se,messages:xe},Ee=Object.freeze({__proto__:null,$schema:"./schema.json",common:ye,error:we,editor:be,events:Se,messages:xe,default:Me}),Ae={name:"Meteoalarm Card",description:"Meteoalarm card warns you about current weather events.",not_available:"Meteoalarm is not available"},Oe={missing_entity:"Specifying entity is required!",invalid_integration:"This integration is not valid!",automatic_failed:"Failed to automatically detect integration!",entity_not_supported:"This integration doesn't support provided entity!"},Ce={entity:"Entity",integration:"Integration",required:"Required",automatic:"Automatic",recommended:"Recommended",override_headline:"Override headline"},Ne={no_warnings:"No warnings",wind:"wind",snow_ice:"snow/ice",thunderstorms:"thunderstorms",fog:"fog",hight_temperature:"extreme high temperature",low_temperature:"extreme low temperature",coastal_event:"coastal event",forest_fire:"forest fire",avalanches:"avalanches",rain:"rain",flood:"flood",rain_flood:"rain flood"},Pe={yellow:"Yellow {0} warning",orange:"Orange {0} warning",red:"Red {0} warning"},Te={$schema:"./schema.json",common:Ae,error:Oe,editor:Ce,events:Ne,messages:Pe},je=Object.freeze({__proto__:null,$schema:"./schema.json",common:Ae,error:Oe,editor:Ce,events:Ne,messages:Pe,default:Te}),ke={name:"Carte Meteoalarm",description:"Carte Meteoalarm vous alerte des conditions météorologique courante.",not_available:"Meteoalarm n'est pas disponible"},$e={missing_entity:"L'entité est requise!",invalid_integration:null,automatic_failed:null,entity_not_supported:null},Ve={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},Re={no_warnings:"Aucune alerte",wind:"vent",snow_ice:"neige/verglas",thunderstorms:"orages",fog:"brouillard",hight_temperature:"température extrêmement élevée",low_temperature:"température extrêmement basse",coastal_event:"événement côtier",forest_fire:"feu de forêt",avalanches:"avalanches",rain:"pluie",flood:"inondation",rain_flood:"pluie/inondation"},ze={yellow:"Alerte jaune {0}",orange:"Alerte orange {0}",red:"Alerte rouge {0}"},De={$schema:"./schema.json",common:ke,error:$e,editor:Ve,events:Re,messages:ze},Le=Object.freeze({__proto__:null,$schema:"./schema.json",common:ke,error:$e,editor:Ve,events:Re,messages:ze,default:De}),qe={name:"Scheda Meteoalarm",description:"La scheda Meteoalarm ti informa degli eventi meteorologici in corso.",not_available:"Meteoalarm non è disponibile"},He={missing_entity:"È necessario specificare un'entità!",invalid_integration:null,automatic_failed:null,entity_not_supported:null},We={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},Ue={no_warnings:"Nessun allarme",wind:"vento",snow_ice:"neve/ghiaccio",thunderstorms:"temporali",fog:"nebbia",hight_temperature:"alte temperature",low_temperature:"basse temperature",coastal_event:"eventi costieri",forest_fire:"incendi boschivi",avalanches:"valanghe",rain:"pioggia",flood:"inondazioni",rain_flood:"acquazzoni"},Ye={yellow:"Allarme Giallo {0}",orange:"Allarme Arancione {0}",red:"Allarme Rosso {0}"},Ie={$schema:"./schema.json",common:qe,error:He,editor:We,events:Ue,messages:Ye},Fe=Object.freeze({__proto__:null,$schema:"./schema.json",common:qe,error:He,editor:We,events:Ue,messages:Ye,default:Ie}),Be={name:"Meteoalarm Kaart",description:"Meteoalarm kaart waarschuwt u voor actuele weersomstandigheden.",not_available:"Meteoalarm is niet beschikbaar"},Ke={missing_entity:"Het specificeren van de entiteit is vereist!",invalid_integration:"Deze integratie is niet geldig!",automatic_failed:null,entity_not_supported:null},Je={entity:"Entiteit",integration:"Integratie",required:"Verplicht",automatic:"Automatisch",recommended:"Aanbevolen",override_headline:"Koptekst overschrijven"},Ge={no_warnings:"Geen waarschuwingen",wind:"wind",snow_ice:"sneeuw/ijzel/bevriezing",thunderstorms:"onweer",fog:"mist",hight_temperature:"hitte",low_temperature:"koude",coastal_event:"kustbedreiging",forest_fire:"bos- en heidebranden",avalanches:"lawines",rain:"regen",flood:"hoogwater",rain_flood:"wateroverlast"},Ze={yellow:"Waarschuwing geel {0}",orange:"Waarschuwing oranje {0}",red:"Waarschuwing rood {0}"},Qe={$schema:"./schema.json",common:Be,error:Ke,editor:Je,events:Ge,messages:Ze},Xe={name:"Karta Meteoalarm",description:"Meteoalarm ostrzega cię przed aktualnymi zdarzeniami pogodowymi.",not_available:"Meteoalarm nie jest dostępny"},et={missing_entity:"Podanie encji jest wymagane!",invalid_integration:"Nieprawidłowa integracja!",automatic_failed:"Bład automatycznego wykrywania integracji!",entity_not_supported:"Ta integracja nie wspiera podanej encji!"},tt={entity:"Encja",integration:"Integracja",required:"Wymagane",automatic:"Automatyczne",recommended:"Zalecane",override_headline:"Nadpisz nagłówek"},nt={no_warnings:"Brak ostrzeżeń",wind:"wiatr",snow_ice:"śnieg/oblodzenie",thunderstorms:"burze",fog:"mgły",hight_temperature:"upały",low_temperature:"silne Mrozy",coastal_event:"zjawiska strefy brzegowej",forest_fire:"pożary lasu",avalanches:"lawiny",rain:"deszcz",flood:"powodzie",rain_flood:"ulewy"},rt={yellow:"Żółty alert na {0}",orange:"Pomarańczowy alert na {0}",red:"Czerwony alert na {0}"},it={$schema:"./schema.json",common:Xe,error:et,editor:tt,events:nt,messages:rt},st={name:"Ohtlike ilmanähtuste kaart",description:"Äärmuslike ilmaolude hoiatus.",not_available:"Meteoalarm pole saadaval"},ot={missing_entity:"Vajalik on Meteoalarmi olem!",invalid_integration:"Meteoalarmi sidumine on vale!",automatic_failed:null,entity_not_supported:null},at={entity:"Olem",integration:"Sidumine",required:"Nõutav",automatic:"Vaikimisi",recommended:"Soovituslik",override_headline:"Pealdise alistamine"},lt={no_warnings:"Hoiatusi hetkel pole",wind:"tugev tuul",snow_ice:"lumi või jää",thunderstorms:"äike",fog:"udu",hight_temperature:"kuumalaine",low_temperature:"külmalaine",coastal_event:"rannikumeri",forest_fire:"metsapõleng",avalanches:"laviin",rain:"sademed",flood:"üleujutus",rain_flood:"paduvihm"},ct={yellow:"Kollane hoiatus {0}",orange:"Oranž hoiatus {0}",red:"Punane hoiatus {0}"},ut={$schema:"./schema.json",common:st,error:ot,editor:at,events:lt,messages:ct},dt={name:"Tarjeta Meteoalarm",description:"La tarjeta Meteoalarm le advierte sobre eventos meteorológicos actuales.",not_available:"Meteoalarm no está disponible"},ht={missing_entity:"¡Se requiere especificar la entidad!",invalid_integration:"¡Esta integración no es válida!",automatic_failed:null,entity_not_supported:null},pt={entity:"Entidad",integration:"Integración",required:"Necesario",automatic:"Automático",recommended:"Recomendado",override_headline:"Sobreescribir cabecera"},mt={no_warnings:"Sin avisos",wind:"viento",snow_ice:"nieve/hielo",thunderstorms:"tormentas",fog:"niebla",hight_temperature:"temperatura máxima extrema",low_temperature:"temperatura mínima extrema",coastal_event:"fenómeno costero",forest_fire:"incendios",avalanches:"aludes",rain:"lluvia",flood:"inundación",rain_flood:"inundación de lluvia"},gt={yellow:"Alerta amarilla por {0}",orange:"Alerta naranja por {0}",red:"Alerta roja {0}"},ft={$schema:"./schema.json",common:dt,error:ht,editor:pt,events:mt,messages:gt},_t={de:Ee,en:je,nl:Object.freeze({__proto__:null,$schema:"./schema.json",common:Be,error:Ke,editor:Je,events:Ge,messages:Ze,default:Qe}),pl:Object.freeze({__proto__:null,$schema:"./schema.json",common:Xe,error:et,editor:tt,events:nt,messages:rt,default:it}),et:Object.freeze({__proto__:null,$schema:"./schema.json",common:st,error:ot,editor:at,events:lt,messages:ct,default:ut}),fr:Le,it:Fe,es:Object.freeze({__proto__:null,$schema:"./schema.json",common:dt,error:ht,editor:pt,events:mt,messages:gt,default:ft})};function vt(e){const[t,n]=e.toLowerCase().split(".");let r;try{r=JSON.parse(localStorage.getItem("selectedLanguage"))}catch(e){r=localStorage.getItem("selectedLanguage")}const i=(r||navigator.language.split("-")[0]||"en").replace(/['"]+/g,"").replace("-","_");let s;try{s=_t[i][t][n]}catch(e){s=_t.en[t][n]}return null==s&&(s=_t.en[t][n]||e.toLowerCase()),s}customElements.define("meteoalarm-card-editor",class extends Z{static get properties(){return{hass:Object,_config:Object,_toggle:Boolean}}get _integrations(){return{automatic:`${vt("editor.automatic")} (${vt("editor.recommended")})`,meteoalarm:"Core Meteoalarm",meteofrance:"Core Météo-France",meteoalarmeu:"Custom MeteoalarmEU"}}setConfig(e){this._config=e}get _entity(){return this._config&&this._config.entity||""}get _integration(){return this._config?this._config.integration||"automatic":""}get _override_headline(){return this._config?this._config.override_headline||!1:""}render(){return this.hass?V`
      		<div class="card-config">
			  	<!-- Enity Selector -->
				<ha-entity-picker
					label=${`${vt("editor.entity")} (${vt("editor.required")})`}
					.hass=${this.hass}
					.value=${this._entity}
					.configValue=${"entity"}
					@value-changed=${this._valueChanged}
					allow-custom-entity
				></ha-entity-picker>

				<!-- Integration Selector -->
				<paper-dropdown-menu
					label=${`${vt("editor.integration")} (${vt("editor.required")})`}
					@value-changed=${this._valueChanged}
					.configValue=${"integration"}
        		>
          			<paper-listbox
            			slot="dropdown-content"
            			.selected=${Object.keys(this._integrations).findIndex(e=>e===this._integration)}
          			>
            			${Object.values(this._integrations).map(e=>V`<paper-item>${e}</paper-item>`)}
          			</paper-listbox>
        		</paper-dropdown-menu>

				<!-- Override headline -->
				${"automatic"==this._integration||"meteoalarm"==this._integration?V`
					<p class="option">
						<ha-switch
							.checked=${!1!==this._override_headline}
							.configValue=${"override_headline"}
							@change=${this._valueChanged}
						>
						</ha-switch>
						${vt("editor.override_headline")}
					</p>
				`:""}
      		</div>
    	`:V``}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;let n=t.value;"integration"==t.configValue&&(n=Object.keys(this._integrations).find(e=>this._integrations[e]===n)||n),this["_"+t.configValue]!==n&&t.configValue&&""!==t.value&&(this._config={...this._config,[t.configValue]:void 0!==t.checked?t.checked:n},ve(this,"config-changed",{config:this._config}))}static get styles(){return J`
			.card-config paper-dropdown-menu {
				width: 100%;
			}

			.option {
				display: flex;
				align-items: center;
			}

			.option ha-switch {
				margin-right: 10px;
			}
		`}});var yt=J`
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
    justify-content: center;
  }

  .main-icon
  {
    --mdc-icon-size: 50px;
    height: 50px;
    flex: 0;
  }

  .status, .status-narrow, .status-both
  {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 22px;
    line-height: normal;
    margin: auto;
    margin-left: 18px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .status-narrow
  {
    display: none;
  }
  
  :host([narrow]) .status-narrow {
    display: flex;
  }

  :host([verynarrow]) .status, :host([verynarrow]) .status-narrow, , :host([verynarrow]) .status-both {
    display: none;
  }
`,wt=function(){if("undefined"!=typeof Map)return Map;function e(e,t){var n=-1;return e.some((function(e,r){return e[0]===t&&(n=r,!0)})),n}return function(){function t(){this.__entries__=[]}return Object.defineProperty(t.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),t.prototype.get=function(t){var n=e(this.__entries__,t),r=this.__entries__[n];return r&&r[1]},t.prototype.set=function(t,n){var r=e(this.__entries__,t);~r?this.__entries__[r][1]=n:this.__entries__.push([t,n])},t.prototype.delete=function(t){var n=this.__entries__,r=e(n,t);~r&&n.splice(r,1)},t.prototype.has=function(t){return!!~e(this.__entries__,t)},t.prototype.clear=function(){this.__entries__.splice(0)},t.prototype.forEach=function(e,t){void 0===t&&(t=null);for(var n=0,r=this.__entries__;n<r.length;n++){var i=r[n];e.call(t,i[1],i[0])}},t}()}(),bt="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,St="undefined"!=typeof global&&global.Math===Math?global:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),xt="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(St):function(e){return setTimeout((function(){return e(Date.now())}),1e3/60)};var Mt=["top","right","bottom","left","width","height","size","weight"],Et="undefined"!=typeof MutationObserver,At=function(){function e(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=function(e,t){var n=!1,r=!1,i=0;function s(){n&&(n=!1,e()),r&&a()}function o(){xt(s)}function a(){var e=Date.now();if(n){if(e-i<2)return;r=!0}else n=!0,r=!1,setTimeout(o,t);i=e}return a}(this.refresh.bind(this),20)}return e.prototype.addObserver=function(e){~this.observers_.indexOf(e)||this.observers_.push(e),this.connected_||this.connect_()},e.prototype.removeObserver=function(e){var t=this.observers_,n=t.indexOf(e);~n&&t.splice(n,1),!t.length&&this.connected_&&this.disconnect_()},e.prototype.refresh=function(){this.updateObservers_()&&this.refresh()},e.prototype.updateObservers_=function(){var e=this.observers_.filter((function(e){return e.gatherActive(),e.hasActive()}));return e.forEach((function(e){return e.broadcastActive()})),e.length>0},e.prototype.connect_=function(){bt&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),Et?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},e.prototype.disconnect_=function(){bt&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},e.prototype.onTransitionEnd_=function(e){var t=e.propertyName,n=void 0===t?"":t;Mt.some((function(e){return!!~n.indexOf(e)}))&&this.refresh()},e.getInstance=function(){return this.instance_||(this.instance_=new e),this.instance_},e.instance_=null,e}(),Ot=function(e,t){for(var n=0,r=Object.keys(t);n<r.length;n++){var i=r[n];Object.defineProperty(e,i,{value:t[i],enumerable:!1,writable:!1,configurable:!0})}return e},Ct=function(e){return e&&e.ownerDocument&&e.ownerDocument.defaultView||St},Nt=Vt(0,0,0,0);function Pt(e){return parseFloat(e)||0}function Tt(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return t.reduce((function(t,n){return t+Pt(e["border-"+n+"-width"])}),0)}function jt(e){var t=e.clientWidth,n=e.clientHeight;if(!t&&!n)return Nt;var r=Ct(e).getComputedStyle(e),i=function(e){for(var t={},n=0,r=["top","right","bottom","left"];n<r.length;n++){var i=r[n],s=e["padding-"+i];t[i]=Pt(s)}return t}(r),s=i.left+i.right,o=i.top+i.bottom,a=Pt(r.width),l=Pt(r.height);if("border-box"===r.boxSizing&&(Math.round(a+s)!==t&&(a-=Tt(r,"left","right")+s),Math.round(l+o)!==n&&(l-=Tt(r,"top","bottom")+o)),!function(e){return e===Ct(e).document.documentElement}(e)){var c=Math.round(a+s)-t,u=Math.round(l+o)-n;1!==Math.abs(c)&&(a-=c),1!==Math.abs(u)&&(l-=u)}return Vt(i.left,i.top,a,l)}var kt="undefined"!=typeof SVGGraphicsElement?function(e){return e instanceof Ct(e).SVGGraphicsElement}:function(e){return e instanceof Ct(e).SVGElement&&"function"==typeof e.getBBox};function $t(e){return bt?kt(e)?function(e){var t=e.getBBox();return Vt(0,0,t.width,t.height)}(e):jt(e):Nt}function Vt(e,t,n,r){return{x:e,y:t,width:n,height:r}}var Rt=function(){function e(e){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=Vt(0,0,0,0),this.target=e}return e.prototype.isActive=function(){var e=$t(this.target);return this.contentRect_=e,e.width!==this.broadcastWidth||e.height!==this.broadcastHeight},e.prototype.broadcastRect=function(){var e=this.contentRect_;return this.broadcastWidth=e.width,this.broadcastHeight=e.height,e},e}(),zt=function(e,t){var n=function(e){var t=e.x,n=e.y,r=e.width,i=e.height,s="undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object,o=Object.create(s.prototype);return Ot(o,{x:t,y:n,width:r,height:i,top:n,right:t+r,bottom:i+n,left:t}),o}(t);Ot(this,{target:e,contentRect:n})},Dt=function(){function e(e,t,n){if(this.activeObservations_=[],this.observations_=new wt,"function"!=typeof e)throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=e,this.controller_=t,this.callbackCtx_=n}return e.prototype.observe=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(e instanceof Ct(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var t=this.observations_;t.has(e)||(t.set(e,new Rt(e)),this.controller_.addObserver(this),this.controller_.refresh())}},e.prototype.unobserve=function(e){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(e instanceof Ct(e).Element))throw new TypeError('parameter 1 is not of type "Element".');var t=this.observations_;t.has(e)&&(t.delete(e),t.size||this.controller_.removeObserver(this))}},e.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},e.prototype.gatherActive=function(){var e=this;this.clearActive(),this.observations_.forEach((function(t){t.isActive()&&e.activeObservations_.push(t)}))},e.prototype.broadcastActive=function(){if(this.hasActive()){var e=this.callbackCtx_,t=this.activeObservations_.map((function(e){return new zt(e.target,e.broadcastRect())}));this.callback_.call(e,t,e),this.clearActive()}},e.prototype.clearActive=function(){this.activeObservations_.splice(0)},e.prototype.hasActive=function(){return this.activeObservations_.length>0},e}(),Lt="undefined"!=typeof WeakMap?new WeakMap:new wt,qt=function e(t){if(!(this instanceof e))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var n=At.getInstance(),r=new Dt(t,n,this);Lt.set(this,r)};["observe","unobserve","disconnect"].forEach((function(e){qt.prototype[e]=function(){var t;return(t=Lt.get(this))[e].apply(t,arguments)}}));var Ht=void 0!==St.ResizeObserver?St.ResizeObserver:qt;const Wt=(e,t,n=!1)=>{let r;return function(...i){const s=this,o=n&&!r;clearTimeout(r),r=setTimeout(()=>{r=null,n||e.apply(s,i)},t),o&&e.apply(s,i)}};class Ut{constructor(e,t,n){this.name=e,this.icon=t,this.translationKey=n}}class Yt{constructor(e,t,n){this.name=e,this.color=t,this.translationKey=n}}const It=[new Ut("Wind","windsock","events.wind"),new Ut("Snow/Ice","weather-snowy-heavy","events.snow_ice"),new Ut("Thunderstorms","weather-lightning","events.thunderstorms"),new Ut("Fog","weather-fog","events.fog"),new Ut("Extreme high temperature","thermometer-chevron-up",'events."hight_temperature'),new Ut("Extreme low temperature","snowflake","events.low_temperature"),new Ut("Coastal Event","waves","events.coastal_event"),new Ut("Forestfire","pine-tree-fire","events.forest_fire"),new Ut("Avalanches","image-filter-hdr","events.avalanches"),new Ut("Rain","weather-pouring","events.rain"),new Ut("Flood","home-flood","events.flood"),new Ut("Rain-Flood","weather-pouring","events.rain_flood")],Ft=[new Yt("Yellow","#ff9800","messages.yellow"),new Yt("Orange","#EE5A24","messages.orange"),new Yt("Red","#db4437","messages.red")];class Bt{static get name(){return"meteoalarm"}static supports(e){return"Information provided by MeteoAlarm"==e.attributes.attribution}static isWarningActive(e){return"off"!=(e.attributes.status||e.attributes.state||e.state)}static getResult(e){const{event:t,headline:n,awareness_type:r,awareness_level:i}=e.attributes;return{headline:t||n,awarenessLevel:Ft[Number(i.split(";")[0])-2],awarenessType:It[Number(r.split(";")[0])-1]}}}class Kt{static get name(){return"meteofrance"}static getStatesLevels(){return{Jaune:Ft[0],Orange:Ft[1],Rouge:Ft[2]}}static getEventsTypes(){return{"Vent violent":It[0],"Neige-verglas":It[1],Orages:It[2],Inondation:It[10],"Pluie-inondation":It[11]}}static supports(e){return"Data provided by Météo-France"==e.attributes.attribution&&null!=e.attributes["Vent violent"]}static isWarningActive(e){return"Vert"!==e.state}static getResult(e){const t=this.getStatesLevels(),n=this.getEventsTypes();let r={"Vent violent":e.attributes["Vent violent"],"Neige-verglas":e.attributes["Neige-verglas"],Orages:e.attributes.Orages,Inondation:e.attributes.Inondation,"Pluie-inondation":e.attributes["Pluie-inondation"]},i="";return Object.keys(r).forEach(e=>{"Vert"!==r[e]&&(i=e)}),{awarenessLevel:t[e.state],awarenessType:n[i]}}}class Jt{static get name(){return"meteoalarmeu"}static supports(e){return"Information provided by meteoalarm.eu"==e.attributes.attribution}static isWarningActive(e){return"off"!=(e.attributes.status||e.attributes.state||e.state)}static getResult(e){const{awareness_type:t,awareness_level:n}=e.attributes;return{awarenessLevel:Ft.find(e=>e.name==n),awarenessType:It.find(e=>e.name==t)}}}class Gt extends Z{static get properties(){return{hass:Object,config:Object,requestInProgress:Boolean}}static get styles(){return yt}static getStubConfig(e,t){return{entity:t.find(t=>this.integrations.some(n=>n.supports(e.states[t])))||""}}static getConfigElement(){return document.createElement("meteoalarm-card-editor")}static get integrations(){return[Bt,Jt,Kt]}get entity(){return this.hass.states[this.config.entity]}get overrideHeadline(){return!0===this.config.override_headline}get integration(){return this.keyToIntegration(this.config.integration||"automatic")}setConfig(e){if(!e.entity)throw new Error(vt("error.missing_entity"));if("automatic"!=e.integration&&null!=e.integration&&null==this.keyToIntegration(e.integration,e.entity))throw new Error(vt("error.invalid_integration"));this.config=e}getCardSize(){return 2}shouldUpdate(e){return function(e,t,n){if(t.has("config")||n)return!0;if(e.config.entity){var r=t.get("hass");return!r||r.states[e.config.entity]!==e.hass.states[e.config.entity]}return!1}(this,e)}updated(e){e.get("hass")&&e.get("hass").states[this.config.entity].state!==this.hass.states[this.config.entity].state&&(this.requestInProgress=!1)}handleMore(){ve(this,"hass-more-info",{entityId:this.entity.entity_id},{bubbles:!0,composed:!0})}firstUpdated(){this.measureCard(),this.attachObserver()}async attachObserver(){this._resizeObserver||(this.resizeObserver=new Ht(Wt(()=>this.measureCard(),250,!1)));const e=this.shadowRoot.querySelector("ha-card");e&&this.resizeObserver.observe(e)}measureCard(){if(!this.isConnected)return;const e=this.shadowRoot.querySelector("ha-card");e&&(e.offsetWidth<375?this.setAttribute("narrow",""):this.removeAttribute("narrow"),e.offsetWidth<220?this.setAttribute("verynarrow",""):this.removeAttribute("verynarrow"))}keyToIntegration(e,t=this.entity){if("automatic"==e){const e=Gt.integrations.find(e=>e.supports(t));if(null==e)throw Error(vt("error.automatic_failed"));return e}return Gt.find(t=>t.name==e)}isEntityAvailable(e){return"unavailable"!=(e.attributes.status||e.attributes.state||e.state)}getAttributes(e){let t={isAvailable:this.isEntityAvailable(e),isWarningActive:!!this.isEntityAvailable(e)&&this.integration.isWarningActive(e)};if(t.isWarningActive){if(t={...t,...this.integration.getResult(e)},null==t.awarenessLevel||null==t.awarenessType)throw Error(vt("error.entity_not_supported"));(void 0===t.headline||this.overrideHeadline)&&(t.headline=this.generateHeadline(t.awarenessType,t.awarenessLevel)),t.headlineNarrow=this.generateHeadline(t.awarenessType,t.awarenessLevel,!0)}return t}generateHeadline(e,t,n=!1){if(n){const t=vt(e.translationKey);return t.charAt(0).toUpperCase()+t.slice(1)}return vt(t.translationKey).replace("{0}",vt(e.translationKey))}getBackgroundColor(){const{isWarningActive:e,awarenessLevel:t}=this.getAttributes(this.entity);return e?t.color:"inherit"}getFontColor(){const{isWarningActive:e}=this.getAttributes(this.entity);return e?"#fff":"--primary-text-color"}renderIcon(){let e="";if(this.entity&&this.getAttributes(this.entity).isAvailable){const{isWarningActive:t,awarenessType:n}=this.getAttributes(this.entity);e=t?n.icon:"shield-outline"}else e="cloud-question";return V`
			<ha-icon class="main-icon" icon="mdi:${e}"></ha-icon>
		`}renderStatus(){const{isWarningActive:e,headline:t,headlineNarrow:n}=this.getAttributes(this.entity);return e?V`
				<div class="status"> 
					${t}
				</div> 
				<div class="status-narrow"> 
					${n}
				</div> 
			`:V`
				<div class="status-both"> 
					${vt("events.no_warnings")}
				</div> 
			`}renderNotAvailable(){return V`
			  <ha-card>
				<div class="container">
					<div class="content"> 
						${this.renderIcon()}
						<div class="status-both"> 
							${vt("common.not_available")}
						</div>
					</div> 
				</div>
			  </ha-card>
			`}renderError(e){const t=document.createElement("hui-error-card");return t.setConfig({type:"error",error:e,origConfig:this.config}),V`${t}`}render(){try{return this.entity&&this.getAttributes(this.entity).isAvailable?V`
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
			`:this.renderNotAvailable()}catch(e){return console.error("=== METEOALARM CARD ERROR ===\nReport issue: https://bit.ly/3hK1hL4 \n\n",e),this.renderError(e)}}}customElements.define("meteoalarm-card",Gt),window.customCards=window.customCards||[],window.customCards.push({preview:!0,type:"meteoalarm-card",name:vt("common.name"),description:vt("common.description")});
