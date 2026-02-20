'use client'

import { LogOut, Monitor, Smartphone, ShieldCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function SecurityContent() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')

    // Password State
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [isCurrentPasswordIncorrect, setIsCurrentPasswordIncorrect] = useState(false)

    // Toggles
    const [is2FAEnabled, setIs2FAEnabled] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) {
                router.push('/login')
                return
            }
            setUser(authUser)
            setEmail(authUser.email || '')
            setFullName(authUser.user_metadata?.full_name || 'Student')
            setAvatarUrl(authUser.user_metadata?.avatar_url || '')

            // Optionally fetch from profiles table for more data
            const { data: profile } = await supabase
                .from('profiles')
                .select('avatar_url, full_name')
                .eq('id', authUser.id)
                .single()

            if (profile) {
                if (profile.avatar_url) setAvatarUrl(profile.avatar_url)
                if (profile.full_name) setFullName(profile.full_name)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateStrength = (pwd: string) => {
        let strength = 0
        if (pwd.length > 8) strength += 25
        if (/[A-Z]/.test(pwd)) strength += 25
        if (/[0-9]/.test(pwd)) strength += 25
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 25
        return strength
    }

    const handlePasswordChange = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error('Please fill in all fields')
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        if (passwordStrength < 75) {
            toast.error('Please use a stronger password')
            return
        }

        setSaving(true)
        setIsCurrentPasswordIncorrect(false)
        try {
            // 1. Verify Current Password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: currentPassword,
            })

            if (signInError) {
                setIsCurrentPasswordIncorrect(true)
                throw new Error('Incorrect current password. Please try again.')
            }

            // 2. Update User Password
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) throw error
            toast.success('Password updated successfully!')
            setNewPassword('')
            setConfirmPassword('')
            setCurrentPassword('')
            setIsCurrentPasswordIncorrect(false)
        } catch (error: any) {
            toast.error(error.message || 'Failed to update password')
        } finally {
            setSaving(false)
        }
    }

    const handleSignOut = async () => {
        setSaving(true)
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error('Error signing out')
        } else {
            toast.success('Signed out successfully')
            router.push('/login')
            router.refresh()
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#0088EE] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading security settings...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Mini Profile */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <img
                            src={avatarUrl || "/images/profile/logo.jpg"}
                            alt="Profile"
                            className="w-15 h-15 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg truncate max-w-[150px] font-montserrat">{fullName || 'Student'}</h3>
                            <p className="text-xs text-[#4C739A]  font-bold tracking-wide uppercase">Student Member</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-[#4C739A] uppercase tracking-wider mb-3 px-2">Account</h4>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/profile-icon.png" alt="Profile" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Profile
                        </Link>
                        <Link href="/settings/security" className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-[#0088EE] font-bold font-montserrat rounded-lg text-sm">
                            <img src="/icons/secuirty-icon.png" alt="Security" className="w-4 h-4 object-contain active-icon-blue grayscale-0" />
                            Security
                        </Link>
                        <Link href="/settings/notifications" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/notification-icon.png" alt="Notifications" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Notifications
                        </Link>
                        <Link href="/settings/billing" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/billing-icon.png" alt="Billing" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Billing
                        </Link>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Support</h4>
                        <Link href="/settings/help-center" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/help-center-icon.png" alt="Help Center" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Help Center
                        </Link>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={handleSignOut}
                            disabled={saving}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 font-semibold hover:bg-red-50 rounded-lg text-sm transition text-left disabled:opacity-50"
                        >
                            <LogOut className="w-4 h-4" />
                            {saving ? 'Processing...' : 'Sign Out'}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold font-inter text-gray-900">Account Security</h1>
                        <p className="text-gray-500 font-inter text-lg mt-1">Manage your password, authentication methods, and track your active sessions across devices.</p>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <h2 className="text-lg font-inter font-bold text-gray-900 mb-6">Change Password</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold font-inter text-[#4C739A]  uppercase mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => {
                                        setCurrentPassword(e.target.value)
                                        if (isCurrentPasswordIncorrect) setIsCurrentPasswordIncorrect(false)
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full bg-gray-50 border ${isCurrentPasswordIncorrect ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 ${isCurrentPasswordIncorrect ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:bg-white transition`}
                                />
                                {isCurrentPasswordIncorrect && (
                                    <div className="mt-2 flex flex-col gap-1">
                                        <p className="text-xs text-red-500 font-medium">The password you entered is incorrect. Please try again.</p>
                                        <Link
                                            href="/forgot-password"
                                            className="text-[11px] font-bold text-[#0088EE] hover:underline w-fit"
                                        >
                                            Need help?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold font-inter text-[#4C739A]  uppercase mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value)
                                            setPasswordStrength(calculateStrength(e.target.value))
                                        }}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold font-inter text-[#4C739A]  uppercase mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>

                            {/* Password Strength Indicator */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-[#4C739A] font-inter">Password Strength: <span className={
                                        passwordStrength <= 25 ? 'text-red-500' :
                                            passwordStrength <= 50 ? 'text-orange-500' :
                                                passwordStrength <= 75 ? 'text-yellow-500' : 'text-green-500'
                                    }>{
                                            passwordStrength <= 25 ? 'Weak' :
                                                passwordStrength <= 50 ? 'Fair' :
                                                    passwordStrength <= 75 ? 'Good' : 'Strong'
                                        }</span></span>
                                    <span className="text-[13px] text-gray-400 italic font-medium">8+ characters, symbol, and number</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ease-out rounded-full ${passwordStrength <= 25 ? 'bg-red-500' :
                                            passwordStrength <= 50 ? 'bg-orange-500' :
                                                passwordStrength <= 75 ? 'bg-yellow-500' : 'bg-[#00CC99]'
                                            }`}
                                        style={{ width: `${passwordStrength}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2FA Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-gray-900">Two-Factor Authentication (2FA)</h2>
                            <div
                                className="relative inline-flex items-center cursor-pointer group"
                                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                            >
                                <input type="checkbox" checked={is2FAEnabled} readOnly className="sr-only" />
                                <div className={`w-12 h-6.5 rounded-full transition-all duration-300 ease-in-out relative border-2 ${is2FAEnabled ? 'bg-[#0088EE] border-[#0088EE]' : 'bg-gray-200 border-gray-200'}`}>
                                    <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 shadow-sm transition-transform duration-300 ease-in-out ${is2FAEnabled ? 'translate-x-[22px]' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">Add an extra layer of security to your account by requiring more than just a password.</p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                            <div className="w-10 h-10  rounded-lg shrink-0 flex items-center justify-center ">
                                <img src="/icons/phone-verification-icon.png" alt="Verification" className="w-6 h-6 object-contain" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Phone Verification Active</h3>
                                <p className="text-xs text-blue-600 font-medium mt-0.5 leading-relaxed">Codes are sent to your phone ending in ••89 whenever you log in from an unrecognized device.</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Sessions Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-10">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Active Sessions</h2>

                        <div className="space-y-6">
                            {/* Session 1 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Monitor className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-gray-900">Chrome on macOS</h3>
                                            <span className="bg-[#00CC99]/10 text-[#00CC99] text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Current Device</span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">San Francisco, CA • Last active 2 mins ago</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition">Terminate</button>
                            </div>

                            <div className="border-t border-gray-50"></div>

                            {/* Session 2 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Smartphone className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">iPhone 13 Pro</h3>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">San Francisco, CA • Last active 4 hours ago</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition">Terminate</button>
                            </div>
                        </div>

                        <button className="mt-8 text-sm font-bold text-red-500 hover:underline">Log out from all other sessions</button>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => router.refresh()}
                            className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePasswordChange}
                            disabled={saving}
                            className="px-10 py-2.5 bg-[#0088EE] text-white font-black rounded-full hover:bg-blue-600 transition shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
