'use client'

import { Providers } from '@workspace/shared/providers'
import '@workspace/ui/globals.css'
import { getApiClient } from '../lib/api-client'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" translate="no" suppressHydrationWarning>
            <body className={`font-sans antialiased`} suppressHydrationWarning>
                <Providers getApiClient={getApiClient}>{children}</Providers>
            </body>
        </html>
    )
}
