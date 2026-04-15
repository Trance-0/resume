#!/usr/bin/env bash
# Skill tree graph widget pre-build step.
# Copies the Jekyll include partial from this widget folder into _includes/
# so that `{% include skill-tree.html %}` resolves during the Jekyll build.
# The CSS and JS are served directly from /scripts/skill-tree-graph/ and do
# not need to be copied.
#
# Run locally:
#   bash scripts/skill-tree-graph/prebuild.sh
# Run in CI: see .github/workflows/build-skill-tree.yml

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$HERE/../.." && pwd)"

SRC="$HERE/skill-tree.html"
DEST_DIR="$REPO_ROOT/_includes"
DEST="$DEST_DIR/skill-tree.html"

if [[ ! -f "$SRC" ]]; then
  echo "prebuild: missing $SRC" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
cp "$SRC" "$DEST"
echo "skill-tree-graph prebuild: $SRC -> $DEST"
