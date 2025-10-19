import { Providers } from '@workspace/shared/providers'
import '@workspace/ui/globals.css'
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-open-sans',
})

export const metadata = {
    title: 'Ecomate – Room Tour',
    description: 'Scroll tour 3D căn hộ. Ecomate: Tiện ích mỗi ngày, giá chỉ từ 10k.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="vi" translate="no" suppressHydrationWarning>
            <body className={`${openSans.variable} font-sans antialiased bg-slate-950 text-white selection:bg-emerald-300/60`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
