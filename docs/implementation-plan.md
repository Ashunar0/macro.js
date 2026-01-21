# create-macro 実装計画

## フェーズ概要

```
Phase 0: プロジェクト初期化
    ↓
Phase 1: コア機能（Utils）
    ↓
Phase 2: テンプレート
    ↓
Phase 3: CLI + プロンプト
    ↓
Phase 4: Generator
    ↓
Phase 5: Clasp連携
    ↓
Phase 6: 統合 + E2Eテスト
    ↓
Phase 7: ドキュメント + 公開準備
```

---

## Phase 0: プロジェクト初期化

### Ticket #0-1: プロジェクトセットアップ
**優先度:** 最高
**依存:** なし

**タスク:**
- [ ] `npm init` でpackage.json作成
- [ ] TypeScript設定（tsconfig.json）
- [ ] Vitest設定（vitest.config.ts）
- [ ] 依存パッケージインストール（cac, @clack/prompts, typescript, vitest）
- [ ] ディレクトリ構造作成（src/, tests/）
- [ ] .gitignore作成
- [ ] ESLint/Prettier設定（任意）

**完了条件:**
- `npm run build` でビルド成功
- `npm test` でテスト実行可能

---

## Phase 1: コア機能（Utils）

### Ticket #1-1: 型定義
**優先度:** 高
**依存:** #0-1

**タスク:**
- [ ] `src/types.ts` 作成
- [ ] `ProjectConfig` 型定義
- [ ] `ProjectType` 型定義
- [ ] `PackageManager` 型定義
- [ ] `CLIOptions` 型定義
- [ ] エラーコード型定義

**完了条件:**
- 型定義ファイルがビルドエラーなし

---

### Ticket #1-2: バリデーションユーティリティ
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/utils/validation.ts` 作成
- [ ] `validateProjectName()` 実装
  - 空文字チェック
  - 無効文字チェック
  - 先頭文字チェック
- [ ] `checkDirectoryExists()` 実装
- [ ] テスト作成（tests/utils/validation.test.ts）

**完了条件:**
- 全バリデーションルールが実装済み
- テストカバレッジ100%

---

### Ticket #1-3: パッケージマネージャー検出
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/utils/pm.ts` 作成
- [ ] `detectPackageManager()` 実装
- [ ] `getInstallCommand()` 実装
- [ ] `getRunCommand()` 実装
- [ ] テスト作成（tests/utils/pm.test.ts）

**完了条件:**
- npm/yarn/pnpm/bun全て対応
- テストカバレッジ100%

---

### Ticket #1-4: ファイル操作ユーティリティ
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/utils/fs.ts` 作成
- [ ] `writeFile()` 実装
- [ ] `readJsonFile()` 実装
- [ ] `updateJsonFile()` 実装
- [ ] `ensureDir()` 実装
- [ ] `removeDir()` 実装
- [ ] テスト作成（tests/utils/fs.test.ts）

**完了条件:**
- 全関数が実装済み
- エラーハンドリング実装済み

---

### Ticket #1-5: クリーンアップ処理
**優先度:** 中
**依存:** #1-4

**タスク:**
- [ ] `src/utils/cleanup.ts` 作成
- [ ] `registerCleanup()` 実装
- [ ] `unregisterCleanup()` 実装
- [ ] `cleanup()` 実装
- [ ] SIGINT ハンドラ実装
- [ ] テスト作成（tests/utils/cleanup.test.ts）

**完了条件:**
- Ctrl+Cでクリーンアップ実行
- 登録解除が正常動作

---

## Phase 2: テンプレート

### Ticket #2-1: 基本テンプレート
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/templates/appsscript.json.ts` 作成
- [ ] `src/templates/gitignore.ts` 作成
- [ ] `src/templates/clasp.json.ts` 作成
- [ ] テスト作成

**完了条件:**
- 各テンプレートが正しいJSON/テキストを生成

---

