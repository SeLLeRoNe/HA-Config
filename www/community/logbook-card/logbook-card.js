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
***************************************************************************** */
function t(t,e,n,i){var r,o=arguments.length,s=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(s=(o<3?r(s):o>3?r(e,n,s):r(e,n))||s);return o>3&&s&&Object.defineProperty(e,n,s),s
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
 */}const e="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,n=(t,e,n=null)=>{for(;e!==n;){const n=e.nextSibling;t.removeChild(e),e=n}},i=`{{lit-${String(Math.random()).slice(2)}}}`,r=`\x3c!--${i}--\x3e`,o=new RegExp(`${i}|${r}`);class s{constructor(t,e){this.parts=[],this.element=e;const n=[],r=[],s=document.createTreeWalker(e.content,133,null,!1);let u=0,d=-1,h=0;const{strings:m,values:{length:f}}=t;for(;h<f;){const t=s.nextNode();if(null!==t){if(d++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:n}=e;let i=0;for(let t=0;t<n;t++)a(e[t].name,"$lit$")&&i++;for(;i-- >0;){const e=m[h],n=l.exec(e)[2],i=n.toLowerCase()+"$lit$",r=t.getAttribute(i);t.removeAttribute(i);const s=r.split(o);this.parts.push({type:"attribute",index:d,name:n,strings:s}),h+=s.length-1}}"TEMPLATE"===t.tagName&&(r.push(t),s.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(i)>=0){const i=t.parentNode,r=e.split(o),s=r.length-1;for(let e=0;e<s;e++){let n,o=r[e];if(""===o)n=c();else{const t=l.exec(o);null!==t&&a(t[2],"$lit$")&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-"$lit$".length)+t[3]),n=document.createTextNode(o)}i.insertBefore(n,t),this.parts.push({type:"node",index:++d})}""===r[s]?(i.insertBefore(c(),t),n.push(t)):t.data=r[s],h+=s}}else if(8===t.nodeType)if(t.data===i){const e=t.parentNode;null!==t.previousSibling&&d!==u||(d++,e.insertBefore(c(),t)),u=d,this.parts.push({type:"node",index:d}),null===t.nextSibling?t.data="":(n.push(t),d--),h++}else{let e=-1;for(;-1!==(e=t.data.indexOf(i,e+1));)this.parts.push({type:"node",index:-1}),h++}}else s.currentNode=r.pop()}for(const t of n)t.parentNode.removeChild(t)}}const a=(t,e)=>{const n=t.length-e.length;return n>=0&&t.slice(n)===e},u=t=>-1!==t.index,c=()=>document.createComment(""),l=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function d(t,e){const{element:{content:n},parts:i}=t,r=document.createTreeWalker(n,133,null,!1);let o=m(i),s=i[o],a=-1,u=0;const c=[];let l=null;for(;r.nextNode();){a++;const t=r.currentNode;for(t.previousSibling===l&&(l=null),e.has(t)&&(c.push(t),null===l&&(l=t)),null!==l&&u++;void 0!==s&&s.index===a;)s.index=null!==l?-1:s.index-u,o=m(i,o),s=i[o]}c.forEach(t=>t.parentNode.removeChild(t))}const h=t=>{let e=11===t.nodeType?0:1;const n=document.createTreeWalker(t,133,null,!1);for(;n.nextNode();)e++;return e},m=(t,e=-1)=>{for(let n=e+1;n<t.length;n++){const e=t[n];if(u(e))return n}return-1};
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
const f=new WeakMap,p=t=>"function"==typeof t&&f.has(t),g={},v={};
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
class y{constructor(t,e,n){this.__parts=[],this.template=t,this.processor=e,this.options=n}update(t){let e=0;for(const n of this.__parts)void 0!==n&&n.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=e?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),n=[],i=this.template.parts,r=document.createTreeWalker(t,133,null,!1);let o,s=0,a=0,c=r.nextNode();for(;s<i.length;)if(o=i[s],u(o)){for(;a<o.index;)a++,"TEMPLATE"===c.nodeName&&(n.push(c),r.currentNode=c.content),null===(c=r.nextNode())&&(r.currentNode=n.pop(),c=r.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(c.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(c,o.name,o.strings,this.options));s++}else this.__parts.push(void 0),s++;return e&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const _=` ${i} `;class w{constructor(t,e,n,i){this.strings=t,this.values=e,this.type=n,this.processor=i}getHTML(){const t=this.strings.length-1;let e="",n=!1;for(let o=0;o<t;o++){const t=this.strings[o],s=t.lastIndexOf("\x3c!--");n=(s>-1||n)&&-1===t.indexOf("--\x3e",s+1);const a=l.exec(t);e+=null===a?t+(n?_:r):t.substr(0,a.index)+a[1]+a[2]+"$lit$"+a[3]+i}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}
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
 */const b=t=>null===t||!("object"==typeof t||"function"==typeof t),S=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class k{constructor(t,e,n){this.dirty=!0,this.element=t,this.name=e,this.strings=n,this.parts=[];for(let t=0;t<n.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new x(this)}_getValue(){const t=this.strings,e=t.length-1;let n="";for(let i=0;i<e;i++){n+=t[i];const e=this.parts[i];if(void 0!==e){const t=e.value;if(b(t)||!S(t))n+="string"==typeof t?t:String(t);else for(const e of t)n+="string"==typeof e?e:String(e)}}return n+=t[e],n}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===g||b(t)&&t===this.value||(this.value=t,p(t)||(this.committer.dirty=!0))}commit(){for(;p(this.value);){const t=this.value;this.value=g,t(this)}this.value!==g&&this.committer.commit()}}class C{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(c()),this.endNode=t.appendChild(c())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=c()),t.__insert(this.endNode=c())}insertAfterPart(t){t.__insert(this.startNode=c()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;p(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=g,t(this)}const t=this.__pendingValue;t!==g&&(b(t)?t!==this.value&&this.__commitText(t):t instanceof w?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):S(t)?this.__commitIterable(t):t===v?(this.value=v,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,n="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=n:this.__commitNode(document.createTextNode(n)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof y&&this.value.template===e)this.value.update(t.values);else{const n=new y(e,t.processor,this.options),i=n._clone();n.update(t.values),this.__commitNode(i),this.value=n}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let n,i=0;for(const r of t)n=e[i],void 0===n&&(n=new C(this.options),e.push(n),0===i?n.appendIntoPart(this):n.insertAfterPart(e[i-1])),n.setValue(r),n.commit(),i++;i<e.length&&(e.length=i,this.clear(n&&n.endNode))}clear(t=this.startNode){n(this.startNode.parentNode,t.nextSibling,this.endNode)}}class ${constructor(t,e,n){if(this.value=void 0,this.__pendingValue=void 0,2!==n.length||""!==n[0]||""!==n[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=n}setValue(t){this.__pendingValue=t}commit(){for(;p(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=g,t(this)}if(this.__pendingValue===g)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=g}}class O extends k{constructor(t,e,n){super(t,e,n),this.single=2===n.length&&""===n[0]&&""===n[1]}_createPart(){return new P(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class P extends x{}let N=!1;(()=>{try{const t={get capture(){return N=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class M{constructor(t,e,n){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=n,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;p(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=g,t(this)}if(this.__pendingValue===g)return;const t=this.__pendingValue,e=this.value,n=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||n);n&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=F(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=g}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const F=t=>t&&(N?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
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
 */;function T(t){let e=A.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},A.set(t.type,e));let n=e.stringsArray.get(t.strings);if(void 0!==n)return n;const r=t.strings.join(i);return n=e.keyString.get(r),void 0===n&&(n=new s(t,t.getTemplateElement()),e.keyString.set(r,n)),e.stringsArray.set(t.strings,n),n}const A=new Map,D=new WeakMap;
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
 */const E=new
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
class{handleAttributeExpressions(t,e,n,i){const r=e[0];if("."===r){return new O(t,e.slice(1),n).parts}if("@"===r)return[new M(t,e.slice(1),i.eventContext)];if("?"===r)return[new $(t,e.slice(1),n)];return new k(t,e,n).parts}handleTextExpression(t){return new C(t)}};
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
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.2.1");const j=(t,...e)=>new w(t,e,"html",E)
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
 */,V=(t,e)=>`${t}--${e}`;let z=!0;void 0===window.ShadyCSS?z=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),z=!1);const H=t=>e=>{const n=V(e.type,t);let r=A.get(n);void 0===r&&(r={stringsArray:new WeakMap,keyString:new Map},A.set(n,r));let o=r.stringsArray.get(e.strings);if(void 0!==o)return o;const a=e.strings.join(i);if(o=r.keyString.get(a),void 0===o){const n=e.getTemplateElement();z&&window.ShadyCSS.prepareTemplateDom(n,t),o=new s(e,n),r.keyString.set(a,o)}return r.stringsArray.set(e.strings,o),o},L=["html","svg"],U=new Set,R=(t,e,n)=>{U.add(t);const i=n?n.element:document.createElement("template"),r=e.querySelectorAll("style"),{length:o}=r;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(i,t);const s=document.createElement("style");for(let t=0;t<o;t++){const e=r[t];e.parentNode.removeChild(e),s.textContent+=e.textContent}(t=>{L.forEach(e=>{const n=A.get(V(e,t));void 0!==n&&n.keyString.forEach(t=>{const{element:{content:e}}=t,n=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{n.add(t)}),d(t,n)})})})(t);const a=i.content;n?function(t,e,n=null){const{element:{content:i},parts:r}=t;if(null==n)return void i.appendChild(e);const o=document.createTreeWalker(i,133,null,!1);let s=m(r),a=0,u=-1;for(;o.nextNode();){u++;for(o.currentNode===n&&(a=h(e),n.parentNode.insertBefore(e,n));-1!==s&&r[s].index===u;){if(a>0){for(;-1!==s;)r[s].index+=a,s=m(r,s);return}s=m(r,s)}}}(n,s,a.firstChild):a.insertBefore(s,a.firstChild),window.ShadyCSS.prepareTemplateStyles(i,t);const u=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==u)e.insertBefore(u.cloneNode(!0),e.firstChild);else if(n){a.insertBefore(s,a.firstChild);const t=new Set;t.add(s),d(n,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const I={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},Y=(t,e)=>e!==t&&(e==e||t==t),q={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:Y};class W extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,n)=>{const i=this._attributeNameForProperty(n,e);void 0!==i&&(this._attributeToPropertyMap.set(i,n),t.push(i))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=q){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const n="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}static getPropertyDescriptor(t,e,n){return{get(){return this[e]},set(i){const r=this[t];this[e]=i,this.requestUpdateInternal(t,r,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||q}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty("finalized")||t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const n of e)this.createProperty(n,t[n])}}static _attributeNameForProperty(t,e){const n=e.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,n=Y){return n(t,e)}static _propertyValueFromAttribute(t,e){const n=e.type,i=e.converter||I,r="function"==typeof i?i:i.fromAttribute;return r?r(t,n):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const n=e.type,i=e.converter;return(i&&i.toAttribute||I.toAttribute)(t,n)}initialize(){this._updateState=0,this._updatePromise=new Promise(t=>this._enableUpdatingResolver=t),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,n){e!==n&&this._attributeToProperty(t,n)}_propertyToAttribute(t,e,n=q){const i=this.constructor,r=i._attributeNameForProperty(t,n);if(void 0!==r){const t=i._propertyValueToAttribute(e,n);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(r):this.setAttribute(r,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const n=this.constructor,i=n._attributeToPropertyMap.get(t);if(void 0!==i){const t=n.getPropertyOptions(i);this._updateState=16|this._updateState,this[i]=n._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,n){let i=!0;if(void 0!==t){const r=this.constructor;n=n||r.getPropertyOptions(t),r._valueHasChanged(this[t],e,n.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==n.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,n))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(e){throw t=!1,this._markUpdated(),e}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}W.finalized=!0;
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
const B=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:n,elements:i}=e;return{kind:n,elements:i,finisher(e){window.customElements.define(t,e)}}})(t,e),J=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?Object.assign(Object.assign({},e),{finisher(n){n.createProperty(e.key,t)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(n){n.createProperty(e.key,t)}};function Z(t){return(e,n)=>void 0!==n?((t,e,n)=>{e.constructor.createProperty(n,t)})(t,e,n):J(t,e)}function X(t){return Z({attribute:!1,hasChanged:null==t?void 0:t.hasChanged})}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const G=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol();class Q{constructor(t,e){if(e!==K)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(G?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const tt=(t,...e)=>{const n=e.reduce((e,n,i)=>e+(t=>{if(t instanceof Q)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+t[i+1],t[0]);return new Q(n,K)};
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.4.0");const et={};class nt extends W{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,n)=>t.reduceRight((t,n)=>Array.isArray(n)?e(n,t):(t.add(n),t),n),n=e(t,new Set),i=[];n.forEach(t=>i.unshift(t)),this._styles=i}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map(t=>{if(t instanceof CSSStyleSheet&&!G){const e=Array.prototype.slice.call(t.cssRules).reduce((t,e)=>t+e.cssText,"");return new Q(String(e),K)}return t})}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?G?this.renderRoot.adoptedStyleSheets=t.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==et&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){return et}}nt.finalized=!0,nt.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const r=i.scopeName,o=D.has(e),s=z&&11===e.nodeType&&!!e.host,a=s&&!U.has(r),u=a?document.createDocumentFragment():e;if(((t,e,i)=>{let r=D.get(e);void 0===r&&(n(e,e.firstChild),D.set(e,r=new C(Object.assign({templateFactory:T},i))),r.appendInto(e)),r.setValue(t),r.commit()})(t,u,Object.assign({templateFactory:H(r)},i)),a){const t=D.get(u);D.delete(u);const i=t.value instanceof y?t.value.template:void 0;R(r,u,i),n(e,e.firstChild),e.appendChild(u),D.set(e,t)}!o&&s&&window.ShadyCSS.styleElement(e.host)};
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
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
const it=new WeakMap,rt=(ot=t=>e=>{if(!(e instanceof x)||e instanceof P||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:n}=e,{style:i}=n.element;let r=it.get(e);void 0===r&&(i.cssText=n.strings.join(" "),it.set(e,r=new Set)),r.forEach(e=>{e in t||(r.delete(e),-1===e.indexOf("-")?i[e]=null:i.removeProperty(e))});for(const e in t)r.add(e),-1===e.indexOf("-")?i[e]=t[e]:i.setProperty(e,t[e])},(...t)=>{const e=ot(...t);return f.set(e,!0),e});var ot,st=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,at="[^\\s]+",ut=/\[([^]*?)\]/gm;function ct(t,e){for(var n=[],i=0,r=t.length;i<r;i++)n.push(t[i].substr(0,e));return n}var lt=function(t){return function(e,n){var i=n[t].map((function(t){return t.toLowerCase()})).indexOf(e.toLowerCase());return i>-1?i:null}};function dt(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var i=0,r=e;i<r.length;i++){var o=r[i];for(var s in o)t[s]=o[s]}return t}var ht=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],mt=["January","February","March","April","May","June","July","August","September","October","November","December"],ft=ct(mt,3),pt={dayNamesShort:ct(ht,3),dayNames:ht,monthNamesShort:ft,monthNames:mt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},gt=dt({},pt),vt=function(t,e){for(void 0===e&&(e=2),t=String(t);t.length<e;)t="0"+t;return t},yt={D:function(t){return String(t.getDate())},DD:function(t){return vt(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return String(t.getDay())},dd:function(t){return vt(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return String(t.getMonth()+1)},MM:function(t){return vt(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return vt(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return vt(t.getFullYear(),4)},h:function(t){return String(t.getHours()%12||12)},hh:function(t){return vt(t.getHours()%12||12)},H:function(t){return String(t.getHours())},HH:function(t){return vt(t.getHours())},m:function(t){return String(t.getMinutes())},mm:function(t){return vt(t.getMinutes())},s:function(t){return String(t.getSeconds())},ss:function(t){return vt(t.getSeconds())},S:function(t){return String(Math.round(t.getMilliseconds()/100))},SS:function(t){return vt(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return vt(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+vt(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)},Z:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+vt(Math.floor(Math.abs(e)/60),2)+":"+vt(Math.abs(e)%60,2)}},_t=function(t){return+t-1},wt=[null,"[1-9]\\d?"],bt=[null,at],St=["isPm",at,function(t,e){var n=t.toLowerCase();return n===e.amPm[0]?0:n===e.amPm[1]?1:null}],kt=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var n=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?n:-n}return 0}],xt=(lt("monthNamesShort"),lt("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"}),Ct=function(t,e,n){if(void 0===e&&(e=xt.default),void 0===n&&(n={}),"number"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw new Error("Invalid Date pass to format");var i=[];e=(e=xt[e]||e).replace(ut,(function(t,e){return i.push(e),"@@@"}));var r=dt(dt({},gt),n);return(e=e.replace(st,(function(e){return yt[e](t,r)}))).replace(/@@@/g,(function(){return i.shift()}))};var $t=Ct,Ot=function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric"})}:function(t){return $t(t,"mediumDate")},Pt=function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleString(e,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return $t(t,"haDateTime")},Nt=function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleTimeString(e,{hour:"numeric",minute:"2-digit"})}:function(t){return $t(t,"shortTime")};function Mt(t){return t.substr(0,t.indexOf("."))}function Ft(t,e,n){if("unknown"===e.state||"unavailable"===e.state)return t("state.default."+e.state);if(e.attributes.unit_of_measurement)return e.state+" "+e.attributes.unit_of_measurement;var i=function(t){return Mt(t.entity_id)}(e);if("input_datetime"===i){var r;if(!e.attributes.has_time)return r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),Ot(r,n);if(!e.attributes.has_date){var o=new Date;return r=new Date(o.getFullYear(),o.getMonth(),o.getDay(),e.attributes.hour,e.attributes.minute),Nt(r,n)}return r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),Pt(r,n)}return e.attributes.device_class&&t("component."+i+".state."+e.attributes.device_class+"."+e.state)||t("component."+i+".state._."+e.state)||e.state}var Tt="hass:bookmark",At=function(t,e,n,i){i=i||{},n=null==n?{}:n;var r=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return r.detail=n,t.dispatchEvent(r),r},Dt={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function Et(t,e){if(t in Dt)return Dt[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"hass:bell-plus";case"armed_night":return"hass:bell-sleep";case"disarmed":return"hass:bell-outline";case"triggered":return"hass:bell-ring";default:return"hass:bell"}case"binary_sensor":return e&&"off"===e?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return"closed"===e?"hass:window-closed":"hass:window-open";case"lock":return e&&"unlocked"===e?"hass:lock-open":"hass:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"hass:cast-connected":"hass:cast";case"zwave":switch(e){case"dead":return"hass:emoticon-dead";case"sleeping":return"hass:sleep";case"initializing":return"hass:timer-sand";default:return"hass:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),Tt}}var jt={humidity:"hass:water-percent",illuminance:"hass:brightness-5",temperature:"hass:thermometer",pressure:"hass:gauge",power:"hass:flash",signal_strength:"hass:wifi"},Vt={binary_sensor:function(t){var e=t.state&&"off"===t.state;switch(t.attributes.device_class){case"battery":return e?"hass:battery":"hass:battery-outline";case"cold":return e?"hass:thermometer":"hass:snowflake";case"connectivity":return e?"hass:server-network-off":"hass:server-network";case"door":return e?"hass:door-closed":"hass:door-open";case"garage_door":return e?"hass:garage":"hass:garage-open";case"gas":case"power":case"problem":case"safety":case"smoke":return e?"hass:shield-check":"hass:alert";case"heat":return e?"hass:thermometer":"hass:fire";case"light":return e?"hass:brightness-5":"hass:brightness-7";case"lock":return e?"hass:lock":"hass:lock-open";case"moisture":return e?"hass:water-off":"hass:water";case"motion":return e?"hass:walk":"hass:run";case"occupancy":return e?"hass:home-outline":"hass:home";case"opening":return e?"hass:square":"hass:square-outline";case"plug":return e?"hass:power-plug-off":"hass:power-plug";case"presence":return e?"hass:home-outline":"hass:home";case"sound":return e?"hass:music-note-off":"hass:music-note";case"vibration":return e?"hass:crop-portrait":"hass:vibrate";case"window":return e?"hass:window-closed":"hass:window-open";default:return e?"hass:radiobox-blank":"hass:checkbox-marked-circle"}},cover:function(t){var e="closed"!==t.state;switch(t.attributes.device_class){case"garage":return e?"hass:garage-open":"hass:garage";case"door":return e?"hass:door-open":"hass:door-closed";case"shutter":return e?"hass:window-shutter-open":"hass:window-shutter";case"blind":return e?"hass:blinds-open":"hass:blinds";case"window":return e?"hass:window-open":"hass:window-closed";default:return Et("cover",t.state)}},sensor:function(t){var e=t.attributes.device_class;if(e&&e in jt)return jt[e];if("battery"===e){var n=Number(t.state);if(isNaN(n))return"hass:battery-unknown";var i=10*Math.round(n/10);return i>=100?"hass:battery":i<=0?"hass:battery-alert":"hass:battery-"+i}var r=t.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"hass:thermometer":Et("sensor")},input_datetime:function(t){return t.attributes.has_date?t.attributes.has_time?Et("input_datetime"):"hass:calendar":"hass:clock"}};const zt={state:!0,duration:!0,start_date:!0,end_date:!0,icon:!0,separator:!1},Ht={largest:1,labels:void 0,delimiter:void 0,units:["w","d","h","m","s"]},Lt={width:1,style:"solid",color:"var(--divider-color)"},Ut={required:{icon:"tune",name:"Required",secondary:"Required options for this card to function",show:!0},showOptions:{icon:"toggle-switch",name:"Show",secondary:"Customize what to display",show:!1},appearance:{icon:"palette",name:"Appearance",secondary:"Customize the title, number of events to display, etc",show:!1}};let Rt=class extends nt{constructor(){super(...arguments),this._initialized=!1}setConfig(t){this._config=t,this.loadCardHelpers()}get _title(){return this._config&&this._config.title||""}get _entity(){return this._config&&this._config.entity||""}get _history(){return this._config&&this._config.history||5}get _desc(){return!this._config||void 0===this._config.desc||this._config.desc}get _date_format(){return this._config&&this._config.date_format||""}get _no_event(){return this._config&&this._config.no_event||""}get _max_items(){return this._config&&this._config.max_items||-1}get _collapse(){if(this._config)return this._config.collapse}get _show_state(){var t;return!this._config||!this._config.show||(null===(t=this._config.show)||void 0===t?void 0:t.state)}get _show_duration(){var t;return!this._config||!this._config.show||(null===(t=this._config.show)||void 0===t?void 0:t.duration)}get _show_start_date(){var t;return!this._config||!this._config.show||(null===(t=this._config.show)||void 0===t?void 0:t.start_date)}get _show_end_date(){var t;return!this._config||!this._config.show||(null===(t=this._config.show)||void 0===t?void 0:t.end_date)}get _show_icon(){var t;return!this._config||!this._config.show||(null===(t=this._config.show)||void 0===t?void 0:t.icon)}get _show_separator(){var t;return!(!this._config||!this._config.show)&&(null===(t=this._config.show)||void 0===t?void 0:t.separator)}render(){if(!this.hass)return j``;const t=Object.keys(this.hass.states).sort();return j`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${"required"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Ut.required.icon}></ha-icon>
            <div class="title">${Ut.required.name}</div>
          </div>
          <div class="secondary">${Ut.required.secondary}</div>
        </div>
        ${Ut.required.show?j`
              <div class="values">
                <paper-dropdown-menu
                  label="Entity (Required)"
                  @value-changed=${this._valueChanged}
                  .configValue=${"entity"}
                >
                  <paper-listbox slot="dropdown-content" .selected=${t.indexOf(this._entity)}>
                    ${t.map(t=>j`
                        <paper-item>${t}</paper-item>
                      `)}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"appearance"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Ut.appearance.icon}></ha-icon>
            <div class="title">${Ut.appearance.name}</div>
          </div>
          <div class="secondary">${Ut.appearance.secondary}</div>
        </div>
        ${Ut.appearance.show?j`
              <div class="values">
                <paper-input
                  label="Title (Optional)"
                  .value=${this._title}
                  .configValue=${"title"}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <paper-input
                  type="number"
                  label="History: Numbers of days of history of the logbook"
                  min="1"
                  .value=${this._history}
                  .configValue=${"history"}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <paper-input
                  type="number"
                  min="-1"
                  label="Max Items: Maximum of events to display (-1 to display all events)"
                  .value=${this._max_items}
                  .configValue=${"max_items"}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <paper-input
                  label="Text when no event"
                  .value=${this._no_event}
                  .configValue=${"no_event"}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <paper-input
                  type="number"
                  label="Collapse: Number of entities to show. Rest will be available in expandable section"
                  .value=${this._collapse}
                  .configValue=${"collapse"}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <paper-input
                  label="Date format"
                  .value=${this._date_format}
                  .configValue=${"date_format"}
                  @value-changed=${this._valueChanged}
                ></paper-input>
                <p>
                  <ha-formfield .label=${"Display events descending "+(this._desc?"on":"off")}>
                    <ha-switch
                      aria-label=${"Toggle desc "+(this._desc?"on":"off")}
                      .checked=${!1!==this._desc}
                      .configValue=${"desc"}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                </p>
              </div>
            `:""}
        <div class="option" @click=${this._toggleOption} .option=${"showOptions"}>
          <div class="row">
            <ha-icon .icon=${"mdi:"+Ut.showOptions.icon}></ha-icon>
            <div class="title">${Ut.showOptions.name}</div>
          </div>
          <div class="secondary">${Ut.showOptions.secondary}</div>
        </div>
        ${Ut.showOptions.show?j`
              <div class="values">
                <p>
                  <ha-formfield .label=${"Display state"}>
                    <ha-switch
                      aria-label=${"Toggle display of state "+(this._show_state?"off":"on")}
                      .checked=${!1!==this._show_state}
                      .configValue=${"state"}
                      @change=${this._showOptionChanged}
                    ></ha-switch>
                  </ha-formfield>
                </p>
                <p>
                  <ha-formfield .label=${"Display duration"}>
                    <ha-switch
                      aria-label=${"Toggle display of duration "+(this._show_state?"off":"on")}
                      .checked=${!1!==this._show_duration}
                      .configValue=${"duration"}
                      @change=${this._showOptionChanged}
                    ></ha-switch>
                  </ha-formfield>
                </p>

                <ha-formfield .label=${"Display start date"}>
                  <ha-switch
                    aria-label=${"Toggle display of start date "+(this._show_start_date?"off":"on")}
                    .checked=${!1!==this._show_start_date}
                    .configValue=${"start_date"}
                    @change=${this._showOptionChanged}
                  ></ha-switch>
                </ha-formfield>
                </p>
                <p>
                  <ha-formfield .label=${"Display end date"}>
                    <ha-switch
                      aria-label=${"Toggle display of end date "+(this._show_end_date?"off":"on")}
                      .checked=${!1!==this._show_end_date}
                      .configValue=${"end_date"}
                      @change=${this._showOptionChanged}
                    ></ha-switch>
                  </ha-formfield>
                </p>
                <p>
                  <ha-formfield .label=${"Display icon"}>
                    <ha-switch
                      aria-label=${"Toggle display of icon "+(this._show_icon?"off":"on")}
                      .checked=${!0===this._show_icon}
                      .configValue=${"icon"}
                      @change=${this._showOptionChanged}
                    ></ha-switch>
                  </ha-formfield>
                </p>
                <p>
                  <ha-formfield .label=${"Display separator"}>
                    <ha-switch
                      aria-label=${"Toggle display of event separator "+(this._show_separator?"off":"on")}
                      .checked=${!1!==this._show_separator}
                      .configValue=${"separator"}
                      @change=${this._showOptionChanged}
                    ></ha-switch>
                  </ha-formfield>
                </p>  
              </div>
            `:""}
      </div>

      <p class="note">
        Note: Setting hiddenState, duration_labels, attributes, separator_style, state_map are available exclusively
        using Code Editor.
      </p>
    `}_initialize(){void 0!==this.hass&&void 0!==this._config&&void 0!==this._helpers&&(this._initialized=!0)}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}_toggleOption(t){this._toggleThing(t,Ut)}_toggleThing(t,e){const n=!e[t.target.option].show;for(const[t]of Object.entries(e))e[t].show=!1;e[t.target.option].show=n,this._toggle=!this._toggle}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;this["_"+e.configValue]!==e.value&&(e.configValue&&(""===e.value?delete this._config[e.configValue]:this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:void 0!==e.checked?e.checked:e.attributes.type&&"number"===e.attributes.type.value&&Number.parseInt(e.value)?Number.parseInt(e.value):e.value})),At(this,"config-changed",{config:this._config}))}_showOptionChanged(t){if(!this._config||!this.hass)return;const e=t.target;e.configValue&&(this._config=Object.assign(Object.assign({},this._config),{show:Object.assign(Object.assign({},this._config.show||zt),{[e.configValue]:e.checked})})),At(this,"config-changed",{config:this._config})}static get styles(){return tt`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
      }
      ha-switch {
        padding-bottom: 8px;
      }
      .note {
        font-weight: bold;
      }
    `}};t([Z({attribute:!1})],Rt.prototype,"hass",void 0),t([X()],Rt.prototype,"_config",void 0),t([X()],Rt.prototype,"_toggle",void 0),t([X()],Rt.prototype,"_helpers",void 0),Rt=t([B("logbook-card-editor")],Rt);var It=function(){function t(){var t=this;this.languages={ar:{y:function(t){return 1===t?"سنة":"سنوات"},mo:function(t){return 1===t?"شهر":"أشهر"},w:function(t){return 1===t?"أسبوع":"أسابيع"},d:function(t){return 1===t?"يوم":"أيام"},h:function(t){return 1===t?"ساعة":"ساعات"},m:function(e){return["دقيقة","دقائق"][t.getArabicForm(e)]},s:function(t){return 1===t?"ثانية":"ثواني"},ms:function(t){return 1===t?"جزء من الثانية":"أجزاء من الثانية"},decimal:","},bg:{y:function(e){return["години","година","години"][t.getSlavicForm(e)]},mo:function(e){return["месеца","месец","месеца"][t.getSlavicForm(e)]},w:function(e){return["седмици","седмица","седмици"][t.getSlavicForm(e)]},d:function(e){return["дни","ден","дни"][t.getSlavicForm(e)]},h:function(e){return["часа","час","часа"][t.getSlavicForm(e)]},m:function(e){return["минути","минута","минути"][t.getSlavicForm(e)]},s:function(e){return["секунди","секунда","секунди"][t.getSlavicForm(e)]},ms:function(e){return["милисекунди","милисекунда","милисекунди"][t.getSlavicForm(e)]},decimal:","},ca:{y:function(t){return"any"+(1===t?"":"s")},mo:function(t){return"mes"+(1===t?"":"os")},w:function(t){return"setman"+(1===t?"a":"es")},d:function(t){return"di"+(1===t?"a":"es")},h:function(t){return"hor"+(1===t?"a":"es")},m:function(t){return"minut"+(1===t?"":"s")},s:function(t){return"segon"+(1===t?"":"s")},ms:function(t){return"milisegon"+(1===t?"":"s")},decimal:","},cs:{y:function(e){return["rok","roku","roky","let"][t.getCzechOrSlovakForm(e)]},mo:function(e){return["měsíc","měsíce","měsíce","měsíců"][t.getCzechOrSlovakForm(e)]},w:function(e){return["týden","týdne","týdny","týdnů"][t.getCzechOrSlovakForm(e)]},d:function(e){return["den","dne","dny","dní"][t.getCzechOrSlovakForm(e)]},h:function(e){return["hodina","hodiny","hodiny","hodin"][t.getCzechOrSlovakForm(e)]},m:function(e){return["minuta","minuty","minuty","minut"][t.getCzechOrSlovakForm(e)]},s:function(e){return["sekunda","sekundy","sekundy","sekund"][t.getCzechOrSlovakForm(e)]},ms:function(e){return["milisekunda","milisekundy","milisekundy","milisekund"][t.getCzechOrSlovakForm(e)]},decimal:","},da:{y:function(){return"år"},mo:function(t){return"måned"+(1===t?"":"er")},w:function(t){return"uge"+(1===t?"":"r")},d:function(t){return"dag"+(1===t?"":"e")},h:function(t){return"time"+(1===t?"":"r")},m:function(t){return"minut"+(1===t?"":"ter")},s:function(t){return"sekund"+(1===t?"":"er")},ms:function(t){return"millisekund"+(1===t?"":"er")},decimal:","},de:{y:function(t){return"Jahr"+(1===t?"":"e")},mo:function(t){return"Monat"+(1===t?"":"e")},w:function(t){return"Woche"+(1===t?"":"n")},d:function(t){return"Tag"+(1===t?"":"e")},h:function(t){return"Stunde"+(1===t?"":"n")},m:function(t){return"Minute"+(1===t?"":"n")},s:function(t){return"Sekunde"+(1===t?"":"n")},ms:function(t){return"Millisekunde"+(1===t?"":"n")},decimal:","},el:{y:function(t){return 1===t?"χρόνος":"χρόνια"},mo:function(t){return 1===t?"μήνας":"μήνες"},w:function(t){return 1===t?"εβδομάδα":"εβδομάδες"},d:function(t){return 1===t?"μέρα":"μέρες"},h:function(t){return 1===t?"ώρα":"ώρες"},m:function(t){return 1===t?"λεπτό":"λεπτά"},s:function(t){return 1===t?"δευτερόλεπτο":"δευτερόλεπτα"},ms:function(t){return 1===t?"χιλιοστό του δευτερολέπτου":"χιλιοστά του δευτερολέπτου"},decimal:","},en:{y:function(t){return"year"+(1===t?"":"s")},mo:function(t){return"month"+(1===t?"":"s")},w:function(t){return"week"+(1===t?"":"s")},d:function(t){return"day"+(1===t?"":"s")},h:function(t){return"hour"+(1===t?"":"s")},m:function(t){return"minute"+(1===t?"":"s")},s:function(t){return"second"+(1===t?"":"s")},ms:function(t){return"millisecond"+(1===t?"":"s")},decimal:"."},es:{y:function(t){return"año"+(1===t?"":"s")},mo:function(t){return"mes"+(1===t?"":"es")},w:function(t){return"semana"+(1===t?"":"s")},d:function(t){return"día"+(1===t?"":"s")},h:function(t){return"hora"+(1===t?"":"s")},m:function(t){return"minuto"+(1===t?"":"s")},s:function(t){return"segundo"+(1===t?"":"s")},ms:function(t){return"milisegundo"+(1===t?"":"s")},decimal:","},et:{y:function(t){return"aasta"+(1===t?"":"t")},mo:function(t){return"kuu"+(1===t?"":"d")},w:function(t){return"nädal"+(1===t?"":"at")},d:function(t){return"päev"+(1===t?"":"a")},h:function(t){return"tund"+(1===t?"":"i")},m:function(t){return"minut"+(1===t?"":"it")},s:function(t){return"sekund"+(1===t?"":"it")},ms:function(t){return"millisekund"+(1===t?"":"it")},decimal:","},fa:{y:function(){return"سال"},mo:function(){return"ماه"},w:function(){return"هفته"},d:function(){return"روز"},h:function(){return"ساعت"},m:function(){return"دقیقه"},s:function(){return"ثانیه"},ms:function(){return"میلی ثانیه"},decimal:"."},fi:{y:function(t){return 1===t?"vuosi":"vuotta"},mo:function(t){return 1===t?"kuukausi":"kuukautta"},w:function(t){return"viikko"+(1===t?"":"a")},d:function(t){return"päivä"+(1===t?"":"ä")},h:function(t){return"tunti"+(1===t?"":"a")},m:function(t){return"minuutti"+(1===t?"":"a")},s:function(t){return"sekunti"+(1===t?"":"a")},ms:function(t){return"millisekunti"+(1===t?"":"a")},decimal:","},fo:{y:function(){return"ár"},mo:function(t){return 1===t?"mánaður":"mánaðir"},w:function(t){return 1===t?"vika":"vikur"},d:function(t){return 1===t?"dagur":"dagar"},h:function(t){return 1===t?"tími":"tímar"},m:function(t){return 1===t?"minuttur":"minuttir"},s:function(){return"sekund"},ms:function(){return"millisekund"},decimal:","},fr:{y:function(t){return"an"+(t>=2?"s":"")},mo:function(){return"mois"},w:function(t){return"semaine"+(t>=2?"s":"")},d:function(t){return"jour"+(t>=2?"s":"")},h:function(t){return"heure"+(t>=2?"s":"")},m:function(t){return"minute"+(t>=2?"s":"")},s:function(t){return"seconde"+(t>=2?"s":"")},ms:function(t){return"milliseconde"+(t>=2?"s":"")},decimal:","},hr:{y:function(t){return t%10==2||t%10==3||t%10==4?"godine":"godina"},mo:function(t){return 1===t?"mjesec":2===t||3===t||4===t?"mjeseca":"mjeseci"},w:function(t){return t%10==1&&11!==t?"tjedan":"tjedna"},d:function(t){return 1===t?"dan":"dana"},h:function(t){return 1===t?"sat":2===t||3===t||4===t?"sata":"sati"},m:function(t){var e=t%10;return 2!==e&&3!==e&&4!==e||!(t<10||t>14)?"minuta":"minute"},s:function(t){return 10===t||11===t||12===t||13===t||14===t||16===t||17===t||18===t||19===t||t%10==5?"sekundi":t%10==1?"sekunda":t%10==2||t%10==3||t%10==4?"sekunde":"sekundi"},ms:function(t){return 1===t?"milisekunda":t%10==2||t%10==3||t%10==4?"milisekunde":"milisekundi"},decimal:","},hu:{y:function(){return"év"},mo:function(){return"hónap"},w:function(){return"hét"},d:function(){return"nap"},h:function(){return"óra"},m:function(){return"perc"},s:function(){return"másodperc"},ms:function(){return"ezredmásodperc"},decimal:","},id:{y:function(){return"tahun"},mo:function(){return"bulan"},w:function(){return"minggu"},d:function(){return"hari"},h:function(){return"jam"},m:function(){return"menit"},s:function(){return"detik"},ms:function(){return"milidetik"},decimal:"."},is:{y:function(){return"ár"},mo:function(t){return"mánuð"+(1===t?"ur":"ir")},w:function(t){return"vik"+(1===t?"a":"ur")},d:function(t){return"dag"+(1===t?"ur":"ar")},h:function(t){return"klukkutím"+(1===t?"i":"ar")},m:function(t){return"mínút"+(1===t?"a":"ur")},s:function(t){return"sekúnd"+(1===t?"a":"ur")},ms:function(t){return"millisekúnd"+(1===t?"a":"ur")},decimal:"."},it:{y:function(t){return"ann"+(1===t?"o":"i")},mo:function(t){return"mes"+(1===t?"e":"i")},w:function(t){return"settiman"+(1===t?"a":"e")},d:function(t){return"giorn"+(1===t?"o":"i")},h:function(t){return"or"+(1===t?"a":"e")},m:function(t){return"minut"+(1===t?"o":"i")},s:function(t){return"second"+(1===t?"o":"i")},ms:function(t){return"millisecond"+(1===t?"o":"i")},decimal:","},ja:{y:function(){return"年"},mo:function(){return"月"},w:function(){return"週"},d:function(){return"日"},h:function(){return"時間"},m:function(){return"分"},s:function(){return"秒"},ms:function(){return"ミリ秒"},decimal:"."},ko:{y:function(){return"년"},mo:function(){return"개월"},w:function(){return"주일"},d:function(){return"일"},h:function(){return"시간"},m:function(){return"분"},s:function(){return"초"},ms:function(){return"밀리 초"},decimal:"."},lo:{y:function(){return"ປີ"},mo:function(){return"ເດືອນ"},w:function(){return"ອາທິດ"},d:function(){return"ມື້"},h:function(){return"ຊົ່ວໂມງ"},m:function(){return"ນາທີ"},s:function(){return"ວິນາທີ"},ms:function(){return"ມິນລິວິນາທີ"},decimal:","},lt:{y:function(t){return t%10==0||t%100>=10&&t%100<=20?"metų":"metai"},mo:function(e){return["mėnuo","mėnesiai","mėnesių"][t.getLithuanianForm(e)]},w:function(e){return["savaitė","savaitės","savaičių"][t.getLithuanianForm(e)]},d:function(e){return["diena","dienos","dienų"][t.getLithuanianForm(e)]},h:function(e){return["valanda","valandos","valandų"][t.getLithuanianForm(e)]},m:function(e){return["minutė","minutės","minučių"][t.getLithuanianForm(e)]},s:function(e){return["sekundė","sekundės","sekundžių"][t.getLithuanianForm(e)]},ms:function(e){return["milisekundė","milisekundės","milisekundžių"][t.getLithuanianForm(e)]},decimal:","},lv:{y:function(e){return["gads","gadi"][t.getLatvianForm(e)]},mo:function(e){return["mēnesis","mēneši"][t.getLatvianForm(e)]},w:function(e){return["nedēļa","nedēļas"][t.getLatvianForm(e)]},d:function(e){return["diena","dienas"][t.getLatvianForm(e)]},h:function(e){return["stunda","stundas"][t.getLatvianForm(e)]},m:function(e){return["minūte","minūtes"][t.getLatvianForm(e)]},s:function(e){return["sekunde","sekundes"][t.getLatvianForm(e)]},ms:function(e){return["milisekunde","milisekundes"][t.getLatvianForm(e)]},decimal:","},ms:{y:function(){return"tahun"},mo:function(){return"bulan"},w:function(){return"minggu"},d:function(){return"hari"},h:function(){return"jam"},m:function(){return"minit"},s:function(){return"saat"},ms:function(){return"milisaat"},decimal:"."},nl:{y:function(){return"jaar"},mo:function(t){return 1===t?"maand":"maanden"},w:function(t){return 1===t?"week":"weken"},d:function(t){return 1===t?"dag":"dagen"},h:function(){return"uur"},m:function(t){return 1===t?"minuut":"minuten"},s:function(t){return 1===t?"seconde":"seconden"},ms:function(t){return 1===t?"milliseconde":"milliseconden"},decimal:","},no:{y:function(){return"år"},mo:function(t){return"måned"+(1===t?"":"er")},w:function(t){return"uke"+(1===t?"":"r")},d:function(t){return"dag"+(1===t?"":"er")},h:function(t){return"time"+(1===t?"":"r")},m:function(t){return"minutt"+(1===t?"":"er")},s:function(t){return"sekund"+(1===t?"":"er")},ms:function(t){return"millisekund"+(1===t?"":"er")},decimal:","},pl:{y:function(e){return["rok","roku","lata","lat"][t.getPolishForm(e)]},mo:function(e){return["miesiąc","miesiąca","miesiące","miesięcy"][t.getPolishForm(e)]},w:function(e){return["tydzień","tygodnia","tygodnie","tygodni"][t.getPolishForm(e)]},d:function(e){return["dzień","dnia","dni","dni"][t.getPolishForm(e)]},h:function(e){return["godzina","godziny","godziny","godzin"][t.getPolishForm(e)]},m:function(e){return["minuta","minuty","minuty","minut"][t.getPolishForm(e)]},s:function(e){return["sekunda","sekundy","sekundy","sekund"][t.getPolishForm(e)]},ms:function(e){return["milisekunda","milisekundy","milisekundy","milisekund"][t.getPolishForm(e)]},decimal:","},pt:{y:function(t){return"ano"+(1===t?"":"s")},mo:function(t){return 1===t?"mês":"meses"},w:function(t){return"semana"+(1===t?"":"s")},d:function(t){return"dia"+(1===t?"":"s")},h:function(t){return"hora"+(1===t?"":"s")},m:function(t){return"minuto"+(1===t?"":"s")},s:function(t){return"segundo"+(1===t?"":"s")},ms:function(t){return"milissegundo"+(1===t?"":"s")},decimal:","},ro:{y:function(t){return 1===t?"an":"ani"},mo:function(t){return 1===t?"lună":"luni"},w:function(t){return 1===t?"săptămână":"săptămâni"},d:function(t){return 1===t?"zi":"zile"},h:function(t){return 1===t?"oră":"ore"},m:function(t){return 1===t?"minut":"minute"},s:function(t){return 1===t?"secundă":"secunde"},ms:function(t){return 1===t?"milisecundă":"milisecunde"},decimal:","},ru:{y:function(e){return["лет","год","года"][t.getSlavicForm(e)]},mo:function(e){return["месяцев","месяц","месяца"][t.getSlavicForm(e)]},w:function(e){return["недель","неделя","недели"][t.getSlavicForm(e)]},d:function(e){return["дней","день","дня"][t.getSlavicForm(e)]},h:function(e){return["часов","час","часа"][t.getSlavicForm(e)]},m:function(e){return["минут","минута","минуты"][t.getSlavicForm(e)]},s:function(e){return["секунд","секунда","секунды"][t.getSlavicForm(e)]},ms:function(e){return["миллисекунд","миллисекунда","миллисекунды"][t.getSlavicForm(e)]},decimal:","},uk:{y:function(e){return["років","рік","роки"][t.getSlavicForm(e)]},mo:function(e){return["місяців","місяць","місяці"][t.getSlavicForm(e)]},w:function(e){return["тижнів","тиждень","тижні"][t.getSlavicForm(e)]},d:function(e){return["днів","день","дні"][t.getSlavicForm(e)]},h:function(e){return["годин","година","години"][t.getSlavicForm(e)]},m:function(e){return["хвилин","хвилина","хвилини"][t.getSlavicForm(e)]},s:function(e){return["секунд","секунда","секунди"][t.getSlavicForm(e)]},ms:function(e){return["мілісекунд","мілісекунда","мілісекунди"][t.getSlavicForm(e)]},decimal:","},ur:{y:function(){return"سال"},mo:function(t){return 1===t?"مہینہ":"مہینے"},w:function(t){return 1===t?"ہفتہ":"ہفتے"},d:function(){return"دن"},h:function(t){return 1===t?"گھنٹہ":"گھنٹے"},m:function(){return"منٹ"},s:function(){return"سیکنڈ"},ms:function(){return"ملی سیکنڈ"},decimal:"."},sk:{y:function(e){return["rok","roky","roky","rokov"][t.getCzechOrSlovakForm(e)]},mo:function(e){return["mesiac","mesiace","mesiace","mesiacov"][t.getCzechOrSlovakForm(e)]},w:function(e){return["týždeň","týždne","týždne","týždňov"][t.getCzechOrSlovakForm(e)]},d:function(e){return["deň","dni","dni","dní"][t.getCzechOrSlovakForm(e)]},h:function(e){return["hodina","hodiny","hodiny","hodín"][t.getCzechOrSlovakForm(e)]},m:function(e){return["minúta","minúty","minúty","minút"][t.getCzechOrSlovakForm(e)]},s:function(e){return["sekunda","sekundy","sekundy","sekúnd"][t.getCzechOrSlovakForm(e)]},ms:function(e){return["milisekunda","milisekundy","milisekundy","milisekúnd"][t.getCzechOrSlovakForm(e)]},decimal:","},sv:{y:function(){return"år"},mo:function(t){return"månad"+(1===t?"":"er")},w:function(t){return"veck"+(1===t?"a":"or")},d:function(t){return"dag"+(1===t?"":"ar")},h:function(t){return"timm"+(1===t?"e":"ar")},m:function(t){return"minut"+(1===t?"":"er")},s:function(t){return"sekund"+(1===t?"":"er")},ms:function(t){return"millisekund"+(1===t?"":"er")},decimal:","},tr:{y:function(){return"yıl"},mo:function(){return"ay"},w:function(){return"hafta"},d:function(){return"gün"},h:function(){return"saat"},m:function(){return"dakika"},s:function(){return"saniye"},ms:function(){return"milisaniye"},decimal:","},th:{y:function(){return"ปี"},mo:function(){return"เดือน"},w:function(){return"อาทิตย์"},d:function(){return"วัน"},h:function(){return"ชั่วโมง"},m:function(){return"นาที"},s:function(){return"วินาที"},ms:function(){return"มิลลิวินาที"},decimal:"."},vi:{y:function(){return"năm"},mo:function(){return"tháng"},w:function(){return"tuần"},d:function(){return"ngày"},h:function(){return"giờ"},m:function(){return"phút"},s:function(){return"giây"},ms:function(){return"mili giây"},decimal:","},zh_CN:{y:function(){return"年"},mo:function(){return"个月"},w:function(){return"周"},d:function(){return"天"},h:function(){return"小时"},m:function(){return"分钟"},s:function(){return"秒"},ms:function(){return"毫秒"},decimal:"."},zh_TW:{y:function(){return"年"},mo:function(){return"個月"},w:function(){return"周"},d:function(){return"天"},h:function(){return"小時"},m:function(){return"分鐘"},s:function(){return"秒"},ms:function(){return"毫秒"},decimal:"."}}}return t.prototype.addLanguage=function(t,e){this.languages[t]=e},t.prototype.getCzechForm=function(t){return 1===t?0:Math.floor(t)!==t?1:t%10>=2&&t%10<=4&&t%100<10?2:3},t.prototype.getPolishForm=function(t){return 1===t?0:Math.floor(t)!==t?1:t%10>=2&&t%10<=4&&!(t%100>10&&t%100<20)?2:3},t.prototype.getSlavicForm=function(t){return Math.floor(t)!==t?2:t>=5&&t<=20||t%10>=5&&t%10<=9||t%10==0?0:t%10==1?1:t>1?2:0},t.prototype.getLithuanianForm=function(t){return 1===t||t%10==1&&t%100>20?0:Math.floor(t)!==t||t%10>=2&&t%100>20||t%10>=2&&t%100<10?1:2},t.prototype.getArabicForm=function(t){return t<=2?0:t>2&&t<11?1:0},t.prototype.getCzechOrSlovakForm=function(t){return 1===t?0:Math.floor(t)!==t?1:t%10>=2&&t%10<=4&&t%100<10?2:3},t.prototype.getLatvianForm=function(t){return 1===t||t%10==1&&t%100!=11?0:1},t}(),Yt=function(){function t(t){this.languageUtil=t,this.defaultOptions={language:"en",delimiter:", ",spacer:" ",conjunction:"",serialComma:!0,units:["y","mo","w","d","h","m","s"],languages:{},largest:10,decimal:".",round:!1,unitMeasures:{y:315576e5,mo:26298e5,w:6048e5,d:864e5,h:36e5,m:6e4,s:1e3,ms:1}},this.options=void 0,this.options=this.defaultOptions}return t.prototype.humanize=function(t,e){var n=void 0!==e?this.extend(this.options,e):this.defaultOptions;return this.doHumanization(t,n)},t.prototype.setOptions=function(t){this.options=void 0!==t?this.extend(this.defaultOptions,t):this.defaultOptions},t.prototype.getSupportedLanguages=function(){var t=[];for(var e in this.languageUtil.languages)this.languageUtil.languages.hasOwnProperty(e)&&t.push(e);return t},t.prototype.addLanguage=function(t,e){this.languageUtil.addLanguage(t,e)},t.prototype.doHumanization=function(t,e){var n,i,r;t=Math.abs(t);var o=e.languages[e.language]||this.languageUtil.languages[e.language];if(!o)throw new Error("No language "+o+".");var s,a,u,c=[];for(n=0,i=e.units.length;n<i;n++)s=e.units[n],a=e.unitMeasures[s],u=n+1===i?t/a:Math.floor(t/a),c.push({unitCount:u,unitName:s}),t-=u*a;var l=0;for(n=0;n<c.length;n++)if(c[n].unitCount){l=n;break}if(e.round){var d=void 0,h=void 0;for(n=c.length-1;n>=0&&((r=c[n]).unitCount=Math.round(r.unitCount),0!==n);n--)h=c[n-1],d=e.unitMeasures[h.unitName]/e.unitMeasures[r.unitName],(r.unitCount%d==0||e.largest&&e.largest-1<n-l)&&(h.unitCount+=r.unitCount/d,r.unitCount=0)}var m=[];for(n=0,c.length;n<i&&((r=c[n]).unitCount&&m.push(this.render(r.unitCount,r.unitName,o,e)),m.length!==e.largest);n++);return m.length?e.conjunction&&1!==m.length?2===m.length?m.join(e.conjunction):m.length>2?m.slice(0,-1).join(e.delimiter)+(e.serialComma?",":"")+e.conjunction+m.slice(-1):void 0:m.join(e.delimiter):this.render(0,e.units[e.units.length-1],o,e)},t.prototype.render=function(t,e,n,i){var r;r=void 0===i.decimal?n.decimal:i.decimal;var o=t.toString().replace(".",r.toString()),s=n[e](t);return o+i.spacer+s},t.prototype.extend=function(t,e){for(var n in e)t.hasOwnProperty(n)&&(t[n]=e[n]);return t},t}(),qt={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning"},Wt={common:qt},Bt={version:"Version",invalid_configuration:"Configuration invalide",show_warning:"Afficher les warning"},Jt={common:Bt},Zt={version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel"},Xt={common:Zt};const Gt={en:Object.freeze({__proto__:null,common:qt,default:Wt}),fr:Object.freeze({__proto__:null,common:Bt,default:Jt}),nb:Object.freeze({__proto__:null,common:Zt,default:Xt})};function Kt(t,e="",n=""){const i=t.split(".")[0],r=t.split(".")[1],o=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let s;try{s=Gt[o][i][r]}catch(t){s=Gt.en[i][r]}return void 0===s&&(s=Gt.en[i][r]),""!==e&&""!==n&&(s=s.replace(e,n)),s}console.info(`%c  LOGBOOK-CARD \n%c  ${Kt("common.version")} 1.5.1    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"logbook-card",name:"Logbook Card",preview:!0,description:"A custom card to display entity history"});let Qt=class extends nt{constructor(){super(...arguments),this.MAX_UPDATE_DURATION=5e3,this.hiddenStateRegexp=new Array}static async getConfigElement(){return document.createElement("logbook-card-editor")}static getStubConfig(t,e){return{entity:e[0]}}setConfig(t){var e,n,i,r;if(!t)throw new Error(Kt("common.invalid_configuration"));if(!t.entity)throw new Error("Please define an entity.");if(void 0!==t.max_items&&!Number.isInteger(t.max_items))throw new Error("max_items must be an Integer.");if(t.hiddenState&&!Array.isArray(t.hiddenState))throw new Error("hiddenState must be an array");if(t.state_map&&!Array.isArray(t.state_map))throw new Error("state_map must be an array");if(t.attributes&&!Array.isArray(t.attributes))throw new Error("attributes must be an array");if(t.desc&&"boolean"!=typeof t.desc)throw new Error("desc must be a boolean");if(t.collapse&&!Number.isInteger(t.collapse))throw new Error("collapse must be a number");if(t.collapse&&t.max_items&&t.collapse>t.max_items)throw new Error("collapse must be greater than max-items");if((null===(e=t.duration)||void 0===e?void 0:e.units)&&!Array.isArray(t.duration.units))throw new Error("duration.units must be an array");if((null===(n=t.duration)||void 0===n?void 0:n.largest)&&!Number.isInteger(t.duration.largest)&&"full"!==t.duration.largest)throw new Error("duration.largest should be a number or `full`");this.config=Object.assign(Object.assign({history:5,hiddenState:[],desc:!0,max_items:-1,no_event:"No event on the period",attributes:[]},t),{state_map:null!==(r=null===(i=t.state_map)||void 0===i?void 0:i.map(t=>{var e;return Object.assign(Object.assign({},t),{regexp:this.wildcardToRegExp(null!==(e=t.value)&&void 0!==e?e:"")})}))&&void 0!==r?r:[],show:Object.assign(Object.assign({},zt),t.show),duration:Object.assign(Object.assign({},Ht),t.duration),duration_labels:Object.assign({},t.duration_labels),separator_style:Object.assign(Object.assign({},Lt),t.separator_style)}),t.hiddenState&&(this.hiddenStateRegexp=t.hiddenState.map(t=>this.wildcardToRegExp(t)))}mapState(t){var e,n;const i=null===(n=null===(e=this.config)||void 0===e?void 0:e.state_map)||void 0===n?void 0:n.find(e=>{var n;return null===(n=e.regexp)||void 0===n?void 0:n.test(t.state)});return void 0!==i&&i.label?i.label:this.hass?Ft(this.hass.localize,t,this.hass.selectedLanguage):t.state}mapIcon(t){var e,n;const i=null===(n=null===(e=this.config)||void 0===e?void 0:e.state_map)||void 0===n?void 0:n.find(e=>{var n;return null===(n=e.regexp)||void 0===n?void 0:n.test(t.state)});return void 0!==i&&i.icon?i.icon:function(t){if(!t)return Tt;if(t.attributes.icon)return t.attributes.icon;var e=Mt(t.entity_id);return e in Vt?Vt[e](t):Et(e,t.state)}(t)}wildcardToRegExp(t){return new RegExp("^"+t.split(/\*+/).map(t=>this.regExpEscape(t)).join(".*")+"$")}regExpEscape(t){return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&")}squashSameState(t,e){const n=t[t.length-1];return!n||n.state!==e.state&&"unknown"!==e.state?t.push(e):(n.end=e.end,n.duration+=e.duration),t}extractAttributes(t){var e,n;return null==(null===(e=this.config)||void 0===e?void 0:e.attributes)?[]:null===(n=this.config)||void 0===n?void 0:n.attributes.reduce((e,n)=>{if(t.attributes[n.value]){const i=t.attributes[n.value];if("object"!=typeof i||Array.isArray(i))Array.isArray(i)?e.push({name:n.label?n.label:n.value,value:this.formatAttributeValue(i.join(","),void 0)}):e.push({name:n.label?n.label:n.value,value:this.formatAttributeValue(i,n.type)});else{Object.keys(i).forEach(t=>{e.push({name:t,value:this.formatAttributeValue(i[t],void 0)})})}}return e},[])}getDuration(t){var e,n,i,r,o,s,a,u,c,l,d,h,m;if(!t)return"";const f=new Yt(new It);let p=f.getSupportedLanguages().includes(null!==(n=null===(e=this.hass)||void 0===e?void 0:e.language)&&void 0!==n?n:"en")?null===(i=this.hass)||void 0===i?void 0:i.language:"en";(null===(o=null===(r=this.config)||void 0===r?void 0:r.duration)||void 0===o?void 0:o.labels)&&(f.addLanguage("custom",{y:()=>"y",mo:()=>{var t,e,n,i;return null!==(i=null===(n=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===n?void 0:n.month)&&void 0!==i?i:"mo"},w:()=>{var t,e,n,i;return null!==(i=null===(n=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===n?void 0:n.week)&&void 0!==i?i:"w"},d:()=>{var t,e,n,i;return null!==(i=null===(n=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===n?void 0:n.day)&&void 0!==i?i:"d"},h:()=>{var t,e,n,i;return null!==(i=null===(n=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===n?void 0:n.hour)&&void 0!==i?i:"h"},m:()=>{var t,e,n,i;return null!==(i=null===(n=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===n?void 0:n.minute)&&void 0!==i?i:"m"},s:()=>{var t,e,n,i;return null!==(i=null===(n=null===(e=null===(t=this.config)||void 0===t?void 0:t.duration)||void 0===e?void 0:e.labels)||void 0===n?void 0:n.second)&&void 0!==i?i:"s"},ms:()=>"ms",decimal:""}),p="custom");const g={language:p,units:null===(a=null===(s=this.config)||void 0===s?void 0:s.duration)||void 0===a?void 0:a.units,round:!0};return"full"!==(null===(c=null===(u=this.config)||void 0===u?void 0:u.duration)||void 0===c?void 0:c.largest)&&(g.largest=null===(d=null===(l=this.config)||void 0===l?void 0:l.duration)||void 0===d?void 0:d.largest),void 0!==(null===(m=null===(h=this.config)||void 0===h?void 0:h.duration)||void 0===m?void 0:m.delimiter)&&(g.delimiter=this.config.duration.delimiter),f.humanize(t,g)}formatAttributeValue(t,e){return"date"===e?this._displayDate(new Date(t)):t}_displayDate(t){var e,n,i,r;return(null===(e=this.config)||void 0===e?void 0:e.date_format)?Ct(t,null!==(i=null===(n=this.config)||void 0===n?void 0:n.date_format)&&void 0!==i?i:void 0):Pt(t,(null===(r=this.hass)||void 0===r?void 0:r.language)||"en")}updateHistory(){var t,e,n;const i=this.hass;if(i&&this.config&&this.config.entity){const r=this.config.entity in i.states?i.states[this.config.entity]:null;if(r){this.config.title=null!==(e=null===(t=this.config)||void 0===t?void 0:t.title)&&void 0!==e?e:r.attributes.friendly_name+" History";const o="history/period/"+new Date((new Date).setDate((new Date).getDate()-(null!==(n=this.config.history)&&void 0!==n?n:5))).toISOString()+"?filter_entity_id="+this.config.entity+"&end_time="+(new Date).toISOString();let s=[];i.callApi("GET",o).then(t=>{var e,n;s=(t[0]||[]).map(t=>({state:t.state,label:this.mapState(t),start:new Date(t.last_changed),attributes:this.extractAttributes(t),icon:this.mapIcon(t)})).map((t,e,n)=>e<n.length-1?Object.assign(Object.assign({},t),{end:n[e+1].start}):Object.assign(Object.assign({},t),{end:new Date})).map(t=>Object.assign(Object.assign({},t),{duration:t.end-t.start})).reduce(this.squashSameState,[]).filter(t=>!this.hiddenStateRegexp.some(e=>e.test(t.state))).map(t=>Object.assign(Object.assign({},t),{duration:this.getDuration(t.duration)})),s&&(null===(e=this.config)||void 0===e?void 0:e.desc)&&(s=s.reverse()),s&&this.config&&this.config.max_items&&this.config.max_items>0&&(s=s.splice(0,null===(n=this.config)||void 0===n?void 0:n.max_items)),this.history=s})}this.lastHistoryChanged=new Date}}shouldUpdate(t){return!!t.has("history")||(t.delete("history"),(!this.lastHistoryChanged||function(t,e,n){if(e.has("config")||n)return!0;if(t.config.entity){var i=e.get("hass");return!i||i.states[t.config.entity]!==t.hass.states[t.config.entity]}return!1}(this,t,!1)||(new Date).getTime()-this.lastHistoryChanged.getTime()>this.MAX_UPDATE_DURATION)&&this.updateHistory(),!1)}render(){return this.config&&this.hass?j`
      <ha-card .header=${this.config.title} tabindex="0" aria-label=${""+this.config.title}>
        <div class="card-content grid" style="[[contentStyle]]">
          ${this.renderHistory(this.history,this.config)}
        </div>
      </ha-card>
    `:j``}renderHistory(t,e){if(!t||0===(null==t?void 0:t.length))return j`
        <p>
          ${e.no_event}
        </p>
      `;if(e.collapse&&t.length>e.collapse){const n="expander"+Math.random().toString(10).substr(2);return j`
        ${this.renderHistoryItems(t.slice(0,e.collapse))}
        <input type="checkbox" class="expand" id="${n}" />
        <label for="${n}"><div>&lsaquo;</div></label>
        <div>
          ${this.renderHistoryItems(t.slice(e.collapse))}
        </div>
      `}return this.renderHistoryItems(t)}renderHistoryItems(t){return j`
      ${null==t?void 0:t.map((t,e,n)=>this.renderHistoryItem(t,e+1===n.length))}
    `}renderHistoryItem(t,e){var n,i,r,o,s;return j`
      <div class="item">
        ${this.renderIcon(t)}
        <div class="item-content">
          ${(null===(i=null===(n=this.config)||void 0===n?void 0:n.show)||void 0===i?void 0:i.state)?j`
                <span>${t.label}</span>
              `:j``}
          ${(null===(o=null===(r=this.config)||void 0===r?void 0:r.show)||void 0===o?void 0:o.duration)?j`
                <span class="duration">${t.duration}</span>
              `:j``}
          ${this.renderHistoryDate(t)}${null===(s=t.attributes)||void 0===s?void 0:s.map(this.renderAttributes)}
        </div>
      </div>
      ${e?"":this.renderSeparator()}
    `}renderSeparator(){var t,e,n,i,r,o,s,a;const u={border:"0","border-top":`${null===(e=null===(t=this.config)||void 0===t?void 0:t.separator_style)||void 0===e?void 0:e.width}px ${null===(i=null===(n=this.config)||void 0===n?void 0:n.separator_style)||void 0===i?void 0:i.style} ${null===(o=null===(r=this.config)||void 0===r?void 0:r.separator_style)||void 0===o?void 0:o.color}`};if(null===(a=null===(s=this.config)||void 0===s?void 0:s.show)||void 0===a?void 0:a.separator)return j`
        <hr style=${rt(u)} aria-hidden="true" />
      `}renderIcon(t){var e,n;if(null===(n=null===(e=this.config)||void 0===e?void 0:e.show)||void 0===n?void 0:n.icon)return j`
        <div class="item-icon">
          <ha-icon .icon=${t.icon}></ha-icon>
        </div>
      `}renderHistoryDate(t){var e,n,i,r,o,s,a,u;return(null===(n=null===(e=this.config)||void 0===e?void 0:e.show)||void 0===n?void 0:n.start_date)&&(null===(r=null===(i=this.config)||void 0===i?void 0:i.show)||void 0===r?void 0:r.end_date)?j`
        <div class="date">${this._displayDate(t.start)} - ${this._displayDate(t.end)}</div>
      `:(null===(s=null===(o=this.config)||void 0===o?void 0:o.show)||void 0===s?void 0:s.end_date)?j`
        <div class="date">${this._displayDate(t.end)}</div>
      `:(null===(u=null===(a=this.config)||void 0===a?void 0:a.show)||void 0===u?void 0:u.start_date)?j`
        <div class="date">${this._displayDate(t.start)}</div>
      `:j``}renderAttributes(t){return j`
      <div class="attribute">
        <div class="key">${t.name}</div>
        <div class="value">${t.value}</div>
      </div>
    `}static get styles(){return tt`
      .warning {
        display: block;
        color: black;
        background-color: #fce588;
        padding: 8px;
      }
      .item {
        clear: both;
        padding: 5px 0;
        display: flex;
        line-height: var(--paper-font-body1_-_line-height);
      }
      .item-content {
        flex: 1;
      }
      .item-icon {
        flex: 0 0 40px;
        color: var(--paper-item-icon-color, #44739e);
      }
      .duration {
        font-size: 0.85em;
        font-style: italic;
        float: right;
      }
      .date,
      .attribute {
        font-size: 0.7em;
      }
      .attribute {
        display: flex;
        justify-content: space-between;
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
    `}};t([Z()],Qt.prototype,"hass",void 0),t([Z()],Qt.prototype,"config",void 0),t([Z()],Qt.prototype,"history",void 0),Qt=t([B("logbook-card")],Qt);export{Qt as LogbookCard};
