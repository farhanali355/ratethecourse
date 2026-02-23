import React from 'react'
import { courses, trendingCourses } from '@/components/features/courses/CoursesData'
import { CourseCard } from '@/components/features/courses/CourseCard'
import { SidebarFilter } from '@/components/features/courses/SidebarFilter'
import { TrendingCourseItem } from '@/components/features/courses/TrendingCourseItem'
import { NewsletterWidget } from '@/components/features/courses/NewsletterWidget'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { createClient } from '@/utils/supabase/server'

export default async function CoursesPage() {
    const supabase = await createClient()

    // Fetch approved submissions
    const { data: realSubmissions } = await supabase
        .from('course_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

    // Fetch all approved reviews
    const { data: allReviews } = await supabase
        .from('reviews')
        .select('course_id, rating')
        .eq('status', 'approved')

    // Map submissions to Course interface
    const realCourses = (realSubmissions || []).map((sub: any) => {
        const courseReviews = allReviews?.filter(r => r.course_id === sub.id) || []
        const count = courseReviews.length
        const avg = count > 0
            ? Number((courseReviews.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1))
            : 0

        return {
            id: sub.id,
            title: sub.course_name,
            author: sub.coach_name.toUpperCase(),
            rating: avg,
            reviews: count,
            category: sub.category || 'New Submissions',
            imageUrl: sub.thumbnail_url || '/images/course-1-image.png',
            badge: 'NEW',
            link: sub.course_url,
        }
    })

    const displayCourses = [...realCourses, ...courses]

    return (
        <main className="min-h-screen bg-white">

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">

                <Breadcrumbs />

                <div className="flex justify-between items-baseline mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 font-montserrat">
                        Courses
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Main Content (Grid) - Takes 3 columns on large screens */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="flex justify-center mt-12 mb-8">
                            <button className="bg-[#0088EE] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors shadow-md text-sm font-montserrat">
                                Load more courses
                            </button>
                        </div>
                    </div>

                    {/* Sidebar - Takes 1 column on large screens */}
                    <div className="lg:col-span-1  flex flex-col gap-8">

                        {/* Filter */}
                        <SidebarFilter />

                        {/* Divider */}
                        <div className="h-px bg-gray-100 w-full" />

                        {/* Trending Section */}
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-4 font-montserrat">
                                Trending in Business
                            </h3>
                            <div className="flex flex-col gap-5">
                                {trendingCourses.map(course => (
                                    <TrendingCourseItem key={course.id} course={course} />
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}

                        <NewsletterWidget />

                    </div>

                </div>
            </div>

        </main>
    )
}
