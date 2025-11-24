import { Providers } from '@workspace/shared/providers'
import '@workspace/ui/globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import SeoJsonLd from '@/components/SeoJsonLd'
import { TwentyFirstToolbar } from '@21st-extension/toolbar-next'
import { ReactPlugin } from '@21st-extension/react'
import SplashCursor from '@workspace/ui/components/SplashCursor'

const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    preload: true,
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecomate-fe-v2-landing.vercel.app'
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Ecomate'

export const viewport = {
    themeColor: '#10b981',
}

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Ecomate – Tiện ích mỗi ngày cho gia đình hiện đại',
        template: '%s | Ecomate',
    },
    description:
        'Khám phá Ecomate – người bạn đồng hành giúp cuộc sống gọn gàng, tiết kiệm và thông minh hơn. Mua sắm đồ tiêu dùng tiện ích chỉ từ 10k, freeship và đổi trả dễ dàng trên Shopee.',
    keywords: [
        'Ecomate',
        'đồ gia dụng',
        'đồ tiêu dùng thông minh',
        'sản phẩm tiện ích',
        'phụ kiện nhà bếp',
        'đồ dùng phòng tắm',
        'phụ kiện nhà cửa',
        'mua sắm Shopee',
        'freeship',
        'đồ tiện lợi giá rẻ',
    ],
    applicationName: SITE_NAME,
    authors: [{ name: 'Ecomate Team', url: SITE_URL }],
    creator: 'Ecomate',
    publisher: 'Ecomate',
    alternates: { canonical: SITE_URL },
    openGraph: {
        title: 'Ecomate – Tiện ích mỗi ngày cho gia đình hiện đại',
        description:
            'Giải pháp đồ tiêu dùng thông minh, tiết kiệm và thân thiện cho mọi căn hộ. Gọn gàng hơn, tiện nghi hơn – cùng Ecomate!',
        url: SITE_URL,
        siteName: SITE_NAME,
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: '/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'Ecomate - Tiện ích mỗi ngày cho gia đình hiện đại',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ecomate – Tiện ích mỗi ngày cho gia đình hiện đại',
        description: 'Khám phá Ecomate – người bạn đồng hành giúp cuộc sống gọn gàng, tiết kiệm và thông minh hơn.',
        images: ['/twitter-image.png'],
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            // Light mode favicons (default)
            { url: '/favicon-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
            { url: '/favicon-192.png', sizes: '192x192', type: 'image/png', media: '(prefers-color-scheme: light)' },
            // Dark mode favicons
            { url: '/favicon-32-dark.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
            {
                url: '/favicon-192-dark.png',
                sizes: '192x192',
                type: 'image/png',
                media: '(prefers-color-scheme: dark)',
            },
        ],
        apple: [
            // Apple touch icons for light and dark mode
            {
                url: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/apple-touch-icon-dark.png',
                sizes: '180x180',
                type: 'image/png',
                media: '(prefers-color-scheme: dark)',
            },
        ],
    },
    formatDetection: { telephone: false },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'shopping',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const orgJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: ['https://shopee.vn/ecomate'],
        description:
            'Ecomate – người bạn tiết kiệm của mọi nhà. Sản phẩm tiêu dùng tiện ích, giá chỉ từ 10k, freeship, đổi trả 7 ngày.',
    }

    const webSiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <html lang="vi" translate="no" suppressHydrationWarning>
            <body
                className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-[#dee1e1] to-[#f4f4f4] text-slate-900 selection:bg-emerald-200`}
                suppressHydrationWarning
            >
                {/* Splash Cursor Effect */}
                {/* JSON‑LD for Google Ads/SEO */}
                <SeoJsonLd data={orgJsonLd} />
                <SeoJsonLd data={webSiteJsonLd} />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
