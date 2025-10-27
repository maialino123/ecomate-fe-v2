'use client'
import { motion } from 'framer-motion'
import { blogPosts } from '@/data/blog-posts'
import BlogCard from './blog-card'

export default function FeaturedPosts() {
    const featuredPosts = blogPosts.filter((post) => post.featured)

    if (featuredPosts.length === 0) {
        return null
    }

    return (
        <section className="relative w-full py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        ⭐ Bài viết nổi bật
                    </h2>
                    <p className="text-white/60 text-sm">
                        Những bài viết được quan tâm và đọc nhiều nhất
                    </p>
                </motion.div>

                {/* Featured Posts Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {featuredPosts.map((post, index) => (
                        <BlogCard key={post.id} post={post} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