### Ticket #2-2: package.jsonテンプレート
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/templates/package.json.ts` 作成
- [ ] TypeScript用テンプレート
- [ ] JavaScript用テンプレート
- [ ] プロジェクト名の動的挿入
- [ ] テスト作成

**完了条件:**
- TS/JS両方のpackage.jsonが正しく生成

---

### Ticket #2-3: tsconfig.jsonテンプレート
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/templates/tsconfig.json.ts` 作成
- [ ] GAS用の設定（module: None等）
- [ ] テスト作成

**完了条件:**
- GAS用に適切なtsconfig.jsonが生成

---

### Ticket #2-4: main.ts/jsテンプレート
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/templates/main/standalone.ts` 作成
- [ ] `src/templates/main/sheets.ts` 作成
- [ ] `src/templates/main/docs.ts` 作成
- [ ] `src/templates/main/forms.ts` 作成
- [ ] `src/templates/main/slides.ts` 作成
- [ ] `src/templates/main/webapp.ts` 作成
- [ ] `src/templates/main/index.ts` エクスポート
- [ ] TypeScript/JavaScript両対応
- [ ] テスト作成

**完了条件:**
- 全プロジェクトタイプのテンプレートが実装済み
- TS/JS両方のコード生成が正常

---

## Phase 3: CLI + プロンプト

### Ticket #3-1: CLIパーサー
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/cli.ts` 作成
- [ ] cacでCLI定義
- [ ] `--version` オプション
- [ ] `--help` オプション
- [ ] `--yes` オプション
- [ ] プロジェクト名引数
- [ ] `parseArgs()` 関数
- [ ] テスト作成（tests/cli.test.ts）

**完了条件:**
- 全オプションが正常にパースされる
- ヘルプ/バージョン表示が正常

---

### Ticket #3-2: 対話式プロンプト
**優先度:** 高
**依存:** #1-1, #1-2

**タスク:**
- [ ] `src/prompts.ts` 作成
- [ ] `promptProjectConfig()` 実装
  - プロジェクト名入力
  - 言語選択
  - GASプロジェクト作成確認
  - プロジェクトタイプ選択
- [ ] `confirmLogin()` 実装
- [ ] `confirmRetryClaspCreate()` 実装
- [ ] キャンセル処理（Ctrl+C）
- [ ] テスト作成（tests/prompts.test.ts）

**完了条件:**
- 全プロンプトが表示される
- 入力値が正しく返される
- キャンセル時に適切にハンドリング

---

## Phase 4: Generator

### Ticket #4-1: プロジェクト生成メイン処理
**優先度:** 高
**依存:** #1-4, #1-5, #2-1, #2-2, #2-3, #2-4

**タスク:**
- [ ] `src/generator.ts` 作成
- [ ] `generateProject()` メイン関数
- [ ] `createDirectory()` 実装
- [ ] `writeTemplateFiles()` 実装
- [ ] エラー時クリーンアップ連携
- [ ] 統合テスト作成（tests/generator.test.ts）

**完了条件:**
- 全ファイルが正しく生成される
- ディレクトリ構造が要件通り
- エラー時にクリーンアップ実行

---

## Phase 5: Clasp連携

### Ticket #5-1: claspステータスチェック
**優先度:** 高
**依存:** #1-1

**タスク:**
- [ ] `src/clasp.ts` 作成
- [ ] `checkLoginStatus()` 実装
- [ ] `login()` 実装
- [ ] テスト作成（モック使用）

**完了条件:**
- ログイン状態を正しく検出
- ログイン処理が正常に動作

---

### Ticket #5-2: claspプロジェクト作成
**優先度:** 高
**依存:** #5-1

**タスク:**
- [ ] `createProject()` 実装
- [ ] `mapProjectTypeToClasp()` 実装（webapp → standalone）
- [ ] API未有効エラー検出
- [ ] リトライ処理
- [ ] テスト作成（モック使用）

**完了条件:**
- clasp createが正常に実行される
- エラーハンドリングが正常

---

### Ticket #5-3: .clasp.json編集
**優先度:** 高
**依存:** #5-2, #1-4

**タスク:**
- [ ] `updateClaspJson()` 実装
- [ ] rootDir追記処理
- [ ] テスト作成

**完了条件:**
- clasp create後に.clasp.jsonが正しく更新される

