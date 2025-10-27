import type { Metadata } from 'next'
import BlogPostLayout from '@/components/blog/blog-post-layout'

export const metadata: Metadata = {
  title: 'Mẹo sắp xếp tủ bếp nhanh | Gọn gàng, tiết kiệm thời gian',
  description:
    'Checklist mẹo sắp xếp tủ bếp nhanh, gọn gàng cho căn bếp nhỏ. Ưu tiên sản phẩm tiện ích, dễ lắp đặt, tiết kiệm chi phí.',
  keywords: [
    'mẹo sắp xếp tủ bếp',
    'phụ kiện nhà bếp',
    'đồ tiện ích nhà bếp',
    'tiết kiệm diện tích',
    'sắp xếp nhà cửa',
  ],
  openGraph: {
    title: 'Mẹo sắp xếp tủ bếp nhanh',
    description:
      'Checklist sắp xếp tủ bếp nhanh, gọn gàng cho căn bếp nhỏ. Lựa chọn thông minh, tiết kiệm thời gian.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mẹo sắp xếp tủ bếp nhanh',
    description: 'Gọn gàng, tiết kiệm thời gian cho căn bếp nhỏ.',
    images: ['/opengraph-image'],
  },
}

export default function Page() {
  return (
    <BlogPostLayout>
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Mẹo sắp xếp tủ bếp nhanh - Gọn gàng, tiết kiệm thời gian
        </h1>
        <p className="text-lg text-white/80 mb-4">
          Bạn đang gặp khó khăn với căn bếp nhỏ, tủ bếp lộn xộn và mất nhiều thời gian tìm đồ dùng?
          Hãy áp dụng ngay những mẹo sắp xếp tủ bếp thông minh này để biến không gian nấu nướng của bạn
          trở nên gọn gàng, khoa học và hiệu quả hơn.
        </p>
        <p className="text-white/70">
          Với các giải pháp dễ lắp đặt, tối ưu không gian và thói quen sử dụng hàng ngày,
          bạn sẽ tiết kiệm được rất nhiều thời gian dọn dẹp và nấu ăn trở nên thú vị hơn bao giờ hết.
        </p>
      </div>

      {/* Why Organize */}
      <section className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Tại sao cần sắp xếp tủ bếp khoa học?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">⏰ Tiết kiệm thời gian</h3>
            <p className="text-white/70">
              Sắp xếp khoa học giúp bạn tìm thấy đồ dùng ngay lập tức, không phải lục tung tủ bếp.
              Tiết kiệm 10-15 phút mỗi ngày khi nấu ăn và dọn dẹp.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">💰 Tránh lãng phí</h3>
            <p className="text-white/70">
              Thấy rõ những gì bạn có trong tủ giúp tránh mua trùng, thực phẩm hết hạn.
              Tiết kiệm chi phí mua sắm hàng tháng đáng kể.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">🧼 Vệ sinh an toàn</h3>
            <p className="text-white/70">
              Tủ bếp gọn gàng dễ lau chùi, hạn chế vi khuẩn, mốc phát triển.
              Đảm bảo an toàn vệ sinh thực phẩm cho cả gia đình.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-emerald-400">😊 Tâm lý thoải mái</h3>
            <p className="text-white/70">
              Không gian bếp ngăn nắp giúp tinh thần thư giãn, nấu ăn trở thành niềm vui
              thay vì gánh nặng hàng ngày.
            </p>
          </div>
        </div>
      </section>

      {/* Basic Principles */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Nguyên tắc sắp xếp cơ bản</h2>
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-900/30 to-transparent border-l-4 border-emerald-500">
            <h3 className="text-xl font-semibold mb-2 text-emerald-300">🔺 Tam giác vàng trong bếp</h3>
            <p className="text-white/80">
              Bố trí theo nguyên tắc "work triangle": Bếp nấu - Tủ lạnh - Bồn rửa tạo thành tam giác,
              khoảng cách giữa 3 điểm từ 1.2-2.7m. Đây là khoảng cách tối ưu để di chuyển hiệu quả
              khi nấu ăn, giảm thiểu công sức và thời gian.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-orange-900/30 to-transparent border-l-4 border-orange-500">
            <h3 className="text-xl font-semibold mb-2 text-orange-300">📊 Phân vùng theo tần suất</h3>
            <p className="text-white/80 mb-3">
              Chia tủ bếp thành 3 vùng rõ ràng để tối ưu hóa việc lấy đồ:
            </p>
            <ul className="space-y-2 text-white/70">
              <li>• <strong className="text-orange-300">Hàng ngày:</strong> Dầu ăn, muối, đường, gia vị thường dùng - Đặt tầng trung, dễ với tay</li>
              <li>• <strong className="text-orange-300">Hàng tuần:</strong> Bột mì, bột nở, nước tương - Tầng trên hoặc góc tủ</li>
              <li>• <strong className="text-orange-300">Thỉnh thoảng:</strong> Đồ dùng tiệc, nồi to - Tầng cao nhất hoặc tủ dưới sâu</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-900/30 to-transparent border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">🎯 Nhóm đồ theo chức năng</h3>
            <p className="text-white/80">
              Gom đồ dùng theo hoạt động: Khu vực pha chế (cà phê, trà), khu nấu nướng (nồi, chảo),
              khu chuẩn bị thực phẩm (dao, thớt, rổ). Nguyên tắc này giúp bạn làm việc mạch lạc,
              không phải di chuyển qua lại giữa các tủ.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Checklist */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Checklist sắp xếp chi tiết</h2>

        {/* Upper Cabinets */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20">
          <h3 className="text-xl font-semibold mb-4 text-purple-300">📦 Tủ trên (eye-level)</h3>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 text-xl">✓</span>
              <span><strong>Tầng giữa:</strong> Chén bát dùng hàng ngày, ly cốc - Vị trí dễ lấy nhất, không cần nhón chân</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 text-xl">✓</span>
              <span><strong>Tầng trên:</strong> Đồ ít dùng (bát to, đồ dự trữ) - Dùng ghế đẩu để lấy khi cần</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 text-xl">✓</span>
              <span><strong>Cửa tủ:</strong> Dán móc treo nhẹ (muỗng đo, găng tay lò nướng)</span>
            </li>
          </ul>
        </div>

        {/* Lower Cabinets */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-500/20">
          <h3 className="text-xl font-semibold mb-4 text-emerald-300">🗄️ Tủ dưới & Ngăn kéo</h3>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-xl">✓</span>
              <span><strong>Ngăn kéo trên:</strong> Đũa, thìa, dao nhỏ - Dùng khay phân chia để không lẫn lộn</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-xl">✓</span>
              <span><strong>Ngăn kéo dưới:</strong> Túi nilon, màng bọc thực phẩm, giấy bạc</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-xl">✓</span>
              <span><strong>Tủ sâu:</strong> Nồi, chảo - Xếp chồng hoặc dùng giá để đứng để dễ lấy</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 text-xl">✓</span>
              <span><strong>Góc tủ:</strong> Dùng giá xoay (lazy susan) để tận dụng không gian chết</span>
            </li>
          </ul>
        </div>

        {/* Sink Area */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20">
          <h3 className="text-xl font-semibold mb-4 text-blue-300">🚰 Khu vực bồn rửa</h3>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">✓</span>
              <span><strong>Dưới bồn rửa:</strong> Nước rửa chén, túi rác, xô lau nhà - Chống ẩm bằng hộp kín hoặc giá có chân</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">✓</span>
              <span><strong>Cạnh bồn:</strong> Giá để bát đĩa thoát nước, miếng rửa chén - Để khô nhanh, chống mốc</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 text-xl">✓</span>
              <span><strong>Tường phía sau:</strong> Móc treo khăn lau, găng tay cao su</span>
            </li>
          </ul>
        </div>

        {/* Cooking Area */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-900/20 to-transparent border border-orange-500/20">
          <h3 className="text-xl font-semibold mb-4 text-orange-300">🔥 Khu vực nấu nướng</h3>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">✓</span>
              <span><strong>Cạnh bếp:</strong> Dầu ăn, muối, đường, gia vị - Để trong khay hoặc giá để dễ di chuyển khi lau bếp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">✓</span>
              <span><strong>Tường phía sau:</strong> Thanh treo inox cho vá, muôi, thìa - Tận dụng tường, lấy nhanh</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">✓</span>
              <span><strong>Ngăn kéo dưới bếp:</strong> Nắp nồi, miếng lót nồi - Xếp đứng để dễ tìm</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Sản phẩm tiện ích nên có</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="text-3xl mb-3">🗂️</div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-300">Giá để bát đĩa inox</h3>
            <p className="text-sm text-white/70 mb-3">
              <strong>Vấn đề:</strong> Bát đĩa xếp chồng dễ vỡ, khó lấy món ở dưới<br/>
              <strong>Giải pháp:</strong> Giá inox 2-3 tầng giúp thoát nước nhanh, chống mốc, sử dụng tối đa không gian<br/>
              <strong>Lợi ích:</strong> Bát đĩa luôn khô ráo, vệ sinh, dễ lấy dùng
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="text-3xl mb-3">🏺</div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-300">Kệ gia vị đa tầng</h3>
            <p className="text-sm text-white/70 mb-3">
              <strong>Vấn đề:</strong> Lọ gia vị xếp chồng, khó tìm lọ cần dùng<br/>
              <strong>Giải pháp:</strong> Kệ bậc thang hoặc giá xoay giúp nhìn thấy tất cả các lọ cùng lúc<br/>
              <strong>Lợi ích:</strong> Tiết kiệm thời gian nấu ăn, tránh mua trùng
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-300">Hộp đựng thực phẩm kín</h3>
            <p className="text-sm text-white/70 mb-3">
              <strong>Vấn đề:</strong> Thực phẩm khô (gạo, đường, bột) dễ ẩm mốc, mất vệ sinh<br/>
              <strong>Giải pháp:</strong> Hộp nhựa trong suốt có nắp kín, xếp gọn, nhìn thấy còn bao nhiêu<br/>
              <strong>Lợi ích:</strong> Bảo quản lâu, tiết kiệm chi phí, bếp gọn gàng hơn
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="text-3xl mb-3">🪝</div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-300">Móc treo đa năng</h3>
            <p className="text-sm text-white/70 mb-3">
              <strong>Vấn đề:</strong> Khăn lau, găng tay, túi rác chiếm chỗ trong tủ<br/>
              <strong>Giải pháp:</strong> Móc dán tường, treo cửa tủ, thanh treo inox - Không cần khoan tường<br/>
              <strong>Lợi ích:</strong> Tận dụng không gian trống, đồ khô nhanh, dễ lấy
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="text-3xl mb-3">🔪</div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-300">Khay phân chia ngăn kéo</h3>
            <p className="text-sm text-white/70 mb-3">
              <strong>Vấn đề:</strong> Đũa, thìa, dao kéo lẫn lộn trong ngăn kéo<br/>
              <strong>Giải pháp:</strong> Khay chia ô bằng nhựa hoặc tre, có thể điều chỉnh kích thước<br/>
              <strong>Lợi ích:</strong> Tìm đồ nhanh, vệ sinh dễ dàng, tủ ngăn nắp
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
            <div className="text-3xl mb-3">🍳</div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-300">Giá để nồi chảo đứng</h3>
            <p className="text-sm text-white/70 mb-3">
              <strong>Vấn đề:</strong> Nồi chảo xếp chồng khó lấy, dễ trầy xước<br/>
              <strong>Giải pháp:</strong> Giá inox để đứng hoặc treo tường, tiết kiệm 50% không gian<br/>
              <strong>Lợi ích:</strong> Lấy nồi chảo dễ dàng, bảo vệ lớp chống dính
            </p>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="mb-12 p-6 rounded-2xl bg-red-900/10 border border-red-500/30">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-red-300">
          ⚠️ Lỗi thường gặp khi sắp xếp
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-900/20 border-l-4 border-red-500">
            <p className="font-semibold mb-2 text-red-300">1. Xếp đồ quá cao hoặc quá sâu</p>
            <p className="text-white/70">
              <strong>Hậu quả:</strong> Khó lấy đồ, dễ đánh rơi, tốn thời gian lục tủ<br/>
              <strong>Cách tránh:</strong> Đồ dùng hàng ngày để tầng trung (eye-level), đồ nặng để tầng dưới
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-900/20 border-l-4 border-red-500">
            <p className="font-semibold mb-2 text-red-300">2. Không phân loại trước khi xếp</p>
            <p className="text-white/70">
              <strong>Hậu quả:</strong> Tủ lộn xộn sau vài ngày, không biết còn gì trong tủ<br/>
              <strong>Cách tránh:</strong> Loại bỏ đồ hỏng/hết hạn, phân nhóm rõ ràng (nấu ăn, pha chế, dụng cụ)
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-900/20 border-l-4 border-red-500">
            <p className="font-semibold mb-2 text-red-300">3. Để đồ không có nơi cố định</p>
            <p className="text-white/70">
              <strong>Hậu quả:</strong> Mỗi lần dùng xong để lung tung, tủ mất trật tự nhanh<br/>
              <strong>Cách tránh:</strong> Quy định "1 đồ vật - 1 vị trí cố định", dán nhãn nếu cần
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-900/20 border-l-4 border-red-500">
            <p className="font-semibold mb-2 text-red-300">4. Dùng hộp/giá không phù hợp kích thước tủ</p>
            <p className="text-white/70">
              <strong>Hậu quả:</strong> Lãng phí không gian, khó đóng mở tủ<br/>
              <strong>Cách tránh:</strong> Đo kỹ kích thước tủ trước khi mua phụ kiện, chọn loại có thể điều chỉnh
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-900/20 border-l-4 border-red-500">
            <p className="font-semibold mb-2 text-red-300">5. Quên bảo trì định kỳ</p>
            <p className="text-white/70">
              <strong>Hậu quả:</strong> Tủ bẩn, ẩm mốc, đồ dùng hư hỏng nhanh<br/>
              <strong>Cách tránh:</strong> Lau tủ hàng tuần, kiểm tra hạn sử dụng thực phẩm hàng tháng
            </p>
          </div>
        </div>
      </section>

      {/* Maintenance Tips */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Tips bảo quản và vệ sinh
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-green-900/30 to-transparent border border-green-500/30">
            <h3 className="text-xl font-semibold mb-3 text-green-300">📅 Thói quen hàng ngày</h3>
            <ul className="space-y-2 text-white/70">
              <li>• Rửa và để khô đồ dùng ngay sau khi dùng</li>
              <li>• Lau bếp sau mỗi lần nấu để tránh dầu mỡ bám</li>
              <li>• Đặt đồ về đúng vị trí sau khi sử dụng</li>
              <li>• Đổ rác hữu cơ mỗi tối để tránh mùi hôi</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-900/30 to-transparent border border-blue-500/30">
            <h3 className="text-xl font-semibold mb-3 text-blue-300">🗓️ Bảo trì hàng tuần/tháng</h3>
            <ul className="space-y-2 text-white/70">
              <li>• <strong>Hàng tuần:</strong> Lau sạch tủ bếp, kiểm tra rau củ trong tủ lạnh</li>
              <li>• <strong>Hàng tháng:</strong> Kiểm tra hạn sử dụng thực phẩm khô, loại bỏ đồ hỏng</li>
              <li>• <strong>Mỗi 3 tháng:</strong> Tổng dọn tủ bếp, sắp xếp lại theo mùa</li>
              <li>• <strong>Mỗi 6 tháng:</strong> Kiểm tra phụ kiện bếp (dao, thớt cần mài/thay)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Printable Checklist */}
      <section className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-transparent border border-purple-500/30">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">
          📝 Checklist tổng hợp để in ra
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-3 text-white">Chuẩn bị:</h3>
            <ul className="space-y-2 text-white/70">
              <li>☐ Lấy hết đồ ra khỏi tủ</li>
              <li>☐ Loại bỏ đồ hỏng, hết hạn</li>
              <li>☐ Lau sạch tủ, để khô</li>
              <li>☐ Chuẩn bị hộp/giá sắp xếp</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-white">Sắp xếp:</h3>
            <ul className="space-y-2 text-white/70">
              <li>☐ Phân loại theo nhóm chức năng</li>
              <li>☐ Xếp theo tần suất sử dụng</li>
              <li>☐ Gắn nhãn cho hộp/lọ</li>
              <li>☐ Kiểm tra lại dễ lấy/dễ cất</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-transparent border border-emerald-500/30">
        <h2 className="text-2xl font-bold mb-4">Sẵn sàng cải tạo tủ bếp của bạn?</h2>
        <p className="text-white/70 mb-6">
          Khám phá các sản phẩm tiện ích tại Ecomate để biến tủ bếp của bạn thành không gian
          nấu nướng hiệu quả và gọn gàng. Freeship 300k, đổi trả dễ dàng!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://shopee.vn/ecomate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition font-semibold"
          >
            Xem sản phẩm trên Shopee
          </a>
          <a
            href="/"
            className="inline-block px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 transition font-semibold border border-white/20"
          >
            Xem thêm tips khác
          </a>
        </div>
      </div>
    </BlogPostLayout>
  )
}

