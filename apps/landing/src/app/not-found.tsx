'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HoverBorderButton } from '@workspace/ui/components/ui/hover-border-button'
import RadialGlowDecorator from '@/components/decorators/radial-glow'
import { Home, Package } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#dee1e1] to-[#f4f4f4] dark:from-slate-950 dark:to-slate-900">
            {/* Background Decorators */}
            <RadialGlowDecorator
                className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
                color="emerald"
                size={600}
                opacity={0.15}
                position="top-left"
            />
            <RadialGlowDecorator
                className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2"
                color="emerald"
                size={600}
                opacity={0.15}
                position="bottom-right"
            />

            {/* Floating Leaves Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: -20,
                            rotate: Math.random() * 360,
                            opacity: 0,
                        }}
                        animate={{
                            y: '110vh',
                            rotate: Math.random() * 360 + 360,
                            opacity: [0, 0.6, 0.6, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 8,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: 'linear',
                        }}
                    >
                        <Leaf size={Math.random() * 20 + 15} />
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-4xl mx-auto px-6 text-center"
            >
                {/* Animated Mascot Character */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="mb-8 flex justify-center"
                >
                    <PlantMascot />
                </motion.div>

                {/* 404 Number with Tree Style */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative mb-8"
                >
                    <h1 className="text-[120px] md:text-[180px] font-bold leading-none">
                        <span className="inline-block bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                            4
                        </span>
                        <span className="inline-block relative mx-2">
                            <TreeZero />
                        </span>
                        <span className="inline-block bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                            4
                        </span>
                    </h1>
                </motion.div>

                {/* Bilingual Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                        Oops! Trang này đã lạc vào rừng rậm
                    </h2>
                    <p className="text-xl md:text-2xl text-emerald-600 dark:text-emerald-400 font-medium">
                        This page got lost in the forest
                    </p>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed"
                >
                    Trang bạn đang tìm kiếm có thể đã bị di chuyển, xóa hoặc chưa từng tồn tại. Đừng lo lắng, hãy quay
                    về trang chủ để khám phá thêm những điều thú vị với EcoMate!
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                >
                    <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.7}>
                        <HoverBorderButton.Link
                            href="/"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-semibold text-base flex items-center gap-2 transition-all duration-300"
                        >
                            <Home className="w-5 h-5" />
                            Về trang chủ
                        </HoverBorderButton.Link>
                    </HoverBorderButton>

                    <Link href="/#products">
                        <button className="px-8 py-3 rounded-xl font-semibold text-base border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300 flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Khám phá sản phẩm
                        </button>
                    </Link>
                </motion.div>

                {/* Additional Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex flex-wrap gap-6 justify-center text-sm text-slate-600 dark:text-slate-400"
                >
                    <Link
                        href="/blog"
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                    >
                        Blog
                    </Link>
                    <Link
                        href="/#contact"
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                    >
                        Liên hệ
                    </Link>
                    <Link
                        href="/terms"
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                    >
                        Điều khoản
                    </Link>
                </motion.div>
            </motion.div>

            {/* Bottom Forest Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
                    <motion.path
                        d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
                        fill="currentColor"
                        className="text-emerald-500/10 dark:text-emerald-500/5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />
                </svg>
            </div>
        </div>
    )
}

// Leaf Component
function Leaf({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 3C7 3 3 8 3 14C3 17 4 19 6 20C7 17 9 15 12 15C15 15 17 17 18 20C20 19 21 17 21 14C21 8 17 3 12 3Z"
                fill="currentColor"
                className="text-emerald-500/60"
            />
            <path
                d="M12 15L12 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="text-emerald-600/60"
            />
        </svg>
    )
}

// Tree Zero Component (0 shaped like a tree)
function TreeZero() {
    return (
        <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block"
        >
            {/* Tree trunk as the center of 0 */}
            <motion.rect
                x="82"
                y="100"
                width="16"
                height="50"
                rx="4"
                fill="url(#trunkGradient)"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            />

            {/* Main circle of 0 with tree foliage effect */}
            <motion.circle
                cx="90"
                cy="90"
                r="70"
                stroke="url(#leafGradient)"
                strokeWidth="20"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Inner foliage circles */}
            <motion.circle
                cx="70"
                cy="70"
                r="15"
                fill="url(#leafGradient)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
            />
            <motion.circle
                cx="110"
                cy="75"
                r="12"
                fill="url(#leafGradient)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            />
            <motion.circle
                cx="90"
                cy="100"
                r="10"
                fill="url(#leafGradient)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
            />

            {/* Gradients */}
            <defs>
                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#92400e" />
                    <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
            </defs>
        </svg>
    )
}

// Plant Mascot Component
function PlantMascot() {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Pot */}
            <motion.path
                d="M40 90 L45 110 L75 110 L80 90 Z"
                fill="url(#potGradient)"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            />

            {/* Main body (round plant) */}
            <motion.circle
                cx="60"
                cy="70"
                r="25"
                fill="url(#bodyGradient)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
            />

            {/* Leaves */}
            <motion.ellipse
                cx="40"
                cy="60"
                rx="15"
                ry="20"
                fill="url(#leafGradient)"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: -30 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                transform="rotate(-30 40 60)"
            />
            <motion.ellipse
                cx="80"
                cy="60"
                rx="15"
                ry="20"
                fill="url(#leafGradient)"
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 30 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                transform="rotate(30 80 60)"
            />
            <motion.ellipse
                cx="60"
                cy="45"
                rx="12"
                ry="18"
                fill="url(#leafGradient)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            />

            {/* Eyes */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.6 }}>
                <circle cx="52" cy="68" r="3" fill="#1f2937" />
                <circle cx="68" cy="68" r="3" fill="#1f2937" />
                <motion.circle
                    cx="53"
                    cy="67"
                    r="1"
                    fill="#ffffff"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                <motion.circle
                    cx="69"
                    cy="67"
                    r="1"
                    fill="#ffffff"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
            </motion.g>

            {/* Smile */}
            <motion.path
                d="M 52 75 Q 60 80 68 75"
                stroke="#1f2937"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            />

            {/* Rosy cheeks */}
            <motion.circle
                cx="45"
                cy="73"
                r="4"
                fill="#f87171"
                opacity="0.4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
            />
            <motion.circle
                cx="75"
                cy="73"
                r="4"
                fill="#f87171"
                opacity="0.4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
            />

            {/* Gradients */}
            <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
            </defs>
        </svg>
    )
}
