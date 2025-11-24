'use client'
import { motion } from 'framer-motion'
import { categories } from '@/data/blog-posts'
import { HoverBorderButton } from '@workspace/ui/components/ui/hover-border-button'
import { BUTTON_VARIANTS } from '@/config/button-variants'

interface CategoryFilterProps {
    selectedCategory: string
    onSelectCategory: (categoryId: string) => void
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <section className="relative w-full py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap gap-4 justify-center">
                    {categories.map((category, index) => {
                        const isSelected = selectedCategory === category.id
                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <HoverBorderButton {...(isSelected ? BUTTON_VARIANTS.filterActive : BUTTON_VARIANTS.filter)}>
                                    <HoverBorderButton.Button
                                        onClick={() => onSelectCategory(category.id)}
                                        className={`
                                            px-6 py-3 rounded-full font-medium text-body
                                            transition-all duration-300
                                            ${
                                                isSelected
                                                    ? 'bg-emerald-600 text-white border-2 border-emerald-500 scale-105'
                                                    : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-200'
                                            }
                                        `}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.name}
                                    </HoverBorderButton.Button>
                                </HoverBorderButton>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
