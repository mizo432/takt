# TAKT

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/takt-logo-dark.svg">
    <img src="./assets/takt-logo.svg" alt="TAKT ロゴ" width="480">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/takt"><img src="https://img.shields.io/npm/v/takt?label=npm" alt="npm version"></a>
  <a href="https://github.com/nrslib/takt/stargazers"><img src="https://img.shields.io/github/stars/nrslib/takt?logo=github&label=stars" alt="GitHub stars"></a>
  <a href="https://github.com/nrslib/takt/actions/workflows/ci.yml"><img src="https://github.com/nrslib/takt/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="../LICENSE"><img src="https://img.shields.io/github/license/nrslib/takt" alt="license"></a>
  <a href="https://discord.gg/R2Xz3uYWxD"><img src="https://img.shields.io/badge/dynamic/json?label=discord&query=approximate_member_count&url=https%3A%2F%2Fdiscord.com%2Fapi%2Fv10%2Finvites%2FR2Xz3uYWxD%3Fwith_counts%3Dtrue&suffix=%20members&logo=discord&logoColor=white&color=5865F2" alt="Discord members"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> |
  <a href="./README.ja.md">日本語</a> |
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://nrslib.github.io/takt/#tutorial">
    <img src="./assets/tutorial-preview.ja.gif" alt="タスクの説明、キューへの追加、複数の AI エージェントによる実行を示す TAKT チュートリアル" width="720">
  </a>
</p>

**AIコーディングエージェントの監視から解放されましょう。**

TAKTは、AIコーディングエージェントを再利用可能な開発ワークフローに変えるオープンソースのCLIツールです。

計画、実装、レビュー、修正ループをYAMLで定義します。各ステップは分離された環境で実行され、ログを追跡できます。

1つのエージェントに全体を記憶させる代わりに、TAKTは各ステップに独自の役割とルールを提供します。エージェントはコードを書き、ワークフローが次に何をするかを決定します。

![AI コーディングエージェントのワークフローを制御する TAKT](./assets/description/01-hero.png)

- 計画 → 実装 → レビュー → 修正ループをワークフローステップとして実行
- 各ステップに独自の役割とルールを設定
- タスクを分離された環境で実行し、ログを追跡
- Claude Code、Codex、Cursor、GitHub Copilot CLIなどのAIエージェントをサポート

**T**AKT **A**gent **K**oordination **T**opologyは、複数のAIエージェントを調整します。

AIに会話してタスクを定義し、`takt run`で実行します。計画、実装、レビューはYAMLで定義されるため、プロセスはエージェントの裁量に委ねられません。

TAKTは主にAIコーディングのために作られていますが、複数のAIエージェントが協調する任意のタスクに適用できます。

TAKT自身もTAKTを使って構築されています（dogfooding）。

## なぜ TAKT か

AIコーディングエージェントは自動的に安定した開発プロセスを作成しません。長期間の作業では、指示を忘れたり、コンテキストが混乱したり、実装とレビューの責任が曖昧になったりすることがあります。

プロンプトにルールを追加するだけでは、プロセスを強制することはできません。ルールが守られるかどうかはエージェントの振る舞いに委ねられています。

TAKTはAIエージェントを外部から制御します。

ワークフローはフェーズを定義し、各ステップは独自の役割とルールを受け取ります。責任を分離し、各エージェントに必要な情報だけを提供することで、タスクの品質を向上させます。

レビューはスキップできません。問題は修正ステップに戻され、必要に応じて人間の判断を要求できます。各ステップはログを残すため、タスクからPRへの過程を追跡できます。

開発プロセスは人間の継続的な介入なしに、レビュー可能で再現可能です。

## 5分で試す

少なくとも1回 commit 済みの Git リポジトリで実行します。

