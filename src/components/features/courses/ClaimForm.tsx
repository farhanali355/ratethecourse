'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function ClaimForm({ courseId }: { courseId: string }) {
    const router = useRouter()

    const { user } = useAuth()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.info("Login required", {
                description: "Please sign in to verify your association and claim this course.",
                duration: 4000,
            })
            return
        }

        router.push(`/courses/${courseId}/claim/success`)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Full Name */}
            <div className="flex flex-col gap-3">
                <label className="text-[17px] font-[700] text-black">Your Full Name</label>
                <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full bg-[#3D3D3D] text-white px-5 py-4  text-[15px] font-[500] focus:outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0088EE]/50 transition-all"
                />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-3">
                <label className="text-[17px] font-[700] text-black">Business Email Address</label>
                <input
                    type="email"
                    placeholder="name@yourcourse.com"
                    required
                    className="w-full bg-[#3D3D3D] text-white px-5 py-4 text-[15px] font-[500] focus:outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0088EE]/50 transition-all"
                />
                <p className="text-[13px] text-gray-500 font-[600] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-gray-400 flex bg-gray-400 text-white items-center justify-center text-[10px] items-center italic">i</span>
                    We'll use this to verify your association with the course domain
                </p>
            </div>

            {/* Website */}
            <div className="flex flex-col gap-3">
                <label className="text-[17px] font-[700] text-black">Official Course Website</label>
                <input
                    type="text"
                    placeholder="https://yourcourse.com"
                    required
                    className="w-full bg-[#3D3D3D] text-white px-5 py-4 text-[15px] font-[500] focus:outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0088EE]/50 transition-all"
                />
            </div>

            {/* Proof of Association */}
            <div className="flex flex-col gap-3">
                <label className="text-[17px] font-[700] text-black">Proof of Association</label>
                <textarea
                    placeholder="Paste links to your LinkedIn, Twitter, or About page listing you as the creator..."
                    required
                    className="w-full bg-[#3D3D3D] text-white px-5 py-6 text-[15px] font-[500] focus:outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0088EE]/50 transition-all h-[120px] resize-none"
                ></textarea>
            </div>

            {/* Additional Message */}
            <div className="flex flex-col gap-3">
                <label className="text-[17px] font-[700] text-black">Additional Messsage <span className="text-gray-400 font-[500]">(Optional)</span></label>
                <textarea
                    placeholder="Any specific details for our verification team?"
                    className="w-full bg-[#3D3D3D] text-white px-5 py-6 text-[15px] font-[500] focus:outline-none placeholder:text-gray-400 border border-transparent focus:border-[#0088EE]/50 transition-all h-[120px] resize-none"
                ></textarea>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                    <div className="flex items-center gap-2 text-black font-[600] font-montserrat text-[14px]">
                        <Lock className="w-4 h-4" strokeWidth={3} />
                        Secure verification process
                    </div>

                    <button type="submit" className="bg-[#0088EE] !text-white font-montserrat font-[400] border border-black py-2 px-7 rounded-full flex items-center justify-center gap-2 text-[15px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 w-full sm:w-fit">
                        Submit Claim <ArrowRight className="w-4 h-4 " />
                    </button>
                </div>

                <p
                    style={{ color: '#0080DB' }}
                    className="text-[14px] !text-[#0080DB] font-montserrat font-[600] leading-relaxed max-w-md"
                >
                    We manually review every claim within 24 hours to ensure plateform integrity.
                </p>
            </div>
        </form>
    )
}
