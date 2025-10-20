"use client";
import SeoJsonLd from "@/components/seo-json-ld";
import PageTransition from "@/components/page-transition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const updatedAt = "2025-10-20";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Chính sách bảo mật",
    dateModified: updatedAt,
    description:
      "Chính sách bảo mật của Ecomate: cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.",
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
          <h1 className="mb-6 text-3xl md:text-4xl font-bold">Chính sách bảo mật</h1>
          <p className="mb-8 text-sm text-white/60">Cập nhật lần cuối: {updatedAt}</p>

          <section className="prose prose-invert prose-emerald max-w-none space-y-6">
            <p className="text-white/80 leading-relaxed">
              Tại <strong className="text-white">Ecomate</strong>, chúng tôi coi trọng quyền riêng tư và cam
              kết bảo vệ dữ liệu cá nhân của bạn. Chính sách này giải thích loại dữ
              liệu chúng tôi thu thập, mục đích sử dụng và quyền của bạn đối với dữ
              liệu đó.
            </p>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Thông tin chúng tôi thu thập</h2>
              <ul className="list-disc list-inside space-y-2 text-white/80">
                <li>
                  <strong className="text-white">Thông tin cá nhân</strong>: họ tên, email, số điện thoại,
                  địa chỉ giao hàng.
                </li>
                <li>
                  <strong className="text-white">Dữ liệu sử dụng</strong>: cookie, địa chỉ IP, trang đã xem,
                  tương tác trên website.
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Mục đích sử dụng</h2>
              <ul className="list-disc list-inside space-y-2 text-white/80">
                <li>Xử lý và giao đơn hàng; chăm sóc khách hàng.</li>
                <li>Cải thiện trải nghiệm, tối ưu tốc độ và nội dung trang.</li>
                <li>
                  Gửi thông tin khuyến mãi/kampaign khi bạn đồng ý đăng ký nhận tin.
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Chia sẻ với bên thứ ba</h2>
              <p className="text-white/80 leading-relaxed">
                Chúng tôi <strong className="text-white">không bán</strong> dữ liệu cá nhân. Dữ liệu có thể
                được chia sẻ cho đối tác giao vận và thanh toán nhằm hoàn tất đơn
                hàng, tuân thủ pháp luật, hoặc bảo vệ quyền lợi hợp pháp của Ecomate.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Bảo mật và lưu trữ</h2>
              <p className="text-white/80 leading-relaxed">
                Ecomate áp dụng biện pháp kỹ thuật và tổ chức phù hợp (mã hóa, phân
                quyền, giám sát truy cập). Dữ liệu chỉ được lưu giữ trong thời gian cần
                thiết cho mục đích đã nêu hoặc theo quy định pháp luật.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Quyền của bạn</h2>
              <ul className="list-disc list-inside space-y-2 text-white/80">
                <li>Yêu cầu truy cập, chỉnh sửa, xóa dữ liệu cá nhân.</li>
                <li>Rút lại sự đồng ý nhận thông tin tiếp thị bất cứ lúc nào.</li>
              </ul>
              <p className="mt-4 text-white/80">
                Liên hệ: <a href="mailto:contact@ecomate.vn" className="text-emerald-400 hover:text-emerald-300">contact@ecomate.vn</a>
              </p>
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
}
