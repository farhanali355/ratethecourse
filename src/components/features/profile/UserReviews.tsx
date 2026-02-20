'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'

interface DisplayReview {
    id: string
    course_id?: string
    coach_id?: string
    rating: number
    comment: string
    created_at: string
    course_name?: string
    coach_name?: string
    worth_investment?: boolean
    recommend_friend?: boolean
    avatar?: string
}

export function UserReviews({ initialReviews }: { initialReviews: DisplayReview[] }) {
    const [activeTab, setActiveTab] = useState<'All' | 'Courses' | 'Coaches'>('All')

    const filteredReviews = initialReviews.filter(review => {
        if (activeTab === 'All') return true
        if (activeTab === 'Courses') return !!review.course_id
        if (activeTab === 'Coaches') return !review.course_id && !!review.coach_id
        return true
    })

    const tabs: ('All' | 'Courses' | 'Coaches')[] = ['All', 'Courses', 'Coaches']

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
                <div className="flex gap-6 text-sm font-medium text-black">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-1 transition-all ${activeTab === tab
                                ? 'text-[#0088EE] border-b-2 border-[#0088EE] font-bold'
                                : 'hover:text-gray-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium font-montserrat tracking-tight">
                            No reviews found in this category.
                        </p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0088EE10] text-[#0088EE] flex items-center justify-center font-black text-sm uppercase">
                                        {review.avatar ? (
                                            <img src={review.avatar} alt={review.course_name || review.coach_name} className="w-full h-full object-cover" />
                                        ) : (
                                            review.course_name?.[0] || review.coach_name?.[0] || 'R'
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {review.course_name || review.coach_name || "Review"}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                            {review.course_id ? 'Course Review' : 'Coach Review'} • {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < review.rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-200 fill-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                                "{review.comment}"
                            </p>

                            <div className="flex flex-wrap gap-6 text-[11px] font-black text-[#0D1B2A] uppercase tracking-widest">
                                {review.worth_investment !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Worth:</span>
                                        <span className={review.worth_investment ? 'text-green-500' : 'text-red-500'}>
                                            {review.worth_investment ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                )}
                                {review.recommend_friend !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Recommend:</span>
                                        <span className={review.recommend_friend ? 'text-green-500' : 'text-red-500'}>
                                            {review.recommend_friend ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
