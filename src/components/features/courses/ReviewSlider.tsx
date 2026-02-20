'use client'

import React, { useRef } from 'react'
import { Star, Check, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
    id: string
    user: string
    initials: string
    role: string
    rating: number
    comment: string
    verified: boolean
    avatar?: string
}

export function ReviewSlider({ reviews }: { reviews: Review[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return
        const { scrollLeft, clientWidth } = scrollRef.current
        const scrollTo = direction === 'left'
            ? scrollLeft - clientWidth / 2
            : scrollLeft + clientWidth / 2

        scrollRef.current.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        })
    }

    if (!reviews || reviews.length === 0) return null

    return (
        <div className="relative group">
            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="min-w-[280px] w-full md:w-[calc(50%-8px)] bg-[#E0E7FF] flex-shrink-0 border border-[#E0E7FF] p-6 rounded-2xl shadow-sm relative snap-start"
                    >
                        <div className="flex justify-between items-start mb-4 ">
                            <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-[#0088EE] font-black text-lg">
                                    {review.avatar ? (
                                        <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                                    ) : (
                                        review.initials
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-black">{review.user}</h4>
                                    <p className="text-[12px] text-[#0088EE] font-bold">{review.role}</p>
                                </div>
                            </div>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < review.rating ? 'fill-[#FFD700] border-[#f2f2f2] text-[#FFD700]' : 'text-[#f2f2f2]'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 text-[16px] leading-relaxed mb-4 line-clamp-3 italic font-medium">
                            "{review.comment}"
                        </p>
                        {review.verified && (
                            <div className="flex items-center gap-1 text-[#10B981] font-montserrat text-[15px] font-bold">
                                <Check className="w-3 h-3" /> Verified Purchase
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={() => scroll('left')}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0088EE] hover:text-[#0088EE] hover:bg-blue-50 transition-all active:scale-95"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0088EE] hover:text-[#0088EE] hover:bg-blue-50 transition-all active:scale-95"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
