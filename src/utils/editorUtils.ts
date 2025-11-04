/**
 * Utility functions for interacting with VSCode editor API.
 * This module provides pure functions that abstract VSCode-specific operations.
 */

import * as vscode from 'vscode';
import { EditorSelection } from '../core/types';
import {
	CopyWithLineNumbersError,
	EditorNotActiveError,
	NoSelectionError
} from '../core/errors';

/**
 * Gets the currently active text editor.
 *
 * Returns either the active editor or an error object.
 * This function does not throw; it returns errors as values.
 *
 * @returns The active text editor or an error object
 */
export const getActiveEditor = (): vscode.TextEditor | CopyWithLineNumbersError => {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return new EditorNotActiveError();
	}

	return editor;
};

/**
 * Gets the current selection from the editor.
 *
 * Returns either the selection information or an error object.
 * This function does not throw; it returns errors as values.
 *
 * @param editor - The text editor to get selection from
 * @returns The selection information or an error object
 */
export const getSelection = (
	editor: vscode.TextEditor
): EditorSelection | CopyWithLineNumbersError => {
	const selection = editor.selection;

	// Check if selection is empty (cursor position only, no text selected)
	if (selection.isEmpty) {
		return new NoSelectionError();
	}

	// Get the selected text
	const selectedText = editor.document.getText(selection);

	// Get the file path from the document URI
	// For untitled files, extract the name from the path (e.g., "/Untitled-1" -> "Untitled-1")
	// For regular files, use the workspace-relative path if possible, otherwise use the full path
	let filePath: string;
	if (editor.document.uri.scheme === 'untitled') {
		// Untitled files: extract just the name
		filePath = editor.document.uri.path.split('/').pop() || editor.document.uri.path;
	} else {
		// Regular files: try to get workspace-relative path
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
		if (workspaceFolder) {
			// Get relative path from workspace root
			filePath = vscode.workspace.asRelativePath(editor.document.uri, false);
		} else {
			// No workspace: use full path
			filePath = editor.document.uri.fsPath;
		}
	}

	// Extract selection information
	const editorSelection: EditorSelection = {
		startLine: selection.start.line,
		startCharacter: selection.start.character,
		endLine: selection.end.line,
		endCharacter: selection.end.character,
		selectedText: selectedText,
		filePath: filePath
	};

	return editorSelection;
};

/**
 * Copies text to the system clipboard.
 *
 * @param text - The text to copy to clipboard
 * @returns A promise that resolves when the copy operation completes
 */
export const copyToClipboard = async (text: string): Promise<void> => {
	await vscode.env.clipboard.writeText(text);
};

/**
 * Shows a success message to the user.
 *
 * @param lineCount - The number of lines that were copied
 */
export const showSuccessMessage = (lineCount: number): void => {
	const message = lineCount === 1
		? 'Copied 1 line with line numbers.'
		: `Copied ${lineCount} lines with line numbers.`;

	vscode.window.showInformationMessage(message);
};

/**
 * Shows an error message to the user.
 *
 * @param error - The error that occurred
 */
export const showErrorMessage = (error: CopyWithLineNumbersError): void => {
	vscode.window.showErrorMessage(error.userMessage);
};

/**
 * Shows a generic error message for unexpected errors.
 *
 * @param error - The unexpected error that occurred
 */
export const showUnexpectedErrorMessage = (error: Error): void => {
	const message = `An unexpected error occurred: ${error.message}`;
	vscode.window.showErrorMessage(message);
};
