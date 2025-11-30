/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui', '@workspace/shared'],
    // Enable standalone output for Docker deployment
    output: 'standalone',
    // Configure remote image domains for 1688 product images
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cbu01.alicdn.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.alicdn.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.1688.com',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig
