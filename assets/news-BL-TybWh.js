import{_ as h,r as p,a0 as g,o as c,b as i,w as a,d as t,f as w,g as V,F as b,a6 as v,j as x,Z as C,$ as S,W as d}from"./index-CryKp6Ly.js";import{V as k}from"./newsCard.vue_vue_type_style_index_0_scoped_3bd3b702_lang-CHaUF-vZ.js";import{b as I,s as L}from"./sectionPart-SO9azv8K.js";import{V as U}from"./VCol-BP2HWyMW.js";import{a as r,V as y}from"./VCarouselItem-8xbLgl-q.js";import{V as B}from"./VSlideGroup-DANVPriE.js";import{V as N}from"./VSheet-CS_V_RzP.js";import"./VParallax-C_-Gn6UT.js";import"./VRow-BhoZUXlw.js";import"./VWindowItem-Bklnt3iz.js";import"./ssrBoot-CQ6XiwJX.js";const P=""+new URL("member-CmW6CSjU.png",import.meta.url).href,R=""+new URL("大banner-design02-CQHcvyxX.png",import.meta.url).href,j=""+new URL("member02-pxZqiWje.png",import.meta.url).href,W=""+new URL("大banner-design00-B1fhx7PL.png",import.meta.url).href,u=o=>(C("data-v-451ce8bd"),o=o(),S(),o),F=u(()=>d("br",null,null,-1)),G=u(()=>d("h2",{class:"text-h5"},"News | 最新消息",-1)),Z={__name:"news",setup(o){const m=p(null),{api:_}=v(),f=g(),n=p([]);return(async()=>{var l,s;try{const{data:e}=await _.get("/news",{});n.value.splice(0,n.value.length,...e.result.data)}catch(e){console.log(e),f({text:((s=(l=e==null?void 0:e.response)==null?void 0:l.data)==null?void 0:s.message)||"發生錯誤",snackbarProps:{color:"red"}})}})(),(l,s)=>(c(),i(U,{fluid:"",class:"m-0 p-0 my-v-container"},{default:a(()=>[t(y,{height:""},{default:a(()=>[t(r,{src:P,cover:""}),t(r,{src:R}),t(r,{src:j,cover:""}),t(r,{src:W,cover:""})]),_:1}),t(I),t(N,{class:"mx-auto mb-5 w-100 p-5 text-center"},{default:a(()=>[F,G,t(B,{modelValue:m.value,"onUpdate:modelValue":s[0]||(s[0]=e=>m.value=e),class:"pa-4","show-arrows":""},{default:a(()=>[(c(!0),w(b,null,V(n.value,e=>(c(),i(k,{key:e.id},{default:a(({isSelected:A,toggle:E,selectedClass:H})=>[t(e,x({ref_for:!0},e),null,16)]),_:2},1024))),128))]),_:1},8,["modelValue"])]),_:1}),t(L)]),_:1}))}},ee=h(Z,[["__scopeId","data-v-451ce8bd"]]);export{ee as default};
