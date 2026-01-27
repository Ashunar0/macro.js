# CLAUDE.md

このファイルは Claude Code がこのリポジトリを扱う際のガイダンスを提供するのだ。

## プロジェクト概要

**Macro.js** (`create-macro`) は Google Apps Script (GAS) プロジェクトのセットアップを自動化する CLI ツールなのだ。`create-vite` や `create-next-app` のような体験を GAS 開発にもたらすのだ。

- **npm パッケージ名:** `create-macro`
- **バージョン:** 0.1.7
- **ライセンス:** MIT

## コマンド

```bash
# 開発
npm run build      # TypeScript をコンパイル
npm run dev        # 開発モード（ウォッチ）

# テスト
npm test           # Vitest でテスト実行
npm run test:watch # ウォッチモードでテスト

# リント・フォーマット
npm run lint       # ESLint 実行
npm run format     # Prettier 実行

# パッケージ公開
npm run release    # バージョンアップ & 公開
```

## アーキテクチャ

```
src/
├── index.ts        # エントリポイント（CLI shebang）
├── cli.ts          # cac による引数パース
├── prompts.ts      # @clack/prompts による対話 UI
├── generator.ts    # プロジェクト生成ロジック
├── clasp.ts        # clasp 連携（ログイン確認、プロジェクト作成）
├── templates/      # 各種テンプレート生成関数
├── utils/          # ユーティリティ（バリデーション、FS、PM 検出、クリーンアップ）
└── types.ts        # TypeScript 型定義
```

### 処理フロー

1. CLI 引数パース → 2. 対話プロンプト → 3. プロジェクト名検証 → 4. ディレクトリ作成 → 5. ファイル生成 → 6. clasp ログイン確認 → 7. GAS プロジェクト作成（任意）→ 8. .clasp.json 更新 → 9. npm install → 10. 完了メッセージ

## 技術スタック

- **CLI フレームワーク:** `cac`
- **対話 UI:** `@clack/prompts`
- **テスト:** `Vitest`
- **言語:** TypeScript + ES2022

## 重要な設計判断

1. **GAS はモジュールシステムなし** → 関数はグローバルスコープに配置
2. **rootDir 設定** → clasp は `dist/` から読み取る
3. **appsscript.json は src/ で管理** → ビルド時に dist/ へコピー
4. **クロスプラットフォーム対応** → `cpy-cli` を使用（シェルの cp ではない）

## サポートするプロジェクトタイプ

- `standalone` - 汎用 GAS スクリプト
- `sheets` - スプレッドシート連携
- `docs` - Google ドキュメント連携
- `forms` - Google フォーム連携
- `slides` - Google スライド連携
- `webapp` - Web アプリ（doGet/doPost）

## 生成されるプロジェクト構造

```
generated-project/
├── src/
│   ├── main.ts (or main.js)
│   └── appsscript.json
├── dist/                   # ビルド出力（gitignore）
├── package.json
├── .clasp.json             # rootDir: "./dist"
├── tsconfig.json           # TS のみ
└── .gitignore
```

## エラーハンドリング方針

- **回復可能:** clasp 未ログイン → ログイン促進、API 未有効化 → ガイド表示
- **回復不可:** 無効なプロジェクト名、ディレクトリ存在
- **クリーンアップ:** ディレクトリ作成後のエラーは削除、npm install 以降は保持

## パッケージマネージャー検出

`process.env.npm_config_user_agent` から検出し、対応するコマンドを使用（npm/yarn/pnpm/bun）
