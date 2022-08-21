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
function t(t,e,i,n){var s,o=arguments.length,r=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const e=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new Map;class s{constructor(t,e){if(this._$cssResult$=!0,e!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=n.get(this.cssText);return e&&void 0===t&&(n.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const o=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new s(n,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var a;const l=window.trustedTypes,d=l?l.emptyScript:"",u=window.reactiveElementPolyfillSupport,c={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},h=(t,e)=>e!==t&&(e==e||t==t),v={attribute:!0,type:String,converter:c,reflect:!1,hasChanged:h};class p extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;null!==(e=this.l)&&void 0!==e||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const n=this._$Eh(i,e);void 0!==n&&(this._$Eu.set(n,i),t.push(n))})),t}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const s=this[t];this[e]=n,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eh(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$Eg)&&void 0!==e?e:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$Eg)||void 0===e||e.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{e?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((e=>{const i=document.createElement("style"),n=window.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ES(t,e,i=v){var n,s;const o=this.constructor._$Eh(t,i);if(void 0!==o&&!0===i.reflect){const r=(null!==(s=null===(n=i.converter)||void 0===n?void 0:n.toAttribute)&&void 0!==s?s:c.toAttribute)(e,i.type);this._$Ei=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$Ei=null}}_$AK(t,e){var i,n,s;const o=this.constructor,r=o._$Eu.get(t);if(void 0!==r&&this._$Ei!==r){const t=o.getPropertyOptions(r),a=t.converter,l=null!==(s=null!==(n=null===(i=a)||void 0===i?void 0:i.fromAttribute)&&void 0!==n?n:"function"==typeof a?a:null)&&void 0!==s?s:c.fromAttribute;this._$Ei=r,this[r]=l(e,t.type),this._$Ei=null}}requestUpdate(t,e,i){let n=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||h)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,e)=>this[e]=t)),this._$Et=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$Eg)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,e)=>this._$ES(e,this[e],t))),this._$E_=void 0),this._$EU()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var m;p.finalized=!0,p.elementProperties=new Map,p.elementStyles=[],p.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:p}),(null!==(a=globalThis.reactiveElementVersions)&&void 0!==a?a:globalThis.reactiveElementVersions=[]).push("1.2.1");const _=globalThis.trustedTypes,g=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,$=`lit$${(Math.random()+"").slice(9)}$`,f="?"+$,b=`<${f}>`,y=document,A=(t="")=>y.createComment(t),w=t=>null===t||"object"!=typeof t&&"function"!=typeof t,x=Array.isArray,S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,E=/-->/g,C=/>/g,k=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,N=/'/g,U=/"/g,P=/^(?:script|style|textarea)$/i,T=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),M=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),z=new WeakMap,O=y.createTreeWalker(y,129,null,!1),R=(t,e)=>{const i=t.length-1,n=[];let s,o=2===e?"<svg>":"",r=S;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,u=0;for(;u<i.length&&(r.lastIndex=u,l=r.exec(i),null!==l);)u=r.lastIndex,r===S?"!--"===l[1]?r=E:void 0!==l[1]?r=C:void 0!==l[2]?(P.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=k):void 0!==l[3]&&(r=k):r===k?">"===l[0]?(r=null!=s?s:S,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?k:'"'===l[3]?U:N):r===U||r===N?r=k:r===E||r===C?r=S:(r=k,s=void 0);const c=r===k&&t[e+1].startsWith("/>")?" ":"";o+=r===S?i+b:d>=0?(n.push(a),i.slice(0,d)+"$lit$"+i.slice(d)+$+c):i+$+(-2===d?(n.push(void 0),e):c)}const a=o+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==g?g.createHTML(a):a,n]};class H{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,o=0;const r=t.length-1,a=this.parts,[l,d]=R(t,e);if(this.el=H.createElement(l,i),O.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(n=O.nextNode())&&a.length<r;){if(1===n.nodeType){if(n.hasAttributes()){const t=[];for(const e of n.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith($)){const i=d[o++];if(t.push(e),void 0!==i){const t=n.getAttribute(i.toLowerCase()+"$lit$").split($),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?B:"?"===e[1]?Z:"@"===e[1]?W:I})}else a.push({type:6,index:s})}for(const e of t)n.removeAttribute(e)}if(P.test(n.tagName)){const t=n.textContent.split($),e=t.length-1;if(e>0){n.textContent=_?_.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],A()),O.nextNode(),a.push({type:2,index:++s});n.append(t[e],A())}}}else if(8===n.nodeType)if(n.data===f)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf($,t+1));)a.push({type:7,index:s}),t+=$.length-1}s++}}static createElement(t,e){const i=y.createElement("template");return i.innerHTML=t,i}}function D(t,e,i=t,n){var s,o,r,a;if(e===M)return e;let l=void 0!==n?null===(s=i._$Cl)||void 0===s?void 0:s[n]:i._$Cu;const d=w(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,n)),void 0!==n?(null!==(r=(a=i)._$Cl)&&void 0!==r?r:a._$Cl=[])[n]=l:i._$Cu=l),void 0!==l&&(e=D(t,l._$AS(t,e.values),l,n)),e}class q{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:i},parts:n}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:y).importNode(i,!0);O.currentNode=s;let o=O.nextNode(),r=0,a=0,l=n[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new L(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new F(o,this,t)),this.v.push(e),l=n[++a]}r!==(null==l?void 0:l.index)&&(o=O.nextNode(),r++)}return s}m(t){let e=0;for(const i of this.v)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class L{constructor(t,e,i,n){var s;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cg=null===(s=null==n?void 0:n.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=D(this,t,e),w(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==M&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):(t=>{var e;return x(t)||"function"==typeof(null===(e=t)||void 0===e?void 0:e[Symbol.iterator])})(t)?this.A(t):this.$(t)}M(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.M(t))}$(t){this._$AH!==j&&w(this._$AH)?this._$AA.nextSibling.data=t:this.S(y.createTextNode(t)),this._$AH=t}T(t){var e;const{values:i,_$litType$:n}=t,s="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=H.createElement(n.h,this.options)),n);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.m(i);else{const t=new q(s,this),e=t.p(this.options);t.m(i),this.S(e),this._$AH=t}}_$AC(t){let e=z.get(t.strings);return void 0===e&&z.set(t.strings,e=new H(t)),e}A(t){x(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new L(this.M(A()),this.M(A()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cg=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class I{constructor(t,e,i,n,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){const s=this.strings;let o=!1;if(void 0===s)t=D(this,t,e,0),o=!w(t)||t!==this._$AH&&t!==M,o&&(this._$AH=t);else{const n=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=D(this,n[i+r],e,r),a===M&&(a=this._$AH[r]),o||(o=!w(a)||a!==this._$AH[r]),a===j?t=j:t!==j&&(t+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}o&&!n&&this.k(t)}k(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class B extends I{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===j?void 0:t}}const V=_?_.emptyScript:"";class Z extends I{constructor(){super(...arguments),this.type=4}k(t){t&&t!==j?this.element.setAttribute(this.name,V):this.element.removeAttribute(this.name)}}class W extends I{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=D(this,t,e,0))&&void 0!==i?i:j)===M)return;const n=this._$AH,s=t===j&&n!==j||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==j&&(n===j||s);s&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class F{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){D(this,t)}}const J=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var K,G;null==J||J(H,L),(null!==(m=globalThis.litHtmlVersions)&&void 0!==m?m:globalThis.litHtmlVersions=[]).push("2.1.2");class Q extends p{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=((t,e,i)=>{var n,s;const o=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:e;let r=o._$litPart$;if(void 0===r){const t=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;o._$litPart$=r=new L(e.insertBefore(A(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1)}render(){return M}}Q.finalized=!0,Q._$litElement$=!0,null===(K=globalThis.litElementHydrateSupport)||void 0===K||K.call(globalThis,{LitElement:Q});const X=globalThis.litElementPolyfillSupport;null==X||X({LitElement:Q}),(null!==(G=globalThis.litElementVersions)&&void 0!==G?G:globalThis.litElementVersions=[]).push("3.1.2");var Y="[^\\s]+";function tt(t,e){for(var i=[],n=0,s=t.length;n<s;n++)i.push(t[n].substr(0,e));return i}var et=function(t){return function(e,i){var n=i[t].map((function(t){return t.toLowerCase()})),s=n.indexOf(e.toLowerCase());return s>-1?s:null}};function it(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var n=0,s=e;n<s.length;n++){var o=s[n];for(var r in o)t[r]=o[r]}return t}var nt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],st=["January","February","March","April","May","June","July","August","September","October","November","December"],ot=tt(st,3),rt={dayNamesShort:tt(nt,3),dayNames:nt,monthNamesShort:ot,monthNames:st,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},at=(it({},rt),function(t){return+t-1}),lt=[null,"[1-9]\\d?"],dt=[null,Y],ut=["isPm",Y,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],ct=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}];et("monthNamesShort"),et("monthNames");var ht,vt;!function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}}(),function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}}(),function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(ht||(ht={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(vt||(vt={}));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:n}=e;return{kind:i,elements:n,finisher(e){window.customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,mt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function _t(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):mt(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function gt(t){return _t({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var $t;null===($t=window.HTMLSlotElement)||void 0===$t||$t.prototype.assignedElements;let ft=class extends Q{setConfig(t){this._config=t}get _name(){var t;return(null===(t=this._config)||void 0===t?void 0:t.name)||""}render(){return this.hass?T`
      <paper-input
        label="Name (Optional)"
        .value=${this._name}
        .configValue=${"name"}
        @value-changed=${this._valueChanged}
      ></paper-input>
    `:j}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target;if(this[`_${e.configValue}`]!==e.value){if(e.configValue)if(""===e.value){const t=Object.assign({},this._config);delete t[e.configValue],this._config=t}else this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:void 0!==e.checked?e.checked:e.value});!function(t,e,i,n){n=n||{},i=null==i?{}:i;var s=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});s.detail=i,t.dispatchEvent(s)}(this,"config-changed",{config:this._config})}}};ft.styles=o`
  `,t([_t({attribute:!1})],ft.prototype,"hass",void 0),t([gt()],ft.prototype,"_config",void 0),ft=t([pt("irrigation-unlimited-card-editor")],ft);var bt={version:"Version",invalid_configuration:"Invalid configuration",show_warning:"Show Warning",show_error:"Show Error"},yt={common:bt},At={version:"Versjon",invalid_configuration:"Ikke gyldig konfiguration",show_warning:"Vis advarsel"},wt={common:At};const xt={en:Object.freeze({__proto__:null,common:bt,default:yt}),nb:Object.freeze({__proto__:null,common:At,default:wt})};function St(t,e="",i=""){const n=(localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let s;try{s=t.split(".").reduce(((t,e)=>t[e]),xt[n])}catch(e){s=t.split(".").reduce(((t,e)=>t[e]),xt.en)}return void 0===s&&(s=t.split(".").reduce(((t,e)=>t[e]),xt.en)),""!==e&&""!==i&&(s=s.replace(e,i)),s}console.info(`%c  IRRIGATION-UNLIMITED-CARD \n%c  ${St("common.version")} 1.0.2    `,"color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"irrigation-unlimited-card",name:"Irrigation Unlimited Card",description:"A companion card for the Irrigation Unlimited integration"});let Et=class extends Q{constructor(){super(...arguments),this._iu_entities=void 0}static async getConfigElement(){return document.createElement("irrigation-unlimited-card-editor")}setConfig(t){if(!t)throw new Error(St("common.invalid_configuration"));this.config=t}static getStubConfig(){return{}}getCardSize(){return 1}shouldUpdate(t){if(!this.hass)return!1;if(null==this._iu_entities){this._iu_entities=[];for(const t in this.hass.states)if(t.startsWith("binary_sensor.irrigation_unlimited_")){const e=new Date(this.hass.states[t].last_updated);this._iu_entities.push({entity_id:t,last_updated:e})}return!0}{let t=!1;for(const e of this._iu_entities){const i=new Date(this.hass.states[e.entity_id].last_updated);i>e.last_updated&&(e.last_updated=i,t=!0)}return t}}render(){return this.hass?T`
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
          ${Array.from(Array(this.hass.states["irrigation_unlimited.coordinator"].attributes.controller_count).keys()).map((t=>this._renderController(t)))}
        </div>
      </ha-card>
    `:j}_renderController(t){const e=this.hass.states["binary_sensor.irrigation_unlimited_c"+(t+1)+"_m"],i="on"===e.state,n=e.attributes.enabled;let s,o,r,a="";i?(s=new Date(e.attributes.current_start),o=e.attributes.time_remaining,r=e.attributes.current_name):(s=new Date(e.attributes.next_start),o=e.attributes.next_duration,r=e.attributes.next_name),isNaN(s.getTime())||(a=s.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const l=["iu-controller-row iu-td"];return i&&l.push("iu-on"),n&&l.push("iu-enabled"),T`
      <div class="iu-controller iu-object" iu-key="${t+1}.0.0.0">
      <hr>
        <div class=${l.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${e.attributes.icon}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${t+1}</span>
            <span class="iu-name">${e.attributes.friendly_name}</span>
          </div>
          <div class="iu-td4">
            <div ?hidden=${!n}>
              <span class="iu-schedule">${r}</span>
              <span class="iu-start" ?hidden=${i}><br>${a}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!n}>
              ${o}
            </div>
          </div>
          <div class="iu-td6"></div>
          <div class="iu-td7">${this._renderMenu(n,!1,!0,!0,null)}</div>
        </div>
        <div class="iu-control-panel">
          <div class="iu-control-panel-item">
            <label>Zones&nbsp;</label>
            <ha-switch @change="${this._toggleZones}"></ha-switch>
          </div>
          <div class="iu-control-panel-item">
            <label>Sequences&nbsp;</label>
            <ha-switch @change="${this._toggleSequences}"></ha-switch>
          </div>
        </div>
        <div class="iu-zones iu-content iu-hidden">
          <hr>
          ${Array.from(Array(e.attributes.zone_count).keys()).map((e=>this._renderZone(t,e)))}
        </div>
        <div class="iu-sequences iu-content iu-hidden">
          <hr>
          ${e.attributes.sequence_status.map((e=>this._renderSequence(t,e)))}
        </div>
      </div>
    `}_renderZone(t,e){const i=this.hass.states["binary_sensor.irrigation_unlimited_c"+(t+1)+"_z"+(e+1)],n="on"===i.state,s=i.attributes.enabled,o="blocked"===i.attributes.status;let r,a,l,d,u,c="";n?(r=new Date(i.attributes.current_start),a=i.attributes.time_remaining,l=i.attributes.current_schedule,d=i.attributes.current_name,u=i.attributes.current_adjustment):(r=new Date(i.attributes.next_start),a=i.attributes.next_duration,l=i.attributes.next_schedule,d=i.attributes.next_name,u=i.attributes.next_adjustment);const h=0===l;isNaN(r.getTime())||(c=r.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const v=["iu-zone-row iu-td"];return n&&v.push("iu-on"),s&&v.push("iu-enabled"),h&&v.push("iu-manual"),o&&v.push("iu-blocked"),T`
      <div class="iu-zone iu-object" iu-key="${t+1}.${e+1}.0.0">
        <div class=${v.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${i.attributes.icon}></ha-icon>
          </div>
          <div class="iu-td3">
            <span style="color: ${this._selectColour(e)}">${e+1}</span>
            <span class="iu-name">${i.attributes.friendly_name}</span>
          </div>
          <div class="iu-td4">
            <div ?hidden=${!s||o}>
              <span class="iu-schedule">${d}</span>
              <span class="iu-start" ?hidden=${n||h}><br>${c}</span>
            </div>
          </div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!s||o}>${a}</div>
          </div>
          <div class="iu-td6 iu-adjustment">
            <div ?hidden=${h}>${u}</div>
          </div>
          <div class="iu-td7">${this._renderMenu(s,o,!0,!0,u)}</div>
        </div>
      </div>
    `}_renderSequence(t,e){const i="on"===e.status||"paused"===e.status,n=e.enabled,s="blocked"===e.status,o=e.enabled&&null===e.schedule.index,r=0!==e.duration,a=new Date(e.start);let l="";isNaN(a.getTime())||(l=a.toLocaleTimeString(void 0,{weekday:"short",hour:"numeric",minute:"2-digit",hour12:!1}));const d=new Date(1e3*e.duration).toISOString().substring(12,19),u=["iu-sequence-row iu-td"];return i&&u.push("iu-on"),n&&u.push("iu-enabled"),o&&u.push("iu-manual"),r&&u.push("iu-running"),s&&u.push("iu-blocked"),T`
      <div class="iu-sequence iu-object" iu-key="${t+1}.0.${e.index+1}.0">
        <div class="iu-collapsible iu-hidden">
          <div class=${u.join(" ")}>
            <div class="iu-td1 iu-expander" @click="${this._toggleCollapse}"></div>
            <div class="iu-td2" @click="${this._toggleCollapse}">
              <ha-icon .icon=${e.icon} ?is-on=${i}></ha-icon>
            </div>
            <div class="iu-td3" @click="${this._toggleCollapse}">
              <span>${e.index+1}</span>
              <span class="iu-name">${e.name}</span>
            </div>
            <div class="iu-td4">
              <div ?hidden=${!n||s||!r}>
                <span class="iu-schedule">${e.schedule.name}</span>
                <span class="iu-start" ?hidden=${i}><br>${l}</span>
              </div>
            </div>
            <div class="iu-td5 iu-duration">
              <div ?hidden=${!n||s||!r}>${d}</div>
            </div>
            <div class="iu-td6 iu-adjustment">
            <div ?hidden=${o}>${e.adjustment}</div>
            </div>
            <div class="iu-td7">${this._renderMenu(n,s,!0,!1,e.adjustment)}</div>
          </div>
          <div class="iu-sequence-zones iu-content">
            ${e.zones.map((i=>this._renderSequenceZone(t,e.index,i,o)))}
          </div>
        </div>
      </div>
    `}_renderSequenceZone(t,e,i,n){const s="on"===i.status,o=i.enabled,r="blocked"===i.status,a=0!==i.duration,l=new Date(1e3*i.duration).toISOString().substring(12,19),d=["iu-sequence-zone-row iu-td"];return s&&d.push("iu-on"),o&&d.push("iu-enabled"),n&&d.push("iu-manual"),a&&d.push("iu-running"),r&&d.push("iu-blocked"),T`
      <div class="iu-sequence-zone iu-object" iu-key="${t+1}.0.${e+1}.${i.index+1}">
        <div class=${d.join(" ")}>
          <div class="iu-td1"></div>
          <div class="iu-td2">
            <ha-icon .icon=${i.icon} ?is-on=${s}></ha-icon>
          </div>
          <div class="iu-td3">
            <span>${i.zone_ids.map((t=>this._renderSequenceZoneRef(t)))}</span>
          </div>
          <div class="iu-td4"></div>
          <div class="iu-td5 iu-duration">
            <div ?hidden=${!o||r||!a}>${l}</div>
          </div>
          <div class="iu-td6 iu-adjustment">
            <div ?hidden=${n}>${i.adjustment}</div>
          </div>
          <div class="iu-td7">${this._renderMenu(o,r,!1,!1,i.adjustment)}</div>
        </div>
      </div>
    `}_renderSequenceZoneRef(t){return T`
      <span style="color: ${this._selectColour(t-1)}">${t}</span>
    `}_renderMenu(t,e,i,n,s){return T`
      <div class="iu-menu">
        <ha-icon class="iu-menu-button" icon="mdi:dots-vertical" @click="${this._toggleMenu}"></ha-icon>
        <div class="iu-menu-content iu-hidden">
          <div class="iu-menu-item">
            <div class="iu-mc1">Enable</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">${this._renderEnabled(t,e)}</div>
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
          <div class="iu-menu-item ${n?"":"iu-hidden"}">
            <div class="iu-mc1">Cancel</div>
            <div class="iu-mc2"></div>
            <div class="iu-mc3">
              <ha-icon-button .disabled=${!n} @click="${this._serviceCancel}">
                <ha-icon icon="mdi:cancel"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="iu-menu-item ${void 0===s?"iu-hidden":""}">
            <div class="iu-mc1">Adjust</div>
            <div class="iu-mc2">
              <input type="text"
                class="iu-adjust-input"
                value=${s}
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
    `}_renderEnabled(t,e){return T`
      <ha-switch
        .checked=${t}
        .disabled=${e}
        @change="${this._serviceEnable}"
      ></ha-switch>
    `}_selectColour(t){const e=["#3498db","#e74c3c","#9b59b6","#f1c40f","#2ecc71","#1abc9c","#34495e","#e67e22","#7f8c8d","#27ae60","#2980b9","#8e44ad"];return e[t%e.length]}_clickNet(t){var e;const i=t.target;if(i.closest(".iu-menu"))return;const n=null===(e=i.closest("#iu-card"))||void 0===e?void 0:e.querySelectorAll(".iu-menu-content:not(.iu-hidden)");null==n||n.forEach((t=>t.classList.add("iu-hidden")))}_toggleCollapse(t){const e=t.target.closest(".iu-collapsible");null==e||e.classList.toggle("iu-hidden"),this.requestUpdate()}_toggleZones(t){var e,i;null===(i=null===(e=t.target.closest(".iu-controller"))||void 0===e?void 0:e.querySelector(".iu-zones"))||void 0===i||i.classList.toggle("iu-hidden")}_toggleSequences(t){var e,i;null===(i=null===(e=t.target.closest(".iu-controller"))||void 0===e?void 0:e.querySelector(".iu-sequences"))||void 0===i||i.classList.toggle("iu-hidden")}_toggleMenu(t){var e,i;null===(i=null===(e=t.target.closest(".iu-menu"))||void 0===e?void 0:e.querySelector(".iu-menu-content"))||void 0===i||i.classList.toggle("iu-hidden")}_get_iu_key(t){var e,i;return null===(i=null===(e=t.target.closest(".iu-object"))||void 0===e?void 0:e.getAttribute("iu-key"))||void 0===i?void 0:i.split(".",4)}_build_entity_id(t){let e="binary_sensor.irrigation_unlimited_c"+t[0]+"_";return e+="0"===t[1]?"m":"z"+t[1],e}_build_data(t){const e=this._get_iu_key(t);if(!e)return;const i={entity_id:this._build_entity_id(e)};return"0"!==e[2]&&(i.sequence_id=Number(e[2])),"0"!==e[3]&&(i.zones=Number(e[3])),i}_serviceEnable(t){const e=this._build_data(t);e&&this.hass.callService("irrigation_unlimited","toggle",e)}_serviceManualRun(t){var e;const i=this._build_data(t);if(!i)return;const n=null===(e=t.target.closest(".iu-menu-item"))||void 0===e?void 0:e.querySelector(".iu-time-input");i.time=n.value,this.hass.callService("irrigation_unlimited","manual_run",i),this._toggleMenu(t)}_serviceCancel(t){const e=this._build_data(t);e&&(this.hass.callService("irrigation_unlimited","cancel",e),this._toggleMenu(t))}_serviceAdjust(t){var e;const i=this._build_data(t);if(!i)return;const n=(null===(e=t.target.closest(".iu-menu-item"))||void 0===e?void 0:e.querySelector(".iu-adjust-input")).value;switch(n.slice(0,1)){case"%":i.percentage=n.slice(1);break;case"=":i.actual=n.slice(1);break;case"+":i.increase=n.slice(1);break;case"-":i.decrease=n.slice(1);break;case"":i.reset=null;break;default:return}console.log(i),this.hass.callService("irrigation_unlimited","adjust_time",i),this._toggleMenu(t)}static get styles(){return o`
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
    }`}};t([_t({attribute:!1})],Et.prototype,"hass",void 0),t([gt()],Et.prototype,"config",void 0),Et=t([pt("irrigation-unlimited-card")],Et);export{Et as IrrigationUnlimitedCard};
