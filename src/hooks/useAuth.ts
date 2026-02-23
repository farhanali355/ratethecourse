
'use client'

import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { resetPasswordWithResend } from '@/app/actions/auth'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'

export function useAuth() {
    const supabase = createClient()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const hasTokens = typeof window !== 'undefined' && window.location.hash.includes('access_token=')

        const checkInitialUser = async () => {
            // Standard check for existing session
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser()
                if (!mounted) return

                const isUpdatePasswordPage = typeof window !== 'undefined' && window.location.pathname === '/update-password'

                if (isUpdatePasswordPage) {
                    setUser(null)
                    setLoading(false)
                    return
                }

                if (currentUser) {
                    setUser(currentUser)
                    setLoading(false)
                } else if (!hasTokens) {
                    setLoading(false)
                }
            } catch (e) {
                if (mounted && !hasTokens) setLoading(false)
            }
        }

        checkInitialUser()

        // Absolute safety: stop loading after 7 seconds no matter what happens
        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                setLoading(false)
            }
        }, 7000)

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!mounted) return

            // If we are on the update-password page, we don't want to automatically 
            // establish a global session from the URL tokens. 
            // This prevents the Navbar from showing the user as logged in.
            const isUpdatePasswordPage = typeof window !== 'undefined' && window.location.pathname === '/update-password'

            if (isUpdatePasswordPage) {
                setUser(null)
                setLoading(false)
                return
            }

            if (session) {
                setUser(session.user)
                setLoading(false)
            } else if (!session) {
                setUser(null)
            }

            // Still stop loading so the UI can render its "logged out" state
            if (session || event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !hasTokens)) {
                setLoading(false)
            }
        })

        return () => {
            mounted = false
            subscription.unsubscribe()
            clearTimeout(safetyTimer)
        }
        // We remove supabase.auth dependency as it's a singleton anyway
        // to prevent unnecessary effect re-runs
    }, [])

    const loginWithGoogle = async (role?: string) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback${role ? `?role=${role}` : ''}`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        }
    }

    const signupWithEmail = async (email: string, password: string, fullName: string, role: string) => {
        const toastId = toast.loading('Creating account...')
        try {
            // 1. Sign up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role
                    },
                },
            })

            if (error) throw error

            toast.dismiss(toastId)
            toast.success('Account created! Verification code sent.')
            return data
        } catch (error: any) {
            toast.dismiss(toastId)
            if (error.message.toLowerCase().includes('rate limit') || error.status === 429) {
                toast.error('Too many requests. Please wait a while before trying again.')
            } else {
                toast.error(error.message)
            }
        }
    }

    const loginWithEmail = async (email: string, password: string) => {
        const toastId = toast.loading('Logging in...')
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error

            toast.dismiss(toastId)
            toast.success('Welcome back!')

            // Check for admin role or Superadmin email
            const { data: { user } } = await supabase.auth.getUser()
            const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'admin@gmail.com'

            if (isAdmin) {
                router.push('/admin')
            } else {
                router.push('/')
            }
            router.refresh()
        } catch (error: any) {
            toast.dismiss(toastId)
            toast.error(error.message)
        }
    }

    const resetPasswordForEmail = async (email: string) => {
        const toastId = toast.loading('Sending reset instructions...')
        try {
            const result = await resetPasswordWithResend(email, window.location.origin)

            if (result.error) {
                throw new Error(result.error)
            }

            toast.dismiss(toastId)
            toast.success('Check your email for the password reset link.')
            return true
        } catch (error: any) {
            toast.dismiss(toastId)
            console.error('Password reset error:', error)

            const errorMessage = typeof error === 'string'
                ? error
                : error?.message || 'Failed to send reset instructions'

            if (errorMessage.toLowerCase().includes('rate limit') || error?.status === 429) {
                toast.error('Too many requests. Please wait a while before trying again.')
            } else {
                toast.error(errorMessage)
            }
            return false
        }
    }

    const verifyOtp = async (email: string, token: string) => {
        const toastId = toast.loading('Verifying code...')
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup'
            })

            if (error) throw error

            toast.dismiss(toastId)
            toast.success('Email verified! Redirecting...')
            router.push('/')
            router.refresh()
        } catch (error: any) {
            toast.dismiss(toastId)
            toast.error(error.message || 'Verification failed')
            throw error
        }
    }

    return { user, loading, loginWithGoogle, signupWithEmail, loginWithEmail, resetPasswordForEmail, verifyOtp }
}
