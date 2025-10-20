import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecomate-fe-v2-landing.vercel.app'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        // Add more pages as needed:
        // {
        //     url: `${baseUrl}/products`,
        //     lastModified: new Date(),
        //     changeFrequency: 'daily',
        //     priority: 0.8,
        // },
    ]
}
