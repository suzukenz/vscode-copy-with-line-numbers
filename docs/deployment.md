# VSCode拡張機能のデプロイガイド

## 目次

1. [前提条件](#前提条件)
2. [パッケージング (.vsix ファイルの作成)](#パッケージング-vsix-ファイルの作成)
3. [Visual Studio Marketplace への公開](#visual-studio-marketplace-への公開)
4. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

### vsce のインストール

VSCode Extension Manager (`vsce`) は、VSCode拡張機能をパッケージングおよび公開するための公式コマンドラインツールです。

```bash
npm install -g @vscode/vsce
```

インストール確認:

```bash
vsce --version
```

---

## パッケージング (.vsix ファイルの作成)

### 1. package.json の確認

以下の必須フィールドが適切に設定されていることを確認してください:

- `name`: 拡張機能の一意な名前（小文字、ハイフン区切り）
- `version`: セマンティックバージョニング（例: 1.0.0）
- `publisher`: パブリッシャー名（Marketplace アカウント名）
- `displayName`: 表示名
- `description`: 説明文
- `repository`: リポジトリURL（推奨）
- `license`: ライセンス（推奨）
- `icon`: アイコン画像のパス（推奨、128x128px以上のPNG）

### 2. README.md の準備

拡張機能の説明、使い方、機能などを記載した README.md を用意します。Marketplace に表示される重要なドキュメントです。

### 3. CHANGELOG.md の準備（推奨）

バージョンごとの変更履歴を記載します。

### 4. .vscodeignore の設定

パッケージに含めないファイルを指定します。プロジェクトルートに作成:

```
.vscode/**
.vscode-test/**
src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/.eslintrc.json
**/*.map
**/*.ts
**/node_modules/**
.git/**
*.vsix
```

### 5. パッケージのビルド

```bash
# TypeScript のコンパイル
npm run compile

# テストの実行（推奨）
npm test
```

### 6. .vsix ファイルの作成

```bash
vsce package
```

成功すると、`拡張機能名-バージョン.vsix` ファイルが生成されます。

例: `vscode-copy-with-line-numbers-0.0.1.vsix`

---

## Visual Studio Marketplace への公開

### 1. Azure DevOps アカウントの作成

Visual Studio Marketplace で拡張機能を公開するには、Azure DevOps の Personal Access Token (PAT) が必要です。

1. [Azure DevOps](https://dev.azure.com/) にアクセスしてサインイン
2. 右上のユーザーアイコン → **Personal access tokens** をクリック
3. **New Token** をクリック
4. 以下を設定:
   - **Name**: 任意の名前（例: `vsce-publish-token`）
   - **Organization**: All accessible organizations を選択
   - **Scopes**: **Marketplace** → **Manage** を選択
5. **Create** をクリックし、生成されたトークンをコピー（一度しか表示されません）

### 2. パブリッシャーの作成

初回公開時のみ必要です。

1. [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage) にアクセス
2. **Create publisher** をクリック
3. 以下を入力:
   - **Name**: パブリッシャーID（package.json の `publisher` と一致させる）
   - **Display name**: 表示名
   - **Email**: 連絡先メールアドレス
4. **Create** をクリック

### 3. vsce でログイン

```bash
vsce login <パブリッシャー名>
```

プロンプトに従って Personal Access Token を入力します。

### 4. 拡張機能の公開

```bash
vsce publish
```

または、バージョンを指定して公開:

```bash
# マイナーバージョンをインクリメント
vsce publish minor

# パッチバージョンをインクリメント
vsce publish patch

# メジャーバージョンをインクリメント
vsce publish major
```

### 5. 公開の確認

数分後、[Visual Studio Marketplace](https://marketplace.visualstudio.com/) で拡張機能を検索できるようになります。

---

## トラブルシューティング

### エラー: "Publisher not found"

**原因**: package.json の `publisher` フィールドが Marketplace のパブリッシャー名と一致していない。

**解決方法**: package.json の `publisher` を確認し、正しいパブリッシャー名に修正してください。

### エラー: "Missing required fields"

**原因**: package.json に必須フィールドが不足している。

**解決方法**: 以下のフィールドが設定されていることを確認:

- `name`
- `version`
- `publisher`
- `displayName`
- `description`
- `engines.vscode`

### エラー: "Invalid icon"

**原因**: アイコンファイルのサイズや形式が不適切。

**解決方法**:

- 128x128px 以上の PNG ファイルを使用
- package.json で正しいパスを指定

### パッケージサイズが大きすぎる

**原因**: 不要なファイルが含まれている。

**解決方法**: `.vscodeignore` に除外するファイル/ディレクトリを追加してください。

### エラー: "Personal Access Token is invalid"

**原因**: PAT が期限切れ、または適切なスコープが設定されていない。

**解決方法**:

1. Azure DevOps で新しい PAT を生成
2. Marketplace の Manage スコープが含まれていることを確認
3. `vsce login` を再実行

---

## リファレンス

- [Publishing Extensions - VSCode Documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce - GitHub Repository](https://github.com/microsoft/vscode-vsce)
- [Extension Manifest - VSCode Documentation](https://code.visualstudio.com/api/references/extension-manifest)
- [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
