'use client'
import React, { useRef, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import { MotionValue, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { IconHome, IconCompass, IconShoppingBag, IconBrandShopee } from '@tabler/icons-react'

export default function MobileDock() {
    const links = [
        {
            title: 'Trang chủ',
            icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: '#hero',
        },
        {
            title: 'Khám phá',
            icon: <IconCompass className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: '#tour',
        },
        {
            title: 'Sản phẩm',
            icon: <IconShoppingBag className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: '#products',
        },
        {
            title: 'Mua ngay',
            icon: <IconBrandShopee className="h-full w-full text-emerald-500 dark:text-emerald-400" />,
            href: 'https://shopee.vn/ecomate',
        },
    ]

    const mouseX = useMotionValue(Infinity)

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <motion.div
                onMouseMove={e => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="w-full flex h-[80px] items-center justify-evenly bg-gray-50/80 backdrop-blur-lg dark:bg-neutral-900/80"
            >
                {links.map(item => (
                    <IconContainer mouseX={mouseX} key={item.title} {...item} />
                ))}
            </motion.div>
        </div>
    )
}

function IconContainer({
    mouseX,
    title,
    icon,
    href,
}: {
    mouseX: MotionValue
    title: string
    icon: React.ReactNode
    href: string
}) {
    let ref = useRef<HTMLDivElement>(null)

    let distance = useTransform(mouseX, val => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }

        return val - bounds.x - bounds.width / 2
    })

    let widthTransform = useTransform(distance, [-150, 0, 150], [48, 64, 48])
    let heightTransform = useTransform(distance, [-150, 0, 150], [48, 64, 48])

    let widthTransformIcon = useTransform(distance, [-150, 0, 150], [24, 32, 24])
    let heightTransformIcon = useTransform(distance, [-150, 0, 150], [24, 32, 24])

    let width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    })
    let height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    })

    let widthIcon = useSpring(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    })
    let heightIcon = useSpring(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    })

    const [hovered, setHovered] = useState(false)

    return (
        <a href={href}>
            <motion.div
                ref={ref}
                style={{ width, height }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
            >
                <motion.div
                    style={{ width: widthIcon, height: heightIcon }}
                    className="flex items-center justify-center"
                >
                    {icon}
                </motion.div>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 4, x: '-50%' }}
                        className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
                    >
                        {title}
                    </motion.div>
                )}
            </motion.div>
        </a>
    )
}
