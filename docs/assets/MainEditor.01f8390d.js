import{u as x,p as w}from"./app.95da9403.js";import{u as O,r as u,o as V,a as i,b as M,c as E,w as t,d as a,e as _,t as F,f as b}from"./index.2ffc45e8.js";const N=b("div",{id:"vditor"},null,-1),$={__name:"MainEditor",setup(R){const n=x(),k=O();u(null);const h=u(null),v=u(""),f=u(!1),C=u([o=>o?o[0].name.toLowerCase().endsWith(".md")?!0:"File extension is expected to be *.md (Markdown file)":"Please upload a file"]);function P(o){console.log(o,"fileList");const l=o[0];n.startFile=l;const{name:d}=l;if(!d.toLowerCase().endsWith("md"))throw f.value=!0,v.value="Markdown file (*.md) only",new Error("Markdown file only");const r=new FileReader;r.onload=function(m){const e=m.target.result;n.mainEditor.setValue(e)},r.readAsText(l,"UTF-8")}function T(){var d;console.log(n,"store.poFileItems");const o=n.mainEditor.getValue();console.log(o,"data"),n.editorContent=o;const l=((d=n.startFile)==null?void 0:d.name)||`draft-${new Date().valueOf()}`;new Promise((r,m)=>{const e=new w;e.headers["X-Generator"]="Markdown Translation Tool",e.headers["Project-Id-Version"]="",e.headers["Report-Msgid-Bugs-To"]="",e.headers["POT-Creation-Date"]="",e.headers["PO-Revision-Date"]="",e.headers["Last-Translator"]="",e.headers.Language="",e.headers["Language-Team"]="",e.headers["Content-Type"]="",e.headers["Content-Transfer-Encoding"]="",e.headers["Plural-Forms"]="",e.items=o.split(`
`).map((s,p)=>{const c=new w.Item;return c.msgid=s,c.references.push(`${l}:ln ${p+1}`),c}).filter(s=>s.msgid),n.poFileItems=e.items,delete e.items,n.poFileMeta={...e},r()}).then(()=>{k.push({name:"translate"})})}return V(()=>{const o=h.value.$el.getBoundingClientRect().height-24;n.mainEditor=new Vditor("vditor",{height:o,toolbarConfig:{pin:!0},cache:{enable:!1},after:()=>{n.mainEditor.setValue(`
# \u5F00\u59CB

\u4F7F\u7528\u4E0A\u9762\u7684\u6587\u4EF6\u4E0A\u4F20\u6765\u8F7D\u5165\u4E00\u4E2AMarkdown\uFF08*.md\uFF09\u6587\u6863\u3002

\u9875\u9762\u4E2D\u90E8\u7684md\u9884\u89C8\u533A\u57DF\u53EF\u4EE5\u67E5\u770B\u4E0A\u4F20\u7684\u5185\u5BB9\uFF0C\u540C\u65F6\u4E5F\u652F\u6301\u7F16\u8F91\u3002

\u70B9\u51FB\u9875\u9762\u5E95\u90E8\u7684\u751F\u6210PO\u6587\u4EF6\u6309\u94AE\u4F1A\u5C06\u5F53\u524Dmd\u7F16\u8F91\u5668\u4E2D\u7684\u5185\u5BB9\u5206\u89E3\u6210PO\u6587\u6863\u6761\u76EE\uFF0C\u6BCF\u4E00\u884C\uFF08\u4E0D\u542B\u7A7A\u884C\uFF0C\u5982\u679C\u5B58\u5728\uFF09\u5BF9\u5E94\u4E00\u6761PO\u3002\u91CD\u590D\u7684\u6761\u76EE\u5C06\u4F1A\u88AB\u5408\u5E76\u3002

PO\u751F\u6210\u540E\uFF0C\u4F1A\u81EA\u52A8\u8DF3\u8F6C\u5230\u7FFB\u8BD1\u9875\u9762\u3002

# \u7FFB\u8BD1

\u7FFB\u8BD1\u9875\u9762\u53EF\u4EE5\u5BF9\u751F\u6210\u7684PO\u8FDB\u884C\u7F16\u8F91\u3002

\u7FFB\u8BD1\u9875\u9762\u9876\u90E8\u540C\u6837\u63D0\u4F9B\u4E86\u4E0A\u4F20\u5165\u53E3\uFF0C\u7528\u4E8E\u8F7D\u5165\u5DF2\u7ECF\u5B58\u5728\u4E8E\u672C\u5730\u7684PO\u3002\u901A\u8FC7\u8FD9\u79CD\u65B9\u5F0F\u53EF\u4EE5\u7EE7\u7EED\u7F16\u8F91\u4E4B\u524D\u672A\u5B8C\u6210\u7684PO\u3002\u7FFB\u8BD1\u9875\u9762\u7684\u529F\u80FD\u7C7B\u4F3C\u4E8E\u7B80\u5316\u7248\u7684poedit\u3002

# \u66FF\u6362

\u7ED3\u5408\u5F00\u59CB\u9875\u8F7D\u5165\u7684md\u6587\u6863\u5185\u5BB9\u548C\u7FFB\u8BD1\u9875\u8F7D\u5165\u7684po\u6587\u4EF6\u5185\u5BB9\uFF0C\u5C1D\u8BD5\u751F\u6210\u4E00\u4EFD\u9010\u884C\u66FF\u6362\u7684\u6700\u7EC8\u7FFB\u8BD1md\u6587\u4EF6\u3002

\u53EF\u4EE5\u5C1D\u8BD5\u76F4\u63A5\u4F7F\u7528\u6B64\u5185\u5BB9\u6765\u751F\u6210\u4E00\u4EFDPO\u6587\u4EF6\u9884\u89C8\uFF0C\u4EE5\u719F\u6089\u5927\u81F4\u7684\u64CD\u4F5C\u6B65\u9AA4\u3002
      `)}})}),(o,l)=>{const d=i("v-file-input"),r=i("v-btn"),m=i("v-snackbar"),e=i("v-card"),s=i("v-col"),p=i("v-row"),c=i("v-main");return M(),E(c,{class:"grow d-flex flex-column flex-nowrap fill-height"},{default:t(()=>[a(p,{class:"shrink flex-0-0"},{default:t(()=>[a(s,{cols:"8"},{default:t(()=>[a(e,{elevation:"2",class:"pa-3"},{default:t(()=>[a(d,{label:"Markdown",placeholder:"Choose a Markdown file here","prepend-icon":"mdi-upload-circle-outline","onUpdate:modelValue":P,rules:C.value},null,8,["rules"]),a(m,{modelValue:f.value,"onUpdate:modelValue":l[1]||(l[1]=g=>f.value=g),"multi-line":""},{actions:t(()=>[a(r,{color:"red",variant:"text",onClick:l[0]||(l[0]=g=>f.value=!1)},{default:t(()=>[_(" Close ")]),_:1})]),default:t(()=>[_(F(v.value)+" ",1)]),_:1},8,["modelValue"])]),_:1})]),_:1}),a(s,{cols:"4"},{default:t(()=>[a(e,{elevation:"2",class:"pa-3 fill-height"},{default:t(()=>[a(r,{onClick:T},{default:t(()=>[_("SEND TO TRANSLATION")]),_:1})]),_:1})]),_:1})]),_:1}),a(p,{class:"grow"},{default:t(()=>[a(s,{cols:"12"},{default:t(()=>[a(e,{ref_key:"editorWrapper",ref:h,elevation:"2",class:"pa-3 fill-height flex-0-0"},{default:t(()=>[N]),_:1},512)]),_:1})]),_:1})]),_:1})}}};export{$ as default};
