# R2 Image Upload Instructions

> Step-by-step guide for uploading optimized images to Cloudflare R2

**Last Updated:** 2025-11-03

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Optimize Images](#step-1-optimize-images)
- [Step 2: Generate Upload Commands](#step-2-generate-upload-commands)
- [Step 3: Upload to R2](#step-3-upload-to-r2)
- [Step 4: Verify Uploads](#step-4-verify-uploads)
- [Step 5: Test in Application](#step-5-test-in-application)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### ✅ Required Tools

1. **Node.js & pnpm** (already installed)
2. **Wrangler CLI** - Cloudflare's command-line tool

   ```bash
   # Install globally
   npm install -g wrangler

   # Verify installation
   wrangler --version
   ```

3. **Cloudflare Account** - With R2 enabled

### ✅ Authentication

Before uploading, authenticate with Cloudflare:

```bash
wrangler login
```

This will open your browser for authentication. Follow the prompts.

### ✅ Verify R2 Access

```bash
# List buckets
wrangler r2 bucket list

# You should see: ecomate-dev
```

---

## Step 1: Optimize Images

Convert PNG images to optimized WebP format with multiple responsive sizes.

### Run Optimization Script

```bash
cd ecomate-fe-v2/apps/landing
pnpm optimize:images
```

### Expected Output

```
┌─────────────────────────────────────────┐
│   Image Optimization Script             │
│   Converting PNG → WebP + Responsive    │
└─────────────────────────────────────────┘

Found 4 PNG files to process

Processing: living-room.png (2.3 MB)
  → WebP 320w: 65 KB
  → WebP 640w: 180 KB
  → WebP 1024w: 320 KB
  → WebP 1920w: 650 KB
  → PNG fallback: 750 KB
  → Thumbnail: 4 KB
  ✓ Total WebP: 1.2 MB (48% smaller)

... (processing other images)

┌─────────────────────────────────────────┐
│   Optimization Complete!                │
└─────────────────────────────────────────┘

Summary:
  Original total:    8.2 MB
  Optimized total:   2.8 MB
  Savings:           5.4 MB (66%)
  Files generated:   24
  Output directory:  public/images-optimized/snapshot-banner
```

### Verify Output

```bash
# Check generated files
ls -lh public/images-optimized/snapshot-banner/

# Should see:
# - bath-room-320w.webp, bath-room-640w.webp, etc.
# - bed-room-320w.webp, bed-room-640w.webp, etc.
# - kitchen-room-320w.webp, kitchen-room-640w.webp, etc.
# - living-room-320w.webp, living-room-640w.webp, etc.
# - Thumbnails: *-thumb.webp
# - PNG fallbacks: *.png
```

---

## Step 2: Generate Upload Commands

Create upload script with Wrangler commands.

### Run Generator

```bash
pnpm generate:upload
```

### Expected Output

```
┌─────────────────────────────────────────┐
│   R2 Upload Commands Generator          │
└─────────────────────────────────────────┘

Found 24 image files

  → bath-room-320w.webp
  → bath-room-640w.webp
  → bath-room-1024w.webp
  → bath-room-1920w.webp
  → bath-room.png
  → bath-room-thumb.webp
  ... (all files listed)

┌─────────────────────────────────────────┐
│   Script Generated Successfully!        │
└─────────────────────────────────────────┘

Summary:
  Files to upload:    24
  Commands generated: 24
  Output script:      scripts/r2-upload-commands.sh
  R2 Bucket:          ecomate-dev
  R2 Prefix:          landing/banners
```

### Verify Generated Script

```bash
# Linux/Mac/WSL
cat scripts/r2-upload-commands.sh

# Windows (PowerShell)
type scripts\r2-upload-commands.sh
```

You should see Wrangler commands like:

```bash
wrangler r2 object put ecomate-dev/landing/banners/living-room-320w.webp \
  --file="public/images-optimized/snapshot-banner/living-room-320w.webp" \
  --content-type="image/webp" \
  --cache-control="public, max-age=31536000, immutable"
```

---

## Step 3: Upload to R2

Upload all optimized images to Cloudflare R2.

### Linux/Mac/WSL

```bash
# Make script executable
chmod +x scripts/r2-upload-commands.sh

# Run upload script
bash scripts/r2-upload-commands.sh
```

### Windows (Git Bash)

```bash
# Run with Git Bash
bash scripts/r2-upload-commands.sh
```

### Windows (Command Prompt)

```batch
REM Use the batch file instead
scripts\r2-upload-commands.bat
```

### Expected Output

```
======================================
  Uploading images to R2...
  Bucket: ecomate-dev
  Prefix: landing/banners
======================================

Uploading living-room...

✓ Uploaded living-room-320w.webp
✓ Uploaded living-room-640w.webp
✓ Uploaded living-room-1024w.webp
✓ Uploaded living-room-1920w.webp
✓ Uploaded living-room.png
✓ Uploaded living-room-thumb.webp

Uploading kitchen-room...
... (continues for all images)

======================================
  Upload Complete!
======================================

Verifying uploads...

Listing objects:
  landing/banners/bath-room-1024w.webp (320 KB)
  landing/banners/bath-room-1920w.webp (650 KB)
  ... (all 24 files listed)

======================================
  All Done!
======================================
```

### Upload Progress

- Each file upload takes ~2-5 seconds
- Total time: ~2-3 minutes for all 24 files
- If upload fails, script will stop with error message

---

## Step 4: Verify Uploads

Confirm all files are uploaded correctly.

### Method 1: Wrangler CLI

```bash
# List all uploaded files
wrangler r2 object list ecomate-dev --prefix="landing/banners/"

# Count files (should be 24)
wrangler r2 object list ecomate-dev --prefix="landing/banners/" | wc -l
```

### Method 2: Check Individual Files

```bash
# Check a specific file exists
wrangler r2 object get ecomate-dev/landing/banners/living-room-1024w.webp > /tmp/test.webp

# Verify it's a valid WebP image
file /tmp/test.webp
# Should output: /tmp/test.webp: RIFF (little-endian) data, Web/P image
```

### Method 3: Test CDN URLs

Open these URLs in your browser:

```
https://cdn.ecomatehome.com/landing/banners/living-room-1024w.webp
https://cdn.ecomatehome.com/landing/banners/kitchen-room-640w.webp
https://cdn.ecomatehome.com/landing/banners/bath-room-320w.webp
https://cdn.ecomatehome.com/landing/banners/bed-room-1920w.webp
```

All should load successfully!

---

## Step 5: Test in Application

Verify images load correctly in the landing app.

### Start Dev Server

```bash
cd ecomate-fe-v2/apps/landing
pnpm dev
```

### Open Application

Navigate to: `http://localhost:3000`

### Check DevTools

1. **Open DevTools** (F12 or Right-click → Inspect)
2. **Go to Network tab**
3. **Filter by "Img"**
4. **Scroll through tour section**

You should see:
- ✅ Images loading from `cdn.ecomatehome.com`
- ✅ WebP format being used
- ✅ Appropriate sizes for each viewport
- ✅ `cache-control` headers present
- ✅ Fast load times (<1s per image)

### Verify Responsive Images

Test different screen sizes:

1. **Mobile (320-640px):**
   - Should load: `*-320w.webp` or `*-640w.webp`
   - Size: ~50-200KB per image

2. **Tablet (768-1024px):**
   - Should load: `*-640w.webp` or `*-1024w.webp`
   - Size: ~180-350KB per image

3. **Desktop (1920px+):**
   - Should load: `*-1024w.webp` or `*-1920w.webp`
   - Size: ~320-700KB per image

### Check Performance

Run Lighthouse audit:

1. Open DevTools → Lighthouse tab
2. Select "Performance" category
3. Select "Mobile" device
4. Click "Analyze page load"

Expected improvements:
- ✅ Performance score: +15-20 points
- ✅ First Contentful Paint: <1.5s
- ✅ Largest Contentful Paint: <2.5s
- ✅ Total Blocking Time: <200ms

---

## Troubleshooting

### ❌ Error: "Wrangler not found"

**Solution:**
```bash
npm install -g wrangler
```

Or use npx:
```bash
npx wrangler login
npx wrangler r2 object list ecomate-dev
```

---

### ❌ Error: "Authentication required"

**Solution:**
```bash
wrangler login

# Or use API token
export CLOUDFLARE_API_TOKEN=your_token_here
```

---

### ❌ Error: "Bucket not found: ecomate-dev"

**Solution:**
1. Verify bucket exists:
   ```bash
   wrangler r2 bucket list
   ```

2. If bucket doesn't exist, create it:
   ```bash
   wrangler r2 bucket create ecomate-dev
   ```

---

### ❌ Error: "File not found: public/images-optimized/..."

**Solution:**
Run optimization script first:
```bash
pnpm optimize:images
```

---

### ❌ Images not loading in browser (404)

**Causes:**
1. **Wrong CDN domain** - Check Next.js config
2. **Wrong R2 prefix** - Check upload script
3. **Cloudflare DNS not propagated** - Wait 5-10 minutes

**Solutions:**

1. **Verify custom domain is active:**
   ```bash
   # Should resolve to Cloudflare IPs
   nslookup cdn.ecomatehome.com
   ```

2. **Check R2 object key:**
   ```bash
   wrangler r2 object list ecomate-dev --prefix="landing/banners/"
   ```

3. **Test direct R2 URL first:**
   ```
   https://139f0eb1478609f2bae677641e0b0709.r2.cloudflarestorage.com/ecomate-dev/landing/banners/living-room-1024w.webp
   ```

---

### ❌ Images load but are wrong format (PNG instead of WebP)

**Solution:**
Clear Next.js cache:
```bash
rm -rf .next
pnpm build
pnpm dev
```

---

### ❌ Upload script hangs or times out

**Solutions:**

1. **Check internet connection**
2. **Upload files individually:**
   ```bash
   wrangler r2 object put ecomate-dev/landing/banners/living-room-1024w.webp \
     --file="public/images-optimized/snapshot-banner/living-room-1024w.webp"
   ```

3. **Use Cloudflare Dashboard:**
   - Go to R2 → ecomate-dev bucket
   - Click "Upload"
   - Drag & drop files manually

---

### ❌ "Cache-control header not set"

This is expected! The upload script sets `cache-control` via command:
```bash
--cache-control="public, max-age=31536000, immutable"
```

Verify with:
```bash
curl -I https://cdn.ecomatehome.com/landing/banners/living-room-1024w.webp
```

Should see:
```
cache-control: public, max-age=31536000, immutable
```

---

## 📊 Success Checklist

Before considering this complete:

- [ ] ✅ Optimization script ran successfully
- [ ] ✅ 24 files generated in `public/images-optimized/`
- [ ] ✅ Upload script generated
- [ ] ✅ All 24 files uploaded to R2
- [ ] ✅ Files visible in R2 bucket list
- [ ] ✅ CDN URLs load in browser
- [ ] ✅ Images load from CDN in dev server
- [ ] ✅ Responsive images work on different screen sizes
- [ ] ✅ WebP format served (check DevTools)
- [ ] ✅ Cache headers present
- [ ] ✅ Lighthouse performance improved

---

## 🎯 Next Steps

After successful upload:

1. **Test on production build:**
   ```bash
   pnpm build
   pnpm start
   ```

2. **Monitor CDN analytics:**
   - Go to Cloudflare Dashboard → R2 → ecomate-dev
   - Check "Metrics" tab for usage stats

3. **Optimize more images:**
   - Add other images to `public/images/`
   - Rerun optimization script
   - Upload new files

4. **Setup CI/CD automation:**
   - Add optimization to build pipeline
   - Auto-upload on deployment

---

**Need help?** Check the main documentation or reach out to the team!
