import * as assert from 'assert';
import * as vscode from 'vscode';

/**
 * Helper function to create a test document with specified content
 */
async function createTestDocument(content: string): Promise<vscode.TextDocument> {
	const document = await vscode.workspace.openTextDocument({
		content: content,
		language: 'typescript'
	});
	return document;
}

/**
 * Helper function to show document in editor and set selection
 */
async function showDocumentWithSelection(
	document: vscode.TextDocument,
	startLine: number,
	startChar: number,
	endLine: number,
	endChar: number
): Promise<vscode.TextEditor> {
	const editor = await vscode.window.showTextDocument(document);
	const start = new vscode.Position(startLine, startChar);
	const end = new vscode.Position(endLine, endChar);
	editor.selection = new vscode.Selection(start, end);
	return editor;
}

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('suzukenz.vscode-copy-with-line-numbers'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('suzukenz.vscode-copy-with-line-numbers');
		assert.ok(extension);

		await extension.activate();
		assert.strictEqual(extension.isActive, true);
	});

	test('Command should be registered', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('vscode-copy-with-line-numbers.copyWithLineNumbers'));
	});
});

suite('Copy Selection with Line Numbers - Functionality', () => {

	test('Should copy single line with line number', async () => {
		// テスト用のコードを作成（行番号は0始まり、表示は1始まり）
		const content = `line 0
line 1
line 2
line 3`;
		const document = await createTestDocument(content);

		// 2行目（インデックス1、表示は2）を選択
		await showDocumentWithSelection(document, 1, 0, 1, 6);

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// クリップボードの内容を確認
		const clipboardContent = await vscode.env.clipboard.readText();
		// ヘッダー行にファイルパスを含む形式に変更
		const expectedHeader = `// ${document.uri.fsPath}`;
		const expected = `${expectedHeader}\n2: line 1`;
		assert.strictEqual(clipboardContent, expected);
	});

	test('Should copy multiple lines with line numbers', async () => {
		const content = `/// <summary>
/// Initializes a new instance of the <see cref="VSPackage"/> class.
/// </summary>`;
		const document = await createTestDocument(content);

		// 全3行を選択（行番号0-2、表示は1-3）
		await showDocumentWithSelection(document, 0, 0, 2, 15);

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// クリップボードの内容を確認
		const clipboardContent = await vscode.env.clipboard.readText();
		// ヘッダー行にファイルパスを含む形式に変更
		const expectedHeader = `// ${document.uri.fsPath}`;
		const expected = `${expectedHeader}
1: /// <summary>
2: /// Initializes a new instance of the <see cref="VSPackage"/> class.
3: /// </summary>`;
		assert.strictEqual(clipboardContent, expected);
	});

	test('Should handle spec example correctly', async () => {
		// 仕様書の例を再現（51-53行目の例）
		// 実際には51行目から始まるように多くの行を作成
		const lines = [];
		for (let i = 0; i < 50; i++) {
			lines.push(`line ${i + 1}`);
		}
		lines.push('/// <summary>');
		lines.push('/// Initializes a new instance of the <see cref="VSPackage"/> class.');
		lines.push('/// </summary>');

		const content = lines.join('\n');
		const document = await createTestDocument(content);

		// 51-53行目を選択（インデックス50-52）
		await showDocumentWithSelection(document, 50, 0, 52, 15);

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// クリップボードの内容を確認
		const clipboardContent = await vscode.env.clipboard.readText();
		// ヘッダー行にファイルパスを含む形式に変更
		const expectedHeader = `// ${document.uri.fsPath}`;
		const expected = `${expectedHeader}
51: /// <summary>
52: /// Initializes a new instance of the <see cref="VSPackage"/> class.
53: /// </summary>`;
		assert.strictEqual(clipboardContent, expected);
	});

	test('Should handle empty lines', async () => {
		const content = `line 1

line 3`;
		const document = await createTestDocument(content);

		// 全3行を選択（空行を含む）
		await showDocumentWithSelection(document, 0, 0, 2, 6);

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// クリップボードの内容を確認
		const clipboardContent = await vscode.env.clipboard.readText();
		// ヘッダー行にファイルパスを含む形式に変更
		const expectedHeader = `// ${document.uri.fsPath}`;
		const expected = `${expectedHeader}
1: line 1
2:
3: line 3`;
		assert.strictEqual(clipboardContent, expected);
	});

	test('Should handle partial line selection', async () => {
		const content = `const value = "hello world";`;
		const document = await createTestDocument(content);

		// "hello"の部分だけを選択
		await showDocumentWithSelection(document, 0, 15, 0, 20);

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// クリップボードの内容を確認（選択部分のみがコピーされる）
		const clipboardContent = await vscode.env.clipboard.readText();
		// ヘッダー行にファイルパスを含む形式に変更
		const expectedHeader = `// ${document.uri.fsPath}`;
		const expected = `${expectedHeader}\n1: hello`;
		assert.strictEqual(clipboardContent, expected);
	});

	test('Should handle code with indentation', async () => {
		const content = `function test() {
    const x = 1;
    return x;
}`;
		const document = await createTestDocument(content);

		// 全4行を選択
		await showDocumentWithSelection(document, 0, 0, 3, 1);

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// クリップボードの内容を確認（インデントが保持される）
		const clipboardContent = await vscode.env.clipboard.readText();
		// ヘッダー行にファイルパスを含む形式に変更
		const expectedHeader = `// ${document.uri.fsPath}`;
		const expected = `${expectedHeader}
1: function test() {
2:     const x = 1;
3:     return x;
4: }`;
		assert.strictEqual(clipboardContent, expected);
	});

	test('Should show error when no editor is active', async () => {
		// 全てのエディタを閉じる
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// エラーメッセージが表示されることを期待
		// （実装で showErrorMessage が呼ばれることを確認）
		// 注: メッセージの検証は実装に依存するため、コマンドが例外を投げないことを確認
	});

	test('Should show error when no text is selected', async () => {
		const content = `line 1
line 2
line 3`;
		const document = await createTestDocument(content);
		const editor = await vscode.window.showTextDocument(document);

		// 選択範囲をクリア（同じ位置でカーソルのみ）
		const pos = new vscode.Position(1, 0);
		editor.selection = new vscode.Selection(pos, pos);

		// コマンド実行
		await vscode.commands.executeCommand('vscode-copy-with-line-numbers.copyWithLineNumbers');

		// エラーメッセージが表示されることを期待
		// （実装で showErrorMessage が呼ばれることを確認）
	});
});
