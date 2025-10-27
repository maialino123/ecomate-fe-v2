export interface BlogCategory {
    id: string
    name: string
    icon: string
    color: string
}

export interface BlogPost {
    id: string
    title: string
    excerpt: string
    category: string
    tags: string[]
    href: string
    publishedAt: string
    readTime: string
    featured: boolean
}
