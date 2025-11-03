@echo off
REM R2 Upload Script (Windows)
REM Generated automatically

echo ======================================
echo   Uploading images to R2...
echo   Bucket: ecomate-dev
echo   Prefix: landing/banners
echo ======================================
echo.

REM bathroom
echo Uploading bathroom...
wrangler r2 object put ecomate-dev/landing/banners/bath-room-320w.webp --file="public\images-optimized\snapshot-banner\bath-room-320w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bath-room-320w.webp
wrangler r2 object put ecomate-dev/landing/banners/bath-room-640w.webp --file="public\images-optimized\snapshot-banner\bath-room-640w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bath-room-640w.webp
wrangler r2 object put ecomate-dev/landing/banners/bath-room-1024w.webp --file="public\images-optimized\snapshot-banner\bath-room-1024w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bath-room-1024w.webp
wrangler r2 object put ecomate-dev/landing/banners/bath-room-1920w.webp --file="public\images-optimized\snapshot-banner\bath-room-1920w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bath-room-1920w.webp
wrangler r2 object put ecomate-dev/landing/banners/bath-room-thumb.webp --file="public\images-optimized\snapshot-banner\bath-room-thumb.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bath-room-thumb.webp

REM bathroom.png
echo Uploading bathroom.png...
wrangler r2 object put ecomate-dev/landing/banners/bath-room.png --file="public\images-optimized\snapshot-banner\bath-room.png" --content-type="image/png" --cache-control="public, max-age=31536000, immutable"
echo   Done: bath-room.png

REM bedroom
echo Uploading bedroom...
wrangler r2 object put ecomate-dev/landing/banners/bed-room-320w.webp --file="public\images-optimized\snapshot-banner\bed-room-320w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bed-room-320w.webp
wrangler r2 object put ecomate-dev/landing/banners/bed-room-640w.webp --file="public\images-optimized\snapshot-banner\bed-room-640w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bed-room-640w.webp
wrangler r2 object put ecomate-dev/landing/banners/bed-room-1024w.webp --file="public\images-optimized\snapshot-banner\bed-room-1024w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bed-room-1024w.webp
wrangler r2 object put ecomate-dev/landing/banners/bed-room-1920w.webp --file="public\images-optimized\snapshot-banner\bed-room-1920w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bed-room-1920w.webp
wrangler r2 object put ecomate-dev/landing/banners/bed-room-thumb.webp --file="public\images-optimized\snapshot-banner\bed-room-thumb.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: bed-room-thumb.webp

REM bedroom.png
echo Uploading bedroom.png...
wrangler r2 object put ecomate-dev/landing/banners/bed-room.png --file="public\images-optimized\snapshot-banner\bed-room.png" --content-type="image/png" --cache-control="public, max-age=31536000, immutable"
echo   Done: bed-room.png

REM kitchenroom
echo Uploading kitchenroom...
wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-320w.webp --file="public\images-optimized\snapshot-banner\kitchen-room-320w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: kitchen-room-320w.webp
wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-640w.webp --file="public\images-optimized\snapshot-banner\kitchen-room-640w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: kitchen-room-640w.webp
wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-1024w.webp --file="public\images-optimized\snapshot-banner\kitchen-room-1024w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: kitchen-room-1024w.webp
wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-1920w.webp --file="public\images-optimized\snapshot-banner\kitchen-room-1920w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: kitchen-room-1920w.webp
wrangler r2 object put ecomate-dev/landing/banners/kitchen-room-thumb.webp --file="public\images-optimized\snapshot-banner\kitchen-room-thumb.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: kitchen-room-thumb.webp

REM kitchenroom.png
echo Uploading kitchenroom.png...
wrangler r2 object put ecomate-dev/landing/banners/kitchen-room.png --file="public\images-optimized\snapshot-banner\kitchen-room.png" --content-type="image/png" --cache-control="public, max-age=31536000, immutable"
echo   Done: kitchen-room.png

REM livingroom
echo Uploading livingroom...
wrangler r2 object put ecomate-dev/landing/banners/living-room-320w.webp --file="public\images-optimized\snapshot-banner\living-room-320w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: living-room-320w.webp
wrangler r2 object put ecomate-dev/landing/banners/living-room-640w.webp --file="public\images-optimized\snapshot-banner\living-room-640w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: living-room-640w.webp
wrangler r2 object put ecomate-dev/landing/banners/living-room-1024w.webp --file="public\images-optimized\snapshot-banner\living-room-1024w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: living-room-1024w.webp
wrangler r2 object put ecomate-dev/landing/banners/living-room-1920w.webp --file="public\images-optimized\snapshot-banner\living-room-1920w.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: living-room-1920w.webp
wrangler r2 object put ecomate-dev/landing/banners/living-room-thumb.webp --file="public\images-optimized\snapshot-banner\living-room-thumb.webp" --content-type="image/webp" --cache-control="public, max-age=31536000, immutable"
echo   Done: living-room-thumb.webp

REM livingroom.png
echo Uploading livingroom.png...
wrangler r2 object put ecomate-dev/landing/banners/living-room.png --file="public\images-optimized\snapshot-banner\living-room.png" --content-type="image/png" --cache-control="public, max-age=31536000, immutable"
echo   Done: living-room.png


echo.
echo ======================================
echo   Upload Complete!
echo ======================================
echo.

wrangler r2 object list ecomate-dev --prefix="landing/banners/"

echo.
echo Next steps:
echo   1. Verify files at: https://cdn.ecomatehome.com/landing/banners/
echo   2. Update Next.js config and components
echo   3. Test on dev server: pnpm dev
echo.
pause
