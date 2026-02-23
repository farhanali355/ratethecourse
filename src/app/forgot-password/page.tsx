'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const { resetPasswordForEmail } = useAuth()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
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
        const success = await resetPasswordForEmail(email)
        setIsLoading(false)

        if (success) {
            setIsSuccess(true)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col bg-white font-montserrat">
                <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                    <div className="mb-8 flex justify-center">
                        <img src="/icons/success-icon.png" alt="Success Icon" className="w-16 h-16 object-contain" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 text-center text-black font-montserrat tracking-tight">Check Your Email</h1>
                    <p className="text-gray-500 text-lg mb-10 text-center font-medium font-montserrat max-w-sm">
                        We've sent password reset instructions to <br />
                        <span className="text-black font-bold">{email}</span>
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-[#0088EE] text-white px-12 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 font-montserrat"
                    >
                        Back to Login
                    </button>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="mt-6 text-gray-500 hover:text-black font-medium text-sm hover:underline"
                    >
                        Didn't get the email? Try again
                    </button>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex flex-col bg-white font-montserrat">

            <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
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

        </div>
    )
}
