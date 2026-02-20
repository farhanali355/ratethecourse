'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    UserCheck,
    BarChart3,
    Settings,
    LogOut,
    BookOpen,
    Sun,
    Moon
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useTheme } from '@/components/admin/ThemeContext'

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [profile, setProfile] = React.useState<any>(null)
    const [authUser, setAuthUser] = React.useState<any>(null)
    const { theme, toggleTheme } = useTheme()

    React.useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setAuthUser(user)
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            setProfile(data)
        }
    }

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { name: 'Manage Courses', icon: BookOpen, href: '/admin/courses' },
        { name: 'Moderation', icon: ShieldCheck, href: '/admin/moderation' },
        { name: 'User Management', icon: Users, href: '/admin/users' },
        { name: 'Coach Management', icon: UserCheck, href: '/admin/coaches' },
        { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
        { name: 'Admin Access', icon: ShieldCheck, href: '/admin/settings/admins' },
        { name: 'Global Settings', icon: Settings, href: '/admin/settings' },
    ]

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        toast.success('Signed out from Admin Panel')
        router.push('/login')
    }

    return (
        <aside className="w-72 h-screen bg-white dark:bg-[#0D1B2A] border-r border-gray-100 dark:border-white/5 flex flex-col sticky top-0 font-montserrat shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-300">
            {/* Admin Profile Header */}
            <div className="p-8 pb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border-2 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                        {(profile?.avatar_url || authUser?.user_metadata?.avatar_url) ? (
                            <img
                                src={profile?.avatar_url || authUser?.user_metadata?.avatar_url}
                                alt={profile?.full_name || authUser?.user_metadata?.full_name || 'Admin'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-blue-50 text-[#0088EE] flex items-center justify-center font-black text-xs uppercase">
                                {(profile?.full_name || authUser?.user_metadata?.full_name || 'A').charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-extrabold text-[#0D1B2A] dark:text-white text-base truncate">
                            {profile?.full_name || authUser?.user_metadata?.full_name || 'Admin'}
                        </h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold truncate uppercase tracking-widest">
                            {profile?.email || authUser?.email || 'admin@ratemycourse.com'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    // Fix: Use the most specific match (longest href) to avoid overlapping highlights
                    const activeItem = [...navItems]
                        .filter(nav => pathname === nav.href || pathname?.startsWith(nav.href + '/'))
                        .sort((a, b) => b.href.length - a.href.length)[0]

                    const isActive = activeItem?.href === item.href || (item.href === '/admin' && pathname === '/admin')

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-sm ${isActive
                                ? 'bg-[#0088EE10] dark:bg-[#0088EE20] text-[#0088EE] shadow-[0_4px_12px_rgba(0,136,238,0.08)]'
                                : 'text-gray-500 dark:text-gray-400 hover:text-[#0D1B2A] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-8 pt-4 border-t border-gray-50 dark:border-white/5 space-y-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-[#0D1B2A] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-bold text-sm shadow-sm"
                >
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#0D1B2A] shadow-sm flex items-center justify-center text-[#0088EE]">
                        {theme === 'light' ? <Moon className="w-4 h-4 fill-[#0088EE]" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors font-bold text-sm px-6 py-2"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
