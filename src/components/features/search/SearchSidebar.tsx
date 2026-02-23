'use client'

import React from 'react'
import { Star } from 'lucide-react'

export function SearchSidebar() {
    return (
        <div className="flex flex-col gap-10 font-montserrat">
            <div>
                <h3 className="text-[18px] font-bold text-black mb-6">Filters</h3>

                {/* Type Filter */}
                <div className="mb-8">
                    <h4 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-4">Type</h4>
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-[#E5E5E5] text-[#0088EE] focus:ring-[#0088EE]" defaultChecked />
                            <span className="text-[15px] font-medium text-[#4A4A4A] group-hover:text-black">All Types</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-[#E5E5E5] text-[#0088EE] focus:ring-[#0088EE]" />
                            <span className="text-[15px] font-medium text-[#4A4A4A] group-hover:text-black">Courses</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-[#E5E5E5] text-[#0088EE] focus:ring-[#0088EE]" />
                            <span className="text-[15px] font-medium text-[#4A4A4A] group-hover:text-black">Coaches</span>
                        </label>
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-8">
                    <h4 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-4">Rating</h4>
                    <div className="flex flex-col gap-3">
                        {[4.5, 4.0, 3.0].map((rating) => (
                            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-5 h-5 rounded-full border-2 border-[#E5E5E5] flex items-center justify-center group-hover:border-[#0088EE]">
                                    {rating === 4.5 && <div className="w-2.5 h-2.5 rounded-full bg-[#0088EE]"></div>}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                                    <span className="text-[15px] font-medium text-[#4A4A4A] group-hover:text-black">
                                        {rating === 4.5 ? '4.5 & up' : `${rating}.0 & up`}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <h4 className="text-[14px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-4">Category</h4>
                    <select className="w-full bg-white border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-[15px] font-medium text-[#4A4A4A] outline-none focus:border-[#0088EE]">
                        <option>Programming</option>
                        <option>Design</option>
                        <option>Business</option>
                        <option>Marketing</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
