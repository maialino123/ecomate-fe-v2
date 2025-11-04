'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { HoverBorderButton } from '@workspace/ui/components/ui/hover-border-button'
import RadialGlowDecorator from '@/components/decorators/radial-glow'
import BackgroundOrnament from '@/components/decorators/background-ornament'

export default function HeroBanner() {
    const heroRef = useRef<HTMLElement>(null)
    const [showDecorators, setShowDecorators] = useState(false)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })

    // Transform values cho shrink effect
    // Circular reveal/collapse sẽ che hero banner
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.98, 0.95])
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 1])
    const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 9999])

    // Defer decorators until after initial paint
    useEffect(() => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => setShowDecorators(true), { timeout: 500 })
        } else {
            setTimeout(() => setShowDecorators(true), 100)
        }
    }, [])

    const scrollToTour = () => {
        document.getElementById('tour')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <motion.section
            id="hero"
            ref={heroRef}
            style={{ scale, opacity, borderRadius }}
            className={cn('relative h-screen', 'flex items-center justify-center overflow-hidden', 'bg-white')}
        >
            {/* Gradient Decorators - Deferred for performance */}
            {showDecorators && (
                <>
                    <RadialGlowDecorator
                        position="center"
                        color="emerald"
                        size={600}
                        opacity={0.06}
                        blur={140}
                        className="z-[2]"
                    />
                    <RadialGlowDecorator
                        position="top-left"
                        color="emerald"
                        size={400}
                        opacity={0.06}
                        blur={120}
                        className="z-[2]"
                    />
                    <RadialGlowDecorator
                        position="bottom-right"
                        color="blue"
                        size={400}
                        opacity={0.06}
                        blur={120}
                        className="z-[2]"
                    />
                </>
            )}

            {/* Content */}
            <div className={cn('relative z-10', 'max-w-5xl mx-auto px-6', 'text-center')}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0 }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className={cn(
                            'inline-block px-4 py-2 mb-6',
                            'text-caption md:text-body font-medium text-emerald-700',
                            'bg-emerald-50',
                            'border border-emerald-200 rounded-full',
                        )}
                    >
                        ✨ Giải pháp nhà thông minh giá chỉ từ 10k
                    </motion.span>

                    <h1
                        className={cn(
                            'text-[32px] md:text-display-md font-bold',
                            'text-slate-900 mb-6 leading-tight',
                            'contain-layout contain-style',
                        )}
                    >
                        Tiện ích mỗi ngày,
                        <br />
                        <span className="text-emerald-600">trong từng căn phòng</span>
                    </h1>

                    <p className={cn('text-body md:text-h5 text-slate-600', 'mb-12 max-w-3xl mx-auto')}>
                        Khám phá cách Ecomate biến không gian sống của bạn trở nên gọn gàng, thông minh và tiện lợi hơn
                        mỗi ngày.
                    </p>

                    <div className={cn('flex flex-col sm:flex-row', 'items-center justify-center gap-4 w-full')}>
                        <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.7}>
                            <HoverBorderButton.Button
                                onClick={scrollToTour}
                                className={cn(
                                    'group px-8 py-4',
                                    'bg-emerald-600 text-white rounded-xl',
                                    'font-semibold',
                                    'hover:bg-emerald-700 hover:scale-105',
                                    'transition-all max-w-[210px] w-full',
                                )}
                            >
                                Khám phá ngay
                                <svg
                                    className={cn(
                                        'inline-block ml-2 w-5 h-5',
                                        'group-hover:translate-x-1 transition-transform',
                                    )}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </HoverBorderButton.Button>
                        </HoverBorderButton>

                        <HoverBorderButton borderColor="rgba(15, 23, 42, 0.6)" glowIntensity={0.5}>
                            <HoverBorderButton.Link
                                href="https://shopee.vn/ecomate"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    'px-8 py-4',
                                    'bg-slate-900/8 text-slate-900 rounded-xl',
                                    'font-semibold',
                                    'border border-slate-900/20',
                                    'hover:bg-slate-900/15 transition-all max-w-[210px] w-full',
                                )}
                            >
                                Xem sản phẩm
                            </HoverBorderButton.Link>
                        </HoverBorderButton>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}
