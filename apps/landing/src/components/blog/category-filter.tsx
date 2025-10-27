'use client'
import { motion } from 'framer-motion'
import { categories } from '@/data/blog-posts'

interface CategoryFilterProps {
    selectedCategory: string
    onSelectCategory: (categoryId: string) => void
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <section className="relative w-full py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((category, index) => {
                        const isSelected = selectedCategory === category.id
                        return (
                            <motion.button
                                key={category.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                onClick={() => onSelectCategory(category.id)}
                                className={`
                                    px-5 py-2.5 rounded-full font-medium text-sm
                                    transition-all duration-300
                                    ${
                                        isSelected
                                            ? 'bg-emerald-600 text-white border-2 border-emerald-500 scale-105'
                                            : 'bg-white/5 text-white/70 border-2 border-white/10 hover:border-white/30 hover:bg-white/10'
                                    }
                                `}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
