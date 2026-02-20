'use client'

import { LogOut, Camera, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export function SettingsContent() {
    const router = useRouter()
    const supabase = createClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [photoUploading, setPhotoUploading] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Form State
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [emailNotifications, setEmailNotifications] = useState(true)

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

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (profile) {
                setFullName(profile.full_name || '')
                setUsername(profile.username || '')
                setBio(profile.bio || '')
                setAvatarUrl(profile.avatar_url || '')
                setIsAnonymous(profile.anonymous_posting || false)
                setEmailNotifications(profile.email_notifications !== false)
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        try {
            // 1. Update Profile Table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    username: username,
                    bio: bio,
                    anonymous_posting: isAnonymous,
                    email_notifications: emailNotifications,
                    avatar_url: avatarUrl
                })
                .eq('id', user.id)

            if (profileError) throw profileError

            // 2. Sync with Auth Metadata (for Header/MobileMenu sync)
            await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    username: username,
                    avatar_url: avatarUrl
                }
            })

            toast.success('Profile updated successfully!')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        // Create immediate local preview
        const objectUrl = URL.createObjectURL(file)
        const previousAvatarUrl = avatarUrl
        setAvatarUrl(objectUrl)

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        // Use fileName directly for the path within the 'avatars' bucket
        const filePath = fileName

        const toastId = toast.loading('Uploading photo...')
        setPhotoUploading(true)
        try {
            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) {
                if (uploadError.message.includes('Bucket not found')) {
                    throw new Error('Storage bucket "avatars" not found. Please create it in your Supabase dashboard.')
                }
                throw uploadError
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update state with the final public URL (it might be the same content, but a persistent URL)
            setAvatarUrl(publicUrl)

            // Immediately update profile avatar_url and auth metadata
            await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id)

            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            })

            toast.success('Photo uploaded!', { id: toastId })
            router.refresh()
        } catch (error: any) {
            console.error('Upload Error:', error)
            setAvatarUrl(previousAvatarUrl) // Revert on error
            toast.error(error.message || 'Upload failed', { id: toastId })
        } finally {
            setPhotoUploading(false)
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
                <p className="text-gray-500 font-medium">Loading your profile...</p>
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
                        <h4 className="text-xs font-bold font-montserrat text-[#4C739A] uppercase tracking-wider mb-3 px-2">Account</h4>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-[#0088EE] font-bold font-montserrat rounded-lg text-sm">
                            <img
                                src="/icons/profile-icon.png"
                                alt="Profile"
                                className="w-4 h-4 object-contain grayscale-0"
                                style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(90%) saturate(2256%) hue-rotate(186deg) brightness(97%) contrast(105%)' }}
                            />
                            Profile
                        </Link>
                        <Link href="/settings/security" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 font-bold font-montserrat hover:bg-gray-50 rounded-lg text-sm transition text-left">
                            <img src="/icons/secuirty-icon.png" alt="Security" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Security
                        </Link>
                        <Link href="/settings/notifications" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 font-montserrat hover:bg-gray-50 font-bold rounded-lg text-sm transition text-left">
                            <img src="/icons/notification-icon.png" alt="Notifications" className="w-4 h-4 object-contain grayscale opacity-70" />
                            Notifications
                        </Link>
                        <Link href="/settings/billing" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 font-montserrat font-bold hover:bg-gray-50 rounded-lg text-sm transition text-left">
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
                        <h1 className="text-3xl font-extrabold text-gray-900 font-montserrat">Edit Profile</h1>
                        <p className="text-[#4C739A] text-lg mt-1 font-semibold">Manage your public persona and account preferences. Changes are auto-saved as
                            drafts but must be published to go live.</p>
                    </div>

                    {/* Profile Picture Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">

                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="relative w-25 h-25">
                                    <img
                                        src={avatarUrl || "/images/profile/logo.jpg"}
                                        alt="Profile"
                                        className={`w-25 h-25 rounded-full object-cover border-2 border-gray-100 shadow-sm transition-opacity ${photoUploading ? 'opacity-40' : 'opacity-100'}`}
                                    />
                                    {photoUploading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-[#0088EE] animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={photoUploading}
                                    className="absolute bottom-0 right-0 bg-[#0088EE] text-white p-2 rounded-full border-2 border-white shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    <Camera className="w-3.5 h-3.5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    disabled={photoUploading}
                                />
                            </div>
                            <div>
                                <h2 className="text-[20px] font-bold text-gray-900 mb-4 mb-[-0px]">Profile Picture</h2>
                                <p className="text-sm text-[#4C739A] font-semibold font-montserrat w-full mb-3 max-w-xs">Upload a clear photo to help coaches and peers recognize you.</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                                    >
                                        Change Photo
                                    </button>
                                    <button
                                        onClick={() => setAvatarUrl('')}
                                        className="px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-700 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                        <h2 className="text-lg font-bold font-montserrat text-gray-900 mb-6">Basic Info</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-[15px]  font-bold text-gray-900  mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] font-bold text-gray-900  mb-2">Username</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-2.5 text-gray-400 font-medium">@</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="username"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[15px] font-bold text-gray-900  mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed font-medium"
                            />
                            <p className="text-xs text-gray-400 mt-2">Email address cannot be changed for security reasons.</p>
                        </div>

                        <div>
                            <label className="block text-[15px] font-bold text-gray-900  mb-2">Bio</label>
                            <textarea
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us a little about your studies..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition  resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Preferences Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                        <h2 className="text-[20px] font-bold text-gray-900 mb-6">Preferences</h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-[15px] font-bold text-gray-900">Anonymous Posting</h3>
                                    <p className="text-[14px] font-montserrat text-[#4C739A]  font-medium">Hide my name on public reviews by default</p>
                                </div>
                                <div
                                    className="relative inline-flex items-center cursor-pointer group"
                                    onClick={() => setIsAnonymous(!isAnonymous)}
                                >
                                    <input type="checkbox" checked={isAnonymous} readOnly className="sr-only" />
                                    <div className={`w-12 h-6.5 rounded-full transition-all duration-300 ease-in-out relative border-2 ${isAnonymous ? 'bg-[#0088EE] border-[#0088EE]' : 'bg-gray-200 border-gray-200'}`}>
                                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 shadow-sm transition-transform duration-300 ease-in-out ${isAnonymous ? 'translate-x-[22px]' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-[15px] font-bold text-gray-900">Email Notifications</h3>
                                    <p className="text-[14px] font-montserrat text-[#4C739A]  font-medium">Receive an email when a coach replies to your review</p>
                                </div>
                                <div
                                    className="relative inline-flex items-center cursor-pointer group"
                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                >
                                    <input type="checkbox" checked={emailNotifications} readOnly className="sr-only" />
                                    <div className={`w-12 h-6.5 rounded-full transition-all duration-300 ease-in-out relative border-2 ${emailNotifications ? 'bg-[#0088EE] border-[#0088EE]' : 'bg-gray-200 border-gray-200'}`}>
                                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 shadow-sm transition-transform duration-300 ease-in-out ${emailNotifications ? 'translate-x-[22px]' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Security Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-[20px]  font-bold text-gray-900 mb-6">Account Security</h2>

                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-[15px] font-bold text-gray-900 border-gray-200">Password</h3>
                                <p className="text-[15px] text-[#4C739A] font-medium">Last changed 3 months ago</p>
                            </div>
                            <button
                                onClick={() => router.push('/settings/security')}
                                className="text-sm font-bold text-[#0088EE] hover:underline font-montserrat"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-10">
                        <button
                            onClick={() => router.refresh()}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
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
