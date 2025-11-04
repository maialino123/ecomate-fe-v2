import { useLayoutEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'
import './ScrollStack.css'

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
)

// Mobile detection utility
const isMobileDevice = () => {
    if (typeof window === 'undefined') return false
    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
    )
}

const ScrollStack = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    scaleDuration = 0.5,
    rotationAmount = 0,
    blurAmount = 0,
    useWindowScroll = false,
    onStackComplete,
}) => {
    const scrollerRef = useRef(null)
    const stackCompletedRef = useRef(false)
    const animationFrameRef = useRef(null)
    const lenisRef = useRef(null)
    const cardsRef = useRef([])
    const lastTransformsRef = useRef(new Map())
    const isUpdatingRef = useRef(false)
    const isMobileRef = useRef(isMobileDevice())
    const layoutCacheRef = useRef(new Map()) // Cache for getBoundingClientRect results
    const isScrollingRef = useRef(false)
    const scrollTimeoutRef = useRef(null)

    const calculateProgress = useCallback((scrollTop, start, end) => {
        if (scrollTop < start) return 0
        if (scrollTop > end) return 1
        return (scrollTop - start) / (end - start)
    }, [])

    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight
        }
        return parseFloat(value)
    }, [])

    const getScrollData = useCallback(() => {
        if (useWindowScroll) {
            return {
                scrollTop: window.scrollY,
                containerHeight: window.innerHeight,
                scrollContainer: document.documentElement,
            }
        } else {
            const scroller = scrollerRef.current
            return {
                scrollTop: scroller.scrollTop,
                containerHeight: scroller.clientHeight,
                scrollContainer: scroller,
            }
        }
    }, [useWindowScroll])

    // Cached version of getElementOffset
    const getElementOffset = useCallback(
        (element, useCache = true) => {
            if (!element) return 0

            const elementId = cardsRef.current.indexOf(element)

            // Use cache if available and requested
            if (useCache && layoutCacheRef.current.has(elementId)) {
                return layoutCacheRef.current.get(elementId)
            }

            let offset
            if (useWindowScroll) {
                const rect = element.getBoundingClientRect()
                offset = rect.top + window.scrollY
            } else {
                offset = element.offsetTop
            }

            // Store in cache
            if (useCache && elementId !== -1) {
                layoutCacheRef.current.set(elementId, offset)
            }

            return offset
        },
        [useWindowScroll],
    )

    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || isUpdatingRef.current) return

        isUpdatingRef.current = true

        const { scrollTop, containerHeight, scrollContainer } = getScrollData()
        const stackPositionPx = parsePercentage(stackPosition, containerHeight)
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)

        const endElement = useWindowScroll
            ? document.querySelector('.scroll-stack-end')
            : scrollerRef.current?.querySelector('.scroll-stack-end')

        const endElementTop = endElement ? getElementOffset(endElement, true) : 0

        // Disable blur on mobile for performance
        const shouldApplyBlur = blurAmount > 0 && !isMobileRef.current

        cardsRef.current.forEach((card, i) => {
            if (!card) return

            const cardTop = getElementOffset(card, true) // Use cached offset
            const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
            const triggerEnd = cardTop - scaleEndPositionPx
            const pinStart = cardTop - stackPositionPx - itemStackDistance * i
            const pinEnd = endElementTop - containerHeight / 2

            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
            const targetScale = baseScale + i * itemScale
            const scale = 1 - scaleProgress * (1 - targetScale)
            const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

            let blur = 0
            // Only calculate blur on desktop (skip expensive O(n²) loop on mobile)
            if (shouldApplyBlur) {
                let topCardIndex = 0
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jCardTop = getElementOffset(cardsRef.current[j], true) // Use cached offset
                    const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j
                    }
                }

                if (i < topCardIndex) {
                    const depthInStack = topCardIndex - i
                    blur = Math.max(0, depthInStack * blurAmount)
                }
            }

            let translateY = 0
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
            }

            const newTransform = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                rotation: Math.round(rotation * 100) / 100,
                blur: Math.round(blur * 100) / 100,
            }

            const lastTransform = lastTransformsRef.current.get(i)
            const hasChanged =
                !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
                Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
                Math.abs(lastTransform.blur - newTransform.blur) > 0.1

            if (hasChanged) {
                const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
                const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ''

                card.style.transform = transform
                card.style.filter = filter

                lastTransformsRef.current.set(i, newTransform)
            }

            if (i === cardsRef.current.length - 1) {
                const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
                if (isInView && !stackCompletedRef.current) {
                    stackCompletedRef.current = true
                    onStackComplete?.()
                } else if (!isInView && stackCompletedRef.current) {
                    stackCompletedRef.current = false
                }
            }
        })

        isUpdatingRef.current = false
    }, [
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        onStackComplete,
        calculateProgress,
        parsePercentage,
        getScrollData,
        getElementOffset,
    ])

    // Clear layout cache on resize
    const handleResize = useCallback(() => {
        layoutCacheRef.current.clear()
        updateCardTransforms()
    }, [updateCardTransforms])

    const handleScroll = useCallback(() => {
        // Mark as scrolling and reset timeout
        isScrollingRef.current = true

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }

        // Detect scroll stop after 150ms
        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false
        }, 150)

        updateCardTransforms()
    }, [updateCardTransforms])

    const setupLenis = useCallback(() => {
        const isMobile = isMobileRef.current

        // Optimize Lenis config based on device
        const mobileConfig = {
            duration: 0.7,
            lerp: 0.18,
            touchMultiplier: 1.5,
            syncTouchLerp: 0.1,
        }

        const desktopConfig = {
            duration: 1.2,
            lerp: 0.1,
            touchMultiplier: 2,
            syncTouchLerp: 0.075,
        }

        const config = isMobile ? mobileConfig : desktopConfig

        if (useWindowScroll) {
            const lenis = new Lenis({
                duration: config.duration,
                easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: config.touchMultiplier,
                infinite: false,
                wheelMultiplier: 1,
                lerp: config.lerp,
                syncTouch: true,
                syncTouchLerp: config.syncTouchLerp,
            })

            lenis.on('scroll', handleScroll)

            // RAF loop with throttling - pause when not scrolling
            const raf = time => {
                lenis.raf(time)

                // Continue RAF loop only if scrolling or if we need to finish animation
                if (isScrollingRef.current || lenis.velocity > 0.01) {
                    animationFrameRef.current = requestAnimationFrame(raf)
                } else {
                    // Pause RAF when scroll stops - will resume on next scroll
                    animationFrameRef.current = null
                }
            }
            animationFrameRef.current = requestAnimationFrame(raf)

            // Resume RAF on scroll start
            const resumeRAF = () => {
                if (!animationFrameRef.current) {
                    animationFrameRef.current = requestAnimationFrame(raf)
                }
            }

            window.addEventListener('scroll', resumeRAF, { passive: true })
            window.addEventListener('wheel', resumeRAF, { passive: true })
            window.addEventListener('touchmove', resumeRAF, { passive: true })

            lenisRef.current = lenis

            // Return cleanup function with captured listener references
            return {
                lenis,
                cleanup: () => {
                    window.removeEventListener('scroll', resumeRAF)
                    window.removeEventListener('wheel', resumeRAF)
                    window.removeEventListener('touchmove', resumeRAF)
                },
            }
        } else {
            const scroller = scrollerRef.current
            if (!scroller) return

            const lenis = new Lenis({
                wrapper: scroller,
                content: scroller.querySelector('.scroll-stack-inner'),
                duration: config.duration,
                easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: config.touchMultiplier,
                infinite: false,
                gestureOrientationHandler: true,
                normalizeWheel: true,
                wheelMultiplier: 1,
                touchInertiaMultiplier: isMobile ? 25 : 35,
                lerp: config.lerp,
                syncTouch: true,
                syncTouchLerp: config.syncTouchLerp,
                touchInertia: isMobile ? 0.5 : 0.6,
            })

            lenis.on('scroll', handleScroll)

            // RAF loop with throttling
            const raf = time => {
                lenis.raf(time)

                if (isScrollingRef.current || lenis.velocity > 0.01) {
                    animationFrameRef.current = requestAnimationFrame(raf)
                } else {
                    animationFrameRef.current = null
                }
            }
            animationFrameRef.current = requestAnimationFrame(raf)

            const resumeRAF = () => {
                if (!animationFrameRef.current) {
                    animationFrameRef.current = requestAnimationFrame(raf)
                }
            }

            scroller.addEventListener('scroll', resumeRAF, { passive: true })
            scroller.addEventListener('wheel', resumeRAF, { passive: true })
            scroller.addEventListener('touchmove', resumeRAF, { passive: true })

            lenisRef.current = lenis

            // Return cleanup function with captured listener references
            return {
                lenis,
                cleanup: () => {
                    scroller.removeEventListener('scroll', resumeRAF)
                    scroller.removeEventListener('wheel', resumeRAF)
                    scroller.removeEventListener('touchmove', resumeRAF)
                },
            }
        }
    }, [handleScroll, useWindowScroll])

    useLayoutEffect(() => {
        const scroller = scrollerRef.current
        if (!scroller) return

        const cards = Array.from(
            useWindowScroll
                ? document.querySelectorAll('.scroll-stack-card')
                : scroller.querySelectorAll('.scroll-stack-card'),
        )

        cardsRef.current = cards
        const transformsCache = lastTransformsRef.current
        const isMobile = isMobileRef.current

        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                card.style.marginBottom = `${itemDistance}px`
            }

            // Optimize willChange based on device and blur setting
            // Mobile: only 'transform' (no filter) to reduce GPU memory
            // Desktop with blur: 'transform, filter'
            // Desktop without blur: 'transform'
            if (isMobile) {
                card.style.willChange = 'transform'
            } else {
                card.style.willChange = blurAmount > 0 ? 'transform, filter' : 'transform'
            }

            card.style.transformOrigin = 'top center'
            card.style.backfaceVisibility = 'hidden'
            card.style.transform = 'translateZ(0)'
            card.style.webkitTransform = 'translateZ(0)'
            card.style.perspective = '1000px'
            card.style.webkitPerspective = '1000px'
        })

        // Setup resize listener to clear cache
        window.addEventListener('resize', handleResize, { passive: true })

        // Setup Lenis and store cleanup reference
        const lenisSetup = setupLenis()

        // Initial calculation without cache
        layoutCacheRef.current.clear()
        updateCardTransforms()

        return () => {
            // Cancel RAF
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }

            // Clear timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }

            // Destroy Lenis
            if (lenisRef.current) {
                lenisRef.current.destroy()
            }

            // Remove resize listener
            window.removeEventListener('resize', handleResize)

            // Clean up RAF resume listeners properly using stored cleanup function
            if (lenisSetup?.cleanup) {
                lenisSetup.cleanup()
            }

            // Reset refs
            stackCompletedRef.current = false
            cardsRef.current = []
            transformsCache.clear()
            layoutCacheRef.current.clear()
            isUpdatingRef.current = false
            isScrollingRef.current = false
        }
    }, [
        itemDistance,
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        scaleDuration,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        handleResize,
        setupLenis,
        updateCardTransforms,
    ])

    return (
        <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
            <div className="scroll-stack-inner">
                {children}
                {/* Spacer so the last pin can release cleanly */}
                <div className="scroll-stack-end" />
            </div>
        </div>
    )
}

export default ScrollStack
