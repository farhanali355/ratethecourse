'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Plus, BookOpen, LayoutGrid, Home, Settings, User } from 'lucide-react'
import { AuthGuardLink } from '../shared/AuthGuardLink'

export function MobileMenu({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <div className="md:hidden flex items-center">
            {/* Hamburger Icon */}
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 hover:text-[#0088EE] transition-colors"
            >
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>

            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[99] backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* Slide-out Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[100] shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full p-6">
                    {/* Header in Drawer */}
                    <div className="flex justify-between items-center mb-10">
                        <span className="font-montserrat font-black text-xl text-[#0088EE]">Menu</span>
                        <button onClick={toggleMenu} className="p-2 text-gray-400 hover:text-black transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col gap-6">
                        <Link
                            href="/"
                            onClick={toggleMenu}
                            className="flex items-center gap-3 text-lg font-bold text-gray-800 hover:text-[#0088EE] transition-all font-montserrat"
                        >
                            <Home className="w-5 h-5" /> Home
                        </Link>

                        <Link
                            href="/courses"
                            onClick={toggleMenu}
                            className="flex items-center gap-3 text-lg font-bold text-gray-800 hover:text-[#0088EE] transition-all font-montserrat"
                        >
                            <LayoutGrid className="w-5 h-5" /> Courses
                        </Link>
                        <Link
                            href="/blog"
                            onClick={toggleMenu}
                            className="flex items-center gap-3 text-lg font-bold text-gray-800 hover:text-[#0088EE] transition-all font-montserrat"
                        >
                            <BookOpen className="w-5 h-5" /> Blog
                        </Link>
                        <AuthGuardLink
                            href="/add-course"
                            onClick={toggleMenu}
                            className="flex items-center gap-3 bg-[#0088EE] text-white px-5 py-3 rounded-xl font-bold font-montserrat shadow-lg shadow-blue-100 mt-4"
                            message="Join our community to add courses"
                        >
                            <Plus className="w-5 h-5" /> Add Course
                        </AuthGuardLink>
                    </nav>

                    {/* User Section at Bottom */}
                    <div className="mt-auto pt-8 border-t border-gray-100">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#0088EE]">
                                    <img
                                        src={user.user_metadata?.avatar_url || "/images/profile/logo.jpg"}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-black text-sm font-montserrat">{user.user_metadata?.full_name || 'Student'}</span>
                                    <Link href="/profile" onClick={toggleMenu} className="text-[#0088EE] text-[12px] font-bold">View Profile</Link>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={toggleMenu}
                                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-bold font-montserrat"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
