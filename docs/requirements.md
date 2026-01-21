# create-macro 要件定義書

## 1. 概要

### 1.1 プロダクト情報
| 項目        | 内容                                  |
| --------- | ----------------------------------- |
| ブランド名     | **Macro.js**                        |
| npmパッケージ名 | `create-macro`（npm create規約に準拠）     |
| コマンド      | `npm create macro@latest`           |
| 目的        | claspの環境構築を一発で終わらせるプロジェクトジェネレーター    |
| ターゲット     | GAS経験者（claspは使ったことあるが毎回セットアップが面倒な人） |

**名前の使い分け:**
- ブランド名「Macro.js」: ドキュメント、README、ロゴなどで使用
- パッケージ名「create-macro」: npm公開時の名前（`npm create xxx`は`create-xxx`を探す規約のため）

### 1.2 コンセプト
- create-viteやcreate-next-appのような使い心地
- 初期セットアップに特化（日常操作はnpm scripts経由）
- npmで公開し、誰でも使えるようにする

## 2. 使い方

### 2.1 プロジェクト作成

**事前インストールは不要。** 以下のコマンドを実行するだけでOK。

```bash
npm create macro@latest
```

`npm create`は`create-macro`パッケージを自動的にダウンロードして実行する。

#### コマンドライン引数
プロジェクト名を引数で指定可能（create-viteと同様）：
```bash
npm create macro@latest my-project
```

#### オプション
| オプション | 説明 |
|-----------|------|
| `--yes`, `-y` | 全てデフォルト値で作成（非対話モード） |
| `--version`, `-v` | バージョン表示 |
| `--help`, `-h` | ヘルプ表示 |

```bash
# 例：デフォルト値で即座に作成
npm create macro@latest my-project --yes

# 例：バージョン確認
npm create macro@latest --version
```

#### 他のパッケージマネージャー
```bash
yarn create macro      # yarn
pnpm create macro      # pnpm
bun create macro       # bun
```

#### グローバルインストール（オプション）
頻繁に使う場合はグローバルインストールも可能。
```bash
npm install -g create-macro
create-macro    # 以降はこれだけで実行可能
```

### 2.2 日常操作（npm scripts）
```bash
npm run build    # TypeScript/JSのビルド
npm run push     # GASへデプロイ
npm run open     # ブラウザでGASエディタを開く
npm run deploy   # build + push
```

## 3. 対話式プロンプト

`npm create macro@latest` 実行時に以下を質問する：

| 質問 | 選択肢 | デフォルト |
|------|--------|-----------|
| Project name | テキスト入力 | my-gas-project |
| Language | JavaScript / TypeScript | TypeScript |
| Create new GAS project? | Yes / No | Yes |
| Project type | standalone / sheets / docs / forms / slides / webapp | standalone |

### 3.1 プロジェクト種類の説明

| タイプ | 説明 | 作成されるもの | 主な用途 |
|--------|------|---------------|----------|
| **standalone** | スタンドアロン | スクリプトのみ | 汎用スクリプト、定期実行タスク |
| **sheets** | スプレッドシート連携 | 新しいスプレッドシート + スクリプト | データ処理、カスタム関数 |
| **docs** | ドキュメント連携 | 新しいGoogleドキュメント + スクリプト | 文書自動生成、テンプレート処理 |
| **forms** | フォーム連携 | 新しいGoogleフォーム + スクリプト | フォーム回答の自動処理 |
| **slides** | スライド連携 | 新しいGoogleスライド + スクリプト | プレゼン自動生成 |
| **webapp** | Webアプリ | スタンドアロン（doGet/doPost用） | WebUI、API提供 |

**注意:**
- `clasp create --type <type>` の有効な値は `standalone | docs | sheets | slides | forms` のみ
- **webapp**は内部的には`standalone`として作成し、テンプレートに`doGet`/`doPost`関数を含める

## 4. 生成ファイル

### 4.1 ディレクトリ構成
```
my-gas-project/
├── src/
│   ├── main.ts (or main.js)
│   └── appsscript.json      # ソースと一緒に管理
├── dist/                    # ビルド出力先（.gitignore対象）
│   ├── main.js
│   └── appsscript.json      # ビルド時にコピーされる
├── package.json
├── .clasp.json
├── tsconfig.json            # TS選択時のみ
└── .gitignore
```

**ポイント:** `appsscript.json`は`src/`で管理し、ビルド時に`dist/`へコピーする。claspは`rootDir`（dist/）の中身だけをpushするため、この配置が必要。

**ビルド後のファイル構造（TS選択時）:**
```
src/                         dist/
├── main.ts          →       ├── main.js
├── utils.ts         →       ├── utils.js
└── lib/             →       └── lib/
    └── helper.ts    →           └── helper.js
```
ファイル構造がそのまま維持される。

### 4.2 package.json

#### TypeScript選択時
```json
{
  "name": "my-gas-project",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc && cpy src/appsscript.json dist",
    "push": "clasp push",
    "open": "clasp open",
    "deploy": "npm run build && npm run push"
  },
  "devDependencies": {
    "@google/clasp": "^2.4.2",
    "typescript": "^5.3.0",
    "@types/google-apps-script": "^1.0.83",
    "cpy-cli": "^5.0.0"
  }
}
```

