'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, Lightbulb } from 'lucide-react'
import BackgroundOrnament from '@/components/decorators/background-ornament'

const guides = [
    {
        icon: MapPin,
        title: 'Đồ gia dụng giao nhanh Hà Nội',
        description:
            'Khám phá đồ gia dụng chất lượng với dịch vụ giao hàng siêu tốc 24-48h. Freeship 300k, đổi trả dễ dàng trong 14 ngày.',
        href: '/do-gia-dung-ha-noi-freeship-300k',
        tags: ['Freeship 300k', 'Giao nhanh', 'Hà Nội'],
        gradient: 'from-emerald-100 to-teal-100',
        accentColor: 'emerald',
    },
    {
        icon: Lightbulb,
        title: 'Mẹo sắp xếp tủ bếp nhanh',
        description:
            'Biến căn bếp nhỏ thành không gian nấu nướng hiệu quả với những mẹo sắp xếp thông minh. Gọn gàng, tiết kiệm thời gian.',
        href: '/meo-sap-xep-tu-bep-nhanh',
        tags: ['Tips & Tricks', 'Tổ chức', 'Tiết kiệm'],
        gradient: 'from-orange-100 to-amber-100',
        accentColor: 'orange',
    },
]

export default function FeaturedGuides() {
    return (
        <section className="relative w-full py-20">
            {/* Background Ornaments */}
            <BackgroundOrnament image="usp" side="left" opacity={0.06} verticalAlign="center" />
            <BackgroundOrnament image="journey" side="right" opacity={0.06} verticalAlign="center" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-h4 md:text-h3 font-bold text-slate-900 mb-4">Hướng dẫn & Tips hữu ích</h2>
                    <p className="text-slate-600 text-h6 max-w-2xl mx-auto">
                        Khám phá các bài viết hướng dẫn và mẹo hay để tối ưu không gian sống của bạn
                    </p>
                </motion.div>

                {/* Guide Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {guides.map((guide, index) => {
                        const Icon = guide.icon
                        return (
                            <motion.div
                                key={guide.href}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link
                                    href={guide.href}
                                    className="group block h-full p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-transparent hover:border-slate-300 transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md"
                                >
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div
                                            className={`p-4 rounded-xl bg-gradient-to-br ${guide.gradient} border border-${guide.accentColor}-200`}
                                        >
                                            <Icon className={`h-6 w-6 text-${guide.accentColor}-600`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-h6 font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                                {guide.title}
                                            </h3>
                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {guide.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="text-caption px-4 py-2 rounded-full bg-slate-100 text-slate-700"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-600 mb-4 line-clamp-2">{guide.description}</p>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-emerald-600 font-medium group-hover:gap-3 transition-all">
                                        <span>Đọc ngay</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-emerald-500 transition-all text-slate-900 font-medium group"
                    >
                        <span>Xem tất cả bài viết</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
