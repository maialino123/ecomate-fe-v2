'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import PageTransition from '@/components/page-transition'
import Header from '@/components/header'
import Footer from '@/components/footer'
import MobileDock from '@/components/mobile-dock'
import BlogHero from '@/components/blog/blog-hero'
import CategoryFilter from '@/components/blog/category-filter'
import FeaturedPosts from '@/components/blog/featured-posts'
import BlogGrid from '@/components/blog/blog-grid'

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')

    return (
        <PageTransition>
            <div className="relative min-h-screen">
                {/* Fixed Header */}
                <Header />

                {/* Mobile Floating Dock */}
                <MobileDock />

                {/* Main Content */}
                <main className="relative">
                    {/* Hero Section */}
                    <BlogHero />

                    {/* Category Filter */}
                    <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

                    {/* Featured Posts (only show when "all" is selected) */}
                    {selectedCategory === 'all' && <FeaturedPosts />}

                    {/* All Posts Grid */}
                    <BlogGrid selectedCategory={selectedCategory} />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </PageTransition>
    )
}
