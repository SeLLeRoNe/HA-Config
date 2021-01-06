"use strict";function e(e,t){return o(e)||n(e,t)||d(e,t)||r()}function r(){throw new TypeError(
"Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}
function n(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(
a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{n||null==s.return||s.return()}finally{if(o)throw i}}
return r}}function o(e){if(Array.isArray(e))return e}function t(e){return s(e)||a(e)||d(e)||i()}function i(){throw new TypeError(
"Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function a(e){
if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function s(e){if(Array.isArray(e))return l(e)}function m(e,t){var r
;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(r=d(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,t=function(
){};return{s:t,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:t}}throw new TypeError(
"Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,
a=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return i=e.done,e},e:function(e){a=!0,o=e},f:function(){try{
i||null==r.return||r.return()}finally{if(a)throw o}}}}function d(e,t){if(e){if("string"==typeof e)return l(e,t);var r=Object.prototype.toString.call(e
).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e
):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?l(e,t):void 0}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,
n=new Array(t);r<t;r++)n[r]=e[r];return n}var p=document.querySelector("home-assistant"),k=p.shadowRoot.querySelector("home-assistant-main"
).shadowRoot,u=k.querySelector("partial-panel-resolver"),v=k.querySelector("app-drawer-layout");window.kiosk_entities=[];var c,b=0,w={};function h(e){
b++;try{var t=e.lovelace.config;w=t.kiosk_mode||{},y()}catch(e){b<40&&setTimeout(function(){return h()},50)}}function f(){var e=k.querySelector(
"ha-panel-lovelace");!_(["disable_km"])&&e&&h(e)}function _(e){var t=window.location.search;return e.some(function(e){return t.includes(e)})}
function S(e){return e&&e.querySelector("#kiosk_mode")}function g(e,t){var r=document.createElement("style"),
n="app-toolbar"==t.localName?"kiosk_mode_menu":"kiosk_mode";r.setAttribute("id",n),r.innerHTML=e,t.appendChild(r),window.dispatchEvent(new Event(
"resize"))}function x(e,t){window.localStorage.setItem(e,t)}function A(e){return"true"==window.localStorage.getItem(e)}function y(){var t=p.hass;b=0
;var e=A("kmHeader")||_(["kiosk","hide_header"]),r=A("kmSidebar")||_(["kiosk","hide_sidebar"]),n=w.admin_settings,o=w.non_admin_settings,
i=w.user_settings,a=w.entity_settings,s=r||e,e=s?e:w.kiosk||w.hide_header,r=s?r:w.kiosk||w.hide_sidebar;if(n&&t.user.is_admin&&(
e=n.kiosk||n.hide_header,r=n.kiosk||n.hide_sidebar),o&&!t.user.is_admin&&(e=o.kiosk||o.hide_header,r=o.kiosk||o.hide_sidebar),a){var d=m(a);try{for(
d.s();!(c=d.n()).done;){var l=c.value,u=Object.keys(l.entity)[0];window.kiosk_entities.includes(u)||window.kiosk_entities.push(u);var c=l.entity[u]
;t.states[u].state==c&&("kiosk"in l?(e=l.kiosk,r=l.kiosk):("hide_header"in l&&(e=l.hide_header),"hide_sidebar"in l&&(r=l.hide_sidebar)))}}catch(e){
d.e(e)}finally{d.f()}}if(i){Array.isArray(i)||(i=[i]);var h=m(i);try{for(h.s();!(y=h.n()).done;){var f=y.value,y=f.users;Array.isArray(f.users)||(y=[y
]),y.some(function(e){return e.toLowerCase()==t.user.name.toLowerCase()})&&(e=f.kiosk||f.hide_header,r=f.kiosk||f.hide_sidebar)}}catch(e){h.e(e)
}finally{h.f()}}a=k.querySelector("ha-panel-lovelace"),i=a?a.shadowRoot.querySelector("hui-root").shadowRoot:null,a=i?i.querySelector("app-toolbar"
):null;(r||e)&&(e&&!S(i)&&(g("#view { min-height: 100vh !important } app-header { display: none }",i),_(["cache"])&&x("kmHeader","true")),r&&!S(v)&&(
g(":host { --app-drawer-width: 0 !important } #drawer { display: none }",v),S(a)||g("ha-menu-button { display:none !important } ",a),_(["cache"])&&x(
"kmSidebar","true"))),!e&&S(i)&&i.querySelector("#kiosk_mode").remove(),!r&&S(v)&&v.querySelector("#kiosk_mode").remove(),!r&&a.querySelector(
"#kiosk_mode_menu")&&a.querySelector("#kiosk_mode_menu").remove(),window.dispatchEvent(new Event("resize"))}function q(e){O(e,"ha-panel-lovelace",E)}
function E(e){O(e,"hui-root",j)}function j(e){O(e,"ha-app-layout",null)}function O(e,t,r){var n,o=m(e);try{for(o.s();!(n=o.n()).done;){var i=m(
n.value.addedNodes);try{for(i.s();!(a=i.n()).done;){var a=a.value;if(a.localName==t)return void(r?new MutationObserver(r).observe(a.shadowRoot,{
childList:!0}):(w={},f()))}}catch(e){i.e(e)}finally{i.f()}}}catch(e){o.e(e)}finally{o.f()}}_(["clear_km_cache"])&&["kmHeader","kmSidebar"].forEach(
function(e){return x(e,"false")}),f(),new MutationObserver(q).observe(u,{childList:!0}),window.hassConnection.then(function(e){
return e.conn.socket.onmessage=function(e){window.kiosk_entities.length<1||(e=JSON.parse(e.data).event
)&&"state_changed"==e.event_type&&e.data.new_state.state!=e.data.old_state.state&&window.kiosk_entities.includes(e.data.entity_id)&&(w={},f())}});for(
var I={header:"%c≡ kiosk-mode".padEnd(27),ver:"%cversion 1.5.5 "},M="%c\n",C=Math.max.apply(Math,t(Object.values(I).map(function(e){return e.length}))
),L=0,R=Object.entries(I);L<R.length;L++){var T=e(R[L],1),H=T[0];I[H].length<=C&&(I[H]=I[H].padEnd(C)),"header"==H&&(I[H]="".concat(I[H].slice(0,-1),
"⋮ "))}
var N="display:inline-block;border-width:1px 1px 0 1px;border-style:solid;border-color:#424242;color:white;background:#03a9f4;font-size:12px;padding:4px 4.5px 5px 6px;"
,z="border-width:0px 1px 1px 1px;padding:7px;background:white;color:#424242;line-height:0.7;";console.info(I.header+M+I.ver,N,"","".concat(N," "
).concat(z));