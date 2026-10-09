"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register3DViewer = register3DViewer;
const vscode = require("vscode");
const path = require("path");
function register3DViewer(context) {
    context.subscriptions.push(vscode.commands.registerCommand('ncCodeHelper.show3DViewer', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('NCファイルが開かれていません');
            return;
        }
        const panel = vscode.window.createWebviewPanel('nc3dViewer', 'NC 3D 軌跡プレビュー', vscode.ViewColumn.Beside, {
            enableScripts: true,
            // ローカルリソースのアクセスを許可するディレクトリを指定
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'three'))
            ]
        });
        // ローカルの three.js ファイルパスを Webview 用 URI に変換
        const threeJsUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'three', 'build', 'three.min.js')));
        const orbitControlsUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'three', 'examples', 'js', 'controls', 'OrbitControls.js')));
        // Webview に HTML をセット
        panel.webview.html = getWebviewContent(threeJsUri, orbitControlsUri);
        // Gコード送信処理
        const updateWebview = () => {
            if (editor) {
                const text = editor.document.getText();
                panel.webview.postMessage({ command: 'parseGCode', text });
            }
        };
        // 初回描画
        updateWebview();
        // テキスト変更時のリアルタイム更新
        const changeDocSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document === editor.document) {
                updateWebview();
            }
        });
        panel.onDidDispose(() => {
            changeDocSubscription.dispose();
        });
    }));
}
function getWebviewContent(threeJsUri, orbitControlsUri) {
    return /* html */ `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' ${threeJsUri.scheme}:; style-src 'unsafe-inline';">
            <style>
                body { margin: 0; overflow: hidden; background-color: #1e1e1e; }
                #canvas-container { width: 100vw; height: 100vh; }
            </style>
            <!-- ローカルから安全に読み込み -->
            <script src="${threeJsUri}"></script>
            <script src="${orbitControlsUri}"></script>
        </head>
        <body>
            <div id="canvas-container"></div>
            <script>
                const container = document.getElementById('canvas-container');
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0x1e1e1e);

                const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
                camera.position.set(100, -100, 100);
                camera.up.set(0, 0, 1);

                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                container.appendChild(renderer.domElement);

                const controls = new THREE.OrbitControls(camera, renderer.domElement);
                
                const axesHelper = new THREE.AxesHelper(50);
                scene.add(axesHelper);

                let currentPathGroup = null;

                function parseAndDrawGCode(text) {
                    if (currentPathGroup) scene.remove(currentPathGroup);

                    const lines = text.split('\\n');
                    const g0Points = [];
                    const g1Points = [];

                    let currentPos = { x: 0, y: 0, z: 0 };
                    let currentMotion = 'G00';

                    for (let line of lines) {
                        line = line.split('(')[0].trim().toUpperCase();
                        if (!line) continue;

                        if (line.includes('G00') || line.includes('G0')) currentMotion = 'G00';
                        if (line.includes('G01') || line.includes('G1')) currentMotion = 'G01';

                        const xMatch = line.match(/X(-?\\d+\\.?\\d*)/);
                        const yMatch = line.match(/Y(-?\\d+\\.?\\d*)/);
                        const zMatch = line.match(/Z(-?\\d+\\.?\\d*)/);

                        const newPos = {
                            x: xMatch ? parseFloat(xMatch[1]) : currentPos.x,
                            y: yMatch ? parseFloat(yMatch[1]) : currentPos.y,
                            z: zMatch ? parseFloat(zMatch[1]) : currentPos.z
                        };

                        if (xMatch || yMatch || zMatch) {
                            if (currentMotion === 'G00') {
                                g0Points.push(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));
                                g0Points.push(new THREE.Vector3(newPos.x, newPos.y, newPos.z));
                            } else {
                                g1Points.push(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));
                                g1Points.push(new THREE.Vector3(newPos.x, newPos.y, newPos.z));
                            }
                            currentPos = { ...newPos };
                        }
                    }

                    const group = new THREE.Group();

                    // 早送り（G00）: 赤点線
                    if (g0Points.length > 0) {
                        const matG0 = new THREE.LineDashedMaterial({ color: 0xff4444, dashSize: 2, gapSize: 1 });
                        const geomG0 = new THREE.BufferGeometry().setFromPoints(g0Points);
                        const lineG0 = new THREE.LineSegments(geomG0, matG0);
                        lineG0.computeLineDistances();
                        group.add(lineG0);
                    }

                    // 切削送り（G01）: 緑実線
                    if (g1Points.length > 0) {
                        const matG1 = new THREE.LineBasicMaterial({ color: 0x00ff88 });
                        const geomG1 = new THREE.BufferGeometry().setFromPoints(g1Points);
                        const lineG1 = new THREE.LineSegments(geomG1, matG1);
                        group.add(lineG1);
                    }

                    currentPathGroup = group;
                    scene.add(currentPathGroup);
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'parseGCode') {
                        parseAndDrawGCode(message.text);
                    }
                });

                function animate() {
                    requestAnimationFrame(animate);
                    controls.update();
                    renderer.render(scene, camera);
                }
                animate();

                window.addEventListener('resize', () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                });
            </script>
        </body>
        </html>
    `;
}
//# sourceMappingURL=viewer3d.js.map