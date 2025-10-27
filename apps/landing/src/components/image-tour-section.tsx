'use client'
import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTransition } from '@/contexts/transition-context'
import { useTourStore, type TourSection } from '@/stores/tour-store'
import Image, { type StaticImageData } from 'next/image'

// Static imports for Next.js optimization
import livingRoomImg from '@/../public/images/snapshot-banner/living-room.png'
import kitchenRoomImg from '@/../public/images/snapshot-banner/kitchen-room.png'
import bathRoomImg from '@/../public/images/snapshot-banner/bath-room.png'
import bedRoomImg from '@/../public/images/snapshot-banner/bed-room.png'

gsap.registerPlugin(ScrollTrigger)

// Image tour section types (without 'none')
type ImageTourSectionType = 'living' | 'kitchen' | 'bath' | 'bed'

// Mapping section names to static images for Next.js optimization
const SECTION_IMAGES: Record<ImageTourSectionType, StaticImageData> = {
    living: livingRoomImg,
    kitchen: kitchenRoomImg,
    bath: bathRoomImg,
    bed: bedRoomImg,
}

export default function ImageTourSection() {
    const { setIsTransitioning } = useTransition()
    const sectionRef = useRef<HTMLDivElement>(null)
    const circleRef = useRef<HTMLDivElement>(null)
    const circleCollapseRef = useRef<HTMLDivElement>(null)
    const circleExitRef = useRef<HTMLDivElement>(null)
    const circleReentryRef = useRef<HTMLDivElement>(null)
    const imageWrapRef = useRef<HTMLDivElement>(null)
    const livingTextRef = useRef<HTMLDivElement>(null)
    const kitchenTextRef = useRef<HTMLDivElement>(null)
    const bathTextRef = useRef<HTMLDivElement>(null)
    const bedTextRef = useRef<HTMLDivElement>(null)

    // Image refs for each section
    const livingImageRef = useRef<HTMLDivElement>(null)
    const kitchenImageRef = useRef<HTMLDivElement>(null)
    const bathImageRef = useRef<HTMLDivElement>(null)
    const bedImageRef = useRef<HTMLDivElement>(null)

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
    } = useTourStore()

    // Helper function để ẩn tất cả text sections
    const hideAllTexts = useCallback(() => {
        ;[livingTextRef, kitchenTextRef, bathTextRef, bedTextRef].forEach(ref => {
            if (ref.current) {
                gsap.killTweensOf(ref.current)
                gsap.to(ref.current, { opacity: 0, duration: 0.2 })
            }
        })
    }, [])

    // Helper function để ẩn tất cả images - GPU optimized
    const hideAllImages = useCallback(() => {
        ;[livingImageRef, kitchenImageRef, bathImageRef, bedImageRef].forEach(ref => {
            if (ref.current) {
                gsap.killTweensOf(ref.current)
                gsap.to(ref.current, {
                    opacity: 0,
                    scale: 1.05,
                    duration: 0.25,
                    force3D: true,
                })
            }
        })
    }, [])

    // Helper function để hiển thị text section cụ thể
    const showText = useCallback((section: TourSection) => {
        // Ẩn tất cả trước
        ;[livingTextRef, kitchenTextRef, bathTextRef, bedTextRef].forEach(ref => {
            if (ref.current) {
                gsap.killTweensOf(ref.current)
                gsap.to(ref.current, { opacity: 0, duration: 0.2 })
            }
        })

        // Skip if section is 'none'
        if (section === 'none') return

        // Hiển thị section cụ thể
        let ref
        switch (section as ImageTourSectionType) {
            case 'living':
                ref = livingTextRef
                break
            case 'kitchen':
                ref = kitchenTextRef
                break
            case 'bath':
                ref = bathTextRef
                break
            case 'bed':
                ref = bedTextRef
                break
        }

        if (ref.current) {
            gsap.killTweensOf(ref.current)
            gsap.to(ref.current, { opacity: 1, duration: 0.4 })
        }
    }, [])

    // Helper function để hiển thị image section cụ thể
    const showImage = useCallback((section: TourSection) => {
        // Ẩn tất cả trước
        hideAllImages()

        // Skip if section is 'none'
        if (section === 'none') return

        // Hiển thị image cụ thể với zoom effect
        let ref
        switch (section as ImageTourSectionType) {
            case 'living':
                ref = livingImageRef
                break
            case 'kitchen':
                ref = kitchenImageRef
                break
            case 'bath':
                ref = bathImageRef
                break
            case 'bed':
                ref = bedImageRef
                break
        }

        if (ref.current) {
            gsap.killTweensOf(ref.current)
            gsap.fromTo(
                ref.current,
                { opacity: 0, scale: 1.08 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    force3D: true,
                    immediateRender: false,
                },
            )
        }
    }, [hideAllImages])

    // Effect để đảm bảo text và image luôn ẩn khi không trong tour section
    useEffect(() => {
        if (!isActivated || currentSection === 'none') {
            hideAllTexts()
            hideAllImages()
        }
    }, [isActivated, currentSection, hideAllTexts, hideAllImages])

    // Effect để cleanup khi unmount hoặc page navigation
    useEffect(() => {
        return () => {
            // Force hide all texts on unmount
            ;[livingTextRef, kitchenTextRef, bathTextRef, bedTextRef].forEach(ref => {
                if (ref.current) {
                    gsap.killTweensOf(ref.current)
                    ref.current.style.opacity = '0'
                }
            })

            // Force hide images
            ;[livingImageRef, kitchenImageRef, bathImageRef, bedImageRef].forEach(ref => {
                if (ref.current) {
                    gsap.killTweensOf(ref.current)
                    ref.current.style.opacity = '0'
                }
            })

            // Force hide image wrap
            if (imageWrapRef.current) {
                gsap.killTweensOf(imageWrapRef.current)
                imageWrapRef.current.style.opacity = '0'
            }
        }
    }, [])

    useEffect(() => {
        if (!sectionRef.current) return

        // GSAP ScrollTrigger để kích hoạt circular reveal với snap behavior
        const activateTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 50%',
            onEnter: () => {
                const currentState = useTourStore.getState()
                if (currentState.isActivated) {
                    console.log('⏭️ Already activated, skipping')
                    return
                }

                console.log('🎬 Activating image tour with circular reveal')

                // AUTO-SCROLL xuống tour section (snap behavior)
                const tourSection = document.getElementById('tour')
                if (tourSection) {
                    window.scrollTo({
                        top: tourSection.offsetTop,
                        behavior: 'smooth',
                    })
                }

                // Set circle animation và activate
                setCircleAnimation('reveal')
                activate()

                // Chờ circleRef render rồi mới animate
                requestAnimationFrame(() => {
                    if (!circleRef.current) return

                    const circle = circleRef.current

                    // Circular reveal animation - GPU optimized
                    const tl = gsap.timeline({
                        onComplete: () => {
                            console.log('✅ Circle reveal complete')
                            setCircleAnimation('none')
                            document.body.style.overflow = 'auto'

                            // Immediately show living room content
                            setCurrentSection('living')
                            showText('living')
                            showImage('living')
                        },
                    })

                    tl.fromTo(
                        circle,
                        { scale: 0, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power2.out',
                            force3D: true,
                            immediateRender: false
                        }
                    ).to(circle, {
                        scale: 50,
                        opacity: 0,
                        duration: 1.0,
                        ease: 'power2.inOut',
                        force3D: true,
                    })

                    // Fade in image wrapper - GPU optimized
                    if (imageWrapRef.current) {
                        gsap.to(imageWrapRef.current, {
                            opacity: 1,
                            duration: 0.6,
                            delay: 0.4,
                            force3D: true,
                        })
                    }
                })
            },
            markers: false,
        })

        // ScrollTrigger để snap về hero khi scroll back
        const heroSnapTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 50%',
            onLeaveBack: () => {
                console.log('⬆️ Scrolling back past 50%, snapping to hero')

                // Snap về đầu trang (hero banner)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                })
            },
            markers: false,
        })

        // ScrollTrigger để ẩn images khi scroll back lên hero với circular collapse
        const livingSection = document.querySelector('#sec-living')
        const hideTrigger = livingSection
            ? ScrollTrigger.create({
                  trigger: livingSection,
                  start: 'top center',
                  end: 'top top',
                  onLeaveBack: () => {
                      const currentState = useTourStore.getState()
                      if (!currentState.isActivated || currentState.circleAnimation !== 'none') return

                      console.log('🔵 Starting circular collapse animation')

                      // Disable scroll
                      document.body.style.overflow = 'hidden'

                      // Ẩn images và text ngay lập tức
                      if (imageWrapRef.current) {
                          imageWrapRef.current.style.opacity = '0'
                      }
                      hideAllTexts()
                      hideAllImages()
                      setCurrentSection('none')

                      // Trigger circular collapse
                      setCircleAnimation('collapse')

                      requestAnimationFrame(() => {
                          if (!circleCollapseRef.current) return

                          const circle = circleCollapseRef.current

                          const tl = gsap.timeline({
                              onComplete: () => {
                                  console.log('✅ Circular collapse complete')
                                  setCircleAnimation('none')
                                  deactivate()
                                  document.body.style.overflow = 'auto'
                              },
                          })

                          tl.fromTo(
                              circle,
                              { scale: 50, opacity: 1 },
                              {
                                  scale: 1,
                                  opacity: 1,
                                  duration: 0.6,
                                  ease: 'power2.inOut',
                                  force3D: true,
                                  immediateRender: false
                              },
                          ).to(circle, {
                              scale: 0,
                              opacity: 0,
                              duration: 0.4,
                              ease: 'power2.in',
                              force3D: true,
                          })
                      })
                  },
                  markers: false,
              })
            : null

        // ScrollTriggers cho từng section
        const sections: Array<{ id: string; section: TourSection }> = [
            { id: '#sec-living', section: 'living' },
            { id: '#sec-kitchen', section: 'kitchen' },
            { id: '#sec-bath', section: 'bath' },
            { id: '#sec-bed', section: 'bed' },
        ]

        const sectionTriggers = sections.map(({ id, section }) => {
            const element = document.querySelector(id)
            if (!element) return null

            return ScrollTrigger.create({
                trigger: element,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => {
                    setCurrentSection(section)
                    showText(section)
                    showImage(section)
                },
                onLeave: () => {
                    const currentState = useTourStore.getState()
                    if (currentState.currentSection === section) {
                        hideAllTexts()
                    }
                },
                onEnterBack: () => {
                    setCurrentSection(section)
                    showText(section)
                    showImage(section)
                },
                onLeaveBack: () => {
                    const currentState = useTourStore.getState()
                    if (currentState.currentSection === section) {
                        hideAllTexts()
                    }
                },
                markers: false,
            })
        })

        // ScrollTrigger để ẩn images và circular exit khi qua section cuối
        const bedSection = document.querySelector('#sec-bed')
        const exitTrigger = bedSection
            ? ScrollTrigger.create({
                  trigger: bedSection,
                  start: 'bottom bottom',
                  onLeave: () => {
                      console.log('✅ Passed last section, triggering circular exit')

                      // Ẩn images và text
                      if (imageWrapRef.current) {
                          imageWrapRef.current.style.opacity = '0'
                      }
                      hideAllTexts()
                      hideAllImages()
                      setShowCanvas(false)
                      setCurrentSection('none')

                      // Trigger circular exit
                      setCircleAnimation('exit')
                      setIsTransitioning(true)

                      requestAnimationFrame(() => {
                          if (!circleExitRef.current) return

                          const circle = circleExitRef.current

                          gsap.timeline({
                              onComplete: () => {
                                  console.log('🌑 Circular exit complete')
                                  setCircleAnimation('none')
                                  setIsTransitioning(false)
                              },
                          })
                              .fromTo(
                                  circle,
                                  { scale: 0, opacity: 0 },
                                  {
                                      scale: 1,
                                      opacity: 1,
                                      duration: 0.5,
                                      ease: 'power2.out',
                                      force3D: true,
                                      immediateRender: false
                                  }
                              )
                              .to(circle, {
                                  scale: 50,
                                  opacity: 0,
                                  duration: 0.8,
                                  ease: 'power2.inOut',
                                  force3D: true,
                              })
                      })
                  },
                  onEnterBack: () => {
                      console.log('⬆️ Scrolling back into tour, triggering circular re-entry')

                      // Trigger circular re-entry
                      setCircleAnimation('reentry')
                      setIsTransitioning(true)
                      setShowCanvas(true)

                      requestAnimationFrame(() => {
                          if (!circleReentryRef.current) return

                          const circle = circleReentryRef.current

                          gsap.timeline({
                              onComplete: () => {
                                  console.log('✨ Circular re-entry complete')
                                  setCircleAnimation('none')
                                  setIsTransitioning(false)
                              },
                          })
                              .fromTo(
                                  circle,
                                  { scale: 50, opacity: 1 },
                                  {
                                      scale: 1,
                                      opacity: 1,
                                      duration: 0.6,
                                      ease: 'power2.inOut',
                                      force3D: true,
                                      immediateRender: false
                                  },
                              )
                              .to(circle, {
                                  scale: 0,
                                  opacity: 0,
                                  duration: 0.4,
                                  ease: 'power2.in',
                                  force3D: true,
                              })

                          // Hiện images
                          const currentState = useTourStore.getState()
                          if (imageWrapRef.current && currentState.isActivated) {
                              gsap.to(imageWrapRef.current, {
                                  opacity: 1,
                                  duration: 0.8,
                              })
                          }
                      })
                  },
                  markers: false,
              })
            : null

        return () => {
            activateTrigger.kill()
            heroSnapTrigger.kill()
            hideTrigger?.kill()
            sectionTriggers.forEach(trigger => trigger?.kill())
            exitTrigger?.kill()

            // Force re-enable scroll khi unmount
            document.body.style.overflow = 'auto'

            // Reset store
            reset()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Chỉ chạy 1 lần khi mount/unmount

    return (
        <section
            id="tour"
            ref={sectionRef}
            className="relative min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"
        >
            {/* Circular Reveal Overlay - GPU Optimized */}
            <div
                className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
                style={{ display: circleAnimation === 'reveal' ? 'flex' : 'none' }}
            >
                <div
                    ref={circleRef}
                    className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600"
                    style={{
                        boxShadow: '0 0 60px rgba(16, 185, 129, 0.4), 0 0 120px rgba(59, 130, 246, 0.25)',
                        willChange: 'transform, opacity',
                        transform: 'scale(0) translateZ(0)',
                        opacity: 0,
                    }}
                />
            </div>

            {/* Circular Collapse Overlay - GPU Optimized */}
            <div
                className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
                style={{ display: circleAnimation === 'collapse' ? 'flex' : 'none' }}
            >
                <div
                    ref={circleCollapseRef}
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                        background: 'linear-gradient(to bottom right, rgb(15 23 42), rgb(6 78 59), rgb(15 23 42))',
                        boxShadow: '0 0 60px rgba(16, 185, 129, 0.25), 0 0 120px rgba(59, 130, 246, 0.15)',
                        willChange: 'transform, opacity',
                        transform: 'scale(50) translateZ(0)',
                        opacity: 1,
                    }}
                />
            </div>

            {/* Circular Exit Overlay - GPU Optimized */}
            <div
                className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
                style={{ display: circleAnimation === 'exit' ? 'flex' : 'none' }}
            >
                <div
                    ref={circleExitRef}
                    className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600"
                    style={{
                        boxShadow: '0 0 60px rgba(59, 130, 246, 0.4), 0 0 120px rgba(147, 51, 234, 0.25)',
                        willChange: 'transform, opacity',
                        transform: 'scale(0) translateZ(0)',
                        opacity: 0,
                    }}
                />
            </div>

            {/* Circular Re-entry Overlay - GPU Optimized */}
            <div
                className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
                style={{ display: circleAnimation === 'reentry' ? 'flex' : 'none' }}
            >
                <div
                    ref={circleReentryRef}
                    className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600"
                    style={{
                        boxShadow: '0 0 60px rgba(147, 51, 234, 0.4), 0 0 120px rgba(59, 130, 246, 0.25)',
                        willChange: 'transform, opacity',
                        transform: 'scale(50) translateZ(0)',
                        opacity: 1,
                    }}
                />
            </div>

            {/* Image Background - Fixed */}
            <div
                ref={imageWrapRef}
                id="image-wrap"
                className="fixed inset-0 z-10"
                style={{
                    pointerEvents: 'none',
                    opacity: 0,
                    display: showCanvas ? 'block' : 'none',
                }}
            >
                {/* Living Room Image - Priority with eager loading */}
                <div
                    ref={livingImageRef}
                    className="absolute inset-0"
                    style={{ opacity: 0, transform: 'scale(1.05) translateZ(0)', willChange: 'opacity, transform' }}
                >
                    <Image
                        src={SECTION_IMAGES.living}
                        alt="Phòng khách Ecomate - Giải pháp tiện ích thông minh"
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                        sizes="100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Kitchen Image - Lazy loading */}
                <div
                    ref={kitchenImageRef}
                    className="absolute inset-0"
                    style={{ opacity: 0, transform: 'scale(1.05) translateZ(0)', willChange: 'opacity, transform' }}
                >
                    <Image
                        src={SECTION_IMAGES.kitchen}
                        alt="Nhà bếp Ecomate - Gọn gàng hiệu quả"
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={90}
                        sizes="100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Bath Image - Lazy loading */}
                <div
                    ref={bathImageRef}
                    className="absolute inset-0"
                    style={{ opacity: 0, transform: 'scale(1.05) translateZ(0)', willChange: 'opacity, transform' }}
                >
                    <Image
                        src={SECTION_IMAGES.bath}
                        alt="Phòng tắm Ecomate - Sạch sẽ tiện lợi"
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={90}
                        sizes="100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Bed Image - Lazy loading */}
                <div
                    ref={bedImageRef}
                    className="absolute inset-0"
                    style={{ opacity: 0, transform: 'scale(1.05) translateZ(0)', willChange: 'opacity, transform' }}
                >
                    <Image
                        src={SECTION_IMAGES.bed}
                        alt="Phòng ngủ Ecomate - Yên tĩnh ngăn nắp"
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={90}
                        sizes="100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Gradient overlay */}
                <div
                    style={{ pointerEvents: 'none' }}
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                />
            </div>

            {/* Scrollable content - with CSS scroll-snap */}
            <div id="scroll-root" className="relative z-10" style={{ scrollSnapType: 'y proximity' }}>
                {/* Section 1: Phòng khách (merged with reveal) */}
                <section id="sec-living" className="relative min-h-[80vh]" style={{ scrollSnapAlign: 'start' }}>
                    {/* Show "Scroll xuống" hint when not activated */}
                    {!isActivated && (
                        <div className="absolute inset-0 grid place-items-center px-6 z-20">
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
                        </div>
                    )}

                    {/* Living room content - fixed overlay */}
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
                                Cuộn xuống để khám phá căn hộ Ecomate – nơi mỗi góc nhỏ đều có giải pháp thông minh.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Nhà bếp */}
                <section id="sec-kitchen" className="relative min-h-[80vh]" style={{ scrollSnapAlign: 'start' }}>
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
                                Móc dán chịu lực, kệ úp chén, bàn chải rửa cốc… mọi thứ đều trong tầm tay.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Phòng tắm */}
                <section id="sec-bath" className="relative min-h-[80vh]" style={{ scrollSnapAlign: 'start' }}>
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
                                Giải pháp dán không khoan tường, khô nhanh, bền bỉ – an tâm sử dụng mỗi ngày.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Section 4: Phòng ngủ */}
                <section id="sec-bed" className="relative min-h-[80vh]" style={{ scrollSnapAlign: 'start' }}>
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
    )
}
