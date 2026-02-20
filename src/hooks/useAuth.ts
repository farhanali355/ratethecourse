
'use client'

import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'

export function useAuth() {
    const supabase = createClient()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

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
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })
            if (error) throw error

            toast.dismiss(toastId)
            toast.success('Check your email for the password reset link.')
        } catch (error: any) {
            toast.dismiss(toastId)
            if (error.message.toLowerCase().includes('rate limit') || error.status === 429) {
                toast.error('Too many requests. Please wait a while before trying again.')
            } else {
                toast.error(error.message)
            }
        }
    }

    const updatePassword = async (password: string) => {
        const toastId = toast.loading('Updating password...')
        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error

            toast.dismiss(toastId)
            toast.success('Password updated successfully!')
            router.push('/login')
        } catch (error: any) {
            toast.dismiss(toastId)
            toast.error(error.message)
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

    return { user, loginWithGoogle, signupWithEmail, loginWithEmail, resetPasswordForEmail, updatePassword, verifyOtp }
}
