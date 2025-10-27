import type { Metadata } from 'next'
import BlogPostLayout from '@/components/blog/blog-post-layout'

export const metadata: Metadata = {
  title: 'Đồ gia dụng Hà Nội | Freeship 300k, đổi trả 14 ngày',
  description:
    'Mua đồ gia dụng tiện ích giao nhanh nội thành Hà Nội. Freeship đơn 300k, đổi trả 14 ngày tại Ecomate. Gợi ý sản phẩm gọn gàng, tiết kiệm, thông minh.',
  keywords: [
    'đồ gia dụng Hà Nội',
    'freeship 300k',
    'đổi trả 14 ngày',
    'đồ tiện ích thông minh',
    'phụ kiện nhà bếp',
    'đồ dùng phòng tắm',
    'mua sắm Shopee',
  ],
  openGraph: {
    title: 'Đồ gia dụng Hà Nội | Freeship 300k, đổi trả 14 ngày',
    description:
      'Giao nhanh nội thành Hà Nội. Đồ gia dụng tiện ích giá dễ mua, freeship đơn 300k, đổi trả 14 ngày.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đồ gia dụng Hà Nội | Freeship 300k',
    description: 'Giao nhanh Hà Nội, freeship 300k, đổi trả 14 ngày.',
    images: ['/opengraph-image'],
  },
}

