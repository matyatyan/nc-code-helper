import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { CategoryConfig } from './types';
import { categories } from './categories';

// 拡張機能専用フォルダのパスを取得・作成する関数
export function getStorageMachineFolder(context: vscode.ExtensionContext): string {
    const storagePath = context.globalStorageUri.fsPath;
    const machineFolder = path.join(storagePath, 'machines');
    
    if (!fs.existsSync(machineFolder)) {
        fs.mkdirSync(machineFolder, { recursive: true });
    }
    return machineFolder;
}

export class CategoryTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly category?: CategoryConfig,
        isEnabled?: boolean,
        public readonly machineName?: string,
        public readonly isAddButton?: boolean,
        public readonly isMachineChecked?: boolean
    ) {
        super(label, collapsibleState);

        if (isAddButton) {
            this.iconPath = new vscode.ThemeIcon('add');
            this.tooltip = '新しい設備Mコード定義(JSON)を追加';
            this.contextValue = 'addMachineItem';
            this.command = {
                command: 'ncCodeHelper.addMachineJson',
                title: 'Add Machine JSON'
            };
        } else if (category) {
            this.iconPath = new vscode.ThemeIcon(category.icon);
            this.tooltip = `${category.label} のハイライト表示切替`;
            this.checkboxState = isEnabled
                ? vscode.TreeItemCheckboxState.Checked
                : vscode.TreeItemCheckboxState.Unchecked;
            this.contextValue = 'categoryItem';
        } else if (machineName) {
            this.iconPath = new vscode.ThemeIcon('wrench');
            this.tooltip = `クリックして ${machineName}.json を開く`;
            this.contextValue = 'machineItem';
            
            // 設備アイテムにチェックボックスを設定
            this.checkboxState = isMachineChecked
                ? vscode.TreeItemCheckboxState.Checked
                : vscode.TreeItemCheckboxState.Unchecked;

            this.command = {
                command: 'ncCodeHelper.openMachineJson',
                title: 'Open Machine JSON',
                arguments: [machineName]
            };
        }
    }
}

// ==========================================
// 1. 設備一覧用 TreeDataProvider
// ==========================================
export class MachineTreeDataProvider implements vscode.TreeDataProvider<CategoryTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<CategoryTreeItem | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CategoryTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CategoryTreeItem): vscode.ProviderResult<CategoryTreeItem[]> {
        if (element) return [];

        const folder = getStorageMachineFolder(this.context);
        const items: CategoryTreeItem[] = [];

        // 保存されているチェック選択済み設備リストを取得
        const selectedMachines = this.context.globalState.get<string[]>('selectedMachines', []);

        // 専用フォルダ内の .json ファイルをすべて一覧表示
        if (fs.existsSync(folder)) {
            const files = fs.readdirSync(folder).filter(file => file.endsWith('.json'));
            files.forEach(file => {
                const machineName = path.basename(file, '.json');
                const isChecked = selectedMachines.includes(machineName);
                
                items.push(new CategoryTreeItem(
                    machineName,
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    undefined,
                    machineName,
                    false,
                    isChecked
                ));
            });
        }

        // 末尾に「新規追加」ボタンを配置
        items.push(new CategoryTreeItem('新規設備を追加...', vscode.TreeItemCollapsibleState.None, undefined, undefined, undefined, true));

        return items;
    }
}

// ==========================================
// 2. NCカラー表示設定用 TreeDataProvider
// ==========================================
export class ColorTreeDataProvider implements vscode.TreeDataProvider<CategoryTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<CategoryTreeItem | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CategoryTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CategoryTreeItem): vscode.ProviderResult<CategoryTreeItem[]> {
        if (element) return [];

        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        return categories.map(cat => {
            const isEnabled = config.get<boolean>(cat.key, true);
            return new CategoryTreeItem(cat.label, vscode.TreeItemCollapsibleState.None, cat, isEnabled);
        });
    }
}

// ==========================================
// ツリービューの登録処理
// ==========================================
export function registerTreeview(context: vscode.ExtensionContext) {
    const machineDataProvider = new MachineTreeDataProvider(context);
    const colorDataProvider = new ColorTreeDataProvider(context);

    // 1. 設備一覧ビューの登録
    const machineTreeView = vscode.window.createTreeView('ncCodeHelperMachinesView', {
        treeDataProvider: machineDataProvider,
        showCollapseAll: false
    });
    context.subscriptions.push(machineTreeView);

    // 設備のチェックボックス変更ハンドラ
    context.subscriptions.push(
        machineTreeView.onDidChangeCheckboxState(async (event) => {
            let selectedMachines = context.globalState.get<string[]>('selectedMachines', []);
            
            for (const [item, state] of event.items) {
                if (item.machineName) {
                    if (state === vscode.TreeItemCheckboxState.Checked) {
                        if (!selectedMachines.includes(item.machineName)) {
                            selectedMachines.push(item.machineName);
                        }
                    } else {
                        selectedMachines = selectedMachines.filter(name => name !== item.machineName);
                    }
                }
            }
            await context.globalState.update('selectedMachines', selectedMachines);
            machineDataProvider.refresh();
        })
    );

    // 2. カラー表示設定ビューの登録
    const colorTreeView = vscode.window.createTreeView('ncCodeHelperCategoryView', {
        treeDataProvider: colorDataProvider,
        showCollapseAll: false
    });
    context.subscriptions.push(colorTreeView);

    context.subscriptions.push(
        colorTreeView.onDidChangeCheckboxState(async (event) => {
            const config = vscode.workspace.getConfiguration('ncCodeHelper');
            for (const [item, state] of event.items) {
                if (item.category) {
                    const isChecked = state === vscode.TreeItemCheckboxState.Checked;
                    await config.update(item.category.key, isChecked, vscode.ConfigurationTarget.Global);
                }
            }
        })
    );

    return { machineDataProvider, colorDataProvider };
}