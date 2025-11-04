`Copy Selection with Line Numbers` のコマンドを実行すると、選択したコードを行番号付きでクリップボードにコピーするシンプルなVS Code拡張機能です。

ファイルパスのヘッダー行と、`{行番号}: {コード}` の形式でコードをクリップボードにコピーします。

## 出力形式

```
// {ファイルパス}
{行番号}: {コード}
{行番号}: {コード}
...
```

## ファイルパスの仕様

- **ワークスペース内のファイル**: ワークスペースルートからの相対パス（例: `src/core/formatter.ts`）
- **Untitledファイル**: ファイル名のみ（例: `Untitled-1`）
- **ワークスペース外のファイル**: 絶対パス

## 例

ワークスペース内の `src/VSPackage.cs` の51-53行目を選択した場合:

```
// src/VSPackage.cs
51: /// <summary>
52: /// Initializes a new instance of the <see cref="VSPackage"/> class.
53: /// </summary>
```
