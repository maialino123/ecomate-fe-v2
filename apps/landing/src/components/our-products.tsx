'use client'
import { motion } from 'framer-motion'
import { GlowingEffect } from '@workspace/ui/components/ui/glowing-effect'
import { Home, Utensils, Bath, Bed, Package, Sparkles, ShoppingCart } from 'lucide-react'
import BackgroundOrnament from '@/components/decorators/background-ornament'

export default function OurProducts() {
    return (
        <section className="relative min-h-screen py-20 px-6" style={{ marginTop: '30vh' }}>
            {/* Background Ornaments - Outside max-width */}
            <BackgroundOrnament image="journey" side="left" opacity={0.06} verticalAlign="top" />
            <BackgroundOrnament image="usp" side="right" opacity={0.06} verticalAlign="bottom" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-h3 md:text-display-sm font-bold text-slate-900 mb-4">Sản phẩm của chúng tôi</h2>
                    <p className="text-h6 text-slate-600 max-w-2xl mx-auto">
                        Khám phá bộ sưu tập sản phẩm thông minh giúp không gian sống của bạn trở nên gọn gàng và tiện
                        lợi hơn
                    </p>
                </motion.div>

                {/* Product Grid with Glowing Effect */}
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-4 max-w-7xl mx-auto">
                    {items.map((item, i) => (
                        <GridItem
                            key={i}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
                        />
                    ))}
                </ul>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <a
                        href="https://shopee.vn/ecomate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all hover:scale-105"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Xem tất cả sản phẩm trên Shopee
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

interface GridItemProps {
    icon: React.ReactNode
    title: string
    description: string
    className?: string
}

const GridItem = ({ icon, title, description, className }: GridItemProps) => {
    return (
        <li className={`min-h-[14rem] list-none ${className || ''}`}>
            <div className="relative h-full rounded-2xl border border-slate-200 p-2 md:rounded-3xl md:p-4 shadow-sm hover:shadow-md transition-shadow">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-50 p-6 md:p-6 border border-slate-300">
                    <div className="relative flex flex-1 flex-col justify-between gap-4">
                        <div className="w-fit rounded-lg border border-emerald-200 bg-emerald-50 p-2">{icon}</div>
                        <div className="space-y-4">
                            <h3 className="font-sans text-h6 font-semibold leading-6 text-slate-900 md:text-h5 md:leading-8">
                                {title}
                            </h3>
                            <p className="font-sans text-body leading-5 text-slate-600 md:text-base md:leading-6">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}

const items = [
    {
        title: 'Giải pháp phòng khách',
        description: 'Móc treo, kệ đa năng, hộp đựng remote - mọi thứ đều gọn gàng',
        icon: <Home className="h-4 w-4 text-emerald-600" />,
    },
    {
        title: 'Nhà bếp thông minh',
        description: 'Móc dán chịu lực, kệ úp chén, bàn chải rửa cốc',
        icon: <Utensils className="h-4 w-4 text-emerald-600" />,
    },
    {
        title: 'Phòng tắm tiện lợi',
        description: 'Kệ góc, móc treo khăn, hộp đựng đồ vệ sinh',
        icon: <Bath className="h-4 w-4 text-emerald-600" />,
    },
    {
        title: 'Phòng ngủ ngăn nắp',
        description:
            'Hộp đựng đồ dùng cá nhân, móc treo quần áo, kệ sách mini - giúp phòng ngủ luôn gọn gàng và thoải mái',
        icon: <Bed className="h-4 w-4 text-emerald-600" />,
    },
    {
        title: 'Combo tiết kiệm',
        description: 'Bộ sản phẩm cho từng không gian với giá ưu đãi',
        icon: <Package className="h-4 w-4 text-emerald-600" />,
    },
    {
        title: 'Sản phẩm mới',
        description: 'Cập nhật liên tục các giải pháp thông minh mới nhất',
        icon: <Sparkles className="h-4 w-4 text-emerald-600" />,
    },
    {
        title: 'Bestseller - Sản phẩm bán chạy',
        description: 'Top sản phẩm được yêu thích nhất từ hàng nghìn khách hàng tin dùng',
        icon: <Package className="h-4 w-4 text-emerald-600" />,
    },
]
