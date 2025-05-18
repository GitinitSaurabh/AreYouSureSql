import * as vscode from 'vscode';
import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

class SqlCodeLensProvider implements vscode.CodeLensProvider {
  public rowCounts: Map<number, number> = new Map();
  private codeLenses: vscode.CodeLens[] = [];
  private regexDelete = /^delete\s+from\s+([^\s]+)\s+where\s+.+/i;
  private regexUpdate = /^update\s+([^\s]+)\s+set\s+.+\s+where\s+.+/i;

  public _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

  constructor() {
    vscode.workspace.onDidChangeTextDocument(() => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] {
    this.codeLenses = [];

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      if (this.regexDelete.test(line.text) || this.regexUpdate.test(line.text)) {
        const range = new vscode.Range(i, 0, i, line.text.length);
        const count = this.rowCounts.get(i);
        const title = count !== undefined ? `Preview affected rows (${count})` : "Preview affected rows";
        this.codeLenses.push(
          new vscode.CodeLens(range, {
            title,
            command: "AreYouSureSQL.previewAffectedRows",
            arguments: [document, range, i] // pass line number
          })
        );
      }
    }

    return this.codeLenses;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const codeLensProvider = new SqlCodeLensProvider();
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider({ language: 'sql' }, codeLensProvider)
  );

  let disposable = vscode.commands.registerCommand(
    'AreYouSureSQL.previewAffectedRows',
    async (document: vscode.TextDocument, range: vscode.Range, lineNumber: number) => {
      const query = document.getText(range).trim();
      console.log('previewAffectedRows command called');
      vscode.window.showInformationMessage('Command executed!');

      const countQuery = buildCountQuery(query);
      console.log("Query:", query);
      console.log('Generated COUNT query:', countQuery);

      if (!countQuery) {
        vscode.window.showErrorMessage('Failed to parse SQL query.');
        return;
      }

      const db = new sqlite.Database(':memory:');

      db.serialize(() => {
        db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)');
        db.run('INSERT INTO users (name, age) VALUES ("Alice", 30), ("Bob", 25), ("Charlie", 35)');

        db.get(countQuery, (err, row) => {
          if (err) {
            vscode.window.showErrorMessage('Error executing count query: ' + err.message);
            db.close();
            return;
          }
          const count = row ? Object.values(row)[0] : 0;
          vscode.window.showInformationMessage(`Affected rows: ${count}`);

          // Update row count and refresh CodeLens
          codeLensProvider.rowCounts.set(lineNumber, count);
          codeLensProvider._onDidChangeCodeLenses.fire();

          db.close();
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

function buildCountQuery(query: string): string | null {
  // Remove trailing semicolon and normalize spaces
  query = query.trim().replace(/;$/, '').replace(/\n/g, ' ');

  const deleteMatch = query.match(/\bdelete\s+from\s+([^\s]+)\s+where\s+(.+)/i);
  if (deleteMatch) {
    const [, table, where] = deleteMatch;
    return `SELECT COUNT(*) AS count FROM ${table} WHERE ${where}`;
  }

  const updateMatch = query.match(/\bupdate\s+([^\s]+)\s+set\s+.+?\s+where\s+(.+)/i);
  if (updateMatch) {
    const [, table, where] = updateMatch;
    return `SELECT COUNT(*) AS count FROM ${table} WHERE ${where}`;
  }

  return null;
}

export function deactivate() {}