export default function Page() {
  return (
    <BlogPostLayout>
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Đồ gia dụng giao nhanh Hà Nội - Freeship 300k
        </h1>
        <p className="text-lg text-white/80 mb-4">
          Ecomate gợi ý các giải pháp gọn gàng, tiết kiệm diện tích cho căn hộ và nhà phố tại Hà Nội.
          Mua sắm dễ dàng trên Shopee, giao hàng nhanh chóng trong 24-48h, freeship đơn 300k, đổi trả thoải mái trong 14 ngày.
        </p>
        <p className="text-white/70">
          Bạn đang tìm kiếm đồ gia dụng chất lượng, giá cả phải chăng với dịch vụ giao hàng nhanh tại Hà Nội?
          Ecomate là điểm đến lý tưởng cho mọi nhu cầu trang trí và sắp xếp không gian sống hiện đại của bạn.
        </p>
      </div>

      {/* Why Choose Ecomate */}
      <section className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Tại sao chọn Ecomate tại Hà Nội?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">🚚 Giao hàng siêu nhanh</h3>
            <p className="text-white/70">
              Đặt hàng hôm nay, nhận hàng ngay mai. Giao hàng nội thành Hà Nội trong 24-48h,
              không để bạn phải chờ đợi lâu. Đặc biệt freeship cho đơn hàng từ 300.000đ.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">💰 Giá cả hợp lý</h3>
            <p className="text-white/70">
              Sản phẩm đa dạng từ 10.000đ - 500.000đ, phù hợp với mọi túi tiền.
              Thường xuyên có voucher và ưu đãi đặc biệt trên Shopee, giúp bạn tiết kiệm tối đa.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">✅ Chất lượng đảm bảo</h3>
            <p className="text-white/70">
              Tất cả sản phẩm đều được kiểm tra kỹ lưỡng trước khi giao hàng.
              Cam kết hàng đúng mô tả, chất liệu bền đẹp, an toàn cho sức khỏe.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">🔄 Đổi trả dễ dàng</h3>
            <p className="text-white/70">
              Chính sách đổi trả linh hoạt trong 14 ngày với sản phẩm còn nguyên tem, bao bì.
              Mua sắm an tâm, không lo rủi ro.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">💬 Hỗ trợ tận tâm</h3>
            <p className="text-white/70">
              Đội ngũ tư vấn nhiệt tình, sẵn sàng hỗ trợ 24/7 qua chat Shopee.
              Giải đáp mọi thắc mắc về sản phẩm, kích thước, cách sử dụng.
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Danh mục sản phẩm phổ biến</h2>
        <div className="space-y-6">
          {/* Living Room */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-500/20">
            <h3 className="text-xl font-semibold mb-3 text-emerald-300">🛋️ Phòng khách</h3>
            <p className="text-white/70 mb-4">
              Tối ưu không gian phòng khách với các giải pháp thông minh, giúp căn phòng gọn gàng và hiện đại hơn.
            </p>
            <ul className="space-y-2 text-white/80">
              <li><span className="text-emerald-400">•</span> Kệ tivi gỗ đa năng - Tiết kiệm diện tích, nhiều ngăn chứa đồ</li>
              <li><span className="text-emerald-400">•</span> Giá treo tường decor - Tăng thẩm mỹ, không chiếm sàn nhà</li>
              <li><span className="text-emerald-400">•</span> Hộp đựng điều khiển - Dễ tìm kiếm, tránh thất lạc</li>
              <li><span className="text-emerald-400">•</span> Thảm trải sàn chống trượt - An toàn, dễ vệ sinh</li>
            </ul>
          </div>

          {/* Kitchen */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-orange-900/20 to-transparent border border-orange-500/20">
            <h3 className="text-xl font-semibold mb-3 text-orange-300">🍳 Nhà bếp</h3>
            <p className="text-white/70 mb-4">
              Biến căn bếp nhỏ thành không gian nấu nướng hiệu quả với phụ kiện thông minh, tiết kiệm diện tích.
            </p>
            <ul className="space-y-2 text-white/80">
              <li><span className="text-orange-400">•</span> Kệ gia vị đa tầng - Sắp xếp khoa học, dễ lấy dùng</li>
              <li><span className="text-orange-400">•</span> Giá để bát đĩa inox - Thoát nước tốt, chống mốc</li>
              <li><span className="text-orange-400">•</span> Hộp đựng thực phẩm kín - Bảo quản tươi lâu, tiết kiệm</li>
              <li><span className="text-orange-400">•</span> Móc treo đồ dùng nhà bếp - Tận dụng tường, gọn gàng</li>
            </ul>
          </div>

          {/* Bathroom */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-3 text-blue-300">🚿 Phòng tắm</h3>
            <p className="text-white/70 mb-4">
              Giữ phòng tắm luôn khô ráo, sạch sẽ với các phụ kiện tiện ích, chống ẩm mốc hiệu quả.
            </p>
            <ul className="space-y-2 text-white/80">
              <li><span className="text-blue-400">•</span> Kệ góc nhà tắm - Tối ưu góc chết, chịu nước tốt</li>
              <li><span className="text-blue-400">•</span> Móc treo khăn đa năng - Tiết kiệm không gian, khô nhanh</li>
              <li><span className="text-blue-400">•</span> Hộp đựng đồ vệ sinh - Ngăn nắp, dễ tìm kiếm</li>
              <li><span className="text-blue-400">•</span> Thảm chùi chân chống trượt - An toàn, thấm hút tốt</li>
            </ul>
          </div>

          {/* Bedroom */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20">
            <h3 className="text-xl font-semibold mb-3 text-purple-300">🛏️ Phòng ngủ</h3>
            <p className="text-white/70 mb-4">
              Tạo không gian nghỉ ngơi thư giãn với các vật dụng tiện ích, giúp phòng ngủ gọn gàng và thoải mái.
            </p>
            <ul className="space-y-2 text-white/80">
              <li><span className="text-purple-400">•</span> Hộp đựng đồ lót phân ngăn - Sắp xếp khoa học, dễ tìm</li>
              <li><span className="text-purple-400">•</span> Móc treo quần áo sau cửa - Tiết kiệm tủ, thông thoáng</li>
              <li><span className="text-purple-400">•</span> Túi hút chân không - Giảm thể tích, chống ẩm mốc</li>
              <li><span className="text-purple-400">•</span> Đèn ngủ cảm ứng - Tiện lợi, tiết kiệm điện</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Lợi ích khi mua sắm tại Ecomate</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold mb-2">Giao hàng nhanh</h3>
            <p className="text-sm text-white/70">Nội thành Hà Nội 24-48h</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="font-semibold mb-2">Freeship 300k</h3>
            <p className="text-sm text-white/70">Miễn phí vận chuyển đơn từ 300.000đ</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="font-semibold mb-2">Đổi trả 14 ngày</h3>
            <p className="text-sm text-white/70">Chính sách đổi trả linh hoạt</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">💎</div>
            <h3 className="font-semibold mb-2">Chất lượng cao</h3>
            <p className="text-sm text-white/70">Sản phẩm được kiểm tra kỹ</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold mb-2">Giá tốt nhất</h3>
            <p className="text-sm text-white/70">Ưu đãi hấp dẫn trên Shopee</p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
            <p className="text-sm text-white/70">Tư vấn nhiệt tình qua chat</p>
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Cách đặt hàng nhanh chóng</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              1
            </div>
            <h3 className="font-semibold mb-2">Chọn sản phẩm</h3>
            <p className="text-sm text-white/70">
              Duyệt shop Ecomate trên Shopee, chọn sản phẩm phù hợp với nhu cầu
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              2
            </div>
            <h3 className="font-semibold mb-2">Đặt hàng</h3>
            <p className="text-sm text-white/70">
              Thêm vào giỏ, thanh toán dễ dàng qua Shopee (COD hoặc chuyển khoản)
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              3
            </div>
            <h3 className="font-semibold mb-2">Nhận hàng</h3>
            <p className="text-sm text-white/70">
              Giao hàng tận nơi trong 24-48h tại Hà Nội, kiểm tra kỹ trước khi nhận
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              4
            </div>
            <h3 className="font-semibold mb-2">Đổi trả</h3>
            <p className="text-sm text-white/70">
              Nếu không hài lòng, đổi trả dễ dàng trong 14 ngày
            </p>
          </div>
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Khu vực giao hàng tại Hà Nội</h2>
        <p className="text-white/70 mb-4">
          Ecomate hỗ trợ giao hàng nhanh chóng đến tất cả các quận, huyện nội thành và ngoại thành Hà Nội.
          Thời gian giao hàng dự kiến:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-3 text-emerald-400">📍 Nội thành (24h)</h3>
            <div className="text-sm text-white/70 space-y-1">
              <p>• Ba Đình, Hoàn Kiếm, Đống Đa, Hai Bà Trưng</p>
              <p>• Cầu Giấy, Thanh Xuân, Tây Hồ, Hoàng Mai</p>
              <p>• Long Biên, Nam Từ Liêm, Bắc Từ Liêm</p>
              <p>• Hà Đông, Thanh Trì, Gia Lâm</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-3 text-emerald-400">📍 Ngoại thành (48h)</h3>
            <div className="text-sm text-white/70 space-y-1">
              <p>• Đông Anh, Sóc Sơn, Mê Linh</p>
              <p>• Hoài Đức, Quốc Oai, Thạch Thất</p>
              <p>• Chương Mỹ, Phúc Thọ, Đan Phượng</p>
              <p>• Các huyện vùng ven khác</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-white/60 mt-4 italic">
          * Thời gian giao hàng có thể thay đổi tùy thuộc vào điều kiện thực tế và đơn vị vận chuyển.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Câu hỏi thường gặp (FAQ)</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-semibold mb-2">❓ Freeship áp dụng thế nào?</p>
            <p className="text-white/70">
              Freeship tự động áp dụng cho tất cả đơn hàng từ 300.000đ trở lên khi giao tại Hà Nội.
              Không cần mã voucher, hệ thống tự động giảm phí vận chuyển khi thanh toán.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-semibold mb-2">❓ Đổi trả sản phẩm trong bao lâu?</p>
            <p className="text-white/70">
              Bạn có thể đổi trả trong vòng 14 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem,
              bao bì, chưa qua sử dụng. Vui lòng chat với shop để được hỗ trợ đổi trả nhanh chóng.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-semibold mb-2">❓ Có hỗ trợ giao hàng ngoài giờ không?</p>
            <p className="text-white/70">
              Hiện tại chúng tôi giao hàng trong khung giờ hành chính (8h-18h) các ngày trong tuần.
              Nếu bạn có nhu cầu đặc biệt, vui lòng chat với shop để được tư vấn và sắp xếp.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-semibold mb-2">❓ Thanh toán bằng COD có được không?</p>
            <p className="text-white/70">
              Có, Ecomate hỗ trợ thanh toán COD (thu tiền khi nhận hàng) cho tất cả đơn hàng.
              Bạn có thể kiểm tra hàng trước khi thanh toán để đảm bảo sản phẩm đúng mô tả.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-semibold mb-2">❓ Sản phẩm có bảo hành không?</p>
            <p className="text-white/70">
              Tùy vào từng loại sản phẩm, chúng tôi có chính sách bảo hành khác nhau (từ 1-12 tháng).
              Thông tin bảo hành cụ thể được ghi rõ trong mô tả sản phẩm trên Shopee.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="font-semibold mb-2">❓ Làm thế nào để được tư vấn sản phẩm?</p>
            <p className="text-white/70">
              Bạn có thể chat trực tiếp với shop Ecomate trên Shopee 24/7.
              Đội ngũ tư vấn sẵn sàng hỗ trợ về kích thước, màu sắc, cách sử dụng và gợi ý sản phẩm phù hợp.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-transparent border border-emerald-500/30">
        <h2 className="text-2xl font-bold mb-4">Sẵn sàng mua sắm thông minh?</h2>
        <p className="text-white/70 mb-6">
          Khám phá hàng trăm sản phẩm đồ gia dụng tiện ích tại shop Ecomate trên Shopee.
          Giao nhanh 24-48h, freeship 300k, đổi trả dễ dàng!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://shopee.vn/ecomate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition font-semibold"
          >
            Mua ngay trên Shopee
          </a>
          <a
            href="https://shopee.vn/ecomate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 transition font-semibold border border-white/20"
          >
            Chat để tư vấn
          </a>
        </div>
      </div>
    </BlogPostLayout>
  )
}

