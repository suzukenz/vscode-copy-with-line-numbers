import * as vscode from 'vscode';

/**
 * This method is called when the extension is activated.
 * Activation occurs when a registered command is invoked or an activation event is triggered.
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "vscode-copy-with-line-numbers" is now active!');

	// Register the copyWithLineNumbers command
	const disposable = vscode.commands.registerCommand(
		'vscode-copy-with-line-numbers.copyWithLineNumbers',
		() => {
			vscode.window.showInformationMessage('Copy with Line Numbers command executed!');
		}
	);

	context.subscriptions.push(disposable);
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate() {
	// Cleanup resources if needed
}
