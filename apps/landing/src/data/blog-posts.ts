import { BlogCategory, BlogPost } from '@/types/blog'

export const categories: BlogCategory[] = [
    {
        id: 'all',
        name: 'Tất cả',
        icon: '📚',
        color: 'gray',
    },
    {
        id: 'tips',
        name: 'Tips & Tricks',
        icon: '💡',
        color: 'orange',
    },
    {
        id: 'guide',
        name: 'Hướng dẫn',
        icon: '📖',
        color: 'blue',
    },
    {
        id: 'product',
        name: 'Đồ gia dụng',
        icon: '🏠',
        color: 'emerald',
    },
    {
        id: 'news',
        name: 'Tin tức',
        icon: '📰',
        color: 'purple',
    },
]

export const blogPosts: BlogPost[] = [
    {
        id: 'do-gia-dung-ha-noi',
        title: 'Đồ gia dụng giao nhanh Hà Nội - Freeship 300k',
        excerpt:
            'Khám phá đồ gia dụng chất lượng với dịch vụ giao hàng siêu tốc 24-48h. Freeship đơn từ 300.000đ, đổi trả thoải mái trong 14 ngày.',
        category: 'product',
        tags: ['Freeship', 'Hà Nội', 'Giao nhanh', 'Đồ gia dụng'],
        href: '/do-gia-dung-ha-noi-freeship-300k',
        publishedAt: '2025-01-15',
        readTime: '5 phút',
        featured: true,
    },
    {
        id: 'meo-sap-xep-tu-bep',
        title: 'Mẹo sắp xếp tủ bếp nhanh - Gọn gàng, tiết kiệm thời gian',
        excerpt:
            'Biến căn bếp nhỏ thành không gian nấu nướng hiệu quả với những mẹo sắp xếp thông minh. Tiết kiệm 10-15 phút mỗi ngày khi nấu ăn và dọn dẹp.',
        category: 'tips',
        tags: ['Tổ chức', 'Nhà bếp', 'Tiết kiệm', 'Tips'],
        href: '/meo-sap-xep-tu-bep-nhanh',
        publishedAt: '2025-01-10',
        readTime: '7 phút',
        featured: true,
    },
]

// Helper function to get category by id
export function getCategoryById(id: string): BlogCategory | undefined {
    return categories.find((cat) => cat.id === id)
}

// Helper function to get category color classes
export function getCategoryColorClasses(categoryId: string): {
    bg: string
    text: string
    border: string
} {
    const category = getCategoryById(categoryId)
    const color = category?.color || 'gray'

    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
        gray: {
            bg: 'bg-gray-500/10',
            text: 'text-gray-400',
            border: 'border-gray-500/20',
        },
        orange: {
            bg: 'bg-orange-500/10',
            text: 'text-orange-400',
            border: 'border-orange-500/20',
        },
        blue: {
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            border: 'border-blue-500/20',
        },
        emerald: {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20',
        },
        purple: {
            bg: 'bg-purple-500/10',
            text: 'text-purple-400',
            border: 'border-purple-500/20',
        },
    }

    return colorMap[color] ?? colorMap.gray!
}