#### JavaScript選択時
```json
{
  "name": "my-gas-project",
  "version": "1.0.0",
  "scripts": {
    "build": "cpy 'src/**/*' dist",
    "push": "clasp push",
    "open": "clasp open",
    "deploy": "npm run build && npm run push"
  },
  "devDependencies": {
    "@google/clasp": "^2.4.2",
    "cpy-cli": "^5.0.0"
  }
}
```

**ポイント:**
- `cpy-cli`を使用してクロスプラットフォーム（Windows/Mac/Linux）対応
- TypeScript: tscでコンパイル後、appsscript.jsonをdistへコピー
- JavaScript: src配下の全ファイルをdistへコピー

### 4.3 .clasp.json

#### GASプロジェクト作成時（clasp create実行後に編集）
```json
{
  "scriptId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "rootDir": "./dist"
}
```
`clasp create`で生成された`.clasp.json`に`rootDir`を追記する。

#### GASプロジェクト作成スキップ時
```json
{
  "scriptId": "",
  "rootDir": "./dist"
}
```
`scriptId`は空欄。後から`clasp clone`で既存プロジェクトを紐付けるか、手動で設定する。

### 4.4 appsscript.json
```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

### 4.5 tsconfig.json（TS選択時）
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "None",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["google-apps-script"],
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

**ポイント:**
- `"module": "None"` - GASはモジュールシステムがないため
- `"outDir": "./dist"` - コンパイル結果の出力先
- `"rootDir": "./src"` - ソースのルート（ディレクトリ構造を維持）

### 4.6 .gitignore
```
node_modules/
dist/
.clasprc.json
```

### 4.7 src/main.ts（テンプレート）

プロジェクト種類によって異なるテンプレートを生成する。
**GASはモジュールシステムがないため、関数はグローバルスコープに直接書く。**

#### TypeScript版

**standalone / docs / forms / slides**
```typescript
function myFunction(): void {
  console.log('Hello from Macro!');
}
```

**sheets（スプレッドシート用）**
```typescript
function myFunction(): void {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange('A1').setValue('Hello from Macro!');
}
```

**webapp**
```typescript
function doGet(e: GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutput('<h1>Hello from Macro!</h1>');
}

function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

#### JavaScript版（src/main.js）

**standalone / docs / forms / slides**
```javascript
function myFunction() {
  console.log('Hello from Macro!');
}
```

**sheets（スプレッドシート用）**
```javascript
function myFunction() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange('A1').setValue('Hello from Macro!');
}
```

**webapp**
```javascript
function doGet(e) {
  return HtmlService.createHtmlOutput('<h1>Hello from Macro!</h1>');
}

function doPost(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 5. 技術スタック

### 5.1 create-macro自体の構成
| 用途 | ライブラリ |
|------|-----------|
| CLIフレームワーク | cac |
| 対話式プロンプト | @clack/prompts |
| テスト | Vitest |

### 5.2 生成プロジェクトの依存関係

#### TypeScript選択時
| パッケージ | 用途 |
|-----------|------|
| @google/clasp | GASとの連携 |
| typescript | TypeScriptコンパイラ |
| @types/google-apps-script | GAS用型定義 |

#### JavaScript選択時
| パッケージ | 用途 |
|-----------|------|
| @google/clasp | GASとの連携 |

## 6. 処理フロー

```
npm create macro@latest [project-name] [options]
        │
        ▼
