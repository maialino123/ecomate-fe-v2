# Cloudflare R2 Custom Domain Setup Guide

> Hướng dẫn cấu hình custom domain cho Cloudflare R2 bucket qua Dashboard UI

## 📋 Mục lục

- [Yêu cầu](#yêu-cầu)
- [Bước 1: Tạo Custom Domain](#bước-1-tạo-custom-domain)
- [Bước 2: Cấu hình DNS](#bước-2-cấu-hình-dns)
- [Bước 3: Cấu hình SSL/TLS](#bước-3-cấu-hình-ssltls)
- [Bước 4: Thiết lập CORS](#bước-4-thiết-lập-cors)
- [Bước 5: Cache Rules](#bước-5-cache-rules)
- [Bước 6: Integrate với Next.js](#bước-6-integrate-với-nextjs)
- [Testing & Verification](#testing--verification)
- [Troubleshooting](#troubleshooting)

---

## Yêu cầu

- ✅ Cloudflare account với R2 enabled
- ✅ Domain đã được add vào Cloudflare (VD: `ecomatehome.com`)
- ✅ R2 bucket đã tạo (hiện tại: `ecomate-dev`)
- ✅ Quyền truy cập vào Cloudflare Dashboard

**R2 Bucket hiện tại:**
```
Bucket Name: ecomate-dev
Account ID: 139f0eb1478609f2bae677641e0b0709
Endpoint: https://139f0eb1478609f2bae677641e0b0709.r2.cloudflarestorage.com
```

---

## Bước 1: Tạo Custom Domain

### 1.1. Truy cập R2 Dashboard

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn account của bạn
3. Sidebar bên trái → Click **R2**
4. Chọn bucket `ecomate-dev`

### 1.2. Add Custom Domain

1. Trong trang bucket detail, click tab **Settings**
2. Scroll xuống section **"Public Access"** hoặc **"Custom Domains"**
3. Click button **"Connect Domain"** hoặc **"Add Custom Domain"**
4. Nhập domain/subdomain bạn muốn dùng:

**Recommended options:**
```
Option 1: cdn.ecomatehome.com     (Tốt nhất cho CDN)
Option 2: assets.ecomatehome.com  (Semantic cho assets)
Option 3: r2.ecomatehome.com      (Đơn giản, rõ ràng)
```

5. Click **"Continue"** hoặc **"Add Domain"**

### 1.3. Lưu ý quan trọng

⚠️ **Domain/subdomain phải nằm trong zone Cloudflare của bạn**
- Nếu domain chưa có trong Cloudflare → Add domain vào Cloudflare trước
- Nếu dùng subdomain → Đảm bảo root domain đã có trong Cloudflare

---

## Bước 2: Cấu hình DNS

Sau khi add custom domain, Cloudflare sẽ tự động tạo DNS record.

### 2.1. Verify DNS Record

1. Sidebar → Click **DNS** (ở menu chính, không phải trong R2)
2. Chọn domain của bạn (VD: `ecomatehome.com`)
3. Tìm DNS record vừa tạo:

```
Type: CNAME
Name: cdn (hoặc assets, r2)
Target: ecomate-dev.r2.cloudflarestorage.com (hoặc tương tự)
Proxy status: Proxied (☁️ màu cam)
TTL: Auto
```

### 2.2. Đảm bảo Proxy Status = Proxied

⚠️ **QUAN TRỌNG:** Phải enable proxy (☁️ màu cam) để:
- Sử dụng Cloudflare CDN
- Enable cache
- SSL/TLS hoạt động
- Analytics tracking

**Cách enable:**
- Click vào DNS record
- Toggle **"Proxy status"** thành **ON** (☁️ màu cam)
- Click **Save**

---

## Bước 3: Cấu hình SSL/TLS

### 3.1. Set SSL/TLS Mode

1. Sidebar → Click **SSL/TLS**
2. Chọn domain của bạn
3. Tab **"Overview"**
4. Chọn encryption mode: **"Full (strict)"**

```
┌─────────────────────────────────────┐
│ SSL/TLS Encryption Mode             │
├─────────────────────────────────────┤
│ ○ Off                                │
│ ○ Flexible                           │
│ ○ Full                               │
│ ● Full (strict)  ← CHỌN CÁI NÀY     │
│ ○ Strict (SSL Only)                  │
└─────────────────────────────────────┘
```

### 3.2. Enable Always Use HTTPS

1. Vẫn trong **SSL/TLS** section
2. Tab **"Edge Certificates"**
3. Scroll xuống **"Always Use HTTPS"**
4. Toggle **ON**

### 3.3. Enable HSTS (Optional nhưng recommended)

1. Vẫn trong tab **"Edge Certificates"**
2. Scroll xuống **"HTTP Strict Transport Security (HSTS)"**
3. Click **"Enable HSTS"**
4. Settings recommended:
   ```
   Max Age Header: 6 months
   Include subdomains: ON (nếu dùng subdomain)
   Preload: OFF (trừ khi bạn chắc chắn)
   No-Sniff Header: ON
   ```
5. Click **"Next"** → **"I understand"** → **"Enable HSTS"**

---

## Bước 4: Thiết lập CORS

Để Next.js có thể load images từ R2, cần cấu hình CORS.

### 4.1. Access R2 CORS Settings

1. Sidebar → **R2**
2. Click bucket `ecomate-dev`
3. Tab **"Settings"**
4. Scroll xuống section **"CORS Policy"**
5. Click **"Edit CORS policy"** hoặc **"Add CORS policy"**

### 4.2. Add CORS Configuration

**Option 1: Development (Permissive)**
```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://ecomatehome.com",
      "https://*.ecomatehome.com"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

**Option 2: Production (Strict)**
```json
[
  {
    "AllowedOrigins": [
      "https://ecomatehome.com",
      "https://www.ecomatehome.com"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "Content-Type",
      "Range"
    ],
    "ExposeHeaders": [
      "Content-Length",
      "Content-Range",
      "ETag"
    ],
    "MaxAgeSeconds": 86400
  }
]
```

6. Paste configuration vào editor
7. Click **"Save"**

---

## Bước 5: Cache Rules

Tối ưu caching cho images để tăng performance.

### 5.1. Create Cache Rule

1. Sidebar → Click **Caching** → **Cache Rules**
2. Click **"Create rule"**
3. Rule name: `R2 Images Cache`

### 5.2. Configure Rule Matching

**When incoming requests match:**
```
Field: Hostname
Operator: equals
Value: cdn.ecomatehome.com (custom domain của bạn)

AND

Field: File extension
Operator: is in list
Value: jpg jpeg png webp avif gif svg ico
```

### 5.3. Configure Cache Settings

**Then:**

1. **Cache eligibility:**
   - Eligible for cache: ✅ ON

2. **Cache TTL by status code:**
   ```
   200-299: 1 month (2592000 seconds)
   404: 5 minutes (300 seconds)
   500-599: Do not cache
   ```

3. **Browser Cache TTL:**
   - `1 day` (86400 seconds)

4. **Origin Cache Control:**
   - Toggle ON

5. **Cache Key:**
   - Custom cache key: OFF (dùng default)

6. Click **"Deploy"**

### 5.4. Verify Cache Rule

1. Sau khi deploy, rule sẽ hiện trong list
2. Ensure rule is **"Active"**
3. Priority: Có thể drag để adjust order

---

## Bước 6: Integrate với Next.js

### 6.1. Update Next.js Config

Edit file `apps/landing/next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/shared"],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.ecomatehome.com', // ← Custom domain của bạn
        port: '',
        pathname: '/**',
      },
      // Fallback to direct R2 URL
      {
        protocol: 'https',
        hostname: '139f0eb1478609f2bae677641e0b0709.r2.cloudflarestorage.com',
        port: '',
        pathname: '/ecomate-dev/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
```

### 6.2. Create Environment Variables

Create/update `.env.local`:

```bash
# R2 Configuration
NEXT_PUBLIC_R2_PUBLIC_URL=https://cdn.ecomatehome.com
NEXT_PUBLIC_R2_BUCKET_NAME=ecomate-dev

# Fallback URL
NEXT_PUBLIC_R2_DIRECT_URL=https://139f0eb1478609f2bae677641e0b0709.r2.cloudflarestorage.com/ecomate-dev
```

### 6.3. Create Image Helper Utility

Create file `apps/landing/src/lib/r2-image.ts`:

```typescript
/**
 * Get optimized R2 image URL
 * @param path - Image path relative to bucket (e.g., 'landing/banners/living-room.webp')
 * @param options - Optional query params for image optimization
 */
export function getR2ImageUrl(
  path: string,
  options?: {
    width?: number
    quality?: number
    format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg'
  }
): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_DIRECT_URL

  if (!baseUrl) {
    console.warn('R2 URL not configured, using relative path')
    return path
  }

  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  let url = `${baseUrl}/${cleanPath}`

  // Add query params if needed (for future image transformation)
  if (options) {
    const params = new URLSearchParams()
    if (options.width) params.set('width', options.width.toString())
    if (options.quality) params.set('quality', options.quality.toString())
    if (options.format) params.set('format', options.format)

    const query = params.toString()
    if (query) url += `?${query}`
  }

  return url
}

/**
 * Legacy local images mapping (for gradual migration)
 */
export const LOCAL_IMAGES = {
  logo: '/images/logo.png',
  favicon: '/images/favicon.ico',
} as const
```

### 6.4. Usage Example

Update `tour-card.tsx`:

```typescript
import Image from 'next/image'
import { getR2ImageUrl } from '@/lib/r2-image'

// Old way (local)
<Image src="/images/snapshot-banner/living-room.png" ... />

// New way (R2)
<Image
  src={getR2ImageUrl('landing/banners/living-room.webp')}
  alt="Living room"
  fill
  sizes="(max-width: 768px) 100vw, 40vw"
  quality={75}
  loading="lazy"
/>
```

---

## Testing & Verification

### ✅ Test 1: DNS Propagation

```bash
# Check DNS resolution
nslookup cdn.ecomatehome.com

# Should return Cloudflare IP addresses
```

### ✅ Test 2: SSL Certificate

1. Open browser → Visit `https://cdn.ecomatehome.com`
2. Check padlock icon → View certificate
3. Should show valid Cloudflare certificate

### ✅ Test 3: CORS Headers

```bash
curl -I https://cdn.ecomatehome.com/test-image.jpg

# Should see headers:
# access-control-allow-origin: *
# access-control-allow-methods: GET, HEAD
```

### ✅ Test 4: Cache Headers

```bash
curl -I https://cdn.ecomatehome.com/landing/banners/living-room.webp

# Should see:
# cf-cache-status: HIT (after 2nd request)
# cache-control: public, max-age=2592000
# age: <number of seconds cached>
```

### ✅ Test 5: Next.js Image Loading

1. Run dev server: `pnpm dev`
2. Open landing page
3. Open DevTools → Network tab
4. Filter by "Img"
5. Verify images load from `cdn.ecomatehome.com`
6. Check response headers for cache status

### ✅ Test 6: Performance

**Before optimization:**
```bash
# Lighthouse test
npx lighthouse https://your-landing-page.com --view
```

**After R2 + CDN:**
- First Contentful Paint: Should improve 20-30%
- Largest Contentful Paint: Should improve 30-40%
- Total Blocking Time: Should improve 15-25%

---

## Troubleshooting

### ❌ Problem: "DNS_PROBE_FINISHED_NXDOMAIN"

**Solutions:**
1. Check DNS record exists và đúng
2. Wait 5-10 minutes for DNS propagation
3. Clear DNS cache: `ipconfig /flushdns` (Windows) hoặc `sudo dscacheutil -flushcache` (Mac)

### ❌ Problem: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"

**Solutions:**
1. Ensure SSL/TLS mode = "Full (strict)"
2. Check custom domain SSL certificate provisioned (có thể mất 10-15 phút)
3. Visit R2 → Settings → Verify "Certificate Status" = Active

### ❌ Problem: CORS Error in Browser Console

**Solutions:**
1. Double-check CORS policy includes your origin
2. Ensure `AllowedMethods` includes "GET"
3. Check `AllowedHeaders` has "*" hoặc required headers
4. Wait 1-2 minutes after updating CORS policy

### ❌ Problem: Images not caching (cf-cache-status: MISS)

**Solutions:**
1. Verify Cache Rule is active và matches hostname
2. Check file extension is in the list
3. First request = MISS, second request should = HIT
4. Clear Cloudflare cache: Dashboard → Caching → Purge Everything
5. Check `Cache-Control` header từ origin

### ❌ Problem: Next.js "Invalid src prop" error

**Solutions:**
1. Ensure hostname in `remotePatterns` matches exactly
2. Check protocol = "https" (not http)
3. Verify pathname pattern matches actual image paths
4. Restart Next.js dev server after config changes

### ❌ Problem: Slow image loading despite CDN

**Solutions:**
1. Check image file sizes (should be < 500KB)
2. Verify WebP/AVIF format being served
3. Enable "Auto Minify" in Cloudflare: Speed → Optimization
4. Use Next.js Image component (not `<img>` tag)
5. Check network waterfall in DevTools for blocking resources

---

## Best Practices

### 🎯 Naming Convention

Organize R2 bucket với clear structure:

```
ecomate-dev/
├── landing/
│   ├── banners/
│   │   ├── living-room.webp
│   │   ├── kitchen-room.webp
│   │   └── ...
│   ├── backgrounds/
│   │   ├── hero-bg.webp
│   │   └── ...
│   └── og/
│       └── og-image.webp
├── admin/
│   └── products/
│       └── {product-id}/
│           ├── thumbnail.webp
│           └── gallery-1.webp
└── shared/
    └── assets/
        ├── logo.svg
        └── icons/
```

### 🎯 Image Optimization Checklist

Before uploading to R2:
- [ ] Convert PNG → WebP (reduce 70-80% size)
- [ ] Create AVIF versions for modern browsers
- [ ] Resize to max needed dimension (no larger than 1920px for web)
- [ ] Compress with quality 75-85
- [ ] Generate responsive variants (640, 1080, 1920)
- [ ] Use descriptive filenames (living-room.webp not img1.webp)

### 🎯 Security

- ✅ Enable HSTS
- ✅ Use "Full (strict)" SSL mode
- ✅ Restrict CORS to specific origins (production)
- ✅ Add CSP headers
- ✅ Regularly rotate R2 API keys
- ✅ Monitor access logs

---

## Next Steps

1. ✅ Setup custom domain (this guide)
2. ⏭️ Migrate existing images to R2
3. ⏭️ Create image upload script/API
4. ⏭️ Setup automatic image optimization pipeline
5. ⏭️ Implement responsive image serving
6. ⏭️ Add image analytics/monitoring

---

## Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [R2 Custom Domains](https://developers.cloudflare.com/r2/buckets/public-buckets/#custom-domains)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)

---

**Created:** 2025-11-03
**Updated:** 2025-11-03
**Version:** 1.0.0
