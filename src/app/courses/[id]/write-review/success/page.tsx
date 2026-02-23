import React from 'react'
import Link from 'next/link'
import { courses, Course } from '@/components/features/courses/CoursesData'
import { CheckCircle2, Star, Link2, Linkedin } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

// Custom X (Twitter) icon
const XIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

export default async function ReviewSuccessPage(props: { params: Promise<{ id: string }> }) {
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
                <p className="text-gray-400">The review was submitted, but we couldn't find the course details for this page.</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-white font-montserrat">

            <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">

                {/* Green Checkmark */}
                <div className="mb-8">
                    <CheckCircle2 className="w-16 h-16 text-[#10B981] stroke-[1.5]" />
                </div>

                {/* Main Heading */}
                <h1 className="text-[34px] font-[800] text-black mb-4 text-center tracking-tight">
                    Thank you for your review!
                </h1>

                {/* Description */}
                <p className="text-[14px] text-gray-500 font-[500] text-center max-w-xl leading-relaxed mb-12">
                    Your feedback on the <span className="font-bold text-black">{course.title}</span> has been submitted.
                    You're helping build a transparent community for students everywhere.
                </p>

                {/* Share Impact Card Heading */}
                <h3 className="text-[16px] font-black text-black mb-6 uppercase tracking-wider">
                    Share your impact
                </h3>

                {/* Social Impact Card */}
                <div className="w-full max-w-md bg-[#0088EE] rounded-2xl p-8 mb-12 shadow-xl shadow-blue-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-10">
                        {/* Graduation Cap / Icon Placeholder */}
                        <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L1 7l11 5 11-5-11-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        {/* Rating Stars */}
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                            ))}
                        </div>
                    </div>

                    <h4 className="text-[19px] font-black text-white leading-tight mb-2">
                        I just rated the {course.title} on CourseReview
                    </h4>

                    {/* Decorative pattern or logo subtle */}
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                {/* Share Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md text-[13px] font-bold hover:bg-gray-900 transition-all">
                        <XIcon />
                        Share on X
                    </button>
                    <button className="flex items-center gap-2 bg-[#0077b5] text-white px-5 py-2.5 rounded-md text-[13px] font-bold hover:bg-[#006396] transition-all">
                        <Linkedin className="w-4 h-4 fill-white" />
                        Share on LinkedIn
                    </button>
                    <button className="flex items-center gap-2 bg-white text-gray-400 font-bold px-5 py-2.5 rounded-md text-[13px] border border-gray-200 hover:border-gray-300 hover:text-gray-600 transition-all">
                        <Link2 className="w-4 h-4" />
                        Copy Link
                    </button>
                </div>

            </div>

        </main>
    )
}
