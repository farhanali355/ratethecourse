'use client'

import React, { useState } from 'react'
import { User, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import ImageUpload from '@/components/common/ImageUpload'

export function AddCourseForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        courseName: '',
        coachName: '',
        courseUrl: '',
        aboutCourse: '',
        category: '',
        thumbnailUrl: ''
    })

    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.courseName || !formData.coachName || !formData.courseUrl || !formData.category) {
            toast.error("Please fill in all fields (including category) to continue.")
            return
        }

        try {
            new URL(formData.courseUrl)
        } catch (_) {
            toast.error("Please enter a valid URL.")
            return
        }

        if (!user) {
            toast.info("Authentication required", {
                description: "Please log in to submit a new course to our community library.",
                duration: 4000,
            })
            return
        }

        const toastId = toast.loading("Submitting your course...")

        try {
            const supabase = createClient()
            const thumbnailUrl = formData.thumbnailUrl

            toast.loading("Saving course details...", { id: toastId })
            const { error } = await supabase
                .from('course_submissions')
                .insert([
                    {
                        course_name: formData.courseName,
                        coach_name: formData.coachName,
                        course_url: formData.courseUrl,
                        about_course: formData.aboutCourse,
                        thumbnail_url: thumbnailUrl,
                        category: formData.category,
                        status: 'pending',
                        submitted_by_uid: user.id,
                        submitted_by_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                        submitted_by_email: user.email,
                        submitted_by_username: user.user_metadata?.username || user.email?.split('@')[0],
                        submitted_by_avatar: user.user_metadata?.avatar_url || ''
                    }
                ])

            if (error) throw error

            toast.dismiss(toastId)
            toast.success("Submitted successfully! Our team will review it.")
            onSuccess()
        } catch (error: any) {
            console.error("Submission error:", error)
            toast.dismiss(toastId)
            toast.error(error.message || "Failed to submit course.")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Course Name */}
            <div className="space-y-3">
                <label className="block text-xl font-medium text-black font-montserrat">
                    What is the name of the course?
                </label>
                <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g., Advanced Digital Marketing"
                    className="w-full bg-[#333333] text-white placeholder-gray-400 px-5 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-montserrat"
                />
            </div>

            {/* Coach Name */}
            <div className="space-y-3">
                <label className="block text-xl font-medium text-black font-montserrat">
                    Who is the coach or instructor?
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="coachName"
                        value={formData.coachName}
                        onChange={handleChange}
                        placeholder="e.g., Jane Doe"
                        className="w-full bg-gray-50 text-black placeholder-gray-400 pl-12 pr-5 py-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-montserrat"
                    />
                </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
                <label className="block text-xl font-medium text-black font-montserrat">
                    Course Category
                </label>
                <div className="relative">
                    <select
                        name="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-gray-50 text-black px-5 py-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-montserrat appearance-none cursor-pointer"
                    >
                        <option value="">Select Category</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Business & Finance">Business & Finance</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
                <p className="text-sm text-gray-500 font-medium font-montserrat">
                    This helps students find your course more easily.
                </p>
            </div>
            <div className="space-y-3">
                <label className="block text-xl font-medium text-black font-montserrat">
                    Link to official website or course page
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="url"
                        name="courseUrl"
                        value={formData.courseUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/course"
                        className="w-full bg-white text-black placeholder-gray-400 pl-12 pr-5 py-4 rounded-md border-b border-gray-300 focus:outline-none focus:border-blue-500 text-lg font-montserrat"
                    />
                </div>
                <p className="text-[15px] text-black font-medium font-montserrat">
                    We'll use this to verify the course details.
                </p>
            </div>

            {/* About Course */}
            <div className="space-y-3">
                <label className="block text-xl font-medium text-black font-montserrat">
                    About your course
                </label>
                <textarea
                    name="aboutCourse"
                    value={formData.aboutCourse}
                    onChange={handleChange}
                    placeholder="Provide a brief description of what this course covers..."
                    rows={4}
                    className="w-full bg-gray-50 text-black placeholder-gray-400 px-5 py-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-montserrat resize-none"
                />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-3">
                <ImageUpload
                    value={formData.thumbnailUrl}
                    onChange={(url) => setFormData(prev => ({ ...prev, thumbnailUrl: url }))}
                    bucket="course-thumbnails"
                    label="Upload course image/thumbnail"
                    description="Help students recognize the course visually. Recommended size: 800x800px."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-[#0088EE] text-white font-[500] py-1 border border-black px-12 rounded-full hover:bg-blue-600 transition-colors shadow-md text-lg mt-4 font-montserrat cursor-pointer"
            >
                Submit
            </button>

        </form>
    )
}
