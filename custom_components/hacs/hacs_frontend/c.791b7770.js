import{A as o}from"./main-c805434e.js";const a=()=>import("./c.59dcce37.js"),c=(c,i,l)=>new Promise((m=>{const n=i.cancel,r=i.confirm;o(c,"show-dialog",{dialogTag:"dialog-box",dialogImport:a,dialogParams:{...i,...l,cancel:()=>{m(!(null==l||!l.prompt)&&null),n&&n()},confirm:o=>{m(null==l||!l.prompt||o),r&&r(o)}}})})),i=(o,a)=>c(o,a),l=(o,a)=>c(o,a,{confirmation:!0}),m=(o,a)=>c(o,a,{prompt:!0});export{i as a,m as b,l as s};
