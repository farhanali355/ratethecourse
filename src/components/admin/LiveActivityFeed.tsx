'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, BookOpen, UserPlus, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Activity {
    id: string
    type: 'review' | 'course' | 'signup'
    title: string
    subtitle: string
    timestamp: string
}

export default function LiveActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([])
    const supabase = createClient()

    useEffect(() => {
        // Initial fetch of recent activity
        fetchRecentActivity()

        // Realtime Subscription
        const channel = supabase
            .channel('admin-activity')
            .on('postgres_changes' as any, { event: 'INSERT', table: 'reviews' }, (payload: any) => {
                handleNewActivity(payload.new, 'review')
            })
            .on('postgres_changes' as any, { event: 'INSERT', table: 'course_submissions' }, (payload: any) => {
                handleNewActivity(payload.new, 'course')
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchRecentActivity = async () => {
        // This is a simplified fetch, ideally you'd join across tables
        const { data: reviews } = await supabase.from('reviews').select(`*, course_submissions:course_id(course_name)`).limit(5).order('created_at', { ascending: false })
        const { data: courses } = await supabase.from('course_submissions').select('*').limit(5).order('created_at', { ascending: false })

        const combined: Activity[] = [
            ...(reviews || []).map((r: any) => ({
                id: r.id,
                type: 'review' as const,
                title: 'New Review Submitted',
                subtitle: r.course_submissions?.course_name || 'A course',
                timestamp: r.created_at
            })),
            ...(courses || []).map((c: any) => ({
                id: c.id,
                type: 'course' as const,
                title: 'New Course Submission',
                subtitle: c.course_name,
                timestamp: c.created_at
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

        setActivities(combined)
    }

    const handleNewActivity = (data: any, type: 'review' | 'course') => {
        const newAct: Activity = {
            id: data.id,
            type,
            title: type === 'review' ? 'New Review Submitted' : 'New Course Submission',
            subtitle: type === 'review' ? 'Refreshing metadata...' : data.course_name,
            timestamp: new Date().toISOString()
        }
        setActivities(prev => [newAct, ...prev].slice(0, 10))
    }

    return (
        <div className="space-y-6">
            {activities.length === 0 ? (
                <div className="py-10 text-center">
                    <Clock className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waiting for activity...</p>
                </div>
            ) : (
                activities.map((activity, i) => (
                    <div key={activity.id} className="flex gap-4 group animate-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${activity.type === 'review' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            activity.type === 'course' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-green-50 text-green-600 border-green-100'
                            }`}>
                            {activity.type === 'review' ? <MessageSquare className="w-5 h-5" /> :
                                activity.type === 'course' ? <BookOpen className="w-5 h-5" /> :
                                    <UserPlus className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#0D1B2A] truncate uppercase tracking-tight">{activity.title}</p>
                            <p className="text-[11px] text-gray-400 font-bold truncate mt-0.5">{activity.subtitle}</p>
                            <span className="text-[9px] text-[#0088EE] font-black uppercase tracking-widest mt-1 block">
                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
