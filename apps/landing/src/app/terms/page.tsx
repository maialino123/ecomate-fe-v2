"use client";
import SeoJsonLd from "@/components/seo-json-ld";
import PageTransition from "@/components/page-transition";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const updatedAt = "2025-10-20";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Điều khoản sử dụng",
    dateModified: updatedAt,
    description: "Điều khoản sử dụng website Ecomate: quyền và nghĩa vụ của các bên khi truy cập và mua sắm.",
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
          <h1 className="mb-6 text-3xl md:text-4xl font-bold">Điều khoản sử dụng</h1>
          <p className="mb-8 text-sm text-white/60">Cập nhật lần cuối: {updatedAt}</p>

          <section className="prose prose-invert prose-emerald max-w-none space-y-6">
            <ol className="list-decimal list-inside space-y-4 text-white/80">
              <li>
                <strong className="text-white">Chấp nhận điều khoản</strong>: Bằng việc truy cập
                Ecomate.vn, bạn đồng ý tuân thủ các điều khoản này.
              </li>
              <li>
                <strong className="text-white">Thay đổi nội dung</strong>: Giá bán, tồn kho, chương trình
                ưu đãi có thể thay đổi mà không báo trước.
              </li>
              <li>
                <strong className="text-white">Quyền sở hữu trí tuệ</strong>: Nội dung, thiết kế, hình ảnh
                thuộc bản quyền của Ecomate. Mọi sao chép cần có sự đồng ý bằng văn
                bản.
              </li>
              <li>
                <strong className="text-white">Liên kết bên ngoài</strong>: Chúng tôi không chịu trách
                nhiệm về nội dung tại các liên kết ngoài (Shopee, TikTok Shop, v.v.).
              </li>
              <li>
                <strong className="text-white">Trách nhiệm người dùng</strong>: Cung cấp thông tin chính
                xác khi đặt hàng, bảo mật tài khoản, không sử dụng website cho mục
                đích trái pháp luật.
              </li>
              <li>
                <strong className="text-white">Giới hạn trách nhiệm</strong>: Ecomate không chịu trách
                nhiệm với các thiệt hại gián tiếp phát sinh do sự cố ngoài tầm kiểm
                soát hợp lý.
              </li>
              <li>
                <strong className="text-white">Luật áp dụng</strong>: Điều khoản này điều chỉnh theo pháp
                luật Việt Nam.
              </li>
            </ol>
          </section>
        </main>
      </div>
    </PageTransition>
  );
}
