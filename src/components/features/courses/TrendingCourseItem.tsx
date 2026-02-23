'use client'

import React from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { TrendingCourse } from './CoursesData'

export function TrendingCourseItem({ course }: { course: TrendingCourse }) {
    return (
        <div className="flex gap-3 items-start group">
            <div className="w-22 h-18 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
                <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-[15px] leading-tight text-gray-900 group-hover:text-blue-600 transition-colors font-montserrat">
                    {course.title}
                </h3>
                <p className="text-xs text-gray-600 font-montserrat mt-0.5">
                    {course.author}
                </p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-yellow-500 font-montserrat">{course.rating}</span>
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                </div>
            </div>
        </div>
    )
}
