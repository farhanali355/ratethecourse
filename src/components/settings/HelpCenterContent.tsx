'use client'

import { LogOut, Search, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function HelpCenterContent() {
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
                <p className="text-gray-500 font-medium font-montserrat">Loading help center...</p>
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
                        <Link href="/settings/billing" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/billing-icon.png" alt="Billing" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Billing
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Support</h4>
                        <Link href="/settings/help-center" className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-[#0088EE] font-bold font-montserrat rounded-lg text-sm">
                            <img src="/icons/help-center-icon.png" alt="Help Center" className="w-4 h-4 object-contain active-icon-blue grayscale-0" />
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
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Help Center</h1>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-2xl">
                            Search our knowledge base for answers or reach out to our team. We're here to help you succeed in your learning journey.
                        </p>
                    </div>

                    {/* Search Bar section */}
                    <div className="relative mt-10">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="What can we help you with today?"
                            className="w-full bg-[#333333] border-none rounded-2xl py-5 pl-14 pr-6 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0088EE] transition shadow-xl"
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
