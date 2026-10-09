"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorTreeDataProvider = exports.MachineTreeDataProvider = exports.CategoryTreeItem = void 0;
exports.getStorageMachineFolder = getStorageMachineFolder;
exports.registerTreeview = registerTreeview;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const categories_1 = require("./categories");
// 拡張機能専用フォルダのパスを取得・作成する関数
function getStorageMachineFolder(context) {
    const storagePath = context.globalStorageUri.fsPath;
    const machineFolder = path.join(storagePath, 'machines');
    if (!fs.existsSync(machineFolder)) {
        fs.mkdirSync(machineFolder, { recursive: true });
    }
    // 初回起動時、sample.json が存在しなければデフォルトで作成
    const samplePath = path.join(machineFolder, 'sample.json');
    if (!fs.existsSync(samplePath)) {
        const sampleData = {
            "machine": "sample",
            "description": "マシニングセンタ用 Mコード",
            "version": "1.0.0",
            "mCodes": {
                "M00": "プログラムストップ",
                "M01": "オプショナルストップ",
                "M02": "プログラム終了",
                "M03": "主軸正転",
                "M04": "主軸逆転",
                "M05": "主軸停止",
                "M06": "工具交換（ATC）",
                "M08": "クーラント ON",
                "M09": "クーラント OFF",
                "M10": "A/C軸クランプ",
                "M11": "A/C軸アンクランプ",
                "M30": "プログラム終了（リセット・復帰）",
                "M100": "センタクーラント ON",
                "M101": "センタクーラント OFF"
            }
        };
        fs.writeFileSync(samplePath, JSON.stringify(sampleData, null, 2), 'utf8');
    }
    return machineFolder;
}
// ツリービュー（サイドバー）の各ノード要素を表現
class CategoryTreeItem extends vscode.TreeItem {
    constructor(label, collapsibleState, category, isEnabled, machineName, isAddButton) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.category = category;
        this.machineName = machineName;
        this.isAddButton = isAddButton;
        // 1: 新規設備(JSON)追加ボタン
        if (isAddButton) {
            this.iconPath = new vscode.ThemeIcon('add');
            this.tooltip = '新しい設備Mコード定義(JSON)を追加';
            this.contextValue = 'addMachineItem';
            this.command = {
                command: 'ncCodeHelper.addMachineJson',
                title: 'Add Machine JSON'
            };
        }
        // 2: NCコード表示色カテゴリ
        else if (category) {
            this.iconPath = new vscode.ThemeIcon(category.icon);
            this.tooltip = `${category.label} のハイライト表示切替`;
            // カラー設定側は有効・無効切り替え用チェックボックスを保持
            this.checkboxState = isEnabled
                ? vscode.TreeItemCheckboxState.Checked
                : vscode.TreeItemCheckboxState.Unchecked;
            this.contextValue = 'categoryItem';
        }
        // 3: 各設備のJSON定義（クリック動作を優先するためチェックボックスを排斥）
        else if (machineName) {
            this.iconPath = new vscode.ThemeIcon('wrench');
            this.tooltip = `クリックして ${machineName} のMコード一覧を表示`;
            this.contextValue = 'machineItem';
            // ★ チェックボックス（this.checkboxState）を設定しないことで、
            // クリック時にチェック処理へ横取りされず確実にコマンドを実行させる
            this.command = {
                command: 'ncCodeHelper.openMachineJson',
                title: 'Open Machine JSON',
                arguments: [machineName]
            };
        }
    }
}
exports.CategoryTreeItem = CategoryTreeItem;
// ==========================================
// 1. 設備一覧用 TreeDataProvider
// ==========================================
class MachineTreeDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element)
            return [];
        const folder = getStorageMachineFolder(this.context);
        const items = [];
        // 専用フォルダ内の .json ファイルをすべて一覧表示
        if (fs.existsSync(folder)) {
            const files = fs.readdirSync(folder).filter(file => file.endsWith('.json'));
            files.forEach(file => {
                const machineName = path.basename(file, '.json');
                items.push(new CategoryTreeItem(machineName, vscode.TreeItemCollapsibleState.None, undefined, undefined, machineName, false));
            });
        }
        // 末尾に「新規追加」ボタンを配置
        items.push(new CategoryTreeItem('新規設備を追加...', vscode.TreeItemCollapsibleState.None, undefined, undefined, undefined, true));
        return items;
    }
}
exports.MachineTreeDataProvider = MachineTreeDataProvider;
// ==========================================
// 2. NCカラー表示設定用 TreeDataProvider
// ==========================================
class ColorTreeDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element)
            return [];
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        return categories_1.categories.map(cat => {
            const isEnabled = config.get(cat.key, true);
            return new CategoryTreeItem(cat.label, vscode.TreeItemCollapsibleState.None, cat, isEnabled);
        });
    }
}
exports.ColorTreeDataProvider = ColorTreeDataProvider;
// ==========================================
// ツリービューの登録処理
// ==========================================
function registerTreeview(context) {
    const machineDataProvider = new MachineTreeDataProvider(context);
    const colorDataProvider = new ColorTreeDataProvider(context);
    // 1. 設備一覧ビューの登録
    const machineTreeView = vscode.window.createTreeView('ncCodeHelperMachinesView', {
        treeDataProvider: machineDataProvider,
        showCollapseAll: false
    });
    context.subscriptions.push(machineTreeView);
    // 設備のチェックボックス変更ハンドラ
    context.subscriptions.push(machineTreeView.onDidChangeCheckboxState(async (event) => {
        let selectedMachines = context.globalState.get('selectedMachines', []);
        for (const [item, state] of event.items) {
            if (item.machineName) {
                if (state === vscode.TreeItemCheckboxState.Checked) {
                    if (!selectedMachines.includes(item.machineName)) {
                        selectedMachines.push(item.machineName);
                    }
                }
                else {
                    selectedMachines = selectedMachines.filter(name => name !== item.machineName);
                }
            }
        }
        await context.globalState.update('selectedMachines', selectedMachines);
        machineDataProvider.refresh();
    }));
    // 2. カラー表示設定ビューの登録
    const colorTreeView = vscode.window.createTreeView('ncCodeHelperCategoryView', {
        treeDataProvider: colorDataProvider,
        showCollapseAll: false
    });
    context.subscriptions.push(colorTreeView);
    context.subscriptions.push(colorTreeView.onDidChangeCheckboxState(async (event) => {
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        for (const [item, state] of event.items) {
            if (item.category) {
                const isChecked = state === vscode.TreeItemCheckboxState.Checked;
                await config.update(item.category.key, isChecked, vscode.ConfigurationTarget.Global);
            }
        }
    }));
    return { machineDataProvider, colorDataProvider };
}
//# sourceMappingURL=treeview.js.map