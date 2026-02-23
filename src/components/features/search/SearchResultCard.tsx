'use client'

import React from 'react'
import { Star } from 'lucide-react'

interface SearchResultCardProps {
    type: 'course' | 'coach'
    title: string
    author?: string
    subTitle?: string
    rating: number
    reviews: number
    image: string
    testimonial: string
    colorVariant?: 'gradient' | 'dark' | 'tech'
}

export function SearchResultCard({
    type, title, author, subTitle, rating, reviews, image, testimonial, colorVariant
}: SearchResultCardProps) {

    const getBgClass = () => {
        if (colorVariant === 'gradient') return 'bg-gradient-to-br from-[#10B981] via-[#3B82F6] to-[#8B5CF6]'
        if (colorVariant === 'dark') return 'bg-black flex items-center justify-center'
        if (colorVariant === 'tech') return 'bg-[#1F2937]'
        return 'bg-gray-100'
    }

    return (
        <div className="bg-white border border-[#E5E5E5] rounded-[16px] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Image Section */}
                <div className={`w-full md:w-[140px] h-[140px] flex-shrink-0 rounded-[12px] overflow-hidden ${type === 'coach' ? '' : getBgClass()}`}>
                    {type === 'coach' ? (
                        <img src={image} alt={title} className="w-full h-full object-cover " />
                    ) : (
                        colorVariant === 'dark' ? (
                            <div className="relative">
                                <img src="/icons/is-this.png" alt="Card Icon" className="w-10 h-10 animate-pulse" />
                            </div>
                        ) : (
                            colorVariant === 'tech' ? (
                                <img src={image} alt={title} className="w-full h-full object-cover opacity-80" />
                            ) : null
                        )
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex flex-col gap-1">
                            <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded w-fit ${type === 'course' ? 'bg-[#F1F5F9] text-[#7E22CE]' : 'bg-[#E0F2FE] text-[#0369A1]'}`}>
                                {type}
                            </span>
                            <h3 className="text-[20px] font-bold text-black font-montserrat">
                                {title}
                            </h3>
                            <p className="text-[14px] text-[#717171] font-montserrat">
                                {author ? `by ${author}` : subTitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#FDFDFD] px-3 py-1.5 rounded-full border border-[#F0F0F0]">
                            <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                            <span className="text-[16px] font-black text-black">{rating}</span>
                            <span className="text-[12px] text-[#717171]">({reviews.toLocaleString()} {type === 'course' ? 'reviews' : 'sessions'})</span>
                        </div>
                    </div>

                    {/* Testimonial Section */}
                    <div className="mt-4 flex gap-4 bg-[#F9FAFB] p-4 rounded-xl items-start">
                        <div className="text-[#0088EE] flex-shrink-0 mt-1">
                            <img src="/icons/card-icon.png" alt="Quote" className="w-6 h-5 opacity-100" />
                        </div>
                        <p className="text-[14px] font-[500] text-[#4B5563] font-montserrat leading-relaxed">
                            "{testimonial}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
