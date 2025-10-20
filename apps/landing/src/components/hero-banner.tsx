"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroBanner() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Transform values cho shrink effect
  // KHÔNG fade out opacity để tránh nhấp nháy khi scroll
  // Circular reveal/collapse sẽ che hero banner
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.98, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 1]); // Giữ opacity 1
  const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 9999]);

  const scrollToTour = () => {
    document.getElementById("tour")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      id="hero"
      ref={heroRef}
      style={{ scale, opacity, borderRadius }}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"
    >
      {/* Background pattern - Fade in slower */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 0 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </motion.div>

      {/* Gradient orbs - Fade in and pulse with longer duration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.5 }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-block px-4 py-2 mb-6 text-sm font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
          >
            ✨ Giải pháp nhà thông minh giá chỉ từ 10k
          </motion.span>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Tiện ích mỗi ngày,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              trong từng căn phòng
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto">
            Khám phá cách Ecomate biến không gian sống của bạn trở nên gọn gàng,
            thông minh và tiện lợi hơn mỗi ngày.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToTour}
              className="group px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all hover:scale-105"
            >
              Khám phá ngay
              <svg
                className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            <a
              href="https://shopee.vn/ecomate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              Xem sản phẩm
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
