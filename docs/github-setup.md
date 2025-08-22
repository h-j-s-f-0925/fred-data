# GitHubリポジトリの作成とプッシュ手順

## gh コマンドを使用した方法

### 新規リポジトリの作成とプッシュ

```bash
# リポジトリを作成し、リモートを追加してプッシュまで一括実行
gh repo create [リポジトリ名] --public --source=. --remote=origin --push
```

### 既存リポジトリへのプッシュ

リポジトリが既に存在する場合は：

```bash
# 通常のgit pushを実行
git push -u origin main
```

### オプション説明

- `--public`: パブリックリポジトリとして作成
- `--source=.`: 現在のディレクトリをソースとして使用
- `--remote=origin`: リモート名を'origin'として設定
- `--push`: 作成後に自動的にプッシュ

### トラブルシューティング

#### SSH認証エラーの場合

```bash
# HTTPSのURLに変更
git remote set-url origin https://github.com/username/repository-name.git
```

#### リポジトリ名重複エラーの場合

既存のリポジトリが存在するため、直接プッシュ：

```bash
git push -u origin main
```