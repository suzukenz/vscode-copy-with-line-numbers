import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

/**
 * Test runner entry point for the extension tests.
 * This function is called by @vscode/test-electron to run the tests.
 */
export async function run(): Promise<void> {
	// Create the mocha test runner
	const mocha = new Mocha({
		ui: 'tdd',
		color: true,
		timeout: 10000
	});

	const testsRoot = path.resolve(__dirname, '..');

	// Find all test files
	const files = await glob('**/**.test.js', { cwd: testsRoot });

	// Add files to the test suite
	files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

	try {
		// Run the mocha test
		await new Promise<void>((resolve, reject) => {
			mocha.run((failures: number) => {
				if (failures > 0) {
					reject(new Error(`${failures} tests failed.`));
				} else {
					resolve();
				}
			});
		});
	} catch (err) {
		console.error(err);
		throw err;
	}
}
