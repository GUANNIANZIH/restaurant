import{h as C,ba as b,bb as h,_ as S,r as i,o as d,b as m,w as s,d as a,b6 as v,at as w,aJ as x,X as _,Y as p,aN as y,a4 as k,W as g,a5 as N,V as q,aM as G,a1 as I,e as V,bc as B,f as P,F as T,g as A,j,a7 as D}from"./index-Bmq1rx2x.js";import{V as E}from"./VSheet-B2fojDxM.js";import{V as F,a as L}from"./VSlideGroup-Dx3HcNRG.js";import{V as J}from"./VCol-B1ZB-sXA.js";const M=C()({name:"VSlideGroupItem",props:b(),emits:{"group:selected":l=>!0},setup(l,t){let{slots:r}=t;const o=h(l,F);return()=>{var n;return(n=r.default)==null?void 0:n.call(r,{isSelected:o.isSelected.value,select:o.select,toggle:o.toggle,selectedClass:o.selectedClass.value})}}}),R={__name:"newsCard",props:{_id:{type:String,required:!0},title:{type:String,required:!0},subtitle:{type:String,required:!0},content:{type:String,required:!0},image:{type:String,required:!0},category:{type:String,required:!0},isPublished:{type:Boolean,required:!0}},setup(l){i(!1);const t=i(!1);i(1);const r=()=>{t.value=!0};return setTimeout(()=>{t.value=!1},2e3),(o,n)=>(d(),m(G,{class:"ma-5",width:"450",disabled:t.value,loading:t.value},{loader:s(({isActive:f})=>[a(v,{active:f,color:"deep-purple",height:"4",indeterminate:""},null,8,["active"])]),default:s(()=>[a(w,{class:"align-end text-white",height:"300",src:l.image,cover:""},null,8,["src"]),a(x,null,{default:s(()=>[_(p(l.title),1)]),_:1}),a(y,{class:"pt-4"},{default:s(()=>[_(p(l.subtitle),1)]),_:1}),a(k,null,{default:s(()=>[g("div",null,p(l.content),1)]),_:1}),a(N,{class:"d-flex justify-center primary-color"},{default:s(()=>[a(q,{color:"white",text:"Explore",onClick:r})]),_:1})]),_:1},8,["disabled","loading"]))}},U=S(R,[["__scopeId","data-v-3bd3b702"]]),W=g("br",null,null,-1),X=g("h2",{class:"text-h5"},"玉食堂最新消息",-1),K={__name:"news",setup(l){const t=i(""),r=i([]),{api:o}=D(),n=I();return(async()=>{var c,u;try{const{data:e}=await o.get("/news",{});console.log(e),r.value.splice(0,r.value.length,...e.result.data)}catch(e){console.log(e),n({text:((u=(c=e==null?void 0:e.response)==null?void 0:c.data)==null?void 0:u.message)||"無法載入活動資料",snackbarProps:{color:"#D78A24"}})}})(),(c,u)=>(d(),m(J,{fluid:"",class:"m-0 p-0 my-v-container"},{default:s(()=>[a(E,{class:"mx-auto mb-5 w-100 p-5 text-center"},{default:s(()=>[W,X,a(L,{modelValue:V(t),"onUpdate:modelValue":u[0]||(u[0]=e=>B(t)?t.value=e:null),class:"pa-4","show-arrows":""},{default:s(()=>[(d(!0),P(T,null,A(V(r),e=>(d(),m(M,{key:e._id},{default:s(()=>[a(U,j({ref_for:!0},e),null,16)]),_:2},1024))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1}))}};export{K as _};
