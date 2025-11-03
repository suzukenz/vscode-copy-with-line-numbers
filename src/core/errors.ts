/**
 * Custom error classes for the copy-with-line-numbers feature.
 * All errors extend from Error to follow JavaScript standard error handling patterns.
 */

/**
 * Error thrown when there is no active text editor.
 * This occurs when the user invokes the command without having any file open.
 */
export class EditorNotActiveError extends Error {
	readonly code = 'EDITOR_NOT_ACTIVE';
	readonly userMessage = 'No active editor. Please open a file and try again.';

	constructor() {
		super('No active text editor');
		this.name = 'EditorNotActiveError';
		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, EditorNotActiveError);
		}
	}
}

/**
 * Error thrown when no text is selected in the editor.
 * The user must select text before running the copy command.
 */
export class NoSelectionError extends Error {
	readonly code = 'NO_SELECTION';
	readonly userMessage = 'No text selected. Please select text to copy.';

	constructor() {
		super('No text selected');
		this.name = 'NoSelectionError';
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, NoSelectionError);
		}
	}
}

/**
 * Error thrown when the input text is invalid or empty.
 * This is a defensive check to ensure we have valid data to process.
 */
export class InvalidInputError extends Error {
	readonly code = 'INVALID_INPUT';
	readonly userMessage: string;
	readonly details: string;

	constructor(details: string) {
		super(`Invalid input: ${details}`);
		this.name = 'InvalidInputError';
		this.details = details;
		this.userMessage = `Input error: ${details}`;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidInputError);
		}
	}
}

/**
 * Error thrown when the line number is invalid (e.g., negative or zero).
 * Line numbers must be positive integers (1-based).
 */
export class InvalidLineNumberError extends Error {
	readonly code = 'INVALID_LINE_NUMBER';
	readonly userMessage: string;
	readonly lineNumber: number;

	constructor(lineNumber: number) {
		super(`Invalid line number: ${lineNumber}`);
		this.name = 'InvalidLineNumberError';
		this.lineNumber = lineNumber;
		this.userMessage = `Invalid line number: ${lineNumber}. Line number must be a positive integer (1 or greater).`;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidLineNumberError);
		}
	}
}

/**
 * Union type of all copy-with-line-numbers errors.
 * Useful for type checking and error handling.
 */
export type CopyWithLineNumbersError =
	| EditorNotActiveError
	| NoSelectionError
	| InvalidInputError
	| InvalidLineNumberError;
