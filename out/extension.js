"use strict";var le=Object.create;var G=Object.defineProperty;var pe=Object.getOwnPropertyDescriptor;var me=Object.getOwnPropertyNames;var ge=Object.getPrototypeOf,fe=Object.prototype.hasOwnProperty;var ue=(e,o)=>{for(var t in o)G(e,t,{get:o[t],enumerable:!0})},te=(e,o,t,n)=>{if(o&&typeof o=="object"||typeof o=="function")for(let c of me(o))!fe.call(e,c)&&c!==t&&G(e,c,{get:()=>o[c],enumerable:!(n=pe(o,c))||n.enumerable});return e};var M=(e,o,t)=>(t=e!=null?le(ge(e)):{},te(o||!e||!e.__esModule?G(t,"default",{value:e,enumerable:!0}):t,e)),he=e=>te(G({},"__esModule",{value:!0}),e);var Ce={};ue(Ce,{activate:()=>ve,deactivate:()=>be});module.exports=he(Ce);var S=M(require("vscode"));var u=M(require("vscode")),j=M(require("path")),P=M(require("fs"));var U=[{key:"enableOColor",colorKey:"colorO",label:"O (\u30D7\u30ED\u30B0\u30E9\u30E0\u756A\u53F7)",icon:"symbol-class",regex:/[Oo]\d+/g,defaultColor:"#FF1744"},{key:"enableNColor",colorKey:"colorN",label:"N (\u30B7\u30FC\u30B1\u30F3\u30B9\u756A\u53F7)",icon:"symbol-number",regex:/[Nn]\d+/g,defaultColor:"#df8337"},{key:"enableGColor",colorKey:"colorG",label:"G (\u6E96\u5099\u6A5F\u80FD)",icon:"gear",regex:/[Gg](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#ffa8db"},{key:"enableMColor",colorKey:"colorM",label:"M (\u88DC\u52A9\u6A5F\u80FD)",icon:"tools",regex:/[Mm](\d+|#\d+|#\[[^\]]+\])/g,defaultColor:"#eaadfc"},{key:"enableFSColor",colorKey:"colorFS",label:"FS (\u9001\u308A\u30FB\u56DE\u8EE2)",icon:"dashboard",regex:/[FSfs]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#9cc4f8"},{key:"enableXYZColor",colorKey:"colorXYZ",label:"XYZ (\u76F4\u7DDA\u8EF8)",icon:"move",regex:/[XxYyZz]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#76ee86"},{key:"enableABCColor",colorKey:"colorABC",label:"ABC (\u56DE\u8EE2\u8EF8)",icon:"sync",regex:/[AaBbCc]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#b2ff94"},{key:"enableToolColor",colorKey:"colorTool",label:"THD (\u5DE5\u5177\u30FB\u88DC\u6B63)",icon:"wrench",regex:/[TtHhDd](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#3112e0"},{key:"enableOthersColor",colorKey:"colorOthers",label:"OTHERS (\u305D\u306E\u4ED6)",icon:"symbol-parameter",regex:/[PpQqRrIiJjKkUuVvWw]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#f1a88d"},{key:"enableMacroColor",colorKey:"colorMacro",label:"MACRO (\u30DE\u30AF\u30ED\u6A5F\u80FD\u30FB\u5236\u5FA1\u6587)",icon:"symbol-variable",regex:/#\d+|#\[[^\]]+\]|\b(IF|THEN|GOTO|WHILE|DO|END|EQ|NE|GT|GE|LT|LE|AND|OR|XOR|FIX|FUP|ROUND|ABS|SQRT|SIN|COS|TAN|ATAN|EXP|LN|BIN|BCD)\b/gi,defaultColor:"#e040fb"}];function H(e){let o=e.globalStorageUri.fsPath,t=j.join(o,"machines");P.existsSync(t)||P.mkdirSync(t,{recursive:!0});let n=j.join(t,"sample.json");return P.existsSync(n)||P.writeFileSync(n,JSON.stringify({machine:"sample",description:"\u30DE\u30B7\u30CB\u30F3\u30B0\u30BB\u30F3\u30BF\u7528 M\u30B3\u30FC\u30C9",version:"1.0.0",mCodes:{M00:"\u30D7\u30ED\u30B0\u30E9\u30E0\u30B9\u30C8\u30C3\u30D7",M01:"\u30AA\u30D7\u30B7\u30E7\u30CA\u30EB\u30B9\u30C8\u30C3\u30D7",M02:"\u30D7\u30ED\u30B0\u30E9\u30E0\u7D42\u4E86",M03:"\u4E3B\u8EF8\u6B63\u8EE2",M04:"\u4E3B\u8EF8\u9006\u8EE2",M05:"\u4E3B\u8EF8\u505C\u6B62",M06:"\u5DE5\u5177\u4EA4\u63DB\uFF08ATC\uFF09",M08:"\u30AF\u30FC\u30E9\u30F3\u30C8 ON",M09:"\u30AF\u30FC\u30E9\u30F3\u30C8 OFF",M10:"A/C\u8EF8\u30AF\u30E9\u30F3\u30D7",M11:"A/C\u8EF8\u30A2\u30F3\u30AF\u30E9\u30F3\u30D7",M30:"\u30D7\u30ED\u30B0\u30E9\u30E0\u7D42\u4E86\uFF08\u30EA\u30BB\u30C3\u30C8\u30FB\u5FA9\u5E30\uFF09",M100:"\u30BB\u30F3\u30BF\u30AF\u30FC\u30E9\u30F3\u30C8 ON",M101:"\u30BB\u30F3\u30BF\u30AF\u30FC\u30E9\u30F3\u30C8 OFF"}},null,2),"utf8"),t}var z=class extends u.TreeItem{constructor(t,n,c,l,r,d){super(t,n);this.label=t;this.collapsibleState=n;this.category=c;this.machineName=r;this.isAddButton=d;d?(this.iconPath=new u.ThemeIcon("add"),this.tooltip="\u65B0\u3057\u3044\u8A2D\u5099M\u30B3\u30FC\u30C9\u5B9A\u7FA9(JSON)\u3092\u8FFD\u52A0",this.contextValue="addMachineItem",this.command={command:"ncCodeHelper.addMachineJson",title:"Add Machine JSON"}):c?(this.iconPath=new u.ThemeIcon(c.icon),this.tooltip=`${c.label} \u306E\u30CF\u30A4\u30E9\u30A4\u30C8\u8868\u793A\u5207\u66FF`,this.checkboxState=l?u.TreeItemCheckboxState.Checked:u.TreeItemCheckboxState.Unchecked,this.contextValue="categoryItem"):r&&(this.iconPath=new u.ThemeIcon("wrench"),this.tooltip=`\u30AF\u30EA\u30C3\u30AF\u3057\u3066 ${r} \u306EM\u30B3\u30FC\u30C9\u4E00\u89A7\u3092\u8868\u793A`,this.contextValue="machineItem",this.command={command:"ncCodeHelper.openMachineJson",title:"Open Machine JSON",arguments:[r]})}},B=class{constructor(o){this.context=o;this._onDidChangeTreeData=new u.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(o){return o}getChildren(o){if(o)return[];let t=H(this.context),n=[];return P.existsSync(t)&&P.readdirSync(t).filter(l=>l.endsWith(".json")).forEach(l=>{let r=j.basename(l,".json");n.push(new z(r,u.TreeItemCollapsibleState.None,void 0,void 0,r,!1))}),n.push(new z("\u65B0\u898F\u8A2D\u5099\u3092\u8FFD\u52A0...",u.TreeItemCollapsibleState.None,void 0,void 0,void 0,!0)),n}},Z=class{constructor(o){this.context=o;this._onDidChangeTreeData=new u.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(o){return o}getChildren(o){if(o)return[];let t=u.workspace.getConfiguration("ncCodeHelper");return U.map(n=>{let c=t.get(n.key,!0);return new z(n.label,u.TreeItemCollapsibleState.None,n,c)})}};function oe(e){let o=new B(e),t=new Z(e),n=u.window.createTreeView("ncCodeHelperMachinesView",{treeDataProvider:o,showCollapseAll:!1});e.subscriptions.push(n),e.subscriptions.push(n.onDidChangeCheckboxState(async l=>{let r=e.globalState.get("selectedMachines",[]);for(let[d,a]of l.items)d.machineName&&(a===u.TreeItemCheckboxState.Checked?r.includes(d.machineName)||r.push(d.machineName):r=r.filter(s=>s!==d.machineName));await e.globalState.update("selectedMachines",r),o.refresh()}));let c=u.window.createTreeView("ncCodeHelperCategoryView",{treeDataProvider:t,showCollapseAll:!1});return e.subscriptions.push(c),e.subscriptions.push(c.onDidChangeCheckboxState(async l=>{let r=u.workspace.getConfiguration("ncCodeHelper");for(let[d,a]of l.items)if(d.category){let s=a===u.TreeItemCheckboxState.Checked;await r.update(d.category.key,s,u.ConfigurationTarget.Global)}})),{machineDataProvider:o,colorDataProvider:t}}var E=M(require("vscode"));function ne(e){let o=E.languages.registerDocumentSymbolProvider({language:"gcode"},{provideDocumentSymbols(t){let n=t.getText(),c=/^([Oo]\d+|[Nn]\d+)(.*)/gm,l=[],r;for(;(r=c.exec(n))!==null;){let s=r[1],i=r[2].trim(),g=t.lineAt(t.positionAt(r.index).line),f=s.toUpperCase().startsWith("O"),m=i?`${s} ${i}`:s;l.push({name:m,isO:f,lineIndex:g.lineNumber,lineRange:g.range})}let d=[],a=null;for(let s=0;s<l.length;s++){let i=l[s],g=t.lineCount-1;s+1<l.length&&(g=l[s+1].lineIndex-1,g<i.lineIndex&&(g=i.lineIndex));let f=i.lineRange.start,m=t.lineAt(g).range.end,b=new E.Range(f,m),p=new E.DocumentSymbol(i.name,"NC Block",i.isO?E.SymbolKind.Class:E.SymbolKind.Method,b,i.lineRange);i.isO?(d.push(p),a=p):a?(a.children||(a.children=[]),a.children.push(p),p.range.end.isAfter(a.range.end)&&(a.range=new E.Range(a.range.start,p.range.end))):d.push(p)}return d}});e.subscriptions.push(o)}var N=M(require("vscode"));var X,Y;function se(e){Y=e,X=N.window.createTextEditorDecorationType({color:"#808080"}),e.subscriptions.push(X),q()}function q(){let e=N.workspace.getConfiguration("ncCodeHelper");U.forEach(o=>{o.decorationType&&o.decorationType.dispose();let t=e.get(o.colorKey,o.defaultColor);o.decorationType=N.window.createTextEditorDecorationType({color:t}),Y&&Y.subscriptions.push(o.decorationType)})}function I(){let e=N.window.activeTextEditor;if(!(!e||e.document.languageId.toLowerCase()!=="gcode"))try{let o=N.workspace.getConfiguration("ncCodeHelper"),t=e.document.getText(),n=[],c=/\(.*?\)/g,l;for(;(l=c.exec(t))!==null;){let s=e.document.positionAt(l.index),i=e.document.positionAt(l.index+l[0].length);n.push(new N.Range(s,i))}let r=s=>n.some(i=>i.contains(s)),d=[...n],a=[];U.forEach(s=>{let i=o.get(s.key,!0),g=[],f;for(s.regex.lastIndex=0;(f=s.regex.exec(t))!==null;){let m=e.document.positionAt(f.index),b=e.document.positionAt(f.index+f[0].length),p=new N.Range(m,b);r(p)||a.some(C=>C.contains(p)||p.contains(C))||(a.push(p),i?g.push(p):d.push(p))}s.decorationType&&e.setDecorations(s.decorationType,i?g:[])}),e.setDecorations(X,d)}catch(o){console.error("[NC Code Helper] Failed to update NC decorations.",o)}}var $=M(require("vscode")),re=M(require("path")),K=M(require("fs"));function ie(e){let o=$.languages.registerHoverProvider(["gcode","nc"],{provideHover(t,n,c){let l=t.lineAt(n.line).text,r=n.character,d=/M\d+/gi,a;for(;(a=d.exec(l))!==null;){let i=a.index,g=i+a[0].length;if(r>=i&&r<g){let f=a[0].toUpperCase(),m=new $.Range(new $.Position(n.line,i),new $.Position(n.line,g)),b=f.match(/^M(\d+)$/i),p=[f];if(b){let w=parseInt(b[1],10);for(let F of[`M${w.toString()}`,`M${w.toString().padStart(2,"0")}`])p.includes(F)||p.push(F)}let C=e.globalState.get("activeMachine","sample"),T=H(e),O=[],y=re.join(T,`${C}.json`);if(K.existsSync(y))try{let w=K.readFileSync(y,"utf8"),F=JSON.parse(w),A=F.mCodes;if(A&&typeof A=="object"){let V=Object.entries(A);for(let v of p){let D=V.find(([J])=>J.toUpperCase()===v);if(D&&typeof D[1]=="string"&&D[1].length>0){O.push(`**${F.machine||C}**: ${D[1]}`);break}}}}catch(w){console.error(`Failed to read M-code definitions from ${y}:`,w)}if(O.length>0){let w=new $.MarkdownString;return w.appendMarkdown(`**${f}**

`),w.appendMarkdown(O.join(`

`)),new $.Hover(w,m)}}}let s=t.getWordRangeAtPosition(n,/#\d+/);if(s){let i=t.getText(s),g=n.line,f=0;for(let T=g;T>=0;T--){let y=t.lineAt(T).text.split("(")[0];if(/O\d+/i.test(y)){f=T;break}}let m,b,p=new RegExp(`^\\s*${i.replace("#","\\#")}\\s*=\\s*(.+)`,"i");for(let T=f;T<=g;T++){let w=t.lineAt(T).text.split("(")[0].match(p);w&&(m=w[1].trim(),b=T+1)}let C=new $.MarkdownString;return C.appendMarkdown(`**\u30DE\u30AF\u30ED\u5909\u6570** ${i}

`),m!==void 0&&b!==void 0?C.appendMarkdown(`**\u5024**: \`${m}\` *(L${b} \u884C\u76EE\u3067\u8A2D\u5B9A)*`):C.appendMarkdown("*NULL*"),new $.Hover(C,s)}}});e.subscriptions.push(o)}var x=M(require("vscode")),R=M(require("path")),k=M(require("fs"));function ae(e,o,t){let n=x.commands.registerCommand("ncCodeHelper.openMachineJson",async r=>{let d="";if(typeof r=="string"?d=r:r&&typeof r=="object"&&(d=r.machineName||r.label||""),!d){x.window.showErrorMessage("\u8A2D\u5099\u540D\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return}let a=H(e),s=R.join(a,`${d}.json`);if(!k.existsSync(s)){x.window.showErrorMessage(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093: ${s}`);return}try{let i=k.readFileSync(s,"utf8"),g=JSON.parse(i);await e.globalState.update("activeMachine",d),await x.commands.executeCommand("ncCodeHelperMachineDetailView.focus"),t.updateMachineData(g,d)}catch(i){x.window.showErrorMessage(`JSON\u30D5\u30A1\u30A4\u30EB\u306E\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC: ${i}`)}}),c=x.commands.registerCommand("ncCodeHelper.addMachineJson",async()=>{let r=await x.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,openLabel:"\u8A2D\u5099JSON\u3068\u3057\u3066\u8FFD\u52A0",filters:{"JSON Files":["json"]}});if(!r||r.length===0)return;let d=r[0],a=R.basename(d.fsPath),s=R.parse(a).name,i=H(e);k.existsSync(i)||k.mkdirSync(i,{recursive:!0});let g=R.join(i,a);k.existsSync(g)&&await x.window.showWarningMessage(`\u300C${a}\u300D\u306F\u65E2\u306B\u5B58\u5728\u3057\u307E\u3059\u3002\u4E0A\u66F8\u304D\u3057\u307E\u3059\u304B\uFF1F`,"\u4E0A\u66F8\u304D","\u30AD\u30E3\u30F3\u30BB\u30EB")!=="\u4E0A\u66F8\u304D"||(k.copyFileSync(d.fsPath,g),x.window.showInformationMessage(`\u8A2D\u5099\u300C${s}\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002`),o.refresh(),await x.commands.executeCommand("ncCodeHelper.openMachineJson",s))}),l=x.commands.registerCommand("ncCodeHelper.openStorageFolder",async()=>{let r=H(e);k.existsSync(r)||k.mkdirSync(r,{recursive:!0});let d=x.Uri.file(r);await x.env.openExternal(d)});e.subscriptions.push(n,c,l)}var h=M(require("vscode"));function _(e){if(e.languageId==="gcode"||e.languageId==="nc")return!0;let o=[".nc",".gcode",".nd1",".all"],t=e.fileName.toLowerCase();if(o.some(r=>t.endsWith(r)))return!0;let n=e.getText();if(!n.trim())return!1;let c=[/%/,/(?:^|\s|[;])O\d{4,5}(?:\b|$)/im,/(?:^|[^A-Za-z0-9_])G0?[0-3](?=[A-Za-z0-9]|$)/i,/(?:^|[^A-Za-z0-9_])M0?[123689](?=[A-Za-z0-9]|$)/i,/(?:^|[^A-Za-z0-9_])G43\s*H\d+/i,/(?:^|\s)N\d+(?:\b|$)/im,/#\d{3,}\s*=/],l=0;for(let r of c)if(r.test(n)&&(l++,l>=2))return!0;return!1}function ce(e,o){let t=h.languages.createDiagnosticCollection("ncCodeChecks");e.subscriptions.push(t),h.window.activeTextEditor&&Q(h.window.activeTextEditor.document,t,o),e.subscriptions.push(h.window.onDidChangeActiveTextEditor(n=>{n&&Q(n.document,t,o)}),h.workspace.onDidChangeTextDocument(n=>{Q(n.document,t,o)}),h.workspace.onDidCloseTextDocument(n=>{t.delete(n.uri)}))}function Q(e,o,t){var l,r;if(!_(e)){o.delete(e.uri);return}let n=[],c=t.getProgramStates(e);for(let d=0;d<e.lineCount;d++){let s=e.lineAt(d).text.replace(/\([^)]*(?:\)|$)/g,m=>" ".repeat(m.length)).split(";",1)[0];for(let m of s.matchAll(/([ABCXYZ])([^A-Z\s]*)/gi)){if(m.index===void 0||/[A-Z]/i.test(s[m.index-1]??""))continue;let b=m.index+m[1].length,p=m[2],C=m.index+m[0].length;if(s[b]==="["){let y=s.indexOf("]",b+1);y!==-1&&(p=s.slice(b,y+1),C=y+1)}if(/^#\d+$/.test(p)||/^\[[^\]]+\]$/.test(p))continue;let T=new h.Range(new h.Position(d,m.index),new h.Position(d,C));if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(p)||!Number.isFinite(Number(p))){let y=new h.Diagnostic(T,`\u3010\u30A8\u30E9\u30FC\u3011${m[1].toUpperCase()} \u306E\u5024\u300C${p}\u300D\u3092\u6570\u5024\u3068\u3057\u3066\u8A8D\u8B58\u3067\u304D\u307E\u305B\u3093\u3002`,h.DiagnosticSeverity.Error);y.source="NC Code Helper",n.push(y);continue}if(Number(p)!==0&&!p.includes(".")){let y=new h.Diagnostic(T,`\u3010\u6CE8\u610F\u3011${m[1].toUpperCase()} \u306E\u5024\u300C${p}\u300D\u306B\u5C0F\u6570\u70B9\u304C\u3042\u308A\u307E\u305B\u3093\u3002`,h.DiagnosticSeverity.Warning);y.source="NC Code Helper",n.push(y)}}let i=c[d],g=Number((l=i.spindleTool.match(/^T(\d+)$/i))==null?void 0:l[1]),f=Number((r=i.toolLengthOffset.match(/^H(\d+)$/i))==null?void 0:r[1]);if(!(!Number.isFinite(g)||!Number.isFinite(f)||g===f))for(let m of s.matchAll(/H(\d+)/gi)){if(m.index===void 0||Number(m[1])!==f)continue;let b=m.index,p=new h.Range(new h.Position(d,b),new h.Position(d,b+m[0].length)),C=new h.Diagnostic(p,`\u3010\u6CE8\u610F\u3011\u4F7F\u7528\u5DE5\u5177 (${i.spindleTool}) \u3068\u5DE5\u5177\u9577\u88DC\u6B63 (${i.toolLengthOffset}) \u304C\u4E00\u81F4\u3057\u3066\u3044\u307E\u305B\u3093\u3002`,h.DiagnosticSeverity.Warning);C.source="NC Code Helper",n.push(C)}}o.set(e.uri,n)}var W={coordinateSystem:"\u672A\u691C\u51FA",spindleTool:"\u672A\u691C\u51FA",toolLengthOffset:"\u672A\u691C\u51FA",toolDiameterOffset:"\u672A\u691C\u51FA",magazineTool:"\u672A\u691C\u51FA",feedrate:"\u672A\u691C\u51FA",feedrateUnit:"mm/min",spindleSpeed:"\u672A\u691C\u51FA"};function ee(e,o){let t=0,n=()=>{for(;/\s/.test(e[t]??"");)t++},c=()=>{n();let a=e[t];if(a==="+"||a==="-"){t++;let g=c();return g===void 0?void 0:a==="-"?-g:g}if(a==="["||a==="("){let g=a==="["?"]":")";t++;let f=r();return n(),e[t]!==g?void 0:(t++,f)}let s=e.slice(t).match(/^#(\d+)/);if(s)return t+=s[0].length,o.get(Number(s[1]));let i=e.slice(t).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?/);if(i)return t+=i[0].length,Number(i[0])},l=()=>{let a=c();if(a!==void 0)for(;;){n();let s=e[t];if(s!=="*"&&s!=="/")return a;t++;let i=c();if(i===void 0)return;a=s==="*"?a*i:a/i}},r=()=>{let a=l();if(a!==void 0)for(;;){n();let s=e[t];if(s!=="+"&&s!=="-")return a;t++;let i=l();if(i===void 0)return;a=s==="+"?a+i:a-i}},d=r();return n(),d!==void 0&&t===e.length&&Number.isFinite(d)?d:void 0}var L=class{constructor(o){this._extensionUri=o;this._programState={...W}}resolveWebviewView(o,t,n){this._view=o,o.webview.options={enableScripts:!0,localResourceRoots:[this._extensionUri]},o.webview.html=this._getInitialHtml()}updateProgramState(o){try{this._programState=o&&_(o.document)?this.getProgramState(o.document,o.selection.active):{...W}}catch(t){console.error("[NC Code Helper] Failed to parse the active program state.",t),this._programState={...W}}this._view&&this._view.webview.postMessage({type:"programState",state:this._programState}).then(void 0,t=>console.error("[NC Code Helper] Failed to send program state to the webview.",t))}updateMachineData(o,t){if(!this._view)return;let n=typeof t=="string"?t:(t==null?void 0:t.machineName)||(t==null?void 0:t.label)||"Unknown",c="";if(o&&o.mCodes&&typeof o.mCodes=="object")for(let[d,a]of Object.entries(o.mCodes))c+=`
                    <tr>
                        <td class="code">${d}</td>
                        <td class="desc">${a}</td>
                    </tr>
                `;else c='<tr><td colspan="2">M\u30B3\u30FC\u30C9\u5B9A\u7FA9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093</td></tr>';let l=o&&typeof o.machine=="string"?o.machine:n,r=o&&typeof o.description=="string"?o.description:"";this._view.webview.html=`
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
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                    }
                    .definitions {
                        min-width: 0;
                        padding-right: 12px;
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 10px 0 10px 16px;
                    }
                    .program-state p {
                        display: grid;
                        grid-template-columns: 9em 1em minmax(0, 1fr);
                        margin: 0 0 8px;
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
                        <h1>\u8A2D\u5099: ${l}</h1>
                        ${r?`<p class="desc">${r}</p>`:""}
                        <table>
                            <thead>
                                <tr>
                                    <th>M\u30B3\u30FC\u30C9</th>
                                    <th>\u8AAC\u660E</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${c}
                            </tbody>
                        </table>
                    </section>
                    <section class="program-state" aria-label="\u30AB\u30FC\u30BD\u30EB\u4F4D\u7F6E\u306E\u30D7\u30ED\u30B0\u30E9\u30E0\u72B6\u614B">
                        <p><span>\u4F7F\u7528\u5EA7\u6A19\u7CFB</span><span>\uFF1A</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>\u4F7F\u7528\u5DE5\u5177</span><span>\uFF1A</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <p><span>\u5DE5\u5177\u9577\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                        <p><span>\u5DE5\u5177\u5F84\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        <p><span>\u5F85\u6A5F\u5DE5\u5177</span><span>\uFF1A</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <p><span>\u9001\u308A\u901F\u5EA6</span><span>\uFF1A</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        <p><span>\u4E3B\u8EF8\u56DE\u8EE2\u6570</span><span>\uFF1A</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min\u207B\xB9</span></p>
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
        `}getProgramState(o,t){return this.getProgramStates(o,t.line)[t.line]??{...W}}getProgramStates(o,t=o.lineCount-1){let n={...W},c=[],l,r,d,a,s=!1,i,g=!1,f=!1,m,b=!1,p=new Map;for(let C=0;C<=t;C++){let w=o.lineAt(C).text.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0].replace(/#(\d+)\s*=\s*(\[[^\]]*\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,(V,v,D)=>{let J=ee(D,p);return J!==void 0&&p.set(Number(v),J)," "}),F=/([GMTFHSDP])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,A;for(;(A=F.exec(w))!==null;){let V=A[1].toUpperCase(),v=A[2];switch(V){case"G":if(/^94(?:\.0)?$/i.test(v))n.feedrateUnit="mm/min";else if(/^95(?:\.0)?$/i.test(v))n.feedrateUnit="mm/rev";else if(/^5[4-9](?:\.0)?$/i.test(v)||/^54\.1$/i.test(v))n.coordinateSystem=`G${v}`,a=void 0;else if(/^4[34](?:\.0)?$/i.test(v)){s=!0,g=!1;let D=w.match(/H([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);D&&(i=`H${D[1]}`)}else if(/^49(?:\.0)?$/i.test(v))s=!1,i=void 0,g=!0;else if(/^41(?:\.0)?$/i.test(v)){f=!0,b=!1;let D=w.match(/D([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);D&&(m=`D${D[1]}`)}else if(/^42(?:\.0)?$/i.test(v)){f=!0,b=!1;let D=w.match(/D([+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);D&&(m=`D${D[1]}`)}else/^40(?:\.0)?$/i.test(v)&&(f=!1,m=void 0,b=!0);break;case"P":n.coordinateSystem==="G54.1"&&(a=`P${v}`);break;case"T":l=`T${v}`,d=l;break;case"M":Number(v)===6&&l&&(d=r,r=l,l=void 0);break;case"H":s&&(i=`H${v}`);break;case"D":f&&(m=`D${v}`);break;case"F":n.feedrate=String(ee(v,p)??v);break;case"S":n.spindleSpeed=String(ee(v,p)??v);break}}c.push({...n,coordinateSystem:a?`${n.coordinateSystem} ${a}`:n.coordinateSystem,spindleTool:r??"\u672A\u691C\u51FA",magazineTool:d??"\u672A\u691C\u51FA",toolLengthOffset:s?i??"\u672A\u691C\u51FA":g?"\u306A\u3057":"\u672A\u691C\u51FA",toolDiameterOffset:f?m??"\u672A\u691C\u51FA":b?"\u306A\u3057":"\u672A\u691C\u51FA"})}return c}_getInitialHtml(){return`
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
                    .content {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                        min-height: 150px;
                    }
                    .message {
                        color: var(--vscode-descriptionForeground);
                    }
                    .program-state {
                        border-left: 1px solid var(--vscode-widget-border);
                        padding: 10px 0 10px 16px;
                    }
                    .program-state p {
                        display: grid;
                        grid-template-columns: 9em 1em minmax(0, 1fr);
                        margin: 0 0 8px;
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
                        <p><span>\u4F7F\u7528\u5EA7\u6A19\u7CFB</span><span>\uFF1A</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>\u4F7F\u7528\u5DE5\u5177</span><span>\uFF1A</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <p><span>\u5DE5\u5177\u9577\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                        <p><span>\u5DE5\u5177\u5F84\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        <p><span>\u5F85\u6A5F\u5DE5\u5177</span><span>\uFF1A</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <p><span>\u9001\u308A\u901F\u5EA6</span><span>\uFF1A</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
                        <p><span>\u4E3B\u8EF8\u56DE\u8EE2\u6570</span><span>\uFF1A</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min\u207B\xB9</span></p>
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
        `}};L.viewType="ncCodeHelperMachineDetailView";function de(e){if(!(!e||e.languageId==="gcode"||e.languageId==="nc"))try{_(e)&&S.languages.setTextDocumentLanguage(e,"gcode").then(o=>{let t=S.window.activeTextEditor;(t==null?void 0:t.document)===o&&I()},o=>console.error("[NC Code Helper] Failed to set document language.",o))}catch(o){console.error("[NC Code Helper] Failed to detect or set document language.",o)}}function ve(e){e.subscriptions.push(S.workspace.onDidOpenTextDocument(c=>{de(c)})),S.window.activeTextEditor&&de(S.window.activeTextEditor.document);let{machineDataProvider:o,colorDataProvider:t}=oe(e),n=new L(e.extensionUri);e.subscriptions.push(S.window.registerWebviewViewProvider(L.viewType,n)),se(e),ne(e),ie(e),ae(e,o,n),ce(e,n),S.window.onDidChangeActiveTextEditor(c=>{try{n.updateProgramState(c),c&&I()}catch(l){console.error("[NC Code Helper] Failed to update active editor state.",l)}},null,e.subscriptions),S.window.onDidChangeTextEditorSelection(c=>{try{n.updateProgramState(c.textEditor)}catch(l){console.error("[NC Code Helper] Failed to update state after cursor movement.",l)}},null,e.subscriptions),S.workspace.onDidChangeTextDocument(c=>{try{S.window.activeTextEditor&&c.document===S.window.activeTextEditor.document&&(I(),n.updateProgramState(S.window.activeTextEditor))}catch(l){console.error("[NC Code Helper] Failed to update after document change.",l)}},null,e.subscriptions),S.workspace.onDidChangeConfiguration(c=>{c.affectsConfiguration("ncCodeHelper")&&(q(),I(),t.refresh())},null,e.subscriptions),n.updateProgramState(S.window.activeTextEditor),I()}function be(){}0&&(module.exports={activate,deactivate});
