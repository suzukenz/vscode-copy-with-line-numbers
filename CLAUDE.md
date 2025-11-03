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
├── .vscode/                   # VSCode設定（デバッグ、タスク）
├── src/
│   ├── core/                  # コアビジネスロジック（VSCode API非依存）
│   │   ├── types.ts           # 型定義
│   │   ├── errors.ts          # エラークラス定義
│   │   ├── formatter.ts       # テキストフォーマッター（純粋関数）
│   │   └── copyWithLineNumbers.ts  # メイン実行関数
│   ├── utils/
│   │   └── editorUtils.ts     # VSCode API ラッパー関数
│   ├── extension.ts           # エントリーポイント
│   └── test/                  # テストファイル
│       └── suite/
│           ├── index.ts           # テストランナー
│           └── extension.test.ts  # テストケース
├── out/                       # コンパイル済みJavaScript（自動生成）
├── package.json               # プロジェクトメタデータと依存関係
├── tsconfig.json              # TypeScript設定
├── .vscode-test.js            # VSCode Test CLI設定
└── CLAUDE.md                  # プロジェクト開発ガイドライン
```

## 開発ガイドライン

### アーキテクチャ方針

**関数ベース実装**

- クラスは使用しない（エラークラスを除く）
- すべてのロジックは純粋関数として実装
- 副作用を持つ関数は明示的に分離

**エラーハンドリング**

- エラーは JavaScript 標準の Error クラスを継承したクラスベースで実装
- 各エラータイプは専用のクラスとして定義（`EditorNotActiveError`, `NoSelectionError`など）
- エラーの型チェックは `instanceof` を使用
- エラークラスは以下のプロパティを持つ：
  - `code`: エラーコード（文字列）
  - `message`: 英語の内部メッセージ
  - `userMessage`: 日本語のユーザー向けメッセージ
- Union型でエラータイプを定義：`type CopyWithLineNumbersError = EditorNotActiveError | NoSelectionError | ...`

**責務の分離**

- `src/core/`: 純粋なビジネスロジック（VSCode API非依存）
- `src/utils/`: VSCode APIとの対話を抽象化
- `src/core/copyWithLineNumbers.ts`: メインの実行関数（パイプライン形式）

### コーディング規約

- TypeScriptのstrict modeを有効化
- 型安全性を最優先
- すべてのexported関数にTSDocコメントを記載
- クラスは使用しない（エラークラスのみ例外）
- 関数は単一責任の原則に従う

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

### 実装後チェックリスト

- [ ] すべてのテストが成功
- [ ] TypeScriptコンパイルエラーなし
- [ ] README.mdの更新（必要に応じて）
