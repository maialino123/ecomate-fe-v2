"use client";
import { Timeline } from "@workspace/ui/components/ui/timeline";
import { MapPin, Package, Truck, Clock } from "lucide-react";

export default function ConnectivityMap() {
  const data = [
    {
      title: "Miền Bắc",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-white/80 md:text-sm">
            Phục vụ toàn bộ khu vực phía Bắc với trung tâm logistics tại Hà Nội.
            Giao hàng nhanh trong 24-48h cho khu vực nội thành và 2-3 ngày cho các tỉnh lân cận.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Hà Nội",
              "Hải Phòng",
              "Quảng Ninh",
              "Hải Dương",
              "Bắc Ninh",
              "Thái Nguyên",
              "Lào Cai",
              "Điện Biên",
              "Sơn La",
            ].map((city, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-950/20 p-3 backdrop-blur-sm"
              >
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-white">{city}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Clock className="h-4 w-4" />
              <span>Giao trong 24-48h</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Package className="h-4 w-4" />
              <span>Miễn phí ship từ 300k</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Miền Trung",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-white/80 md:text-sm">
            Khu vực miền Trung được phục vụ từ trung tâm phân phối tại Đà Nẵng.
            Chúng tôi cam kết giao hàng an toàn và nhanh chóng cho tất cả các tỉnh thành.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Đà Nẵng",
              "Huế",
              "Quảng Nam",
              "Quảng Ngãi",
              "Bình Định",
              "Phú Yên",
              "Khánh Hòa",
              "Nghệ An",
              "Hà Tĩnh",
            ].map((city, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border border-blue-600/30 bg-blue-950/20 p-3 backdrop-blur-sm"
              >
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">{city}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Clock className="h-4 w-4" />
              <span>Giao trong 2-4 ngày</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Truck className="h-4 w-4" />
              <span>Hỗ trợ COD toàn khu vực</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Miền Nam",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-white/80 md:text-sm">
            Mạng lưới giao hàng rộng khắp miền Nam với trung tâm chính tại TP. Hồ Chí Minh.
            Phủ sóng toàn bộ các tỉnh thành và đồng bằng sông Cửu Long.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "TP. Hồ Chí Minh",
              "Bình Dương",
              "Đồng Nai",
              "Vũng Tàu",
              "Cần Thơ",
              "Tiền Giang",
              "Long An",
              "Đà Lạt",
              "Nha Trang",
              "An Giang",
              "Kiên Giang",
              "Cà Mau",
            ].map((city, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border border-purple-600/30 bg-purple-950/20 p-3 backdrop-blur-sm"
              >
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white">{city}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <Clock className="h-4 w-4" />
              <span>Giao trong 24-72h</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <Package className="h-4 w-4" />
              <span>Giao tận nơi mọi quận huyện</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip py-20">
      <div className="max-w-7xl mx-auto text-center px-6 mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Giao hàng toàn quốc
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Ecomate phục vụ khách hàng trên toàn Việt Nam với dịch vụ giao hàng nhanh chóng và an toàn
        </p>
      </div>
      <Timeline
        data={data}
        showHeader={false}
        className="bg-transparent"
      />
    </div>
  );
}
