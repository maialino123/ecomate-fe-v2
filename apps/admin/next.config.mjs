/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui', '@workspace/shared'],
    // Enable standalone output for Docker deployment
    output: 'standalone',
}

export default nextConfig
