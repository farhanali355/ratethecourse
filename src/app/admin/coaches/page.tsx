'use client'

import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    MoreHorizontal,
    UserCheck,
    Star,
    MapPin,
    Award,
    TrendingUp,
    MessageSquare,
    BookOpen,
    ShieldCheck,
    AlertCircle,
    Trash2,
    Activity,
    Ban
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { deleteUser } from '@/app/actions/admin' // Shared server action for user deletion (coaches are users)
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal'

export default function CoachManagementPage() {
    const supabase = createClient()
    const [coaches, setCoaches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [coachToDelete, setCoachToDelete] = useState<any | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        fetchCoaches()
    }, [])

    const fetchCoaches = async () => {
        setLoading(true)
        try {
            // Fetch users with role 'coach'
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'coach')
                .order('created_at', { ascending: false })

            if (error) throw error

            // TODO: In a real app, we would join with reviews/courses tables to get these stats
            // For now, we will mock the stats or fetch them if tables exist
            // Let's check course_submissions count for each coach
            let coachesWithStats = []
            if (profiles) {
                // Parallel fetch for stats could be heavy, ideally use a view or RPC
                // Doing simple mapping for now
                coachesWithStats = profiles.map(profile => ({
                    ...profile,
                    expertise: 'General', // Placeholder as 'expertise' might not be in profiles schema yet
                    rating: '5.0', // Placeholder
                    reviews: '0', // Placeholder
                    courses: '0', // Placeholder
                    joinDate: new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                }))
            }

            setCoaches(coachesWithStats)
        } catch (error: any) {
            toast.error('Failed to fetch coaches: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (coach: any) => {
        setCoachToDelete(coach)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteCoach = async () => {
        if (!coachToDelete) return

        setIsDeleting(true)
        try {
            const result = await deleteUser(coachToDelete.id)
            if (result.error) throw new Error(result.error)

            toast.success('Coach deleted successfully')
            setCoaches(prev => prev.filter(c => c.id !== coachToDelete.id))
            setIsDeleteModalOpen(false)
            setCoachToDelete(null)
        } catch (error: any) {
            toast.error('Failed to delete coach: ' + error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredCoaches = coaches.filter(coach => {
        return (coach.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (coach.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    })

    const coachHighlights = [
        { label: 'Total Coaches', value: coaches.length.toString(), icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Courses Live', value: '0', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' }, // Placeholder
        { label: 'Avg Rating', value: '5.0', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' }, // Placeholder
        { label: 'Verification Req.', value: '0', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' }, // Placeholder
    ]

    return (
        <div className="font-montserrat relative min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white">Coach Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Onboard, verify, and monitor platform instructors.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-2xl text-sm font-bold hover:bg-black dark:hover:bg-[#0077DD] transition-all shadow-lg shadow-gray-200 dark:shadow-none">
                        <Award className="w-4 h-4" />
                        Verify New Apps
                    </button>
                </div>
            </header>

            {/* Coach Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {coachHighlights.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 hover:translate-y-[-2px] transition-transform">
                        <div className={`p-4 rounded-2xl ${stat.bg} dark:bg-white/10 ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                            <h4 className="text-xl font-black text-[#0D1B2A] dark:text-white leading-none">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search coaches by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0088EE20] dark:focus:ring-[#0088EE40] transition-all font-medium shadow-sm text-[#0D1B2A] dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors shadow-sm">
                        <Filter className="w-4 h-4" />
                        Sort By Rating
                    </button>
                    <div className="h-10 w-px bg-gray-100 dark:bg-white/10 mx-1"></div>
                    <button className="px-5 py-3 text-[#0088EE] text-sm font-black hover:underline">
                        Approve All Pending
                    </button>
                </div>
            </div>

            {/* Coaches Table */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FBFCFD] dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-10 py-6">Instructor</th>
                                <th className="px-6 py-6">Expertise</th>
                                <th className="px-6 py-6">Performance</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-[#0088EE] border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading coaches...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCoaches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                        No coaches found
                                    </td>
                                </tr>
                            ) : (
                                filteredCoaches.map((coach) => (
                                    <tr key={coach.id} className="group hover:bg-[#F8FAFC50] dark:hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 shrink-0 overflow-hidden font-black text-xs shadow-sm">
                                                    {coach.avatar_url ? (
                                                        <img src={coach.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (coach.full_name || 'C').split(' ').map((n: string) => n[0]).join('')
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-[#0D1B2A] dark:text-white text-sm">{coach.full_name || 'Unknown Coach'}</p>
                                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">Joined {coach.joinDate}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                                                <span className="font-bold text-[#0D1B2A] dark:text-white text-xs">{coach.expertise}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-1 uppercase tracking-tighter">{coach.courses} Courses Published</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-black text-[#0D1B2A] dark:text-white text-sm">{coach.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                                                <MessageSquare className="w-3 h-3" />
                                                {coach.reviews} Reviews
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-gray-500">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${coach.status === 'active' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'
                                                }`}>
                                                {coach.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(coach)}
                                                    className="p-2 text-gray-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteCoach}
                title="Delete Coach"
                description={`Are you sure you want to permanently delete coach "${coachToDelete?.full_name}"? This action cannot be undone.`}
                loading={isDeleting}
            />
        </div>
    )
}

