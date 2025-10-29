'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import RadialGlowDecorator from '@/components/decorators/radial-glow'
import BackgroundOrnament from '@/components/decorators/background-ornament'

export default function HeroBanner() {
    const heroRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })

    // Transform values cho shrink effect
    // Circular reveal/collapse sẽ che hero banner
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.98, 0.95])
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 1])
    const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 9999])

    const scrollToTour = () => {
        document.getElementById('tour')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <motion.section
            id="hero"
            ref={heroRef}
            style={{ scale, opacity, borderRadius }}
            className={cn('relative h-screen', 'flex items-center justify-center', 'overflow-hidden')}
        >
            {/* Background pattern - Fade in slower */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                transition={{ duration: 1.5, delay: 0 }}
                className={cn('absolute inset-0')}
            >
                <div
                    className={cn('absolute inset-0')}
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(100, 116, 139) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </motion.div>

            {/* Background Ornaments - Outside max-width */}
            <BackgroundOrnament image="journey" side="left" opacity={0.08} verticalAlign="center" />
            <BackgroundOrnament image="usp" side="right" opacity={0.08} verticalAlign="center" />

            {/* Gradient Decorators - Reduced opacity for light theme */}
            <RadialGlowDecorator position="center" color="emerald" size={600} opacity={0.06} blur={140} />
            <RadialGlowDecorator position="top-left" color="emerald" size={400} opacity={0.06} blur={120} />
            <RadialGlowDecorator position="bottom-right" color="blue" size={400} opacity={0.06} blur={120} />

            {/* Content */}
            <div className={cn('relative z-10', 'max-w-5xl mx-auto px-6', 'text-center')}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className={cn(
                            'inline-block px-4 py-2 mb-6',
                            'text-caption md:text-body font-medium text-emerald-700',
                            'bg-emerald-50',
                            'border border-emerald-200 rounded-full',
                        )}
                    >
                        ✨ Giải pháp nhà thông minh giá chỉ từ 10k
                    </motion.span>

                    <h1 className={cn('text-[32px] md:text-display-md font-bold', 'text-slate-900 mb-6 leading-tight')}>
                        Tiện ích mỗi ngày,
                        <br />
                        <span
                            className={cn(
                                'text-transparent bg-clip-text',
                                'bg-gradient-to-r from-emerald-600 to-blue-600',
                            )}
                        >
                            trong từng căn phòng
                        </span>
                    </h1>

                    <p className={cn('text-body md:text-h5 text-slate-600', 'mb-12 max-w-3xl mx-auto')}>
                        Khám phá cách Ecomate biến không gian sống của bạn trở nên gọn gàng, thông minh và tiện lợi hơn
                        mỗi ngày.
                    </p>

                    <div className={cn('flex flex-col sm:flex-row', 'items-center justify-center gap-4 w-full')}>
                        <button
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
                        </button>

                        <a
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
                        </a>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}
