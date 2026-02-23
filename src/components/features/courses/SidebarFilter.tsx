'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function SidebarFilter() {
    const [isOpen, setIsOpen] = useState(true)

    const categories = [
        "All Courses",
        "Business Courses",
        "AI Courses",
        "Trending Courses"
    ]

    return (
        <div className="w-full font-montserrat flex flex-col gap-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-black text-white px-4 py-3 flex justify-between items-center rounded-sm mb-1 cursor-pointer"
            >
                <span className="font-bold text-sm tracking-wide uppercase">Search Courses</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
                <div className="flex flex-col gap-2.5">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="w-full px-4 py-2.5 text-sm font-bold text-gray-800 bg-white border border-gray-400 rounded-sm hover:border-black cursor-pointer transition-colors"
                        >
                            {category}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
