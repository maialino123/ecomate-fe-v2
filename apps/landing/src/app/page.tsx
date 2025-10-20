'use client'
import Header from '@/components/header'
import HeroBanner from '@/components/hero-banner'
import TourSection from '@/components/tour-section'
import OurProducts from '@/components/our-products'
import ConnectivityMap from '@/components/connectivity-map'
import Footer from '@/components/footer'
import MobileDock from '@/components/mobile-dock'
import { TransitionProvider, useTransition } from '@/contexts/transition-context'

function PageContent() {
    const { isTransitioning } = useTransition()

    return (
        <div className="relative">
            {/* Fixed Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 -z-10" />

            {/* Fixed Header */}
            <Header />

            {/* Mobile Floating Dock - Chỉ hiển thị trên mobile */}
            <MobileDock />

            {/* Hero Banner - Full screen */}
            <HeroBanner />

            {/* 3D Tour Section - Kích hoạt sau khi scroll qua hero */}
            <TourSection />

            {/* Our Products Section - Ẩn khi đang transition */}
            <div style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.3s' }}>
                <OurProducts />
                <ConnectivityMap />
                <Footer />
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <TransitionProvider>
            <PageContent />
        </TransitionProvider>
    )
}
