/**
 * Tour Section Component
 *
 * Displays tour cards showcasing different rooms
 * - Mobile (<768px): Simple vertical cards for optimal performance
 * - Desktop (≥768px): ScrollStack with smooth stacking animations
 */

'use client'

import ScrollStack, { ScrollStackItem } from '@workspace/ui/components/ScrollStack'
import '@workspace/ui/components/ScrollStack.css'
import TourCard from '@/components/tour-card'
import MobileTourCards from '@/components/mobile-tour-cards'
import { tourSections } from '@/data/tour-data'
import { useIsMobile } from '@/hooks/useIsMobile'
import '@/styles/tour-section.css'

export default function TourSection() {
    const isMobile = useIsMobile(768)

    return (
        <section id="tour" className="relative py-10 md:py-16">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 mb-12 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Khám phá không gian sống Ecomate
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Giải pháp thông minh cho từng căn phòng trong ngôi nhà của bạn
                </p>
            </div>

            {/* Conditional Rendering: Mobile vs Desktop */}
            {isMobile ? (
                // Mobile: Simple vertical cards (no animations)
                <MobileTourCards sections={tourSections} />
            ) : (
                // Desktop: ScrollStack with animations
                <ScrollStack
                    className="tour-scroll-stack"
                    useWindowScroll={true}
                    itemDistance={120}
                    itemScale={0.03}
                    itemStackDistance={30}
                    stackPosition="15%"
                    scaleEndPosition="8%"
                    baseScale={0.9}
                    rotationAmount={0}
                    blurAmount={0}
                    onStackComplete={() => {}}
                >
                    {tourSections.map((section, index) => (
                        <ScrollStackItem key={section.id} itemClassName="tour-card-item">
                            <TourCard {...section} isFirstCard={index === 0} />
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            )}

            {/* Bottom Spacer - only for mobile */}
            <div className="h-20 xl:h-32" />
        </section>
    )
}
