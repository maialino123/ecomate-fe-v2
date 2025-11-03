#!/bin/bash
#
# R2 Upload Script
# Generated automatically by generate-upload-commands.ts
#
# This script uploads optimized images to Cloudflare R2
#
# Prerequisites:
#   - Wrangler CLI installed: npm install -g wrangler
#   - Authenticated: wrangler login
#
# Usage:
#   bash scripts/r2-upload-commands.sh
#

set -e  # Exit on error

echo "======================================"
echo "  Uploading images to R2..."
echo "  Bucket: ecomate-dev"
echo "  Prefix: landing/banners"
echo "======================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# bathroom
echo "${BLUE}Uploading bathroom...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/bath-room-320w.webp \
  --file="public/images-optimized/snapshot-banner/bath-room-320w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bath-room-320w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bath-room-640w.webp \
  --file="public/images-optimized/snapshot-banner/bath-room-640w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bath-room-640w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bath-room-1024w.webp \
  --file="public/images-optimized/snapshot-banner/bath-room-1024w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bath-room-1024w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bath-room-1920w.webp \
  --file="public/images-optimized/snapshot-banner/bath-room-1920w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bath-room-1920w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bath-room-thumb.webp \
  --file="public/images-optimized/snapshot-banner/bath-room-thumb.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bath-room-thumb.webp"


# bathroom.png
echo "${BLUE}Uploading bathroom.png...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/bath-room.png \
  --file="public/images-optimized/snapshot-banner/bath-room.png" \
  --content-type="image/png" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bath-room.png"


# bedroom
echo "${BLUE}Uploading bedroom...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/bed-room-320w.webp \
  --file="public/images-optimized/snapshot-banner/bed-room-320w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bed-room-320w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bed-room-640w.webp \
  --file="public/images-optimized/snapshot-banner/bed-room-640w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bed-room-640w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bed-room-1024w.webp \
  --file="public/images-optimized/snapshot-banner/bed-room-1024w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bed-room-1024w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bed-room-1920w.webp \
  --file="public/images-optimized/snapshot-banner/bed-room-1920w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bed-room-1920w.webp"

wrangler r2 object put ecomate-dev/landing/banners/bed-room-thumb.webp \
  --file="public/images-optimized/snapshot-banner/bed-room-thumb.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bed-room-thumb.webp"


# bedroom.png
echo "${BLUE}Uploading bedroom.png...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/bed-room.png \
  --file="public/images-optimized/snapshot-banner/bed-room.png" \
  --content-type="image/png" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded bed-room.png"


# kitchenroom
echo "${BLUE}Uploading kitchenroom...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-320w.webp \
  --file="public/images-optimized/snapshot-banner/kitchen-room-320w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded kitchen-room-320w.webp"

wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-640w.webp \
  --file="public/images-optimized/snapshot-banner/kitchen-room-640w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded kitchen-room-640w.webp"

wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-1024w.webp \
  --file="public/images-optimized/snapshot-banner/kitchen-room-1024w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded kitchen-room-1024w.webp"

wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-1920w.webp \
  --file="public/images-optimized/snapshot-banner/kitchen-room-1920w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded kitchen-room-1920w.webp"

wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-thumb.webp \
  --file="public/images-optimized/snapshot-banner/kitchen-room-thumb.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded kitchen-room-thumb.webp"


# kitchenroom.png
echo "${BLUE}Uploading kitchenroom.png...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/kitchen-room.png \
  --file="public/images-optimized/snapshot-banner/kitchen-room.png" \
  --content-type="image/png" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded kitchen-room.png"


# livingroom
echo "${BLUE}Uploading livingroom...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/living-room-320w.webp \
  --file="public/images-optimized/snapshot-banner/living-room-320w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded living-room-320w.webp"

wrangler r2 object put ecomate-dev/landing/banners/living-room-640w.webp \
  --file="public/images-optimized/snapshot-banner/living-room-640w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded living-room-640w.webp"

wrangler r2 object put ecomate-dev/landing/banners/living-room-1024w.webp \
  --file="public/images-optimized/snapshot-banner/living-room-1024w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded living-room-1024w.webp"

wrangler r2 object put ecomate-dev/landing/banners/living-room-1920w.webp \
  --file="public/images-optimized/snapshot-banner/living-room-1920w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded living-room-1920w.webp"

wrangler r2 object put ecomate-dev/landing/banners/living-room-thumb.webp \
  --file="public/images-optimized/snapshot-banner/living-room-thumb.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded living-room-thumb.webp"


# livingroom.png
echo "${BLUE}Uploading livingroom.png...${NC}"

wrangler r2 object put ecomate-dev/landing/banners/living-room.png \
  --file="public/images-optimized/snapshot-banner/living-room.png" \
  --content-type="image/png" \
  --cache-control="public, max-age=31536000, immutable"
echo "${GREEN}✓${NC} Uploaded living-room.png"



echo ""
echo "======================================"
echo "  Upload Complete!"
echo "======================================"
echo ""
echo "Verifying uploads..."
echo ""

# List uploaded files
wrangler r2 object list ecomate-dev --prefix="landing/banners/"

echo ""
echo "======================================"
echo "  All Done!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Verify files at: https://cdn.ecomatehome.com/landing/banners/"
echo "  2. Update Next.js config and components"
echo "  3. Test on dev server: pnpm dev"
echo ""
