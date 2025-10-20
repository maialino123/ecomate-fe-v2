"use client";
import SeoJsonLd from "@/components/seo-json-ld";
import PageTransition from "@/components/page-transition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReturnPolicyPage() {
  const updatedAt = "2025-10-20";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Chính sách đổi trả",
    dateModified: updatedAt,
    description: "Chính sách đổi trả của Ecomate: điều kiện, thời hạn 7 ngày, quy trình hỗ trợ.",
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
        <SeoJsonLd data={jsonLd} />

        {/* Back button */}
        <div className="max-w-3xl mx-auto px-6 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </div>

        <main className="mx-auto max-w-3xl px-6 py-16 text-white">
          <h1 className="mb-6 text-3xl md:text-4xl font-bold">Chính sách đổi trả</h1>
          <p className="mb-8 text-sm text-white/60">Cập nhật lần cuối: {updatedAt}</p>

          <section className="prose prose-invert prose-emerald max-w-none space-y-6">
            <p className="text-white/80 leading-relaxed">
              Bạn có thể yêu cầu <strong className="text-white">đổi hoặc trả trong 7 ngày</strong> kể từ
              khi nhận hàng đối với các trường hợp:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>Sản phẩm lỗi kỹ thuật hoặc hư hỏng do vận chuyển;</li>
              <li>Giao nhầm hoặc khác mô tả;</li>
            </ul>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Điều kiện áp dụng</h2>
              <ul className="list-disc list-inside space-y-2 text-white/80">
                <li>Hàng còn nguyên vẹn, chưa sử dụng, kèm bao bì/tem mác gốc;</li>
                <li>Cung cấp hóa đơn hoặc mã đơn hàng Shopee/Ecomate;</li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Quy trình hỗ trợ</h2>
              <ol className="list-decimal list-inside space-y-2 text-white/80">
                <li>Liên hệ hỗ trợ: contact@ecomate.vn hoặc +84 xxx xxx xxx;</li>
                <li>Gửi hình ảnh/video tình trạng sản phẩm và mã đơn hàng;</li>
                <li>Đóng gói và gửi lại theo hướng dẫn của CSKH (nếu cần).</li>
              </ol>
            </div>

            <div className="mt-8 p-6 rounded-xl border border-emerald-600/30 bg-emerald-950/20">
              <h3 className="text-lg font-semibold text-white mb-2">Lưu ý quan trọng</h3>
              <p className="text-sm text-white/70">
                Ecomate cam kết xử lý mọi yêu cầu đổi/trả một cách nhanh chóng và minh bạch.
                Thời gian xử lý thường từ 3-5 ngày làm việc kể từ khi nhận được sản phẩm hoàn trả.
              </p>
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
}
