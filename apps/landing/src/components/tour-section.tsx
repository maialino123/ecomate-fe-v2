"use client";
import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useTransition } from "@/contexts/transition-context";
import { useTourStore, type TourSection } from "@/stores/tour-store";
import { useShouldRender3D } from "@/hooks/use-media-query";
import ImageTourSection from "@/components/image-tour-section";

const ScrollStage = dynamic(() => import("@/components/scroll-stage"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

function TourSection3D() {
  const { setIsTransitioning } = useTransition();
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

  // Zustand store
  const {
    isActivated,
    currentSection,
    circleAnimation,
    showCanvas,
    activate,
    deactivate,
    setCurrentSection,
    setCircleAnimation,
    setShowCanvas,
    reset,
  } = useTourStore();

  // Helper function để ẩn tất cả text sections
  const hideAllTexts = useCallback(() => {
    [livingTextRef, kitchenTextRef, bathTextRef, bedTextRef].forEach(ref => {
      if (ref.current) {
        gsap.killTweensOf(ref.current); // Kill any ongoing animations
        gsap.to(ref.current, { opacity: 0, duration: 0.2 });
      }
    });
  }, []);

  // Helper function để hiển thị text section cụ thể
  const showText = useCallback((section: TourSection) => {
    // Ẩn tất cả trước
    [livingTextRef, kitchenTextRef, bathTextRef, bedTextRef].forEach(ref => {
      if (ref.current) {
        gsap.killTweensOf(ref.current);
        gsap.to(ref.current, { opacity: 0, duration: 0.2 });
      }
    });

    // Hiển thị section cụ thể
    let ref;
    switch (section) {
      case 'living': ref = livingTextRef; break;
      case 'kitchen': ref = kitchenTextRef; break;
      case 'bath': ref = bathTextRef; break;
      case 'bed': ref = bedTextRef; break;
      default: return;
    }

    if (ref.current) {
      gsap.killTweensOf(ref.current); // Kill any ongoing animations
      gsap.to(ref.current, { opacity: 1, duration: 0.4 });
    }
  }, []);

  // Effect để đảm bảo text luôn ẩn khi không trong tour section
  useEffect(() => {
    if (!isActivated || currentSection === 'none') {
      hideAllTexts();
    }
  }, [isActivated, currentSection, hideAllTexts]);

  // Effect để cleanup khi unmount hoặc page navigation
  useEffect(() => {
    return () => {
      // Force hide all texts on unmount
      [livingTextRef, kitchenTextRef, bathTextRef, bedTextRef].forEach(ref => {
        if (ref.current) {
          gsap.killTweensOf(ref.current);
          ref.current.style.opacity = '0';
        }
      });

      // Force hide canvas
      if (canvasWrapRef.current) {
        gsap.killTweensOf(canvasWrapRef.current);
        canvasWrapRef.current.style.opacity = '0';
      }
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    // GSAP ScrollTrigger để kích hoạt circular reveal với snap behavior
    const activateTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      onEnter: () => {
        // Đọc state trực tiếp từ store thay vì closure
        const currentState = useTourStore.getState();
        if (currentState.isActivated) {
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
        }

        // Set circle animation và activate
        setCircleAnimation('reveal');
        activate();

        // Chờ circleRef render rồi mới animate
        requestAnimationFrame(() => {
          if (!circleRef.current) return;

          const circle = circleRef.current;

          // Circular reveal animation
          const tl = gsap.timeline({
            onComplete: () => {
              console.log("✅ Circle reveal complete");
              setCircleAnimation('none');
              document.body.style.overflow = 'auto';
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

          // Fade in canvas
          if (canvasWrapRef.current) {
            gsap.to(canvasWrapRef.current, {
              opacity: 1,
              duration: 0.8,
              delay: 0.6,
            });
          }
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
        // Đọc state từ store để avoid stale closure
        const currentState = useTourStore.getState();
        if (!currentState.isActivated || currentState.circleAnimation !== 'none') return;

        console.log('🔵 Starting circular collapse animation');

        // Disable scroll
        document.body.style.overflow = 'hidden';

        // Ẩn canvas và text ngay lập tức
        if (canvasWrapRef.current) {
          canvasWrapRef.current.style.opacity = '0';
        }
        hideAllTexts();
        setCurrentSection('none');

        // Trigger circular collapse
        setCircleAnimation('collapse');

        requestAnimationFrame(() => {
          if (!circleCollapseRef.current) return;

          const circle = circleCollapseRef.current;

          const tl = gsap.timeline({
            onComplete: () => {
              console.log('✅ Circular collapse complete');
              setCircleAnimation('none');
              deactivate();
              document.body.style.overflow = 'auto';
            }
          });

          tl.fromTo(
            circle,
            { scale: 50, opacity: 1 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" }
          ).to(circle, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
          });
        });
      },
      markers: false,
    }) : null;

    // ScrollTriggers cho từng text section
    const sections: Array<{ id: string; section: TourSection }> = [
      { id: '#sec-living', section: 'living' },
      { id: '#sec-kitchen', section: 'kitchen' },
      { id: '#sec-bath', section: 'bath' },
      { id: '#sec-bed', section: 'bed' },
    ];

    const sectionTriggers = sections.map(({ id, section }) => {
      const element = document.querySelector(id);
      if (!element) return null;

      return ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setCurrentSection(section);
          showText(section);
        },
        onLeave: () => {
          const currentState = useTourStore.getState();
          if (currentState.currentSection === section) {
            hideAllTexts();
          }
        },
        onEnterBack: () => {
          setCurrentSection(section);
          showText(section);
        },
        onLeaveBack: () => {
          const currentState = useTourStore.getState();
          if (currentState.currentSection === section) {
            hideAllTexts();
          }
        },
        markers: false,
      });
    });

    // ScrollTrigger để ẩn canvas và circular exit khi qua section cuối
    const bedSection = document.querySelector('#sec-bed');
    const exitTrigger = bedSection ? ScrollTrigger.create({
      trigger: bedSection,
      start: "bottom bottom",
      onLeave: () => {
        console.log('✅ Passed last section, triggering circular exit');

        // Ẩn canvas và text
        if (canvasWrapRef.current) {
          canvasWrapRef.current.style.opacity = '0';
        }
        hideAllTexts();
        setShowCanvas(false);
        setCurrentSection('none');

        // Trigger circular exit
        setCircleAnimation('exit');
        setIsTransitioning(true);

        requestAnimationFrame(() => {
          if (!circleExitRef.current) return;

          const circle = circleExitRef.current;

          gsap.timeline({
            onComplete: () => {
              console.log('🌑 Circular exit complete');
              setCircleAnimation('none');
              setIsTransitioning(false);
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
        console.log('⬆️ Scrolling back into tour, triggering circular re-entry');

        // Trigger circular re-entry
        setCircleAnimation('reentry');
        setIsTransitioning(true);
        setShowCanvas(true);

        requestAnimationFrame(() => {
          if (!circleReentryRef.current) return;

          const circle = circleReentryRef.current;

          gsap.timeline({
            onComplete: () => {
              console.log('✨ Circular re-entry complete');
              setCircleAnimation('none');
              setIsTransitioning(false);
            }
          })
          .fromTo(circle,
            { scale: 50, opacity: 1 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" }
          )
          .to(circle, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in"
          });

          // Hiện canvas
          const currentState = useTourStore.getState();
          if (canvasWrapRef.current && currentState.isActivated) {
            gsap.to(canvasWrapRef.current, {
              opacity: 1,
              duration: 0.8,
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
      sectionTriggers.forEach(trigger => trigger?.kill());
      exitTrigger?.kill();

      // Force re-enable scroll khi unmount
      document.body.style.overflow = 'auto';

      // Reset store
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount/unmount. Dependencies được đọc trực tiếp từ store trong callbacks

  return (
    <section
      id="tour"
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"
    >
      {/* Circular Reveal Overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: circleAnimation === 'reveal' ? 'flex' : 'none' }}
      >
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

      {/* Circular Collapse Overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: circleAnimation === 'collapse' ? 'flex' : 'none' }}
      >
        <div
          ref={circleCollapseRef}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'linear-gradient(to bottom right, rgb(15 23 42), rgb(6 78 59), rgb(15 23 42))',
            boxShadow: '0 0 100px rgba(16, 185, 129, 0.3), 0 0 200px rgba(59, 130, 246, 0.2)',
            willChange: 'transform, opacity',
            opacity: 1,
            transform: 'scale(50)',
          }}
        />
      </div>

      {/* Circular Exit Overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: circleAnimation === 'exit' ? 'flex' : 'none' }}
      >
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

      {/* Circular Re-entry Overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
        style={{ display: circleAnimation === 'reentry' ? 'flex' : 'none' }}
      >
        <div
          ref={circleReentryRef}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
          style={{
            boxShadow: '0 0 100px rgba(147, 51, 234, 0.5), 0 0 200px rgba(59, 130, 246, 0.3)',
            willChange: 'transform, opacity',
            opacity: 1,
            transform: 'scale(50)',
          }}
        />
      </div>

      {/* Canvas 3D fixed background */}
      <div
        ref={canvasWrapRef}
        id="canvas-wrap"
        className="fixed inset-0 z-10"
        style={{
          pointerEvents: 'none',
          opacity: 0,
          display: showCanvas ? 'block' : 'none',
        }}
      >
        {isActivated && <ScrollStage />}
        <div style={{ pointerEvents: 'none' }} className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Scrollable content */}
      <div id="scroll-root" className="relative z-10">
        {/* Section 0: Circular Reveal */}
        <section
          id="sec-reveal"
          className="relative min-h-screen grid place-items-center px-6"
        >
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
        <section id="sec-living" className="relative min-h-screen">
          <div
            ref={livingTextRef}
            className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none"
            style={{ opacity: 0 }}
          >
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
        <section id="sec-kitchen" className="relative min-h-screen">
          <div
            ref={kitchenTextRef}
            className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none"
            style={{ opacity: 0 }}
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
          </div>
        </section>

        {/* Section 3: Phòng tắm */}
        <section id="sec-bath" className="relative min-h-screen">
          <div
            ref={bathTextRef}
            className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none"
            style={{ opacity: 0 }}
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
          </div>
        </section>

        {/* Section 4: Phòng ngủ */}
        <section id="sec-bed" className="relative min-h-screen">
          <div
            ref={bedTextRef}
            className="fixed inset-0 z-20 grid place-items-center px-6 pointer-events-none"
            style={{ opacity: 0 }}
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

// Main export component with conditional rendering
export default function TourSection() {
  const shouldRender3D = useShouldRender3D();

  // Conditionally render 3D or Image version based on screen size
  // Large Desktop (>1920px): render 3D model
  // Mobile/Tablet/Laptop (<=1920px): render image-based tour
  if (!shouldRender3D) {
    return <ImageTourSection />;
  }

  return <TourSection3D />;
}
