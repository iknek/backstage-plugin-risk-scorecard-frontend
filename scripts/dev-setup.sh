#!/usr/bin/env bash
set -e

# CI environments don't need the dev host
if [ "$CI" = "true" ]; then
  echo "CI detected — skipping dev-host setup."
  exit 0
fi

# 1. Initialize / update the submodule
git submodule update --init --recursive

# 2. Symlink the live plugin source into the host's workspaces
mkdir -p .dev-host/plugins
rm -rf .dev-host/plugins/ros
ln -s ../../plugins/ros .dev-host/plugins/ros

# 3. Patch the host's package.json so it resolves the plugin from the workspace
node scripts/patch-host-resolutions.js

# 4. Install host deps
(cd .dev-host && yarn install)

echo ""
echo "✅ Dev host ready. Run:  yarn dev:host"
