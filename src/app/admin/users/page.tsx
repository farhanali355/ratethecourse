'use client'

import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    MoreHorizontal,
    User,
    Mail,
    Calendar,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    UserPlus,
    Activity,
    ShieldCheck,
    X,
    Trash2,
    Ban
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { deleteUser, updateUserRole } from '@/app/actions/admin'
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal'
import CreateUserModal from '@/components/admin/CreateUserModal'

const SUPER_ADMIN_EMAILS = ['admin@gmail.com', 'fariian@gmail.com', 'admin@ratemycourse.com']

export default function UserManagementPage() {
    const supabase = createClient()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRoleFilters, setSelectedRoleFilters] = useState<string[]>(['student', 'coach', 'admin', 'alumni'])
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        pending: 0,
        flagged: 0
    })

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<any | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        // ... (existing implementation)
        setLoading(true)
        try {
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            if (profiles) {
                setUsers(profiles)
                setStats({
                    total: profiles.length,
                    active: profiles.filter(u => u.status === 'active' || !u.status).length,
                    pending: profiles.filter(u => u.status === 'pending').length,
                    flagged: profiles.filter(u => u.status === 'flagged').length
                })
            }
        } catch (error: any) {
            toast.error('Failed to fetch users: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        if (SUPER_ADMIN_EMAILS.includes(users.find(u => u.id === userId)?.email?.toLowerCase())) {
            toast.error("Cannot change role of Super Admin")
            return
        }
        try {
            const { error } = await updateUserRole(userId, newRole as any)
            if (error) throw error
            toast.success("User role updated successfully")

            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
            if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, role: newRole })
        } catch (error: any) {
            toast.error("Failed to update role: " + error.message)
        }
    }

    const handleAction = async (userId: string, action: 'suspend' | 'ban' | 'delete' | 'activate') => {
        if (SUPER_ADMIN_EMAILS.includes(users.find(u => u.id === userId)?.email?.toLowerCase())) {
            toast.error("Cannot perform actions on Super Admin")
            return
        }
        // ... (existing implementation)
        if (action === 'delete') {
            const user = users.find(u => u.id === userId)
            setUserToDelete(user)
            setIsDeleteModalOpen(true)
            return
        }

        const confirmMsg = action === 'ban' ? 'Are you sure you want to ban this user?' :
            `Are you sure you want to ${action} this user?`

        if (!confirm(confirmMsg)) return

        try {
            const status = action === 'suspend' ? 'suspended' : action === 'ban' ? 'banned' : 'active'
            const { error } = await supabase
                .from('profiles')
                .update({ status })
                .eq('id', userId)
            if (error) throw error
            toast.success(`User ${action}ed successfully`)

            fetchUsers()
            if (selectedUser?.id === userId) fetchUsers().then(() => {
                const updated = users.find(u => u.id === userId)
                if (updated) setSelectedUser(updated)
            })
        } catch (error: any) {
            toast.error(`Action failed: ${error.message}`)
        }
    }

    const confirmDeleteUser = async () => {
        // ... (existing implementation)
        if (!userToDelete) return

        setIsDeleting(true)
        try {
            const result = await deleteUser(userToDelete.id)
            if (result.error) throw new Error(result.error)

            toast.success('User deleted successfully')

            // Update local state immediately
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
            if (selectedUser?.id === userToDelete.id) setSelectedUser(null)

            setIsDeleteModalOpen(false)
            setUserToDelete(null)

            // Refresh stats
            fetchUsers()
        } catch (error: any) {
            toast.error('Failed to delete user: ' + error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())

        const role = (user.role || 'student').toLowerCase()
        const matchesRole = selectedRoleFilters.includes(role)

        return matchesSearch && matchesRole
    })

    const toggleRoleFilter = (role: string) => {
        setSelectedRoleFilters(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        )
    }

    return (
        <div className="font-montserrat relative min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0D1B2A] dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Control user access, roles, and platform safety.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0D1B2A] dark:bg-[#0088EE] text-white rounded-2xl text-sm font-bold hover:bg-black dark:hover:bg-[#0077DD] transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add New User
                    </button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Members" value={stats.total} icon={User} color="text-blue-600" bg="bg-blue-50" />
                <StatCard label="Active Now" value={stats.active} icon={Activity} color="text-green-600" bg="bg-green-50" />
                <StatCard label="Pending Verification" value={stats.pending} icon={ShieldCheck} color="text-purple-600" bg="bg-purple-50" />
                <StatCard label="Flagged Accounts" value={stats.flagged} icon={ShieldAlert} color="text-red-600" bg="bg-red-50" />
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-[24px] border border-gray-100 dark:border-white/5 mb-8 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email or username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] dark:bg-white/[0.02] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#0088EE20] dark:focus:ring-[#0088EE40] transition-all font-medium text-[#0D1B2A] dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Filter By Role:</p>
                        <div className="flex items-center gap-4">
                            {['Student', 'Coach', 'Admin', 'Alumni'].map((role) => (
                                <label key={role} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoleFilters.includes(role.toLowerCase())}
                                            onChange={() => toggleRoleFilter(role.toLowerCase())}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-200 dark:border-white/5 transition-all checked:bg-[#0088EE] checked:border-[#0088EE]"
                                        />
                                        <CheckCircle2 className="absolute w-5 h-5 text-white scale-0 peer-checked:scale-75 transition-transform left-0" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{role}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FBFCFD] dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            <tr>
                                <th className="px-10 py-6">Member</th>
                                <th className="px-6 py-6">Role</th>
                                <th className="px-6 py-6">Status</th>
                                <th className="px-6 py-6">Joined Date</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-[#0088EE] border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Fetching users...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                        No users found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="group hover:bg-[#F8FAFC80] dark:hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-[#F8FAFC] border border-gray-100 overflow-hidden shrink-0">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#0088EE] font-black text-xs">
                                                            {(user.full_name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-[#0D1B2A] dark:text-white text-sm">{user.full_name || 'Anonymous User'}</p>
                                                    <div className="flex items-center gap-3 mt-0.5">
                                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">@{user.username || 'user'}</span>
                                                        <span className="w-1 h-1 bg-gray-200 dark:bg-white/20 rounded-full"></span>
                                                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${user.role === 'admin' ? 'bg-[#0D1B2A] dark:bg-white text-white dark:text-[#0D1B2A]' :
                                                user.role === 'coach' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400' :
                                                    'bg-blue-50 dark:bg-[#0088EE]/10 text-blue-700 dark:text-[#0088EE]'
                                                }`}>
                                                {user.role || 'student'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-xs font-bold">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'suspended' ? 'bg-orange-500' :
                                                    user.status === 'banned' ? 'bg-red-500' :
                                                        'bg-green-500'
                                                    }`}></div>
                                                <span className={
                                                    user.status === 'suspended' ? 'text-orange-600' :
                                                        user.status === 'banned' ? 'text-red-600' :
                                                            'text-green-600'
                                                }>
                                                    {user.status || 'active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-gray-400 dark:text-gray-500 text-xs">
                                            {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleAction(user.id, user.status === 'suspended' ? 'activate' : 'suspend')}
                                                    className="p-2 text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all"
                                                    title={user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                                >
                                                    <Activity className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.id, 'ban')}
                                                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                                    title="Ban User"
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.id, 'delete')}
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

            {/* User Detail Side Panel */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#0D1B2A]/20 dark:bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#0D1B2A] h-screen shadow-2xl animate-in slide-in-from-right duration-500 p-10 overflow-y-auto border-l border-transparent dark:border-white/5">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-8 right-8 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400 dark:text-gray-500"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center mt-10">
                            <div className="w-32 h-32 rounded-[40px] border-4 border-white dark:border-[#0D1B2A] shadow-xl overflow-hidden mb-6">
                                {selectedUser.avatar_url ? (
                                    <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#0088EE10] dark:bg-white/5 flex items-center justify-center text-[#0088EE] font-black text-3xl">
                                        {(selectedUser.full_name || 'U')[0]}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-black text-[#0D1B2A] dark:text-white">{selectedUser.full_name || 'Anonymous User'}</h2>
                            <p className="text-gray-400 dark:text-gray-500 font-bold mb-8">@{selectedUser.username || 'user'}</p>

                            <div className="grid grid-cols-2 gap-4 w-full mb-10">
                                <div className="p-4 rounded-2xl border bg-blue-50 dark:bg-[#0088EE]/10 border-blue-100 dark:border-[#0088EE]/20">
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 dark:text-white/40 leading-none mb-2">Role</p>
                                    <select
                                        value={selectedUser.role || 'student'}
                                        onChange={(e) => handleRoleUpdate(selectedUser.id, e.target.value)}
                                        className="w-full bg-transparent font-black text-sm text-blue-700 dark:text-[#0088EE] focus:outline-none cursor-pointer uppercase"
                                    >
                                        <option value="student">Student</option>
                                        <option value="coach">Coach</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <DetailBox label="Status" value={selectedUser.status || 'active'} uppercase color={selectedUser.status === 'active' || !selectedUser.status ? 'green' : 'red'} />
                            </div>

                            <div className="w-full space-y-6">
                                <div className="p-6 bg-[#F8FAFC] dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl shadow-sm flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-[#0088EE]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                            <p className="text-sm font-extrabold text-[#0D1B2A] dark:text-white">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl shadow-sm flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-[#0088EE]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">User Since</p>
                                            <p className="text-sm font-extrabold text-[#0D1B2A] dark:text-white">
                                                {new Date(selectedUser.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mx-4">Administrative Actions</p>
                                    <div className="flex flex-col gap-2">
                                        <AdminActionBtn
                                            icon={Activity}
                                            label={selectedUser.status === 'suspended' ? "Activate Account" : "Suspend Account"}
                                            color="orange"
                                            onClick={() => handleAction(selectedUser.id, selectedUser.status === 'suspended' ? 'activate' : 'suspend')}
                                        />
                                        <AdminActionBtn
                                            icon={Ban}
                                            label="Ban User Permanently"
                                            color="red"
                                            onClick={() => handleAction(selectedUser.id, 'ban')}
                                        />
                                        <AdminActionBtn
                                            icon={Trash2}
                                            label="Delete User Profile"
                                            color="red"
                                            variant="outline"
                                            onClick={() => handleAction(selectedUser.id, 'delete')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                description={`Are you sure you want to permanently delete ${userToDelete?.full_name || 'this user'}? This action cannot be undone.`}
                loading={isDeleting}
            />
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchUsers}
            />
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-4 hover:translate-y-[-2px] transition-transform">
            <div className={`p-4 rounded-2xl ${bg} dark:bg-white/10 ${color}`}>
                <Icon className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <h4 className="text-2xl font-black text-[#0D1B2A] dark:text-white leading-none">{value}</h4>
            </div>
        </div>
    )
}

function DetailBox({ label, value, uppercase, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 dark:bg-[#0088EE]/10 text-blue-700 dark:text-[#0088EE] border-blue-100 dark:border-[#0088EE]/20',
        green: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20',
        red: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20',
    }
    return (
        <div className={`p-4 rounded-2xl border ${colors[color] || 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5'}`}>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 dark:text-white/40 leading-none mb-1">{label}</p>
            <p className={`text-sm font-black ${uppercase ? 'uppercase' : ''}`}>{value}</p>
        </div>
    )
}

function AdminActionBtn({ icon: Icon, label, color, variant = 'solid', onClick }: any) {
    const styles: any = {
        orange: variant === 'solid' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50',
        red: variant === 'solid' ? 'bg-red-600 text-white hover:bg-red-700' : 'border-2 border-red-600 text-red-600 hover:bg-red-50',
    }
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${styles[color]}`}
        >
            <Icon className="w-5 h-5" strokeWidth={2.5} />
            {label}
        </button>
    )
}
