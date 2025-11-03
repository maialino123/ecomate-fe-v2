/**
 * Mobile Tour Cards Component
 *
 * Simple vertical stack of tour cards for mobile devices
 * No animations, optimized for performance and smooth native scrolling
 */

'use client'

import TourCard from '@/components/tour-card'
import { TourSection } from '@/data/tour-data'

interface MobileTourCardsProps {
    sections: TourSection[]
}

export default function MobileTourCards({ sections }: MobileTourCardsProps) {
    return (
        <div className="flex flex-col gap-5">
            {sections.map((section, index) => (
                <div key={section.id} className="w-full">
                    <TourCard {...section} isFirstCard={index === 0} />
                </div>
            ))}
        </div>
    )
}
