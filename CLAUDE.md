# VSCode Copy with Line Numbers Extension

## プロジェクト概要

このプロジェクトは、VSCodeで選択したコードを行番号付きでコピーする拡張機能です。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: VSCode Extension API
- **テストフレームワーク**: Mocha + @vscode/test-electron
- **ビルドツール**: TypeScript Compiler (tsc)

## ディレクトリ構成

```
.
├── .vscode/           # VSCode設定（デバッグ、タスク）
├── src/               # TypeScriptソースコード
│   ├── extension.ts   # メインエントリーポイント
│   └── test/          # テストファイル
│       └── suite/
│           ├── index.ts           # テストランナー
│           └── extension.test.ts  # テストケース
├── out/               # コンパイル済みJavaScript（自動生成）
├── package.json       # プロジェクトメタデータと依存関係
├── tsconfig.json      # TypeScript設定
└── .vscode-test.js    # VSCode Test CLI設定
```

## 開発ガイドライン

### コーディング規約

- TypeScriptのstrict modeを有効化
- 型安全性を最優先
- すべての関数にJSDocコメントを記載
- コマンド名は `vscode-copy-with-line-numbers.{commandName}` の形式

### テスト方針

- すべての機能に対してユニットテストを作成
- Mochaのtdd形式（suite/test）を使用
- VSCode Extension Host環境でテストを実行

### ビルドとテスト

```bash
# 依存関係のインストール
npm install

# TypeScriptコンパイル
npm run compile

# watchモード（自動コンパイル）
npm run watch

# テスト実行
npm test
```

### デバッグ方法

1. F5キーを押す、または「Run Extension」デバッグ設定を実行
2. 新しいVSCodeウィンドウ（Extension Development Host）が開く
3. 拡張機能の動作を確認

### 公開前チェックリスト

- [ ] すべてのテストが成功
- [ ] TypeScriptコンパイルエラーなし
- [ ] package.jsonのversion、displayName、descriptionが適切
- [ ] README.mdに使用方法を記載
- [ ] LICENSEファイルを追加

## Claude Code使用時の注意事項

- Ad-hoc修正の禁止：根本的な解決策を実装してください
- 暗黙的なfallbackの禁止：エラーハンドリングは明示的に
- 型安全性の維持：anyの使用は最小限に
- コメントは必須：プロジェクトに不慣れな人でも理解できるように
