'use client'

import React from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Course } from './CoursesData'

export function CourseCard({ course }: { course: Course }) {
    return (
        <div className="flex flex-col bg-white rounded-xl border w-[100%] border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden group">
            {/* Image Section */}
            <Link href={`/courses/${course.id}`} prefetch={true} className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200 h-[180px] block">
                <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {course.badge && (
                    <span className="absolute top-3 left-3 bg-[#0088EE] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                        {course.badge}
                    </span>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-5 flex flex-col  flex-1 relative">
                {/* Title */}
                <Link href={`/courses/${course.id}`} prefetch={true} className="font-bold text-[25px] leading-tight text-gray-900 group-hover:text-[#0088EE] transition-colors font-montserrat">
                    {course.title}
                </Link>
                {/* Author Name */}
                <div className="text-[13px] uppercase  tracking-wider text-black font-montserrat">
                    {course.author}
                </div>


                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-yellow-500 text-lg font-montserrat pt-0.5">
                        {course.rating}
                    </span>
                    <span className="text-xs text-black font-medium ml-1 pt-0.5 font-montserrat">
                        {course.reviews} Reviews
                    </span>
                </div>

                {/* Category (Bottom) */}
                <div className="mt-auto pt-1">
                    <span className="text-[15px] text-[#0088EE] font-medium font-montserrat hover:underline cursor-pointer">
                        {course.category}
                    </span>
                </div>
            </div>
        </div>
    )
}
