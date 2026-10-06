"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryTreeDataProvider = exports.CategoryTreeItem = void 0;
exports.registerTreeview = registerTreeview;
const vscode = require("vscode");
const categories_1 = require("./categories");
class CategoryTreeItem extends vscode.TreeItem {
    constructor(category, isEnabled) {
        super(category.label, vscode.TreeItemCollapsibleState.None);
        this.category = category;
        this.iconPath = new vscode.ThemeIcon(category.icon);
        this.tooltip = `${category.label} のハイライト表示切替`;
        this.checkboxState = isEnabled
            ? vscode.TreeItemCheckboxState.Checked
            : vscode.TreeItemCheckboxState.Unchecked;
    }
}
exports.CategoryTreeItem = CategoryTreeItem;
class CategoryTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        return categories_1.categories.map(cat => {
            const isEnabled = config.get(cat.key, true);
            return new CategoryTreeItem(cat, isEnabled);
        });
    }
}
exports.CategoryTreeDataProvider = CategoryTreeDataProvider;
function registerTreeview(context) {
    const treeDataProvider = new CategoryTreeDataProvider();
    const treeview = vscode.window.createTreeView('ncCodeHelperCategoryView', {
        treeDataProvider: treeDataProvider,
        showCollapseAll: false
    });
    context.subscriptions.push(treeview);
    context.subscriptions.push(treeview.onDidChangeCheckboxState(async (event) => {
        const config = vscode.workspace.getConfiguration('ncCodeHelper');
        for (const [item, state] of event.items) {
            const isChecked = state === vscode.TreeItemCheckboxState.Checked;
            await config.update(item.category.key, isChecked, vscode.ConfigurationTarget.Global);
        }
    }));
    return treeDataProvider;
}
//# sourceMappingURL=treeview.js.map