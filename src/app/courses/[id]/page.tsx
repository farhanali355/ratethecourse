import React from 'react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { courses, trendingCourses } from '@/components/features/courses/CoursesData'
import { Star, ShieldCheck, TrendingUp, ThumbsUp, MessageSquare, Check, ChevronRight } from 'lucide-react'
import { NewsletterWidget } from '@/components/features/courses/NewsletterWidget'
import { createClient } from '@/utils/supabase/server'
import { Course } from '@/components/features/courses/CoursesData'
import { ReviewSlider } from '@/components/features/courses/ReviewSlider'
import { AuthGuardLink } from '@/components/shared/AuthGuardLink'

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
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
                handle: sub.submitted_by_username ? `@${sub.submitted_by_username}` : `@${sub.coach_name.toLowerCase().replace(/\s+/g, '')}`,
                rating: 0,
                reviews: 0,
                category: 'New Category',
                imageUrl: sub.thumbnail_url || '/images/course-1-image.png',
                link: sub.course_url,
                fullDescription: sub.about_course || `Welcome to ${sub.course_name} by ${sub.coach_name}. This course was recently added to our library and is ready for your feedback!`,
                detailedRatings: [
                    { label: 'Safety Rating', score: 'N/A', description: 'Under Review' },
                    { label: 'ROI Success', score: 'N/A', description: 'Under Review' },
                    { label: 'Recommendation', score: 'N/A', description: 'Pending Reviews' },
                    { label: 'Overall Rating', score: '0.0/5', description: 'New Course' }
                ],
                pros: ['Newly added course', 'Awaiting community feedback'],
                cons: ['No reviews yet'],
                worthItText: 'Be the first to leave a review for this newly approved course!',
                studentReviews: []
            }
        }
    }

    // 3. Fetch real reviews from Supabase
    if (course) {
        const { data: realReviews } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    username,
                    avatar_url
                )
            `)
            .eq('course_id', courseId)
            .eq('status', 'approved')
            .order('created_at', { ascending: false })

        if (realReviews && realReviews.length > 0) {
            const mappedReviews = realReviews.map((r: any) => ({
                id: r.id,
                user: r.profiles?.full_name || r.profiles?.username || 'Anonymous User',
                initials: (r.profiles?.full_name || 'A').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
                role: 'Student',
                rating: r.rating,
                comment: r.comment,
                verified: true,
                avatar: r.profiles?.avatar_url
            }))

            course.studentReviews = [...mappedReviews, ...(course.studentReviews || [])]
            course.reviews = course.studentReviews.length

            // 1. Calculate Overall Rating
            const sum = course.studentReviews.reduce((acc, curr) => acc + curr.rating, 0)
            course.rating = Number((sum / course.reviews).toFixed(1))

            // 2. Calculate ROI Success (Worth Investment)
            const worthCount = realReviews.filter((r: any) => r.worth_investment === true).length
            const roiPct = Math.round((worthCount / realReviews.length) * 100)

            // 3. Calculate Recommendation percentage
            const recCount = realReviews.filter((r: any) => r.recommend_friend === true).length
            const recPct = Math.round((recCount / realReviews.length) * 100)

            // 4. Calculate Safety Rating (Based on average rating)
            let safetyScore = 'N/A'
            let safetyDesc = 'Under Review'
            if (course.rating >= 4.5) { safetyScore = 'A+'; safetyDesc = 'High Safety' }
            else if (course.rating >= 4.0) { safetyScore = 'A'; safetyDesc = 'Safe' }
            else if (course.rating >= 3.0) { safetyScore = 'B'; safetyDesc = 'Moderate' }
            else { safetyScore = 'C'; safetyDesc = 'Caution' }

            // Update detailed ratings placeholder
            if (course.detailedRatings) {
                // Safety Rating
                course.detailedRatings[0].score = safetyScore === 'A+' || safetyScore === 'A' ? '98%' : safetyScore === 'B' ? '85%' : '65%'
                course.detailedRatings[0].description = safetyScore === 'A+' || safetyScore === 'A' ? 'Trusted & Secure' : safetyScore === 'B' ? 'Moderately Secure' : 'Needs Caution'

                // ROI Success
                course.detailedRatings[1].score = `${roiPct}%`
                course.detailedRatings[1].description = roiPct >= 80 ? 'Exceptional ROI' : roiPct >= 60 ? 'Strong ROI Potential' : 'Moderate ROI'

                // Recommendation
                course.detailedRatings[2].score = `${recPct}%`
                course.detailedRatings[2].description = recPct >= 80 ? 'Highly Recommended' : recPct >= 60 ? 'Generally Recommended' : 'Mixed Reviews'

                // Overall Rating
                course.detailedRatings[3].score = `${course.rating}`
                course.detailedRatings[3].description = course.rating >= 4.5 ? 'Excellent Overall Rating' : course.rating >= 4.0 ? 'Great Overall Rating' : 'Good Overall Rating'
            }

            // 5. Dynamic Pros & Cons (Top Tags)
            const allTags = realReviews.flatMap((r: any) => r.tags || [])
            const tagCounts: { [key: string]: number } = {}
            allTags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })

            const positiveTagMeta = [
                "Worth the Money", "Responsive Mentor", "Quick Wins", "High ROI",
                "Beginner Friendly", "Well Structured Group Calls", "Course Owner Cares",
                "Answers Questions in Timely Manner"
            ]
            const negativeTagMeta = [
                "Regret Buying", "Ghost Mentor", "Not Worth the Price", "Low ROI",
                "Beware of Upsells", "Course Is Ran by Other Coaches", "Brain Rot Group Calls",
                "Course Owner Not Reachable", "Long Wait Times for Answers", "Overpacked Group Calls",
                "Copy-Paste Strategies", "Mindset-Only"
            ]

            const topPros = positiveTagMeta
                .filter(tag => tagCounts[tag] > 0)
                .sort((a, b) => tagCounts[b] - tagCounts[a])
                .slice(0, 3)

            const topCons = negativeTagMeta
                .filter(tag => tagCounts[tag] > 0)
                .sort((a, b) => tagCounts[b] - tagCounts[a])
                .slice(0, 3)

            if (topPros.length > 0) course.pros = topPros
            if (topCons.length > 0) course.cons = topCons
            else if (topPros.length > 0) course.cons = ["No major issues reported by the community yet"]

            // 6. Dynamic Worth It Text
            if (roiPct >= 80) {
                course.worthItText = `Based on ${course.reviews} student reviews, this course is highly recommended. With an ${roiPct}% success rate, the community believes the investment is well worth it for those serious about ${course.category}.`
            } else if (roiPct >= 50) {
                course.worthItText = `The community has mixed but generally positive feedback. While ${roiPct}% of students found it worthwhile, some aspects like the price point or mentor accessibility were points of discussion.`
            } else {
                course.worthItText = `Caution is advised based on current student feedback. Only ${roiPct}% of reviewers felt the course lived up to its investment cost. We recommend reading individual reviews carefully before purchasing.`
            }
        }
    }

    if (!course) {
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
        <main className="min-h-screen bg-[#FDFDFD] font-montserrat overflow-x-hidden">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8 w-full overflow-hidden">
                <Breadcrumbs />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-6 md:mt-8">
                    {/* Main Content (Left) */}
                    <div className="flex-1 min-w-0">

                        {/* Course Header Section */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8 md:mb-10 items-center md:items-start text-center md:text-left">
                            <div className="w-[130px] h-[130px] md:w-[180px] md:h-[180px] rounded-[24px] overflow-hidden shadow-xl border border-gray-100 flex-shrink-0">
                                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col pt-1 w-full min-w-0">
                                <div className="flex flex-col md:flex-row items-center md:items-center justify-between mb-1 md:mb-0 w-full gap-4 md:gap-8 lg:gap-16">
                                    <h1 className="text-[30px] sm:text-[24px] font-montserrat md:text-[32px] font-[800] mb-2 text-black leading-[1.1] max-w-2xl whitespace-nowrap">
                                        {course.title}
                                    </h1>
                                    <div className="flex items-center gap-3 md:gap-4 shrink-0 mt-[-10px]">
                                        <div className="flex items-start">
                                            {/* Split Rating Layout for Precise Alignment */}
                                            {(() => {
                                                const ratingParts = (course?.rating || 0).toFixed(1).split('.')
                                                return (
                                                    <>
                                                        <span className="text-[25px] md:text-[27px] font-black text-black leading-none">{ratingParts[0]}.</span>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[25px] md:text-[27px] font-black text-black leading-none">{ratingParts[1]}</span>
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} className={`w-3 h-3 md:w-3 md:h-3 ${i < Math.floor(course?.rating || 0) ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-200'}`} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-[18px] md:text-[16px] text-black font-medium whitespace-nowrap leading-none mt-1">
                                                                {course?.reviews} reviews
                                                            </span>
                                                        </div>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 mb-6 mt-[10px]">
                                    <span className="text-[15px] md:text-[15px] font-semibold text-black">Created by</span>
                                    <span className="text-[#0088EE] font-bold text-[15px] md:text-[17px] uppercase">{course.author}</span>
                                    <div className="w-4 h-4 bg-[#0088EE] rounded-full flex items-center justify-center p-[2.5px] shadow-sm">
                                        <Check className="w-full h-full text-white stroke-[4]" />
                                    </div>
                                    <span className="text-black font-medium text-[15px] md:text-[17px] lowercase ml-0.5">({course.handle || '@' + course.author.toLowerCase().replace(' ', '')})</span>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-8 md:mb-10">
                                    {course.subcategories?.map(sub => (
                                        <span key={sub} className="text-[15px] md:text-[17px] font-[550] text-black">
                                            {sub}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex justify-center md:justify-start">
                                    <AuthGuardLink
                                        href={`/courses/${course.id}/write-review`}
                                        className="bg-[#0088EE] text-white font-[430] border border-black font-montserrat tracking-[-0.01em] py-2 px-5 rounded-[50px] flex items-center justify-center gap-2.5 w-full sm:w-fit hover:bg-blue-600 transition-all text-[14px] md:text-[15px] shadow-lg shadow-blue-100 group"
                                        message="Share your experience"
                                    >
                                        <div className="flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <img src="/icons/write-btn-icon.png" alt="Write Icon" className="w-5 h-5 object-contain" />
                                        </div>
                                        Leave a review
                                    </AuthGuardLink>
                                </div>
                            </div>
                        </div>

                        {/* Rating Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-12 md:mb-16 ">
                            {course.detailedRatings?.map((stat, i) => (
                                <div key={i} className="bg-white border border-black  p-4 rounded-[10px]  flex flex-col h-[120px] justify-between relative overflow-hidden group hover:border-[#0088EE]/50 transition-all shadow-[0_0_20px_rgba(0,0,0,0.42)]
hover:shadow-[0_0_35px_rgba(0,0,0,0.18)] min-w-0">
                                    <div className="z-10">
                                        <span className="text-[16px] font-semibold text-black block mb-2">{stat.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[26px] md:text-[25px] font-bold text-black leading-none">{stat.score}</span>
                                            {i === 0 && (
                                                <div className="w-[13px] h-[13px] bg-[#10B981] rounded-full flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-white stroke-[4]" />
                                                </div>
                                            )}
                                            {i === 1 && (
                                                <div className="w-[13px] h-[13px] bg-[#3B82F6] rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-white text-[9px] font-black">$</span>
                                                </div>
                                            )}
                                            {i === 2 && (
                                                <ThumbsUp className="w-[13px] h-[13px] text-[#8B5CF6] fill-[#8B5CF6] shrink-0" />
                                            )}
                                            {i === 3 && (
                                                <span className="text-[14px] font-bold text-gray-400 self-end mb-0.5">5/0</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="z-10">
                                        <span className={`text-[15px] font-[600] leading-tight block font-montserrat ${i === 0 ? 'text-[#10B981]' :
                                            i === 1 ? 'text-[#3B82F6]' :
                                                i === 2 ? 'text-[#8B5CF6]' :
                                                    'text-[#EAB308]'
                                            }`}>
                                            {stat.description}
                                        </span>
                                    </div>

                                    {/* Background Watermarks */}
                                    {i === 0 && <img src="/images/safety-rating.png" alt="" className="absolute -right-1 bottom-0 w-20 h-20 opacity-80 pointer-events-none group-hover:scale-110 transition-transform duration-500" />}
                                    {i === 1 && <img src="/images/ROI Succes.png" alt="" className="absolute -right-1 bottom-0 w-20 h-20 opacity-80 pointer-events-none group-hover:scale-110 transition-transform duration-500" />}
                                    {i === 2 && <img src="/images/recommended.png" alt="" className="absolute -right-1 bottom-0 w-20 h-20 opacity-80 pointer-events-none group-hover:scale-110 transition-transform duration-500" />}
                                    {i === 3 && <img src="/images/overal-rating.png" alt="" className="absolute -right-1 bottom-0 w-20 h-20 opacity-100 pointer-events-none group-hover:scale-110 transition-transform duration-500" />}
                                </div>
                            ))}
                        </div>

                        {/* About This Course */}
                        <section className="mb-12 md:mb-16">
                            <h2 className="text-[24px] md:text-[28px] font-[700] font-montserrat text-black mb-6">About this Course</h2>
                            <div className="text-gray-800 font-medium text-[16px] md:text-[18px] leading-relaxed space-y-4 max-w-4xl">
                                {course.fullDescription?.split('\n\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                            <button className="text-[#0088EE] font-bold mt-4 flex items-center text-[16px] md:text-[17px] gap-1 hover:underline">
                                Read more <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>
                        </section>

                        {/* Student Reviews */}
                        <section className="mb-12 md:mb-16">
                            <h3 className="text-[24px] md:text-[28px] font-[700] font-montserrat text-black mb-8">Student Reviews</h3>
                            <div className="flex flex-col md:flex-row gap-8 items-center mb-10 md:mb-12">
                                <div className="flex flex-col items-center">
                                    <span className="text-[44px] md:text-[52px] font-bold text-black leading-none">{course.rating || '0.0'}</span>
                                    <div className="flex my-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 md:w-4 md:h-4 ${i < Math.floor(course.rating) ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-black font-medium text-md">{course.reviews} {course.reviews === 1 ? 'Review' : 'Verified Reviews'}</span>
                                </div>
                                <div className="flex-1 w-full flex flex-col gap-2.5 max-w-xl">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = course.studentReviews?.filter(r => Math.round(r.rating) === star).length || 0
                                        const pct = course.reviews > 0 ? Math.round((count / course.reviews) * 100) : 0
                                        return (
                                            <div key={star} className="flex items-center text-black text-md gap-4 w-full">
                                                <span className="text-[14px] md:text-[15px] font-bold w-4">{star}★</span>
                                                <div className="flex-1 h-2.5 bg-gray-100 border border-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#FFD700] rounded-full" style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className="text-[13px] md:text-[14px] font-medium text-gray-500 w-10 text-right">{pct}%</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <ReviewSlider reviews={course.studentReviews || []} />
                        </section>

                        {/* Pros & Cons */}
                        <section className="mb-12 md:mb-16">
                            <h2 className="text-[24px] md:text-[28px] font-[700] text-black mb-8">Pros & Cons of the Course</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* The Good */}
                                <div className=" bg-white border-2 border-gray-50 rounded-[10px] p-6 md:p-8 flex flex-col gap-6 shadow-[0_0_20px_rgba(0,0,0,0.42)] hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 text-[#065F46] font-[600] text-[16px] md:text-[18px]">
                                        <div className="bg-[#EBFDF5] p-2 rounded-lg">
                                            <img src="/icons/the-good.png" alt="Good Icon" className="w-5 h-5 object-contain" />
                                        </div>
                                        The Good
                                    </div>
                                    <ul className="flex flex-col gap-4">
                                        {course.pros?.map((pro, i) => (
                                            <li key={i} className="flex gap-3 text-[15px] md:text-[17px] font-[550] text-gray-700 leading-normal">
                                                <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Things to Consider */}
                                <div className="bg-white border-2 border-gray-50 rounded-[10px] p-6 md:p-8 flex flex-col gap-6 shadow-[0_0_20px_rgba(0,0,0,0.42)]   hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 text-[#9F1239] font-[600] text-[16px] md:text-[18px]">
                                        <div className="bg-[#FEF2F2] p-2 rounded-lg">
                                            <img src="/icons/things-to-consider.png" alt="Consider Icon" className="w-5 h-5 object-contain" />
                                        </div>
                                        Things to Consider
                                    </div>
                                    <ul className="flex flex-col gap-4">
                                        {course.cons?.map((con, i) => (
                                            <li key={i} className="flex gap-3 text-[15px] md:text-[17px] font-[550] text-gray-700 leading-normal">
                                                <div className="w-4 h-[2px] bg-[#EF4444] flex-shrink-0 mt-2.5" />
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Is This Course Worth It? */}
                        <section className="mb-16 md:mb-20">
                            <h2 className="text-[24px] md:text-[28px] font-[700] text-black mb-6">Is This Course Worth It?</h2>
                            <div className="text-black font-medium text-[16px] md:text-[18px] leading-relaxed space-y-4 max-w-4xl">
                                <p>{course.worthItText}</p>
                                <p>{course.fullDescription?.split('\n\n')[1]}</p>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="w-full lg:w-[350px] flex flex-col gap-8 md:gap-10">
                        {/* Claim Course Widget */}
                        <div className="bg-[#DADADA] p-2 md:p-3 rounded-[10px] w-full border border-gray-100 flex flex-col gap-5 shadow-sm">
                            <div className="flex gap-4 items-start mt-2">
                                <img src="/icons/is-this.png" alt="Claim Icon" className="w-7 h-7 object-contain shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[20px] md:text-[22px] font-[600] text-black leading-tight">Is this your course?</h4>
                                    <p className="text-[15px] md:text-[16px] text-black font-medium mt-2 leading-relaxed">
                                        Claim your profile to manage reviews, reply to students, and update course details.
                                    </p>
                                </div>
                            </div>
                            <AuthGuardLink
                                href={`/courses/${course.id}/claim`}
                                className="bg-[#0088EE] mb-2 w-[190px] mr-[100px] border border-black m-auto text-white font-[500] font-montserrat py-1 px-6 rounded-full hover:bg-blue-600 transition-all text-[16px] shadow-lg shadow-blue-100 flex items-center justify-center"
                                message="Claim your course profile"
                            >
                                Claim this course
                            </AuthGuardLink>
                        </div>

                        {/* Trending In Business */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[20px] md:text-[22px] font-[700] text-black">Trending in Business</h3>
                            <div className="flex flex-col gap-8">
                                {trendingCourses.map(tc => (
                                    <Link href={tc.link} key={tc.id} className="flex gap-5 group">
                                        <div className="w-24 h-24 rounded-[18px] overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-50">
                                            <img src={tc.imageUrl} alt={tc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex flex-col justify-center gap-1">
                                            <h4 className="font-bold text-[17px] leading-tight text-black group-hover:text-[#0088EE] transition-colors">{tc.title}</h4>
                                            <p className="text-[14px] text-gray-500 font-medium">{tc.author}</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[14px] font-black text-[#FFB800]">{tc.rating}</span>
                                                <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Sidebar */}
                        <div className="w-full">
                            <NewsletterWidget />
                        </div>
                    </aside>
                </div>
            </div>

        </main>
    )
}
