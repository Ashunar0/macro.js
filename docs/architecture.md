# create-macro アーキテクチャ設計書

## 1. 全体構成

```
create-macro (npm package)
├── CLI Layer        # コマンドライン処理（cac）
├── Prompt Layer     # 対話式UI（@clack/prompts）
├── Generator Layer  # ファイル生成
├── Clasp Layer      # clasp連携
└── Utils            # 共通ユーティリティ
```

## 2. ディレクトリ構造

```
create-macro/
├── src/
│   ├── index.ts              # エントリーポイント
│   ├── cli.ts                # CLIパーサー（cac）
│   ├── prompts.ts            # 対話式プロンプト
│   ├── generator.ts          # プロジェクト生成メイン処理
│   ├── clasp.ts              # clasp連携処理
│   ├── templates/            # テンプレートファイル
│   │   ├── package.json.ts   # package.json生成
│   │   ├── tsconfig.json.ts  # tsconfig.json生成
│   │   ├── appsscript.json.ts
│   │   ├── clasp.json.ts
│   │   ├── gitignore.ts
│   │   └── main/             # main.ts/js テンプレート
│   │       ├── standalone.ts
│   │       ├── sheets.ts
│   │       ├── docs.ts
│   │       ├── forms.ts
│   │       ├── slides.ts
│   │       └── webapp.ts
│   ├── utils/
│   │   ├── pm.ts             # パッケージマネージャー検出
│   │   ├── validation.ts     # バリデーション
│   │   ├── fs.ts             # ファイル操作
│   │   └── cleanup.ts        # クリーンアップ処理
│   └── types.ts              # 型定義
├── tests/
│   ├── cli.test.ts
│   ├── prompts.test.ts
│   ├── generator.test.ts
│   ├── clasp.test.ts
│   ├── templates/
│   │   └── *.test.ts
│   └── utils/
│       └── *.test.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## 3. モジュール設計

### 3.1 エントリーポイント (index.ts)

```typescript
#!/usr/bin/env node
import { run } from './cli';

run(process.argv);
```

### 3.2 CLI Layer (cli.ts)

責務: コマンドライン引数のパース、オプション処理

```typescript
import cac from 'cac';

interface CLIOptions {
  yes: boolean;
}

interface CLIResult {
  projectName?: string;
  options: CLIOptions;
}

export function run(argv: string[]): Promise<void>;
export function parseArgs(argv: string[]): CLIResult;
```

**処理フロー:**
1. cacでCLIを定義
2. `--version`, `--help` は cac が自動処理
3. `--yes` フラグと引数（プロジェクト名）を取得
4. メイン処理を呼び出し

### 3.3 Prompt Layer (prompts.ts)

責務: 対話式プロンプトの表示、ユーザー入力の取得

```typescript
import * as p from '@clack/prompts';

interface ProjectConfig {
  projectName: string;
  language: 'typescript' | 'javascript';
  createGasProject: boolean;
  projectType: ProjectType;
}

type ProjectType = 'standalone' | 'sheets' | 'docs' | 'forms' | 'slides' | 'webapp';

export async function promptProjectConfig(defaultName?: string): Promise<ProjectConfig>;
export async function confirmLogin(): Promise<boolean>;
export async function confirmRetryClaspCreate(): Promise<boolean>;
```

### 3.4 Generator Layer (generator.ts)

責務: プロジェクトディレクトリとファイルの生成

```typescript
interface GeneratorContext {
  projectName: string;
  projectPath: string;
  language: 'typescript' | 'javascript';
  projectType: ProjectType;
  createGasProject: boolean;
}

export async function generateProject(config: ProjectConfig): Promise<void>;
export async function createDirectory(path: string): Promise<void>;
export async function writeTemplateFiles(ctx: GeneratorContext): Promise<void>;
```

**生成ファイル一覧:**
| ファイル | 条件 |
|----------|------|
| package.json | 常に |
| tsconfig.json | TypeScript時のみ |
| src/appsscript.json | 常に |
| src/main.ts or main.js | 言語による |
| .gitignore | 常に |
| .clasp.json | clasp create後 or スキップ時 |

### 3.5 Clasp Layer (clasp.ts)

責務: clasp CLIとの連携

```typescript
interface ClaspCreateResult {
  success: boolean;
  scriptId?: string;
  error?: 'not_logged_in' | 'api_not_enabled' | 'unknown';
}

export async function checkLoginStatus(): Promise<boolean>;
export async function login(): Promise<boolean>;
export async function createProject(type: ProjectType, title: string): Promise<ClaspCreateResult>;
export async function updateClaspJson(projectPath: string, scriptId: string): Promise<void>;
export function mapProjectTypeToClasp(type: ProjectType): string;
```

**clasp type マッピング:**
| ProjectType | clasp --type |
|-------------|--------------|
| standalone | standalone |
| sheets | sheets |
| docs | docs |
| forms | forms |
| slides | slides |
| webapp | standalone |

### 3.6 Utils

#### pm.ts - パッケージマネージャー検出
```typescript
type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export function detectPackageManager(): PackageManager;
export function getInstallCommand(pm: PackageManager): string;
export function getRunCommand(pm: PackageManager, script: string): string;
```

#### validation.ts - バリデーション
```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateProjectName(name: string): ValidationResult;
export function checkDirectoryExists(path: string): boolean;
```

#### fs.ts - ファイル操作
```typescript
export async function writeFile(path: string, content: string): Promise<void>;
export async function readJsonFile<T>(path: string): Promise<T>;
export async function updateJsonFile<T>(path: string, updater: (data: T) => T): Promise<void>;
export async function ensureDir(path: string): Promise<void>;
export async function removeDir(path: string): Promise<void>;
```

#### cleanup.ts - クリーンアップ処理
```typescript
export function registerCleanup(projectPath: string): void;
export function unregisterCleanup(): void;
export async function cleanup(): Promise<void>;
```

### 3.7 Templates

テンプレートは関数として実装し、設定に応じた内容を返す。

```typescript
// templates/package.json.ts
interface PackageJsonOptions {
  projectName: string;
  language: 'typescript' | 'javascript';
}

