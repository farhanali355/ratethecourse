import React from 'react'
import { courses } from '@/components/features/courses/CoursesData'
import { ClaimForm } from '@/components/features/courses/ClaimForm'

import { createClient } from '@/utils/supabase/server'
import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default async function ClaimCoursePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const courseId = params.id
    const supabase = await createClient()

    // 1. Check static data
    let courseExists = courses.some(c => c.id === courseId)

    // 2. If not found, check Supabase
    if (!courseExists) {
        const { data: sub } = await supabase
            .from('course_submissions')
            .select('id')
            .eq('id', courseId)
            .eq('status', 'approved')
            .single()

        if (sub) {
            courseExists = true
        }
    }

    if (!courseExists) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-4xl font-black mb-2 font-montserrat">Course not found</h1>
                <p className="text-gray-400 mb-8 max-w-sm">The course you're looking for doesn't exist or hasn't been approved yet.</p>
                <Link href="/courses" className="bg-[#0088EE] text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-600 transition-all font-montserrat shadow-lg shadow-blue-500/20">
                    Back to Courses
                </Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-white font-montserrat">

            <div className="max-w-4xl mx-auto px-6 py-20">
                {/* Heading Section */}
                <div className="mb-12">
                    <h1 className="text-[34px] font-[800] text-black mb-4 tracking-tight">
                        Are you the course owner?
                    </h1>
                    <p className="text-[16px] text-black font-[500] max-w-2xl leading-relaxed">
                        Claim your profile to manage reviews, reply to student feedback, and build trust with your audience.
                    </p>
                </div>

                {/* Form Section */}
                <ClaimForm courseId={courseId} />
            </div>

        </main>
    )
}
