'use client'

import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Star,
    BookOpen,
    TrendingUp,
    Plus,
    Edit3,
    CheckCircle2,
    XCircle,
    Flag,
    Clock
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import { deleteCourse } from '@/app/actions/admin'
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal'
import CourseFormModal from '@/components/admin/CourseFormModal'

type CourseStatus = 'approved' | 'pending' | 'rejected'


export default function AdminCoursesPage() {
    const supabase = createClient()
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<CourseStatus>('approved')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState<any | null>(null)

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState<any | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        fetchCourses()
    }, [activeTab])

    const fetchCourses = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('course_submissions')
                .select('*')
                .eq('status', activeTab)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Fetch reviews only for approved courses to show ratings
            if (activeTab === 'approved' && data) {
                const { data: allReviews } = await supabase
                    .from('reviews')
                    .select('course_id, rating')
                    .eq('status', 'approved')

                const coursesWithStats = data.map(course => {
                    const courseReviews = allReviews?.filter(r => r.course_id === course.id) || []
                    const count = courseReviews.length
                    const avg = count > 0
                        ? (courseReviews.reduce((acc, curr) => acc + curr.rating, 0) / count).toFixed(1)
                        : '0.0'

                    return { ...course, reviewCount: count, avgRating: avg }
                })
                setCourses(coursesWithStats)
            } else {
                setCourses(data || [])
            }
        } catch (error: any) {
            toast.error('Failed to load courses')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: CourseStatus) => {
        const loadingToast = toast.loading(`Updating status to ${newStatus}...`)
        try {
            const { error } = await supabase
                .from('course_submissions')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error
            toast.success(`Course successfully ${newStatus === 'approved' ? 'approved' : 'rejected'}`)
            fetchCourses()
        } catch (error: any) {
            toast.error('Update failed: ' + error.message)
        } finally {
            toast.dismiss(loadingToast)
        }
    }

    const handleDelete = async (id: string, courseName: string) => {
        setCourseToDelete({ id, courseName })
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return

        setIsDeleting(true)
        try {
            const result = await deleteCourse(courseToDelete.id)
            if (result.error) throw new Error(result.error)

            toast.success("Course deleted successfully")
            setCourses(prev => prev.filter(c => c.id !== courseToDelete.id))
            setIsDeleteModalOpen(false)
            setCourseToDelete(null)
            fetchCourses() // Refresh to be sure
        } catch (error: any) {
            toast.error("Failed to delete course: " + error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredCourses = courses.filter(course =>
        course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.coach_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const openEditModal = (course: any) => {
        setEditingCourse(course)
        setIsModalOpen(true)
    }

    const openAddModal = () => {
        setEditingCourse(null)
        setIsModalOpen(true)
    }

    return (
        <div className="font-montserrat">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white">Course Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Add, edit, approve or moderate platform courses.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={openAddModal}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-2xl text-sm font-bold hover:bg-black dark:hover:bg-[#0077DD] transition-all shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Course
                    </button>
                </div>
            </header>

            {/* Tabs & Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                <div className="flex bg-[#F8FAFC] dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'approved' ? 'bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        Live Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        Review Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'rejected' ? 'bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        Rejected
                    </button>
                </div>

                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                    <input
                        type="text"
                        placeholder="Search courses or coaches..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0D1B2A] border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#0088EE20] transition-all text-[#0D1B2A] dark:text-white"
                    />
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white dark:bg-[#0D1B2A] border border-gray-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FBFCFD] dark:bg-white/5 border-b border-gray-50 dark:border-white/5 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-10 py-6">Course Information</th>
                                <th className="px-6 py-6 text-center">Featured</th>
                                {activeTab === 'approved' && <th className="px-6 py-6">Stats</th>}
                                <th className="px-6 py-6">Added On</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-[#0088EE] border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Scanning {activeTab} courses...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                        No courses found in this category
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="group hover:bg-[#F8FAFC50] transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 overflow-hidden shrink-0 border border-gray-100 dark:border-white/10 relative">
                                                    <img src={course.thumbnail_url || '/images/default-course.jpg'} alt="" className="w-full h-full object-cover" />
                                                    {course.status === 'pending' && <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-orange-600" /></div>}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-extrabold text-[#0D1B2A] dark:text-white text-base group-hover:text-[#0088EE] transition-colors">{course.course_name}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">Coach: {course.coach_name} • {course.category}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            {course.is_featured ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    <Star className="w-3 h-3 fill-amber-600 dark:fill-amber-500" /> Featured
                                                </div>
                                            ) : <span className="text-gray-200 dark:text-gray-800">—</span>}
                                        </td>
                                        {activeTab === 'approved' && (
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-[#0D1B2A] dark:text-white">{course.avgRating || '0.0'}</span>
                                                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Rating</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-[#0D1B2A] dark:text-white">{course.reviewCount || 0}</span>
                                                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Reviews</span>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-6 text-xs text-gray-400 font-bold">
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {activeTab === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(course.id, 'approved')}
                                                            className="p-2.5 text-green-500 hover:bg-green-50 rounded-xl transition-all"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(course.id, 'rejected')}
                                                            className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => openEditModal(course)}
                                                    className="p-2.5 text-gray-400 hover:text-[#0088EE] hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Details"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>

                                                {activeTab === 'approved' && (
                                                    <Link
                                                        href={`/courses/${course.id}`}
                                                        target="_blank"
                                                        className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(course.id, course.course_name)}
                                                    className="p-2.5 text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                    title="Remove Permanently"
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

                {/* Counter */}
                <div className="px-10 py-6 bg-[#FBFCFD] dark:bg-[#0D1B2A] border-t border-gray-50 dark:border-white/5 flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Showing {filteredCourses.length} {activeTab} courses
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 rounded-lg bg-[#0088EE] text-white text-xs font-black shadow-lg shadow-blue-500/20">1</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CourseFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCourses}
                initialData={editingCourse}
            />
            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteCourse}
                title="Delete Course"
                description={`Are you sure you want to permanently delete "${courseToDelete?.courseName}"? This action cannot be undone.`}
                loading={isDeleting}
            />
        </div>
    )
}
