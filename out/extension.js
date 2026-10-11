"use strict";var We=Object.create;var fe=Object.defineProperty;var Ge=Object.getOwnPropertyDescriptor;var Ke=Object.getOwnPropertyNames;var Je=Object.getPrototypeOf,Xe=Object.prototype.hasOwnProperty;var Be=(e,t)=>{for(var n in t)fe(e,n,{get:t[n],enumerable:!0})},Re=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Ke(t))!Xe.call(e,o)&&o!==n&&fe(e,o,{get:()=>t[o],enumerable:!(i=Ge(t,o))||i.enumerable});return e};var I=(e,t,n)=>(n=e!=null?We(Je(e)):{},Re(t||!e||!e.__esModule?fe(n,"default",{value:e,enumerable:!0}):n,e)),Ye=e=>Re(fe({},"__esModule",{value:!0}),e);var it={};Be(it,{activate:()=>nt,deactivate:()=>ot});module.exports=Ye(it);var O=I(require("vscode"));var $=I(require("vscode")),ce=I(require("path")),W=I(require("fs"));var Y=[{key:"enableOColor",colorKey:"colorO",label:"O (\u30D7\u30ED\u30B0\u30E9\u30E0\u756A\u53F7)",icon:"symbol-class",regex:/\b[Oo]\d+/g,defaultColor:"#FF1744"},{key:"enableNColor",colorKey:"colorN",label:"N (\u30B7\u30FC\u30B1\u30F3\u30B9\u756A\u53F7)",icon:"symbol-number",regex:/[Nn]\d+/g,defaultColor:"#df8337"},{key:"enableGColor",colorKey:"colorG",label:"G (\u6E96\u5099\u6A5F\u80FD)",icon:"gear",regex:/[Gg](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#ffa8db"},{key:"enableMColor",colorKey:"colorM",label:"M (\u88DC\u52A9\u6A5F\u80FD)",icon:"tools",regex:/[Mm](\d+|#\d+|#\[[^\]]+\])/g,defaultColor:"#eaadfc"},{key:"enableFSColor",colorKey:"colorFS",label:"FS (\u9001\u308A\u30FB\u56DE\u8EE2)",icon:"dashboard",regex:/[FSfs]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#9cc4f8"},{key:"enableXYZColor",colorKey:"colorXYZ",label:"XYZ (\u76F4\u7DDA\u8EF8)",icon:"move",regex:/[XxYyZz]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#76ee86"},{key:"enableABCColor",colorKey:"colorABC",label:"ABC (\u56DE\u8EE2\u8EF8)",icon:"sync",regex:/[AaBbCc]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#b2ff94"},{key:"enableToolColor",colorKey:"colorTool",label:"THD (\u5DE5\u5177\u30FB\u88DC\u6B63)",icon:"wrench",regex:/[TtHhDd](\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#3112e0"},{key:"enableOthersColor",colorKey:"colorOthers",label:"OTHERS (\u305D\u306E\u4ED6)",icon:"symbol-parameter",regex:/[PpQqRrIiJjKkUuVvWw]([+-]?\d+(\.\d+)?|#\d+|#\[[^\]]+\])/g,defaultColor:"#f1a88d"},{key:"enableMacroColor",colorKey:"colorMacro",label:"MACRO (\u30DE\u30AF\u30ED\u6A5F\u80FD\u30FB\u5236\u5FA1\u6587)",icon:"symbol-variable",regex:/#\d+|#\[[^\]]+\]|(?<![A-Z])(IF|THEN|GOTO|WHILE|DO|END|EQ|NE|GT|GE|LT|LE|AND|OR|XOR|FIX|FUP|ROUND|ABS|SQRT|SIN|COS|TAN|ATAN|EXP|LN|BIN|BCD)(?![A-Z])/gi,defaultColor:"#e040fb"}];function Q(e){let t=e.globalStorageUri.fsPath,n=ce.join(t,"machines");W.existsSync(n)||W.mkdirSync(n,{recursive:!0});let i=ce.join(n,"sample.json");return W.existsSync(i)||W.writeFileSync(i,JSON.stringify({machine:"sample",description:"\u30DE\u30B7\u30CB\u30F3\u30B0\u30BB\u30F3\u30BF\u7528 M\u30B3\u30FC\u30C9",version:"1.0.0",mCodes:{M00:"\u30D7\u30ED\u30B0\u30E9\u30E0\u30B9\u30C8\u30C3\u30D7",M01:"\u30AA\u30D7\u30B7\u30E7\u30CA\u30EB\u30B9\u30C8\u30C3\u30D7",M02:"\u30D7\u30ED\u30B0\u30E9\u30E0\u7D42\u4E86",M03:"\u4E3B\u8EF8\u6B63\u8EE2",M04:"\u4E3B\u8EF8\u9006\u8EE2",M05:"\u4E3B\u8EF8\u505C\u6B62",M06:"\u5DE5\u5177\u4EA4\u63DB\uFF08ATC\uFF09",M08:"\u30AF\u30FC\u30E9\u30F3\u30C8 ON",M09:"\u30AF\u30FC\u30E9\u30F3\u30C8 OFF",M10:"A/C\u8EF8\u30AF\u30E9\u30F3\u30D7",M11:"A/C\u8EF8\u30A2\u30F3\u30AF\u30E9\u30F3\u30D7",M30:"\u30D7\u30ED\u30B0\u30E9\u30E0\u7D42\u4E86\uFF08\u30EA\u30BB\u30C3\u30C8\u30FB\u5FA9\u5E30\uFF09",M100:"\u30BB\u30F3\u30BF\u30AF\u30FC\u30E9\u30F3\u30C8 ON",M101:"\u30BB\u30F3\u30BF\u30AF\u30FC\u30E9\u30F3\u30C8 OFF"}},null,2),"utf8"),n}var de=class extends $.TreeItem{constructor(n,i,o,a,s,f){super(n,i);this.label=n;this.collapsibleState=i;this.category=o;this.machineName=s;this.isAddButton=f;f?(this.iconPath=new $.ThemeIcon("add"),this.tooltip="\u65B0\u3057\u3044\u8A2D\u5099M\u30B3\u30FC\u30C9\u5B9A\u7FA9(JSON)\u3092\u8FFD\u52A0",this.contextValue="addMachineItem",this.command={command:"ncCodeHelper.addMachineJson",title:"Add Machine JSON"}):o?(this.iconPath=new $.ThemeIcon(o.icon),this.tooltip=`${o.label} \u306E\u30CF\u30A4\u30E9\u30A4\u30C8\u8868\u793A\u5207\u66FF`,this.checkboxState=a?$.TreeItemCheckboxState.Checked:$.TreeItemCheckboxState.Unchecked,this.contextValue="categoryItem"):s&&(this.iconPath=new $.ThemeIcon("wrench"),this.tooltip=`\u30AF\u30EA\u30C3\u30AF\u3057\u3066 ${s} \u306EM\u30B3\u30FC\u30C9\u4E00\u89A7\u3092\u8868\u793A`,this.contextValue="machineItem",this.command={command:"ncCodeHelper.openMachineJson",title:"Open Machine JSON",arguments:[s]})}},ye=class{constructor(t){this.context=t;this._onDidChangeTreeData=new $.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(t){return t}getChildren(t){if(t)return[];let n=Q(this.context),i=[];return W.existsSync(n)&&W.readdirSync(n).filter(a=>a.endsWith(".json")).forEach(a=>{let s=ce.basename(a,".json");i.push(new de(s,$.TreeItemCollapsibleState.None,void 0,void 0,s,!1))}),i.push(new de("\u65B0\u898F\u8A2D\u5099\u3092\u8FFD\u52A0...",$.TreeItemCollapsibleState.None,void 0,void 0,void 0,!0)),i}},Ce=class{constructor(t){this.context=t;this._onDidChangeTreeData=new $.EventEmitter;this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire()}getTreeItem(t){return t}getChildren(t){if(t)return[];let n=$.workspace.getConfiguration("ncCodeHelper");return Y.map(i=>{let o=n.get(i.key,!0);return new de(i.label,$.TreeItemCollapsibleState.None,i,o)})}};function Fe(e){let t=new ye(e),n=new Ce(e),i=$.window.createTreeView("ncCodeHelperMachinesView",{treeDataProvider:t,showCollapseAll:!1});e.subscriptions.push(i),e.subscriptions.push(i.onDidChangeCheckboxState(async a=>{let s=e.globalState.get("selectedMachines",[]);for(let[f,c]of a.items)f.machineName&&(c===$.TreeItemCheckboxState.Checked?s.includes(f.machineName)||s.push(f.machineName):s=s.filter(l=>l!==f.machineName));await e.globalState.update("selectedMachines",s),t.refresh()}));let o=$.window.createTreeView("ncCodeHelperCategoryView",{treeDataProvider:n,showCollapseAll:!1});return e.subscriptions.push(o),e.subscriptions.push(o.onDidChangeCheckboxState(async a=>{let s=$.workspace.getConfiguration("ncCodeHelper");for(let[f,c]of a.items)if(f.category){let l=c===$.TreeItemCheckboxState.Checked;await s.update(f.category.key,l,$.ConfigurationTarget.Global)}})),{machineDataProvider:t,colorDataProvider:n}}var G=I(require("vscode"));function Oe(e){let t=G.languages.registerDocumentSymbolProvider({language:"gcode"},{provideDocumentSymbols(n){let i=n.getText(),o=/^([Oo]\d+|[Nn]\d+)(.*)/gm,a=[],s;for(;(s=o.exec(i))!==null;){let l=s[1],r=s[2].trim(),d=n.lineAt(n.positionAt(s.index).line),m=l.toUpperCase().startsWith("O"),p=r?`${l} ${r}`:l;a.push({name:p,isO:m,lineIndex:d.lineNumber,lineRange:d.range})}let f=[],c=null;for(let l=0;l<a.length;l++){let r=a[l],d=n.lineCount-1;l+1<a.length&&(d=a[l+1].lineIndex-1,d<r.lineIndex&&(d=r.lineIndex));let m=r.lineRange.start,p=n.lineAt(d).range.end,b=new G.Range(m,p),x=new G.DocumentSymbol(r.name,"NC Block",r.isO?G.SymbolKind.Class:G.SymbolKind.Method,b,r.lineRange);r.isO?(f.push(x),c=x):c?(c.children||(c.children=[]),c.children.push(x),x.range.end.isAfter(c.range.end)&&(c.range=new G.Range(c.range.start,x.range.end))):f.push(x)}return f}});e.subscriptions.push(t)}var j=I(require("vscode"));var we,Se;function He(e){Se=e,we=j.window.createTextEditorDecorationType({color:"#808080"}),e.subscriptions.push(we),Me()}function Me(){let e=j.workspace.getConfiguration("ncCodeHelper");Y.forEach(t=>{t.decorationType&&t.decorationType.dispose();let n=e.get(t.colorKey,t.defaultColor);t.decorationType=j.window.createTextEditorDecorationType({color:n}),Se&&Se.subscriptions.push(t.decorationType)})}function te(){let e=j.window.activeTextEditor;if(!(!e||e.document.languageId.toLowerCase()!=="gcode"))try{let t=j.workspace.getConfiguration("ncCodeHelper"),n=e.document.getText(),i=[],o=/\(.*?\)/g,a;for(;(a=o.exec(n))!==null;){let m=e.document.positionAt(a.index),p=e.document.positionAt(a.index+a[0].length);i.push(new j.Range(m,p))}let s=m=>i.some(p=>p.contains(m)),f=[...i],c=[],l=[...Y].sort((m,p)=>+(p.key==="enableMacroColor")-+(m.key==="enableMacroColor")),r=new Map(Y.map(m=>[m,[]])),d=(m,p)=>{let b=p.index,x=b+p[0].length,T=new j.Range(e.document.positionAt(b),e.document.positionAt(x));if(s(T))return;let v=m.key==="enableMacroColor"&&p[0].startsWith("#"),S=c.filter(h=>h.range.intersection(T)!==void 0);if(S.some(h=>!h.isMacroVariable||v))return;let A=t.get(m.key,!0),D=[[b,x]];for(let{range:h}of S){let y=e.document.offsetAt(h.start),g=e.document.offsetAt(h.end);D=D.flatMap(([M,w])=>{if(g<=M||y>=w)return[[M,w]];let N=[];return M<y&&N.push([M,y]),g<w&&N.push([g,w]),N})}D.forEach(([h,y])=>{var M;if(h>=y)return;let g=new j.Range(e.document.positionAt(h),e.document.positionAt(y));c.push({range:g,isMacroVariable:v}),A?(M=r.get(m))==null||M.push(g):f.push(g)})};l.forEach(m=>{let p;for(m.regex.lastIndex=0;(p=m.regex.exec(n))!==null;)d(m,p)}),Y.forEach(m=>{if(m.decorationType){let p=t.get(m.key,!0);e.setDecorations(m.decorationType,p?r.get(m)??[]:[])}}),e.setDecorations(we,f)}catch(t){console.error("[NC Code Helper] Failed to update NC decorations.",t)}}var z=I(require("vscode")),Ie=I(require("path")),ve=I(require("fs"));function ue(e,t){let n=0,i=()=>{for(;/\s/.test(e[n]??"");)n++},o=()=>{i();let c=e[n];if(c==="+"||c==="-"){n++;let d=o();return d===void 0?void 0:c==="-"?-d:d}if(c==="["||c==="("){let d=c==="["?"]":")";n++;let m=s();return i(),e[n]!==d?void 0:(n++,m)}let l=e.slice(n).match(/^#(\d+)/);if(l)return n+=l[0].length,t.get(Number(l[1]));let r=e.slice(n).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?/);if(r)return n+=r[0].length,Number(r[0])},a=()=>{let c=o();if(c!==void 0)for(;;){i();let l=e[n];if(l!=="*"&&l!=="/")return c;n++;let r=o();if(r===void 0)return;c=l==="*"?c*r:c/r}},s=()=>{let c=a();if(c!==void 0)for(;;){i();let l=e[n];if(l!=="+"&&l!=="-")return c;n++;let r=a();if(r===void 0)return;c=l==="+"?c+r:c-r}},f=s();return i(),f!==void 0&&n===e.length&&Number.isFinite(f)?f:void 0}function le(e,t){return String(ue(e,t)??e)}function ge(e){return e.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0]}function he(e){return/(?<![A-Z])G0*65(?![\d.])/i.test(ge(e))}function ne(e,t){return ge(e).replace(/#(\d+)\s*=\s*(\[[^\]]*\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,(i,o,a)=>{let s=ue(a,t);return s!==void 0&&t.set(Number(o),s)," "})}function Qe(e){let t=e.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0];return/(?:^|\s)O\d{3,5}(?=\s|$)/i.test(t)}function Le(e){let t=z.languages.registerHoverProvider(["gcode","nc"],{provideHover(n,i,o){let a=n.lineAt(i.line).text,s=i.character,f=/M\d+/gi,c;for(;(c=f.exec(a))!==null;){let r=c.index,d=r+c[0].length;if(s>=r&&s<d){let m=c[0].toUpperCase(),p=new z.Range(new z.Position(i.line,r),new z.Position(i.line,d)),b=m.match(/^M(\d+)$/i),x=[m];if(b){let D=parseInt(b[1],10);for(let h of[`M${D.toString()}`,`M${D.toString().padStart(2,"0")}`])x.includes(h)||x.push(h)}let T=e.globalState.get("activeMachine","sample"),v=Q(e),S=[],A=Ie.join(v,`${T}.json`);if(ve.existsSync(A))try{let D=ve.readFileSync(A,"utf8"),h=JSON.parse(D),y=h.mCodes;if(y&&typeof y=="object"){let g=Object.entries(y);for(let M of x){let w=g.find(([N])=>N.toUpperCase()===M);if(w&&typeof w[1]=="string"&&w[1].length>0){S.push(`**${h.machine||T}**: ${w[1]}`);break}}}}catch(D){console.error(`Failed to read M-code definitions from ${A}:`,D)}if(S.length>0){let D=new z.MarkdownString;return D.appendMarkdown(`**${m}**

`),D.appendMarkdown(S.join(`

`)),new z.Hover(D,p)}}}let l=n.getWordRangeAtPosition(i,/#\d+/);if(l){let r=n.getText(l),d=i.line,m=0;for(let v=d;v>=0;v--){let S=n.lineAt(v).text;if(Qe(S)){m=v;break}}let p,b,x=new Map;for(let v=m;v<=d;v++){let S=n.lineAt(v).text,A=S.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0];ne(S,x);let D=A.match(new RegExp(`${r.replace("#","\\#")}\\s*=\\s*(.+)`,"i"));D&&(p=D[1].trim(),b=v+1)}let T=new z.MarkdownString;if(T.appendMarkdown(`**\u30DE\u30AF\u30ED\u5909\u6570** ${r}

`),p!==void 0&&b!==void 0){let v=x.get(Number(r.slice(1))),S=v===void 0?p:String(v);T.appendMarkdown(`**\u5024**: \`${S}\` *(L${b} \u884C\u76EE\u3067\u8A2D\u5B9A)*`)}else T.appendMarkdown("*NULL*");return new z.Hover(T,l)}}});e.subscriptions.push(t)}var F=I(require("vscode")),q=I(require("path")),V=I(require("fs"));function ze(e,t,n){let i=F.commands.registerCommand("ncCodeHelper.openMachineJson",async s=>{let f="";if(typeof s=="string"?f=s:s&&typeof s=="object"&&(f=s.machineName||s.label||""),!f){F.window.showErrorMessage("\u8A2D\u5099\u540D\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002");return}let c=Q(e),l=q.join(c,`${f}.json`);if(!V.existsSync(l)){F.window.showErrorMessage(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093: ${l}`);return}try{let r=V.readFileSync(l,"utf8"),d=JSON.parse(r);await e.globalState.update("activeMachine",f),await F.commands.executeCommand("ncCodeHelperMachineDetailView.focus"),n.updateMachineData(d,f)}catch(r){F.window.showErrorMessage(`JSON\u30D5\u30A1\u30A4\u30EB\u306E\u8AAD\u307F\u8FBC\u307F\u30A8\u30E9\u30FC: ${r}`)}}),o=F.commands.registerCommand("ncCodeHelper.addMachineJson",async()=>{let s=await F.window.showOpenDialog({canSelectFiles:!0,canSelectFolders:!1,canSelectMany:!1,openLabel:"\u8A2D\u5099JSON\u3068\u3057\u3066\u8FFD\u52A0",filters:{"JSON Files":["json"]}});if(!s||s.length===0)return;let f=s[0],c=q.basename(f.fsPath),l=q.parse(c).name,r=Q(e);V.existsSync(r)||V.mkdirSync(r,{recursive:!0});let d=q.join(r,c);V.existsSync(d)&&await F.window.showWarningMessage(`\u300C${c}\u300D\u306F\u65E2\u306B\u5B58\u5728\u3057\u307E\u3059\u3002\u4E0A\u66F8\u304D\u3057\u307E\u3059\u304B\uFF1F`,"\u4E0A\u66F8\u304D","\u30AD\u30E3\u30F3\u30BB\u30EB")!=="\u4E0A\u66F8\u304D"||(V.copyFileSync(f.fsPath,d),F.window.showInformationMessage(`\u8A2D\u5099\u300C${l}\u300D\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002`),t.refresh(),await F.commands.executeCommand("ncCodeHelper.openMachineJson",l))}),a=F.commands.registerCommand("ncCodeHelper.openStorageFolder",async()=>{let s=Q(e);V.existsSync(s)||V.mkdirSync(s,{recursive:!0});let f=F.Uri.file(s);await F.env.openExternal(f)});e.subscriptions.push(i,o,a)}var C=I(require("vscode"));function J(e){if(e.languageId==="gcode"||e.languageId==="nc")return!0;let t=[".nc",".gcode",".nd1",".all"],n=e.fileName.toLowerCase();if(t.some(s=>n.endsWith(s)))return!0;let i=e.getText();if(!i.trim())return!1;let o=[/%/,/(?:^|\s|[;])O\d{4,5}(?:\b|$)/im,/(?:^|[^A-Za-z0-9_])G0?[0-3](?=[A-Za-z0-9]|$)/i,/(?:^|[^A-Za-z0-9_])M0?[123689](?=[A-Za-z0-9]|$)/i,/(?:^|[^A-Za-z0-9_])G43\s*H\d+/i,/(?:^|\s)N\d+(?:\b|$)/im,/#\d{3,}\s*=/],a=0;for(let s of o)if(s.test(i)&&(a++,a>=2))return!0;return!1}var pe={coordinateSystem:"\u672A\u691C\u51FA",spindleTool:"\u672A\u691C\u51FA",toolLengthOffset:"\u672A\u691C\u51FA",toolDiameterOffset:"\u672A\u691C\u51FA",magazineTool:"\u672A\u691C\u51FA",feedrate:"\u672A\u691C\u51FA",feedrateUnit:"mm/min",spindleSpeed:"\u672A\u691C\u51FA"};function Te(e,t,n){var a,s;let i=Number((a=e.match(/^T(\d+)$/i))==null?void 0:a[1]),o=Number((s=t.match(new RegExp(`^${n}(\\d+)$`,"i")))==null?void 0:s[1]);return Number.isFinite(i)&&Number.isFinite(o)&&i!==o}var oe=class{constructor(t){this._extensionUri=t;this._programState={...pe}}resolveWebviewView(t,n,i){this._view=t,t.webview.options={enableScripts:!0,localResourceRoots:[this._extensionUri]},t.webview.html=this._getInitialHtml()}updateProgramState(t){try{this._programState=t&&J(t.document)?this.getProgramState(t.document,t.selection.active):{...pe}}catch(n){console.error("[NC Code Helper] Failed to parse the active program state.",n),this._programState={...pe}}this._view&&this._view.webview.postMessage({type:"programState",state:this._programState}).then(void 0,n=>console.error("[NC Code Helper] Failed to send program state to the webview.",n))}updateMachineData(t,n){if(!this._view)return;let i=typeof n=="string"?n:(n==null?void 0:n.machineName)||(n==null?void 0:n.label)||"Unknown",o="";if(t&&t.mCodes&&typeof t.mCodes=="object")for(let[f,c]of Object.entries(t.mCodes))o+=`
                    <tr>
                        <td class="code">${f}</td>
                        <td class="desc">${c}</td>
                    </tr>
                `;else o='<tr><td colspan="2">M\u30B3\u30FC\u30C9\u5B9A\u7FA9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093</td></tr>';let a=t&&typeof t.machine=="string"?t.machine:i,s=t&&typeof t.description=="string"?t.description:"";this._view.webview.html=`
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
                    .program-state p,
                    .program-state .double-value .field {
                        display: grid;
                        grid-template-columns: 6.6em 0.6em minmax(0, 1fr);
                        column-gap: 2px;
                        margin: 0 0 8px;
                        font-size: 1em;
                    }
                    .program-state .double-value {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        column-gap: 10px;
                        row-gap: 8px;
                        margin: 0 0 8px;
                        align-items: start;
                    }
                    .program-state .double-value .field {
                        min-width: 0;
                        margin-bottom: 0;
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
                        <h1>\u8A2D\u5099: ${a}</h1>
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
                        <p><span>\u4F7F\u7528\u5EA7\u6A19\u7CFB</span><span>\uFF1A</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>\u4F7F\u7528\u5DE5\u5177</span><span>\uFF1A</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <div class="double-value" aria-label="\u5DE5\u5177\u88DC\u6B63">
                            <p class="field"><span>\u5DE5\u5177\u9577\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                            <p class="field"><span>\u5DE5\u5177\u5F84\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        </div>
                        <p><span>\u5F85\u6A5F\u5DE5\u5177</span><span>\uFF1A</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <div class="double-value" aria-label="\u56DE\u8EE2\u30FB\u9001\u308A">
                            <p class="field"><span>\u4E3B\u8EF8\u56DE\u8EE2\u6570</span><span>\uFF1A</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min\u207B\xB9</span></p>
                            <p class="field"><span>\u9001\u308A\u901F\u5EA6</span><span>\uFF1A</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
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
        `}getProgramState(t,n){return this.getProgramStates(t,n.line)[n.line]??{...pe}}getProgramStates(t,n=t.lineCount-1){let i={...pe},o=[],a,s,f,c,l=!1,r,d=!1,m=!1,p,b=!1,x=new Map;for(let T=0;T<=n;T++){let S=t.lineAt(T).text;/(?:^|[^A-Z])O\d+/i.test(S.replace(/\([^)]*(?:\)|$)/g,"").split(";",1)[0])&&x.clear();let A=he(S)?"":ne(S,x),D=/(?<![A-Z])([GMTFHSDP])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi,h;for(;(h=D.exec(A))!==null;){let y=h[1].toUpperCase(),g=h[2],M=le(g,x);switch(y){case"G":if(/^94(?:\.0)?$/i.test(g))i.feedrateUnit="mm/min";else if(/^95(?:\.0)?$/i.test(g))i.feedrateUnit="mm/rev";else if(/^5[4-9](?:\.0)?$/i.test(g)||/^54\.1$/i.test(g))i.coordinateSystem=`G${g}`,c=void 0;else if(/^4[34](?:\.0)?$/i.test(g)){l=!0,d=!1;let w=A.match(/(?<![A-Z])H(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);w&&(r=`H${le(w[1],x)}`)}else if(/^49(?:\.0)?$/i.test(g))l=!1,r=void 0,d=!0;else if(/^41(?:\.0)?$/i.test(g)){m=!0,b=!1;let w=A.match(/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);w&&(p=`D${le(w[1],x)}`)}else if(/^42(?:\.0)?$/i.test(g)){m=!0,b=!1;let w=A.match(/(?<![A-Z])D(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i);w&&(p=`D${le(w[1],x)}`)}else/^40(?:\.0)?$/i.test(g)&&(m=!1,p=void 0,b=!0);break;case"P":i.coordinateSystem==="G54.1"&&(c=`P${M}`);break;case"T":a=`T${M}`,f=a;break;case"M":Number(M)===6&&a&&(f=s,s=a,a=void 0);break;case"H":l&&(r=`H${M}`);break;case"D":m&&(p=`D${M}`);break;case"F":i.feedrate=M;break;case"S":i.spindleSpeed=M;break}}o.push({...i,coordinateSystem:c?`${i.coordinateSystem} ${c}`:i.coordinateSystem,spindleTool:s??"\u672A\u691C\u51FA",magazineTool:f??"\u672A\u691C\u51FA",toolLengthOffset:l?r??"\u672A\u691C\u51FA":d?"\u306A\u3057":"\u672A\u691C\u51FA",toolDiameterOffset:m?p??"\u672A\u691C\u51FA":b?"\u306A\u3057":"\u672A\u691C\u51FA"})}return o}_getInitialHtml(){return`
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
                    .program-state p,
                    .program-state .double-value .field {
                        display: grid;
                        grid-template-columns: 6.6em 0.6em minmax(0, 1fr);
                        column-gap: 2px;
                        margin: 0 0 8px;
                        font-size: 1em;
                    }
                    .program-state .double-value {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        column-gap: 10px;
                        row-gap: 8px;
                        margin: 0 0 8px;
                        align-items: start;
                    }
                    .program-state .double-value .field {
                        min-width: 0;
                        margin-bottom: 0;
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
                        <p><span>\u4F7F\u7528\u5EA7\u6A19\u7CFB</span><span>\uFF1A</span><span data-state="coordinateSystem">${this._programState.coordinateSystem}</span></p>
                        <p><span>\u4F7F\u7528\u5DE5\u5177</span><span>\uFF1A</span><span data-state="spindleTool">${this._programState.spindleTool}</span></p>
                        <div class="double-value" aria-label="\u5DE5\u5177\u88DC\u6B63">
                            <p class="field"><span>\u5DE5\u5177\u9577\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolLengthOffset">${this._programState.toolLengthOffset}</span></p>
                            <p class="field"><span>\u5DE5\u5177\u5F84\u88DC\u6B63</span><span>\uFF1A</span><span data-state="toolDiameterOffset">${this._programState.toolDiameterOffset}</span></p>
                        </div>
                        <p><span>\u5F85\u6A5F\u5DE5\u5177</span><span>\uFF1A</span><span data-state="magazineTool">${this._programState.magazineTool}</span></p>
                        <div class="double-value" aria-label="\u56DE\u8EE2\u30FB\u9001\u308A">
                            <p class="field"><span>\u4E3B\u8EF8\u56DE\u8EE2\u6570</span><span>\uFF1A</span><span><span data-state="spindleSpeed">${this._programState.spindleSpeed}</span> min\u207B\xB9</span></p>
                            <p class="field"><span>\u9001\u308A\u901F\u5EA6</span><span>\uFF1A</span><span><span data-state="feedrate">${this._programState.feedrate}</span> <span data-state="feedrateUnit">${this._programState.feedrateUnit}</span></span></p>
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
        `}};oe.viewType="ncCodeHelperMachineDetailView";function Ue(e,t){let n=C.languages.createDiagnosticCollection("ncCodeChecks");e.subscriptions.push(n),C.window.activeTextEditor&&De(C.window.activeTextEditor.document,n,t),e.subscriptions.push(C.window.onDidChangeActiveTextEditor(i=>{i&&De(i.document,n,t)}),C.workspace.onDidChangeTextDocument(i=>{De(i.document,n,t)}),C.workspace.onDidCloseTextDocument(i=>{n.delete(i.uri)}))}function De(e,t,n){if(!J(e)){t.delete(e.uri);return}let i=[],o=n.getProgramStates(e),a=!1,s=!1,f=!1,c=!1,l=!1,r=!1;for(let d=0;d<e.lineCount;d++){let m=e.lineAt(d),p=m.text.replace(/\([^)]*(?:\)|$)/g,h=>" ".repeat(h.length)).split(";",1)[0];/(?<![A-Z])M0?6(?!\d)/i.test(p)&&(f=!0,c=!1,l=!1,r=!1);let b=/(?<![A-Z])F(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(p),x=/(?<![A-Z])S(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.test(p);c||=b,l||=x;let T=/(?<![A-Z])G(?:0?[123]|73|81|83|84|85)(?![\d.])/i.test(p);if(f&&T&&!r){r=!0;let h=[...c?[]:["\u3010\u8B66\u544A\u3011\u9001\u308A\u901F\u5EA6\uFF1AF\u304C\u6307\u4EE4\u3055\u308C\u3066\u3044\u307E\u305B\u3093"],...l?[]:["\u3010\u8B66\u544A\u3011\u4E3B\u8EF8\u56DE\u8EE2\u6570\uFF1AS\u304C\u6307\u4EE4\u3055\u308C\u3066\u3044\u307E\u305B\u3093"]];for(let y of h){let g=new C.Diagnostic(new C.Range(new C.Position(d,0),new C.Position(d,m.text.length)),y,C.DiagnosticSeverity.Warning);g.source="NC Code Helper",i.push(g)}}for(let h of p.matchAll(/([ABCXYZ])([^A-Z\s]*)/gi)){if(h.index===void 0||/[A-Z]/i.test(p[h.index-1]??""))continue;let y=h.index+h[1].length,g=h[2],M=h.index+h[0].length;if(p[y]==="["){let E=p.indexOf("]",y+1);E!==-1&&(g=p.slice(y,E+1),M=E+1)}if(/^#\d+$/.test(g)||/^\[[^\]]+\]$/.test(g))continue;let w=new C.Range(new C.Position(d,h.index),new C.Position(d,M));if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(g)||!Number.isFinite(Number(g))){let E=new C.Diagnostic(w,`\u3010\u30A8\u30E9\u30FC\u3011${h[1].toUpperCase()} \u306E\u5024\u300C${g}\u300D\u3092\u6570\u5024\u3068\u3057\u3066\u8A8D\u8B58\u3067\u304D\u307E\u305B\u3093\u3002`,C.DiagnosticSeverity.Error);E.source="NC Code Helper",i.push(E);continue}if(Number(g)!==0&&!g.includes(".")){let E=new C.Diagnostic(w,`\u3010\u6CE8\u610F\u3011${h[1].toUpperCase()} \u306E\u5024\u300C${g}\u300D\u306B\u5C0F\u6570\u70B9\u304C\u3042\u308A\u307E\u305B\u3093\u3002`,C.DiagnosticSeverity.Warning);E.source="NC Code Helper",i.push(E)}}let v=o[d],S=Te(v.spindleTool,v.toolLengthOffset,"H"),A=Te(v.spindleTool,v.toolDiameterOffset,"D"),D=(h,y,g,M,w,N)=>{if(!M)return;let E=new RegExp(`(?<![A-Z])${h}(?:\\[[^\\]]+\\]|#[0-9]+|[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))`,"i").exec(p);if(!E&&w&&!N.test(p))return;let P=E??N.exec(p)??/(?<![A-Z])T(?:\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/i.exec(p),K=(P==null?void 0:P.index)??0,k=P?K+P[0].length:m.text.length,B=new C.Range(new C.Position(d,K),new C.Position(d,k)),L=new C.Diagnostic(B,`\u3010\u6CE8\u610F\u3011\u4F7F\u7528\u5DE5\u5177 (${v.spindleTool}) \u3068${y} (${g}) \u304C\u4E00\u81F4\u3057\u3066\u3044\u307E\u305B\u3093\u3002`,C.DiagnosticSeverity.Warning);L.source="NC Code Helper",i.push(L)};D("H","\u5DE5\u5177\u9577\u88DC\u6B63",v.toolLengthOffset,S,a,/(?<![A-Z])G4[34](?:\.0)?(?=[^0-9.]|$)/i),D("D","\u5DE5\u5177\u5F84\u88DC\u6B63",v.toolDiameterOffset,A,s,/(?<![A-Z])G4[12](?:\.0)?(?=[^0-9.]|$)/i),a=S,s=A}t.set(e.uri,i)}var U=I(require("vscode"));var qe=/(?<![A-Z])([A-Z])(\[[^\]]+\]|#[0-9]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi;function Pe(e,t){return t?"\u2014":e>=60?`${Math.floor(e/60)}\u5206${(e%60).toFixed(1)}\u79D2`:`${e.toFixed(1)}\u79D2`}function et(e,t,n,i,o,a){let s={17:["x","y","z"],18:["z","x","y"],19:["y","z","x"]},f={17:["I","J"],18:["K","I"],19:["J","K"]},c=s[i],l=f[i];if(!c||!l)return;let[r,d,m]=c,p=n.get(l[0]),b=n.get(l[1]),x=n.get("R"),T,v;if(p!==void 0||b!==void 0)T=e[r]+(p??0)*a,v=e[d]+(b??0)*a;else if(x!==void 0){let M=t[r]-e[r],w=t[d]-e[d],N=Math.hypot(M,w),E=Math.abs(x*a);if(N===0||N>2*E)return;let P=(e[r]+t[r])/2,K=(e[d]+t[d])/2,k=Math.sqrt(Math.max(0,E*E-N*N/4)),B=-w/N,L=M/N,_=[{x:P+B*k,y:K+L*k},{x:P-B*k,y:K-L*k}],ee=u=>{let ie=Math.atan2(e.y-u.y,e.x-u.x),H=Math.atan2(t.y-u.y,t.x-u.x)-ie;return o&&H>=0&&(H-=2*Math.PI),!o&&H<=0&&(H+=2*Math.PI),H},R=x<0,Z=_.find(u=>Math.abs(ee(u))>Math.PI===R)??_[0];T=Z.x,v=Z.y}else return;let S=Math.hypot(e[r]-T,e[d]-v),A=Math.hypot(t[r]-T,t[d]-v);if(S===0||!Number.isFinite(S)||!Number.isFinite(A))return;let D=Math.atan2(e[d]-v,e[r]-T),y=Math.atan2(t[d]-v,t[r]-T)-D;o&&y>=0&&(y-=2*Math.PI),!o&&y<=0&&(y+=2*Math.PI),e[r]===t[r]&&e[d]===t[d]&&(p!==void 0||b!==void 0)&&(y=o?-2*Math.PI:2*Math.PI);let g=Math.abs(y)*(S+A)/2;return Math.hypot(g,t[m]-e[m])}function X(e,t,n,i,o,a,s,f){if(!e||t<=0)return;let c=i===void 0?void 0:i*s*(o?a!==void 0?a:Number.NaN:1),l=n?f:c;if(l===void 0||l<=0||!Number.isFinite(l)){n?e.rapidUnknown=!0:e.cuttingUnknown=!0;return}let r=t/l*60;n?e.rapidSeconds+=r:e.cuttingSeconds+=r,e.totalSeconds+=r}function $e(e,t,n,i){return t===void 0?e:n?t*i:e+t*i}function tt(e){let n=U.workspace.getConfiguration("ncCodeHelper").get("rapidTraverseRate",1e4),i=[],o,a={x:0,y:0,z:0},s=0,f=17,c=!0,l=!0,r=!1,d,m,p,b,x=98,T,v,S,A,D=1,h=new Map;for(let y=0;y<e.lineCount;y++){let g=e.lineAt(y).text,M=he(g),w=M?ge(g):ne(g,h),N=/[Nn]\d+/g,E;for(;(E=N.exec(w))!==null;)o={line:y,character:E.index+E[0].length,rapidSeconds:0,cuttingSeconds:0,totalSeconds:0,rapidUnknown:!1,cuttingUnknown:!1,diameterCompensation:void 0},i.push(o);if(M)continue;let P=new Map,K;for(;(K=qe.exec(w))!==null;){let R=K[1].toUpperCase(),Z=K[2],u=ue(Z,h);u===void 0||!Number.isFinite(u)||(P.set(R,u),R==="G"?u>=0&&u<=3?s=u:u===20?l=!1:u===21?l=!0:u===90?c=!0:u===91?c=!1:u===94?r=!1:u===95?r=!0:u===17||u===18||u===19?f=u:[73,81,83,84,85].includes(u)?b=u:u===80?b=void 0:u===98||u===99?x=u:u===40?p=void 0:(u===41||u===42)&&(p=`G${u} ${P.has("D")?`D${P.get("D")}`:"D\u756A\u53F7\u672A\u6307\u5B9A"}`):R==="F"?d=u:R==="S"?m=u:R==="D"&&p&&(p=`${p.split(" ")[0]} D${u}`))}P.has("R")&&(T=P.get("R")),P.has("Z")&&(v=P.get("Z")),P.has("Q")&&(S=P.get("Q")),P.has("P")&&(A=P.get("P")),D=Math.max(1,Math.floor(P.get("K")??1)),p&&o&&s!==0&&(o.diameterCompensation=p);let k=l?1:25.4,B=["X","Y","Z"].some(R=>P.has(R));if(b!==void 0&&B){let R=a,Z={x:$e(a.x,P.get("X"),c,k),y:$e(a.y,P.get("Y"),c,k),z:a.z};if(T===void 0||v===void 0){o&&(o.cuttingUnknown=!0);continue}let u=$e(R.z,T,c,k),ie=c?v*k:u+v*k,be=x===98?R.z:u,H=S===void 0?void 0:Math.abs(S*k),me=Math.abs(ie-u),xe=(b===73||b===83)&&H&&H>0?Math.max(1,Math.ceil(me/H)):1;(b===73||b===83)&&(!H||H<=0)&&o&&(o.cuttingUnknown=!0);for(let Ae=0;Ae<D;Ae++){let se={x:Z.x,y:Z.y,z:R.z};X(o,Math.hypot(se.x-a.x,se.y-a.y,se.z-a.z),!0,d,r,m,k,n);let Ve={...se,z:u};if(X(o,Math.abs(Ve.z-se.z),!0,d,r,m,k,n),(b===73||b===83)&&xe>1&&H){let re=Math.sign(ie-u);for(let ae=0;ae<xe;ae++){let Ee=u+re*Math.min(me,ae*H),Ne=u+re*Math.min(me,(ae+1)*H);b===83&&X(o,Math.abs(Ee-u),!0,d,r,m,k,n),X(o,Math.abs(Ne-Ee),!1,d,r,m,k,n),b===83&&ae<xe-1&&X(o,Math.abs(Ne-u),!0,d,r,m,k,n)}}else X(o,me,!1,d,r,m,k,n);let je=b===84||b===85;if(X(o,Math.abs(ie-be),!je,d,r,m,k,n),A!==void 0&&A>0&&o){let re=A/1e3;o.cuttingSeconds+=re,o.totalSeconds+=re}}a={...Z,z:be};continue}if(!B||s<0||s>3)continue;let L=a,_={...a};for(let R of["X","Y","Z"]){let Z=P.get(R);Z!==void 0&&(_[R.toLowerCase()]=c?Z*k:a[R.toLowerCase()]+Z*k)}let ee;s===2||s===3?ee=et(L,_,P,f,s===2,k)??Math.hypot(_.x-L.x,_.y-L.y,_.z-L.z):ee=Math.hypot(_.x-L.x,_.y-L.y,_.z-L.z),a=_,!(!o||ee===0)&&(X(o,ee,s===0,d,r,m,k,n),s!==0&&p&&(o.diameterCompensation=p))}return i}var ke=class{constructor(){this.changeEmitter=new U.EventEmitter;this.onDidChangeInlayHints=this.changeEmitter.event}provideInlayHints(t,n){return J(t)?tt(t).filter(o=>o.line>=n.start.line&&o.line<=n.end.line).map(o=>{let a=`\u65E9\u9001\u308A ${Pe(o.rapidSeconds,o.rapidUnknown)} / \u5207\u524A ${Pe(o.cuttingSeconds,o.cuttingUnknown)} / \u5408\u8A08 ${Pe(o.totalSeconds,o.rapidUnknown||o.cuttingUnknown)}`,s=new U.InlayHint(new U.Position(o.line,t.lineAt(o.line).text.length),a,U.InlayHintKind.Type);return s.paddingLeft=!0,s}):[]}dispose(){this.changeEmitter.dispose()}refresh(){this.changeEmitter.fire()}};function _e(e){let t=new ke;e.subscriptions.push(U.languages.registerInlayHintsProvider([{language:"gcode"},{language:"nc"}],t),t,U.workspace.onDidChangeConfiguration(n=>{n.affectsConfiguration("ncCodeHelper.rapidTraverseRate")&&t.refresh()}))}function Ze(e){if(!(!e||e.languageId==="gcode"||e.languageId==="nc"))try{J(e)&&O.languages.setTextDocumentLanguage(e,"gcode").then(t=>{let n=O.window.activeTextEditor;(n==null?void 0:n.document)===t&&te()},t=>console.error("[NC Code Helper] Failed to set document language.",t))}catch(t){console.error("[NC Code Helper] Failed to detect or set document language.",t)}}function nt(e){e.subscriptions.push(O.workspace.onDidOpenTextDocument(o=>{Ze(o)})),O.window.activeTextEditor&&Ze(O.window.activeTextEditor.document);let{machineDataProvider:t,colorDataProvider:n}=Fe(e),i=new oe(e.extensionUri);e.subscriptions.push(O.window.registerWebviewViewProvider(oe.viewType,i)),He(e),Oe(e),_e(e),Le(e),ze(e,t,i),Ue(e,i),O.window.onDidChangeActiveTextEditor(o=>{try{i.updateProgramState(o),o&&te()}catch(a){console.error("[NC Code Helper] Failed to update active editor state.",a)}},null,e.subscriptions),O.window.onDidChangeTextEditorSelection(o=>{try{i.updateProgramState(o.textEditor)}catch(a){console.error("[NC Code Helper] Failed to update state after cursor movement.",a)}},null,e.subscriptions),O.workspace.onDidChangeTextDocument(o=>{try{O.window.activeTextEditor&&o.document===O.window.activeTextEditor.document&&(te(),i.updateProgramState(O.window.activeTextEditor))}catch(a){console.error("[NC Code Helper] Failed to update after document change.",a)}},null,e.subscriptions),O.workspace.onDidChangeConfiguration(o=>{o.affectsConfiguration("ncCodeHelper")&&(Me(),te(),n.refresh())},null,e.subscriptions),i.updateProgramState(O.window.activeTextEditor),te()}function ot(){}0&&(module.exports={activate,deactivate});
