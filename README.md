
# 🚀 AreYouSureSQL
 Preview affected rows for DELETE and UPDATE queries before execution in VS Code.
 ---
## 🔍 Overview

AreYouSureSQL is a Visual Studio Code extension that helps you safely preview the number of rows affected by your DELETE and UPDATE SQL queries before you run them. This prevents accidental data loss or unintended updates by showing the potential impact right above your SQL statements.

---
## ✨ Features

-	✅ Automatic CodeLens preview: Shows a clickable Preview affected rows button above DELETE/UPDATE queries in .sql files.
- 🔢 Affected rows count: Displays the exact number of rows your query will affect.
- 🎯 Works with SQLite (in-memory): Uses SQLite for quick local query simulation.
- ⚡ No manual steps: The CodeLens updates dynamically as you edit your SQL queries.
- 💡 User-friendly messages: Shows clear info or error messages on command execution.
---
## 📦 Installation

Clone or download the repository:
```bash
   git clone https://github.com/GitInitSaurabh/areyousuresql.git 
   ```
```bash
   cd areyousuresql
```

Install dependencies:
```bash
   npm install
```

Compile the extension:
```bash
   npm run compile
```

Launch the extension in VS Code:
   Press F5 to open a new Extension Development Host window with the extension enabled.

---
## 🛠 Usage
1. Open any .sql file in VS Code.
2. Write a DELETE or UPDATE SQL query with a WHERE clause, for example:
   DELETE FROM users WHERE age > 30;
3. Above your query, you will see a Preview affected rows CodeLens button.
4. Click the button to show how many rows will be affected.
5. Adjust your query if needed before execution.
---
## 💻 Example
-- CodeLens appears above this line:
DELETE FROM users WHERE age > 30;
You will see the button:

Preview affected rows (2)

Indicating 2 rows would be deleted if the query ran.
---
⚙️ Commands
| Command | Description |
| ------- | ----------- |
| AreYouSureSQL.previewAffectedRows | Preview affected rows for the query |
You can run the command from the Command Palette (Ctrl+Shift+P / Cmd+Shift+P).
---
🧩 How It Works
- The extension registers a CodeLensProvider for .sql files.
- It detects lines containing DELETE FROM or UPDATE queries with a WHERE clause.
- Above those lines, it shows a Preview affected rows button.
- Clicking the button runs a SELECT COUNT(*) on an in-memory SQLite database simulating the query's effect.
- The button label dynamically updates to include the number of affected rows.
---
## 🧑‍💻 Development
- Written in TypeScript.
- Uses VS Code Extension API.
- Uses sqlite3 for SQLite operations.
- Compiled with TypeScript compiler (tsc).
- Use npm run watch for live compilation during development.
---
## 🤝 Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (git checkout -b feature/my-feature).
3. Commit your changes (git commit -m 'Add new feature').
4. Push to your branch (git push origin feature/my-feature).
5. Open a pull request describing your changes.

Please ensure your code adheres to the project’s style and passes existing tests.
---
## 📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
---
## 🙏 Acknowledgments
Thanks for checking out AreYouSureSQL! Stay safe with your SQL queries! 🚀

Made with ❤️ by Your Name (https://github.com/GitInitSaurabh)
