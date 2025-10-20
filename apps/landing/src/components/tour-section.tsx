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
  const circleExitRef = useRef<HTMLDivElement>(null);
  const circleReentryRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const livingTextRef = useRef<HTMLDivElement>(null);
  const kitchenTextRef = useRef<HTMLDivElement>(null);
  const bathTextRef = useRef<HTMLDivElement>(null);
  const bedTextRef = useRef<HTMLDivElement>(null);
  const hasCollapsedRef = useRef(false);
  const isActivatedRef = useRef(false);

  const [isActivated, setIsActivated] = useState(false);
  const [showCircleReveal, setShowCircleReveal] = useState(false);
  const [showCircleCollapse, setShowCircleCollapse] = useState(false);
  const [showCircleExit, setShowCircleExit] = useState(false);
  const [showCircleReentry, setShowCircleReentry] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    // GSAP ScrollTrigger để kích hoạt circular reveal với snap behavior
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

        // AUTO-SCROLL xuống tour section (snap behavior)
        const tourSection = document.getElementById('tour');
        if (tourSection) {
          window.scrollTo({
            top: tourSection.offsetTop,
            behavior: 'smooth'
          });
          console.log('📜 Snapping to tour section');
        }

        // Đợi snap animation xong rồi activate 3D
        setTimeout(() => {
          const scrollRoot = document.getElementById('scroll-root');
          if (scrollRoot) {
            // Scroll tới sec-reveal bên trong tour section
            const revealSection = document.getElementById('sec-reveal');
            if (revealSection) {
              scrollRoot.scrollTo({
                top: revealSection.offsetTop,
                behavior: 'smooth'
              });
            }
          }
        }, 600);

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
              document.body.style.overflow = 'auto';
              console.log('🔓 Scroll re-enabled after reveal');
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
            if (document.body.style.overflow === 'hidden') {
              document.body.style.overflow = 'auto';
              console.log('🔓 Scroll re-enabled (backup)');
            }
          }, 2000);
        });
      },
      markers: false,
    });

    // ScrollTrigger để snap về hero khi scroll back
    const heroSnapTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      onLeaveBack: () => {
        console.log('⬆️ Scrolling back past 50%, snapping to hero');

        // Snap về đầu trang (hero banner)
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
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
        document.body.style.overflow = 'hidden';
        console.log('🔒 Scroll disabled');

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
              document.body.style.overflow = 'auto';
              console.log('🔓 Scroll re-enabled');
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

    // ScrollTrigger để điều khiển hiển thị text của từng section
    const livingTextSection = document.querySelector('#sec-living');
    const livingTextTrigger = livingTextSection ? ScrollTrigger.create({
      trigger: livingTextSection,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (livingTextRef.current) {
          gsap.to(livingTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeave: () => {
        if (livingTextRef.current) {
          gsap.to(livingTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        if (livingTextRef.current) {
          gsap.to(livingTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeaveBack: () => {
        if (livingTextRef.current) {
          gsap.to(livingTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      markers: false,
    }) : null;

    const kitchenTextSection = document.querySelector('#sec-kitchen');
    const kitchenTextTrigger = kitchenTextSection ? ScrollTrigger.create({
      trigger: kitchenTextSection,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (kitchenTextRef.current) {
          gsap.to(kitchenTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeave: () => {
        if (kitchenTextRef.current) {
          gsap.to(kitchenTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        if (kitchenTextRef.current) {
          gsap.to(kitchenTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeaveBack: () => {
        if (kitchenTextRef.current) {
          gsap.to(kitchenTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      markers: false,
    }) : null;

    const bathTextSection = document.querySelector('#sec-bath');
    const bathTextTrigger = bathTextSection ? ScrollTrigger.create({
      trigger: bathTextSection,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (bathTextRef.current) {
          gsap.to(bathTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeave: () => {
        if (bathTextRef.current) {
          gsap.to(bathTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        if (bathTextRef.current) {
          gsap.to(bathTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeaveBack: () => {
        if (bathTextRef.current) {
          gsap.to(bathTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      markers: false,
    }) : null;

    const bedTextSection = document.querySelector('#sec-bed');
    const bedTextTrigger = bedTextSection ? ScrollTrigger.create({
      trigger: bedTextSection,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        if (bedTextRef.current) {
          gsap.to(bedTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeave: () => {
        if (bedTextRef.current) {
          gsap.to(bedTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      onEnterBack: () => {
        if (bedTextRef.current) {
          gsap.to(bedTextRef.current, { opacity: 1, duration: 0.4 });
        }
      },
      onLeaveBack: () => {
        if (bedTextRef.current) {
          gsap.to(bedTextRef.current, { opacity: 0, duration: 0.3 });
        }
      },
      markers: false,
    }) : null;

    // ScrollTrigger để ẩn canvas và circular exit khi qua section cuối
    const bedSection = document.querySelector('#sec-bed');
    const ensureScrollEnabled = bedSection ? ScrollTrigger.create({
      trigger: bedSection,
      start: "bottom bottom",
      onLeave: () => {
        // Đảm bảo scroll enabled khi rời section cuối
        document.body.style.overflow = 'auto';
        console.log('✅ Passed last section, triggering circular exit');

        // CIRCULAR EXIT ANIMATION
        setShowCircleExit(true);

        requestAnimationFrame(() => {
          if (!circleExitRef.current) return;

          const circle = circleExitRef.current;

          // ẨN CANVAS ngay lập tức
          if (canvasWrapRef.current) {
            canvasWrapRef.current.style.opacity = '0';
          }

          // Circular exit: Circle xuất hiện từ center → expand full screen
          gsap.timeline({
            onComplete: () => {
              console.log('🌑 Circular exit complete');
              setShowCircleExit(false);
            }
          })
          .fromTo(circle,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
          )
          .to(circle, {
            scale: 50,
            opacity: 0,
            duration: 1.0,
            ease: "power2.inOut"
          });
        });
      },
      onEnterBack: () => {
        // Hiện lại canvas khi scroll back vào tour với circular re-entry
        console.log('⬆️ Scrolling back into tour, triggering circular re-entry');

        // CIRCULAR RE-ENTRY ANIMATION
        setShowCircleReentry(true);

        requestAnimationFrame(() => {
          if (!circleReentryRef.current) return;

          const circle = circleReentryRef.current;

          // Circular re-entry: Circle xuất hiện full screen → shrink → disappear
          gsap.timeline({
            onComplete: () => {
              console.log('✨ Circular re-entry complete');
              setShowCircleReentry(false);
            }
          })
          .fromTo(circle,
            { scale: 50, opacity: 1 }, // Bắt đầu từ full screen
            { scale: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" }
          )
          .to(circle, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
          });

          // Hiện canvas đồng thời
          if (canvasWrapRef.current && isActivatedRef.current) {
            gsap.to(canvasWrapRef.current, {
              opacity: 1,
              duration: 0.8,
              onComplete: () => {
                console.log('🌟 Canvas shown back');
              }
            });
          }
        });
      },
      markers: false,
    }) : null;

    return () => {
      activateTrigger.kill();
      heroSnapTrigger.kill();
      hideTrigger?.kill();
      livingTextTrigger?.kill();
      kitchenTextTrigger?.kill();
      bathTextTrigger?.kill();
      bedTextTrigger?.kill();
      ensureScrollEnabled?.kill();
      // Force re-enable scroll khi unmount
      document.body.style.overflow = 'auto';
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

      {/* Circular Collapse Overlay - When scrolling back to hero */}
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

      {/* Circular Exit Overlay - When scrolling down to products */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: showCircleExit ? 'flex' : 'none' }}
      >
        {/* Circle that expands to products */}
        <div
          ref={circleExitRef}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600"
          style={{
            boxShadow: '0 0 100px rgba(59, 130, 246, 0.5), 0 0 200px rgba(147, 51, 234, 0.3)',
            willChange: 'transform, opacity',
            opacity: 0,
            transform: 'scale(0)',
          }}
        />
      </div>

      {/* Circular Re-entry Overlay - When scrolling back from products to tour */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: showCircleReentry ? 'flex' : 'none' }}
      >
        {/* Circle that shrinks back into tour */}
        <div
          ref={circleReentryRef}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
          style={{
            boxShadow: '0 0 100px rgba(147, 51, 234, 0.5), 0 0 200px rgba(59, 130, 246, 0.3)',
            willChange: 'transform, opacity',
            opacity: 1,
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

      {/* Scrollable content - No overflow, window handles scroll */}
      <div
        id="scroll-root"
        className="relative z-10"
      >
        {/* Section 0: Circular Reveal */}
        <section
          id="sec-reveal"
          className="relative min-h-screen grid place-items-center px-6"
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
          className="relative min-h-screen"
        >
          <div ref={livingTextRef} className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none" style={{ opacity: 0 }}>
            <div className="max-w-3xl text-center">
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
          </div>
        </section>

        {/* Section 2: Nhà bếp */}
        <section
          id="sec-kitchen"
          className="relative min-h-screen"
        >
          <div ref={kitchenTextRef} className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none" style={{ opacity: 0 }}>
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
          </div>
        </section>

        {/* Section 3: Phòng tắm */}
        <section
          id="sec-bath"
          className="relative min-h-screen"
        >
          <div ref={bathTextRef} className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none" style={{ opacity: 0 }}>
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
          </div>
        </section>

        {/* Section 4: Phòng ngủ */}
        <section
          id="sec-bed"
          className="relative min-h-screen"
        >
          <div ref={bedTextRef} className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none" style={{ opacity: 0 }}>
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
                className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700 transition-colors pointer-events-auto"
                href="https://shopee.vn/ecomate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Khám phá trên Shopee
              </motion.a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
