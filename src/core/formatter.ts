/**
 * Core formatting logic for adding line numbers to text.
 * This module is pure business logic with no external dependencies,
 * making it independently testable.
 */

import { FormatOptions, FormatResult } from './types';
import { InvalidInputError, InvalidLineNumberError } from './errors';

/**
 * Default separator between line number and text content.
 */
const DEFAULT_SEPARATOR = ': ';

/**
 * Formats text with line numbers prepended to each line.
 *
 * This is a pure function that takes text and formatting options,
 * and returns the formatted text with line numbers.
 * If filePath is provided in options, a header line with the file path
 * will be prepended to the output.
 *
 * @param text - The text to format (can be multi-line)
 * @param options - Formatting options including starting line number and optional file path
 * @returns The formatted text with line numbers (and optional header line)
 * @throws {InvalidInputError} If the text is empty or undefined
 * @throws {InvalidLineNumberError} If the starting line number is invalid
 *
 * @example
 * ```typescript
 * const result = formatWithLineNumbers("hello\nworld", { startLineNumber: 1 });
 * // Returns: "1: hello\n2: world"
 *
 * const result = formatWithLineNumbers("hello", { startLineNumber: 1, filePath: "/path/to/file.js" });
 * // Returns: "// /path/to/file.js\n1: hello"
 * ```
 */
export function formatWithLineNumbers(
	text: string,
	options: FormatOptions
): string {
	// Validate input text
	if (text === undefined || text === null) {
		throw new InvalidInputError('Text is undefined or null');
	}

	// Validate line number (must be positive integer)
	if (options.startLineNumber < 1 || !Number.isInteger(options.startLineNumber)) {
		throw new InvalidLineNumberError(options.startLineNumber);
	}

	// Get separator (use default if not provided)
	const separator = options.separator ?? DEFAULT_SEPARATOR;

	// Split text into lines
	const lines = text.split('\n');

	// Format each line with line number
	const formattedLines = lines.map((line, index) => {
		const lineNumber = options.startLineNumber + index;
		// For empty lines, only output line number and colon (no trailing space)
		if (line === '') {
			return `${lineNumber}:`;
		}
		return `${lineNumber}${separator}${line}`;
	});

	// If filePath is provided, prepend a header line with the file path
	if (options.filePath) {
		const headerLine = `// ${options.filePath}`;
		return `${headerLine}\n${formattedLines.join('\n')}`;
	}

	// Join lines back together
	return formattedLines.join('\n');
}

/**
 * Formats selected text with line numbers based on selection information.
 *
 * This is a convenience function that automatically calculates the starting
 * line number from the selection's start line (converting from 0-based to 1-based).
 * If filePath is provided, a header line with the file path will be prepended to the output.
 *
 * @param text - The selected text to format
 * @param startLine - The starting line of the selection (0-based index)
 * @param endLine - The ending line of the selection (0-based index)
 * @param filePath - Optional file path to include in the header line
 * @returns The formatted text with line numbers (and optional header line)
 * @throws {InvalidInputError} If the text is empty or undefined
 * @throws {InvalidLineNumberError} If line numbers are invalid
 *
 * @example
 * ```typescript
 * const result = formatSelectionWithLineNumbers("hello", 0, 0);
 * // Returns: "1: hello"
 *
 * const result = formatSelectionWithLineNumbers("line1\nline2", 10, 11);
 * // Returns: "11: line1\n12: line2"
 *
 * const result = formatSelectionWithLineNumbers("hello", 0, 0, "/path/to/file.js");
 * // Returns: "// /path/to/file.js\n1: hello"
 * ```
 */
export function formatSelectionWithLineNumbers(
	text: string,
	startLine: number,
	endLine: number,
	filePath?: string
): string {
	// Validate that startLine is not negative
	if (startLine < 0) {
		throw new InvalidLineNumberError(startLine);
	}

	// Convert from 0-based (VSCode internal) to 1-based (display) line numbers
	const displayLineNumber = startLine + 1;

	// Use the main formatting function
	return formatWithLineNumbers(text, {
		startLineNumber: displayLineNumber,
		separator: DEFAULT_SEPARATOR,
		filePath: filePath
	});
}

/**
 * Formats text with line numbers and returns detailed result information.
 *
 * This function provides additional metadata about the formatting operation,
 * useful for logging, debugging, or providing user feedback.
 *
 * @param text - The text to format
 * @param options - Formatting options
 * @returns A FormatResult object containing formatted text and metadata
 * @throws {InvalidInputError} If the text is empty or undefined
 * @throws {InvalidLineNumberError} If the starting line number is invalid
 *
 * @example
 * ```typescript
 * const result = formatWithLineNumbersDetailed("a\nb\nc", { startLineNumber: 5 });
 * // Returns: {
 * //   text: "5: a\n6: b\n7: c",
 * //   firstLineNumber: 5,
 * //   lastLineNumber: 7,
 * //   lineCount: 3
 * // }
 * ```
 */
export function formatWithLineNumbersDetailed(
	text: string,
	options: FormatOptions
): FormatResult {
	// Format the text
	const formattedText = formatWithLineNumbers(text, options);

	// Calculate metadata
	const lines = text.split('\n');
	const lineCount = lines.length;
	const firstLineNumber = options.startLineNumber;
	const lastLineNumber = firstLineNumber + lineCount - 1;

	return {
		text: formattedText,
		firstLineNumber,
		lastLineNumber,
		lineCount
	};
}
