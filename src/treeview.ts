import * as vscode from 'vscode';
import { CategoryConfig } from './types';
import { categories } from './categories';

export class CategoryTreeItem extends vscode.TreeItem {
    constructor(public readonly category: CategoryConfig, isEnabled: boolean) {
        super(category.label, vscode.TreeItemCollapsibleState.None);

        this.iconPath = new vscode.ThemeIcon(category.icon);
        this.tooltip = `${category.label} のハイライト表示切替`;
        this.checkboxState = isEnabled
            ? vscode.TreeItemCheckboxState.Checked
            : vscode.TreeItemCheckboxState.Unchecked;
    }
}

export class CategoryTreeDataProvider implements vscode.TreeDataProvider<CategoryTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CategoryTreeItem | undefined | void> = new vscode.EventEmitter<CategoryTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<CategoryTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CategoryTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): vscode.ProviderResult<CategoryTreeItem[]> {
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        return categories.map(cat => {
            const isEnabled = config.get<boolean>(cat.key, true);
            return new CategoryTreeItem(cat, isEnabled);
        });
    }
}

export function registerTreeview(context: vscode.ExtensionContext): CategoryTreeDataProvider {
    const treeDataProvider = new CategoryTreeDataProvider();
    const treeview = vscode.window.createTreeView('ncCodeHelperCategoryView', {
        treeDataProvider: treeDataProvider,
        showCollapseAll: false
    });
    context.subscriptions.push(treeview);

    context.subscriptions.push(
        treeview.onDidChangeCheckboxState(async (event) => {
            const config = vscode.workspace.getConfiguration('ncCodeHelper');
            for (const [item, state] of event.items) {
                const isChecked = state === vscode.TreeItemCheckboxState.Checked;
                await config.update(item.category.key, isChecked, vscode.ConfigurationTarget.Global);
            }
        })
    );

    return treeDataProvider;
}