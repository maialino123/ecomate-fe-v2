/**
 * Tour Section Component
 *
 * Displays a scrollable stack of tour cards showcasing different rooms
 * Uses ScrollStack for smooth stacking animation and Lenis for smooth scrolling
 */

'use client'

import ScrollStack, { ScrollStackItem } from '@workspace/ui/components/ScrollStack'
import '@workspace/ui/components/ScrollStack.css'
import TourCard from '@/components/tour-card'
import { tourSections } from '@/data/tour-data'
import '@/styles/tour-section.css'

export default function TourSection() {
    return (
        <section className="relative py-10 md:py-16">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 mb-12 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Khám phá không gian sống Ecomate
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Giải pháp thông minh cho từng căn phòng trong ngôi nhà của bạn
                </p>
            </div>

            {/* ScrollStack with Tour Cards */}
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
                {tourSections.map(section => (
                    <ScrollStackItem key={section.id} itemClassName="tour-card-item">
                        <TourCard {...section} />
                    </ScrollStackItem>
                ))}
            </ScrollStack>

            {/* Bottom Spacer - 80px as requested */}
            <div className="h-40 block md:hidden" />
        </section>
    )
}
