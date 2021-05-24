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
const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,t=(e,t,n=null)=>{for(;t!==n;){const n=t.nextSibling;e.removeChild(t),t=n}},n=`{{lit-${String(Math.random()).slice(2)}}}`,i=`\x3c!--${n}--\x3e`,r=new RegExp(`${n}|${i}`);class s{constructor(e,t){this.parts=[],this.element=t;const i=[],s=[],o=document.createTreeWalker(t.content,133,null,!1);let d=0,u=-1,h=0;const{strings:m,values:{length:p}}=e;for(;h<p;){const e=o.nextNode();if(null!==e){if(u++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:n}=t;let i=0;for(let e=0;e<n;e++)a(t[e].name,"$lit$")&&i++;for(;i-- >0;){const t=m[h],n=c.exec(t)[2],i=n.toLowerCase()+"$lit$",s=e.getAttribute(i);e.removeAttribute(i);const a=s.split(r);this.parts.push({type:"attribute",index:u,name:n,strings:a}),h+=a.length-1}}"TEMPLATE"===e.tagName&&(s.push(e),o.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(n)>=0){const n=e.parentNode,s=t.split(r),o=s.length-1;for(let t=0;t<o;t++){let i,r=s[t];if(""===r)i=l();else{const e=c.exec(r);null!==e&&a(e[2],"$lit$")&&(r=r.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),i=document.createTextNode(r)}n.insertBefore(i,e),this.parts.push({type:"node",index:++u})}""===s[o]?(n.insertBefore(l(),e),i.push(e)):e.data=s[o],h+=o}}else if(8===e.nodeType)if(e.data===n){const t=e.parentNode;null!==e.previousSibling&&u!==d||(u++,t.insertBefore(l(),e)),d=u,this.parts.push({type:"node",index:u}),null===e.nextSibling?e.data="":(i.push(e),u--),h++}else{let t=-1;for(;-1!==(t=e.data.indexOf(n,t+1));)this.parts.push({type:"node",index:-1}),h++}}else o.currentNode=s.pop()}for(const e of i)e.parentNode.removeChild(e)}}const a=(e,t)=>{const n=e.length-t.length;return n>=0&&e.slice(n)===t},o=e=>-1!==e.index,l=()=>document.createComment(""),c=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function d(e,t){const{element:{content:n},parts:i}=e,r=document.createTreeWalker(n,133,null,!1);let s=h(i),a=i[s],o=-1,l=0;const c=[];let d=null;for(;r.nextNode();){o++;const e=r.currentNode;for(e.previousSibling===d&&(d=null),t.has(e)&&(c.push(e),null===d&&(d=e)),null!==d&&l++;void 0!==a&&a.index===o;)a.index=null!==d?-1:a.index-l,s=h(i,s),a=i[s]}c.forEach(e=>e.parentNode.removeChild(e))}const u=e=>{let t=11===e.nodeType?0:1;const n=document.createTreeWalker(e,133,null,!1);for(;n.nextNode();)t++;return t},h=(e,t=-1)=>{for(let n=t+1;n<e.length;n++){const t=e[n];if(o(t))return n}return-1};
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
const m=new WeakMap,p=e=>"function"==typeof e&&m.has(e),g={},f={};
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
class _{constructor(e,t,n){this.__parts=[],this.template=e,this.processor=t,this.options=n}update(e){let t=0;for(const n of this.__parts)void 0!==n&&n.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),n=[],i=this.template.parts,r=document.createTreeWalker(t,133,null,!1);let s,a=0,l=0,c=r.nextNode();for(;a<i.length;)if(s=i[a],o(s)){for(;l<s.index;)l++,"TEMPLATE"===c.nodeName&&(n.push(c),r.currentNode=c.content),null===(c=r.nextNode())&&(r.currentNode=n.pop(),c=r.nextNode());if("node"===s.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(c.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,s.name,s.strings,this.options));a++}else this.__parts.push(void 0),a++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const v=` ${n} `;class y{constructor(e,t,n,i){this.strings=e,this.values=t,this.type=n,this.processor=i}getHTML(){const e=this.strings.length-1;let t="",r=!1;for(let s=0;s<e;s++){const e=this.strings[s],a=e.lastIndexOf("\x3c!--");r=(a>-1||r)&&-1===e.indexOf("--\x3e",a+1);const o=c.exec(e);t+=null===o?e+(r?v:i):e.substr(0,o.index)+o[1]+o[2]+"$lit$"+o[3]+n}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}
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
 */const w=e=>null===e||!("object"==typeof e||"function"==typeof e),b=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class S{constructor(e,t,n){this.dirty=!0,this.element=e,this.name=t,this.strings=n,this.parts=[];for(let e=0;e<n.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new x(this)}_getValue(){const e=this.strings,t=e.length-1;let n="";for(let i=0;i<t;i++){n+=e[i];const t=this.parts[i];if(void 0!==t){const e=t.value;if(w(e)||!b(e))n+="string"==typeof e?e:String(e);else for(const t of e)n+="string"==typeof t?t:String(t)}}return n+=e[t],n}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===g||w(e)&&e===this.value||(this.value=e,p(e)||(this.committer.dirty=!0))}commit(){for(;p(this.value);){const e=this.value;this.value=g,e(this)}this.value!==g&&this.committer.commit()}}class M{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(l()),this.endNode=e.appendChild(l())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=l()),e.__insert(this.endNode=l())}insertAfterPart(e){e.__insert(this.startNode=l()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(null===this.startNode.parentNode)return;for(;p(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}const e=this.__pendingValue;e!==g&&(w(e)?e!==this.value&&this.__commitText(e):e instanceof y?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):b(e)?this.__commitIterable(e):e===f?(this.value=f,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,n="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=n:this.__commitNode(document.createTextNode(n)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof _&&this.value.template===t)this.value.update(e.values);else{const n=new _(t,e.processor,this.options),i=n._clone();n.update(e.values),this.__commitNode(i),this.value=n}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let n,i=0;for(const r of e)n=t[i],void 0===n&&(n=new M(this.options),t.push(n),0===i?n.appendIntoPart(this):n.insertAfterPart(t[i-1])),n.setValue(r),n.commit(),i++;i<t.length&&(t.length=i,this.clear(n&&n.endNode))}clear(e=this.startNode){t(this.startNode.parentNode,e.nextSibling,this.endNode)}}class N{constructor(e,t,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=n}setValue(e){this.__pendingValue=e}commit(){for(;p(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=g}}class A extends S{constructor(e,t,n){super(e,t,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new P(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class P extends x{}let C=!1;(()=>{try{const e={get capture(){return C=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}})();class E{constructor(e,t,n){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=n,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;p(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=g,e(this)}if(this.__pendingValue===g)return;const e=this.__pendingValue,t=this.value,n=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),i=null!=e&&(null==t||n);n&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=T(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=g}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const T=e=>e&&(C?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
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
 */;function j(e){let t=k.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},k.set(e.type,t));let i=t.stringsArray.get(e.strings);if(void 0!==i)return i;const r=e.strings.join(n);return i=t.keyString.get(r),void 0===i&&(i=new s(e,e.getTemplateElement()),t.keyString.set(r,i)),t.stringsArray.set(e.strings,i),i}const k=new Map,O=new WeakMap;
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
class{handleAttributeExpressions(e,t,n,i){const r=t[0];if("."===r){return new A(e,t.slice(1),n).parts}return"@"===r?[new E(e,t.slice(1),i.eventContext)]:"?"===r?[new N(e,t.slice(1),n)]:new S(e,t,n).parts}handleTextExpression(e){return new M(e)}};
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
 */,D=(e,t)=>`${e}--${t}`;let z=!0;void 0===window.ShadyCSS?z=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),z=!1);const R=e=>t=>{const i=D(t.type,e);let r=k.get(i);void 0===r&&(r={stringsArray:new WeakMap,keyString:new Map},k.set(i,r));let a=r.stringsArray.get(t.strings);if(void 0!==a)return a;const o=t.strings.join(n);if(a=r.keyString.get(o),void 0===a){const n=t.getTemplateElement();z&&window.ShadyCSS.prepareTemplateDom(n,e),a=new s(t,n),r.keyString.set(o,a)}return r.stringsArray.set(t.strings,a),a},Y=["html","svg"],U=new Set,H=(e,t,n)=>{U.add(e);const i=n?n.element:document.createElement("template"),r=t.querySelectorAll("style"),{length:s}=r;if(0===s)return void window.ShadyCSS.prepareTemplateStyles(i,e);const a=document.createElement("style");for(let e=0;e<s;e++){const t=r[e];t.parentNode.removeChild(t),a.textContent+=t.textContent}(e=>{Y.forEach(t=>{const n=k.get(D(t,e));void 0!==n&&n.keyString.forEach(e=>{const{element:{content:t}}=e,n=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{n.add(e)}),d(e,n)})})})(e);const o=i.content;n?function(e,t,n=null){const{element:{content:i},parts:r}=e;if(null==n)return void i.appendChild(t);const s=document.createTreeWalker(i,133,null,!1);let a=h(r),o=0,l=-1;for(;s.nextNode();){for(l++,s.currentNode===n&&(o=u(t),n.parentNode.insertBefore(t,n));-1!==a&&r[a].index===l;){if(o>0){for(;-1!==a;)r[a].index+=o,a=h(r,a);return}a=h(r,a)}}}(n,a,o.firstChild):o.insertBefore(a,o.firstChild),window.ShadyCSS.prepareTemplateStyles(i,e);const l=o.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(n){o.insertBefore(a,o.firstChild);const e=new Set;e.add(a),d(n,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const q={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},I=(e,t)=>t!==e&&(t==t||e==e),L={attribute:!0,type:String,converter:q,reflect:!1,hasChanged:I};class W extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=new Promise(e=>this._enableUpdatingResolver=e),this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,n)=>{const i=this._attributeNameForProperty(n,t);void 0!==i&&(this._attributeToPropertyMap.set(i,n),e.push(i))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=L){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const n="symbol"==typeof e?Symbol():"__"+e,i=this.getPropertyDescriptor(e,n,t);void 0!==i&&Object.defineProperty(this.prototype,e,i)}static getPropertyDescriptor(e,t,n){return{get(){return this[t]},set(n){const i=this[e];this[t]=n,this._requestUpdate(e,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||L}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const n of t)this.createProperty(n,e[n])}}static _attributeNameForProperty(e,t){const n=t.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,n=I){return n(e,t)}static _propertyValueFromAttribute(e,t){const n=t.type,i=t.converter||q,r="function"==typeof i?i:i.fromAttribute;return r?r(e,n):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const n=t.type,i=t.converter;return(i&&i.toAttribute||q.toAttribute)(e,n)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,n){t!==n&&this._attributeToProperty(e,n)}_propertyToAttribute(e,t,n=L){const i=this.constructor,r=i._attributeNameForProperty(e,n);if(void 0!==r){const e=i._propertyValueToAttribute(t,n);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(r):this.setAttribute(r,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const n=this.constructor,i=n._attributeToPropertyMap.get(e);if(void 0!==i){const e=n.getPropertyOptions(i);this._updateState=16|this._updateState,this[i]=n._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}_requestUpdate(e,t){let n=!0;if(void 0!==e){const i=this.constructor,r=i.getPropertyOptions(e);i._valueHasChanged(this[e],t,r.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==r.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,r))):n=!1}!this._hasRequestedUpdate&&n&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const e=this.performUpdate();return null!=e&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(t){throw e=!1,this._markUpdated(),t}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}}W.finalized=!0;
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
const F="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol();class K{constructor(e,t){if(t!==B)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(F?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const J=(e,...t)=>{const n=t.reduce((t,n,i)=>t+(e=>{if(e instanceof K)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+e[i+1],e[0]);return new K(n,B)};
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.3.1");const Z={};class G extends W{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const e=this.getStyles();if(void 0===e)this._styles=[];else if(Array.isArray(e)){const t=(e,n)=>e.reduceRight((e,n)=>Array.isArray(n)?t(n,e):(e.add(n),e),n),n=t(e,new Set),i=[];n.forEach(e=>i.unshift(e)),this._styles=i}else this._styles=[e]}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?F?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){const t=this.render();super.update(e),t!==Z&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){return Z}}G.finalized=!0,G.render=(e,n,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const r=i.scopeName,s=O.has(n),a=z&&11===n.nodeType&&!!n.host,o=a&&!U.has(r),l=o?document.createDocumentFragment():n;if(((e,n,i)=>{let r=O.get(n);void 0===r&&(t(n,n.firstChild),O.set(n,r=new M(Object.assign({templateFactory:j},i))),r.appendInto(n)),r.setValue(e),r.commit()})(e,l,Object.assign({templateFactory:R(r)},i)),o){const e=O.get(l);O.delete(l);const i=e.value instanceof _?e.value.template:void 0;H(r,l,i),t(n,n.firstChild),n.appendChild(l),O.set(n,e)}!s&&a&&window.ShadyCSS.styleElement(n.host)};var Q=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,X="[^\\s]+",ee=/\[([^]*?)\]/gm;function te(e,t){for(var n=[],i=0,r=e.length;i<r;i++)n.push(e[i].substr(0,t));return n}var ne=function(e){return function(t,n){var i=n[e].map((function(e){return e.toLowerCase()})).indexOf(t.toLowerCase());return i>-1?i:null}};function ie(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];for(var i=0,r=t;i<r.length;i++){var s=r[i];for(var a in s)e[a]=s[a]}return e}var re=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],se=["January","February","March","April","May","June","July","August","September","October","November","December"],ae=te(se,3),oe={dayNamesShort:te(re,3),dayNames:re,monthNamesShort:ae,monthNames:se,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}},le=ie({},oe),ce=function(e,t){for(void 0===t&&(t=2),e=String(e);e.length<t;)e="0"+e;return e},de={D:function(e){return String(e.getDate())},DD:function(e){return ce(e.getDate())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return String(e.getDay())},dd:function(e){return ce(e.getDay())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return String(e.getMonth()+1)},MM:function(e){return ce(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},YY:function(e){return ce(String(e.getFullYear()),4).substr(2)},YYYY:function(e){return ce(e.getFullYear(),4)},h:function(e){return String(e.getHours()%12||12)},hh:function(e){return ce(e.getHours()%12||12)},H:function(e){return String(e.getHours())},HH:function(e){return ce(e.getHours())},m:function(e){return String(e.getMinutes())},mm:function(e){return ce(e.getMinutes())},s:function(e){return String(e.getSeconds())},ss:function(e){return ce(e.getSeconds())},S:function(e){return String(Math.round(e.getMilliseconds()/100))},SS:function(e){return ce(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return ce(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ce(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)},Z:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+ce(Math.floor(Math.abs(t)/60),2)+":"+ce(Math.abs(t)%60,2)}},ue=function(e){return+e-1},he=[null,"[1-9]\\d?"],me=[null,X],pe=["isPm",X,function(e,t){var n=e.toLowerCase();return n===t.amPm[0]?0:n===t.amPm[1]?1:null}],ge=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(e){var t=(e+"").match(/([+-]|\d\d)/gi);if(t){var n=60*+t[1]+parseInt(t[2],10);return"+"===t[0]?n:-n}return 0}],fe=(ne("monthNamesShort"),ne("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var _e=function(e,t,n){if(void 0===t&&(t=fe.default),void 0===n&&(n={}),"number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date pass to format");var i=[];t=(t=fe[t]||t).replace(ee,(function(e,t){return i.push(t),"@@@"}));var r=ie(ie({},le),n);return(t=t.replace(Q,(function(t){return de[t](e,r)}))).replace(/@@@/g,(function(){return i.shift()}))},ve=(function(){try{(new Date).toLocaleDateString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}}(),function(e,t,n,i){i=i||{},n=null==n?{}:n;var r=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return r.detail=n,e.dispatchEvent(r),r});var ye={name:"Meteoalarm-Karte",description:"Die Meteoalarm-Karte warnt dich vor bevorstehenden Wetterereignissen.",not_available:"Meteoalarm ist nicht verfügbar"},we={missing_entity:"Die angegebene Entität ist nicht vorhanden!",missing_integration:null,invalid_integration:null},be={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},Se={no_warnings:"Keine Warnungen",wind:"Wind",snow_ice:"Schnee/Eis",thunderstorms:"Gewitter",fog:"Nebel",hight_temperature:"Extrem hohe Temperaturen",low_temperature:"Extrem niedrige Temperaturen",coastal_event:"Küstenereignis",forest_fire:"Waldbrand",avalanches:"Lawinen",rain:"Regen",flood:"Überflutung",rain_flood:"Regenüberflutung"},xe={yellow:"{0} der Warnstufe Gelb",orange:"{0} der Warnstufe Orange",red:"{0} der Warnstufe Rot"},Me={$schema:"./schema.json",common:ye,error:we,editor:be,events:Se,messages:xe},Ne=Object.freeze({__proto__:null,$schema:"./schema.json",common:ye,error:we,editor:be,events:Se,messages:xe,default:Me}),Ae={name:"Meteoalarm Card",description:"Meteoalarm card warns you about current weather events.",not_available:"Meteoalarm is not available"},Pe={missing_entity:"Specifying entity is required!",missing_integration:"Specifying integration is required!",invalid_integration:"This integration is not valid!"},Ce={entity:"Entity",integration:"Integration",required:"Required",automatic:"Automatic",recommended:"Recommended",override_headline:"Override headline"},Ee={no_warnings:"No warnings",wind:"wind",snow_ice:"snow/ice",thunderstorms:"thunderstorms",fog:"fog",hight_temperature:"extreme high temperature",low_temperature:"extreme low temperature",coastal_event:"coastal event",forest_fire:"forest fire",avalanches:"avalanches",rain:"rain",flood:"flood",rain_flood:"rain flood"},Te={yellow:"Yellow {0} warning",orange:"Orange {0} warning",red:"Red {0} warning"},je={$schema:"./schema.json",common:Ae,error:Pe,editor:Ce,events:Ee,messages:Te},ke=Object.freeze({__proto__:null,$schema:"./schema.json",common:Ae,error:Pe,editor:Ce,events:Ee,messages:Te,default:je}),Oe={name:"Carte Meteoalarm",description:"Carte Meteoalarm vous alerte des conditions météorologique courante.",not_available:"Meteoalarm n'est pas disponible"},$e={missing_entity:"L'entité est requise!",missing_integration:null,invalid_integration:null},Ve={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},De={no_warnings:"Aucune alerte",wind:"vent",snow_ice:"neige/verglas",thunderstorms:"orages",fog:"brouillard",hight_temperature:"température extrêmement élevée",low_temperature:"température extrêmement basse",coastal_event:"événement côtier",forest_fire:"feu de forêt",avalanches:"avalanches",rain:"pluie",flood:"inondation",rain_flood:"pluie/inondation"},ze={yellow:"Alerte jaune {0}",orange:"Alerte orange {0}",red:"Alerte rouge {0}"},Re={$schema:"./schema.json",common:Oe,error:$e,editor:Ve,events:De,messages:ze},Ye=Object.freeze({__proto__:null,$schema:"./schema.json",common:Oe,error:$e,editor:Ve,events:De,messages:ze,default:Re}),Ue={name:"Scheda Meteoalarm",description:"La scheda Meteoalarm ti informa degli eventi meteorologici in corso.",not_available:"Meteoalarm non è disponibile"},He={missing_entity:"È necessario specificare un'entità!",missing_integration:null,invalid_integration:null},qe={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},Ie={no_warnings:"Nessun allarme",wind:"vento",snow_ice:"neve/ghiaccio",thunderstorms:"temporali",fog:"nebbia",hight_temperature:"alte temperature",low_temperature:"basse temperature",coastal_event:"eventi costieri",forest_fire:"incendi boschivi",avalanches:"valanghe",rain:"pioggia",flood:"inondazioni",rain_flood:"acquazzoni"},Le={yellow:"Allarme Giallo {0}",orange:"Allarme Arancione {0}",red:"Allarme Rosso {0}"},We={$schema:"./schema.json",common:Ue,error:He,editor:qe,events:Ie,messages:Le},Fe=Object.freeze({__proto__:null,$schema:"./schema.json",common:Ue,error:He,editor:qe,events:Ie,messages:Le,default:We}),Be={name:"Meteoalarm Kaart",description:"Meteoalarm kaart waarschuwt u voor actuele weersomstandigheden.",not_available:"Meteoalarm is niet beschikbaar"},Ke={missing_entity:"Het specificeren van de entiteit is vereist!",missing_integration:null,invalid_integration:null},Je={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},Ze={no_warnings:"Geen waarschuwingen",wind:"wind",snow_ice:"sneeuw/ijzel/bevriezing",thunderstorms:"onweer",fog:"mist",hight_temperature:"hitte",low_temperature:"koude",coastal_event:"kustbedreiging",forest_fire:"bos- en heidebranden",avalanches:"lawines",rain:"regen",flood:"hoogwater",rain_flood:"wateroverlast"},Ge={yellow:"Waarschuwing geel {0}",orange:"Waarschuwing oranje {0}",red:"Waarschuwing rood {0}"},Qe={$schema:"./schema.json",common:Be,error:Ke,editor:Je,events:Ze,messages:Ge},Xe={name:"Karta Meteoalarm",description:"Meteoalarm ostrzega cię przed aktualnymi zdarzeniami pogodowymi.",not_available:"Meteoalarm nie jest dostępny"},et={missing_entity:"Podanie encji jest wymagane!",missing_integration:"Podanie integracji jest wymagane!",invalid_integration:"Nieprawidłowa integracja"},tt={entity:"Encja",integration:"Integracja",required:"Wymagane",automatic:"Automatyczne",recommended:"Zalecane",override_headline:"Nadpisz nagłówek"},nt={no_warnings:"Brak ostrzeżeń",wind:"wiatr",snow_ice:"śnieg/oblodzenie",thunderstorms:"burze",fog:"mgły",hight_temperature:"upały",low_temperature:"silne Mrozy",coastal_event:"zjawiska strefy brzegowej",forest_fire:"pożary lasu",avalanches:"lawiny",rain:"deszcz",flood:"powodzie",rain_flood:"ulewy"},it={yellow:"Żółty alert na {0}",orange:"Pomarańczowy alert na {0}",red:"Czerwony alert na {0}"},rt={$schema:"./schema.json",common:Xe,error:et,editor:tt,events:nt,messages:it},st={name:"Ohtlike ilmanähtuste kaart",description:"Ohtlike ilmanähtuste kaart hoiatab ilmaohtude eest.",not_available:"Meteoalarm pole saadaval"},at={missing_entity:"Vajalik on Meteoalarmi olem!",missing_integration:null,invalid_integration:null},ot={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},lt={no_warnings:"Hoiatusi hetkel pole",wind:"tugev tuul",snow_ice:"lumi/jää",thunderstorms:"äike",fog:"udu",hight_temperature:"kuumalaine",low_temperature:"külmalaine",coastal_event:"rannikumeri",forest_fire:"metsapõleng",avalanches:"laviin",rain:"sademed",flood:"üleujutus",rain_flood:"paduvihm"},ct={yellow:"Kollane hoiatus {0}",orange:"Oranž hoiatus {0}",red:"Punane hoiatus {0}"},dt={$schema:"./schema.json",common:st,error:at,editor:ot,events:lt,messages:ct},ut={name:"Tarjeta Meteoalarm",description:"La tarjeta Meteoalarm le advierte sobre eventos meteorológicos actuales.",not_available:"Meteoalarm no está disponible"},ht={missing_entity:"¡Se requiere especificar la entidad!",missing_integration:null,invalid_integration:null},mt={entity:null,integration:null,required:null,automatic:null,recommended:null,override_headline:null},pt={no_warnings:"Sin avisos",wind:"viento",snow_ice:"nieve/hielo",thunderstorms:"tormentas",fog:"niebla",hight_temperature:"temperatura máxima extrema",low_temperature:"temperatura mínima extrema",coastal_event:"fenómeno costero",forest_fire:"incendios",avalanches:"aludes",rain:"lluvia",flood:"inundación",rain_flood:"inundación de lluvia"},gt={yellow:"Aviso de {0} amarillo",orange:"Aviso de {0} naranja",red:"Aviso de {0} rojo"},ft={$schema:"./schema.json",common:ut,error:ht,editor:mt,events:pt,messages:gt},_t={de:Ne,en:ke,nl:Object.freeze({__proto__:null,$schema:"./schema.json",common:Be,error:Ke,editor:Je,events:Ze,messages:Ge,default:Qe}),pl:Object.freeze({__proto__:null,$schema:"./schema.json",common:Xe,error:et,editor:tt,events:nt,messages:it,default:rt}),et:Object.freeze({__proto__:null,$schema:"./schema.json",common:st,error:at,editor:ot,events:lt,messages:ct,default:dt}),fr:Ye,it:Fe,es:Object.freeze({__proto__:null,$schema:"./schema.json",common:ut,error:ht,editor:mt,events:pt,messages:gt,default:ft})};function vt(e){const[t,n]=e.toLowerCase().split(".");let i;try{i=JSON.parse(localStorage.getItem("selectedLanguage"))}catch(e){i=localStorage.getItem("selectedLanguage")}const r=(i||navigator.language.split("-")[0]||"en").replace(/['"]+/g,"").replace("-","_");let s;try{s=_t[r][t][n]}catch(e){s=_t.en[t][n]}return null==s&&(s=_t.en[t][n]||e.toLowerCase()),s}customElements.define("meteoalarm-card-editor",class extends G{static get properties(){return{hass:Object,_config:Object,_toggle:Boolean}}get _integrations(){return{automatic:`${vt("editor.automatic")} (${vt("editor.recommended")})`,meteoalarm:"Core Meteoalarm",meteofrance:"Core Météo-France",meteoalarmeu:"Custom MeteoalarmEU"}}setConfig(e){this._config=e}get _entity(){return this._config&&this._config.entity||""}get _integration(){return this._config&&this._config.integration||""}get _override_headline(){return this._config?this._config.override_headline||!1:""}render(){return this.hass?V`
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
    	`:V``}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;let n=t.value;"integration"==t.configValue&&(n=Object.keys(this._integrations).find(e=>this._integrations[e]===n)||n),this["_"+t.configValue]!==n&&(t.configValue&&(this._config={...this._config,[t.configValue]:void 0!==t.checked?t.checked:n}),ve(this,"config-changed",{config:this._config}))}static get styles(){return J`
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
`;class wt{constructor(e,t,n){this.name=e,this.icon=t,this.translationKey=n}}class bt{constructor(e,t,n){this.name=e,this.color=t,this.translationKey=n}}const St=[new wt("Wind","windsock","events.wind"),new wt("Snow/Ice","weather-snowy-heavy","events.snow_ice"),new wt("Thunderstorms","weather-lightning","events.thunderstorms"),new wt("Fog","weather-fog","events.fog"),new wt("Extreme high temperature","thermometer-chevron-up",'events."hight_temperature'),new wt("Extreme low temperature","snowflake","events.low_temperature"),new wt("Coastal Event","waves","events.coastal_event"),new wt("Forestfire","pine-tree-fire","events.forest_fire"),new wt("Avalanches","image-filter-hdr","events.avalanches"),new wt("Rain","weather-pouring","events.rain"),new wt("Flood","home-flood","events.flood"),new wt("Rain-Flood","weather-pouring","events.rain_flood")],xt=[new bt("Yellow","#ff9800","messages.yellow"),new bt("Orange","#EE5A24","messages.orange"),new bt("Red","#db4437","messages.red")];class Mt{static get name(){return"meteoalarm"}static supports(e){return"Information provided by MeteoAlarm"==e.attributes.attribution}static isWarningActive(e){return"off"!=(e.attributes.status||e.attributes.state||e.state)}static getResult(e){const{event:t,headline:n,awareness_type:i,awareness_level:r}=e.attributes;return{headline:t||n,awarenessLevel:xt[Number(r.split(";")[0])-2],awarenessType:St[Number(i.split(";")[0])-1]}}}class Nt{static get name(){return"meteofrance"}static getStatesLevels(){return{Jaune:xt[0],Orange:xt[1],Rouge:xt[2]}}static getEventsTypes(){return{"Vent violent":St[0],"Neige-verglas":St[1],Orages:St[2],Inondation:St[10],"Pluie-inondation":St[11]}}static supports(e){return"Data provided by Météo-France"===e.attributes.attribution}static isWarningActive(e){return"Vert"!==e.state}static getResult(e){const t=this.getStatesLevels(),n=this.getEventsTypes();let i={"Vent violent":e.attributes["Vent violent"],"Neige-verglas":e.attributes["Neige-verglas"],Orages:e.attributes.Orages,Inondation:e.attributes.Inondation,"Pluie-inondation":e.attributes["Pluie-inondation"]},r="";return Object.keys(i).forEach(e=>{"Vert"!==i[e]&&(r=e)}),{awarenessLevel:t[e.state],awarenessType:n[r]}}}class At{static get name(){return"meteoalarmeu"}static supports(e){return"Information provided by meteoalarm.eu"==e.attributes.attribution}static isWarningActive(e){return"off"!=(e.attributes.status||e.attributes.state||e.state)}static getResult(e){const{awareness_type:t,awareness_level:n}=e.attributes;return{awarenessLevel:xt.find(e=>e.name==n),awarenessType:St.find(e=>e.name==t)}}}customElements.define("meteoalarm-card",class extends G{static get properties(){return{hass:Object,config:Object,requestInProgress:Boolean}}static get styles(){return yt}static getStubConfig(e,t){const[n]=t.filter(e=>e.includes("meteoalarm"));return{entity:n||"",integration:"automatic"}}static getConfigElement(){return document.createElement("meteoalarm-card-editor")}get integrations(){return[Mt,At,Nt]}get entity(){return this.hass.states[this.config.entity]}get overrideHeadline(){return!0===this.config.override_headline}get integration(){return this.keyToIntegration(this.config.integration)}setConfig(e){if(!e.entity)throw new Error(vt("error.missing_entity"));if(!e.integration)throw new Error(vt("error.missing_integration"));if("automatic"!=e.integration&&null==this.keyToIntegration(e.integration,e.entity))throw new Error(vt("error.invalid_integration"));this.config=e}getCardSize(){return 2}shouldUpdate(e){return function(e,t,n){if(t.has("config")||n)return!0;if(e.config.entity){var i=t.get("hass");return!i||i.states[e.config.entity]!==e.hass.states[e.config.entity]}return!1}(this,e)}updated(e){e.get("hass")&&e.get("hass").states[this.config.entity].state!==this.hass.states[this.config.entity].state&&(this.requestInProgress=!1)}handleMore(){ve(this,"hass-more-info",{entityId:this.entity.entity_id},{bubbles:!0,composed:!0})}keyToIntegration(e,t=this.entity){return"automatic"==e?this.integrations.find(e=>e.supports(t)):this.integrations.find(t=>t.name==e)}isEntityAvailable(e){return"unavailable"!=(e.attributes.status||e.attributes.state||e.state)}getAttributes(e){let t={isAvailable:this.isEntityAvailable(e),isWarningActive:this.integration.isWarningActive(e)};return t.isWarningActive&&(t={...t,...this.integration.getResult(e)},(void 0===t.headline||this.overrideHeadline)&&(t.headline=this.generateHeadline(t.awarenessType,t.awarenessLevel))),t}generateHeadline(e,t){return vt(t.translationKey).replace("{0}",vt(e.translationKey))}getBackgroundColor(){const{isWarningActive:e,awarenessLevel:t}=this.getAttributes(this.entity);return e?t.color:"inherit"}getFontColor(){const{isWarningActive:e}=this.getAttributes(this.entity);return e?"#fff":"--primary-text-color"}renderIcon(){let e="";if(this.entity&&this.getAttributes(this.entity).isAvailable){const{isWarningActive:t,awarenessType:n}=this.getAttributes(this.entity);e=t?n.icon:"shield-outline"}else e="cloud-question";return V`
			<ha-icon class="main-icon" icon="mdi:${e}"></ha-icon>
		`}renderStatus(){const{isWarningActive:e,headline:t}=this.getAttributes(this.entity);return e?V`
				<div class="status"> 
					${t}
				</div> 
			`:V`
				<div class="status"> 
					${vt("events.no_warnings")}
				</div> 
			`}renderNotAvailable(){return V`
			  <ha-card>
				<div class="container">
					<div class="content"> 
						${this.renderIcon()}
						<div class="status"> 
							${vt("common.not_available")}
						</div>
					</div> 
				</div>
			  </ha-card>
			`}renderError(){return V`
			<ha-card>
				<div class="container" style="background-color: #db4437; color: #fff">
					<div class="content"> 
						<ha-icon class="main-icon" icon="mdi:alert-circle-outline"></ha-icon>
						<div class="status"> Error (see console) </div>
					</div>
				</div>
			</ha-card>
		`}render(){try{return this.entity&&this.getAttributes(this.entity).isAvailable?V`
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
			`:this.renderNotAvailable()}catch(e){return console.error("=== METEOALARM CARD ERROR ===\nReport issue: https://bit.ly/3hK1hL4 \n\n",e),this.renderError()}}}),window.customCards=window.customCards||[],window.customCards.push({preview:!0,type:"meteoalarm-card",name:vt("common.name"),description:vt("common.description")});