```bash
npm install -g takt

# 既定の provider(claude-sdk)の SDK をインストールします
takt install claude-sdk

# AI と会話し、タスクを説明し、/go の後に「タスクにつむ」を選びます
takt

# 積んだタスクを隔離された worktree で実行します
takt run

# diff の確認、マージ、リトライ、リキュー、タスクブランチ削除を行います
takt list
```

初回実行時は `~/.takt/config.yaml` で provider を設定するか、[設定](#設定) にある API キー用の環境変数を使います。SDK 経由 provider の `claude-sdk`、`codex`、`opencode`、`pi`、`deepseek-harness` は Node.js で動きます。使う前に一度 `takt install <provider>` を実行してください。CLI 経由 provider には対応する外部 CLI が必要です。

## CodeRabbit レビューループ

GitHub PR に対して `takt caccia <PR番号>` を実行すると、CodeRabbit のレビューを待ち、隔離クローンで未解決の bot スレッドに対応し、反復ごとの判断レポートを保存します。マージ用 workflow は明示的な `caccia` 効果で同じループを実行します。`caccia.enabled` は効果が CodeRabbit を待つかを制御し、既定は無効です。push や PR 公開からの暗黙の実行はありません。[CLI リファレンス](./cli-reference.ja.md#takt-caccia)と[設定ガイド](./configuration.ja.md)を参照してください。

### 動画チュートリアル

[文章版チュートリアル](./tutorial.ja.md)に沿って実際に操作する様子を次の動画で確認できます。

| Chapter 1 | Chapter 2 |
|-----------|-----------|
| [![TAKT 動画チュートリアル Chapter 1 を見る](https://i.ytimg.com/vi/H_L_slDJNqs/hqdefault.jpg)](https://youtu.be/H_L_slDJNqs) | [![TAKT 動画チュートリアル Chapter 2 を見る](https://i.ytimg.com/vi/cfM9USMkh2Y/hqdefault.jpg)](https://youtu.be/cfM9USMkh2Y) |

## TAKT と通常の AI コーディングエージェントの違い

| 通常の AI コーディングエージェント | TAKT |
|------------------------------------|------|
| プロンプトでプロセスを守るよう依頼する | YAML workflow がプロセスを管理する |
| レビュー手順が忘れられたり飛ばされたりする | レビューと修正ループが明示的な遷移になる |
| 1つの長いコンテキストが肥大化し続ける | 各 step に必要なコンテキストだけを渡す |
| 実装とレビューの責務が混ざりやすい | persona、権限、output contract で責務を分ける |
| 作業がカレントツリーに直接入ることが多い | 積んだタスクはデフォルトで隔離された worktree で実行される |
| タスクから結果までの経路を追いにくい | ログとレポートでタスクから PR までの経路を追跡できる |
| 同じプロセスを記憶で再現する必要がある | workflow を再利用・レビュー・バージョン管理できる |

## 必要なもの

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
takt install claude-sdk   # codex、opencode、pi、deepseek-harness も同様
```

Nix flakes を使う場合:

```bash
nix run github:nrslib/takt
nix profile install github:nrslib/takt
```

Nix パッケージがインストールするのは TAKT CLI 本体のみです。外部 CLI プロバイダー、`git`、`gh`/`glab` は、[必要なもの](#必要なもの) に記載のとおり別途インストールして `PATH` に置くか、設定で指定してください。

### AI と相談してタスクを積む

```
$ takt

Select workflow:
  > 🎼 default (current)
    📁 🚀 クイックスタート/
    📁 🛠️ 開発/
    📁 🔍 レビュー/

対話モード - タスク内容を入力してください。準備ができたら /go で指示書を作成・実行します。

> ユーザー認証を JWT で追加して

[AI が要件を整理してくれます]

> /go

提案されたタスク指示:
  ...

どうしますか？
  > タスクにつむ          # ← 通常フロー・初期選択
    Issueを建てる
    その場で実行する
    会話を続ける
```

「タスクにつむ」を選ぶと `.takt/tasks/` にタスクが保存されます。`takt run` で実行すると、隔離されたワークツリー上でワークフロー（計画 → 実装 → レビュー → 修正ループ）が走り、終わったら PR を作成するか聞いてきます。

「Issueを作成」を選択すると、Issueが作成されます。オプションでタスクとしても保存できます。

```bash
# キューされたタスクを実行
takt run

# GitHub Issuesからキューすることもできます
takt add '#6'
```

> **「ここで今すぐ実行」**は現在のディレクトリで直接実行します。通常のフローはタスクを保存して`takt run`を使用することです。

### 結果を管理する

```bash
# タスクブランチの一覧を確認し、マージ、リトライ、リキュー、停止依頼、強制失敗、削除ができます
takt list
```

**停止**は実行中のタスクを停止します。**失敗としてマーク**はステータスのみを変更します。

## 仕組み

TAKT という名前はオーケストラの指揮で拍を刻むために使われる「拍」「指揮棒の一振り」を意味するドイツ語の「タクト（Takt）」に由来しています。TAKT はユーザー向けにも実装名にも **workflow** と **step** を使います。

workflow は step の並びで構成されます。YAML では `steps`、`initial_step`、`max_steps` を使います。各 step では persona（誰が実行するか）、権限（何を許可するか）、ルール（次にどこへ進むか）を指定します。最小の例は次の通りです。

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
        next: implement    # <- 修正ループ
```

ルールが次の step を決めます。`COMPLETE` でワークフロー成功終了、`ABORT` で失敗終了です。完全なスキーマ、並列 step、ルール条件の詳細は [Workflow Guide](./workflows.ja.md) を参照してください。

繰り返し使う step 定義は `.takt/steps/` に置き、workflow から `uses` で参照できます。探索順と上書き規則は [Workflow Guide](./workflows.ja.md) を参照してください。

workflow ファイルの正式ディレクトリ名は `workflows/` です。

同名 workflow が複数箇所にある場合の探索順は `.takt/workflows/` → `~/.takt/workflows/` → builtin です。

## おすすめワークフロー

| Workflow | 用途 |
|-------|------|
| `default` | 標準の開発 workflow。シナリオベースの計画とテスト先行開発に、動的実装 companion、多観点並列ピアレビュー、裁定、収束型 fix ループを組み合わせた構成。 |
| `maintenance` | 既存コードベース向けの `default` 派生。変更範囲外の契約を保存し、因果関係のある差分に限定して進める。 |
| `simple` | `pure` と同じ最小構造に、変更内容に応じて TAKT がドメインファセットを自動選択して注入する軽量 workflow。AI アンチパターンとアーキテクチャの指針は常に含む。 |
| `pure` | ドメインファセットを注入しない最小 workflow。モデル自身の判断と SKILL 選択を信頼する。 |
| `takt-default` | TAKT 自体の開発で実際に使われている workflow。CLI ツールの開発にそのまま活用できます。 |
| `takt-default-team` | 実装・修正を Team Leader のタスク分解で実行する `takt-default` の派生。 |
| `review` | 動的レビュワー選択と supervisor による統合を行う、コードを変更しない多観点レビュー。 |
| `review-fix` | 動的レビュワー選択の後、標準 workflow と同じ裁定・検証付き修正ループと要件の最終確認で収束させる多観点レビュー。 |

ドメイン特化ファミリー（`simple-*` / `frontend` / `backend` / `dual` / CQRS / `*-mini` 系）は 📦 レガシーカテゴリで引き続き利用できます。

全ワークフロー・ペルソナの一覧は [Builtin Catalog](./builtin-catalog.ja.md) を参照してください。

## 主要コマンド

| コマンド | 説明 |
|---------|------|
| `takt` | AI と相談して、タスクを実行または積みます |
| `takt exec` | ワークフロー YAML を書かずにマルチエージェントを即座に実行します |
| `takt make` | Workflow Maker を起動し、対話で独立したワークフローバンドルを作成・修正します |
| `takt add` | AI と会話してタスク要件を精緻化し、タスクを積みます（GitHub Issue からも可） |
| `takt run` | 積まれたタスクをまとめて実行します |
| `takt watch` | タスクキューを監視し、pending タスクを自動実行します（常駐プロセス） |
| `takt ui` | 実験的な Viewer 中心の Web UI を `http://127.0.0.1:20525` で起動します |
| `takt manager` | 実験的なゴール会話TUIを開く。自動的にタスクをキューして実行します（APIコストが発生）。詳細は[CLIリファレンス](./cli-reference.ja.md)を参照 |
| `takt director` | 全 manager を見渡す実験的な会話 TUI を開きます。[director](#director実験的)を参照してください |
| `takt list` | タスクブランチを管理します（マージ、リトライ、リキュー、停止依頼、強制失敗、追加指示、削除） |
| `takt #N` | GitHub Issue を初期入力としてタスク化します |
| `takt merge` | workflow で PR のレビュー・修正・マージを行います |
| `takt install <provider>` | SDK 経由 provider の SDK をインストールします |
| `takt update` | インストール済みの provider SDK を TAKT が固定した版に更新します |
| `takt eject` | ビルトインの workflow/facet をコピーしてカスタマイズできます |
| `takt workflow init` | カスタム workflow のひな形を作成します |
| `takt workflow doctor` | カスタム workflow の定義を静的検証します |
| `takt workflow inspect` | workflow の設定と解決ソースを検査します |
| `takt repertoire add` | GitHub から repertoire パッケージをインストールします |

マネージャー会話はデーモンで実行され、TUIを閉じても続行されます。詳細は[CLIリファレンス](./cli-reference.ja.md)を参照してください。

**Slack会話：** 構成されたSlackチャンネルからマネージャー会話に参加できます。詳細は[構成ガイド](./configuration.ja.md#slack-conversations-with-manager)を参照してください。

すべてのコマンドとオプションについては[CLIリファレンス](./cli-reference.ja.md)を参照してください。


### マネージャーツール権限

マネージャーのツール使用はAI権限審判によってレビューされます。機密パスは`~/.takt/config.yaml`または`.takt/config.yaml`で設定できます：

```yaml
manager:
  sensitive_paths: [private, config/credentials.json]
```

詳細は[構成ガイド](./configuration.ja.md#manager-sensitive-read-targets)を参照してください。

### インスタントexecモード

`takt exec`は対話型タスク入力モードを開始します。アシスタントエージェントがリクエストを明確化し、`/go`でワークフローを生成して実行します。

詳細は[CLIリファレンス](./cli-reference.ja.md#instant-exec-mode)を参照してください。

## Director（実験的）

対話型ターミナルでdirector会話TUIを開きます：

```bash
takt director
```

Directorは全マネージャーのゴールを確認し、注意が必要な場合に人間に通知します。実験的機能で、振る舞いは予告なく変更される場合があります。

詳細は[構成ガイド](./configuration.ja.md#slack-conversations-with-director)を参照してください。

## 設定

最小限の `~/.takt/config.yaml` は次の通りです。

```yaml
provider: claude-sdk    # claude-sdk, claude (alias), claude-headless, claude-terminal, codex, opencode, deepseek-harness, cursor, copilot, kiro, devin, pi, or mock
model: sonnet       # プロバイダーにそのまま渡されます
language: ja        # en or ja
```

run metadata、session、trace、report などの run artifact は `.takt/runs/<run>/` 配下の通常ファイルとして保存されます。resume / requeue では該当する run state と report を引き継ぎます。

ステップごとにプロバイダやモデルを選びたい場合は自動ルーティングを設定できます。選択結果を確認するには `takt telemetry enable` でローカル記録を有効にしてください。詳しい設定は[設定ガイド](./configuration.ja.md)を参照してください。

provider の認証情報を直接使う場合、Claude SDK、Codex、Pi に外部 CLI のインストールは不要です。SDK 経由 provider には `takt install <provider>` が必要で、OpenCode は外部 CLI も必要です。

```bash
export TAKT_ANTHROPIC_API_KEY=sk-ant-...   # Anthropic (Claude)
export TAKT_OPENAI_API_KEY=sk-...          # OpenAI (Codex)
export TAKT_OPENCODE_API_KEY=...           # OpenCode
export TAKT_CURSOR_API_KEY=...             # Cursor Agent（login 済みなら省略可）
export TAKT_COPILOT_GITHUB_TOKEN=ghp_...   # GitHub Copilot CLI
export TAKT_KIRO_API_KEY=...               # Kiro CLI
export DEEPSEEK_API_KEY=...                 # 公式 DeepSeek Harness SDK
# 任意: export DEEPSEEK_BASE_URL=https://...
# Pi は SDK の credential store または provider-native 環境変数を使用
```

OpenCode の呼び出しには既定で 60 分の provider イベント無活動上限があります。タイマーは provider イベントごとにリセットされるため、イベントが届き続ける限り呼び出しは 60 分を超えて実行できます。上限は `provider_options.opencode.guards.call_timeout_ms`（最大 86,400,000 ms）で変更できます。guard プロファイルとモデル別上書きは [Configuration Guide](./configuration.ja.md) を参照してください。

### プロバイダー設定専用レイヤー（`runtime.yaml`）

プロバイダ、モデル、ルーティングは `~/.takt/runtime.yaml` または `<project>/.takt/runtime.yaml` にまとめて設定できます。プロジェクト側の設定が優先されます。ワークフローの定義と実行環境の設定を分けたい場合に使ってください。`runtime.yaml` を使う場合は旧来のプロバイダ設定と混在させず、移行方法を[設定ガイド](./configuration.ja.md)で確認してください。

companion reviewer は既定で無効です。有効化する場合は `runtime.yaml` のトップレベルに `companion.enabled: true` を設定します。global と project の両方に設定がある場合は論理積で合成するため、global 側の `false` を project 側で再有効化することはできません。

全設定項目・プロバイダープロファイル・モデル解決の詳細は [Configuration Guide](./configuration.ja.md) を参照してください。

## カスタマイズ

### カスタム workflow

```bash
takt workflow init my-flow   # カスタム workflow のひな形を作成
takt workflow doctor my-flow # workflow 定義を静的検証
takt eject default           # ビルトイン workflow を ~/.takt/workflows/ にコピーして編集
```

### カスタム persona

`~/.takt/facets/personas/` に Markdown ファイルを置きます。

```markdown
# ~/.takt/facets/personas/my-reviewer.md
You are a code reviewer specialized in security.
```

workflow から `persona: my-reviewer` で参照できます。

`~/.takt/personas/` も互換パスとして動作しますが、`takt catalog` が走査するのは `facets/` 配下だけです。

詳細は [Workflow Guide](./workflows.ja.md) を参照してください。ビルトインの persona 一覧は [Builtin Catalog](./builtin-catalog.ja.md) にあります。

## CI/CD

GitHub Actions 向けに [takt-action](https://github.com/nrslib/takt-action) を提供しています。

```yaml
- uses: nrslib/takt-action@main
  with:
    anthropic_api_key: ${{ secrets.TAKT_ANTHROPIC_API_KEY }}
    github_token: ${{ secrets.GITHUB_TOKEN }}
```

他の CI ではパイプラインモードを使います。

```bash
takt --pipeline --task "バグを修正して" --auto-pr
```

セットアップの詳細は [CI/CD Guide](./ci-cd.ja.md) を参照してください。

## プロジェクト構造

```
~/.takt/                    # グローバル設定
├── config.yaml             # プロバイダー、モデル、言語など
├── workflows/              # ユーザー定義の workflow
├── facets/                 # ユーザー定義のファセット（personas, policies, knowledge など）
└── repertoire/             # インストール済み repertoire パッケージ

.takt/                      # プロジェクトレベル
├── config.yaml             # プロジェクト設定
├── workflows/              # プロジェクト定義の workflow
├── facets/                 # プロジェクトのファセット
├── tasks.yaml              # 積まれたタスク
├── tasks/                  # タスクの仕様書
└── runs/                   # 実行レポート、ログ、コンテキスト
```

workflow 定義は `workflows/` 配下に配置します。

## Spec-Driven Development を採用する場合

TAKT の workflow では、成果物の出力契約やレビュー手順を使って仕様駆動開発（SDD）の工程を表現できます。

コミュニティの [j5ik2o/takt-sdd](https://github.com/j5ik2o/takt-sdd) は、要件定義から実装・検証までの workflow と facet を提供します。Claude と Codex に対応し、次のコマンドで導入できます。

```bash
npm install -g takt-sdd
```

コミュニティの他の統合は [External Integrations](./external-integrations.ja.md) を参照してください。

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [チュートリアル](./tutorial.ja.md) | 3 フェーズで題材を改良しながら、タスクを積み、実行し、結果を確認する流れ |
| [CLI Reference](./cli-reference.ja.md) | 全コマンド・オプション |
| [Configuration](./configuration.ja.md) | グローバル設定・プロジェクト設定 |
| [Observability](./observability.ja.md) | phase 粒度の usage events と集計 workflow |
| [Workflow Guide](./workflows.ja.md) | workflow の作成・カスタマイズ |
| [Builtin Catalog](./builtin-catalog.ja.md) | ビルトイン workflow・persona の一覧 |
| [Faceted Prompting](./faceted-prompting.ja.md) | プロンプト設計の方法論 |
| [Token Saving](./token-saving.ja.md) | トークン消費の計測と節約 |
| [形式仕様の検証](./formal-verification.ja.md) | `/verify` で合意した要件を Quint と Alloy で検証する |
| [Repertoire Packages](./repertoire.ja.md) | パッケージのインストール・共有 |
| [Task Management](./task-management.ja.md) | タスクの追加・実行・隔離 |
| [CI/CD Integration](./ci-cd.ja.md) | GitHub Actions・パイプラインモード |
| [External Integrations](./external-integrations.ja.md) | TAKT コアを変更せずに機能を拡張するコミュニティサンプル（監査ログ等） |
| [Changelog](../CHANGELOG.md) ([日本語](./CHANGELOG.ja.md)) | バージョン履歴 |

## スポンサー

TAKT は [CodeRabbit](https://coderabbit.link/nrslib) の Open Source Support Program によってサポートされています。

<a href="https://coderabbit.link/nrslib">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://victorious-bubble-f69a016683.media.strapiapp.com/White_Typemark_79b9189d19.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://victorious-bubble-f69a016683.media.strapiapp.com/Orange_Typemark_43bf516c9d.svg">
    <img alt="CodeRabbit" src="https://victorious-bubble-f69a016683.media.strapiapp.com/Orange_Typemark_43bf516c9d.svg" height="40">
  </picture>
</a>

## コミュニティ

質問・議論・最新情報は [TAKT Discord](https://discord.gg/R2Xz3uYWxD) へどうぞ。

## コントリビュート

Issue とあわせた PR の提出を特に歓迎します。バグ修正や小さな改善は、メンテナーの返信や議論の完了を待たずに PR を提出していただいて構いません。

大規模なリファクタリングや、プロジェクトの設計・互換性に影響する機能追加は、手戻りを避けるため、実装前に Issue で方針を相談することをおすすめします。

[CONTRIBUTING.ja.md](./CONTRIBUTING.ja.md)（[English](../CONTRIBUTING.md)）を参照してください。

## ライセンス

MIT — [LICENSE](../LICENSE) を参照してください。
