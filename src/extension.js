"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let disposable = vscode.commands.registerCommand('AreYouSureSQL.previewAffectedRows', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const query = editor.document.getText(editor.selection).trim();
        if (!query.toLowerCase().startsWith('delete') && !query.toLowerCase().startsWith('update')) {
            vscode.window.showInformationMessage('Only DELETE or UPDATE queries are supported.');
            return;
        }
        const countQuery = buildCountQuery(query);
        if (!countQuery) {
            vscode.window.showErrorMessage('Failed to parse SQL query.');
            return;
        }
        // Placeholder: you would replace this with actual DB execution later
        vscode.window.showInformationMessage(`Preview Query:\n${countQuery}\n\n(This would affect 123 rows.)`);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function buildCountQuery(query) {
    const deleteMatch = query.match(/^delete\s+from\s+([^\s]+)\s+where\s+(.+)/i);
    const updateMatch = query.match(/^update\s+([^\s]+)\s+set\s+.+?\s+where\s+(.+)/i);
    if (deleteMatch) {
        const [, table, where] = deleteMatch;
        return `SELECT COUNT(*) FROM ${table} WHERE ${where}`;
    }
    if (updateMatch) {
        const [, table, where] = updateMatch;
        return `SELECT COUNT(*) FROM ${table} WHERE ${where}`;
    }
    return null;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map