"use strict";function e(e,r){return o(e)||n(e,r)||d(e,r)||t()}function t(){throw new TypeError(
"Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}
function n(e,r){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],n=!0,o=!1,a=void 0;try{for(var i,l=e[Symbol.iterator]();!(n=(
i=l.next()).done)&&(t.push(i.value),!r||t.length!==r);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==l.return||l.return()}finally{if(o)throw a}}
return t}}function o(e){if(Array.isArray(e))return e}function r(e){return l(e)||i(e)||d(e)||a()}function a(){throw new TypeError(
"Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function i(e){
if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function l(e){if(Array.isArray(e))return c(e)}function s(e,r){var t
;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(t=d(e))||r&&e&&"number"==typeof e.length){t&&(e=t);var n=0,r=function(
){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:r}}throw new TypeError(
"Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,
i=!1;return{s:function(){t=e[Symbol.iterator]()},n:function(){var e=t.next();return a=e.done,e},e:function(e){i=!0,o=e},f:function(){try{
a||null==t.return||t.return()}finally{if(i)throw o}}}}function d(e,r){if(e){if("string"==typeof e)return c(e,r);var t=Object.prototype.toString.call(e
).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e
):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?c(e,r):void 0}}function c(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,
n=new Array(r);t<r;t++)n[t]=e[t];return n}var f,h,y=document.querySelector("home-assistant"),v=y.shadowRoot.querySelector("home-assistant-main"
).shadowRoot,u=v.querySelector("partial-panel-resolver"),m=v.querySelector("app-drawer-layout"),p=0;function b(){if(p<20&&!f){p++;try{
var e=h.lovelace.config;f=e.kiosk_mode||{},p=0}catch(e){return}}}function w(e){var r=window.location.search;return e.some(function(e){
return r.includes(e)})}function k(e){return e&&!e.querySelector("#kiosk_mode")}function S(e,r){var t=document.createElement("style");t.setAttribute(
"id","kiosk_mode"),t.innerHTML=e,r.appendChild(t),window.dispatchEvent(new Event("resize"))}function g(e,r){window.localStorage.setItem(e,r)}
function _(e){return"true"==window.localStorage.getItem(e)}function x(){h=v.querySelector("ha-panel-lovelace");var e=window.location.search,r=y.hass
;if(!e.includes("disable_km")&&h){for(b();p<20&&!f;)setTimeout(function(){return b},50);var t=_("kmHeader")||w(["kiosk","hide_header"]),n=_(
"kmSidebar")||w(["kiosk","hide_sidebar"]),o=f.admin_settings,a=f.non_admin_settings,i=f.user_settings,l=n||t,t=l?t:f.kiosk||f.hide_header,
n=l?n:f.kiosk||f.hide_sidebar;if(o&&r.user.is_admin&&(t=o.kiosk||o.hide_header,n=o.kiosk||o.hide_sidebar),a&&!r.user.is_admin&&(
t=a.kiosk||a.hide_header,n=a.kiosk||a.hide_sidebar),i){Array.isArray(i)||(i=[i]);var d=s(i);try{for(d.s();!(u=d.n()).done;){var c=u.value,u=c.users
;Array.isArray(c.users)||(u=[u]),u.some(function(e){return e.toLowerCase()==r.user.name.toLowerCase()})&&(t=c.kiosk||c.hide_header,
n=c.kiosk||c.hide_sidebar)}}catch(e){d.e(e)}finally{d.f()}}(n||t)&&(a=(i=(a=v.querySelector("ha-panel-lovelace"))?a.shadowRoot.querySelector(
"hui-root").shadowRoot:null)?i.querySelector("app-toolbar"):null,t&&k(i)&&(S("#view { min-height: 100vh !important } app-header { display: none }",i),
e.includes("cache")&&g("kmHeader","true")),n&&k(m)&&(S(":host { --app-drawer-width: 0 !important } #drawer { display: none }",m),k(a)&&S(
"ha-menu-button { display:none !important } ",a),e.includes("cache")&&g("kmSidebar","true")))}}function A(e){var r,t=s(e);try{for(t.s();!(r=t.n()
).done;){var n=s(r.value.addedNodes);try{for(n.s();!(o=n.n()).done;){var o=o.value;if("ha-panel-lovelace"==o.localName
)return void new MutationObserver(j).observe(o.shadowRoot,{childList:!0})}}catch(e){n.e(e)}finally{n.f()}}}catch(e){t.e(e)}finally{t.f()}}function j(e
){var r,t=s(e);try{for(t.s();!(r=t.n()).done;){var n=s(r.value.addedNodes);try{for(n.s();!(o=n.n()).done;){var o=o.value;if("hui-root"==o.localName
)return void new MutationObserver(q).observe(o.shadowRoot,{childList:!0})}}catch(e){n.e(e)}finally{n.f()}}}catch(e){t.e(e)}finally{t.f()}}function q(e
){var r,t=s(e);try{for(t.s();!(r=t.n()).done;){var n,o=s(r.value.addedNodes);try{for(o.s();!(n=o.n()).done;)if("ha-app-layout"==n.value.localName
)return f=null,void x()}catch(e){o.e(e)}finally{o.f()}}}catch(e){t.e(e)}finally{t.f()}}window.location.search.includes("clear_km_cache")&&["kmHeader",
"kmSidebar"].forEach(function(e){return g(e,"false")}),x(),new MutationObserver(A).observe(u,{childList:!0});for(var E={
header:"%c≡ kiosk-mode".padEnd(27),ver:"%cversion 1.4.9 "},I="%c\n",O=Math.max.apply(Math,r(Object.values(E).map(function(e){return e.length}))),M=0,
L=Object.entries(E);M<L.length;M++){var N=e(L[M],1),R=N[0];E[R].length<=O&&(E[R]=E[R].padEnd(O)),"header"==R&&(E[R]="".concat(E[R].slice(0,-1),"⋮ "))}
var T="display:inline-block;border-width:1px 1px 0 1px;border-style:solid;border-color:#424242;color:white;background:#03a9f4;font-size:12px;padding:4px 4.5px 5px 6px;"
,C="border-width:0px 1px 1px 1px;padding:7px;background:white;color:#424242;line-height:0.7;";console.info(E.header+I+E.ver,T,"","".concat(T," "
).concat(C));