┌─────────────────────────┐
│  オプション処理           │
│  --version → 表示して終了 │
│  --help    → 表示して終了 │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  対話式プロンプト表示     │
│  (--yes時はスキップ)      │
│  - プロジェクト名         │
│  - 言語選択              │
│  - GASプロジェクト作成?   │
│  - プロジェクト種類       │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  プロジェクト名検証       │
│  - 空文字チェック         │
│  - 既存ディレクトリチェック │
│  - 無効文字チェック       │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  ディレクトリ作成         │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  テンプレートファイル生成  │
│  - package.json          │
│  - tsconfig.json (TS時)  │
│  - src/appsscript.json   │
│  - src/main.ts (or .js)  │
│  - .gitignore            │
│  ※ .clasp.jsonはここでは │
│    生成しない            │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  GASプロジェクト作成?     │
│  No  → .clasp.json生成   │
│        (scriptId空)      │
│        → skip to install │
│  Yes ↓                   │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  claspログイン状態チェック │
│  (clasp login --status)  │
│                         │
│  ログイン済み → 続行      │
│  未ログイン ↓            │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  ログイン誘導            │
│  "Login now? (Y/n)"      │
│                         │
│  Yes → clasp login 実行  │
│  No  → .clasp.json生成   │
│        (scriptId空)      │
│        → skip to install │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  clasp create            │
│  --type <type>           │
│  --title <name>          │
│  ※ webappはstandaloneで  │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  .clasp.json編集         │
│  rootDir: "./dist" を追記│
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  npm install 実行        │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│  完了メッセージ表示       │
│  (PM検出結果に応じて表示) │
│                         │
│  Done! Now run:          │
│  cd my-project           │
│  <pm> run build          │
│  <pm> run push           │
└─────────────────────────┘
```

### 6.1 パッケージマネージャー検出

実行時に使用されたパッケージマネージャーを自動検出し、以下に反映する：
- `npm install` 実行コマンド
- 完了メッセージの表示コマンド

| 実行コマンド | 検出結果 | インストール | 実行 |
|-------------|----------|-------------|------|
| `npm create macro@latest` | npm | `npm install` | `npm run build` |
| `yarn create macro` | yarn | `yarn` | `yarn build` |
| `pnpm create macro` | pnpm | `pnpm install` | `pnpm build` |
| `bun create macro` | bun | `bun install` | `bun run build` |

検出方法：`process.env.npm_config_user_agent` を参照

### 6.2 clasp createコマンド

GASプロジェクト作成時に実行されるコマンド：
```bash
clasp create --type <type> --title "<project-name>"
```

**注意:** `clasp create`には`--rootDir`オプションが存在しないため、create実行後に`.clasp.json`を編集して`rootDir`を追加する。

例（sheetsを選択した場合）:
```bash
clasp create --type sheets --title "my-gas-project"
# → 新しいスプレッドシートが作成され、スクリプトが紐付けられる
# → .clasp.jsonが生成される（その後rootDirを追記）
```

## 7. エラーハンドリング

### 7.1 claspログインチェック

GASプロジェクト作成を選択した場合、`clasp login --status`でログイン状態を確認する。

**未ログイン時の動作:**
```
⚠ You're not logged in to clasp.
? Login now? (Y/n) ›
```
- **Yes**: `clasp login`を実行してブラウザ認証へ誘導
- **No**: GASプロジェクト作成をスキップ（ローカルファイルのみ生成）

### 7.2 GAS API未有効時

clasp createが「API not enabled」エラーを返した場合、有効化を案内し**リトライを促す**：
```
✗ Google Apps Script API is not enabled.

To enable it:
1. Visit: https://script.google.com/home/usersettings
2. Turn on "Google Apps Script API"

? Retry clasp create? (Y/n) ›
```
- **Yes**: 同一プロセス内で`clasp create`を再実行
- **No**: GASプロジェクト作成をスキップ（ローカルファイルのみ生成）

これにより、ユーザーがAPIを有効化した後に`npm create`をやり直す必要がなくなる。

### 7.3 プロジェクト名のバリデーション

以下のルールでプロジェクト名を検証する：

| ルール | エラーメッセージ |
|--------|-----------------|
| 空文字 | `Project name is required.` |
| 既存ディレクトリと同名 | `Directory "my-project" already exists.` |
| 無効な文字（`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `\|`） | `Project name contains invalid characters.` |
| 先頭がドットまたはアンダースコア | `Project name cannot start with "." or "_".` |

### 7.4 エラー時のクリーンアップ

処理中にエラーが発生した場合の動作：

| 段階 | 動作 |
|------|------|
| ディレクトリ作成前 | 何もしない |
| ディレクトリ作成後、ファイル生成中 | 作成したディレクトリを削除 |
| npm install中 | ディレクトリは残す（ユーザーが手動でリトライ可能） |
| clasp create中 | ディレクトリは残す（ローカルファイルは使用可能） |

**Ctrl+C（中断）時:** 作成途中のディレクトリがあれば削除を試みる。

### 7.5 その他のエラー

| エラー | メッセージ例 |
|--------|-------------|
| ネットワークエラー | `Network error. Please check your connection.` |
| 認証キャンセル | `Login cancelled. Skipping GAS project creation.` |

## 8. 非機能要件

### 8.1 対応環境
- Node.js 18以上
- npm / yarn / pnpm / bun

### 8.2 メッセージ言語
- 英語

### 8.3 テスト
- ユニットテストを記述する（Vitest）

## 9. 将来対応（v2以降）

| 機能 | 説明 |
|------|------|
| クローン機能 | 既存GASプロジェクトをローカルにクローン |
| ESLint/Prettier設定 | コード品質ツールの自動設定 |
| watch機能 | ファイル変更時に自動ビルド＆push |
| カスタムテンプレート | ユーザー定義のテンプレートをサポート |
| npmバンドルモード | esbuildを使ってnpmパッケージをバンドルできるオプション |

## 10. 補足事項

### 10.1 名前について
| 種類        | 名前           | 用途               |
| --------- | ------------ | ---------------- |
| ブランド名     | Macro.js     | README、ドキュメント、ロゴ |
| npmパッケージ名 | create-macro | npm公開、コマンド実行     |

公開前に`create-macro`の空き状況を確認する必要あり。
```bash
npm view create-macro
```

### 10.2 前提条件
- Node.js 18以上がインストールされていること
- claspログイン・GAS API有効化は未完了でもOK（ツール内でガイドする）

### 10.3 参考
- [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)
- [@clack/prompts](https://github.com/natemoo-re/clack)
- [cac](https://github.com/cacjs/cac)