export function generatePackageJson(options: PackageJsonOptions): string;

// templates/main/sheets.ts
interface MainOptions {
  language: 'typescript' | 'javascript';
}

export function generateSheetsMain(options: MainOptions): string;
```

## 4. 処理シーケンス

```
User                CLI              Prompts           Generator          Clasp
 │                   │                  │                  │                │
 │ npm create macro  │                  │                  │                │
 │──────────────────>│                  │                  │                │
 │                   │                  │                  │                │
 │                   │ parseArgs()      │                  │                │
 │                   │─────────────────>│                  │                │
 │                   │                  │                  │                │
 │                   │ promptConfig()   │                  │                │
 │                   │─────────────────>│                  │                │
 │                   │                  │                  │                │
 │        [対話式プロンプト表示]         │                  │                │
 │<─────────────────────────────────────│                  │                │
 │                   │                  │                  │                │
 │    [ユーザー入力]  │                  │                  │                │
 │──────────────────────────────────────>                  │                │
 │                   │                  │                  │                │
 │                   │                  │ config           │                │
 │                   │<─────────────────│                  │                │
 │                   │                  │                  │                │
 │                   │ generateProject(config)             │                │
 │                   │────────────────────────────────────>│                │
 │                   │                  │                  │                │
 │                   │                  │                  │ [ディレクトリ作成]
 │                   │                  │                  │ [ファイル生成]
 │                   │                  │                  │                │
 │                   │                  │                  │ checkLogin()   │
 │                   │                  │                  │───────────────>│
 │                   │                  │                  │                │
 │                   │                  │                  │ createProject()│
 │                   │                  │                  │───────────────>│
 │                   │                  │                  │                │
 │                   │                  │                  │ updateClaspJson()
 │                   │                  │                  │<───────────────│
 │                   │                  │                  │                │
 │                   │                  │                  │ [npm install]  │
 │                   │                  │                  │                │
 │   [完了メッセージ] │                  │                  │                │
 │<──────────────────────────────────────────────────────────────────────────│
```

## 5. エラーハンドリング戦略

### 5.1 エラー種別

```typescript
class CreateMacroError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recoverable: boolean = false
  ) {
    super(message);
  }
}

type ErrorCode =
  | 'INVALID_PROJECT_NAME'
  | 'DIRECTORY_EXISTS'
  | 'CLASP_NOT_LOGGED_IN'
  | 'CLASP_API_NOT_ENABLED'
  | 'CLASP_CREATE_FAILED'
  | 'FILE_WRITE_ERROR'
  | 'NPM_INSTALL_FAILED'
  | 'USER_CANCELLED';
```

### 5.2 クリーンアップタイミング

| エラー発生箇所 | クリーンアップ |
|----------------|----------------|
| プロンプト中 | なし |
| バリデーション | なし |
| ディレクトリ作成後〜ファイル生成中 | ディレクトリ削除 |
| npm install中 | 残す |
| clasp処理中 | 残す |

### 5.3 シグナルハンドリング

```typescript
// SIGINT (Ctrl+C) 対応
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(130);
});
```

## 6. 依存関係

### 6.1 本番依存 (dependencies)

| パッケージ | 用途 |
|-----------|------|
| cac | CLIフレームワーク |
| @clack/prompts | 対話式プロンプト |

### 6.2 開発依存 (devDependencies)

| パッケージ | 用途 |
|-----------|------|
| typescript | TypeScriptコンパイラ |
| vitest | テストフレームワーク |
| @types/node | Node.js型定義 |

### 6.3 外部CLI依存

| CLI | 用途 | 備考 |
|-----|------|------|
| clasp | GASプロジェクト作成 | 生成プロジェクトのdevDependencies |

## 7. ビルド設定

### 7.1 TypeScript設定

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 7.2 package.json (create-macro自体)

```json
{
  "name": "create-macro",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "create-macro": "./dist/index.js"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest",
    "test:run": "vitest run",
    "prepublishOnly": "npm run build"
  }
}
```

## 8. テスト方針

### 8.1 テスト種別

| 種別 | 対象 | ツール |
|------|------|--------|
| ユニットテスト | utils, templates | vitest |
| 統合テスト | generator, clasp連携 | vitest + モック |

### 8.2 モック戦略

```typescript
// clasp コマンドのモック
vi.mock('./clasp', () => ({
  checkLoginStatus: vi.fn().mockResolvedValue(true),
  createProject: vi.fn().mockResolvedValue({ success: true, scriptId: 'xxx' }),
}));

// ファイルシステムのモック
vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  rm: vi.fn(),
}));
```

### 8.3 テストケース例

**validation.test.ts**
- 有効なプロジェクト名
- 空文字
- 無効な文字を含む
- 先頭がドット/アンダースコア

**generator.test.ts**
- TypeScript + standalone
- JavaScript + sheets
- GASプロジェクト作成スキップ

**clasp.test.ts**
- ログイン済み状態
- 未ログイン → ログイン成功
- API未有効 → リトライ成功

## 9. 将来の拡張ポイント

| 機能 | 拡張箇所 |
|------|----------|
| カスタムテンプレート | templates/ に追加 |
| 新しいプロジェクトタイプ | ProjectType型 + テンプレート追加 |
| ESLint/Prettier対応 | generator.ts + 新テンプレート |
| watch機能 | 別コマンドとして追加 |
