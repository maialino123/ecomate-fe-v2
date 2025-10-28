'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/../public/images/logo.png'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [showHeader, setShowHeader] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)

            const tourSection = document.querySelector('#tour')
            if (tourSection) {
                const rect = tourSection.getBoundingClientRect()
                const hasPassedTour = rect.bottom < 0
                setShowHeader(!hasPassedTour)
            } else {
                setShowHeader(true)
            }
        }

        handleScroll() // Check initial state
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: showHeader ? 0 : -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image src={logo} alt="Ecomate Logo" className="h-10 w-auto" priority />
                </Link>

                {/* Desktop Navigation */}
                <nav className="flex items-center space-x-8">
                    <a href="#hero" className="text-white/80 hover:text-white transition-colors">
                        Trang chủ
                    </a>
                    <a href="#tour" className="text-white/80 hover:text-white transition-colors">
                        Khám phá
                    </a>
                    <a href="#products" className="text-white/80 hover:text-white transition-colors">
                        Sản phẩm
                    </a>
                    <a
                        href="https://shopee.vn/ecomate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Mua ngay
                    </a>
                </nav>
            </div>
        </motion.header>
    )
}
