'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { AuthGuardLink } from '@/components/shared/AuthGuardLink'

export function SearchBanner() {
    return (
        <div className="bg-white  rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 ">
            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
                <h3 className="text-[22px] font-bold text-black font-montserrat">
                    Can't find what you're looking for?
                </h3>
                <p className="text-[14px] text-[#717171] font-[550] font-montserrat leading-relaxed">
                    Help the community by adding a new course or coach profile. It only takes a minute to contribute.
                </p>
            </div>
            <AuthGuardLink
                href="/add-course"
                className="bg-[#0088EE] text-white border border-black px-6 py-3 rounded-full font-[500] font-montserrat hover:bg-blue-600 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-blue-100"
                message="Join our community to add courses"
            >
                <Plus className="w-5 h-5" />
                Add Course/Coach
            </AuthGuardLink>
        </div>
    )
}
