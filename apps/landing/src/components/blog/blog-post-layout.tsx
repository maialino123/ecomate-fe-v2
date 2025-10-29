'use client'
import PageTransition from '@/components/page-transition'
import Header from '@/components/header'
import Footer from '@/components/footer'
import MobileDock from '@/components/mobile-dock'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BlogPostLayoutProps {
    children: React.ReactNode
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
    return (
        <PageTransition>
            <div className="min-h-screen">
                {/* Header */}
                <Header />

                {/* Mobile Dock */}
                <MobileDock />

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-6 py-40 text-white">{children}</main>

                {/* Footer */}
                <Footer />
            </div>
        </PageTransition>
    )
}
