#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP_DIR=$(mktemp -d)

# Clone the existing repo with depth 1 for speed
git clone --depth 1 https://github.com/saikumargudelly/saikumargudelly.git "$TMP_DIR"

# Copy updated files
cp "$DIR/README.md" "$DIR/banner.png" "$TMP_DIR/"

cd "$TMP_DIR"
git config user.name "$(git -C "$DIR" config user.name || echo 'Saikumar Gudelly')"
git config user.email "$(git -C "$DIR" config user.email || echo 'gudellysaikumar@gmail.com')"

git add README.md banner.png
if git diff --staged --quiet; then
  echo "No changes to deploy."
else
  COMMIT_MSG="${1:-feat: update profile banner}"
  git commit -m "$COMMIT_MSG"
  git push origin main
  echo "Successfully deployed to https://github.com/saikumargudelly!"
fi

rm -rf "$TMP_DIR"
