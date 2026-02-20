'use client'

import React, { useState } from 'react'
import { X, UserPlus, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import ImageUpload from '@/components/common/ImageUpload'

interface CreateAdminModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    initialData?: any // For editing existing admin
}

export default function CreateAdminModal({ isOpen, onClose, onSuccess, initialData }: CreateAdminModalProps) {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        fullName: initialData?.full_name || '',
        email: initialData?.email || '',
        avatarUrl: initialData?.avatar_url || '',
        password: '',
        confirmPassword: ''
    })

    const isEditMode = !!initialData
    const supabase = createClient()

    // Update form when initialData changes
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.full_name || '',
                email: initialData.email || '',
                avatarUrl: initialData.avatar_url || '',
                password: '',
                confirmPassword: ''
            })
        } else {
            setFormData({
                fullName: '',
                email: '',
                avatarUrl: '',
                password: '',
                confirmPassword: ''
            })
        }
    }, [initialData])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isEditMode) {
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match')
                return
            }

            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters')
                return
            }
        }

        setLoading(true)
        const actionLabel = isEditMode ? 'Updating admin info...' : 'Creating admin account...'
        const toastId = toast.loading(actionLabel)

        try {
            if (isEditMode) {
                // Update existing profile (keep client-side for simple updates or move to SA if needed)
                // For now, let's assume update works if they are admin/superadmin
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: formData.fullName,
                        avatar_url: formData.avatarUrl
                    })
                    .eq('id', initialData.id)

                if (error) throw error
                toast.success('Admin updated successfully!', { id: toastId })
            } else {
                // Create new admin via Server Action
                const { createAdminUser } = await import('@/app/actions/admin')
                const result = await createAdminUser({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    avatarUrl: formData.avatarUrl
                })

                if (result.error) {
                    throw new Error(result.error)
                }

                toast.success('Admin created successfully!', { id: toastId })
            }

            onSuccess()
            onClose()
            if (!isEditMode) setFormData({ fullName: '', email: '', avatarUrl: '', password: '', confirmPassword: '' })
        } catch (error: any) {
            console.error('Operation failed:', error)
            toast.error('Operation failed: ' + (error.message || JSON.stringify(error)), { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-montserrat">
            <div className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm dark:bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white dark:bg-[#0D1B2A] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-white/5">
                <div className="px-10 py-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-[#FBFCFD] dark:bg-[#0D1B2A]">
                    <div>
                        <h3 className="text-2xl font-black text-[#0D1B2A] dark:text-white">{isEditMode ? 'Edit Admin' : 'New Admin'}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {isEditMode ? 'Update administrator permissions' : 'Granted full administrative access'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors">
                        <X className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Avatar Preview & URL */}
                    <div className="flex flex-col gap-4 mb-2">
                        <ImageUpload
                            value={formData.avatarUrl}
                            onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                            bucket="admin-avatars"
                            label="Profile Picture"
                            description="Upload a clear professional photo"
                        />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                            <input
                                required
                                type="text"
                                placeholder="Admin Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Email - Disabled in Edit Mode */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                            <input
                                required
                                disabled={isEditMode}
                                type="email"
                                placeholder="admin@ratemycourse.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    {!isEditMode && (
                        <>
                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temporary Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500" /> : <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="pt-4 space-y-3 pb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-[#0077DD] transition-all shadow-xl shadow-gray-200 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {isEditMode ? <Shield className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {loading ? 'Processing...' : isEditMode ? 'Update Admin' : 'Register Admin'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-4 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
