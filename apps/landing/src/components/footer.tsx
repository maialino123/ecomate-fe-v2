"use client";
import { motion } from "framer-motion";
import { Facebook, ShoppingBag, Send, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ email, message });
  };

  return (
    <footer className="relative w-full border-t border-white/10 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Ecomate</h3>
            <p className="text-white/70 text-sm mb-6">
              Giải pháp thông minh cho không gian sống hiện đại.
              Sản phẩm chất lượng, giá cả hợp lý.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Việt Nam</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+84 xxx xxx xxx</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>contact@ecomate.vn</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Liên kết</h4>
            <ul className="space-y-3">
              {[
                { name: "Sản phẩm", href: "#products" },
                { name: "Về chúng tôi", href: "#about" },
                { name: "Blog", href: "#blog" },
                { name: "Liên hệ", href: "#contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policy Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Chính sách</h4>
            <ul className="space-y-3">
              {[
                { name: "Chính sách bảo mật", href: "/privacy-policy" },
                { name: "Điều khoản sử dụng", href: "/terms" },
                { name: "Chính sách vận chuyển", href: "/shipping-policy" },
                { name: "Chính sách đổi trả", href: "/return-policy" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-emerald-400 transition-colors text-sm"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-emerald-400 transition-colors resize-none text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Send className="h-4 w-4" />
                Gửi tin nhắn
              </button>
            </form>
          </motion.div>
        </div>

        {/* Social Media & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com/ecomate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-blue-400 hover:bg-blue-400/10 transition-all group"
              >
                <Facebook className="h-5 w-5 text-white/70 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://shopee.vn/ecomate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-orange-400 hover:bg-orange-400/10 transition-all group"
              >
                <ShoppingBag className="h-5 w-5 text-white/70 group-hover:text-orange-400 transition-colors" />
              </a>
              <a
                href="https://tiktok.com/@ecomate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-pink-400 hover:bg-pink-400/10 transition-all group"
              >
                <svg
                  className="h-5 w-5 text-white/70 group-hover:text-pink-400 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-white/50 text-sm text-center md:text-right">
              © {new Date().getFullYear()} Ecomate. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
