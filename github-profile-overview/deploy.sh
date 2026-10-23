#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP_DIR=$(mktemp -d)

cp "$DIR/README.md" "$DIR/banner.png" "$TMP_DIR/"

cd "$TMP_DIR"
git init -b main
git config user.name "$(git -C "$DIR" config user.name || echo 'Saikumar Gudelly')"
git config user.email "$(git -C "$DIR" config user.email || echo 'gudellysaikumar@gmail.com')"
git add README.md banner.png
git commit -m "feat: setup GitHub profile overview"
git remote add origin https://github.com/saikumargudelly/saikumargudelly.git
git push -u origin main

rm -rf "$TMP_DIR"
echo "Done! Check your profile at: https://github.com/saikumargudelly"
