/**
 * Core type definitions for the copy-with-line-numbers feature.
 * These types are used across the application to ensure type safety.
 */

/**
 * Editor selection information extracted from VSCode API.
 * Contains the selected text and its position within the document.
 */
export interface EditorSelection {
	/** The starting line of the selection (0-based index) */
	startLine: number;

	/** The starting character position within the start line */
	startCharacter: number;

	/** The ending line of the selection (0-based index) */
	endLine: number;

	/** The ending character position within the end line */
	endCharacter: number;

	/** The actual text content that was selected */
	selectedText: string;
}

/**
 * Options for formatting text with line numbers.
 */
export interface FormatOptions {
	/** The starting line number to display (1-based, as shown in editors) */
	startLineNumber: number;

	/** The separator between line number and text content (default: ": ") */
	separator?: string;
}

/**
 * Result of formatting operation containing formatted text and metadata.
 */
export interface FormatResult {
	/** The formatted text with line numbers prepended to each line */
	text: string;

	/** The first line number in the formatted output (1-based) */
	firstLineNumber: number;

	/** The last line number in the formatted output (1-based) */
	lastLineNumber: number;

	/** The total number of lines that were formatted */
	lineCount: number;
}
