'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    bucket: 'course-thumbnails' | 'admin-avatars' | 'avatars'
    label?: string
    description?: string
}

export default function ImageUpload({ value, onChange, bucket, label, description }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [localPreview, setLocalPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    // Clear local preview when the remote value updates (upload complete)
    React.useEffect(() => {
        if (value && localPreview) {
            setLocalPreview(null)
        }
    }, [value])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 1. Validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file.')
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Image size must be less than 5MB.')
            return
        }

        // Create immediate local preview
        const objectUrl = URL.createObjectURL(file)
        setLocalPreview(objectUrl)

        try {
            setUploading(true)
            setProgress(0)

            // 2. Prepare Path
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // 3. Upload to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) throw uploadError

            // 4. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            onChange(publicUrl)
            toast.success('Image uploaded successfully!')
        } catch (error: any) {
            console.error('Upload Error:', error)
            setLocalPreview(null) // Clear preview on error
            let errorMessage = error.message || 'Storage error'

            // Specific handling for RLS errors
            if (error.message?.includes('row-level security') || error.status === 403 || error.status === '42501') {
                errorMessage = 'Upload failed: Please ensure "course-thumbnails" bucket has INSERT policy for authenticated users in Supabase Dashboard.'
            }

            toast.error(errorMessage, { duration: 5000 })
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    const clearImage = () => {
        onChange('')
        setLocalPreview(null)
    }

    const displayUrl = localPreview || value

    return (
        <div className="space-y-2 font-montserrat">
            {label && (
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}

            <div className="relative group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    ref={fileInputRef}
                    disabled={uploading}
                />

                {displayUrl ? (
                    <div className="relative aspect-video md:aspect-auto md:h-40 w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                        <img src={displayUrl} alt="Preview" className={`w-full h-full object-cover transition-opacity ${uploading ? 'opacity-50 blur-[2px]' : 'opacity-100'}`} />
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md" />
                            </div>
                        )}
                        {!uploading && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 bg-white dark:bg-[#0D1B2A] text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#1B2A3A] transition-colors"
                                    title="Change Image"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    title="Remove Image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-40 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/[0.08] hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group/btn"
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <div className="p-3 bg-white dark:bg-[#0D1B2A] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 group-hover/btn:scale-110 transition-transform">
                                    <ImageIcon className="w-6 h-6 text-gray-300 dark:text-gray-600 group-hover/btn:text-blue-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black text-[#0D1B2A] dark:text-white uppercase tracking-widest">Click to upload</p>
                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </>
                        )}
                    </button>
                )}
            </div>

            {description && !uploading && !displayUrl && (
                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest ml-1 italic">
                    {description}
                </p>
            )}
        </div>
    )
}
