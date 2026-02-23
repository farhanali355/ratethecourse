'use client'

import React, { useState, useEffect } from 'react'
import {
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Star,
    BookOpen,
    Activity,
    Calendar,
    Target,
    Zap
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { TrendLineChart, SimpleBarChart } from '@/components/admin/AnalyticsCharts'
import LiveActivityFeed from '@/components/admin/LiveActivityFeed'

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReviews: 0,
        totalCourses: 0,
        avgRating: 0,
        growthIndex: 12.5,
        engagementRate: 0
    })
    const [loading, setLoading] = useState(true)
    const [growthData, setGrowthData] = useState<{ label: string; value: number }[]>([])
    const [categoryData, setCategoryData] = useState<{ label: string; value: number }[]>([])

    const supabase = createClient()

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const [
                { count: userCount },
                { count: reviewCount },
                { count: courseCount },
                { data: reviews }
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('reviews').select('*', { count: 'exact', head: true }),
                supabase.from('course_submissions').select('*', { count: 'exact', head: true }),
                supabase.from('reviews').select('rating')
            ])

            const avg = reviews && reviews.length > 0
                ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
                : 0

            setStats({
                totalUsers: userCount || 0,
                totalReviews: reviewCount || 0,
                totalCourses: courseCount || 0,
                avgRating: avg,
                growthIndex: 14.2, // Simulated growth
                engagementRate: reviewCount && userCount ? Number(((reviewCount / userCount) * 1).toFixed(2)) : 0
            })

            // Mock Growth Data (30 days)
            setGrowthData([
                { label: 'Jan', value: 10 }, { label: 'Feb', value: 25 }, { label: 'Mar', value: 45 },
                { label: 'Apr', value: 30 }, { label: 'May', value: 65 }, { label: 'Jun', value: 85 },
                { label: 'Jul', value: 120 }
            ])

            // Mock Category Distribution
            setCategoryData([
                { label: 'Tech', value: 45 },
                { label: 'Business', value: 32 },
                { label: 'Creative', value: 24 },
                { label: 'Marketing', value: 38 },
                { label: 'Wellness', value: 12 }
            ])

        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="font-montserrat pb-20">
            {/* Page Header */}
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-[#0088EE]/10 text-[#0088EE] rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Platform Intelligence</span>
                </div>
                <h1 className="text-4xl font-black text-[#0D1B2A] dark:text-white">Analytics Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time performance metrics and user engagement insights.</p>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <KPICard
                    label="Total Members"
                    value={stats.totalUsers}
                    trend="+12%"
                    icon={Users}
                    color="blue"
                    isUp={true}
                />
                <KPICard
                    label="Active Engagement"
                    value={`${stats.engagementRate}x`}
                    trend="+5.2%"
                    icon={Target}
                    color="purple"
                    isUp={true}
                />
                <KPICard
                    label="Average Quality"
                    value={`${stats.avgRating}/5`}
                    trend="-2.1%"
                    icon={Star}
                    color="orange"
                    isUp={false}
                />
                <KPICard
                    label="Growth Index"
                    value={`${stats.growthIndex}%`}
                    trend="+8%"
                    icon={TrendingUp}
                    color="green"
                    isUp={true}
                />
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Growth Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 rounded-[40px] shadow-[0_12px_40px_rgb(0,0,0,0.03)] flex flex-col gap-8 h-full">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-[#0D1B2A] dark:text-white">User Acquisition</h3>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Rolling 30-day Growth Trend</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-gray-50 dark:bg-white/5 text-[#0D1B2A] dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">7D</button>
                                <button className="px-4 py-2 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">30D</button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[250px] flex items-center">
                            <TrendLineChart data={growthData} height={200} />
                        </div>

                        <div className="grid grid-cols-3 border-t border-gray-50 dark:border-white/5 pt-8 gap-4">
                            <QuickStat label="Direct Traffic" value="64%" />
                            <QuickStat label="Social Referral" value="32%" />
                            <QuickStat label="Other" value="4%" />
                        </div>
                    </div>

                    {/* Category Popularity */}
                    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 rounded-[40px] shadow-[0_12px_40px_rgb(0,0,0,0.03)] flex flex-col gap-8">
                        <div>
                            <h3 className="text-xl font-black text-[#0D1B2A] dark:text-white">Category Distribution</h3>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Popular Course Verticals by Submission</p>
                        </div>
                        <SimpleBarChart data={categoryData} height={180} />
                    </div>
                </div>

                {/* Sidebar: Activity & Alerts */}
                <div className="flex flex-col gap-8">
                    {/* Live Activity */}
                    <div className="bg-[#0D1B2A] dark:bg-white/5 p-8 rounded-[40px] shadow-2xl text-white border border-transparent dark:border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <h3 className="text-lg font-black tracking-tight">Live Pulse</h3>
                            </div>
                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                        <LiveActivityFeed />
                        <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                            View Historical Logs
                        </button>
                    </div>

                    {/* Platform Health */}
                    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 rounded-[40px] shadow-[0_12px_40px_rgb(0,0,0,0.03)]">
                        <h4 className="text-sm font-black text-[#0D1B2A] dark:text-white uppercase tracking-widest mb-6">System Health</h4>
                        <div className="space-y-6">
                            <HealthMetric label="API Latency" value="24ms" status="healthy" />
                            <HealthMetric label="DB Availability" value="99.9%" status="healthy" />
                            <HealthMetric label="Review Queue" value="Low" status="alert" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function KPICard({ label, value, trend, icon: Icon, color, isUp }: any) {
    const colors: any = {
        blue: 'bg-blue-50 dark:bg-[#0088EE]/10 text-blue-600 dark:text-[#0088EE]',
        purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
        green: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
    }
    return (
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 rounded-[32px] shadow-[0_10px_30px_rgb(0,0,0,0.02)] group hover:translate-y-[-4px] transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${colors[color]}`}>
                    <Icon className="w-5 h-5" strokeWidth={3} />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-lg ${isUp ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-3xl font-black text-[#0D1B2A] dark:text-white">{value}</h4>
        </div>
    )
}

function QuickStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[13px] font-black text-[#0D1B2A] dark:text-white">{value}</span>
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{label}</span>
        </div>
    )
}

function HealthMetric({ label, value, status }: { label: string, value: string, status: 'healthy' | 'alert' }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{label}</span>
            </div>
            <span className="text-xs font-black text-[#0D1B2A] dark:text-white">{value}</span>
        </div>
    )
}
