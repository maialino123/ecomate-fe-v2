'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { getCategoryById, getCategoryColorClasses } from '@/data/blog-posts'

interface BlogCardProps {
    post: BlogPost
    index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
    const category = getCategoryById(post.category)
    const colorClasses = getCategoryColorClasses(post.category)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                href={post.href}
                className="group block h-full p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-transparent hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
                {/* Category Badge */}
                {category && (
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className={`
                                px-4 py-2 rounded-full text-xs font-medium
                                border ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}
                            `}
                        >
                            <span className="mr-1">{category.icon}</span>
                            {category.name}
                        </div>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-h6 font-semibold text-slate-900 mb-4 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-900/70 text-body mb-4 line-clamp-3">{post.excerpt}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                        <span
                            key={tag}
                            className="text-xs px-4 py-2 rounded-md bg-white/5 text-slate-900/60 border border-white/15"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-slate-900/50 mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-emerald-600 font-medium text-body group-hover:gap-3 transition-all">
                    <span>Đọc thêm</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </motion.div>
    )
}
