import { Providers } from '@workspace/shared/providers'
import '@workspace/ui/globals.css'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" translate="no" suppressHydrationWarning>
            <body className={`font-sans antialiased`} suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
