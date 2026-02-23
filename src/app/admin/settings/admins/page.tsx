'use client'

import React, { useState, useEffect } from 'react'
import {
    Shield,
    UserPlus,
    Trash2,
    Lock,
    Mail,
    ShieldCheck,
    ShieldAlert,
    Clock,
    User,
    Key,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import CreateAdminModal from '@/components/admin/CreateAdminModal'

interface AdminUser {
    id: string
    full_name: string | null
    email: string | null
    role: string
    created_at: string
    avatar_url: string | null
    is_superadmin?: boolean
}

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedAdminForEdit, setSelectedAdminForEdit] = useState<AdminUser | null>(null)
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchAdmins()
        getCurrentUser()
    }, [])

    const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            setProfile(data)
        }
    }

    const fetchAdmins = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .or('role.eq.admin,email.eq.admin@gmail.com')
                .order('created_at', { ascending: true })

            if (error) throw error
            setAdmins(data || [])
        } catch (error: any) {
            toast.error('Failed to load admins: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setIsChangingPassword(true)
        const toastId = toast.loading('Updating password...')

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            })

            if (error) throw error

            toast.success('Password updated successfully!', { id: toastId })
            setPasswordData({ newPassword: '', confirmPassword: '' })
        } catch (error: any) {
            toast.error('Update failed: ' + error.message, { id: toastId })
        } finally {
            setIsChangingPassword(false)
        }
    }

    const removeAdmin = async (admin: AdminUser) => {
        const SUPER_ADMIN_EMAIL = 'admin@gmail.com'
        const isTargetSuperAdmin = admin.email === SUPER_ADMIN_EMAIL
        const isCurrentUserSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL

        // Final check: Only Superadmin can remove admins
        if (!isCurrentUserSuperAdmin) {
            toast.error('Only the Superadmin can perform this action!')
            return
        }

        // Protection Logic: No one can delete the Superadmin
        if (isTargetSuperAdmin) {
            toast.error('Cannot remove Superadmin account!')
            return
        }

        // Standard admins cannot delete anyone if they are not the Superadmin?
        // Actually, user said: "admin admin ko remove bh kr skta ha lekin superadmin ko nahi kr skta"
        // And: "super admin kisi bh admin ko delete bh kr skta hun"

        if (admin.id === currentUser?.id) {
            toast.error('You cannot remove yourself!')
            return
        }

        if (!confirm(`Are you sure you want to remove ${admin.full_name} from admin access?`)) return

        const toastId = toast.loading('Removing admin account permanently...')
        try {
            // We use an RPC function because direct DELETE on profiles 
            // is often restricted by RLS for non-owners.
            // RPC allows us to run this with security definer (admin) privileges.
            const { error } = await supabase.rpc('delete_admin_properly', {
                target_user_id: admin.id
            })

            if (error) throw error

            toast.success('Admin permanently removed from database.', { id: toastId })
            fetchAdmins()
        } catch (error: any) {
            console.error('Removal Error:', error)
            toast.error('Failed to remove: ' + (error.message || 'Database permission error'), { id: toastId })
        }
    }

    return (
        <div className="font-montserrat pb-20">
            {/* Header */}
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-black dark:bg-[#0088EE] text-white rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Internal Access Control</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#0D1B2A] dark:text-white">Admin Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage platform administrators and your security settings.</p>
                </div>
                {(profile?.role === 'admin' || profile?.is_admin || currentUser?.email === 'admin@gmail.com') && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#0D1B2A] dark:bg-[#0088EE] hover:bg-black dark:hover:bg-[#0077DD] text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-gray-200 dark:shadow-none"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add New Admin
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                {/* Admin List Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[40px] shadow-[0_12px_40px_rgb(0,0,0,0.03)] overflow-hidden">
                        <div className="p-10 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-[#FBFCFD] dark:bg-transparent">
                            <div>
                                <h3 className="text-xl font-black text-[#0D1B2A] dark:text-white">Platform Administrators</h3>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Total: {admins.length} Active Accounts</p>
                            </div>
                            <ShieldCheck className="w-6 h-6 text-[#0088EE]" />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 dark:bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-10 py-6">Admin Profile</th>
                                        <th className="px-6 py-6 text-center">Security Tier</th>
                                        <th className="px-6 py-6">Joined Date</th>
                                        <th className="px-10 py-6 text-right">Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-20 text-center">
                                                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                                            </td>
                                        </tr>
                                    ) : admins.map((admin) => {
                                        const isTargetSuperAdmin = admin.email === 'admin@gmail.com'
                                        const isCurrentUserSuperAdmin = currentUser?.email === 'admin@gmail.com'

                                        return (
                                            <tr key={admin.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                                                            {admin.avatar_url ? <img src={admin.avatar_url} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-[#0D1B2A] dark:text-white">{admin.full_name || 'System Admin'}</p>
                                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">{admin.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex justify-center">
                                                        {isTargetSuperAdmin ? (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-tight">
                                                                <ShieldAlert className="w-3 h-3 text-orange-400" />
                                                                Superadmin
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-blue-50 dark:bg-[#0088EE10] text-[#0088EE] rounded-full text-[9px] font-black uppercase tracking-tight">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="text-xs text-gray-400 font-bold flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(admin.created_at).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Edit Action: Only for SuperAdmin */}
                                                        {isCurrentUserSuperAdmin && !isTargetSuperAdmin && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedAdminForEdit(admin)
                                                                    setIsCreateModalOpen(true)
                                                                }}
                                                                title="Manage Admin"
                                                                className="p-3 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                                                            >
                                                                <Shield className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Removal Logic: Only SuperAdmin can remove admins */}
                                                        {isCurrentUserSuperAdmin && !isTargetSuperAdmin && (
                                                            <button
                                                                onClick={() => removeAdmin(admin)}
                                                                className="p-3 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Settings Sidebar */}
                <div className="space-y-8">
                    {/* Password Change Card */}
                    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[40px] shadow-[0_12px_40px_rgb(0,0,0,0.03)] p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-[#0088EE10] text-[#0088EE] rounded-2xl flex items-center justify-center">
                                <Key className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#0D1B2A] dark:text-white">Update Security</h3>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Change your admin password</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full pl-11 pr-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 transition-all text-[#0D1B2A] dark:text-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full py-4 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-[#0077DD] transition-all shadow-xl shadow-gray-200 dark:shadow-none disabled:opacity-70"
                            >
                                {isChangingPassword ? 'Saving...' : 'Update Password'}
                            </button>
                        </form>
                    </div>

                    {/* Security Info Card */}
                    <div className="bg-[#0D1B2A] dark:bg-[#0088EE]/10 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-transparent dark:border-[#0088EE]/20">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                <h4 className="text-sm font-black uppercase tracking-widest">Security Protocol</h4>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-300 font-bold leading-relaxed mb-6">
                                New admins will be registered with a temporary password. Ensure they verify their email and change their password immediately upon first login.
                            </p>
                            <div className="flex items-center gap-3 text-[10px] font-black text-[#0088EE] uppercase tracking-[0.2em]">
                                <CheckCircle2 className="w-4 h-4" />
                                Monitoring active
                            </div>
                        </div>
                        {/* Abstract circle in bg */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CreateAdminModal
                isOpen={isCreateModalOpen}
                initialData={selectedAdminForEdit}
                onClose={() => {
                    setIsCreateModalOpen(false)
                    setSelectedAdminForEdit(null)
                }}
                onSuccess={fetchAdmins}
            />
        </div>
    )
}
