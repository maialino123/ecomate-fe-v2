'use client'
import { motion } from 'framer-motion'
import { blogPosts } from '@/data/blog-posts'
import BlogCard from './blog-card'

interface BlogGridProps {
    selectedCategory: string
}

export default function BlogGrid({ selectedCategory }: BlogGridProps) {
    // Filter posts by category
    const filteredPosts =
        selectedCategory === 'all' ? blogPosts : blogPosts.filter(post => post.category === selectedCategory)

    if (filteredPosts.length === 0) {
        return (
            <section className="relative w-full py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <p className="text-white/50 text-h6">Không có bài viết nào trong danh mục này</p>
                    </motion.div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative w-full py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-h5 md:text-h4 font-bold text-white mb-2">Tất cả bài viết</h2>
                    <p className="text-white/60 text-body">
                        {filteredPosts.length} bài viết
                        {selectedCategory !== 'all' && ' trong danh mục này'}
                    </p>
                </motion.div>

                {/* Posts Grid */}
                <motion.div
                    key={selectedCategory} // Re-animate when category changes
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {filteredPosts.map((post, index) => (
                        <BlogCard key={post.id} post={post} index={index} />
                    ))}
                </motion.div>

                {/* Empty State Hint */}
                {filteredPosts.length < 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12 text-center p-8 rounded-2xl bg-white/5 border border-white/15"
                    >
                        <p className="text-white/60 mb-2">📝 Chúng tôi đang cập nhật thêm nhiều bài viết hữu ích...</p>
                        <p className="text-white/40 text-body">Hãy quay lại sau để khám phá thêm nội dung mới!</p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
