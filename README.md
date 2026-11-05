# TAKT

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/assets/takt-logo-dark.svg">
    <img src="./docs/assets/takt-logo.svg" alt="TAKT logo" width="480">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/takt"><img src="https://img.shields.io/npm/v/takt?label=npm" alt="npm version"></a>
  <a href="https://github.com/nrslib/takt/stargazers"><img src="https://img.shields.io/github/stars/nrslib/takt?logo=github&label=stars" alt="GitHub stars"></a>
  <a href="https://github.com/nrslib/takt/actions/workflows/ci.yml"><img src="https://github.com/nrslib/takt/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/nrslib/takt" alt="license"></a>
  <a href="https://discord.gg/R2Xz3uYWxD"><img src="https://img.shields.io/badge/dynamic/json?label=discord&query=approximate_member_count&url=https%3A%2F%2Fdiscord.com%2Fapi%2Fv10%2Finvites%2FR2Xz3uYWxD%3Fwith_counts%3Dtrue&suffix=%20members&logo=discord&logoColor=white&color=5865F2" alt="Discord members"></a>
</p>

<p align="center">
  <a href="./docs/README.en.md">English</a> |
  <a href="./README.md">日本語</a> |
  <a href="./docs/README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://nrslib.github.io/takt/#tutorial">
    <img src="./docs/assets/tutorial-preview.gif" alt="TAKT tutorial preview showing a task being described, queued, and executed by multiple AI agents" width="720">
  </a>
</p>

**AIコーディングエージェントの監視から解放されましょう。**

TAKTは、AIコーディングエージェントを再利用可能な開発ワークフローに変えるオープンソースのCLIツールです。

計画、実装、レビュー、修正ループをYAMLで定義します。各ステップは分離された環境で実行され、ログを追跡できます。

1つのエージェントに全体を記憶させる代わりに、TAKTは各ステップに独自の役割とルールを提供します。エージェントはコードを書き、ワークフローが次に何をするかを決定します。

![TAKT workflow control for AI coding agents](./docs/assets/description/01-hero.png)

- 計画 → 実装 → レビュー → 修正ループをワークフローステップとして実行
- 各ステップに独自の役割とルールを設定
- タスクを分離された環境で実行し、ログを追跡
- Claude Code、Codex、Cursor、GitHub Copilot CLIなどのAIエージェントをサポート

**T**AKT **A**gent **K**oordination **T**opologyは、複数のAIエージェントを調整します。

AIに会話してタスクを定義し、`takt run`で実行します。計画、実装、レビューはYAMLで定義されるため、プロセスはエージェントの裁量に委ねられません。

TAKTは主にAIコーディングのために作られていますが、複数のAIエージェントが協調する任意のタスクに適用できます。

TAKT自身もTAKTを使って構築されています（dogfooding）。

## なぜTAKTなのか

AIコーディングエージェントは自動的に安定した開発プロセスを作成しません。長期間の作業では、指示を忘れたり、コンテキストが混乱したり、実装とレビューの責任が曖昧になったりすることがあります。

プロンプトにルールを追加するだけでは、プロセスを強制することはできません。ルールが守られるかどうかはエージェントの振る舞いに委ねられています。

TAKTはAIエージェントを外部から制御します。

ワークフローはフェーズを定義し、各ステップは独自の役割とルールを受け取ります。責任を分離し、各エージェントに必要な情報だけを提供することで、タスクの品質を向上させます。

レビューはスキップできません。問題は修正ステップに戻され、必要に応じて人間の判断を要求できます。各ステップはログを残すため、タスクからPRへの過程を追跡できます。

開発プロセスは人間の継続的な介入なしに、レビュー可能で再現可能です。

## 5分で試す

少なくとも1つのコミットがあるGitリポジトリから：

```bash
npm install -g takt

# デフォルトプロバイダー（claude-sdk）のSDKをインストール
takt install claude-sdk

# AIに会話してタスクを説明し、/go を使用して「タスクとして保存」を選択
takt

# キューされたタスクを分離されたワークツリーで実行
takt run

# 差分をレビュー、マージ、再試行、再キュー、またはタスクブランチを削除
takt list
```

