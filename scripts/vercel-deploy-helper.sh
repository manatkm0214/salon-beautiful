#!/usr/bin/env bash
set -euo pipefail

echo "=== Vercel 環境変数 セットアップ ヘルパー ==="

if ! command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI が見つかりません。インストールしてください: npm i -g vercel"
  exit 1
fi

echo "Vercel にログインしてください（ブラウザが起動します）。"
vercel login || { echo "login failed"; exit 1; }

read -p "Vercel プロジェクト ID を入力してください: " VERCEL_PROJECT_ID

# helper to add env var for production only
add_env() {
  NAME="$1"
  PROMPT="$2"
  echo "---"
  read -p "$PROMPT (空欄でスキップ): " VAL
  if [ -z "$VAL" ]; then
    echo "スキップ: $NAME"
    return
  fi
  echo "Adding $NAME..."
  # vercel env add NAME production reads value from stdin; provide via here-doc
  vercel env add "$NAME" production <<EOF
$VAL
EOF
  echo "$NAME 設定完了"
}

echo "これからいくつかの環境変数を順に入力していただきます。Enter で次へ進み、値を貼り付けてください。"

add_env "DATABASE_URL" "DATABASE_URL を入力してください（例: postgresql://user:pass@host:5432/db?schema=public)"
add_env "BANK_ACCOUNT_NAME" "BANK_ACCOUNT_NAME を入力"
add_env "BANK_ACCOUNT_NUMBER" "BANK_ACCOUNT_NUMBER を入力"
add_env "BANK_NAME" "BANK_NAME を入力"
add_env "NEXT_PUBLIC_BANK_ACCOUNT_NAME" "NEXT_PUBLIC_BANK_ACCOUNT_NAME を入力 (クライアント表示用)"
add_env "NEXT_PUBLIC_BANK_ACCOUNT_NUMBER" "NEXT_PUBLIC_BANK_ACCOUNT_NUMBER を入力"
add_env "NEXT_PUBLIC_BANK_NAME" "NEXT_PUBLIC_BANK_NAME を入力"

# Auth0
add_env "AUTH0_ISSUER_BASE_URL" "AUTH0_ISSUER_BASE_URL を入力（例: https://your-tenant.us.auth0.com）"
add_env "AUTH0_CLIENT_ID" "AUTH0_CLIENT_ID を入力"
add_env "AUTH0_CLIENT_SECRET" "AUTH0_CLIENT_SECRET を入力"
add_env "AUTH0_SECRET" "AUTH0_SECRET を入力（長いランダム値推奨）"
add_env "AUTH0_BASE_URL" "AUTH0_BASE_URL を入力（例: https://your-site.vercel.app）"

# SMTP
add_env "SMTP_HOST" "SMTP_HOST を入力"
add_env "SMTP_PORT" "SMTP_PORT を入力"
add_env "SMTP_USER" "SMTP_USER を入力"
add_env "SMTP_PASS" "SMTP_PASS を入力"
add_env "SMTP_FROM" "SMTP_FROM を入力（例: noreply@your-domain.com）"

echo "---"
read -p "すべての環境変数を追加しました。今すぐ本番デプロイしますか？ (y/N): " yn
if [[ "$yn" =~ ^[Yy]$ ]]; then
  echo "デプロイ中..."
  vercel --prod
  echo "デプロイが完了しました。公開 URL を確認してください。"
else
  echo "スクリプト終了。手動で 'vercel --prod' を実行してデプロイしてください。"
fi
