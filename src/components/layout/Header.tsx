'use client'

import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { UserNav } from './UserNav'
import { AuthGuardLink } from '../shared/AuthGuardLink'
import { useAuth } from '@/hooks/useAuth'

export function Header({ showSearch = false }: { showSearch?: boolean }) {
    const { user } = useAuth()

    return (
        <header className="w-full  bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1550px] mx-auto px-10 py-3 md:py-4 flex justify-between items-center">
                <Link href="/" className="font-bold text-2xl italic tracking-tighter text-gray-900 shrink-0">
                    <img src="/images/logo.png" alt="RTC Logo" className="h-7 md:h-8 w-auto" />
                </Link>

                {/* Search Bar - Conditionally rendered */}
                {showSearch && (
                    <form action="/search" className="flex-1  max-w-xl mx-auto ml-10 px-4 md:px-8 hidden sm:block">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="q"
                                placeholder="Search for courses, couches..."
                                className="w-full pl-10 pr-2 py-2 md:py-2.5 border border-black text-black rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400 font-montserrat"
                            />
                        </div>
                    </form>
                )}

                <div className="flex items-center gap-3 md:gap-12">
                    <div className="hidden md:flex items-center gap-12">
                        <AuthGuardLink
                            href="/add-course"
                            className="flex items-center gap-1 bg-[#0088EE] text-white px-4 py-2 rounded-full text-[16px] font-[400px] font-montserrat hover:bg-blue-600 transition-colors border border-black"
                            message="Join our community to add courses"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Course
                        </AuthGuardLink>
                        <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-black text-[16px] font-montserrat">
                            Blog
                        </Link>
                        <Link href="/courses" className="text-sm font-medium text-gray-700 hover:text-black text-[16px] font-montserrat">
                            Courses
                        </Link>
                        {!user && (
                            <Link
                                href="/login"
                                className="bg-black text-white px-5 py-2 rounded-[6px] text-sm font-medium hover:bg-gray-900 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Profile Icon and Mobile Menu Toggle */}
                    <div className="flex items-center gap-2">
                        {user && (
                            <UserNav user={user} />
                        )}
                        <MobileMenu user={user} />
                    </div>
                </div>
            </div>
        </header>
    )
}
