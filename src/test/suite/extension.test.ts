import * as assert from 'assert';
import * as vscode from 'vscode';

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
