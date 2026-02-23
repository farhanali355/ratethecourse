import Link from 'next/link'
import { Star, MapPin, CheckCircle, Edit, ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { UserReviews } from '@/components/features/profile/UserReviews'

// Mock Data for Recently Viewed
const recentlyViewed = [
    {
        type: "Course",
        title: "Web Design Mastery 2024",
        subtitle: "By Sarah Connor",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940&auto=format&fit=crop"
    },
    {
        type: "Coach",
        title: "Jessica Lee: Career Prep",
        subtitle: "Interview Coaching",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2776&auto=format&fit=crop"
    },
    {
        type: "Course",
        title: "Python for Data Science",
        subtitle: "By DataCamp Inc.",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop"
    }
]

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Fetch profile from database
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch user's submissions
    const { data: userSubmissions } = await supabase
        .from('course_submissions')
        .select('*')
        .eq('submitted_by_uid', user.id)
        .order('created_at', { ascending: false })

    // Calculate aggregate rating from submissions
    const approvedSubIds = userSubmissions?.filter(s => s.status === 'approved').map(s => s.id) || []

    let totalReviewsCount = 0
    let averageProfileRating = 0.0

    if (approvedSubIds.length > 0) {
        const { data: profileReviews } = await supabase
            .from('reviews')
            .select('rating')
            .in('course_id', approvedSubIds)
            .eq('status', 'approved')

        if (profileReviews && profileReviews.length > 0) {
            totalReviewsCount = profileReviews.length
            const sum = profileReviews.reduce((acc, curr) => acc + curr.rating, 0)
            averageProfileRating = Number((sum / totalReviewsCount).toFixed(1))
        }
    }

    const fullName = profile?.full_name || user.user_metadata?.full_name || "User"
    const username = profile?.username || user.email?.split('@')[0] || "username"
    const profileImage = profile?.avatar_url || user.user_metadata?.avatar_url || "/images/profile/logo.jpg"

    // Fetch user's actual reviews
    const { data: allUserReviews } = await supabase
        .from('reviews')
        .select(`
            *,
            course_submissions(course_name, thumbnail_url),
            coaches(name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

    const formattedReviews = (allUserReviews || []).map((r: any) => ({
        id: r.id,
        course_id: r.course_id,
        coach_id: r.coach_id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        course_name: r.course_submissions?.course_name,
        coach_name: r.coaches?.name,
        worth_investment: r.worth_investment,
        recommend_friend: r.recommend_friend,
        avatar: r.course_submissions?.thumbnail_url // Or profile avatar? User specifically asked for "unki image" (profile image)
    }))

    return (
        <div className="min-h-screen bg-white font-montserrat">

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    <div className="flex gap-6">
                        <div className="relative">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-34 h-34 rounded-2xl object-cover shadow-sm bg-gray-50 border border-gray-100"
                            />
                            {profile?.is_verified && (
                                <div className="absolute -bottom-2 -right-2 bg-black text-white rounded-full p-1 border-2 border-white">
                                    <CheckCircle className="w-3 h-3" strokeWidth={4} />
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <h1 className="text-3xl font-extrabold font-montserrat text-[#0D1B2A]">{fullName}</h1>
                            <p className="text-black font-medium tracking-tight">@{username}</p>

                            <div className="flex items-center gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                    <Star className="w-5 h-5 fill-current" />
                                    {averageProfileRating.toFixed(1)}
                                    <span className="text-black font-normal ml-1 font-semibold">({totalReviewsCount} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1 text-black font-semibold">
                                    <MapPin className="w-4 h-4" />
                                    Background Not Verified
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                        {user.user_metadata?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-2 bg-[#0D1B2A] text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition shadow-sm">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-sm">Admin Panel</span>
                            </Link>
                        )}
                        <Link href="/settings" className="flex items-center gap-2 bg-[#0088EE] text-white px-2 py-1.5 rounded-full  font-semibold border border-black mt-5  font-montserrat  hover:bg-blue-600 transition shadow-sm">
                            <div className='flex items-center gap-2 px-6 py-1'>
                                <Edit className="w-4 h-4" />
                                <span className="text-sm">Edit Profile</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Column (Reviews & Submissions) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Reviews Section */}
                        <UserReviews initialReviews={formattedReviews} />

                        {/* Submissions Section */}
                        {userSubmissions && userSubmissions.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Submissions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userSubmissions.map((sub: any) => (
                                        <div key={sub.id} className="group border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-white relative overflow-hidden">
                                            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl ${sub.status === 'approved' ? 'bg-green-500 text-white' :
                                                sub.status === 'rejected' ? 'bg-red-500 text-white' :
                                                    'bg-[#0088EE] text-white'
                                                }`}>
                                                {sub.status}
                                            </div>
                                            <p className="text-[10px] font-black text-[#0088EE] uppercase tracking-widest mb-1">{sub.coach_name}</p>
                                            <h3 className="font-bold text-[#0D1B2A] text-lg leading-tight mb-2 group-hover:text-[#0088EE] transition">{sub.course_name}</h3>
                                            <p className="text-xs text-gray-400 font-medium mb-4">Submitted {new Date(sub.created_at).toLocaleDateString()}</p>
                                            <a
                                                href={sub.course_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-bold text-[#0D1B2A] hover:underline"
                                            >
                                                View Course Source
                                                <Edit className="w-3 h-3 text-[#0088EE]" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Recently Viewed) */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
                        <div className="space-y-6">
                            {recentlyViewed.map((item, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="overflow-hidden rounded-xl mb-3 border border-gray-100 shadow-sm">
                                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover group-hover:scale-105 transition duration-300" />
                                    </div>
                                    <p className="text-xs font-bold text-[#0088EE] mb-1 uppercase tracking-wider">{item.type}</p>
                                    <h3 className="font-bold text-gray-900 leading-snug group-hover:text-[#0088EE] transition">{item.title}</h3>
                                    <p className="text-sm text-black mt-1">{item.subtitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    )
}