これが最初の実行の場合、`~/.takt/config.yaml`でプロバイダーを構成するか、[構成](#configuration)に記載されているAPIキー環境変数を使用します。SDKベースのプロバイダー（`claude-sdk`、`codex`、`opencode`、`pi`、`deepseek-harness`）はNode.jsで実行されます。使用する前に一度`takt install <provider>`を実行してください。CLIベースのプロバイダーは外部CLIが必要です。

## CodeRabbitレビューループ

GitHubでは、`takt caccia <PR番号>`を実行してCodeRabbitレビューを待ち、未解決のボットスレッドを分離されたクローンで処理し、各イテレーションの意思決定レポートを保持します。マージワークフローは明示的な`caccia`効果を通じてループを呼び出します。`caccia.enabled`はその効果がCodeRabbitを待つかどうかを制御し、デフォルトはfalseです。プッシュとPR公開は暗黙的にCacciaを開始しません。[CLIリファレンス](./docs/cli-reference.md#takt-caccia)と[構成ガイド](./docs/configuration.md#caccia-review-loop)を参照してください。

### ビデオチュートリアル

これらのハンズオンウォークスルーで[書面チュートリアル](./docs/tutorial.md)に従ってください：

| 第1章 | 第2章 |
|-----------|-----------|
| [![Watch TAKT Video Tutorial Chapter 1](https://i.ytimg.com/vi/HUcFFvOy39I/hqdefault.jpg)](https://youtu.be/HUcFFvOy39I) | [![Watch TAKT Video Tutorial Chapter 2](https://i.ytimg.com/vi/UIlM2iM-rmA/hqdefault.jpg)](https://youtu.be/UIlM2iM-rmA) |

## TAKT vs プレーンAIコーディングエージェント

| プレーンAIコーディングエージェント | TAKT |
|------------------------|------|
| プロンプトがエージェントにプロセスに従うように依頼 | YAMLワークフローがプロセスを所有 |
| レビューステップは忘れられたりスキップされたりする | レビューと修正ループは明示的な遷移 |
| 1つの長いコンテキストが成長し続ける | 各ステップは必要なコンテキストのみを受け取る |
| 実装とレビューの責任が曖昧 | ペルソナ、権限、出力契約が責任を分離 |
| 作業はしばしば現在のツリーに直接適用される | キューされたタスクはデフォルトで分離されたワークツリーで実行 |
| タスクから結果へのパスは監査が難しい | ログとレポートがタスクからPRへのパスを保持 |
| 同じプロセスは記憶によって再作成される必要がある | ワークフローは再利用可能、レビュー可能、バージョン管理可能 |

## 要件

TAKTにはNode.js `>=22.22.0`とGit `>=2.38`が必要です。

デフォルトプロバイダーは`claude-sdk`（Claude Agent SDK）です。

**SDKベースのプロバイダー**（CLI不要、Node.jsのみ）：
- `claude-sdk`、`codex`、`pi`、`deepseek-harness`
- 使用前に`takt install <provider>`を実行してください

**CLIベースのプロバイダー**（外部CLIが必要）：
- `claude-headless` — [Claude Code](https://claude.ai/code)
- `copilot` — [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli)
- `cursor` — [Cursor Agent](https://docs.cursor.com/)
- その他：`opencode`、`kiro`、`devin`など

**オプション**：
- [GitHub CLI](https://cli.github.com/) (`gh`) — GitHub Issueタスク用
- [GitLab CLI](https://gitlab.com/gitlab-org/cli) (`glab`) — GitLab統合用

> **OAuthの使用：** プロバイダーの利用規約を確認してください。

## クイックスタート

### インストール

```bash
npm install -g takt
takt install claude-sdk   # または codex, opencode, pi, deepseek-harness
```

Nix flakesで：

```bash
nix run github:nrslib/takt
nix profile install github:nrslib/takt
```

NixパッケージはTAKT CLI自体をインストールします。外部CLIプロバイダー、`git`、`gh`/`glab`は依然として[要件](#requirements)に記載されているようにインストールされて`PATH`で利用可能である必要があります。

### AIに会話してタスクをキュー

```
$ takt

ワークフローを選択:
  ❯ 🎼 default (current)
    📁 🚀 Quick Start/
    📁 🛠️ Development/
    📁 🔍 Review/

> JWTを使用したユーザー認証を追加

[AIが要件を明確化し、タスクを整理]

> /go

提案されたタスク:
  ...

何をしますか？
  ❯ タスクとして保存           # ← 通常のフローと初期選択
    Issueを作成
    ここで今すぐ実行
    編集を続行
```

「タスクとして保存」を選択すると、タスクは`.takt/tasks/`に保存されます。`takt run`を実行すると、TAKTは分離されたワークツリーを作成し、ワークフロー（計画 → 実装 → レビュー → 修正ループ）を実行し、完了時にPRの作成を提案します。

「Issueを作成」を選択すると、Issueが作成されます。オプションでタスクとしても保存できます。

```bash
# キューされたタスクを実行
takt run

# GitHub Issuesからキューすることもできます
takt add '#6'
```

> **「ここで今すぐ実行」**は現在のディレクトリで直接実行します。通常のフローはタスクを保存して`takt run`を使用することです。

### 別ディレクトリでの実行

TAKTは、現在のディレクトリとは異なるプロジェクトディレクトリで実行できます。例えば、TAKTのクローンディレクトリから別のプロジェクト`../modulith-learning/`で実行する場合：

```bash
# 対象プロジェクトディレクトリに移動してから実行
cd ../modulith-learning/
takt
takt run
```

`.takt/`ディレクトリは実行したプロジェクトディレクトリ内に作成・参照されます。

### 結果の管理

```bash
# タスクブランチをリスト — マージ、再試行、再キュー、停止、強制失敗、または削除
takt list
```

**停止**は実行中のタスクを停止します。**失敗としてマーク**はステータスのみを変更します。

## 動作原理

TAKTという名前は、オーケストラの拍子を維持するために使用されるドイツ語の「拍子」または「バトンストローク」から来ています。TAKTは**ワークフロー**と**ステップ**をユーザー向けと実装向けの用語の両方で一貫して使用します。

ワークフローはステップのシーケンスによって定義されます。`steps`、`initial_step`、`max_steps`を使用します。各ステップはペルソナ（誰）、権限（何が許可されている）、ルール（次に何が起こる）を指定します。最小限の例：

```yaml
name: plan-implement-review
initial_step: plan
max_steps: 10

steps:
  - name: plan
    persona: planner
    edit: false
    rules:
      - condition: Planning complete
        next: implement

  - name: implement
    persona: coder
    edit: true
    required_permission_mode: edit
    rules:
      - condition: Implementation complete
        next: review

  - name: review
    persona: reviewer
    edit: false
    rules:
      - condition: Approved
        next: COMPLETE
      - condition: Needs fix
        next: implement    # ← 修正ループ
```

ルールは次のステップを決定します。`COMPLETE`はワークフローを正常に終了し、`ABORT`は失敗で終了します。完全なスキーマ、並列ステップ、ルール条件タイプについては[ワークフローガイド](./docs/workflows.md)を参照してください。

再利用可能なステップ定義は`.takt/steps/`に保存され、検証前に`uses`で展開できます。フラグメント検索とオーバーライドルールについてはワークフローガイドを参照してください。

ワークフローファイルは公式ディレクトリ名として`workflows/`に配置されます。

同じワークフロー名が複数の場所に存在する場合、TAKTはこの順序で解決します：`.takt/workflows/` → `~/.takt/workflows/` → ビルトイン。

## 推奨ワークフロー

| ワークフロー | 使用ケース |
|-------|----------|
| `default` | 標準開発ワークフロー。シナリオベースの計画とテストファースト開発、動的実装コンパニオン、多角的並列ピアレビュー、審判、収束修正ループ。 |
| `maintenance` | 既存のコードベース用の`default`バリアント：変更範囲外の契約を保持し、作業を因果関係のある変更に制限。 |
| `simple` | `pure`と同じ最小限の構造を持つ軽量ワークフロー；TAKTは変更ごとに適用可能なドメインファセットを選択し、AIアンチパターンとアーキテクチャガイダンスを常に含む。 |
| `pure` | インジェクトされたドメインファセットなしの最小ワークフロー — モデル自身の判断とスキル選択を信頼。 |
| `takt-default` | TAKT自身を開発するために使用されるワークフロー。他のCLIツール開発に直接適用可能。 |
| `takt-default-team` | 実装と是正をTeam Leaderタスク分解を通じて実行する`takt-default`バリアント。 |
| `review` | コードを変更せずに、動的レビュアー選択とスーパーバイザー合成による多角的レビュー。 |
| `review-fix` | 動的レビュアー選択による多角的レビューに続き、デフォルトワークフローの審判・検証された是正ループと最終要件チェック。 |

ドメイン固有ファミリー（`simple-*` / `frontend` / `backend` / `dual` / CQRS / `*-mini`バリアント）は📦 Legacyカテゴリで引き続き利用可能です。

すべてのワークフローとペルソナについては[ビルトインカタログ](./docs/builtin-catalog.md)を参照してください。

## 主要コマンド

| コマンド | 説明 |
|---------|-------------|
| `takt` | AIに会話、要件の洗練、タスクの実行またはキュー |
| `takt exec` | ワークフローYAMLを書かずに即座にアシスタント/ワーカー/レビューエージェントモードを開始 |
| `takt make` | ワークフローメーカーを開始して、分離されたワークフローバンドルを対話的に作成または修正 |
| `takt add` | AI会話を通じてタスクを洗練し、キューに入れる（GitHub Issuesからも） |
| `takt run` | 保留中のすべてのタスクを実行 |
| `takt watch` | タスクキューを監視し、保留中のタスクを自動実行（常駐プロセス） |
| `takt ui` | `http://127.0.0.1:20525`で実験的なViewerファーストWeb UIを開く |
| `takt manager` | 実験的なゴール会話TUIを開く。自動的にタスクをキューして実行します（APIコストが発生）。詳細は[CLIリファレンス](./docs/cli-reference.md)を参照 |
| `takt director` | 全マネージャーにわたる監督用の実験的な会話TUIを開く；[Director](#director-experimental)を参照 |
| `takt list` | タスクブランチを管理（マージ、再試行、再キュー、停止、強制失敗、指示、削除） |
| `takt #N` | GitHub Issueをタスクの初期入力として使用 |
| `takt merge` | ワークフローでプルリクエストをレビュー、修正、マージ |
| `takt install <provider>` | SDKベースのプロバイダーのSDKをインストール |
| `takt update` | インストールされたプロバイダーSDKをTAKTでピン留めされたバージョンに更新 |
| `takt eject` | カスタマイズのためにビルトインワークフロー/ファセットをコピー |
| `takt workflow init` | 新しいワークフロースケルトンを作成 |
| `takt workflow doctor` | ワークフロー定義を検証 |
| `takt workflow inspect` | ワークフローの構成と解決ソースを検査 |
| `takt repertoire add` | GitHubからレパートリーパッケージをインストール |

マネージャー会話はデーモンで実行され、TUIを閉じても続行されます。詳細は[CLIリファレンス](./docs/cli-reference.md)を参照してください。

**Slack会話：** 構成されたSlackチャンネルからマネージャー会話に参加できます。詳細は[構成ガイド](./docs/configuration.md#slack-conversations-with-manager)を参照してください。

すべてのコマンドとオプションについては[CLIリファレンス](./docs/cli-reference.md)を参照してください。

### マネージャーツール権限

マネージャーのツール使用はAI権限審判によってレビューされます。機密パスは`~/.takt/config.yaml`または`.takt/config.yaml`で設定できます：

```yaml
manager:
  sensitive_paths: [private, config/credentials.json]
```

詳細は[構成ガイド](./docs/configuration.md#manager-sensitive-read-targets)を参照してください。

### インスタントexecモード

`takt exec`は対話型タスク入力モードを開始します。アシスタントエージェントがリクエストを明確化し、`/go`でワークフローを生成して実行します。

詳細は[CLIリファレンス](./docs/cli-reference.md#instant-exec-mode)を参照してください。

## Director（実験的）

対話型ターミナルでdirector会話TUIを開きます：

```bash
takt director
```

Directorは全マネージャーのゴールを確認し、注意が必要な場合に人間に通知します。実験的機能で、振る舞いは予告なく変更される場合があります。

詳細は[構成ガイド](./docs/configuration.md#slack-conversations-with-director)を参照してください。

## 構成

最小限の`~/.takt/config.yaml`：

```yaml
provider: claude-sdk    # claude-sdk, claude (エイリアス), claude-headless, claude-terminal, codex, opencode, deepseek-harness, cursor, copilot, kiro, devin, pi, または mock
model: sonnet       # プロバイダーに直接渡される
language: ja        # en または ja
```

実行メタデータ、セッション、トレース、レポート、その他の実行アーティファクトは`.takt/runs/<run>/`下の通常のファイルのままです。再開と再キューは適用可能な実行状態とレポートを保持します。

個別のステップのプロバイダーまたはモデルを選択するには、自動ルーティングを構成します。ルーティング決定をローカルに記録するには`takt telemetry enable`を実行してください。詳細は[構成ガイド](./docs/configuration.md)を参照してください。

またはプロバイダー認証情報を直接使用してください（SDKベースのプロバイダーは`takt install <provider>`が必要；OpenCodeはCLIも必要）：

```bash
export TAKT_ANTHROPIC_API_KEY=sk-ant-...   # Anthropic (Claude)
export TAKT_OPENAI_API_KEY=sk-...          # OpenAI (Codex)
export TAKT_OPENCODE_API_KEY=...           # OpenCode
export TAKT_CURSOR_API_KEY=...             # Cursor Agent (ログインしている場合はオプション)
export TAKT_COPILOT_GITHUB_TOKEN=ghp_...   # GitHub Copilot CLI
export TAKT_KIRO_API_KEY=...               # Kiro CLI
export DEEPSEEK_API_KEY=...                 # 公式DeepSeek Harness SDK
# オプション: export DEEPSEEK_BASE_URL=https://...
# PiはそのSDK認証情報ストアまたはプロバイダーネイティブ環境変数を使用します。
```

すべてのオプション、プロバイダープロファイル、モデル解決については[構成ガイド](./docs/configuration.md)を参照してください。

OpenCode呼び出しはデフォルトで60分のプロバイダーイベント非アクティビティ制限があります：タイマーは各プロバイダーイベントでリセットされるため、イベントが引き続き到着している間は健全な呼び出しはより長く実行できます。`provider_options.opencode.guards.call_timeout_ms`で制限を引き上げてください（最大86,400,000 ms）。ガードプロファイルとモデルごとのオーバーライドは[プロバイダー非アクティビティ期限とOpenCode実行ガード](./docs/configuration.md#provider-inactivity-deadline-and-opencode-execution-guards)に記載されています。

### 専用プロバイダー構成（`runtime.yaml`）

プロバイダー、モデル、ルーティング設定を`~/.takt/runtime.yaml`または`<プロジェクト>/.takt/runtime.yaml`に保持できます；プロジェクト設定が優先されます。これを使用して、実行設定をワークフロー定義から分離してください。`runtime.yaml`に切り替えるときは、レガシープロバイダー設定を混在させないでください。移行手順については[構成ガイド](./docs/configuration.md)を参照してください。

コンパニオンレビュアーはデフォルトで無効です。`runtime.yaml`のトップレベル`companion.enabled: true`ポリシーで有効にしてください；グローバルとプロジェクトポリシーは論理ANDで結合されるため、グローバルの`false`はプロジェクト設定で再有効にすることはできません。スキーマ、移行テーブル、コンパニオンポリシーの詳細については[docs/configuration.md](docs/configuration.md)を参照してください。

## カスタマイズ

### カスタムワークフロー

```bash
takt workflow init my-flow   # 新しいワークフロースケルトンを作成
takt workflow doctor my-flow # ワークフロー定義を検証
takt eject default           # ビルトインワークフローを~/.takt/workflows/にコピーして編集
```

### カスタムペルソナ

`~/.takt/facets/personas/`にMarkdownファイルを作成：

```markdown
# ~/.takt/facets/personas/my-reviewer.md
あなたはセキュリティに特化したコードレビュアーです。
```

ワークフローで参照：`persona: my-reviewer`

`~/.takt/personas/`は互換性パスとして依然として機能しますが、`takt catalog`は`facets/`ディレクトリのみをスキャンします。

詳細は[ワークフローガイド](./docs/workflows.md)を参照してください。ビルトインペルソナのリストは[ビルトインカタログ](./docs/builtin-catalog.md)にあります。

## CI/CD

TAKTはGitHub Actions用の[takt-action](https://github.com/nrslib/takt-action)を提供します：

```yaml
- uses: nrslib/takt-action@main
  with:
    anthropic_api_key: ${{ secrets.TAKT_ANTHROPIC_API_KEY }}
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

他のCIシステムでは、パイプラインモードを使用：

```bash
takt --pipeline --task "バグを修正" --auto-pr
```

完全なセットアップ手順については[CI/CDガイド](./docs/ci-cd.md)を参照してください。

## プロジェクト構造

```
~/.takt/                    # グローバル構成
├── config.yaml             # プロバイダー、モデル、言語など
├── workflows/              # ユーザーワークフロー定義
├── facets/                 # ユーザーファセット（ペルソナ、ポリシー、知識など）
└── repertoire/             # インストールされたレパートリーパッケージ

.takt/                      # プロジェクトレベル
├── config.yaml             # プロジェクト構成
├── workflows/              # プロジェクトワークフローオーバーライド
├── facets/                 # プロジェクトファセット
├── tasks.yaml              # 保留中のタスク
├── tasks/                  # タスク仕様
└── runs/                   # 実行レポート、ログ、コンテキスト
```

ワークフロー定義は`workflows/`下に保存されます。

## 仕様駆動開発の採用

TAKTワークフローは出力契約とレビューステップでSDDステージを表現できます。

コミュニティプロジェクト[j5ik2o/takt-sdd](https://github.com/j5ik2o/takt-sdd)は要件、実装、検証用のワークフローとファセットを提供します。ClaudeとCodexをサポートしています。次のコマンドでインストール：

```bash
npm install -g takt-sdd
```

他のコミュニティ統合については[外部統合](./docs/external-integrations.md)を参照してください。

## ドキュメント

| ドキュメント | 説明 |
|----------|-------------|
| [チュートリアル](./docs/tutorial.md) | 3つのフェーズで1つの例を改善しながら、タスクをキュー、実行、検査 |
| [CLIリファレンス](./docs/cli-reference.md) | すべてのコマンドとオプション |
| [構成](./docs/configuration.md) | グローバルとプロジェクト設定 |
| [観測可能性](./docs/observability.md) | フェーズレベルの使用イベントと分析ワークフロー |
| [ワークフローガイド](./docs/workflows.md) | ワークフローの作成とカスタマイズ |
| [ビルトインカタログ](./docs/builtin-catalog.md) | すべてのビルトインワークフローとペルソナ |
| [ファセットプロンプティング](./docs/faceted-prompting.md) | プロンプト設計方法論 |
| [トークン節約](./docs/token-saving.md) | トークン消費の測定と削減 |
| [形式仕様検証](./docs/formal-verification.md) | `/verify`を通じてQuintとAlloyで合意された要件をチェック |
| [レパートリーパッケージ](./docs/repertoire.md) | パッケージのインストールと共有 |
| [タスク管理](./docs/task-management.md) | タスクキュー、実行、分離 |
| [CI/CD統合](./docs/ci-cd.md) | GitHub Actionsとパイプラインモード |
| [外部統合](./docs/external-integrations.md) | コアを変更せずにTAKTを拡張するコミュニティ例（監査証跡など） |
| [変更履歴](./CHANGELOG.md) ([日本語](./docs/CHANGELOG.ja.md)) | バージョン履歴 |

### 簡体中文ドキュメント

簡体中文ドキュメントは`.zh-CN.md`サフィックスを使用し、英語と日本語ページと共存できます。[中国語ドキュメントインデックス](./docs/README.zh-CN.md)から始めてください。

翻訳カバレッジにはオンボーディングパス（README、チュートリアル、構成、CLIリファレンス）、ワークフロー作成、プロバイダー/外部統合、タスク管理が含まれます。他のガイドは英語または日本語で利用可能です。

## スポンサー

TAKTは[CodeRabbit](https://coderabbit.link/nrslib)のオープンソースサポートプログラムによってサポートされています。

<a href="https://coderabbit.link/nrslib">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://victorious-bubble-f69a016683.media.strapiapp.com/White_Typemark_79b9189d19.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://victorious-bubble-f69a016683.media.strapiapp.com/Orange_Typemark_43bf516c9d.svg">
    <img alt="CodeRabbit" src="https://victorious-bubble-f69a016683.media.strapiapp.com/Orange_Typemark_43bf516c9d.svg" height="40">
  </picture>
</a>

## コミュニティ

質問、議論、更新情報については[TAKT Discord](https://discord.gg/R2Xz3uYWxD)に参加してください。

## コントリビューション

Issueを伴うPRは特に歓迎します。バグ修正と小さな改善については、メンテナーの返信や議論の結論を待たずにPRを自由に提出してください。

プロジェクトの設計や互換性に影響する大きなリファクタリングや機能については、再作業を避けるために実装前にIssueでアプローチを議論することをお勧めします。

詳細は[CONTRIBUTING.md](./CONTRIBUTING.md)を参照してください。

## ライセンス

MIT — 詳細は[LICENSE](./LICENSE)を参照してください。
