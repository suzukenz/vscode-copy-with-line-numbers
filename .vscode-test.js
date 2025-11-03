const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({
	files: 'out/test/**/*.test.js',
	version: 'stable',
	mocha: {
		ui: 'tdd',
		color: true,
		timeout: 10000
	}
});
