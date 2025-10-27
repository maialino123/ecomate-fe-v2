import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecomate-fe-v2-landing.vercel.app'

export const metadata: Metadata = {
    title: 'Blog & Hướng dẫn | Ecomate',
    description:
        'Khám phá tips, tricks và hướng dẫn hữu ích về đồ gia dụng, sắp xếp không gian sống thông minh, và nhiều chủ đề thú vị khác từ Ecomate.',
    keywords: [
        'blog ecomate',
        'hướng dẫn đồ gia dụng',
        'tips sắp xếp nhà cửa',
        'tổ chức không gian',
        'mẹo vặt gia đình',
        'blog lifestyle',
    ],
    openGraph: {
        title: 'Blog & Hướng dẫn | Ecomate',
        description:
            'Khám phá tips, tricks và hướng dẫn hữu ích về đồ gia dụng và sắp xếp không gian sống thông minh',
        url: `${SITE_URL}/blog`,
        siteName: 'Ecomate',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: '/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'Ecomate Blog & Hướng dẫn',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog & Hướng dẫn | Ecomate',
        description:
            'Khám phá tips, tricks và hướng dẫn hữu ích về đồ gia dụng và sắp xếp không gian sống',
        images: ['/twitter-image.png'],
    },
    alternates: {
        canonical: `${SITE_URL}/blog`,
    },
}
