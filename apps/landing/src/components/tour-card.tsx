import Image from 'next/image'
import { TourSection } from '@/data/tour-data'
import { cn } from '@workspace/ui/lib/utils'

interface TourCardProps extends TourSection {}

export default function TourCard({ title, description, image, imagePosition, cta }: TourCardProps) {
    const isImageRight = imagePosition === 'right'

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
                className={cn(
                    'bg-white rounded-3xl overflow-hidden',
                    'border border-gray-200',
                    'transition-all duration-300',
                    'min-h-[400px] md:min-h-[500px]',
                )}
            >
                <div className={cn('grid grid-cols-1 md:grid-cols-12 gap-0', 'h-full items-center')}>
                    {/* Text Content - 60% on desktop */}
                    <div
                        className={cn(
                            'md:col-span-7 p-8 sm:p-10 lg:p-12 xl:p-16',
                            'flex flex-col justify-center',
                            'order-2 md:order-1',
                            isImageRight ? 'md:order-1' : 'md:order-2',
                        )}
                    >
                        <div className="space-y-6">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                {title}
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">{description}</p>
                            {cta && (
                                <div className="pt-4">
                                    <a
                                        href={cta.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            'inline-flex items-center justify-center',
                                            'px-8 py-4 text-base font-semibold',
                                            'text-white bg-gradient-to-r from-green-500 to-emerald-600',
                                            'rounded-full shadow-lg',
                                            'hover:from-green-600 hover:to-emerald-700',
                                            'transform hover:scale-105',
                                            'transition-all duration-200',
                                            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                                        )}
                                    >
                                        {cta.text}
                                        <svg
                                            className="ml-2 w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image - 40% on desktop */}
                    <div
                        className={cn(
                            'md:col-span-5 relative',
                            'h-64 sm:h-80 md:h-full min-h-[400px] md:min-h-[500px]',
                            'order-1 md:order-2',
                            isImageRight ? 'md:order-2' : 'md:order-1',
                        )}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                                quality={90}
                                priority
                            />
                            {/* Gradient overlay for better text readability on mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent md:hidden" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
