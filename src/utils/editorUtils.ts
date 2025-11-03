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

	// Extract selection information
	const editorSelection: EditorSelection = {
		startLine: selection.start.line,
		startCharacter: selection.start.character,
		endLine: selection.end.line,
		endCharacter: selection.end.character,
		selectedText: selectedText
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
		? '1行を行番号付きでコピーしました。'
		: `${lineCount}行を行番号付きでコピーしました。`;

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
	const message = `予期しないエラーが発生しました: ${error.message}`;
	vscode.window.showErrorMessage(message);
};
