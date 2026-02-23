'use client'

import { LogOut, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function NotificationsContent() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')

    // Notification State
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(false)
    const [newContentAlerts, setNewContentAlerts] = useState(true)
    const [courseUpdates, setCourseUpdates] = useState(true)
    const [reviewReplies, setReviewReplies] = useState(true)
    const [mentorMessages, setMentorMessages] = useState(true)

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

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (profile) {
                setFullName(profile.full_name || 'Student')
                setAvatarUrl(profile.avatar_url || '')
                // Map database values if they exist, or use defaults
                if (profile.email_notifications !== undefined) setEmailNotifications(profile.email_notifications)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // In a real app, you'd save all these to a settings/preferences table
            // For now, we'll update the main profile email_notifications and simulation
            const { error } = await supabase
                .from('profiles')
                .update({
                    email_notifications: emailNotifications
                })
                .eq('id', user.id)

            if (error) throw error
            toast.success('Notification preferences updated!')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update preferences')
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
                <p className="text-gray-500 font-medium">Loading notification settings...</p>
            </div>
        )
    }

    const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (v: boolean) => void }) => (
        <div
            className="relative inline-flex items-center cursor-pointer group"
            onClick={() => setEnabled(!enabled)}
        >
            <input type="checkbox" checked={enabled} readOnly className="sr-only" />
            <div className={`w-12 h-6.5 rounded-full transition-all duration-300 ease-in-out relative border-2 ${enabled ? 'bg-[#0088EE] border-[#0088EE]' : 'bg-gray-200 border-gray-200'}`}>
                <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 shadow-sm transition-transform duration-300 ease-in-out ${enabled ? 'translate-x-[22px]' : 'translate-x-0'}`}></div>
            </div>
        </div>
    )

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
                        <h4 className="text-xs font-bold text-[#4C739A] uppercase tracking-wider mb-3 px-2">Account</h4>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/profile-icon.png" alt="Profile" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Profile
                        </Link>
                        <Link href="/settings/security" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/secuirty-icon.png" alt="Security" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Security
                        </Link>
                        <Link href="/settings/notifications" className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-[#0088EE] font-bold font-montserrat rounded-lg text-sm">
                            <img src="/icons/notification-icon.png" alt="Notifications" className="w-4 h-4 object-contain active-icon-blue grayscale-0" />
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
                <div className="lg:col-span-3 font-montserrat">
                    <div className="mb-8 font-mon">
                        <h1 className="text-2xl font-extrabold text-gray-900 font-montserrat tracking-tight">Notification Preferences</h1>
                        <p className="text-gray-500 text-sm mt-1">Choose how you want to be notified about course updates, community interactions, and account activity.</p>
                    </div>

                    {/* General Notifications Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">General Notifications</h2>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Email Notifications</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Receive summary emails about your progress and platform news.</p>
                                </div>
                                <Toggle enabled={emailNotifications} setEnabled={setEmailNotifications} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Push Notifications</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Get real-time alerts directly in your browser or mobile device.</p>
                                </div>
                                <Toggle enabled={pushNotifications} setEnabled={setPushNotifications} />
                            </div>
                        </div>
                    </div>

                    {/* Course Activity Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Course Activity</h2>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">New Content Alerts</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">When your instructors release new lessons or materials.</p>
                                </div>
                                <Toggle enabled={newContentAlerts} setEnabled={setNewContentAlerts} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Course Updates</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Announcements from the course team regarding schedules or changes.</p>
                                </div>
                                <Toggle enabled={courseUpdates} setEnabled={setCourseUpdates} />
                            </div>
                        </div>
                    </div>

                    {/* Community Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Community</h2>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Review Replies</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">When a coach or student replies to your course reviews.</p>
                                </div>
                                <Toggle enabled={reviewReplies} setEnabled={setReviewReplies} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Mentor Messages</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Direct messages and feedback from assigned course mentors.</p>
                                </div>
                                <Toggle enabled={mentorMessages} setEnabled={setMentorMessages} />
                            </div>
                        </div>
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
                            onClick={handleSave}
                            disabled={saving}
                            className="px-10 py-2.5 bg-[#0088EE] text-white font-bold rounded-full hover:bg-blue-600 transition shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center gap-2"
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
