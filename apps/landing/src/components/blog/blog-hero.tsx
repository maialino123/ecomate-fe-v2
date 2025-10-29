'use client'
import { motion } from 'framer-motion'

export default function BlogHero() {
    return (
        <section className="relative w-full pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">Blog & Hướng dẫn</h1>
                    <p className="text-h6 md:text-h6 text-slate-900/70 max-w-3xl mx-auto">
                        Khám phá tips, tricks và hướng dẫn hữu ích về đồ gia dụng, sắp xếp không gian sống thông minh và
                        nhiều chủ đề thú vị khác
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
