import{p as T,m as le,h as U,i as F,d as t,j as E,V as L,I as ne,k as J,l as re,q as X,s as G,t as Z,v as ie,x as q,y as N,z as K,A as ce,B as ue,C as de,D as me,E as ge,M as fe,G as _e,H as ve,J as O,K as he,L as pe,N as be,O as ye,P as ke,Q as Ve,R as we,S as Ce,c as x,T as Se,U as xe,_ as $,a as Q,o as l,b as f,w as s,W as i,f as p,F as V,g as A,X as b,Y as w,Z as ee,$ as te,a0 as oe,r as R,a1 as Le,a2 as Ie,a3 as Be,a4 as Ae,e as _,a5 as Pe,a6 as Ne,a7 as De,u as Ee,a8 as Oe,a9 as y,aa as W,n as H}from"./index-CryKp6Ly.js";import{V as ae,a as B}from"./VCol-BP2HWyMW.js";import{V as D}from"./VRow-BhoZUXlw.js";import{u as se}from"./orderProgress.vue_vue_type_style_index_0_scoped_3c37f8ce_lang-CWA13PW0.js";import{V as Re}from"./VSheet-CS_V_RzP.js";import{V as Te}from"./VDivider-CV8ah_1I.js";import{a as P,V as Ue}from"./VList-WWYH1D95.js";import{V as Fe,a as $e}from"./VNavigationDrawer-c-ba5RBZ.js";import{V as je}from"./VAppBar-eS8bcNqY.js";import"./ssrBoot-CQ6XiwJX.js";import"./VToolbar-CxHM3dNF.js";const Me=T({...le({icon:"$menu",variant:"text"})},"VAppBarNavIcon"),ze=U()({name:"VAppBarNavIcon",props:Me(),setup(e,c){let{slots:o}=c;return F(()=>t(L,E(e,{class:["v-app-bar-nav-icon"]}),o)),{}}}),We=T({bordered:Boolean,color:String,content:[Number,String],dot:Boolean,floating:Boolean,icon:ne,inline:Boolean,label:{type:String,default:"$vuetify.badge"},max:[Number,String],modelValue:{type:Boolean,default:!0},offsetX:[Number,String],offsetY:[Number,String],textColor:String,...J(),...re({location:"top end"}),...X(),...G(),...Z(),...ie({transition:"scale-rotate-transition"})},"VBadge"),Y=U()({name:"VBadge",inheritAttrs:!1,props:We(),setup(e,c){const{backgroundColorClasses:o,backgroundColorStyles:k}=q(N(e,"color")),{roundedClasses:v}=K(e),{t:u}=ce(),{textColorClasses:n,textColorStyles:S}=ue(N(e,"textColor")),{themeClasses:m}=de(),{locationStyles:d}=me(e,!0,a=>(e.floating?e.dot?2:4:e.dot?8:12)+(["top","bottom"].includes(a)?+(e.offsetY??0):["left","right"].includes(a)?+(e.offsetX??0):0));return F(()=>{const a=Number(e.content),h=!e.max||isNaN(a)?e.content:a<=+e.max?a:`${e.max}+`,[r,g]=ge(c.attrs,["aria-atomic","aria-label","aria-live","role","title"]);return t(e.tag,E({class:["v-badge",{"v-badge--bordered":e.bordered,"v-badge--dot":e.dot,"v-badge--floating":e.floating,"v-badge--inline":e.inline},e.class]},g,{style:e.style}),{default:()=>{var I,j;return[t("div",{class:"v-badge__wrapper"},[(j=(I=c.slots).default)==null?void 0:j.call(I),t(fe,{transition:e.transition},{default:()=>{var M,z;return[_e(t("span",E({class:["v-badge__badge",m.value,o.value,v.value,n.value],style:[k.value,S.value,e.inline?{}:d.value],"aria-atomic":"true","aria-label":u(e.label,a),"aria-live":"polite",role:"status"},r),[e.dot?void 0:c.slots.badge?(z=(M=c.slots).badge)==null?void 0:z.call(M):e.icon?t(O,{icon:e.icon},null):h]),[[ve,e.modelValue]])]}})])]}})}),{}}}),He=T({app:Boolean,color:String,height:{type:[Number,String],default:"auto"},...he(),...J(),...pe(),...be(),...X(),...G({tag:"footer"}),...Z()},"VFooter"),Ye=U()({name:"VFooter",props:He(),setup(e,c){let{slots:o}=c;const{themeClasses:k}=ye(e),{backgroundColorClasses:v,backgroundColorStyles:u}=q(N(e,"color")),{borderClasses:n}=ke(e),{elevationClasses:S}=Ve(e),{roundedClasses:m}=K(e),d=we(32),{resizeRef:a}=Ce(I=>{I.length&&(d.value=I[0].target.clientHeight)}),h=x(()=>e.height==="auto"?d.value:parseInt(e.height,10)),{layoutItemStyles:r,layoutIsReady:g}=Se({id:e.name,order:x(()=>parseInt(e.order,10)),position:x(()=>"bottom"),layoutSize:h,elementSize:x(()=>e.height==="auto"?void 0:h.value),active:x(()=>e.app),absolute:N(e,"absolute")});return F(()=>t(e.tag,{ref:a,class:["v-footer",k.value,v.value,n.value,S.value,m.value,e.class],style:[u.value,e.app?r.value:{height:xe(e.height)},e.style]},o)),e.app?g:{}}}),Je=""+new URL("logo-web-navHome-notext-white-03-WYWwkvys.png",import.meta.url).href,C=e=>(ee("data-v-53a4144f"),e=e(),te(),e),Xe=C(()=>i("img",{src:Je,height:"60"},null,-1)),Ge=C(()=>i("p",{class:"p-text"},"熱門訊息",-1)),Ze=C(()=>i("hr",null,null,-1)),qe={class:"none-list-style no-bullets"},Ke=C(()=>i("br",null,null,-1)),Qe=C(()=>i("p",{class:"p-text"},"最新消息",-1)),et=C(()=>i("hr",null,null,-1)),tt={class:"no-bullets"},ot=C(()=>i("br",null,null,-1)),at=C(()=>i("span",null,"2024© Enjoying meals in the forest every day - JADE | ",-1)),st={__name:"AppFooter",setup(e){const c=[{title:"新品上市 | 秘製私廚滷肉飯開放預購中",icon:"mdi-arrow-right",to:"/specialty",date:"July 02, 2024"},{title:"新品上市 | 純手工烏梅汁熱銷中",icon:"mdi-arrow-right",to:"/menu",date:"July 02, 2024"}],o=[{title:"「員工考察之旅」- 店內公休四天",icon:"mdi-arrow-right",to:"/news",date:"Aug 27, 2024"},{title:"玉食堂品牌記憶 | 一起回顧玉食堂歷史",icon:"mdi-arrow-right",to:"/about",date:"Aug 01, 2022"}];return(k,v)=>{const u=Q("router-link");return l(),f(Ye,{class:"bg-deep"},{default:s(()=>[t(ae,{class:"my-container"},{default:s(()=>[t(D,null,{default:s(()=>[t(B,{cols:"4",sm:"4",md:"4",lg:"4",class:"d-flex align-center justify-center"},{default:s(()=>[Xe]),_:1}),t(B,{cols:"4",sm:"4",md:"4",lg:"4"},{default:s(()=>[i("div",null,[Ge,Ze,i("ul",qe,[(l(),p(V,null,A(c,n=>i("li",{key:n.to},[t(u,{to:c,class:"custom-link"},{default:s(()=>[t(O,{icon:n.icon},null,8,["icon"]),b(" "+w(n.title),1)]),_:2},1024),Ke,b(" "+w(n.date),1)])),64))])])]),_:1}),t(B,{cols:"4",sm:"4",md:"4",lg:"4"},{default:s(()=>[i("div",null,[Qe,et,i("ul",tt,[(l(),p(V,null,A(o,n=>i("li",{key:n.to},[t(u,{to:n.to,class:"custom-link"},{default:s(()=>[t(O,{icon:n.icon},null,8,["icon"]),b(" "+w(n.title),1)]),_:2},1032,["to"]),ot,b(" "+w(n.date),1)])),64))])])]),_:1})]),_:1}),t(D,null,{default:s(()=>[t(B,{cols:"12",class:"d-flex align-center justify-center"},{default:s(()=>[at,t(u,{to:"/admin",class:"custom-link"},{default:s(()=>[b(" 夥伴登入 ")]),_:1})]),_:1})]),_:1}),t(D,null,{default:s(()=>[t(B,{clos:"12",class:"d-flex align-center justify-center"},{default:s(()=>[t(L,{class:"custom-btn"},{default:s(()=>[t(u,{to:"/menu",class:"top-btn"},{default:s(()=>[b("BUY NOW")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}},lt=$(st,[["__scopeId","data-v-53a4144f"]]),nt=e=>(ee("data-v-3c37f8ce"),e=e(),te(),e),rt=nt(()=>i("div",{class:"text-h5 bg-g"},"目前餐點進度 Order-Progress",-1)),it={__name:"orderProgress",setup(e){const{apiAuth:c}=Ne(),o=se(),k=oe(),v=R([]),u=R("pending"),n=Le("http://localhost:4000");return n.on("connect",()=>{console.log("Connected to server")}),Ie(()=>{n.on("orderStatusUpdated",m=>{const d=v.value.find(a=>a._id===m.orderId);d&&(d.status=m.status)})}),(async()=>{var m,d;try{const{data:a}=await c.get("/order/all");console.log("data",a),v.value=a.result||[],u.value=a.result.status||"pending"}catch(a){console.log(a),k({text:((d=(m=a==null?void 0:a.response)==null?void 0:m.data)==null?void 0:d.message)||"發生錯誤",snackbarProps:{color:"#D78A24"}})}})(),(m,d)=>(l(),f(Pe,{modelValue:_(o).isOpen,"onUpdate:modelValue":d[0]||(d[0]=a=>_(o).isOpen=a),scrollable:"",persistent:"","max-width":"580"},{default:s(()=>[t(Re,{class:"text-center justify-center"},{default:s(()=>[t(Be,null,{default:s(()=>[rt,(l(!0),p(V,null,A(v.value,(a,h)=>(l(),p("div",{key:h},[i("p",null,"訂單 "+w(h+1),1),i("p",null,"顧客 "+w(a.user.account),1),i("p",null,"狀態: "+w(a.status),1),t(Te)]))),128))]),_:1}),t(Ae,{class:"text-center justify-center"},{default:s(()=>[t(L,{class:"bg-y",onClick:_(o).closeDialog,hover:""},{default:s(()=>[b("關閉視窗")]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"]))}},ct=$(it,[["__scopeId","data-v-3c37f8ce"]]),ut={key:1,class:"d-flex justify-space-between",style:{width:"100%"}},dt={__name:"default",setup(e){const{mobile:c}=De(),o=Ee(),k=se(),v=()=>{k.openDialog()},u=R(!1);Oe();const n=oe(),S=x(()=>[{to:"/",text:"HOME",icon:"mdi-home",show:!o.isLogin||o.isLogin},{to:"/news",text:"NEWS",icon:"mdi-information-slab-circle",show:!o.isLogin||o.isLogin},{to:"/about",text:"ABOUT US",icon:"mdi-account-reactivate",show:!o.isLogin||o.isLogin},{to:"/menu",text:"MENU",icon:"mdi-arrow-down-drop-circle",show:!o.isLogin||o.isLogin},{to:"/specialty",text:"SPECIALTIES",icon:"mdi-arrow-down-drop-circle",show:!o.isLogin||o.isLogin},{to:"/member",text:"MEMBER ZONE",icon:"mdi-wallet-bifold",show:!o.isLogin},{to:"/profile",text:"CART & PROFILE",icon:"mdi-account",show:o.isLogin},{to:"/admin",text:"ADMIN",icon:"mdi-account-cog",show:o.isLogin&&(o.isEmployee||o.isAdmin)}]),m=async()=>{await o.logout(),n({text:"登出成功",snackbarProps:{color:"#D78A24"}})};return(d,a)=>{const h=Q("router-view");return l(),p(V,null,[_(c)?(l(),f(Fe,{key:0,modelValue:u.value,"onUpdate:modelValue":a[0]||(a[0]=r=>u.value=r),class:"h-100"},{default:s(()=>[t(Ue,{nav:"",class:"h-100 d-flex align-start flex-column"},{default:s(()=>[(l(!0),p(V,null,A(S.value,(r,g)=>(l(),p(V,{key:r.to},[r.show?(l(),f(P,{key:0,to:r.to,"prepend-icon":r.icon,title:r.text,class:H([{"special-item":g===6||g===7||g===8},"d-flex w-100"]),rounded:"sm"},{append:s(()=>[r.to==="/profile"&&_(o).cart>0?(l(),f(Y,{key:0,color:"#D78A24",content:_(o).cart},null,8,["content"])):y("",!0)]),_:2},1032,["to","prepend-icon","title","class"])):y("",!0),g===5?(l(),f(P,{key:1,class:"mb-auto"})):y("",!0)],64))),128)),_(o).isLogin?(l(),f(P,{key:0,"prepend-icon":"mdi-star",title:"LOGOUT",onClick:m,class:"w-100"})):y("",!0),t(P,{"prepend-icon":"mdi-star",onClick:v,title:"Order Progress",class:"w-100"})]),_:1})]),_:1},8,["modelValue"])):y("",!0),t(je,{"scroll-behavior":"elevate"},{default:s(()=>[t(ae,{class:"d-flex align-center justify-space-between w-100"},{default:s(()=>[t(W),_(c)?(l(),f(ze,{key:0,onClick:a[1]||(a[1]=r=>u.value=!0)})):(l(),p("div",ut,[(l(!0),p(V,null,A(S.value,(r,g)=>(l(),p(V,{key:r.to},[r.show?(l(),f(L,{key:0,to:r.to,class:H({"special-item":g===6||g===7||g===8})},{default:s(()=>[b(w(r.text)+" ",1),r.to==="/profile"&&_(o).cart>0?(l(),f(Y,{key:0,color:"#D78A24",content:_(o).cart,inline:""},null,8,["content"])):y("",!0)]),_:2},1032,["to","class"])):y("",!0),_(o).isLogin&&g===5?(l(),f(W,{key:1})):y("",!0)],64))),128)),_(o).isLogin?(l(),f(L,{key:0,"prepend-icon":"mdi-star",onClick:m},{default:s(()=>[b(" Logout ")]),_:1})):y("",!0),t(L,{"prepend-icon":"mdi-star",onClick:v},{default:s(()=>[b("Order Progress")]),_:1})]))]),_:1})]),_:1}),t($e,null,{default:s(()=>[t(h),t(ct)]),_:1}),t(lt)],64)}}},wt=$(dt,[["__scopeId","data-v-1ab4a4de"]]);export{wt as default};
