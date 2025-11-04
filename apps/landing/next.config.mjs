/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui', '@workspace/shared'],

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.ecomatehome.com',
                port: '',
                pathname: '/landing/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [320, 640, 768, 1024, 1280, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 86400, // 24 hours
    },
}

export default nextConfig
