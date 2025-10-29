'use client'
import { useEffect, useRef, useCallback, useMemo, memo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTransition } from '@/contexts/transition-context'
import { useTourStore, type TourSection } from '@/stores/tour-store'
import Image, { type StaticImageData } from 'next/image'
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities'
import SideGlowDecorator from '@/components/decorators/side-glow'

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

function ImageTourSectionComponent() {
    const { setIsTransitioning } = useTransition()
    const sectionRef = useRef<HTMLDivElement>(null)

    // Detect device capabilities for adaptive performance
    const { isLowEndDevice, prefersReducedMotion, isMobile } = useDeviceCapabilities()

    // Adaptive animation durations based on device capabilities
    const animConfig = useMemo(() => {
        const shouldSimplify = isLowEndDevice || prefersReducedMotion

        return {
            // Shorter durations for low-end devices
            baseDuration: shouldSimplify ? 0.2 : 0.4,
            revealDuration: shouldSimplify ? 0.4 : 0.6,
            textStagger: shouldSimplify ? 0.05 : 0.1,
            // Disable scale on low-end to reduce GPU load
            useScale: !shouldSimplify,
            // Simpler easing
            ease: shouldSimplify ? 'power1.out' : 'power2.out',
        }
    }, [isLowEndDevice, prefersReducedMotion])
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

    // Text content element refs for GSAP animations
    const scrollHintRef = useRef<HTMLDivElement>(null)
    const livingTitleRef = useRef<HTMLHeadingElement>(null)
    const livingDescRef = useRef<HTMLParagraphElement>(null)
    const kitchenTitleRef = useRef<HTMLHeadingElement>(null)
    const kitchenDescRef = useRef<HTMLParagraphElement>(null)
    const bathTitleRef = useRef<HTMLHeadingElement>(null)
    const bathDescRef = useRef<HTMLParagraphElement>(null)
    const bedTitleRef = useRef<HTMLHeadingElement>(null)
    const bedDescRef = useRef<HTMLParagraphElement>(null)
    const ctaButtonRef = useRef<HTMLAnchorElement>(null)

    // Memoize ref arrays to avoid recreation
    const textRefs = useMemo(() => [livingTextRef, kitchenTextRef, bathTextRef, bedTextRef], [])
    const imageRefs = useMemo(() => [livingImageRef, kitchenImageRef, bathImageRef, bedImageRef], [])

    // Refs to hold latest callback versions for ScrollTrigger
    // This prevents stale closures when animConfig updates after device detection
    const showTextRef = useRef<(section: TourSection) => void>(() => {})
    const showImageRef = useRef<(section: TourSection) => void>(() => {})
    const hideAllTextsRef = useRef<() => void>(() => {})
    const hideAllImagesRef = useRef<() => void>(() => {})

    // Zustand store - Using selectors to prevent unnecessary re-renders
    const isActivated = useTourStore(state => state.isActivated)
    const currentSection = useTourStore(state => state.currentSection)
    const circleAnimation = useTourStore(state => state.circleAnimation)
    const showCanvas = useTourStore(state => state.showCanvas)
    const activate = useTourStore(state => state.activate)
    const deactivate = useTourStore(state => state.deactivate)
    const setCurrentSection = useTourStore(state => state.setCurrentSection)
    const setCircleAnimation = useTourStore(state => state.setCircleAnimation)
    const setShowCanvas = useTourStore(state => state.setShowCanvas)
    const reset = useTourStore(state => state.reset)

    // Batch helper functions - GPU optimized with single gsap.set call
    const hideAllTexts = useCallback(() => {
        const validRefs = textRefs.map(ref => ref.current).filter(Boolean)
        if (validRefs.length === 0) return

        // Kill all tweens in batch
        validRefs.forEach(el => gsap.killTweensOf(el))

        // Batch animate with single call
        gsap.to(validRefs, {
            opacity: 0,
            duration: 0.2,
            overwrite: 'auto',
        })
    }, [textRefs])

    // Helper function để ẩn tất cả images - GPU optimized with batch
    const hideAllImages = useCallback(() => {
        const validRefs = imageRefs.map(ref => ref.current).filter(Boolean)
        if (validRefs.length === 0) return

        // Kill all tweens in batch
        validRefs.forEach(el => gsap.killTweensOf(el))

        // Batch animate with single call - adaptive based on device
        gsap.to(validRefs, {
            opacity: 0,
            scale: animConfig.useScale ? 1.05 : 1.0,
            duration: animConfig.baseDuration,
            force3D: animConfig.useScale,
            overwrite: 'auto',
            ease: animConfig.ease,
        })
    }, [imageRefs, animConfig])

    // Helper function để hiển thị text section cụ thể - Batch optimized
    const showText = useCallback(
        (section: TourSection) => {
            // Skip if section is 'none'
            if (section === 'none') return

            // Batch hide all texts first
            const validRefs = textRefs.map(ref => ref.current).filter(Boolean)
            validRefs.forEach(el => gsap.killTweensOf(el))
            gsap.set(validRefs, { opacity: 0 })

            // Get section ref and inner element refs
            let containerRef, titleRef, descRef, btnRef
            switch (section as ImageTourSectionType) {
                case 'living':
                    containerRef = livingTextRef
                    titleRef = livingTitleRef
                    descRef = livingDescRef
                    break
                case 'kitchen':
                    containerRef = kitchenTextRef
                    titleRef = kitchenTitleRef
                    descRef = kitchenDescRef
                    break
                case 'bath':
                    containerRef = bathTextRef
                    titleRef = bathTitleRef
                    descRef = bathDescRef
                    break
                case 'bed':
                    containerRef = bedTextRef
                    titleRef = bedTitleRef
                    descRef = bedDescRef
                    btnRef = ctaButtonRef
                    break
            }

            if (containerRef?.current) {
                // Create master timeline for batch animations
                const tl = gsap.timeline()

                // Show container
                tl.to(containerRef.current, { opacity: 1, duration: animConfig.baseDuration })

                // Batch animate inner elements with stagger - adaptive
                const elements = [titleRef?.current, descRef?.current, btnRef?.current].filter(Boolean)
                if (elements.length > 0) {
                    tl.fromTo(
                        elements,
                        { opacity: 0, y: animConfig.useScale ? 20 : 10 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: animConfig.revealDuration,
                            stagger: animConfig.textStagger,
                            ease: animConfig.ease,
                            force3D: animConfig.useScale,
                        },
                        '-=0.2', // Overlap with container fade
                    )
                }
            }
        },
        [textRefs, animConfig],
    )

    // Helper function để hiển thị image section cụ thể
    const showImage = useCallback(
        (section: TourSection) => {
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
        },
        [hideAllImages],
    )

    // Effect để đảm bảo text và image luôn ẩn khi không trong tour section
    useEffect(() => {
        if (!isActivated || currentSection === 'none') {
            hideAllTexts()
            hideAllImages()
        }
    }, [isActivated, currentSection, hideAllTexts, hideAllImages])

    // Sync refs with latest callbacks to fix stale closure bug
    // When animConfig updates (after device detection), callbacks recreate
    // but ScrollTriggers registered with old versions - refs fix this
    useEffect(() => {
        showTextRef.current = showText
        showImageRef.current = showImage
        hideAllTextsRef.current = hideAllTexts
        hideAllImagesRef.current = hideAllImages
    }, [showText, showImage, hideAllTexts, hideAllImages])

    // Animate scroll hint on mount
    useEffect(() => {
        if (scrollHintRef.current && !isActivated) {
            gsap.to(scrollHintRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
            })
        }
    }, [isActivated])

    // Effect để cleanup khi unmount hoặc page navigation
    useEffect(() => {
        return () => {
            // Force hide all texts on unmount
            textRefs.forEach(ref => {
                if (ref.current) {
                    gsap.killTweensOf(ref.current)
                    ref.current.style.opacity = '0'
                }
            })

            // Force hide images
            imageRefs.forEach(ref => {
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
    }, [textRefs, imageRefs])

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
                            showTextRef.current('living')
                            showImageRef.current('living')
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
                            immediateRender: false,
                        },
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
                      hideAllTextsRef.current()
                      hideAllImagesRef.current()
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
                                  immediateRender: false,
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
                    showTextRef.current(section)
                    showImageRef.current(section)
                },
                onLeave: () => {
                    const currentState = useTourStore.getState()
                    if (currentState.currentSection === section) {
                        hideAllTextsRef.current()
                    }
                },
                onEnterBack: () => {
                    setCurrentSection(section)
                    showTextRef.current(section)
                    showImageRef.current(section)
                },
                onLeaveBack: () => {
                    const currentState = useTourStore.getState()
                    if (currentState.currentSection === section) {
                        hideAllTextsRef.current()
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
                      hideAllTextsRef.current()
                      hideAllImagesRef.current()
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
                                      immediateRender: false,
                                  },
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
                                      immediateRender: false,
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
        <section id="tour" ref={sectionRef} className="relative min-h-screen bg-slate-950">
            {/* Background Decorators */}
            <SideGlowDecorator side="left" color="emerald" size={70} opacity={0.06} />

            {/* Unified Circular Overlay - Single compositing layer */}
            {circleAnimation !== 'none' && (
                <div
                    className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
                    style={{ willChange: 'transform' }}
                >
                    <div
                        ref={
                            circleAnimation === 'reveal'
                                ? circleRef
                                : circleAnimation === 'collapse'
                                  ? circleCollapseRef
                                  : circleAnimation === 'exit'
                                    ? circleExitRef
                                    : circleReentryRef
                        }
                        className="absolute w-32 h-32 rounded-full"
                        style={{
                            background:
                                circleAnimation === 'reveal'
                                    ? 'linear-gradient(to bottom right, rgb(16 185 129), rgb(59 130 246))'
                                    : circleAnimation === 'collapse'
                                      ? 'linear-gradient(to bottom right, rgb(15 23 42), rgb(6 78 59), rgb(15 23 42))'
                                      : circleAnimation === 'exit'
                                        ? 'linear-gradient(to bottom right, rgb(37 99 235), rgb(147 51 234))'
                                        : 'linear-gradient(to bottom right, rgb(147 51 234), rgb(37 99 235))',
                            willChange: 'transform, opacity',
                            transform:
                                circleAnimation === 'reveal' || circleAnimation === 'exit'
                                    ? 'scale(0) translateZ(0)'
                                    : 'scale(50) translateZ(0)',
                            opacity: circleAnimation === 'reveal' || circleAnimation === 'exit' ? 0 : 1,
                        }}
                    />
                </div>
            )}

            {/* Image Background - Fixed */}
            <div
                ref={imageWrapRef}
                id="image-wrap"
                className="fixed inset-0 z-10"
                style={{
                    pointerEvents: 'none',
                    opacity: 0,
                    display: showCanvas ? 'block' : 'none',
                    contentVisibility: 'auto',
                    contain: 'layout paint size style',
                }}
            >
                {/* Living Room Image - Priority loading, always rendered */}
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
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Kitchen Image - Always rendered for smooth transitions */}
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
                        loading="eager"
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Bath Image - Always rendered for smooth transitions */}
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
                        loading="eager"
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Bed Image - Always rendered for smooth transitions */}
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
                        loading="eager"
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        placeholder="blur"
                    />
                </div>

                {/* Gradient overlay */}
                <div
                    style={{ pointerEvents: 'none' }}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
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
                                <div
                                    ref={scrollHintRef}
                                    className="text-white/50 text-caption"
                                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                                >
                                    Scroll xuống để bắt đầu
                                </div>
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
                            <h1
                                ref={livingTitleRef}
                                className="text-4xl md:text-6xl font-semibold text-white"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Tiện ích mỗi ngày,
                                <br />
                                <span className="text-emerald-300">trong từng căn phòng</span>
                            </h1>
                            <p
                                ref={livingDescRef}
                                className="mt-4 text-white/80"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
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
                            <h2
                                ref={kitchenTitleRef}
                                className="text-h4 md:text-h3 font-semibold text-white"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Nhà bếp – gọn gàng & hiệu quả
                            </h2>
                            <p
                                ref={kitchenDescRef}
                                className="mt-4 text-white/80"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Móc dán chịu lực, kệ úp chén, bàn chải rửa cốc… mọi thứ đều trong tầm tay.
                            </p>
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
                            <h2
                                ref={bathTitleRef}
                                className="text-h4 md:text-h3 font-semibold text-white"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Phòng tắm – sạch sẽ tiện lợi
                            </h2>
                            <p
                                ref={bathDescRef}
                                className="mt-4 text-white/80"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Giải pháp dán không khoan tường, khô nhanh, bền bỉ – an tâm sử dụng mỗi ngày.
                            </p>
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
                            <h2
                                ref={bedTitleRef}
                                className="text-h4 md:text-h3 font-semibold text-white"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Phòng ngủ – yên tĩnh & ngăn nắp
                            </h2>
                            <p
                                ref={bedDescRef}
                                className="mt-4 text-white/80"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Hộp chứa đồ, kệ mini, đèn ngủ… giúp không gian luôn gọn gàng.
                            </p>
                            <a
                                ref={ctaButtonRef}
                                className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700 transition-colors pointer-events-auto"
                                href="https://shopee.vn/ecomate"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ opacity: 0, transform: 'translateY(20px)' }}
                            >
                                Khám phá trên Shopee
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}

// Export with React.memo for performance optimization
// Component only re-renders when props change (currently no props)
export default memo(ImageTourSectionComponent)
