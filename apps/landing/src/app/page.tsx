'use client'
import Header from '@/components/header'
import HeroBanner from '@/components/hero-banner'
import TourSection from '@/components/tour-section'
import OurProducts from '@/components/our-products'
import FeaturedGuides from '@/components/featured-guides'
import ConnectivityMap from '@/components/connectivity-map'
import Footer from '@/components/footer'
import MobileDock from '@/components/mobile-dock'
import { TransitionProvider, useTransition } from '@/contexts/transition-context'

function PageContent() {
    const { isTransitioning } = useTransition()

    return (
        <div className="relative">
            {/* Fixed Header */}
            <Header />

            {/* Mobile Floating Dock */}
            <MobileDock />

            {/* Hero Banner - Full screen */}
            <HeroBanner />

            {/* Tour Section with ScrollStack */}
            <TourSection />

            {/* Our Products Section */}
            <div style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.3s' }}>
                <OurProducts />
                <FeaturedGuides />
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
