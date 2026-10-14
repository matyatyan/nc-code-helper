"use strict";var Ye=Object.create;var ve=Object.defineProperty;var Ke=Object.getOwnPropertyDescriptor;var Je=Object.getOwnPropertyNames;var Qe=Object.getPrototypeOf,qe=Object.prototype.hasOwnProperty;var et=(e,t)=>{for(var n in t)ve(e,n,{get:t[n],enumerable:!0})},Re=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Je(t))!qe.call(e,o)&&o!==n&&ve(e,o,{get:()=>t[o],enumerable:!(i=Ke(t,o))||i.enumerable});return e};var _=(e,t,n)=>(n=e!=null?Ye(Qe(e)):{},Re(t||!e||!e.__esModule?ve(n,"default",{value:e,enumerable:!0}):n,e)),tt=e=>Re(ve({},"__esModule",{value:!0}),e);var lt={};et(lt,{activate:()=>ct,deactivate:()=>dt});module.exports=tt(lt);var O=_(require("vscode"));var A=_(require("vscode")),me=_(require("path")),X=_(require("fs"));var J=[{key:"enableOColor",colorKey:"colorO",label:"O (\u30D7\u30ED\u30B0\u30E9\u30E0\u756A\u53F7)",icon:"symbol-class",regex:/\b[Oo]\d+/g,defaultColor:"#FF1744"},{key:"enableNColor",colorKey:"colorN",label:"N (\u30B7\u30FC\u30B1\u30F3\u30B9\u756A\u53F7)",icon:"symbol-number",regex:/[Nn]\d+/g,defaultColor:"#df8337"},{key:"enableGColor",colorKey:"colorG",label:"G (\u6E96\u5099\u6A5F\u80FD)",icon:"gear",regex:/[Gg](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#ffa8db"},{key:"enableMColor",colorKey:"colorM",label:"M (\u88DC\u52A9\u6A5F\u80FD)",icon:"tools",regex:/[Mm](\d+|#\d+|#\[[^\]]+\])/g,defaultColor:"#eaadfc"},{key:"enableFSColor",colorKey:"colorFS",label:"FS (\u9001\u308A\u30FB\u56DE\u8EE2)",icon:"dashboard",regex:/[FSfs]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#9cc4f8"},{key:"enableXYZColor",colorKey:"colorXYZ",label:"XYZ (\u76F4\u7DDA\u8EF8)",icon:"move",regex:/[XxYyZz]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#76ee86"},{key:"enableABCColor",colorKey:"colorABC",label:"ABC (\u56DE\u8EE2\u8EF8)",icon:"sync",regex:/[AaBbCc]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#b2ff94"},{key:"enableToolColor",colorKey:"colorTool",label:"THD (\u5DE5\u5177\u30FB\u88DC\u6B63)",icon:"wrench",regex:/[TtHhDd](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#3112e0"},{key:"enableOthersColor",colorKey:"colorOthers",label:"OTHERS (\u305D\u306E\u4ED6)",icon:"symbol-parameter",regex:/[PpQqRrIiJjKkUuVvWw]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#f1a88d"},{key:"enableMacroColor",colorKey:"colorMacro",label:"MACRO (\u30DE\u30AF\u30ED\u6A5F\u80FD\u30FB\u5236\u5FA1\u6587)",icon:"symbol-variable",regex:/#\d+|#\[[^\]]+\]|(?<![A-Z])(IF|THEN|GOTO|WHILE|DO|END|EQ|NE|GT|GE|LT|LE|AND|OR|XOR|FIX|FUP|ROUND|ABS|SQRT|SIN|COS|TAN|ATAN|EXP|LN|BIN|BCD)(?![A-Z])/gi,defaultColor:"#e040fb"}];function te(e){let t=e.globalStorageUri.fsPath,n=me.join(t,"machines");X.existsSync(n)||X.mkdirSync(n,{recursive:!0});let i=me.join(n,"sample.json");return X.existsSync(i)||X.writeFileSync(i,JSON.stringify({machine:"sample",description:"\u30DE\u30B7\u30CB\u30F3\u30B0\u30BB\u30F3\u30BF\u7528 M\u30B3\u30FC\u30C9",version:"1.0.0",mCodes:{M00:"\u30D7\u30ED\u30B0\u30E9\u30E0\u30B9\u30C8\u30C3\u30D7",M01:"\u30AA\u30D7\u30B7\u30E7\u30CA\u30EB\u30B9\u30C8\u30C3\u30D7",M02:"\u30D7\u30ED\u30B0\u30E9\u30E0\u7D42\u4E86",M03:"\u4E3B\u8EF8\u6B63\u8EE2",M04:"\u4E3B\u8EF8\u9006\u8EE2",M05:"\u4E3B\u8EF8\u505C\u6B62",M06:"\u5DE5\u5177\u4EA4\u63DB\uFF08ATC\uFF09",M08:"\u30AF\u30FC\u30E9\u30F3\u30C8 ON",M09:"\u30AF\u30FC\u30E9\u30F3\u30C8 OFF",M10:"A/C\u8EF8\u30AF\u30E9\u30F3\u30D7",M11:"A/C\u8EF8\u30A2\u30F3\u30AF\u30E9\u30F3\u30D7",M30:"\u30D7\u30ED\u30B0\u30E9\u30E0\u7D42\u4E86\uFF08\u30EA\u30BB\u30C3\u30C8\u30FB\u5FA9\u5E30\uFF09",M100:"\u30BB\u30F3\u30BF\u30AF\u30FC\u30E9\u30F3\u30C8 ON",M101:"\u30BB\u30F3\u30BF\u30AF\u30FC\u30E9\u30F3\u30C8 OFF"}},null,2),"utf8"),n}var fe=class extends A.TreeItem{constructor(n,i,o,c,s,l){super(n,i);this.label=n;this.collapsibleState=i;this.category=o;this.machineName=s;this.isAddButton=l;l?(this.iconPath=new A.ThemeIcon("add"),this.tooltip="\u65B0\u3057\u3044\u8A2D\u5099M\u30B3\u30FC\u30C9\u5B9A\u7FA9(JSON)\u3092\u8FFD\u52A0",this.contextValue="addMachineItem",this.command={command:"ncCodeHelper.addMachineJson",title:"Add Machine JSON"}):o?(this.iconPath=new A.ThemeIcon(o.icon),this.tooltip=`${o.label} \u306E\u30CF\u30A4\u30E9\u30A4\u30C8\u8868\u793A\u5207\u66FF`,this.checkboxState=c?A.TreeItemCheckboxState.Checked:A.TreeItemCheckboxState.Unchecked,this.contextValue="categoryItem"):s&&(this.iconPath=new A.ThemeIcon("wrench"),this.tooltip=`\u30AF\u30EA\u30C3\u30AF\u3057\u3066 ${s} \u306EM\u30B3\u30FC\u30C9\u4E00\u89A7\u3092\u8868\u793A`,this.contextValue="machineItem",this.command={command:"ncCodeHelper.openMachineJson",title:"Open Machine JSON",arguments:[s]})}},ye=class{constructor(t){this.context=t;this._onDidChangeTreeData=new A.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(t){return t}getChildren(t){if(t)return[];let n=te(this.context),i=[];return X.existsSync(n)&&X.readdirSync(n).filter(c=>c.endsWith(".json")).forEach(c=>{let s=me.basename(c,".json");i.push(new fe(s,A.TreeItemCollapsibleState.None,void 0,void 0,s,!1))}),i.push(new fe("\u65B0\u898F\u8A2D\u5099\u3092\u8FFD\u52A0...",A.TreeItemCollapsibleState.None,void 0,void 0,void 0,!0)),i}},Se=class{constructor(t){this.context=t;this._onDidChangeTreeData=new A.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(t){return t}getChildren(t){if(t)return[];let n=A.workspace.getConfiguration("ncCodeHelper");return J.map(i=>{let o=n.get(i.key,!0);return new fe(i.label,A.TreeItemCollapsibleState.None,i,o)})}};function Ie(e){let t=new ye(e),n=new Se(e),i=A.window.createTreeView("ncCodeHelperMachinesView",{treeDataProvider:t,showCollapseAll:!1});e.subscriptions.push(i),e.subscriptions.push(i.onDidChangeCheckboxState(async c=>{let s=e.globalState.get("selectedMachines",[]);for(let[l,r]of c.items)l.machineName&&(r===A.TreeItemCheckboxState.Checked?s.includes(l.machineName)||s.push(l.machineName):s=s.filter(p=>p!==l.machineName));await e.globalState.update("selectedMachines",s),t.refresh()}));let o=A.window.createTreeView("ncCodeHelperCategoryView",{treeDataProvider:n,showCollapseAll:!1});return e.subscriptions.push(o),e.subscriptions.push(o.onDidChangeCheckboxState(async c=>{let s=A.workspace.getConfiguration("ncCodeHelper");for(let[l,r]of c.items)if(l.category){let p=r===A.TreeItemCheckboxState.Checked;await s.update(l.category.key,p,A.ConfigurationTarget.Global)}})),{machineDataProvider:t,colorDataProvider:n}}var B=_(require("vscode"));function Le(e){let t=B.languages.registerDocumentSymbolProvider({language:"gcode"},{provideDocumentSymbols(n){let i=n.getText(),o=/^([Oo]\d+|[Nn]\d+)(.*)/gm,c=[],s;for(;(s=o.exec(i))!==null;){let p=s[1],d=s[2].trim(),a=n.lineAt(n.positionAt(s.index).line),m=p.toUpperCase().startsWith("O"),h=d?`${p} ${d}`:p;c.push({name:h,isO:m,lineIndex:a.lineNumber,lineRange:a.range})}let l=[],r=null;for(let p=0;p<c.length;p++){let d=c[p],a=n.lineCount-1;p+1<c.length&&(a=c[p+1].lineIndex-1,a<d.lineIndex&&(a=d.lineIndex));let m=d.lineRange.start,h=n.lineAt(a).range.end,f=new B.Range(m,h),v=new B.DocumentSymbol(d.name,"NC Block",d.isO?B.SymbolKind.Class:B.SymbolKind.Method,f,d.lineRange);d.isO?(l.push(v),r=v):r?(r.children||(r.children=[]),r.children.push(v),v.range.end.isAfter(r.range.end)&&(r.range=new B.Range(r.range.start,v.range.end))):l.push(v)}return l}});e.subscriptions.push(t)}var Y=_(require("vscode"));var Te,Me;function Ue(e){Me=e,Te=Y.window.createTextEditorDecorationType({color:"#808080"}),e.subscriptions.push(Te),De()}function De(){let e=Y.workspace.getConfiguration("ncCodeHelper");J.forEach(t=>{t.decorationType&&t.decorationType.dispose();let n=e.get(t.colorKey,t.defaultColor);t.decorationType=Y.window.createTextEditorDecorationType({color:n}),Me&&Me.subscriptions.push(t.decorationType)})}function se(){let e=Y.window.activeTextEditor;if(!(!e||e.document.languageId.toLowerCase()!=="gcode"))try{let t=Y.workspace.getConfiguration("ncCodeHelper"),n=e.document.getText(),i=[],o=/\(.*?\)/g,c;for(;(c=o.exec(n))!==null;){let a=e.document.positionAt(c.index),m=e.document.positionAt(c.index+c[0].length);i.push(new Y.Range(a,m))}let s=a=>i.some(m=>m.contains(a)),l=[...i],r=new Map(J.map(a=>[a,[]])),p=J.find(a=>a.key==="enableMacroColor"),d=[];if(p){let a;for(p.regex.lastIndex=0;(a=p.regex.exec(n))!==null;)d.push({start:a.index,end:a.index+a[0].length})}J.forEach(a=>{var f;let m=t.get(a.key,!0),h;for(a.regex.lastIndex=0;(h=a.regex.exec(n))!==null;){let v=h.index,C=v+h[0].length;if(a!==p&&d.some(D=>v<D.end&&D.start<C))continue;let x=new Y.Range(e.document.positionAt(v),e.document.positionAt(C));s(x)||(m?(f=r.get(a))==null||f.push(x):l.push(x))}}),J.forEach(a=>{if(a.decorationType){let m=t.get(a.key,!0);e.setDecorations(a.decorationType,m?r.get(a)??[]:[])}}),e.setDecorations(Te,l)}catch(t){console.error("[NC Code Helper] Failed to update NC decorations.",t)}}var z=_(require("vscode")),_e=_(require("path")),xe=_(require("fs"));function Q(e,t){let n=0,i=()=>{for(;/\s/.test(e[n]??"");)n++},o=()=>{i();let r=e[n];if(r==="+"||r==="-"){n++;let a=o();return a===void 0?void 0:r==="-"?-a:a}if(r==="["||r==="("){let a=r==="["?"]":")";n++;let m=s();return i(),e[n]!==a?void 0:(n++,m)}let p=e.slice(n).match(/^#(\d+)/);if(p)return n+=p[0].length,t.get(Number(p[1]));let d=e.slice(n).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?/);if(d)return n+=d[0].length,Number(d[0])},c=()=>{let r=o();if(r!==void 0)for(;;){i();let p=e[n];if(p!=="*"&&p!=="/")return r;n++;let d=o();if(d===void 0)return;r=p==="*"?r*d:r/d}},s=()=>{let r=c();if(r!==void 0)for(;;){i();let p=e[n];if(p!=="+"&&p!=="-")return r;n++;let d=c();if(d===void 0)return;r=p==="+"?r+d:r-d}},l=s();return i(),l!==void 0&&n===e.length&&Number.isFinite(l)?l:void 0}function ue(e,t){return String(Q(e,t)??e)}function ie(e){return e.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0]}function be(e){return/(?<![A-Z])G0*65(?![\d.])/i.test(ie(e))}function ae(e,t){return ie(e).replace(/#(\d+)\s*=\s*(\[[^\]]*\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,(i,o,c)=>{let s=Q(c,t);return s!==void 0&&t.set(Number(o),s)," "})}function nt(e){let t=e.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0];return/(?:^|\s)O\d{3,5}(?=\s|$)/i.test(t)}function Ze(e){let t=z.languages.registerHoverProvider(["gcode","nc"],{provideHover(n,i,o){let c=n.lineAt(i.line).text,s=i.character,l=/M\d+/gi,r;for(;(r=l.exec(c))!==null;){let d=r.index,a=d+r[0].length;if(s>=d&&s<a){let m=r[0].toUpperCase(),h=new z.Range(new z.Position(i.line,d),new z.Position(i.line,a)),f=m.match(/^M(\d+)$/i),v=[m];if(f){let $=parseInt(f[1],10);for(let N of[`M${$.toString()}`,`M${$.toString().padStart(2,"0")}`])v.includes(N)||v.push(N)}let C=e.globalState.get("activeMachine","sample"),x=te(e),D=[],w=_e.join(x,`${C}.json`);if(xe.existsSync(w))try{let $=xe.readFileSync(w,"utf8"),N=JSON.parse($),P=N.mCodes;if(P&&typeof P=="object"){let j=Object.entries(P);for(let I of v){let T=j.find(([E])=>E.toUpperCase()===I);if(T&&typeof T[1]=="string"&&T[1].length>0){D.push(`**${N.machine||C}**: ${T[1]}`);break}}}}catch($){console.error(`Failed to read M-code definitions from ${w}:`,$)}if(D.length>0){let $=new z.MarkdownString;return $.appendMarkdown(`**${m}**

`),$.appendMarkdown(D.join(`

`)),new z.Hover($,h)}}}let p=n.getWordRangeAtPosition(i,/#\d+/);if(p){let d=n.getText(p),a=i.line,m=0;for(let x=a;x>=0;x--){let D=n.lineAt(x).text;if(nt(D)){m=x;break}}let h,f,v=new Map;for(let x=m;x<=a;x++){let D=n.lineAt(x).text,w=D.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0];ae(D,v);let $=w.match(new RegExp(`${d.replace("#","\\#")}\\s*=\\s*(.+)`,"i"));$&&(h=$[1].trim(),f=x+1)}let C=new z.MarkdownString;if(C.appendMarkdown(`**\u30DE\u30AF\u30ED\u5909\u6570** ${d}

`),h!==void 0&&f!==void 0){let x=v.get(Number(d.slice(1))),D=x===void 0?h:String(x);C.appendMarkdown(`**\u5024**: \`${D}\` *(L${f} \u884C\u76EE\u3067\u8A2D\u5B9A)*`)}else C.appendMarkdown("*NULL*");return new z.Hover(C,p)}}});e.subscriptions.push(t)}var H=_(require("vscode")),ne=_(require("path")),V=_(require("fs"));function ze(e,t,n){let i=H.commands.registerCommand("ncCodeHelper.openMachineJson",async s=>{let l="";if(typeof s=="string"?l=s:s&&typeof s=="object"&&(l=s.machineName||s.label||""),!l){H.window.showErrorMessage("\u8A2D\u5099\u540D\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return}let r=te(e),p=ne.join(r,`${l}.json`);if(!V.existsSync(p)){H.window.showErrorMessage(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093: ${p}`);return}try{let d=V.readFileSync(p,"utf8"),a=JSON.parse(d);await e.globalState.update("activeMachine",l),await H.commands.executeCommand("ncCodeHelperMachineDetailView.focus"),n.updateMachineData(a,l)}catch(d){H.window.showErrorMessage(`JSON\u30D5\u30A1\u30A4\u30EB\u306E\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC: ${d}`)}}),o=H.commands.registerCommand("ncCodeHelper.addMachineJson",async()=>{let s=await H.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,openLabel:"\u8A2D\u5099JSON\u3068\u3057\u3066\u8FFD\u52A0",filters:{"JSON Files":["json"]}});if(!s||s.length===0)return;let l=s[0],r=ne.basename(l.fsPath),p=ne.parse(r).name,d=te(e);V.existsSync(d)||V.mkdirSync(d,{recursive:!0});let a=ne.join(d,r);V.existsSync(a)&&await H.window.showWarningMessage(`\u300C${r}\u300D\u306F\u65E2\u306B\u5B58\u5728\u3057\u307E\u3059\u3002\u4E0A\u66F8\u304D\u3057\u307E\u3059\u304B\uFF1F`,"\u4E0A\u66F8\u304D","\u30AD\u30E3\u30F3\u30BB\u30EB")!=="\u4E0A\u66F8\u304D"||(V.copyFileSync(l.fsPath,a),H.window.showInformationMessage(`\u8A2D\u5099\u300C${p}\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002`),t.refresh(),await H.commands.executeCommand("ncCodeHelper.openMachineJson",p))}),c=H.commands.registerCommand("ncCodeHelper.openStorageFolder",async()=>{let s=te(e);V.existsSync(s)||V.mkdirSync(s,{recursive:!0});let l=H.Uri.file(s);await H.env.openExternal(l)});e.subscriptions.push(i,o,c)}var b=_(require("vscode"));function q(e){if(e.languageId==="gcode"||e.languageId==="nc")return!0;let t=[".nc",".gcode",".nd1",".all"],n=e.fileName.toLowerCase();if(t.some(s=>n.endsWith(s)))return!0;let i=e.getText();if(!i.trim())return!1;let o=[/%/,/(?:^|\s|[;])O\d{4,5}(?:\b|$)/im,/(?:^|[^A-Za-z0-9_])G0?[0-3](?=[A-Za-z0-9]|$)/i,/(?:^|[^A-Za-z0-9_])M0?[123689](?=[A-Za-z0-9]|$)/i,/(?:^|[^A-Za-z0-9_])G43\s*H\d+/i,/(?:^|\s)N\d+(?:\b|$)/im,/#\d{3,}\s*=/],c=0;for(let s of o)if(s.test(i)&&(c++,c>=2))return!0;return!1}var ge={coordinateSystem:"\u672A\u691C\u51FA",axisA:"\u672A\u691C\u51FA",axisB:"\u672A\u691C\u51FA",axisC:"\u672A\u691C\u51FA",axisX:"\u672A\u691C\u51FA",axisY:"\u672A\u691C\u51FA",axisZ:"\u672A\u691C\u51FA",spindleTool:"\u672A\u691C\u51FA",toolLengthOffset:"\u672A\u691C\u51FA",toolDiameterOffset:"\u672A\u691C\u51FA",magazineTool:"\u672A\u691C\u51FA",feedrate:"\u672A\u691C\u51FA",feedrateUnit:"mm/min",spindleSpeed:"\u672A\u691C\u51FA"};function $e(e){return/^[+-]?\d+$/.test(e)?`${e}.0`:e}function ot(e,t){let n=ie(e);if(!(/^\s*IF\s*\[.*\]\s*THEN\b/i.test(n)&&/#\d+\s*=/.test(n)))return!1;let o=/^\s*IF\s*\[\s*(.*?)\s*\]\s*THEN\s*#(\d+)\s*=\s*(.*?)\s*$/i.exec(n),c=o&&/^\s*(.*?)\s*(EQ|NE|GT|LT|GE|LE)\s*(.*?)\s*$/i.exec(o[1]);if(!o||!c)return!0;let s=Q(c[1],t),l=Q(c[3],t),r=Q(o[3],t);return s===void 0||l===void 0||r===void 0||(()=>{switch(c[2].toUpperCase()){case"EQ":return s===l;case"NE":return s!==l;case"GT":return s>l;case"LT":return s<l;case"GE":return s>=l;case"LE":return s<=l;default:return!1}})()&&t.set(Number(o[2]),r),!0}function Ee(e,t,n){var c,s;let i=Number((c=e.match(/^T(\d+)$/i))==null?void 0:c[1]),o=Number((s=t.match(new RegExp(`^${n}(\\d+)$`,"i")))==null?void 0:s[1]);return Number.isFinite(i)&&Number.isFinite(o)&&i!==o}var re=class{constructor(t){this._extensionUri=t;this._programState={...ge}}resolveWebviewView(t,n,i){this._view=t,t.webview.options={enableScripts:!0,localResourceRoots:[this._extensionUri]},t.webview.html=this._getInitialHtml()}updateProgramState(t){try{this._programState=t&&q(t.document)?this.getProgramState(t.document,t.selection.active):{...ge}}catch(n){console.error("[NC Code Helper] Failed to parse the active program state.",n),this._programState={...ge}}this._view&&this._view.webview.postMessage({type:"programState",state:this._programState}).then(void 0,n=>console.error("[NC Code Helper] Failed to send program state to the webview.",n))}updateMachineData(t,n){if(!this._view)return;let i=typeof n=="string"?n:(n==null?void 0:n.machineName)||(n==null?void 0:n.label)||"Unknown",o="";if(t&&t.mCodes&&typeof t.mCodes=="object")for(let[l,r]of Object.entries(t.mCodes))o+=`
                    <tr>
                        <td class="code">${l}</td>
                        <td class="desc">${r}</td>
                    </tr>
                `;else o='<tr><td colspan="2">M\u30B3\u30FC\u30C9\u5B9A\u7FA9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093</td></tr>';let c=t&&typeof t.machine=="string"?t.machine:i,s=t&&typeof t.description=="string"?t.description:"";this._view.webview.html=`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        margin: 0;
                        padding: 10px 15px;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-backgroundColor);
                    }
                    h1 {
                        font-size: 1.1em;
                        margin-top: 0;
                        margin-bottom: 4px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 4px;
                    }
                    p.desc {
                        color: var(--vscode-descriptionForeground);
                        margin: 0 0 10px;
                        font-size: 0.9em;
                    }
                    html, body {
                        height: 100%;
                    }
                    body {
                        display: flex;
                        min-height: 0;
                    }
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                    }
                    .definitions {
                        min-width: 0;
                        min-height: 0;
                        padding-right: 12px;
                        overflow-y: auto;
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 0 0 10px 16px;
                        min-width: 0;
                        min-height: 0;
                        overflow-y: auto;
                    }
                    .program-state .state-row {
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        column-gap: 10px;
                        margin: 0 0 8px;
                    }
                    .program-state .field {
                        display: grid;
                        grid-template-columns: 6.6em 0.6em minmax(0, 1fr);
                        column-gap: 2px;
                        min-width: 0;
                        margin: 0;
                        font-size: 1em;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        text-align: left;
                        padding: 6px 10px;
                        border-bottom: 1px solid var(--vscode-widget-border);
                        font-size: 0.9em;
                    }
                    th {
                        background-color: var(--vscode-editor-lineHighlightBackground);
                        font-weight: bold;
                    }
                    tr:hover {
                        background-color: var(--vscode-list-hoverBackground);
                    }
                    td.code {
                        font-family: var(--vscode-editor-font-family);
                        font-weight: bold;
                        color: var(--vscode-symbolIcon-keywordForeground, #4ec9b0);
                        width: 100px;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <section class="definitions">
                        <h1>\u8A2D\u5099: ${c}</h1>
                        ${s?`<p class="desc">${s}</p>`:""}
                        <table>
                            <thead>
                                <tr>
                                    <th>M\u30B3\u30FC\u30C9</th>
                                    <th>\u8AAC\u660E</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${o}
                            </tbody>
                        </table>
                    </section>
                    <section class="program-state" aria-label="\u30AB\u30FC\u30BD\u30EB\u4F4D\u7F6E\u306E\u30D7\u30ED\u30B0\u30E9\u30E0\u72B6\u614B">
                        <h1>\u52A0\u5DE5\u6761\u4EF6\u30C7\u30FC\u30BF</h1>
                        <div class="state-row">
                            <p class="field"><span>\u4F7F\u7528\u5EA7\u6A19\u7CFB</span><span>\uFF1A</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u56DE\u8EE2\u8EF8">
                            <p class="field"><span>\u56DE\u8EE2\u8EF8A</span><span>\uFF1A</span><span data-state="axisA">${this._programState.axisA}</span></p>
                            <p class="field"><span>\u56DE\u8EE2\u8EF8B</span><span>\uFF1A</span><span data-state="axisB">${this._programState.axisB}</span></p>
                            <p class="field"><span>\u56DE\u8EE2\u8EF8C</span><span>\uFF1A</span><span data-state="axisC">${this._programState.axisC}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u76F4\u7DDA\u8EF8">
                            <p class="field"><span>\u76F4\u7DDA\u8EF8X</span><span>\uFF1A</span><span data-state="axisX">${this._programState.axisX}</span></p>
                            <p class="field"><span>\u76F4\u7DDA\u8EF8Y</span><span>\uFF1A</span><span data-state="axisY">${this._programState.axisY}</span></p>
                            <p class="field"><span>\u76F4\u7DDA\u8EF8Z</span><span>\uFF1A</span><span data-state="axisZ">${this._programState.axisZ}</span></p>
                        </div>
                        <div class="state-row">
                            <p class="field"><span>\u4F7F\u7528\u5DE5\u5177</span><span>\uFF1A</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u5DE5\u5177\u88DC\u6B63">
                            <p class="field"><span>\u5DE5\u5177\u9577\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                            <p class="field"><span>\u5DE5\u5177\u5F84\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        </div>
                        <div class="state-row">
                            <p class="field"><span>\u5F85\u6A5F\u5DE5\u5177</span><span>\uFF1A</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u56DE\u8EE2\u30FB\u9001\u308A">
                            <p class="field"><span>\u56DE\u8EE2\u6570S</span><span>\uFF1A</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min\u207B\xB9</span></p>
                            <p class="field"><span>\u9001\u308A\u901F\u5EA6F</span><span>\uFF1A</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        </div>
                    </section>
                </div>
                <script>
                    window.addEventListener('message', event => {
                        if (event.data.type !== 'programState') return;
                        for (const [key, value] of Object.entries(event.data.state)) {
                            const element = document.querySelector('[data-state="' + key + '"]');
                            if (element) element.textContent = value;
                        }
                    });
                </script>
            </body>
            </html>
        `}getProgramState(t,n){return this.getProgramStates(t,n.line)[n.line]??{...ge}}getProgramStates(t,n=t.lineCount-1){let i={...ge},o=[],c,s,l,r,p,d,a,m,h,f,v=!1,C,x=!1,D=!1,w,$=!1,N=new Map;for(let P=0;P<=n;P++){let I=t.lineAt(P).text;/(?:^|[^A-Z])O\d+/i.test(I.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0])&&N.clear();let T=ot(I,N),E=be(I)||T?"":ae(I,N),M=/(?<![A-Z])([GMTFHSDPABCXYZ])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,y;for(;(y=M.exec(E))!==null;){let R=y[1].toUpperCase(),g=y[2],S=ue(g,N);switch(R){case"G":if(/^94(?:\.0)?$/i.test(g))i.feedrateUnit="mm/min";else if(/^95(?:\.0)?$/i.test(g))i.feedrateUnit="mm/rev";else if(/^5[4-9](?:\.0)?$/i.test(g)||/^54\.1$/i.test(g))i.coordinateSystem=`G${g}`,f=void 0;else if(/^4[34](?:\.0)?$/i.test(g)){v=!0,x=!1;let k=E.match(/(?<![A-Z])H(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);k&&(C=`H${ue(k[1],N)}`)}else if(/^49(?:\.0)?$/i.test(g))v=!1,C=void 0,x=!0;else if(/^41(?:\.0)?$/i.test(g)){D=!0,$=!1;let k=E.match(/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);k&&(w=`D${ue(k[1],N)}`)}else if(/^42(?:\.0)?$/i.test(g)){D=!0,$=!1;let k=E.match(/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);k&&(w=`D${ue(k[1],N)}`)}else/^40(?:\.0)?$/i.test(g)&&(D=!1,w=void 0,$=!0);break;case"P":i.coordinateSystem==="G54.1"&&(f=`P${S}`);break;case"T":a=`T${S}`,h=a;break;case"M":Number(S)===6&&a&&(h=m,m=a,a=void 0);break;case"H":v&&(C=`H${S}`);break;case"D":D&&(w=`D${S}`);break;case"F":i.feedrate=S;break;case"S":i.spindleSpeed=S;break;case"A":c=S;break;case"B":s=S;break;case"C":l=S;break;case"X":r=$e(S);break;case"Y":p=$e(S);break;case"Z":d=$e(S);break}}o.push({...i,axisA:c??"\u672A\u691C\u51FA",axisB:s??"\u672A\u691C\u51FA",axisC:l??"\u672A\u691C\u51FA",axisX:r??"\u672A\u691C\u51FA",axisY:p??"\u672A\u691C\u51FA",axisZ:d??"\u672A\u691C\u51FA",coordinateSystem:f?`${i.coordinateSystem} ${f}`:i.coordinateSystem,spindleTool:m??"\u672A\u691C\u51FA",magazineTool:h??"\u672A\u691C\u51FA",toolLengthOffset:v?C??"\u672A\u691C\u51FA":x?"\u306A\u3057":"\u672A\u691C\u51FA",toolDiameterOffset:D?w??"\u672A\u691C\u51FA":$?"\u306A\u3057":"\u672A\u691C\u51FA"})}return o}_getInitialHtml(){return`
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        margin: 0;
                        padding: 10px 15px;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-backgroundColor);
                        font-family: var(--vscode-font-family);
                    }
                    html, body {
                        height: 100%;
                    }
                    body {
                        display: flex;
                        min-height: 0;
                    }
                    h1 {
                        font-size: 1.1em;
                        margin-top: 0;
                        margin-bottom: 4px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                        padding-bottom: 4px;
                    }
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                    }
                    .message {
                        color: var(--vscode-descriptionForeground);
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 0 0 10px 16px;
                    }
                    .program-state .state-row {
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        column-gap: 10px;
                        margin: 0 0 8px;
                    }
                    .program-state .field {
                        display: grid;
                        grid-template-columns: 6.6em 0.6em minmax(0, 1fr);
                        column-gap: 2px;
                        min-width: 0;
                        margin: 0;
                        font-size: 1em;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <section class="message">
                        <p>\u8A2D\u5099\u3092\u9078\u629E\u3059\u308B\u3068 M\u30B3\u30FC\u30C9\u4E00\u89A7\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002</p>
                    </section>
                    <section class="program-state" aria-label="\u30AB\u30FC\u30BD\u30EB\u4F4D\u7F6E\u306E\u30D7\u30ED\u30B0\u30E9\u30E0\u72B6\u614B">
                        <h1>\u52A0\u5DE5\u6761\u4EF6\u30C7\u30FC\u30BF</h1>
                        <div class="state-row">
                            <p class="field"><span>\u4F7F\u7528\u5EA7\u6A19\u7CFB</span><span>\uFF1A</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u56DE\u8EE2\u8EF8">
                            <p class="field"><span>\u56DE\u8EE2\u8EF8A</span><span>\uFF1A</span><span data-state="axisA">${this._programState.axisA}</span></p>
                            <p class="field"><span>\u56DE\u8EE2\u8EF8B</span><span>\uFF1A</span><span data-state="axisB">${this._programState.axisB}</span></p>
                            <p class="field"><span>\u56DE\u8EE2\u8EF8C</span><span>\uFF1A</span><span data-state="axisC">${this._programState.axisC}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u76F4\u7DDA\u8EF8">
                            <p class="field"><span>\u76F4\u7DDA\u8EF8X</span><span>\uFF1A</span><span data-state="axisX">${this._programState.axisX}</span></p>
                            <p class="field"><span>\u76F4\u7DDA\u8EF8Y</span><span>\uFF1A</span><span data-state="axisY">${this._programState.axisY}</span></p>
                            <p class="field"><span>\u76F4\u7DDA\u8EF8Z</span><span>\uFF1A</span><span data-state="axisZ">${this._programState.axisZ}</span></p>
                        </div>
                        <div class="state-row">
                            <p class="field"><span>\u4F7F\u7528\u5DE5\u5177</span><span>\uFF1A</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u5DE5\u5177\u88DC\u6B63">
                            <p class="field"><span>\u5DE5\u5177\u9577\u88DC\u6B63H</span><span>\uFF1A</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                            <p class="field"><span>\u5DE5\u5177\u5F84\u88DC\u6B63D</span><span>\uFF1A</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        </div>
                        <div class="state-row">
                            <p class="field"><span>\u5F85\u6A5F\u5DE5\u5177</span><span>\uFF1A</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        </div>
                        <div class="state-row" aria-label="\u56DE\u8EE2\u30FB\u9001\u308A">
                            <p class="field"><span>\u56DE\u8EE2\u6570S</span><span>\uFF1A</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min\u207B\xB9</span></p>
                            <p class="field"><span>\u9001\u308A\u901F\u5EA6F</span><span>\uFF1A</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        </div>
                    </section>
                </div>
                <script>
                    window.addEventListener('message', event => {
                        if (event.data.type !== 'programState') return;
                        for (const [key, value] of Object.entries(event.data.state)) {
                            const element = document.querySelector('[data-state="' + key + '"]');
                            if (element) element.textContent = value;
                        }
                    });
                </script>
            </body>
            </html>
        `}};re.viewType="ncCodeHelperMachineDetailView";function Ge(e,t){let n=b.languages.createDiagnosticCollection("ncCodeChecks");e.subscriptions.push(n),b.window.activeTextEditor&&Ae(b.window.activeTextEditor.document,n,t),e.subscriptions.push(b.window.onDidChangeActiveTextEditor(i=>{i&&Ae(i.document,n,t)}),b.workspace.onDidChangeTextDocument(i=>{Ae(i.document,n,t)}),b.workspace.onDidCloseTextDocument(i=>{n.delete(i.uri)}))}function Ae(e,t,n){if(!q(e)){t.delete(e.uri);return}let i=[],o=n.getProgramStates(e),c=!1,s=!1,l=!1,r=!1,p=!1,d=!1,a=null;for(let m=0;m<e.lineCount;m++){let h=e.lineAt(m),f=h.text.replace(/\([^)]*(?:\)|$)/g,T=>" ".repeat(T.length)).split(";",1)[0];/(?<![A-Z])M0?6(?!\d)/i.test(f)&&(l=!0,r=!1,p=!1,d=!1,a=null),/(?<![A-Z])G40(?![0-9.]|$)/i.test(f)&&(a=null);let v=/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.exec(f);v&&(a=v[0]);let C=/(?<![A-Z])F(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(f),x=/(?<![A-Z])S(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(f);r||=C,p||=x;let D=/(?<![A-Z])G(?:0?[123]|73|81|83|84|85)(?![\d.])/i.test(f);if(l&&D&&!d){d=!0;let T=[...r?[]:["\u3010\u8B66\u544A\u3011\u9001\u308A\u901F\u5EA6\uFF1AF\u304C\u6307\u4EE4\u3055\u308C\u3066\u3044\u307E\u305B\u3093"],...p?[]:["\u3010\u8B66\u544A\u3011\u4E3B\u8EF8\u56DE\u8EE2\u6570\uFF1AS\u304C\u6307\u4EE4\u3055\u308C\u3066\u3044\u307E\u305B\u3093"]];for(let E of T){let M=new b.Diagnostic(new b.Range(new b.Position(m,0),new b.Position(m,h.text.length)),E,b.DiagnosticSeverity.Warning);M.source="NC Code Helper",i.push(M)}}for(let T of f.matchAll(/([ABCXYZ])([^A-Z\s]*)/gi)){if(T.index===void 0||/[A-Z]/i.test(f[T.index-1]??""))continue;let E=T.index+T[1].length,M=T[2],y=T.index+T[0].length;if(f[E]==="["){let S=f.indexOf("]",E+1);S!==-1&&(M=f.slice(E,S+1),y=S+1)}if(/^#\d+$/.test(M)||/^\[[^\]]+\]$/.test(M))continue;let R=new b.Range(new b.Position(m,T.index),new b.Position(m,y));if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(M)||!Number.isFinite(Number(M))){let S=new b.Diagnostic(R,`\u3010\u30A8\u30E9\u30FC\u3011${T[1].toUpperCase()} \u306E\u5024\u300C${M}\u300D\u3092\u6570\u5024\u3068\u3057\u3066\u8A8D\u8B58\u3067\u304D\u307E\u305B\u3093\u3002`,b.DiagnosticSeverity.Error);S.source="NC Code Helper",i.push(S);continue}if(Number(M)!==0&&!M.includes(".")){let S=new b.Diagnostic(R,`\u3010\u6CE8\u610F\u3011${T[1].toUpperCase()} \u306E\u5024\u300C${M}\u300D\u306B\u5C0F\u6570\u70B9\u304C\u3042\u308A\u307E\u305B\u3093\u3002`,b.DiagnosticSeverity.Warning);S.source="NC Code Helper",i.push(S)}}let w=o[m],$=/(?<![A-Z])G4[34](?:\.0)?(?=[^0-9.]|$)/i.exec(f);if($&&!/(?<![A-Z])H(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(f)&&w.spindleTool&&w.spindleTool!=="\u672A\u691C\u51FA"){let E=w.spindleTool.toUpperCase().startsWith("T")?w.spindleTool.replace(/^T/i,"H"):"H",M=$.index,y=M+$[0].length,R=new b.Range(new b.Position(m,M),new b.Position(m,y)),g=new b.Diagnostic(R,`\u3010\u6CE8\u610F\u3011\u5DE5\u5177\u9577\u88DC\u6B63 (${E}) \u3092\u6307\u4EE4\u3057\u3066\u3044\u307E\u305B\u3093\u3002`,b.DiagnosticSeverity.Warning);g.source="NC Code Helper",i.push(g)}let N=/(?<![A-Z])G4[12](?:\.0)?(?=[^0-9.]|$)/i.exec(f);if(N&&!/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(f)&&!a&&w.spindleTool&&w.spindleTool!=="\u672A\u691C\u51FA"){let E=w.spindleTool.toUpperCase().startsWith("T")?w.spindleTool.replace(/^T/i,"D"):"D",M=N.index,y=M+N[0].length,R=new b.Range(new b.Position(m,M),new b.Position(m,y)),g=new b.Diagnostic(R,`\u3010\u6CE8\u610F\u3011\u5DE5\u5177\u5F84\u88DC\u6B63 (${E}) \u3092\u6307\u4EE4\u3057\u3066\u3044\u307E\u305B\u3093\u3002`,b.DiagnosticSeverity.Warning);g.source="NC Code Helper",i.push(g)}let P=Ee(w.spindleTool,w.toolLengthOffset,"H"),j=Ee(w.spindleTool,w.toolDiameterOffset,"D"),I=(T,E,M,y,R,g)=>{if(!y)return;let S=new RegExp(`(?<![A-Z])${T}(?:\\[[^\\]]+\\]|#[0-9]+|[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))`,"i").exec(f);if(!S&&!g.test(f))return;let k=S;if(!k)return;let L=k.index,K=L+k[0].length,F=new b.Range(new b.Position(m,L),new b.Position(m,K)),U=new b.Diagnostic(F,`\u3010\u6CE8\u610F\u3011\u4F7F\u7528\u5DE5\u5177\u3068${E} (${M}) \u304C\u4E00\u81F4\u3057\u3066\u3044\u307E\u305B\u3093\u3002`,b.DiagnosticSeverity.Warning);U.source="NC Code Helper",i.push(U)};I("H","\u5DE5\u5177\u9577\u88DC\u6B63",w.toolLengthOffset,P,c,/(?<![A-Z])G4[34](?:\.0)?(?=[^0-9.]|$)/i),I("D","\u5DE5\u5177\u5F84\u88DC\u6B63",w.toolDiameterOffset,j,s,/(?<![A-Z])G4[12](?:\.0)?(?=[^0-9.]|$)/i),c=P,s=j}t.set(e.uri,i)}var G=_(require("vscode"));var st=/(?<![A-Z])([A-Z])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi;function ke(e,t){return t?"\u2014":e>=60?`${Math.floor(e/60)}\u5206${(e%60).toFixed(1)}\u79D2`:`${e.toFixed(1)}\u79D2`}function it(e,t,n,i,o,c){let s={17:["x","y","z"],18:["z","x","y"],19:["y","z","x"]},l={17:["I","J"],18:["K","I"],19:["J","K"]},r=s[i],p=l[i];if(!r||!p)return;let[d,a,m]=r,h=n.get(p[0]),f=n.get(p[1]),v=n.get("R"),C,x;if(h!==void 0||f!==void 0)C=e[d]+(h??0)*c,x=e[a]+(f??0)*c;else if(v!==void 0){let I=t[d]-e[d],T=t[a]-e[a],E=Math.hypot(I,T),M=Math.abs(v*c);if(E===0||E>2*M)return;let y=(e[d]+t[d])/2,R=(e[a]+t[a])/2,g=Math.sqrt(Math.max(0,M*M-E*E/4)),S=-T/E,k=I/E,L=[{x:y+S*g,y:R+k*g},{x:y-S*g,y:R-k*g}],K=u=>{let ce=Math.atan2(e.y-u.y,e.x-u.x),Z=Math.atan2(t.y-u.y,t.x-u.x)-ce;return o&&Z>=0&&(Z-=2*Math.PI),!o&&Z<=0&&(Z+=2*Math.PI),Z},F=v<0,U=L.find(u=>Math.abs(K(u))>Math.PI===F)??L[0];C=U.x,x=U.y}else return;let D=Math.hypot(e[d]-C,e[a]-x),w=Math.hypot(t[d]-C,t[a]-x);if(D===0||!Number.isFinite(D)||!Number.isFinite(w))return;let $=Math.atan2(e[a]-x,e[d]-C),P=Math.atan2(t[a]-x,t[d]-C)-$;o&&P>=0&&(P-=2*Math.PI),!o&&P<=0&&(P+=2*Math.PI),e[d]===t[d]&&e[a]===t[a]&&(h!==void 0||f!==void 0)&&(P=o?-2*Math.PI:2*Math.PI);let j=Math.abs(P)*(D+w)/2;return Math.hypot(j,t[m]-e[m])}function ee(e,t,n,i,o,c,s,l){if(!e||t<=0)return;let r=i===void 0?void 0:i*s*(o?c!==void 0?c:Number.NaN:1),p=n?l:r;if(p===void 0||p<=0||!Number.isFinite(p)){n?e.rapidUnknown=!0:e.cuttingUnknown=!0;return}let d=t/p*60;n?e.rapidSeconds+=d:e.cuttingSeconds+=d,e.totalSeconds+=d}function Pe(e,t,n,i){return t===void 0?e:n?t*i:e+t*i}function at(e){let n=G.workspace.getConfiguration("ncCodeHelper").get("rapidTraverseRate",1e4),i=[],o,c={x:0,y:0,z:0},s=0,l=17,r=!0,p=!0,d=!1,a,m,h,f,v=98,C,x,D,w,$=1,N=new Map;for(let P=0;P<e.lineCount;P++){let j=e.lineAt(P).text,I=be(j),T=I?ie(j):ae(j,N),E=/[Nn]\d+/g,M;for(;(M=E.exec(T))!==null;)o={line:P,character:M.index+M[0].length,rapidSeconds:0,cuttingSeconds:0,totalSeconds:0,rapidUnknown:!1,cuttingUnknown:!1,diameterCompensation:void 0},i.push(o);if(I)continue;let y=new Map,R;for(;(R=st.exec(T))!==null;){let F=R[1].toUpperCase(),U=R[2],u=Q(U,N);u===void 0||!Number.isFinite(u)||(y.set(F,u),F==="G"?u>=0&&u<=3?s=u:u===20?p=!1:u===21?p=!0:u===90?r=!0:u===91?r=!1:u===94?d=!1:u===95?d=!0:u===17||u===18||u===19?l=u:[73,81,83,84,85].includes(u)?f=u:u===80?f=void 0:u===98||u===99?v=u:u===40?h=void 0:(u===41||u===42)&&(h=`G${u} ${y.has("D")?`D${y.get("D")}`:"D\u756A\u53F7\u672A\u6307\u5B9A"}`):F==="F"?a=u:F==="S"?m=u:F==="D"&&h&&(h=`${h.split(" ")[0]} D${u}`))}y.has("R")&&(C=y.get("R")),y.has("Z")&&(x=y.get("Z")),y.has("Q")&&(D=y.get("Q")),y.has("P")&&(w=y.get("P")),$=Math.max(1,Math.floor(y.get("K")??1)),h&&o&&s!==0&&(o.diameterCompensation=h);let g=p?1:25.4,S=["X","Y","Z"].some(F=>y.has(F));if(f!==void 0&&S){let F=c,U={x:Pe(c.x,y.get("X"),r,g),y:Pe(c.y,y.get("Y"),r,g),z:c.z};if(C===void 0||x===void 0){o&&(o.cuttingUnknown=!0);continue}let u=Pe(F.z,C,r,g),ce=r?x*g:u+x*g,Ce=v===98?F.z:u,Z=D===void 0?void 0:Math.abs(D*g),he=Math.abs(ce-u),we=(f===73||f===83)&&Z&&Z>0?Math.max(1,Math.ceil(he/Z)):1;(f===73||f===83)&&(!Z||Z<=0)&&o&&(o.cuttingUnknown=!0);for(let Fe=0;Fe<$;Fe++){let de={x:U.x,y:U.y,z:F.z};ee(o,Math.hypot(de.x-c.x,de.y-c.y,de.z-c.z),!0,a,d,m,g,n);let Xe={...de,z:u};if(ee(o,Math.abs(Xe.z-de.z),!0,a,d,m,g,n),(f===73||f===83)&&we>1&&Z){let le=Math.sign(ce-u);for(let pe=0;pe<we;pe++){let He=u+le*Math.min(he,pe*Z),Oe=u+le*Math.min(he,(pe+1)*Z);f===83&&ee(o,Math.abs(He-u),!0,a,d,m,g,n),ee(o,Math.abs(Oe-He),!1,a,d,m,g,n),f===83&&pe<we-1&&ee(o,Math.abs(Oe-u),!0,a,d,m,g,n)}}else ee(o,he,!1,a,d,m,g,n);let Be=f===84||f===85;if(ee(o,Math.abs(ce-Ce),!Be,a,d,m,g,n),w!==void 0&&w>0&&o){let le=w/1e3;o.cuttingSeconds+=le,o.totalSeconds+=le}}c={...U,z:Ce};continue}if(!S||s<0||s>3)continue;let k=c,L={...c};for(let F of["X","Y","Z"]){let U=y.get(F);U!==void 0&&(L[F.toLowerCase()]=r?U*g:c[F.toLowerCase()]+U*g)}let K;s===2||s===3?K=it(k,L,y,l,s===2,g)??Math.hypot(L.x-k.x,L.y-k.y,L.z-k.z):K=Math.hypot(L.x-k.x,L.y-k.y,L.z-k.z),c=L,!(!o||K===0)&&(ee(o,K,s===0,a,d,m,g,n),s!==0&&h&&(o.diameterCompensation=h))}return i}var Ne=class{constructor(){this.changeEmitter=new G.EventEmitter;this.onDidChangeInlayHints=this.changeEmitter.event}provideInlayHints(t,n){return q(t)?at(t).filter(o=>o.line>=n.start.line&&o.line<=n.end.line).map(o=>{let c=`\u65E9\u9001\u308A ${ke(o.rapidSeconds,o.rapidUnknown)} / \u5207\u524A ${ke(o.cuttingSeconds,o.cuttingUnknown)} / \u5408\u8A08 ${ke(o.totalSeconds,o.rapidUnknown||o.cuttingUnknown)}`,s=new G.InlayHint(new G.Position(o.line,t.lineAt(o.line).text.length),c,G.InlayHintKind.Type);return s.paddingLeft=!0,s}):[]}dispose(){this.changeEmitter.dispose()}refresh(){this.changeEmitter.fire()}};function Ve(e){let t=new Ne;e.subscriptions.push(G.languages.registerInlayHintsProvider([{language:"gcode"},{language:"nc"}],t),t,G.workspace.onDidChangeConfiguration(n=>{n.affectsConfiguration("ncCodeHelper.rapidTraverseRate")&&t.refresh()}))}var W=_(require("vscode")),oe=class{constructor(){this._onDidChange=new W.EventEmitter;this.onDidChange=this._onDidChange.event;this.contents=new Map}set(t,n){this.contents.set(t.toString(),n),this._onDidChange.fire(t)}provideTextDocumentContent(t){return this.contents.get(t.toString())??""}};oe.scheme="nc-align-diff";function We(e){let t=new oe;e.subscriptions.push(W.workspace.registerTextDocumentContentProvider(oe.scheme,t));let n=W.commands.registerCommand("ncCodeHelper.alignCncCode",async()=>{let i=W.window.activeTextEditor;if(!i)return;let o=i.selection,c=o.isEmpty?i.document.getText():i.document.getText(o),s=rt(c),l=W.Uri.parse(`${oe.scheme}:original?${Date.now()}`),r=W.Uri.parse(`${oe.scheme}:formatted?${Date.now()}`);t.set(l,c),t.set(r,s),await W.commands.executeCommand("vscode.diff",l,r,"CNC\u30B3\u30FC\u30C9\u6574\u5217\u30D7\u30EC\u30D3\u30E5\u30FC (\u5909\u66F4\u524D \u2194 \u6574\u5217\u5F8C)")});e.subscriptions.push(n)}function rt(e){let t=e.split(/\r?\n/),n=new Map,i=new Set,o=(s,l)=>{for(let r=l+1;r<t.length;r++){let p=t[r].trim();if(new RegExp(`\\bN0*${s}\\b`,"i").test(p)){for(let a=l+1;a<r;a++)i.add(a);return r}}return-1};for(let s=0;s<t.length;s++){let l=t[s].trim(),r=/#(\d+)\s*=\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.exec(l);if(r){n.set(r[1],Number(r[2]));continue}let p=/IF\s*\[\s*#(\d+)\s*(EQ|NE|GT|LT|GE|LE)\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\]\s*GOTO\s*([0-9A-Z]+)/i.exec(l);if(p){let a=p[1],m=p[2].toUpperCase(),h=Number(p[3]),f=p[4],v=n.get(a);if(v===void 0)continue;let C=!1;switch(m){case"EQ":C=v===h;break;case"NE":C=v!==h;break;case"GT":C=v>h;break;case"LT":C=v<h;break;case"GE":C=v>=h;break;case"LE":C=v<=h;break}if(C){let x=o(f,s);x!==-1&&(s=x-1)}continue}let d=/\bGOTO\s*([0-9A-Z]+)/i.exec(l);if(d){let a=o(d[1],s);a!==-1&&(s=a-1)}}let c=[];for(let s=0;s<t.length;s++)i.has(s)||c.push(t[s]);return c.map(s=>{let l=s.trim();return l?(l=l.replace(/\bIF\s*\[/gi,"IF[").replace(/\s*,\s*/g,", "),l):""}).join(`
`)}function je(e){if(!(!e||e.languageId==="gcode"||e.languageId==="nc"))try{q(e)&&O.languages.setTextDocumentLanguage(e,"gcode").then(t=>{let n=O.window.activeTextEditor;(n==null?void 0:n.document)===t&&se()},t=>console.error("[NC Code Helper] Failed to set document language.",t))}catch(t){console.error("[NC Code Helper] Failed to detect or set document language.",t)}}function ct(e){e.subscriptions.push(O.workspace.onDidOpenTextDocument(o=>{je(o)})),O.window.activeTextEditor&&je(O.window.activeTextEditor.document);let{machineDataProvider:t,colorDataProvider:n}=Ie(e),i=new re(e.extensionUri);e.subscriptions.push(O.window.registerWebviewViewProvider(re.viewType,i)),Ue(e),Le(e),Ve(e),Ze(e),ze(e,t,i),Ge(e,i),O.window.onDidChangeActiveTextEditor(o=>{try{i.updateProgramState(o),o&&se()}catch(c){console.error("[NC Code Helper] Failed to update active editor state.",c)}},null,e.subscriptions),O.window.onDidChangeTextEditorSelection(o=>{try{i.updateProgramState(o.textEditor)}catch(c){console.error("[NC Code Helper] Failed to update state after cursor movement.",c)}},null,e.subscriptions),O.workspace.onDidChangeTextDocument(o=>{try{O.window.activeTextEditor&&o.document===O.window.activeTextEditor.document&&(se(),i.updateProgramState(O.window.activeTextEditor))}catch(c){console.error("[NC Code Helper] Failed to update after document change.",c)}},null,e.subscriptions),O.workspace.onDidChangeConfiguration(o=>{o.affectsConfiguration("ncCodeHelper")&&(De(),se(),n.refresh())},null,e.subscriptions),We(e),i.updateProgramState(O.window.activeTextEditor),se()}function dt(){}0&&(module.exports={activate,deactivate});
