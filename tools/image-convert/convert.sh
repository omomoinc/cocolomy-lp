#!/bin/sh
# ヒーロー画像を WebP に変換し、背景をぼかす（Git Bash で実行）
# 使い方: sh tools/image-convert/convert.sh "<写真.png>" "<円のデザイン.png>"
# 出力: assets/images/hero-cafeteria.webp / hero-cafeteria-sp.webp / hero-bg-blur.webp
# 仕組み: 画像を埋め込んだHTMLを headless Edge で開き、canvas で WebP に書き出す（追加インストール不要）
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
TMP="$(mktemp -d)"
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
node "$DIR/build.js" "$1" "$2" "$TMP/convert.html"
"$EDGE" --headless=new --disable-gpu --virtual-time-budget=15000 --dump-dom "file:///$(cygpath -m "$TMP")/convert.html" > "$TMP/dom.html" 2>/dev/null
node "$DIR/extract.js" "$TMP/dom.html" "$ROOT/assets/images"
rm -rf "$TMP"
