'use client'

import React, { useState, useEffect } from 'react'
import {
    FileText,
    UserCheck,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Users,
    MessageSquare,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminDashboardPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingApprovals: 0,
        totalCourses: 0,
        totalReviews: 0
    })
    const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])
    const [recentReviews, setRecentReviews] = useState<any[]>([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            // Fetch Stats concurrently
            const [
                { count: userCount },
                { count: pendingCount },
                { count: courseCount },
                { count: reviewCount },
                { data: latestSubmissions },
                { data: latestReviews }
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('course_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                supabase.from('course_submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
                supabase.from('reviews').select('*', { count: 'exact', head: true }),
                supabase.from('course_submissions').select('*').order('created_at', { ascending: false }).limit(5),
                supabase.from('reviews').select('*, profiles(full_name), course_submissions(course_name)').order('created_at', { ascending: false }).limit(5)
            ])

            setStats({
                totalUsers: userCount || 0,
                pendingApprovals: pendingCount || 0,
                totalCourses: courseCount || 0,
                totalReviews: reviewCount || 0
            })
            setRecentSubmissions(latestSubmissions || [])
            setRecentReviews(latestReviews || [])

        } catch (error: any) {
            toast.error('Failed to load dashboard data: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const dashboardCards = [
        {
            label: 'Total Members',
            value: stats.totalUsers,
            icon: Users,
            iconBg: 'bg-[#E3F2FD]',
            iconColor: 'text-[#0088EE]',
            href: '/admin/users'
        },
        {
            label: 'Pending Approvals',
            value: stats.pendingApprovals,
            icon: FileText,
            iconBg: 'bg-[#FFF3E0]',
            iconColor: 'text-[#FF9800]',
            href: '/admin/courses'
        },
        {
            label: 'Live Courses',
            value: stats.totalCourses,
            icon: UserCheck,
            iconBg: 'bg-[#E8F5E9]',
            iconColor: 'text-[#4CAF50]',
            href: '/admin/courses'
        },
        {
            label: 'Student Reviews',
            value: stats.totalReviews,
            icon: MessageSquare,
            iconBg: 'bg-[#F3E5F5]',
            iconColor: 'text-[#9C27B0]',
            href: '/admin/moderation'
        }
    ]

    return (
        <div className="font-montserrat">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Platform overview and quick actions.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="text-sm font-bold text-[#0088EE] hover:bg-blue-50 dark:hover:bg-[#0088EE]10 px-4 py-2 rounded-xl transition-colors"
                >
                    Refresh Data
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {dashboardCards.map((stat, idx) => (
                    <Link key={idx} href={stat.href}>
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group hover:shadow-lg dark:hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 group-hover:text-[#0088EE] transition-colors">{stat.label}</p>
                                    <h2 className="text-3xl font-black text-[#0D1B2A] dark:text-white">
                                        {loading ? <span className="text-gray-200 dark:text-gray-800 animate-pulse">...</span> : stat.value}
                                    </h2>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.iconBg} dark:bg-white/5 ${stat.iconColor} group-hover:rotate-12 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex items-center text-[#0088EE] font-bold text-[11px] uppercase tracking-wider gap-1">
                                View Details <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Recent Activity: Submissions */}
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-extrabold text-[#0D1B29] dark:text-white">Recent Submissions</h3>
                        <Link href="/admin/courses" className="text-[#0088EE] font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            [...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 dark:bg-white/5 animate-pulse rounded-2xl" />)
                        ) : recentSubmissions.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 dark:text-gray-600 font-bold uppercase text-[10px] tracking-widest">No recent submissions</div>
                        ) : recentSubmissions.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-50 dark:hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden bg-gray-50 dark:bg-white/5 shrink-0">
                                        <img src={sub.thumbnail_url || '/images/default-course.jpg'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0D1B2A] dark:text-white text-sm line-clamp-1">{sub.course_name}</h4>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">by {sub.coach_name}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${sub.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                    sub.status === 'approved' ? 'bg-green-100 text-green-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                    {sub.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-extrabold text-[#0D1B29] dark:text-white">Latest Reviews</h3>
                        <Link href="/admin/moderation" className="text-[#0088EE] font-black text-xs uppercase tracking-widest hover:underline">Moderate</Link>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            [...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 dark:bg-white/5 animate-pulse rounded-2xl" />)
                        ) : recentReviews.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 dark:text-gray-600 font-bold uppercase text-[10px] tracking-widest">No recent reviews</div>
                        ) : recentReviews.map((review) => (
                            <div key={review.id} className="p-4 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-50 dark:hover:border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-[#0D1B2A] dark:text-white">{review.profiles?.full_name || 'Anonymous'}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">rated</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-green-500 dark:text-green-400" />
                                        <span className="text-xs font-black text-[#0D1B2A] dark:text-white">{review.rating}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-1">"{review.comment}"</p>
                                <p className="text-[9px] font-black text-[#0088EE] uppercase tracking-widest">
                                    {review.course_submissions?.course_name || 'Deleted Course'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-12">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#0D1B29] dark:text-white">Platform Growth</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Review activity (Last 7 Days)</p>
                    </div>
                    <Link
                        href="/admin/analytics"
                        className="text-[#0088EE] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline"
                    >
                        Details
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex items-end justify-between h-48 gap-4 px-4">
                    {[
                        { day: 'Mon', val: 65 },
                        { day: 'Tue', val: 45 },
                        { day: 'Wed', val: 85 },
                        { day: 'Thu', val: 30 },
                        { day: 'Fri', val: 95 },
                        { day: 'Sat', val: 70 },
                        { day: 'Sun', val: 55 }
                    ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                            <div className="w-full relative flex flex-col justify-end h-32">
                                <div
                                    className="w-full bg-[#0088EE10] dark:bg-[#0088EE20] rounded-xl group-hover:bg-[#0088EE] transition-all duration-500 relative"
                                    style={{ height: `${item.val}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0D1B2A] dark:bg-[#0088EE] text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.val}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{item.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions / Platform Health */}
            <div className="bg-[#0D1B2A] dark:bg-[#0088EE]/10 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl border border-transparent dark:border-[#0088EE]/20">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                            <AlertCircle className="text-orange-400 w-8 h-8" />
                            Review Required
                        </h3>
                        <p className="text-gray-400 dark:text-gray-300 font-bold text-sm max-w-md">There are <span className="text-white font-black">{stats.pendingApprovals} courses</span> waiting for verification. Ensure quality standards before approving.</p>
                    </div>
                    <Link
                        href="/admin/courses"
                        className="bg-[#0088EE] hover:bg-white hover:text-[#0D1B2A] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 shrink-0"
                    >
                        Go to Moderation Queue
                    </Link>
                </div>
                {/* Abstract patterns in bg */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0088EE20] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl opacity-50" />
            </div>
        </div>
    )
}
