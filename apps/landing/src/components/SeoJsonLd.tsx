'use client'
import React from 'react'

export default function SeoJsonLd({ data }: { data: Record<string, any> }) {
    if (!data) return null
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
