# Copy Selection with Line Numbers

A Visual Studio Code extension that allows you to copy selected code with line numbers.

## Features

This extension adds a command to copy your selected code with line numbers prepended to each line. This is particularly useful when:

- Sharing code snippets in documentation
- Discussing specific lines in code reviews
- Creating educational materials
- Referencing code in bug reports

### Example

When you select this code:

```typescript
function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
```

And run the "Copy Selection with Line Numbers" command, it copies:

```
1: function greet(name: string) {
2:   console.log(`Hello, ${name}!`);
3: }
```

## Usage

1. Select the code you want to copy in the editor
2. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
3. Type "Copy Selection with Line Numbers" and select the command
4. The selected code with line numbers is now copied to your clipboard
