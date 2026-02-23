'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'
import { updateUserPassword } from '@/app/actions/auth'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    // Check if recovery tokens are in the URL hash
    const [hasTokens, setHasTokens] = useState(false)
    const [tokens, setTokens] = useState<{ access_token: string; refresh_token: string } | null>(null)

    useEffect(() => {
        // Clear any existing session on mount to prevent the "automatic login" bug
        const clearSession = async () => {
            try {
                const supabase = createClient()
                await supabase.auth.signOut()
            } catch (e) { }
        }
        clearSession()

        // Initial detection to show the form and extract tokens
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
            const hash = window.location.hash.substring(1)
            const params = new URLSearchParams(hash)
            const access_token = params.get('access_token')
            const refresh_token = params.get('refresh_token')

            if (access_token && refresh_token) {
                setTokens({ access_token, refresh_token })
                setHasTokens(true)

                // Clear the hash immediately to prevent re-ingestion
                window.history.replaceState(null, '', window.location.pathname)
            }
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!")
            return
        }

        if (!tokens) {
            toast.error("Recovery session expired or invalid. Please request a new link.")
            return
        }

        const toastId = toast.loading("Updating your password...")
        setIsUpdating(true)

        try {
            // Use the Server Action for better reliability and security
            const result = await updateUserPassword(password, tokens)

            if (result?.error) {
                console.error('Update error:', result.error)
                toast.dismiss(toastId)
                toast.error(`Update failed: ${result.error}`)
                setIsUpdating(false)
                return
            }

            // After success, ensure we are signed out globally
            try {
                const supabase = createClient()
                await supabase.auth.signOut()
            } catch (e) { }

            toast.dismiss(toastId)
            toast.success("Password changed! Now please login.")

            setTimeout(() => {
                router.push('/login')
                router.refresh()
            }, 1500)
        } catch (error: any) {
            toast.dismiss(toastId)
            console.error('Submission error:', error)
            toast.error(`Error: ${error?.message || "Something went wrong"}`)
        } finally {
            setIsUpdating(false)
        }
    }

    // 1. If we have tokens in URL, show form IMMEDIATELY
    if (hasTokens) {
        return (
            <div className="min-h-[80vh] flex flex-col bg-white font-montserrat">
                <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
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

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-[#0088EE] text-white font-bold py-3.5 rounded-full hover:bg-blue-600 transition-colors shadow-md font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        )
    }

    // 2. Access Denied (second click case)
    return (
        <div className="min-h-[80vh] flex flex-col bg-white font-montserrat pt-24 pb-24 px-4 items-center justify-center">
            <div className="mb-8 flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-3xl font-bold">!</span>
                </div>
            </div>
            <h1 className="text-4xl font-extrabold mb-4 text-center text-[#0D1B2A] font-montserrat tracking-tight">Access Denied</h1>
            <p className="text-gray-500 text-lg mb-10 text-center font-medium font-montserrat max-w-sm">
                Your password reset session is missing or expired. Please request a new reset link.
            </p>
            <button
                onClick={() => router.push('/forgot-password')}
                className="bg-[#0088EE] text-white px-12 py-3 rounded-full text-lg font-bold hover:bg-blue-600 transition-all font-montserrat"
            >
                Request New Link
            </button>
        </div>
    )
}
