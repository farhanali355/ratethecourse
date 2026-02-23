import React from 'react'
import { SearchSidebar } from '@/components/features/search/SearchSidebar'
import { SearchBanner } from '@/components/features/search/SearchBanner'
import { SearchResultCard } from '@/components/features/search/SearchResultCard'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { courses as mockCourses } from '@/components/features/courses/CoursesData'

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query = '' } = await searchParams
    const supabase = await createClient()

    // 1. Fetch Approved Real Courses
    const { data: realSubmissions } = await supabase
        .from('course_submissions')
        .select('*')
        .eq('status', 'approved')

    // 2. Fetch Reviews for Rating calculation
    const { data: allReviews } = await supabase
        .from('reviews')
        .select('course_id, rating')
        .eq('status', 'approved')

    // 3. Map Real Courses to common format
    const realCoursesFormatted = (realSubmissions || []).map((sub: any) => {
        const courseReviews = allReviews?.filter(r => r.course_id === sub.id) || []
        const count = courseReviews.length
        const avg = count > 0
            ? Number((courseReviews.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1))
            : 0

        return {
            id: sub.id,
            type: 'course' as const,
            title: sub.course_name,
            author: sub.coach_name,
            rating: avg,
            reviews: count,
            image: sub.thumbnail_url || '/images/card-image-4.png',
            testimonial: "Verified course from our community.",
            colorVariant: 'tech' as const
        }
    })

    // 4. Map Mock Courses to common format
    const mockCoursesFormatted = mockCourses.map(c => ({
        id: c.id,
        type: 'course' as const,
        title: c.title,
        author: c.author,
        rating: c.rating,
        reviews: c.reviews,
        image: c.imageUrl,
        testimonial: "Premium featured course with high student satisfaction.",
        colorVariant: (parseInt(c.id) % 2 === 0 ? 'gradient' : 'dark') as any
    }))

    // 5. Merge and Filter
    const allResults = [...realCoursesFormatted, ...mockCoursesFormatted]
    const filteredResults = allResults.filter(item => {
        const searchStr = `${item.title} ${item.author}`.toLowerCase()
        return searchStr.includes(query.toLowerCase())
    })

    return (
        <main className="min-h-screen bg-[#FDFDFD]">

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[14px] text-[#717171] font-montserrat mb-8">
                    <Link href="/" className="hover:text-[#64748B] font-montserrat font-[580]">Home</Link>
                    <span>/</span>
                    <span className="text-black font-montserrat font-[600]">Search Results</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-[260px] flex-shrink-0">
                        <SearchSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <h1 className="text-[32px] font-bold text-[#1A1A1A] font-montserrat mb-10">
                            {query ? `Showing results for '${query}'` : 'Showing all courses'}
                        </h1>

                        <SearchBanner />

                        {/* Filter Chips */}
                        <div className="flex flex-wrap gap-2 mb-8 mt-8">
                            <span className="bg-[#E2E8F0] text-black px-4 py-1.5 rounded-full text-[14px] font-medium font-montserrat flex items-center gap-2">
                                All Types <button className="hover:text-blue-700">×</button>
                            </span>
                            <span className="bg-[#E2E8F0] text-black px-4 py-1.5 rounded-full text-[14px] font-medium font-montserrat flex items-center gap-2">
                                4.0+ Stars <button className="hover:text-blue-700">×</button>
                            </span>
                        </div>

                        {/* Results List */}
                        <div className="flex flex-col gap-6 mb-12">
                            {filteredResults.length > 0 ? (
                                filteredResults.map((result) => (
                                    <SearchResultCard
                                        key={result.id}
                                        type={result.type}
                                        title={result.title}
                                        author={result.author}
                                        rating={result.rating}
                                        reviews={result.reviews}
                                        image={result.image}
                                        testimonial={result.testimonial}
                                        colorVariant={result.colorVariant}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-32 bg-white border-2 border-dashed border-gray-100 rounded-[24px] shadow-sm">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-3">No results found for "{query}"</h2>
                                    <p className="text-gray-500 font-montserrat max-w-md mx-auto leading-relaxed">
                                        We couldn't find any courses or coaches matching your search. Try checking for typos or use more general keywords.
                                    </p>
                                    <Link
                                        href="/search"
                                        className="mt-8 inline-block text-[#0088EE] font-bold font-montserrat hover:underline"
                                    >
                                        Clear search and see all courses
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {filteredResults.length > 0 && (
                            <div className="flex items-center justify-center gap-2 mb-20 font-montserrat">
                                <button className="p-2 border border-[#E5E5E5] rounded-lg text-gray-400 hover:bg-gray-50">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-[#0088EE] text-white rounded-lg font-bold">1</button>
                                <button className="w-10 h-10 flex items-center justify-center text-[#717171] hover:bg-gray-50 rounded-lg">2</button>
                                <button className="w-10 h-10 flex items-center justify-center text-[#717171] hover:bg-gray-50 rounded-lg">3</button>
                                <span className="px-2 text-gray-400">...</span>
                                <button className="w-10 h-10 flex items-center justify-center text-[#717171] hover:bg-gray-50 rounded-lg">8</button>
                                <button className="p-2 border border-[#E5E5E5] rounded-lg text-gray-400 hover:bg-gray-50">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </main>
    )
}
