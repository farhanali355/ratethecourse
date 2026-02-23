'use client'

import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Star,
    Flag,
    MessageSquare,
    BookOpen,
    TrendingUp,
    FileText,
    UserCheck,
    Clock,
    MoreHorizontal
} from 'lucide-react'

import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import ModerationActionModal from '@/components/admin/ModerationActionModal'

export default function ModerationPage() {
    const [activeTab, setActiveTab] = useState('Course Submissions')
    const [courses, setCourses] = useState<any[]>([])
    const [reviews, setReviews] = useState<any[]>([])
    const [flaggedUsers, setFlaggedUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [modalConfig, setModalConfig] = useState<{
        title: string
        itemName: string
        type: 'course' | 'review'
    }>({ title: '', itemName: '', type: 'course' })

    const supabase = createClient()
    const tabs = ['Course Submissions', 'Student Reviews', 'Flagged Content']

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        setLoading(true)
        try {
            await Promise.all([
                fetchCourses(),
                fetchReviews(),
                fetchFlaggedUsers()
            ])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCourses = async () => {
        const { data, error } = await supabase
            .from('course_submissions')
            .select('*')
            .order('created_at', { ascending: false })
        if (!error) setCourses(data || [])
    }

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                course_submissions:course_id (
                    course_name,
                    coach_name
                ),
                profiles:user_id (
                    full_name,
                    email,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false })
        if (!error) setReviews(data || [])
    }

    const fetchFlaggedUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('status', 'flagged')
            .order('created_at', { ascending: false })
        if (!error) setFlaggedUsers(data || [])
    }

    const openModerationModal = (item: any, type: 'course' | 'review') => {
        setSelectedItem(item)
        setModalConfig({
            title: `Moderate ${type === 'course' ? 'Course' : 'Review'}`,
            itemName: type === 'course' ? item.course_name : `Review by ${item.profiles?.full_name}`,
            type
        })
        setIsModalOpen(true)
    }

    const handleModerationConfirm = async (result: { status: 'approved' | 'rejected', note: string }) => {
        if (!selectedItem) return

        const table = modalConfig.type === 'course' ? 'course_submissions' : 'reviews'
        const toastId = toast.loading(`Updating ${modalConfig.type} status...`)

        try {
            const updatePayload: any = { status: result.status }
            if (result.status === 'rejected' && result.note) {
                updatePayload.admin_note = result.note
            }

            const { error } = await supabase
                .from(table)
                .update(updatePayload)
                .eq('id', selectedItem.id)

            if (error) throw error

            toast.success(`${modalConfig.type === 'course' ? 'Course' : 'Review'} ${result.status} successfully`, { id: toastId })
            setIsModalOpen(false)
            fetchAllData() // Refresh everything
        } catch (error: any) {
            toast.error(`Action failed: ${error.message}`, { id: toastId })
        }
    }

    return (
        <div className="font-montserrat">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white">Moderation Command Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Ensure platform quality and authenticity across all submissions.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search everything..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0088EE20] dark:focus:ring-[#0088EE40] transition-all font-medium text-[#0D1B2A] dark:text-white"
                        />
                    </div>
                </div>
            </header>

            {/* Top Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    label="Pending Courses"
                    value={courses.filter(c => c.status === 'pending').length}
                    icon={BookOpen}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    label="Unmoderated Reviews"
                    value={reviews.filter(r => r.status === 'pending').length}
                    icon={MessageSquare}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatCard
                    label="Urgent Flags"
                    value={flaggedUsers.length}
                    icon={Flag}
                    color="text-red-600"
                    bg="bg-red-50"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mb-8 border-b border-gray-100 dark:border-white/5 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold transition-all relative shrink-0 ${activeTab === tab ? 'text-[#0088EE]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0088EE] rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* List Section */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                        <div className="w-10 h-10 border-4 border-[#0088EE20] border-t-[#0088EE] rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Syncing platform data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {activeTab === 'Course Submissions' && (
                            <table className="w-full text-left">
                                <thead className="bg-[#FBFCFD] dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5 uppercase text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest">
                                    <tr>
                                        <th className="px-10 py-5">Course / Coach</th>
                                        <th className="px-6 py-5">Category</th>
                                        <th className="px-6 py-5">Submitted At</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-10 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {courses.length === 0 ? (
                                        <EmptyState message="No course submissions found." />
                                    ) : (
                                        courses.map((course) => (
                                            <tr key={course.id} className="group hover:bg-[#F8FAFC50] transition-colors">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 overflow-hidden shrink-0 border border-blue-100">
                                                            {course.thumbnail_url ? (
                                                                <img src={course.thumbnail_url} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[#0088EE] font-black text-xs uppercase">
                                                                    {course.course_name?.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#0D1B2A] dark:text-white text-sm">{course.course_name}</p>
                                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Coach: {course.coach_name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-bold text-gray-500 dark:text-gray-400 text-xs">{course.category}</td>
                                                <td className="px-6 py-6 font-medium text-gray-400 dark:text-gray-500 text-xs">
                                                    {new Date(course.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <StatusBadge status={course.status} />
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <button
                                                        onClick={() => openModerationModal(course, 'course')}
                                                        className="px-4 py-2 bg-[#F8FAFC] dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0D1B2A] dark:hover:bg-white/[0.08] hover:text-white transition-all border border-gray-100 dark:border-white/5"
                                                    >
                                                        Moderate
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'Student Reviews' && (
                            <table className="w-full text-left">
                                <thead className="bg-[#FBFCFD] dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5 uppercase text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest">
                                    <tr>
                                        <th className="px-10 py-5">Reviewer</th>
                                        <th className="px-6 py-5">Course</th>
                                        <th className="px-6 py-5">Rating</th>
                                        <th className="px-6 py-5">Review Preview</th>
                                        <th className="px-10 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {reviews.length === 0 ? (
                                        <EmptyState message="No reviews found." />
                                    ) : (
                                        reviews.map((review) => (
                                            <tr key={review.id} className="group hover:bg-[#F8FAFC50] transition-colors">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-black text-[10px] shrink-0">
                                                            {review.profiles?.full_name?.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-[#0D1B2A] dark:text-white text-sm">{review.profiles?.full_name}</span>
                                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{review.profiles?.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-bold text-[#0D1B2A] dark:text-white text-sm truncate max-w-[150px]">
                                                    {review.course_submissions?.course_name}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs font-black dark:text-white">{review.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-xs text-gray-400 font-medium truncate max-w-[200px]">
                                                    {review.comment}
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <button
                                                        onClick={() => openModerationModal(review, 'review')}
                                                        className="px-4 py-2 bg-[#F8FAFC] dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0D1B2A] dark:hover:bg-white/[0.08] hover:text-white transition-all border border-gray-100 dark:border-white/5"
                                                    >
                                                        Moderate
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'Flagged Content' && (
                            <table className="w-full text-left">
                                <thead className="bg-[#FBFCFD] dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5 uppercase text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest">
                                    <tr>
                                        <th className="px-10 py-5">Flagged User</th>
                                        <th className="px-6 py-5">Reason / Status</th>
                                        <th className="px-6 py-5">Reported At</th>
                                        <th className="px-10 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {flaggedUsers.length === 0 ? (
                                        <EmptyState message="No flagged users found." />
                                    ) : (
                                        flaggedUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-red-50/20 transition-colors">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-black text-[10px] shrink-0 border border-red-100">
                                                            {user.full_name?.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-[#0D1B2A] dark:text-white text-sm">{user.full_name}</span>
                                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">@{user.username}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-full">
                                                        <Flag className="w-2.5 h-2.5 text-red-600 dark:text-red-400" />
                                                        <span className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase">Suspicious Activity</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium text-gray-400 dark:text-gray-500 text-xs">
                                                    Recently Flagged
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-8 flex justify-between items-center text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4">
                <p>Showing latest platform activity</p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-[#0D1B2A] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Prev</button>
                    <button className="px-4 py-2 rounded-xl bg-[#0D1B2A] dark:bg-[#0088EE] text-white">1</button>
                    <button className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-[#0D1B2A] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Next</button>
                </div>
            </div>

            {/* Decision Modal */}
            <ModerationActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleModerationConfirm}
                title={modalConfig.title}
                itemName={modalConfig.itemName}
                type={modalConfig.type}
            />
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex justify-between items-start hover:translate-y-[-4px] transition-all cursor-default group">
            <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 group-hover:text-[#0088EE] transition-colors">{label}</p>
                <h4 className="text-3xl font-black text-[#0D1B2A] dark:text-white">{value}</h4>
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] font-black text-[#00C853] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +5% this week
                    </span>
                </div>
            </div>
            <div className={`p-4 rounded-2xl ${bg} dark:bg-white/5 ${color} transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" strokeWidth={2.5} />
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        approved: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20',
        pending: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20',
        rejected: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20'
    }
    return (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${styles[status] || styles.pending}`}>
            {status || 'pending'}
        </span>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <tr>
            <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                {message}
            </td>
        </tr>
    )
}
