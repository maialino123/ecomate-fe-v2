"use client";
import SeoJsonLd from "@/components/seo-json-ld";
import PageTransition from "@/components/page-transition";
import Link from "next/link";
import { ArrowLeft, MapPin, Truck, Package } from "lucide-react";

export default function ShippingPolicyPage() {
  const updatedAt = "2025-10-20";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Chính sách vận chuyển",
    dateModified: updatedAt,
    description: "Chính sách giao hàng toàn quốc của Ecomate: thời gian giao, phí ship, theo dõi đơn hàng.",
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
          <h1 className="mb-6 text-3xl md:text-4xl font-bold">Chính sách vận chuyển</h1>
          <p className="mb-8 text-sm text-white/60">Cập nhật lần cuối: {updatedAt}</p>

          <section className="prose prose-invert prose-emerald max-w-none space-y-6">
            <p className="text-white/80 leading-relaxed">
              Ecomate giao hàng toàn quốc thông qua Shopee và các đối tác vận
              chuyển. Thời gian và phí giao có thể thay đổi theo địa chỉ nhận.
            </p>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Thời gian giao dự kiến</h2>
              <ul className="list-disc list-inside space-y-2 text-white/80">
                <li>Miền Bắc: 1–3 ngày làm việc</li>
                <li>Miền Trung: 2–4 ngày làm việc</li>
                <li>Miền Nam: 1–3 ngày làm việc</li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Phí giao hàng</h2>
              <p className="text-white/80 leading-relaxed">
                Miễn phí cho đơn từ <strong className="text-white">300.000đ</strong> hoặc theo biểu phí của
                Shopee tại thời điểm đặt hàng.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Theo dõi đơn hàng</h2>
              <p className="text-white/80 leading-relaxed">
                Bạn sẽ nhận mã vận đơn để theo dõi trực tiếp trên Shopee hoặc trang
                của hãng vận chuyển.
              </p>
            </div>
          </section>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <MapPin className="mb-3 h-6 w-6 text-emerald-400" />
              <p className="text-sm font-medium text-white">Giao toàn quốc</p>
              <p className="text-xs text-white/60 mt-1">63 tỉnh thành</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <Truck className="mb-3 h-6 w-6 text-emerald-400" />
              <p className="text-sm font-medium text-white">1–4 ngày làm việc</p>
              <p className="text-xs text-white/60 mt-1">Giao nhanh toàn quốc</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <Package className="mb-3 h-6 w-6 text-emerald-400" />
              <p className="text-sm font-medium text-white">Miễn phí từ 300k</p>
              <p className="text-xs text-white/60 mt-1">Ưu đãi ship toàn quốc</p>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
