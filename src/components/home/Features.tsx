'use client'

import { FolderPen, Link, PencilLine, Shield, ThumbsUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Features() {
    const { user } = useAuth()
    const features = [
        {
            title: 'Manage and edit your ratings',
            image: '/images/manage-edit.png',
        },
        {
            title: 'Your ratings are always anonymous',
            image: '/images/your-rating.png',
        },
        {
            title: 'Like or dislike ratings',
            image: '/images/like-dislike.png',
        }
    ]

    return (
        <section className="py-24 bg-white text-center">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-montserrat font-black text-black mb-3">
                    Join the <span className="italic">RTC</span> Family
                </h2>
                <p className="text-black mb-16 font-medium text-lg font-montserrat">Love RTC? Let&apos;s make it official.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-0 flex flex-col items-center shadow-[5px_5px_20px_5px_rgba(0,0,0,0.25)] transition-all duration-300 h-full overflow-hidden">
                            {/* Illustration Image Container */}
                            <div className="w-full h-56 flex items-center justify-center px-20 mt-10 border-b border-gray-400">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="max-w-full max-h-full object-contain "
                                />
                            </div>
                            <div className="p-8 flex items-center justify-center flex-1">
                                <h3 className="text-3xl font-montserrat font-bold text-gray-900 leading-tight pl-5 pr-5">
                                    {feature.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
                <br />
                <br />

                <p className="text-black mb-8 font-medium text-lg font-montserrat">Don’t waste thousands on online courses. See real reviews before you buy.</p>

                {user ? (
                    <a href="/courses" className="inline-flex items-center gap-2 bg-[#0088EE] text-white  font-[400] text-[18px] px-8 py-2 rounded-full font-montserrat  text-lg hover:bg-blue-600 transition-colors shadow-lg border-1 border-black ">
                        {/* <PencilLine className="w-5 h-5" /> */}
                        Write a Review
                    </a>
                ) : (
                    <a href="/signup" className="inline-flex items-center gap-2 bg-[#0088EE] text-white px-8 py-3 font-montserrat rounded-full font-[400] text-[20px] hover:bg-blue-600 transition-colors shadow-lg border-1 border-black ">
                        <img src="/icons/signup-user-icon.png" alt="Signup Icon" className="w-5 h-5 object-contain" />
                        Sign up now!
                    </a>
                )}
            </div>
        </section>
    )
}
