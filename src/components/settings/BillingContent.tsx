'use client'

import { LogOut, Loader2, CheckCircle2, MoreHorizontal, Download, Plus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function BillingContent() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) {
                router.push('/login')
                return
            }
            setUser(authUser)
            setEmail(authUser.email || '')

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (profile) {
                setFullName(profile.full_name || 'Student')
                setAvatarUrl(profile.avatar_url || '')
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        setSaving(true)
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error('Error signing out')
        } else {
            toast.success('Signed out successfully')
            router.push('/login')
            router.refresh()
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#0088EE] animate-spin mb-4" />
                <p className="text-gray-500 font-medium font-montserrat">Loading billing settings...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 font-montserrat">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Mini Profile */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <img
                            src={avatarUrl || "/images/profile/logo.jpg"}
                            alt="Profile"
                            className="w-15 h-15 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg truncate max-w-[150px] font-montserrat">{fullName || 'Student'}</h3>
                            <p className="text-xs text-[#4C739A]  font-bold tracking-wide uppercase">Student Member</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#4C739A] uppercase tracking-wider mb-3 px-2">Account</h4>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/profile-icon.png" alt="Profile" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Profile
                        </Link>
                        <Link href="/settings/security" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/secuirty-icon.png" alt="Security" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Security
                        </Link>
                        <Link href="/settings/notifications" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/notification-icon.png" alt="Notifications" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Notifications
                        </Link>
                        <Link href="/settings/billing" className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-[#0088EE] font-bold font-montserrat rounded-lg text-sm">
                            <img src="/icons/billing-icon.png" alt="Billing" className="w-4 h-4 object-contain active-icon-blue grayscale-0" />
                            Billing
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Support</h4>
                        <Link href="/settings/help-center" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/help-center-icon.png" alt="Help Center" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Help Center
                        </Link>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={handleSignOut}
                            disabled={saving}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 font-semibold hover:bg-red-50 rounded-lg text-sm transition text-left disabled:opacity-50"
                        >
                            <LogOut className="w-4 h-4" />
                            {saving ? 'Processing...' : 'Sign Out'}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="mb-8">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Billing & Subscription</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your plan, payment methods, and view your transaction history.</p>
                    </div>

                    {/* Current Plan Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-blue-100 p-4 rounded-lg flex items-center justify-center">
                                    <img src="/icons/current-plan-icon.png" alt="Current Plan" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 leading-none">Current Plan</h2>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">
                                        You are currently on the <span className="text-[#0088EE] font-bold">Premium Student</span> annual plan.
                                    </p>
                                    <div className="mt-3 inline-block bg-[#DCFCE7] text-[#15803D] text-[10px] font-[700] px-2.5 py-1 rounded-[50px] uppercase tracking-wider border border-green-100">
                                        Next Billing Date: Sept 24, 2024
                                    </div>
                                </div>
                            </div>
                            <button className="px-6 py-2.5 border border-blue-200 text-[#0088EE] font-bold rounded-xl text-sm hover:bg-blue-50 transition shadow-sm whitespace-nowrap">
                                Upgrade Plan
                            </button>
                        </div>
                    </div>

                    {/* Payment Method Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                            <button className="text-sm font-bold text-[#0088EE] hover:underline">Edit</button>
                        </div>

                        <div className="space-y-6 ">
                            <div className="bg-gray-100 border border-gray-200 w-[60%] rounded-2xl px-6 py-5 flex items-center justify-between group hover:border-[#0088EE]/20 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 shrink-0 bg-[#E2E8F0] p-4 rounded-lg flex items-center justify-center">
                                        <img src="/icons/visa-icon.png" alt="Visa" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-gray-900">•••• •••• •••• 1234</h3>
                                        <p className="text-[13px] text-gray-500 font-[500] mt-0.5">Expires 12/26</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 shrink-0">
                                    <img src="/icons/visa-correct-icon.png" alt="Correct" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <button className="flex items-center gap-2 text-[12px] font-bold text-[#64748B] font-montserrat hover:text-gray-600 transition">
                                <Plus className="w-4 h-4" />
                                Add alternative payment method
                            </button>
                        </div>
                    </div>

                    {/* Billing History Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-10">
                        <h2 className="text-lg font-bold text-gray-900 p-8 pb-4">Billing History</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-y border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-[700] text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-[10px] font-[700] text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-4 text-[10px] font-[700] text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-[700] text-gray-400 uppercase tracking-widest text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr className="hover:bg-gray-50/50 transition">
                                        <td className="px-8 py-5 text-sm font-[600] text-gray-900">Aug 24, 2023</td>
                                        <td className="px-8 py-5 text-sm font-[700] text-gray-900">$120.00</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="inline-flex items-center gap-1.5 text-[13px] font-[600] text-[#16A34A] tracking-wider">
                                                <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full"></span>
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-gray-500 hover:text-[#0088EE] transition">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition">
                                        <td className="px-8 py-5 text-sm font-[600] text-gray-900">Aug 24, 2022</td>
                                        <td className="px-8 py-5 text-sm font-[700] text-gray-900">$120.00</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="inline-flex items-center gap-1.5 text-[13px] font-[600] text-[#16A34A] tracking-wider">
                                                <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full"></span>
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-gray-500 hover:text-[#0088EE] transition">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 transition">
                                        <td className="px-8 py-5 text-sm font-[600] text-gray-900">Aug 24, 2021</td>
                                        <td className="px-8 py-5 text-sm font-[700] text-gray-900">$99.00</td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="inline-flex items-center gap-1.5 text-[13px] font-[600] text-[#16A34A] tracking-wider">
                                                <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full"></span>
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-gray-500 hover:text-[#0088EE] transition">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => router.refresh()}
                            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => toast.success('Billing preferences updated!')}
                            className="px-10 py-2.5 bg-[#0088EE] text-white font-black rounded-full hover:bg-blue-600 transition shadow-lg shadow-blue-100 flex items-center gap-2"
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
