'use client'

import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const { resetPasswordForEmail } = useAuth()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsLoading(true)
        await resetPasswordForEmail(email)
        setIsLoading(false)
        router.push('/success')
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-montserrat">
            {/* Custom Header for Forgot Password */}
            <header className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="inline-block">
                    <img src="/images/logo.png" alt="RTC Logo" className="h-8 w-auto" />
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-medium text-black hover:text-gray-600 font-montserrat">
                        Log in
                    </Link>
                    <Link
                        href="/login"
                        className="bg-black text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition-colors font-montserrat"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start pt-24 px-4">
                <h1 className="text-4xl font-extrabold mb-4 text-center text-black font-montserrat tracking-tight">Rate My Course Support</h1>

                <p className="text-gray-500 text-base mb-10 text-center font-medium font-montserrat max-w-sm">
                    Please enter your email address to receive a password reset link and support.
                </p>

                <div className="w-full max-w-md space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-[#333333] text-white placeholder-gray-400 px-4 py-3.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-500 font-montserrat disabled:opacity-50"
                            />
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0088EE] text-white font-black py-4 rounded-full hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="text-center text-lg font-[500] text-black mt-4 font-montserrat">
                        Already have an account? <Link href="/login" className="text-[#0088EE] font-bold hover:underline">Login</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
