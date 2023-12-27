import{_ as O}from"./Header.c6fb137d.js";import{_ as P,a as Y}from"./Edit.d32ad400.js";import{_ as Z}from"./Search.5e392179.js";import{h as K,D as J,r as m,g as Q,H as I,I as G,c as v,b,a as e,j as D,l as W,m as a,k as X,n as L,F as ee,q as te,E as le,o as h,s as se,t as _,p as oe,e as ae,x as re,y as x,z as M,A as B}from"./entry.9da6a2f2.js";import{_ as ne}from"./_plugin-vue_export-helper.c27b6911.js";const ue=()=>({sayHello:()=>{}});const n=f=>(oe("data-v-bcf6ceeb"),f=f(),ae(),f),ie={class:"w-full h-full flex flex-col"},ce={class:"w-full flex grow flex-col overflow-auto h-0"},de={class:"w-full flex"},_e={class:"w-full flex p-1"},fe={class:"grow"},pe=n(()=>e("div",{class:"font-bold"}," Keyword ",-1)),me={class:"pl-1"},ve=n(()=>e("div",{class:"font-bold"}," Sort By ",-1)),be=n(()=>e("option",{value:""},null,-1)),he=n(()=>e("option",{value:"email"},"Email",-1)),ge=n(()=>e("option",{value:"fullname"},"Fullname",-1)),ye=[be,he,ge],ke={class:"pl-1"},xe=n(()=>e("div",{class:"font-bold"}," Sort Order ",-1)),we=n(()=>e("option",{value:"asc"},"Asc",-1)),De=n(()=>e("option",{value:"desc"},"Desc",-1)),Se=[we,De],$e={class:"flex items-end pl-1"},Ae={class:"w-full flex justify-center items-center grow h-0 p-1"},Te={key:0,class:""},He={class:"tacky"},Ce=n(()=>e("thead",null,[e("tr",{class:"sticky top-0 !z-[2]"},[e("th",null,"No."),e("th",null,"Email"),e("th",null,"Fullname"),e("th",null,"Role"),e("th",null,"Tanggal Dibuat"),e("th",null,"Tanggal Diubah")])],-1)),Ie=["onClick"],Le={class:"bold"},Me={__name:"index",async setup(f){let g,S;const{$moment:$}=re(),{sayHello:F}=ue();F();const r={};r._TimeZoneOffset=new Date().getTimezoneOffset();const A=K("token"),{data:u}=([g,S]=J(async()=>le(async()=>{x().loading_full=!0;const{data:o,error:t,status:p}=await M("/api/users",{method:"get",headers:{Authorization:`Bearer ${A.value}`,Accept:"application/json"},params:r,retry:0},"$LZQttUfkIg");return x().loading_full=!1,p.value==="error"?(B().trigger(t),[]):o.value.data},"$4SJ9UL5Y8i")),g=await g,S(),g),i=m(""),c=m({field:"",by:"asc"}),d=m(-1),s=m({page:1,is_last_record:!1,scrollLeft:0,may_get_data:!0}),R=()=>{r.like="",i.value!=""&&(r.like=`id:%${i.value}%,email:%${i.value}%,fullname:%${i.value}%`),r.sort="",c.value.field&&(r.sort=c.value.field+":"+c.value.by)},y=m(null),T=async()=>{x().loading_full=!0,s.value.may_get_data=!1,r.page=s.value.page,r.page==1&&(u.value=[]);const{data:o,error:t,status:p}=await M("/api/users",{method:"get",headers:{Authorization:`Bearer ${A.value}`,Accept:"application/json"},params:r,retry:0},"$TB7ZAgqAgs");if(x().loading_full=!1,s.value.may_get_data=!0,p.value==="error"){B().trigger(t);return}s.value.page==1?(u.value=o.value.data,y.value&&(y.value.scrollTop=0)):s.value.page>1&&(u.value=[...u.value,...o.value.data]),o.value.data.length==0&&(s.value.is_last_record=!0)},U=async()=>{if(!s.value.may_get_data)return;let o=y.value;if(o.scrollLeft!=s.value.scrollLeft){s.value.scrollLeft=o.scrollLeft;return}s.value.is_last_record||!(Math.round(o.scrollTop)+o.clientHeight>=o.scrollHeight-1)||(s.value.page++,await T())},z=()=>{s.value.page=1,s.value.is_last_record=!1,R(),T()},w=Q(),E=()=>{w.push({name:"user-form",query:{id:""}})},{display:H}=I();G(I());const j=()=>{d.value==-1?H({show:!0,status:"Failed",message:"Silahkan Pilih Data Terlebih Dahulu"}):w.push({name:"user-form",query:{id:u.value[d.value].id}})},q=()=>{d.value==-1?H({show:!0,status:"Failed",message:"Silahkan Pilih Data Terlebih Dahulu"}):w.push({name:"user-permission",query:{id:u.value[d.value].id}})};return(o,t)=>{const p=O,V=P,C=Y,N=Z;return h(),v("div",ie,[b(p,{title:"List User"}),e("div",ce,[e("div",de,[e("button",{type:"button",name:"button",class:"border-black border-solid border-2 p-1 m-1 text-2xl",onClick:t[0]||(t[0]=l=>E())},[b(V)]),e("button",{type:"button",name:"button",class:"border-black border-solid border-2 p-1 m-1 text-2xl",onClick:t[1]||(t[1]=l=>j())},[b(C)]),e("button",{type:"button",name:"button",class:"border-black border-solid border-2 p-1 m-1 text-2xl",onClick:t[2]||(t[2]=l=>q())},[b(C)])]),e("div",_e,[e("div",fe,[pe,D(e("input",{class:"w-full border-black border-solid border-2 p-1",type:"text","onUpdate:modelValue":t[3]||(t[3]=l=>X(i)?i.value=l:null),name:"search",placeholder:"Keyword"},null,512),[[W,a(i)]])]),e("div",me,[ve,D(e("select",{class:"w-full border-black border-solid border-2 p-1","onUpdate:modelValue":t[4]||(t[4]=l=>a(c).field=l)},ye,512),[[L,a(c).field]])]),e("div",ke,[xe,D(e("select",{class:"w-full border-black border-solid border-2 p-1","onUpdate:modelValue":t[5]||(t[5]=l=>a(c).by=l)},Se,512),[[L,a(c).by]])]),e("div",$e,[e("button",{class:"w-full border-black border-solid border-2 p-1",type:"button",name:"button",onClick:t[6]||(t[6]=l=>z())},[b(N,{class:"text-2xl"})])])]),e("div",Ae,[a(u).length==0?(h(),v("div",Te," Maaf Tidak Ada Record ")):(h(),v("div",{key:1,class:"w-full h-full overflow-auto",role:"sticky",ref_key:"loadRef",ref:y,onScroll:U},[e("table",He,[Ce,e("tbody",null,[(h(!0),v(ee,null,te(a(u),(l,k)=>(h(),v("tr",{key:k,onClick:Be=>d.value=k,class:se(a(d)==k?"active":"")},[e("td",null,_(k+1)+".",1),e("td",Le,_(l.email),1),e("td",null,_(l.fullname),1),e("td",null,_(l.role),1),e("td",null,_(a($)(l.internal_created_at).format("DD-MM-Y HH:mm:ss")),1),e("td",null,_(a($)(l.internal_updated_at).format("DD-MM-Y HH:mm:ss")),1)],10,Ie))),128))])])],544))])])])}}},je=ne(Me,[["__scopeId","data-v-bcf6ceeb"]]);export{je as default};