---

## Phase 6: 統合 + E2Eテスト

### Ticket #6-1: エントリーポイント + 統合
**優先度:** 高
**依存:** #3-1, #3-2, #4-1, #5-3

**タスク:**
- [ ] `src/index.ts` 作成
- [ ] 全モジュールの統合
- [ ] `run()` メイン関数
- [ ] npm install実行処理
- [ ] 完了メッセージ表示
- [ ] グローバルエラーハンドリング

**完了条件:**
- `npm run build && node dist/index.js` で動作
- 全フローが正常に完了

---

### Ticket #6-2: E2Eテスト
**優先度:** 中
**依存:** #6-1

**タスク:**
- [ ] E2Eテスト環境構築
- [ ] TypeScript + standalone テスト
- [ ] JavaScript + sheets テスト
- [ ] --yes オプションテスト
- [ ] GASプロジェクト作成スキップテスト
- [ ] エラーケーステスト

**完了条件:**
- 主要フローのE2Eテストがパス

---

## Phase 7: ドキュメント + 公開準備

### Ticket #7-1: README作成
**優先度:** 中
**依存:** #6-1

**タスク:**
- [ ] README.md作成
- [ ] インストール方法
- [ ] 使い方
- [ ] オプション説明
- [ ] ライセンス

**完了条件:**
- READMEが完成

---

### Ticket #7-2: npm公開準備
**優先度:** 中
**依存:** #7-1

**タスク:**
- [ ] package.json最終調整
  - name, version, description
  - keywords, repository, license
  - files, bin
- [ ] `create-macro` 名前空き確認
- [ ] npmアカウント準備
- [ ] `npm publish --dry-run` 確認

**完了条件:**
- npm公開可能な状態

---

## チケット依存関係図

```
#0-1 プロジェクトセットアップ
  │
  ▼
#1-1 型定義
  │
  ├──────────────┬──────────────┬──────────────┐
  ▼              ▼              ▼              ▼
#1-2           #1-3           #1-4           #2-1〜#2-4
バリデーション  PM検出         ファイル操作    テンプレート
  │                             │              │
  │                             ▼              │
  │                           #1-5            │
  │                           クリーンアップ   │
  │                             │              │
  ├─────────────────────────────┴──────────────┘
  ▼
#3-1 CLI ────────────┐
  │                  │
  ▼                  ▼
#3-2 プロンプト     #4-1 Generator
  │                  │
  │    ┌─────────────┘
  │    │
  │    ▼
  │  #5-1 claspステータス
  │    │
  │    ▼
  │  #5-2 claspプロジェクト作成
  │    │
  │    ▼
  │  #5-3 .clasp.json編集
  │    │
  └────┴─────────────┐
                     ▼
                   #6-1 統合
                     │
                     ▼
                   #6-2 E2Eテスト
                     │
                     ▼
                   #7-1 README
                     │
                     ▼
                   #7-2 公開準備
```

---

## 実装順序（推奨）

| 順序 | チケット | 内容 |
|------|----------|------|
| 1 | #0-1 | プロジェクトセットアップ |
| 2 | #1-1 | 型定義 |
| 3 | #1-2, #1-3, #1-4 | Utils（並行可） |
| 4 | #1-5 | クリーンアップ |
| 5 | #2-1, #2-2, #2-3, #2-4 | テンプレート（並行可） |
| 6 | #3-1 | CLI |
| 7 | #3-2 | プロンプト |
| 8 | #4-1 | Generator |
| 9 | #5-1, #5-2, #5-3 | Clasp連携（順次） |
| 10 | #6-1 | 統合 |
| 11 | #6-2 | E2Eテスト |
| 12 | #7-1, #7-2 | ドキュメント + 公開 |

---

## 見積もり

| フェーズ | チケット数 |
|----------|-----------|
| Phase 0 | 1 |
| Phase 1 | 5 |
| Phase 2 | 4 |
| Phase 3 | 2 |
| Phase 4 | 1 |
| Phase 5 | 3 |
| Phase 6 | 2 |
| Phase 7 | 2 |
| **合計** | **20** |
