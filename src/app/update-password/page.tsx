'use client'

import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function UpdatePasswordPage() {
    const { updatePassword } = useAuth()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // ideally check if user is authenticated via the token from the email link
        // Supabase usually handles the session establishment on redirect to this page if coming from a reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // If no session, they might have landed here incorrectly or the link expired
                // For now, we'll let them try, but usually successful update requires session
                console.log("No active session logic handling might be needed here depending on Supabase flow")
            }
        }
        checkSession()
    }, [supabase])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        await updatePassword(password)
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-montserrat">
            {/* Custom Header */}
            <header className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="inline-block">
                    <img src="/images/logo.png" alt="RTC Logo" className="h-8 w-auto" />
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-medium text-black hover:text-gray-600 font-montserrat">
                        Log in
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start pt-24 px-4">
                <h1 className="text-5xl font-extrabold mb-4 text-center text-black font-montserrat">Update Password</h1>

                <p className="text-black text-lg mb-8 text-center font-medium font-montserrat">
                    Enter your new password below.
                </p>

                <div className="w-full max-w-md space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 font-montserrat"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 font-montserrat"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Update Button */}
                        <button type="submit" className="w-full bg-[#0088EE] text-white font-bold py-3.5 rounded-full hover:bg-blue-600 transition-colors shadow-md font-montserrat">
                            Update Password
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
