#!/usr/bin/env bash
# sync-to-r2.sh — Copy project image folders from Google Drive → Cloudflare R2
# Usage: bash scripts/sync-to-r2.sh
#
# Prerequisites:
#   1. rclone installed (curl https://rclone.org/install.sh | sudo bash)
#   2. Google Drive remote configured: rclone config  →  name it "gdrive"
#      (requires browser OAuth flow, run once)

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

GDRIVE_FOLDER_ID="1dNBGzmXAEPWyAdx9p3YpT_fjmQWvQEvX"
GDRIVE_ROOT="gdrive:"

R2_PREFIX="works"   # images land at works/<project-folder>/<file>

ACCOUNT_ID="049f944e61de836e2644493c474fb193"
ACCESS_KEY="a6464c8aa38a8f37c9f327d9fd9e000d"
SECRET_KEY="80b6d7e8473d667d546c9e4acfaacacbe63d1e9c4fedec39bf4cfc38320f7271"

# ── rclone flags ──────────────────────────────────────────────────────────────

GDRIVE_FLAGS=(
  --drive-root-folder-id "$GDRIVE_FOLDER_ID"
)

R2_FLAGS=(
  --s3-provider Cloudflare
  --s3-access-key-id "$ACCESS_KEY"
  --s3-secret-access-key "$SECRET_KEY"
  --s3-endpoint "https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
)

# ── Sync ──────────────────────────────────────────────────────────────────────

echo "Listing project folders in Google Drive..."
FOLDERS=$(rclone lsd "$GDRIVE_ROOT" "${GDRIVE_FLAGS[@]}" | awk '{print $NF}')

if [[ -z "$FOLDERS" ]]; then
  echo "No folders found — check the folder ID or that gdrive remote is configured."
  exit 1
fi

echo "Found folders:"
echo "$FOLDERS"
echo ""

for FOLDER in $FOLDERS; do
  echo "── Uploading: $FOLDER"
  rclone copy \
    "$GDRIVE_ROOT$FOLDER" \
    ":s3:triangle-room/$R2_PREFIX/$FOLDER" \
    "${GDRIVE_FLAGS[@]}" \
    "${R2_FLAGS[@]}" \
    --progress \
    --transfers 4 \
    --include "*.{jpg,jpeg,png,webp,gif,avif}" \
    --no-update-modtime
  echo "   Done: $FOLDER"
done

echo ""
echo "All folders uploaded to r2://triangle-room/$R2_PREFIX/"
