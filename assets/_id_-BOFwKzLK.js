import{bh as x,b5 as S,a0 as q,u as F,r as k,o as w,f as B,d as t,w as r,bi as C,F as M,W as u,Y as n,as as N,e as l,aR as R,aL as $,V as v,X as g,a6 as D}from"./index-DwXgdl5W.js";import{c as E,e as L,u as P,d as T,V as U}from"./vee-validate.esm-D-ZZjGQo.js";import{V as j,a as c}from"./VCol-BuFbBn21.js";import"./_commonjsHelpers-Cpj98o6Y.js";const A={class:"text-center"},I=u("h1",{class:"text-center text-red"},"已下架",-1),H={__name:"[id]",setup(O){const{api:_}=D(),f=x(),y=S(),d=q(),m=F(),e=k({_id:"",name:"",price:0,description:"",image:"",sell:!0,category:""});(async()=>{var o,s;try{const{data:a}=await _.get("/product/"+f.params.id);e.value._id=a.result._id,e.value.name=a.result.name,e.value.price=a.result.price,e.value.description=a.result.description,e.value.image=a.result.image,e.value.sell=a.result.sell,e.value.category=a.result.category,document.title="詳細商品資訊 | "+e.value.name}catch(a){console.log(a),d({text:((s=(o=a==null?void 0:a.response)==null?void 0:o.data)==null?void 0:s.message)||"發生錯誤",snackbarProps:{color:"#D66425"}})}})();const V=E({quantity:L().typeError("數量必填").required("數量必填").min(1,"最少為 1")}),{isSubmitting:p,handleSubmit:b}=P({validationSchema:V,initialValues:{quantity:1}}),i=T("quantity"),h=b(async o=>{if(!m.isLogin){y.push("/login");return}const s=await m.addCart(e.value._id,o.quantity);d({text:s.text,snackbarProps:{color:s.color}})});return(o,s)=>(w(),B(M,null,[t(j,null,{default:r(()=>[t(c,{cols:"12"},{default:r(()=>[u("h1",A,n(e.value.name),1)]),_:1}),t(c,{cols:"12"},{default:r(()=>[t(N,{src:e.value.image,height:"200"},null,8,["src"])]),_:1}),t(c,{cols:"12"},{default:r(()=>[u("p",null,"$"+n(e.value.price),1),u("p",null,n(e.value.description),1),t(U,{disabled:l(p),onSubmit:R(l(h),["prevent"])},{default:r(()=>[t($,{type:"number",modelValue:l(i).value.value,"onUpdate:modelValue":s[0]||(s[0]=a=>l(i).value.value=a),modelModifiers:{number:!0},"error-messages":l(i).errorMessage.value},null,8,["modelValue","error-messages"]),t(v,{type:"submit","prepend-icon":"mdi-cart",loading:l(p)},{default:r(()=>[g("加入購物車")]),_:1},8,["loading"])]),_:1},8,["disabled","onSubmit"])]),_:1})]),_:1}),t(C,{class:"align-center justify-center text-center","model-value":!e.value.sell,persistent:""},{default:r(()=>[I,t(v,{to:"/"},{default:r(()=>[g("回首頁")]),_:1})]),_:1},8,["model-value"])],64))}};export{H as default};
