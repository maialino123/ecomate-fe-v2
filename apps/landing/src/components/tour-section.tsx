"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const ScrollStage = dynamic(() => import("@/components/scroll-stage"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function TourSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const circleCollapseRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const livingTextRef = useRef<HTMLDivElement>(null);
  const hasCollapsedRef = useRef(false);
  const isActivatedRef = useRef(false);

  const [isActivated, setIsActivated] = useState(false);
  const [showCircleReveal, setShowCircleReveal] = useState(false);
  const [showCircleCollapse, setShowCircleCollapse] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    // GSAP ScrollTrigger để kích hoạt circular reveal
    const activateTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      onEnter: () => {
        // Không activate nếu đang active rồi
        if (isActivatedRef.current) {
          console.log('⏭️ Already activated, skipping');
          return;
        }

        console.log('🎬 Activating 3D tour with circular reveal');

        // DISABLE SCROLL trong lúc circular reveal
        const scrollRoot = document.getElementById('scroll-root');
        if (scrollRoot) {
          scrollRoot.style.overflow = 'hidden';
          console.log('🔒 Scroll disabled for reveal');
        }

        // Reset collapse flag khi activate lại
        hasCollapsedRef.current = false;
        isActivatedRef.current = true;
        setIsActivated(true);
        setShowCircleReveal(true);

        // Fade in canvas với delay để circular reveal che trước
        if (canvasWrapRef.current) {
          gsap.to(canvasWrapRef.current, {
            opacity: 1,
            duration: 0.8,
            delay: 0.6, // Đợi circle expand một chút
            onStart: () => console.log('🌟 Canvas fading in'),
            onComplete: () => console.log('✅ Canvas visible')
          });
        }

        // Chờ circleRef render rồi mới animate
        requestAnimationFrame(() => {
          if (!circleRef.current) return;

          const circle = circleRef.current;

          // Circular reveal animation
          const tl = gsap.timeline({
            onComplete: () => {
              console.log("✅ Circle animation complete, hiding circle");
              // Ẩn circle sau khi animation xong
              setShowCircleReveal(false);

              // RE-ENABLE SCROLL sau khi reveal xong
              const scrollRoot = document.getElementById('scroll-root');
              if (scrollRoot) {
                scrollRoot.style.overflow = 'auto';
                console.log('🔓 Scroll re-enabled after reveal');
              }
            }
          });

          tl.fromTo(
            circle,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
          ).to(circle, {
            scale: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
          });

          // Backup: Ẩn circle và re-enable scroll sau 2 giây dù có lỗi
          setTimeout(() => {
            setShowCircleReveal(false);
            const scrollRoot = document.getElementById('scroll-root');
            if (scrollRoot && scrollRoot.style.overflow === 'hidden') {
              scrollRoot.style.overflow = 'auto';
              console.log('🔓 Scroll re-enabled (backup)');
            }
          }, 2000);
        });
      },
      markers: false,
    });

    // ScrollTrigger để ẩn canvas khi scroll back lên hero với circular collapse
    const revealSection = document.querySelector('#sec-reveal');
    const hideTrigger = revealSection ? ScrollTrigger.create({
      trigger: revealSection,
      start: "top center",
      end: "top top",
      onLeaveBack: () => {
        console.log('🔙 onLeaveBack triggered, isActivated:', isActivatedRef.current, 'hasCollapsed:', hasCollapsedRef.current);

        // Prevent re-triggering
        if (hasCollapsedRef.current || !isActivatedRef.current) return;
        hasCollapsedRef.current = true;

        console.log('🔵 Starting circular collapse animation');

        // DISABLE SCROLL để ngăn người dùng scroll trong lúc animation
        const scrollRoot = document.getElementById('scroll-root');
        if (scrollRoot) {
          scrollRoot.style.overflow = 'hidden';
          console.log('🔒 Scroll disabled');
        }

        // ẨN CANVAS NGAY LẬP TỨC để tránh nhấp nháy
        if (canvasWrapRef.current) {
          canvasWrapRef.current.style.opacity = '0';
          console.log('⚡ Canvas hidden immediately');
        }

        // Khi scroll back lên hero → Trigger circular collapse
        setShowCircleCollapse(true);

        requestAnimationFrame(() => {
          if (!circleCollapseRef.current) return;

          const circle = circleCollapseRef.current;

          // Circular collapse animation - Bắt đầu từ full screen thu về
          const tl = gsap.timeline({
            onComplete: () => {
              console.log('✅ Circular collapse complete');
              setShowCircleCollapse(false);
              isActivatedRef.current = false;

              // RE-ENABLE SCROLL sau khi animation xong
              const scrollRoot = document.getElementById('scroll-root');
              if (scrollRoot) {
                scrollRoot.style.overflow = 'auto';
                console.log('🔓 Scroll re-enabled');
              }
            }
          });

          // Step 1: Circle xuất hiện từ màn hình đầy (che hết canvas)
          tl.fromTo(
            circle,
            { scale: 50, opacity: 1 }, // Bắt đầu từ full screen, VISIBLE
            { scale: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" }
          )
          // Step 2: Circle thu nhỏ và biến mất
          .to(circle, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
          });

          console.log('🌑 Canvas fade animation scheduled');
        });
      },
      markers: false,
    }) : null;

    // ScrollTrigger để ẩn text section-living khi scroll xuống
    const livingTextSection = document.querySelector('#sec-living');
    const livingTextTrigger = livingTextSection ? ScrollTrigger.create({
      trigger: livingTextSection,
      start: "top top",
      end: "bottom top",
      onLeave: () => {
        // Scroll xuống khỏi section living → ẩn text ngay
        if (livingTextRef.current) {
          gsap.to(livingTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        // Scroll back vào section living → hiện text lại
        if (livingTextRef.current) {
          gsap.to(livingTextRef.current, { opacity: 1, duration: 0.3 });
        }
      },
      markers: false,
    }) : null;

    return () => {
      activateTrigger.kill();
      hideTrigger?.kill();
      livingTextTrigger?.kill();
    };
  }, []);

  return (
    <section
      id="tour"
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"
    >
      {/* Circular Reveal Overlay - When scrolling down */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: showCircleReveal ? 'flex' : 'none' }}
      >
        {/* Circle that expands */}
        <div
          ref={circleRef}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600"
          style={{
            boxShadow: '0 0 100px rgba(16, 185, 129, 0.5), 0 0 200px rgba(59, 130, 246, 0.3)',
            willChange: 'transform, opacity',
            opacity: 0,
            transform: 'scale(0)',
          }}
        />
      </div>

      {/* Circular Collapse Overlay - When scrolling back */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: showCircleCollapse ? 'flex' : 'none' }}
      >
        {/* Circle that collapses - Dùng gradient giống hero banner */}
        <div
          ref={circleCollapseRef}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'linear-gradient(to bottom right, rgb(15 23 42), rgb(6 78 59), rgb(15 23 42))',
            boxShadow: '0 0 100px rgba(16, 185, 129, 0.3), 0 0 200px rgba(59, 130, 246, 0.2)',
            willChange: 'transform, opacity',
            opacity: 1, // Bắt đầu với opacity 1
            transform: 'scale(50)', // Bắt đầu từ full screen
          }}
        />
      </div>


      {/* Canvas 3D fixed background - Hiển thị sau circular reveal */}
      <div
        ref={canvasWrapRef}
        id="canvas-wrap"
        className="fixed inset-0 z-10 pointer-events-none"
      >
        {/* Chỉ render ScrollStage khi đã activated */}
        {isActivated && <ScrollStage />}
        {/* Layer gradient để chữ dễ đọc */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Scrollable content */}
      <main
        id="scroll-root"
        className="relative h-screen overflow-y-scroll snap-y snap-mandatory z-10"
      >
        {/* Section 0: Circular Reveal - Snap section để activate 3D */}
        <section
          id="sec-reveal"
          className="relative h-screen snap-start snap-always grid place-items-center px-6"
        >
          {/* Empty section - chỉ để trigger circular reveal */}
          {!isActivated && (
            <div className="max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white/50 text-sm"
              >
                Scroll xuống để bắt đầu
              </motion.div>
            </div>
          )}
        </section>

        {/* Section 1: Phòng khách */}
        <section
          id="sec-living"
          className="relative h-screen snap-start snap-always grid place-items-center px-6"
        >
          <div ref={livingTextRef} className="max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              className="text-4xl md:text-6xl font-semibold text-white"
            >
              Tiện ích mỗi ngày,
              <br />
              <span className="text-emerald-300">trong từng căn phòng</span>
            </motion.h1>
            <p className="mt-4 text-white/80">
              Cuộn xuống để khám phá căn hộ Ecomate – nơi mỗi góc nhỏ đều có
              giải pháp thông minh.
            </p>
          </div>
        </section>

        {/* Section 2: Nhà bếp */}
        <section
          id="sec-kitchen"
          className="relative h-screen snap-start snap-always grid place-items-center px-6"
        >
          <div className="max-w-xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              className="text-3xl md:text-4xl font-semibold text-white"
            >
              Nhà bếp – gọn gàng & hiệu quả
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-white/80"
            >
              Móc dán chịu lực, kệ úp chén, bàn chải rửa cốc… mọi thứ đều trong
              tầm tay.
            </motion.p>
          </div>
        </section>

        {/* Section 3: Phòng tắm */}
        <section
          id="sec-bath"
          className="relative h-screen snap-start snap-always grid place-items-center px-6"
        >
          <div className="max-w-xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              className="text-3xl md:text-4xl font-semibold text-white"
            >
              Phòng tắm – sạch sẽ tiện lợi
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-white/80"
            >
              Giải pháp dán không khoan tường, khô nhanh, bền bỉ – an tâm sử
              dụng mỗi ngày.
            </motion.p>
          </div>
        </section>

        {/* Section 4: Phòng ngủ */}
        <section
          id="sec-bed"
          className="relative h-screen snap-start snap-always grid place-items-center px-6"
        >
          <div className="max-w-xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              className="text-3xl md:text-4xl font-semibold text-white"
            >
              Phòng ngủ – yên tĩnh & ngăn nắp
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-white/80"
            >
              Hộp chứa đồ, kệ mini, đèn ngủ… giúp không gian luôn gọn gàng.
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4, once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700 transition-colors"
              href="https://shopee.vn/ecomate"
              target="_blank"
              rel="noopener noreferrer"
            >
              Khám phá trên Shopee
            </motion.a>
          </div>
        </section>
      </main>
    </section>
  );
}
