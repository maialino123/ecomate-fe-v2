"use client";
import { motion } from "framer-motion";
import { GlowingEffect } from "@workspace/ui/components/ui/glowing-effect";
import {
  Home,
  Utensils,
  Bath,
  Bed,
  Package,
  Sparkles,
  ShoppingCart
} from "lucide-react";

export default function OurProducts() {
  return (
    <section className="relative min-h-screen py-20 px-6" style={{ marginTop: '30vh', }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Sản phẩm của chúng tôi
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm thông minh giúp không gian sống của bạn
            trở nên gọn gàng và tiện lợi hơn
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
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
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
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const GridItem = ({ icon, title, description, className }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${className || ""}`}>
      <div className="relative h-full rounded-2xl border border-white/10 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-6 md:p-6 backdrop-blur-sm">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-emerald-600/50 bg-emerald-950/30 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl/[1.375rem] font-semibold text-white md:text-2xl/[1.875rem]">
                {title}
              </h3>
              <p className="font-sans text-sm/[1.125rem] text-white/70 md:text-base/[1.375rem]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const items = [
  {
    title: "Giải pháp phòng khách",
    description: "Móc treo, kệ đa năng, hộp đựng remote - mọi thứ đều gọn gàng",
    icon: <Home className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Nhà bếp thông minh",
    description: "Móc dán chịu lực, kệ úp chén, bàn chải rửa cốc",
    icon: <Utensils className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Phòng tắm tiện lợi",
    description: "Kệ góc, móc treo khăn, hộp đựng đồ vệ sinh",
    icon: <Bath className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Phòng ngủ ngăn nắp",
    description: "Hộp đựng đồ dùng cá nhân, móc treo quần áo, kệ sách mini - giúp phòng ngủ luôn gọn gàng và thoải mái",
    icon: <Bed className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Combo tiết kiệm",
    description: "Bộ sản phẩm cho từng không gian với giá ưu đãi",
    icon: <Package className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Sản phẩm mới",
    description: "Cập nhật liên tục các giải pháp thông minh mới nhất",
    icon: <Sparkles className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Bestseller - Sản phẩm bán chạy",
    description: "Top sản phẩm được yêu thích nhất từ hàng nghìn khách hàng tin dùng",
    icon: <Package className="h-4 w-4 text-emerald-400" />,
  },
];
