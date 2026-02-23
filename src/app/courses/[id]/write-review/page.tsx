import React from 'react'
import { courses, Course } from '@/components/features/courses/CoursesData'
import { ReviewForm } from '@/components/features/courses/ReviewForm'
import { createClient } from '@/utils/supabase/server'

export default async function WriteReviewPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const courseId = params.id
    const supabase = await createClient()

    // 1. Check static data first
    let course: Course | undefined = courses.find(c => c.id === courseId)

    // 2. If not found, check Supabase
    if (!course) {
        const { data: sub } = await supabase
            .from('course_submissions')
            .select('*')
            .eq('id', courseId)
            .eq('status', 'approved')
            .single()

        if (sub) {
            course = {
                id: sub.id,
                title: sub.course_name,
                author: sub.coach_name,
                rating: 0,
                reviews: 0,
                category: 'New Submissions',
                imageUrl: sub.thumbnail_url || '/images/course-1-image.png',
                link: sub.course_url,
            }
        }
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center font-montserrat bg-black text-white p-6 text-center">
                <h1 className="text-4xl font-black mb-4">Course not found</h1>
                <p className="text-gray-400">The course you are trying to review doesn't exist or is not approved yet.</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-white font-montserrat">

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <ReviewForm course={course} />
            </div>

        </main>
    )
}
