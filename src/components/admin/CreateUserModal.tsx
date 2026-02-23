'use client'

import React, { useState } from 'react'
import { X, UserPlus, Shield, Mail, Lock, Eye, EyeOff, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import ImageUpload from '@/components/common/ImageUpload'

interface CreateUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

type UserRole = 'student' | 'coach' | 'admin'

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        avatarUrl: '',
        role: 'student' as UserRole,
        password: '',
        confirmPassword: ''
    })

    const supabase = createClient()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        const toastId = toast.loading('Creating user account...')

        try {
            // Create new user via Auth
            const { data, error: signupError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        username: formData.username,
                        avatar_url: formData.avatarUrl,
                        role: formData.role
                    }
                }
            })

            if (signupError) throw signupError

            if (data.user) {
                // Update profile role and other details explicitly if needed
                // (Trigger usually handles creation, but we update to ensure role/avatar)
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        role: formData.role,
                        avatar_url: formData.avatarUrl,
                        full_name: formData.fullName,
                        username: formData.username
                    })
                    .eq('id', data.user.id)

                if (profileError) {
                    console.error('Profile update error:', profileError)
                    // Non-blocking, as triggers might have done their job or RLS might block
                }
            }

            toast.success('User created successfully! Verification email sent.', { id: toastId })

            onSuccess()
            onClose()
            setFormData({
                fullName: '',
                email: '',
                username: '',
                avatarUrl: '',
                role: 'student',
                password: '',
                confirmPassword: ''
            })
        } catch (error: any) {
            toast.error('Operation failed: ' + error.message, { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    const roleOptions = [
        { id: 'student', label: 'Student', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { id: 'coach', label: 'Coach', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    ]

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-montserrat">
            <div className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm dark:bg-black/80" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white dark:bg-[#0D1B2A] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-white/5">
                <div className="px-10 py-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-[#FBFCFD] dark:bg-[#0D1B2A]">
                    <div>
                        <h3 className="text-2xl font-black text-[#0D1B2A] dark:text-white">New User</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Create a new platform account
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors">
                        <X className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        {roleOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, role: option.id as UserRole })}
                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${formData.role === option.id
                                    ? 'border-[#0088EE] bg-[#0088EE]/5'
                                    : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                <div className={`p-2 rounded-xl ${option.bg} ${option.color}`}>
                                    <option.icon className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${formData.role === option.id ? 'text-[#0088EE]' : 'text-gray-400'
                                    }`}>{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Avatar Preview & URL */}
                    <div className="flex flex-col gap-4 mb-2">
                        <ImageUpload
                            value={formData.avatarUrl}
                            onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                            bucket="avatars"
                            label="Profile Picture"
                            description="Upload a profile photo"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                required
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                            />
                        </div>
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                            <input
                                required
                                type="text"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                            <input
                                required
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
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
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                            <input
                                required
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-3 pb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-[#0077DD] transition-all shadow-xl shadow-gray-200 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            <UserPlus className="w-4 h-4" />
                            {loading ? 'Creating Account...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
