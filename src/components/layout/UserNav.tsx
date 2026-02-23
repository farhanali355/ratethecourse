'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { User, Settings, LogOut } from 'lucide-react'

export function UserNav({ user }: { user: any }) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error('Error signing out')
        } else {
            toast.success('Signed out successfully')
            router.push('/login')
            router.refresh()
        }
    }

    return (
        <div className="relative group">
            {/* Profile Trigger (Links to Profile Page on Click) */}
            <Link
                href="/profile"
                className="block w-8 h-8 md:w-9 md:h-9 rounded-full bg-green-200 overflow-hidden border border-gray-200 transition-transform hover:scale-105 active:scale-95"
            >
                <img
                    src={user.user_metadata?.avatar_url || "/images/profile/logo.jpg"}
                    alt="User"
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Hover Dropdown */}
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <div className="w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-montserrat">
                            {user.user_metadata?.full_name || 'Student'}
                        </p>
                    </div>

                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#0088EE] transition-colors font-montserrat"
                    >
                        <Settings className="w-4 h-4" />
                        Profile Setting
                    </Link>

                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#0088EE] transition-colors font-montserrat border-t border-gray-50"
                    >
                        <User className="w-4 h-4" />
                        My Profile
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors font-montserrat border-t border-gray-50"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
