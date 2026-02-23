'use client'

import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import ImageUpload from '@/components/common/ImageUpload'

interface CourseFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    initialData?: any
}

export default function CourseFormModal({ isOpen, onClose, onSuccess, initialData }: CourseFormModalProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        course_name: '',
        coach_name: '',
        category: '',
        about_course: '',
        course_url: '',
        thumbnail_url: '',
        status: 'approved',
        is_featured: false,
        admin_note: ''
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                course_name: initialData.course_name || '',
                coach_name: initialData.coach_name || '',
                category: initialData.category || '',
                about_course: initialData.about_course || '',
                course_url: initialData.course_url || '',
                thumbnail_url: initialData.thumbnail_url || '',
                status: initialData.status || 'approved',
                is_featured: initialData.is_featured || false,
                admin_note: initialData.admin_note || ''
            })
        } else {
            setFormData({
                course_name: '',
                coach_name: '',
                category: '',
                about_course: '',
                course_url: '',
                thumbnail_url: '',
                status: 'approved',
                is_featured: false,
                admin_note: ''
            })
        }
    }, [initialData, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData?.id) {
                // Update
                const { error } = await supabase
                    .from('course_submissions')
                    .update(formData)
                    .eq('id', initialData.id)

                if (error) throw error
                toast.success('Course updated successfully')
            } else {
                // Insert
                const { error } = await supabase
                    .from('course_submissions')
                    .insert([formData])

                if (error) throw error
                toast.success('New course added successfully')
            }
            onSuccess()
            onClose()
        } catch (error: any) {
            toast.error('Operation failed: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const categories = [
        "Website Development",
        "Mobile App Development",
        "Digital Marketing",
        "UI/UX Design",
        "E-commerce",
        "Artificial Intelligence",
        "Business & Finance"
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end font-montserrat">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-xl h-full bg-white dark:bg-[#0D1B2A] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 border-l dark:border-white/5">
                <div className="sticky top-0 bg-white dark:bg-[#0D1B2A] border-b border-gray-100 dark:border-white/5 z-10 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-[#0D1B2A] dark:text-white">
                            {initialData ? 'Edit Course' : 'Add New Course'}
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Manual platform management</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course Title</span>
                            <input
                                required
                                type="text"
                                name="course_name"
                                value={formData.course_name}
                                onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                                className="mt-2 w-full px-5 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0088EE20] transition-all text-[#0D1B2A] dark:text-white"
                                placeholder="Enter course name..."
                            />
                        </label>

                        <label className="block">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Coach Name</span>
                            <input
                                required
                                type="text"
                                name="coach_name"
                                value={formData.coach_name}
                                onChange={(e) => setFormData({ ...formData, coach_name: e.target.value })}
                                className="mt-2 w-full px-5 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0088EE20] transition-all text-[#0D1B2A] dark:text-white"
                                placeholder="FullName of the coach..."
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</span>
                                <select
                                    required
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="mt-2 w-full px-5 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0088EE20] transition-all text-[#0D1B2A] dark:text-white appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course URL</span>
                                <input
                                    required
                                    type="url"
                                    name="course_url"
                                    value={formData.course_url}
                                    onChange={(e) => setFormData({ ...formData, course_url: e.target.value })}
                                    className="mt-2 w-full px-5 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0088EE20] transition-all text-[#0D1B2A] dark:text-white"
                                    placeholder="https://..."
                                />
                            </label>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-4">
                        <ImageUpload
                            value={formData.thumbnail_url}
                            onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                            bucket="course-thumbnails"
                            label="Course Thumbnail"
                            description="Upload an engaging image for the course"
                        />
                    </div>

                    {/* About Course */}
                    <label className="block">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">About Course</span>
                        <textarea
                            rows={3}
                            name="about_course"
                            value={formData.about_course}
                            onChange={(e) => setFormData({ ...formData, about_course: e.target.value })}
                            className="mt-2 w-full px-5 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#0088EE20] transition-all resize-none text-[#0D1B2A] dark:text-white"
                            placeholder="Briefly describe what this course is about..."
                        />
                    </label>

                    {/* Admin Message */}
                    <label className="block">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Admin Message / Note</span>
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Internal</span>
                        </div>
                        <textarea
                            rows={2}
                            name="admin_note"
                            value={formData.admin_note}
                            onChange={(e) => setFormData({ ...formData, admin_note: e.target.value })}
                            className="mt-2 w-full px-5 py-4 bg-blue-50/30 dark:bg-[#0088EE05] border border-blue-100 dark:border-[#0088EE20] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-200 transition-all resize-none text-[#0D1B2A] dark:text-white"
                            placeholder="Why are you editing this? e.g. Fixed typo, Updated link..."
                        />
                    </label>

                    {/* Status & Featured */}
                    <div className="bg-[#F8FAFC] dark:bg-white/5 p-6 rounded-[24px] space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-[#0D1B2A] dark:text-white">Publication Status</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Select where this course appears</p>
                            </div>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="appearance-none bg-white dark:bg-[#0D1B2A] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#0D1B2A] dark:text-white"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-white/5">
                            <div>
                                <p className="text-sm font-black text-[#0D1B2A] dark:text-white">Featured Course</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Pin to featured section on Home</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0088EE]"></div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] px-8 py-4 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-[#0077DD] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            {initialData ? 'Update Course' : 'Publish Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
