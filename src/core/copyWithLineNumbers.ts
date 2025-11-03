/**
 * Main execution logic for the Copy Selection with Line Numbers command.
 * Implements a functional pipeline approach without classes.
 */

import {
	getActiveEditor,
	getSelection,
	copyToClipboard,
	showSuccessMessage,
	showErrorMessage,
	showUnexpectedErrorMessage
} from '../utils/editorUtils';
import { formatSelectionWithLineNumbers } from './formatter';
import {
	CopyWithLineNumbersError,
	EditorNotActiveError,
	NoSelectionError,
	InvalidInputError,
	InvalidLineNumberError
} from './errors';

/**
 * Executes the copy-with-line-numbers command.
 *
 * This function orchestrates the entire command flow:
 * 1. Get active editor
 * 2. Get current selection
 * 3. Format selected text with line numbers
 * 4. Copy formatted text to clipboard
 * 5. Show success message
 *
 * All errors are caught and displayed to the user as appropriate error messages.
 * This function uses early returns for error handling rather than nested try-catch blocks.
 *
 * @returns A promise that resolves when the command completes
 */
export const executeCopyWithLineNumbers = async (): Promise<void> => {
	try {
		// Step 1: Get the active editor
		const editorResult = getActiveEditor();
		if (
			editorResult instanceof EditorNotActiveError ||
			editorResult instanceof NoSelectionError ||
			editorResult instanceof InvalidInputError ||
			editorResult instanceof InvalidLineNumberError
		) {
			showErrorMessage(editorResult);
			return;
		}
		const editor = editorResult;

		// Step 2: Get the current selection
		const selectionResult = getSelection(editor);
		if (
			selectionResult instanceof EditorNotActiveError ||
			selectionResult instanceof NoSelectionError ||
			selectionResult instanceof InvalidInputError ||
			selectionResult instanceof InvalidLineNumberError
		) {
			showErrorMessage(selectionResult);
			return;
		}
		const selection = selectionResult;

		// Step 3: Format the selected text with line numbers
		const formattedText = formatSelectionWithLineNumbers(
			selection.selectedText,
			selection.startLine,
			selection.endLine
		);

		// Step 4: Copy the formatted text to clipboard
		await copyToClipboard(formattedText);

		// Step 5: Calculate line count and show success message
		const lineCount = selection.selectedText.split('\n').length;
		showSuccessMessage(lineCount);

	} catch (error) {
		// Handle known application errors
		if (
			error instanceof EditorNotActiveError ||
			error instanceof NoSelectionError ||
			error instanceof InvalidInputError ||
			error instanceof InvalidLineNumberError
		) {
			showErrorMessage(error);
		}
		// Handle unexpected errors
		else if (error instanceof Error) {
			showUnexpectedErrorMessage(error);
		}
		// Handle unknown error types
		else {
			showUnexpectedErrorMessage(
				new Error('An unknown error occurred')
			);
		}
	}
};
