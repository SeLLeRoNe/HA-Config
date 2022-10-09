/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function e(e,t,i,s){var n,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(o<3?n(r):o>3?n(t,i,r):n(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const t=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new Map;class n{constructor(e,t){if(this._$cssResult$=!0,t!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){let e=s.get(this.cssText);return t&&void 0===e&&(s.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const o=(e,...t)=>{const s=1===e.length?e[0]:t.reduce(((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1]),e[0]);return new n(s,i)},r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",i))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var a;const l=window.trustedTypes,d=l?l.emptyScript:"",c=window.reactiveElementPolyfillSupport,u={toAttribute(e,t){switch(t){case Boolean:e=e?d:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},h=(e,t)=>t!==e&&(t==t||e==e),v={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:h};class p extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(e){var t;null!==(t=this.l)&&void 0!==t||(this.l=[]),this.l.push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,i)=>{const s=this._$Eh(i,t);void 0!==s&&(this._$Eu.set(s,i),e.push(s))})),e}static createProperty(e,t=v){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,s=this.getPropertyDescriptor(e,i,t);void 0!==s&&Object.defineProperty(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(s){const n=this[e];this[t]=s,this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),this.elementProperties=new Map(e.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eh(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}o(){var e;this._$Ep=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(e=this.constructor.l)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,i;(null!==(t=this._$Eg)&&void 0!==t?t:this._$Eg=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$Eg)||void 0===t||t.splice(this._$Eg.indexOf(e)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Et.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const i=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{t?e.adoptedStyleSheets=i.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):i.forEach((t=>{const i=document.createElement("style"),s=window.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=t.cssText,e.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$Eg)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$Eg)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ES(e,t,i=v){var s,n;const o=this.constructor._$Eh(e,i);if(void 0!==o&&!0===i.reflect){const r=(null!==(n=null===(s=i.converter)||void 0===s?void 0:s.toAttribute)&&void 0!==n?n:u.toAttribute)(t,i.type);this._$Ei=e,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$Ei=null}}_$AK(e,t){var i,s,n;const o=this.constructor,r=o._$Eu.get(e);if(void 0!==r&&this._$Ei!==r){const e=o.getPropertyOptions(r),a=e.converter,l=null!==(n=null!==(s=null===(i=a)||void 0===i?void 0:i.fromAttribute)&&void 0!==s?s:"function"==typeof a?a:null)&&void 0!==n?n:u.fromAttribute;this._$Ei=r,this[r]=l(t,e.type),this._$Ei=null}}requestUpdate(e,t,i){let s=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||h)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$Ei!==e&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(e,i))):s=!1),!this.isUpdatePending&&s&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((e,t)=>this[t]=e)),this._$Et=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$Eg)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(i)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$Eg)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(e){return!0}update(e){void 0!==this._$E_&&(this._$E_.forEach(((e,t)=>this._$ES(t,this[t],e))),this._$E_=void 0),this._$EU()}updated(e){}firstUpdated(e){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _;p.finalized=!0,p.elementProperties=new Map,p.elementStyles=[],p.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:p}),(null!==(a=globalThis.reactiveElementVersions)&&void 0!==a?a:globalThis.reactiveElementVersions=[]).push("1.2.1");const m=globalThis.trustedTypes,g=m?m.createPolicy("lit-html",{createHTML:e=>e}):void 0,$=`lit$${(Math.random()+"").slice(9)}$`,f="?"+$,y=`<${f}>`,b=document,w=(e="")=>b.createComment(e),A=e=>null===e||"object"!=typeof e&&"function"!=typeof e,S=Array.isArray,x=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,E=/-->/g,C=/>/g,k=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,z=/'/g,j=/"/g,N=/^(?:script|style|textarea)$/i,T=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),U=Symbol.for("lit-noChange"),P=Symbol.for("lit-nothing"),M=new WeakMap,O=b.createTreeWalker(b,129,null,!1),R=(e,t)=>{const i=e.length-1,s=[];let n,o=2===t?"<svg>":"",r=x;for(let t=0;t<i;t++){const i=e[t];let a,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===x?"!--"===l[1]?r=E:void 0!==l[1]?r=C:void 0!==l[2]?(N.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=k):void 0!==l[3]&&(r=k):r===k?">"===l[0]?(r=null!=n?n:x,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?k:'"'===l[3]?j:z):r===j||r===z?r=k:r===E||r===C?r=x:(r=k,n=void 0);const u=r===k&&e[t+1].startsWith("/>")?" ":"";o+=r===x?i+y:d>=0?(s.push(a),i.slice(0,d)+"$lit$"+i.slice(d)+$+u):i+$+(-2===d?(s.push(void 0),t):u)}const a=o+(e[i]||"<?>")+(2===t?"</svg>":"");if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==g?g.createHTML(a):a,s]};class q{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0;const r=e.length-1,a=this.parts,[l,d]=R(e,t);if(this.el=q.createElement(l,i),O.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(s=O.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const e=[];for(const t of s.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith($)){const i=d[o++];if(e.push(t),void 0!==i){const e=s.getAttribute(i.toLowerCase()+"$lit$").split($),t=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:t[2],strings:e,ctor:"."===t[1]?V:"?"===t[1]?Z:"@"===t[1]?W:I})}else a.push({type:6,index:n})}for(const t of e)s.removeAttribute(t)}if(N.test(s.tagName)){const e=s.textContent.split($),t=e.length-1;if(t>0){s.textContent=m?m.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],w()),O.nextNode(),a.push({type:2,index:++n});s.append(e[t],w())}}}else if(8===s.nodeType)if(s.data===f)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=s.data.indexOf($,e+1));)a.push({type:7,index:n}),e+=$.length-1}n++}}static createElement(e,t){const i=b.createElement("template");return i.innerHTML=e,i}}function D(e,t,i=e,s){var n,o,r,a;if(t===U)return t;let l=void 0!==s?null===(n=i._$Cl)||void 0===n?void 0:n[s]:i._$Cu;const d=A(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(e),l._$AT(e,i,s)),void 0!==s?(null!==(r=(a=i)._$Cl)&&void 0!==r?r:a._$Cl=[])[s]=l:i._$Cu=l),void 0!==l&&(t=D(e,l._$AS(e,t.values),l,s)),t}class H{constructor(e,t){this.v=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(e){var t;const{el:{content:i},parts:s}=this._$AD,n=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:b).importNode(i,!0);O.currentNode=n;let o=O.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let t;2===l.type?t=new L(o,o.nextSibling,this,e):1===l.type?t=new l.ctor(o,l.name,l.strings,this,e):6===l.type&&(t=new F(o,this,e)),this.v.push(t),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=O.nextNode(),r++)}return n}m(e){let t=0;for(const i of this.v)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class L{constructor(e,t,i,s){var n;this.type=2,this._$AH=P,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cg=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cg}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=D(this,e,t),A(e)?e===P||null==e||""===e?(this._$AH!==P&&this._$AR(),this._$AH=P):e!==this._$AH&&e!==U&&this.$(e):void 0!==e._$litType$?this.T(e):void 0!==e.nodeType?this.S(e):(e=>{var t;return S(e)||"function"==typeof(null===(t=e)||void 0===t?void 0:t[Symbol.iterator])})(e)?this.A(e):this.$(e)}M(e,t=this._$AB){return this._$AA.parentNode.insertBefore(e,t)}S(e){this._$AH!==e&&(this._$AR(),this._$AH=this.M(e))}$(e){this._$AH!==P&&A(this._$AH)?this._$AA.nextSibling.data=e:this.S(b.createTextNode(e)),this._$AH=e}T(e){var t;const{values:i,_$litType$:s}=e,n="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=q.createElement(s.h,this.options)),s);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===n)this._$AH.m(i);else{const e=new H(n,this),t=e.p(this.options);e.m(i),this.S(t),this._$AH=e}}_$AC(e){let t=M.get(e.strings);return void 0===t&&M.set(e.strings,t=new q(e)),t}A(e){S(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const n of e)s===t.length?t.push(i=new L(this.M(w()),this.M(w()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cg=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class I{constructor(e,t,i,s,n){this.type=1,this._$AH=P,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=P}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,s){const n=this.strings;let o=!1;if(void 0===n)e=D(this,e,t,0),o=!A(e)||e!==this._$AH&&e!==U,o&&(this._$AH=e);else{const s=e;let r,a;for(e=n[0],r=0;r<n.length-1;r++)a=D(this,s[i+r],t,r),a===U&&(a=this._$AH[r]),o||(o=!A(a)||a!==this._$AH[r]),a===P?e=P:e!==P&&(e+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.k(e)}k(e){e===P?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class V extends I{constructor(){super(...arguments),this.type=3}k(e){this.element[this.name]=e===P?void 0:e}}const B=m?m.emptyScript:"";class Z extends I{constructor(){super(...arguments),this.type=4}k(e){e&&e!==P?this.element.setAttribute(this.name,B):this.element.removeAttribute(this.name)}}class W extends I{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=D(this,e,t,0))&&void 0!==i?i:P)===U)return;const s=this._$AH,n=e===P&&s!==P||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==P&&(s===P||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}}class F{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}}const J=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var K,G;null==J||J(q,L),(null!==(_=globalThis.litHtmlVersions)&&void 0!==_?_:globalThis.litHtmlVersions=[]).push("2.1.2");class Q extends p{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Dt=((e,t,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:t;let r=o._$litPart$;if(void 0===r){const e=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new L(t.insertBefore(w(),e),e,void 0,null!=i?i:{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Dt)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Dt)||void 0===e||e.setConnected(!1)}render(){return U}}Q.finalized=!0,Q._$litElement$=!0,null===(K=globalThis.litElementHydrateSupport)||void 0===K||K.call(globalThis,{LitElement:Q});const X=globalThis.litElementPolyfillSupport;null==X||X({LitElement:Q}),(null!==(G=globalThis.litElementVersions)&&void 0!==G?G:globalThis.litElementVersions=[]).push("3.1.2");var Y="[^\\s]+";function ee(e,t){for(var i=[],s=0,n=e.length;s<n;s++)i.push(e[s].substr(0,t));return i}var te=function(e){return function(t,i){var s=i[e].map((function(e){return e.toLowerCase()})),n=s.indexOf(t.toLowerCase());return n>-1?n:null}};function ie(e){for(var t=[],i=1;i<arguments.length;i++)t[i-1]=arguments[i];for(var s=0,n=t;s<n.length;s++){var o=n[s];for(var r in o)e[r]=o[r]}return e}var se=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],ne=["January","February","March","April","May","June","July","August","September","October","November","December"],oe=ee(ne,3),re={dayNamesShort:ee(se,3),dayNames:se,monthNamesShort:oe,monthNames:ne,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10?1:0)*e%10]}},ae=(ie({},re),function(e){return+e-1}),le=[null,"[1-9]\\d?"],de=[null,Y],ce=["isPm",Y,function(e,t){var i=e.toLowerCase();return i===t.amPm[0]?0:i===t.amPm[1]?1:null}],ue=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(e){var t=(e+"").match(/([+-]|\d\d)/gi);if(t){var i=60*+t[1]+parseInt(t[2],10);return"+"===t[0]?i:-i}return 0}];te("monthNamesShort"),te("monthNames");var he,ve;!function(){try{(new Date).toLocaleDateString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleString("i")}catch(e){return"RangeError"===e.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(e){return"RangeError"===e.name}}(),function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(he||(he={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ve||(ve={}));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pe=e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:s}=t;return{kind:i,elements:s,finisher(t){window.customElements.define(e,t)}}})(e,t)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,_e=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(i){i.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}};function me(e){return(t,i)=>void 0!==i?((e,t,i)=>{t.constructor.createProperty(i,e)})(e,t,i):_e(e,t)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function ge(e){return me({...e,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var $e;null===($e=window.HTMLSlotElement)||void 0===$e||$e.prototype.assignedElements;let fe=class extends Q{setConfig(e){this._config=e}get _name(){var e;return(null===(e=this._config)||void 0===e?void 0:e.name)||""}get _show_controllers(){var e;return(null===(e=this._config)||void 0===e?void 0:e.show_controllers)||""}get _always_show_zones(){var e;return(null===(e=this._config)||void 0===e?void 0:e.always_show_zones)||!1}get _always_show_sequences(){var e;return(null===(e=this._config)||void 0===e?void 0:e.always_show_sequences)||!1}render(){return this.hass?T`
      <paper-input
        label="Name (Optional)"
        .value=${this._name}
        .configValue=${"name"}
        @value-changed=${this._valueChanged}
      ></paper-input>
      <paper-input
        label="Show controllers (CSV list)"
        .value=${this._show_controllers}
        .configValue=${"show_controllers"}
        @value-changed=${this._valueChanged}
      ></paper-input>
      <ha-formfield label="Always show zones">
        <ha-switch
          .checked=${this._always_show_zones}
          .configValue=${"always_show_zones"}
          @change=${this._valueChanged}
        </ha-switch>
      </ha-formfield>
      <ha-formfield label="Always show sequences">
        <ha-switch
          .checked=${this._always_show_sequences}
          .configValue=${"always_show_sequences"}
          @change=${this._valueChanged}
        </ha-switch>
      </ha-formfield>
    `:P}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(this[`_${t.configValue}`]!==t.value){if(t.configValue)if(""===t.value){const e=Object.assign({},this._config);delete e[t.configValue],this._config=e}else this._config=Object.assign(Object.assign({},this._config),{[t.configValue]:void 0!==t.checked?t.checked:t.value});!function(e,t,i,s){s=s||{},i=null==i?{}:i;var n=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});n.detail=i,e.dispatchEvent(n)}(this,"config-changed",{config:this._config})}}};fe.styles=o`
  `,e([me({attribute:!1})],fe.prototype,"hass",void 0),e([ge()],fe.prototype,"_config",void 0),fe=e([pe("irrigation-unlimited-card-editor")],fe);var ye={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_error:"Show Error"},be={common:ye},we={version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel"},Ae={common:we};const Se={en:Object.freeze({__proto__:null,common:ye,default:be}),nb:Object.freeze({__proto__:null,common:we,default:Ae})};function xe(e,t="",i=""){const s=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let n;try{n=e.split(".").reduce(((e,t)=>e[t]),Se[s])}catch(t){n=e.split(".").reduce(((e,t)=>e[t]),Se.en)}return void 0===n&&(n=e.split(".").reduce(((e,t)=>e[t]),Se.en)),""!==t&&""!==i&&(n=n.replace(t,i)),n}console.info(`%c  IRRIGATION-UNLIMITED-CARD \n%c  ${xe("common.version")} 1.0.2    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"irrigation-unlimited-card",name:"Irrigation Unlimited Card",description:"A companion card for the Irrigation Unlimited integration"});let Ee=class extends Q{constructor(){super(...arguments),this._iu_entities=void 0}static async getConfigElement(){return document.createElement("irrigation-unlimited-card-editor")}setConfig(e){if(!e)throw new Error(xe("common.invalid_configuration"));this.config=e}static getStubConfig(){return{}}getCardSize(){return 1}shouldUpdate(e){if(!this.hass)return!1;if(e.has("config"))return!0;if(null==this._iu_entities){this._iu_entities=[];for(const e in this.hass.states)if(e.startsWith("binary_sensor.irrigation_unlimited_")){const t=this.hass.states[e],i=new Date(t.last_updated);this._iu_entities.push({entity_id:e,last_updated:i,name:t.attributes.friendly_name})}return!0}{let e=!1;for(const t of this._iu_entities){const i=new Date(this.hass.states[t.entity_id].last_updated);i>t.last_updated&&(t.last_updated=i,e=!0)}return e}}render(){return this.hass?T`
      <ha-card
        .header=${this.config.name}
        tabindex="0"
        id="iu-card"
        @click="${this._clickNet}"
      >
        <div class="iu-header-row iu-td">
          <div class="iu-td1"></div>
          <div class="iu-td2"></div>
          <div class="iu-td3"></div>
          <div class="iu-td4"><ha-icon icon="mdi:clock-outline"></ha-icon></div>
          <div class="iu-td5"><ha-icon icon="mdi:timer-sand"></ha-icon></div>
          <div class="iu-td6"><ha-icon icon="mdi:delta"></ha-icon></div>
          <div class="iu-td7"><ha-icon icon="mdi:toggle-switch-outline"></ha-icon></div>
        </div>
        <div class="iu-controllers">
          ${Array.from(Array(this.hass.states["irrigation_unlimited.coordinator"].attributes.controller_count).keys()).map((e=>this._renderController(e)))}
        </div>
      </ha-card>
    `:P}_renderController(e){var t;const i=this.hass.states["binary_sensor.irrigation_unlimited_c"+(e+1)+"_m"],s="on"===i.state,n=i.attributes.enabled,o=!(!this.config.show_controllers||this.config.show_controllers&&(null===(t=this.config.show_controllers)||void 0===t?void 0:t.replace(/\s/g,"").split(",").includes(e+1+""))),r=!this.config.always_show_zones,a=!this.config.always_show_sequences;let l,d,c,u="";s?(l=new Date(i.attributes.current_start),d=i.attributes.time_remaining,c=i.attributes.current_name):(l=new Date(i.attributes.next_start),d=i.attributes.next_duration,c=i.attributes.next_name),isNaN(l.getTime())||(u=l.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const h=["iu-controller iu-object"];h.push(`iu-key=${e+1}.0.0.0`),o&&h.push("iu-hidden");const v=["iu-controller-row iu-td"];s&&v.push("iu-on"),n&&v.push("iu-enabled");const p=["iu-zones iu-content"];r&&p.push("iu-hidden");const _=["iu-sequences iu-content"];return a&&_.push("iu-hidden"),T`
      <div class=${h.join(" ")}>
      <hr>
        <div class=${v.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${i.attributes.icon}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${e+1}</span>
            <span class="iu-name">${i.attributes.friendly_name}</span>
          </div>
          <div class="iu-td4">
            <div ?hidden=${!n}>
              <span class="iu-schedule">${c}</span>
              <span class="iu-start" ?hidden=${s}><br>${u}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!n}>
              ${d}
            </div>
          </div>
          <div class="iu-td6"></div>
          <div class="iu-td7">${this._renderMenu(n,!1,!0,!0,null)}</div>
        </div>
        <div class="iu-control-panel">
          <div class="iu-control-panel-item">
            <label>Zones&nbsp;</label>
            <ha-switch
              .checked="${!r}"
              .disabled="${this.config.always_show_zones}"
              @change="${this._toggleZones}">
            </ha-switch>
          </div>
          <div class="iu-control-panel-item">
            <label>Sequences&nbsp;</label>
            <ha-switch
            .checked="${!a}"
            .disabled="${this.config.always_show_sequences}"
            @change="${this._toggleSequences}">
            </ha-switch>
          </div>
        </div>
        <div class=${p.join(" ")}>
          <hr>
          ${Array.from(Array(i.attributes.zone_count).keys()).map((t=>this._renderZone(e,t)))}
        </div>
        <div class=${_.join(" ")}>
          <hr>
          ${i.attributes.sequence_status.map((t=>this._renderSequence(e,t)))}
        </div>
      </div>
    `}_renderZone(e,t){const i=this.hass.states["binary_sensor.irrigation_unlimited_c"+(e+1)+"_z"+(t+1)],s="on"===i.state,n=i.attributes.enabled,o="blocked"===i.attributes.status;let r,a,l,d,c,u="";s?(r=new Date(i.attributes.current_start),a=i.attributes.time_remaining,l=i.attributes.current_schedule,d=i.attributes.current_name,c=i.attributes.current_adjustment):(r=new Date(i.attributes.next_start),a=i.attributes.next_duration,l=i.attributes.next_schedule,d=i.attributes.next_name,c=i.attributes.next_adjustment);const h=0===l;isNaN(r.getTime())||(u=r.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const v=["iu-zone-row iu-td"];s&&v.push("iu-on"),n&&v.push("iu-enabled"),h&&v.push("iu-manual"),o&&v.push("iu-blocked");let p=i.attributes.timeline;return void 0===p&&(p=[]),T`
      <div class="iu-zone iu-object" iu-key="${e+1}.${t+1}.0.0">
        <div class="iu-collapsible iu-hidden">
          <div class=${v.join(" ")}>
            <div class="iu-td1 iu-expander" @click="${this._toggleCollapse}"></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon .icon=${i.attributes.icon}></ha-icon>
            </div>
            <div class="iu-td3">
              <span style="color: ${this._selectColour(t)}">${t+1}</span>
              <span class="iu-name">${i.attributes.friendly_name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!n||o}>
                <span class="iu-schedule">${d}</span>
                <span class="iu-start" ?hidden=${s||h}><br>${u}</span>
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!n||o}>${a}</div>
            </div>
            <div class="iu-td6 iu-adjustment">
              <div ?hidden=${h}>${c}</div>
            </div>
            <div class="iu-td7">${this._renderMenu(n,o,!0,!0,c)}</div>
          </div>
          <div class="iu-zone-history iu-content">
            ${p.filter((function(e){return"history"===e.status&&e.start!==e.end})).map((e=>this._renderZoneHistory(e)))}
          </div>
        </div>
      </div>
    `}_renderZoneHistory(e){const t=new Date(e.start),i=new Date(new Date(e.end).getTime()-t.getTime()).toISOString().slice(12,19),s=t.toLocaleString(void 0,{weekday:"short",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:!1});return T`
      <div class="iu-zone-history iu-object">
        <div class='iu-zone-history-row iu-td'}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon icon="mdi:history"></ha-icon>
          </div>
          <div class="iu-td3">${s}</div>
          <div class="iu-td4 iu-schedule">${e.schedule_name}</div>
          <div class="iu-td5 iu-duration">${i}</div>
          <div class="iu-td6 iu-adjustment">${e.adjustment}</div>
          <div class="iu-td7"></div>
        </div>
      </div>
    `}_renderSequence(e,t){const i="on"===t.status||"paused"===t.status,s=t.enabled,n="blocked"===t.status,o=t.enabled&&null===t.schedule.index,r=0!==t.duration,a=new Date(t.start);let l="";isNaN(a.getTime())||(l=a.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const d=new Date(1e3*t.duration).toISOString().substring(12,19),c=["iu-sequence-row iu-td"];return i&&c.push("iu-on"),s&&c.push("iu-enabled"),o&&c.push("iu-manual"),r&&c.push("iu-running"),n&&c.push("iu-blocked"),T`
      <div class="iu-sequence iu-object" iu-key="${e+1}.0.${t.index+1}.0">
        <div class="iu-collapsible iu-hidden">
          <div class=${c.join(" ")}>
            <div class="iu-td1 iu-expander" @click="${this._toggleCollapse}"></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon .icon=${t.icon} ?is-on=${i}></ha-icon>
            </div>
            <div class="iu-td3" @click="${this._toggleCollapse}">
              <span>${t.index+1}</span>
              <span class="iu-name">${t.name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!s||n||!r}>
                <span class="iu-schedule">${t.schedule.name}</span>
                <span class="iu-start" ?hidden=${i}><br>${l}</span>
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!s||n||!r}>${d}</div>
            </div>
            <div class="iu-td6 iu-adjustment">
            <div ?hidden=${o}>${t.adjustment}</div>
            </div>
            <div class="iu-td7">${this._renderMenu(s,n,!0,!1,t.adjustment)}</div>
          </div>
          <div class="iu-sequence-zones iu-content">
            ${t.zones.map((i=>this._renderSequenceZone(e,t.index,i,o)))}
          </div>
        </div>
      </div>
    `}_renderSequenceZone(e,t,i,s){const n="on"===i.status,o=i.enabled,r="blocked"===i.status,a=0!==i.duration,l=new Date(1e3*i.duration).toISOString().substring(12,19),d=["iu-sequence-zone-row iu-td"];return n&&d.push("iu-on"),o&&d.push("iu-enabled"),s&&d.push("iu-manual"),a&&d.push("iu-running"),r&&d.push("iu-blocked"),T`
      <div class="iu-sequence-zone iu-object" iu-key="${e+1}.0.${t+1}.${i.index+1}">
        <div class=${d.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${i.icon} ?is-on=${n}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${i.zone_ids.map(((t,i,s)=>this._renderSequenceZoneRef(e,t,i===s.length-1)))}</span>
          </div>
          <div class="iu-td4"></div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!o||r||!a}>${l}</div>
          </div>
          <div class="iu-td6 iu-adjustment">
            <div ?hidden=${s}>${i.adjustment}</div>
          </div>
          <div class="iu-td7">${this._renderMenu(o,r,!1,!1,i.adjustment)}</div>
        </div>
      </div>
    `}_renderSequenceZoneRef(e,t,i){const s=`binary_sensor.irrigation_unlimited_c${e+1}_z${t}`;let n;if(void 0!==this._iu_entities)for(const e of this._iu_entities)if(e.entity_id===s){e.name&&(n=e.name);break}return n?T`<span class="iu-name">${n}${!1===i?", ":""}</span>`:T`
      <span style="color: ${this._selectColour(t-1)}">${t}</span>
    `}_renderMenu(e,t,i,s,n){return T`
      <div class="iu-menu">
        <ha-icon class="iu-menu-button" icon="mdi:dots-vertical" @click="${this._toggleMenu}"></ha-icon>
        <div class="iu-menu-content iu-hidden">
          <div class="iu-menu-item">
            <div class="iu-mc1">Enable</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">${this._renderEnabled(e,t)}</div>
          </div>
          <div class="iu-menu-item ${i?"":"iu-hidden"}">
            <div class="iu-mc1">Manual</div>
            <div class="iu-mc2">
              <input type="text"
                class="iu-time-input"
                placeholder="0:00:00"
                title="Duration"
                size="8"
                maxlength="8"
                required
                pattern="^[0-9]{1,2}:[0-9]{2}:[0-9]{2}$">
              </input>
            </div>
            <div class="iu-mc3">
              <ha-icon-button icon="mdi:play" @click="${this._serviceManualRun}">
                <ha-icon icon="mdi:play"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="iu-menu-item ${s?"":"iu-hidden"}">
            <div class="iu-mc1">Cancel</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button .disabled=${!s} @click="${this._serviceCancel}">
                <ha-icon icon="mdi:cancel"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="iu-menu-item ${void 0===n?"iu-hidden":""}">
            <div class="iu-mc1">Adjust</div>
            <div class="iu-mc2">
              <input type="text"
                class="iu-adjust-input"
                value=${n}
                title="Adjustment options\n===============\nPercentage: %n\nActual: =0:00:00\nIncrease: +0:00:00\nDecrease: -0:00:00\nReset: <blank>"
                size="9"
                maxlength="9"
                pattern="^$|^[=+-][0-9]{1,2}:[0-9]{2}:[0-9]{2}$|^%[0-9]*\.?[0-9]+$">
              </input>
            </div>
            <div class="iu-mc3">
              <ha-icon-button icon="mdi:adjust" @click="${this._serviceAdjust}">
                <ha-icon icon="mdi:adjust"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
        </div>
      </div>
    `}_renderEnabled(e,t){return T`
      <ha-switch
        .checked=${e}
        .disabled=${t}
        @change="${this._serviceEnable}"
      ></ha-switch>
    `}_selectColour(e){const t=["#3498db","#e74c3c","#9b59b6","#f1c40f","#2ecc71","#1abc9c","#34495e","#e67e22","#7f8c8d","#27ae60","#2980b9","#8e44ad"];return t[e%t.length]}_clickNet(e){var t;const i=e.target;if(i.closest(".iu-menu"))return;const s=null===(t=i.closest("#iu-card"))||void 0===t?void 0:t.querySelectorAll(".iu-menu-content:not(.iu-hidden)");null==s||s.forEach((e=>e.classList.add("iu-hidden")))}_toggleCollapse(e){const t=e.target.closest(".iu-collapsible");null==t||t.classList.toggle("iu-hidden"),this.requestUpdate()}_toggleZones(e){var t,i;null===(i=null===(t=e.target.closest(".iu-controller"))||void 0===t?void 0:t.querySelector(".iu-zones"))||void 0===i||i.classList.toggle("iu-hidden")}_toggleSequences(e){var t,i;null===(i=null===(t=e.target.closest(".iu-controller"))||void 0===t?void 0:t.querySelector(".iu-sequences"))||void 0===i||i.classList.toggle("iu-hidden")}_toggleMenu(e){var t,i;null===(i=null===(t=e.target.closest(".iu-menu"))||void 0===t?void 0:t.querySelector(".iu-menu-content"))||void 0===i||i.classList.toggle("iu-hidden")}_get_iu_key(e){var t,i;return null===(i=null===(t=e.target.closest(".iu-object"))||void 0===t?void 0:t.getAttribute("iu-key"))||void 0===i?void 0:i.split(".",4)}_build_entity_id(e){let t="binary_sensor.irrigation_unlimited_c"+e[0]+"_";return t+="0"===e[1]?"m":"z"+e[1],t}_build_data(e){const t=this._get_iu_key(e);if(!t)return;const i={entity_id:this._build_entity_id(t)};return"0"!==t[2]&&(i.sequence_id=Number(t[2])),"0"!==t[3]&&(i.zones=Number(t[3])),i}_serviceEnable(e){const t=this._build_data(e);t&&this.hass.callService("irrigation_unlimited","toggle",t)}_serviceManualRun(e){var t;const i=this._build_data(e);if(!i)return;const s=null===(t=e.target.closest(".iu-menu-item"))||void 0===t?void 0:t.querySelector(".iu-time-input");i.time=s.value,this.hass.callService("irrigation_unlimited","manual_run",i),this._toggleMenu(e)}_serviceCancel(e){const t=this._build_data(e);t&&(this.hass.callService("irrigation_unlimited","cancel",t),this._toggleMenu(e))}_serviceAdjust(e){var t;const i=this._build_data(e);if(!i)return;const s=(null===(t=e.target.closest(".iu-menu-item"))||void 0===t?void 0:t.querySelector(".iu-adjust-input")).value;switch(s.slice(0,1)){case"%":i.percentage=s.slice(1);break;case"=":i.actual=s.slice(1);break;case"+":i.increase=s.slice(1);break;case"-":i.decrease=s.slice(1);break;case"":i.reset=null;break;default:return}console.log(i),this.hass.callService("irrigation_unlimited","adjust_time",i),this._toggleMenu(e)}static get styles(){return o`
      .iu-controller.iu-hidden {
        display: none;
      }

      .iu-control-panel {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .iu-control-panel-item {
        padding: .5em 0 .5em 1em;
      }

      .iu-zones.iu-hidden.iu-content {
        display: none;
      }

      .iu-sequences.iu-hidden.iu-content {
        display: none;
      }

      .iu-hidden .iu-content {
        display: none;
      }

      .iu-hidden .iu-expander::before {
        content: '\u25B6';
        font-size: large;
      }

      .iu-expander::before {
        content: '\u25BC';
        font-size: large;
      }

      .iu-controller-row.iu-td {
        display: flex;
        align-items: center;
        min-height: 3em;
      }

      .iu-zone-row.iu-td {
        display: flex;
        align-items: center;
        min-height: 3em;
      }

      .iu-sequence-row.iu-td {
        display: flex;
        align-items: center;
        min-height: 3em;
      }

      .iu-sequence-zone-row.iu-td {
        display: flex;
        align-items: center;
        height: 2em;
      }

      .iu-td {
        display: flex;
        align-items: center;
      }

      .iu-td1 {
        flex: 1.5em;
        text-align: center;
        cursor: pointer;
      }

      .iu-td2 {
        flex: 30px;
        text-align: center;
      }

      .iu-td3 {
        flex: 40%;
        text-align: left;
      }

      .iu-td4 {
        flex: 20%;
        text-align: center;
      }

      .iu-td5 {
        flex: 15%;
        text-align: center;
      }

      .iu-td6 {
        flex: 15%;
        text-align: center;
      }

      .iu-td7 {
        flex: 10%;
        text-align: center;
      }

      .iu-on .iu-duration {
        color: var(--state-on-color, #66a61e);
      }

      .iu-schedule {
        color: var(--secondary-text-color, #727272);
        font-size: small;
      }

      .iu-manual .iu-schedule {
        color: var(--label-badge-red, #DF4C1E);
      }

      .iu-name {
        color: var(--secondary-text-color, #727272);
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      ha-icon {
        color: var(--state-icon-color, #44739e);
      }

      .iu-on .iu-td2 ha-icon {
        color: var(--state-icon-active-color, #FDD835);
      }

      .iu-menu {
        position: relative;
        display: inline-block;
      }

      .iu-menu-button {
        background-color: transparent;
        text-align: center;
        display: block;
        font-size: 16px;
        border: none;
        cursor: pointer;
      }

      .iu-menu-content {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        width: 200px;
        padding: 10px 0;
        position: absolute;
        background-color: var(--card-background-color, white);
        right: 0;
        box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 0.75);
        border-radius: 5px;
        z-index: 1;
      }

      .iu-menu-content.iu-hidden {
        display: none;
      }

      .iu-menu-content .iu-menu-item {
        display: flex;
        padding: 0px 5px;
        line-height: 48px;
      }

      .iu-menu .iu-menu-item:hover {
        color: var(--primary-color, #b3e5fc);
        background-color: var(--secondary-background-color, #e5e5e5);
      }

      .iu-menu-item.iu-hidden {
        display: none;
      }

      .iu-mc1 {
        flex: 30%;
        text-align: left;
      }

      .iu-mc2 {
        flex: 40%;
        text-align: right;
      }

      .iu-mc3 {
        flex: 30%;
        text-align: center;
      }

      .iu-mc3 ha-icon {
        display: flex;
      }

      .iu-adjust-input:invalid,
      .iu-time-input:invalid {
        color: var(--label-badge-red, #DF4C1E);
      }
    }`}};e([me({attribute:!1})],Ee.prototype,"hass",void 0),e([ge()],Ee.prototype,"config",void 0),Ee=e([pe("irrigation-unlimited-card")],Ee);export{Ee as IrrigationUnlimitedCard};
