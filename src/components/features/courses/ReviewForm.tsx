'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, ChevronDown, Check, ArrowUpRight, Lock, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Course } from './CoursesData'

export function ReviewForm({ course }: { course: Course }) {
    const router = useRouter()
    const { user } = useAuth()
    const supabase = createClient()

    // Form States
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [worthInvestment, setWorthInvestment] = useState<boolean | null>(null)
    const [recommendFriend, setRecommendFriend] = useState<boolean | null>(null)
    const [priceRange, setPriceRange] = useState('Select a range')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [reviewText, setReviewText] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasReviewed, setHasReviewed] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    // Error states
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const tags = [
        "Regret Buying", "Mindset-Only", "Copy-Paste Strategies", "Responsive Mentor",
        "Ghost Mentor", "Beginner Friendly", "Overpacked Group Calls",
        "Quick Wins", "Worth the Money", "Not Worth the Price", "High ROI", "Low ROI",
        "Beware of Upsells", "Course Is Ran by Other Coaches", "Brain Rot Group Calls",
        "Well Structured Group Calls", "Course Owner Cares", "Course Owner Not Reachable",
        "Answers Questions in Timely Manner", "Long Wait Times for Answers"
    ]

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag))
        } else if (selectedTags.length < 3) {
            setSelectedTags([...selectedTags, tag])
        }
    }

    const getRatingLabel = (val: number) => {
        if (val === 1) return 'Poor'
        if (val === 2) return 'Fair'
        if (val === 3) return 'Good'
        if (val === 4) return 'Very Good'
        if (val === 5) return 'Excellent'
        return ''
    }

    // Check for existing review
    useEffect(() => {
        const checkExistingReview = async () => {
            if (!user) {
                setIsChecking(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('id')
                    .eq('course_id', course.id)
                    .eq('user_id', user.id)
                    .single()

                if (data) {
                    setHasReviewed(true)
                }
            } catch (error) {
                console.error("Error checking review:", error)
            } finally {
                setIsChecking(false)
            }
        }

        checkExistingReview()
    }, [user, course.id, supabase])

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!user) {
            toast.info("Sign in to leave a review", {
                description: "Your voice matters! Please log in to share your experience with this course.",
                duration: 4000,
            })
            return false
        }

        if (hasReviewed) {
            toast.error("Bhai, aap is course par pehle hi review de chuke hain!")
            return false
        }

        if (rating === 0) newErrors.rating = "Please rate the course"
        if (worthInvestment === null) newErrors.worthInvestment = "Please select if it was worth it"
        if (recommendFriend === null) newErrors.recommendFriend = "Please select if you recommend it"
        if (priceRange === 'Select a range') newErrors.priceRange = "Please select a price range"
        if (selectedTags.length === 0) newErrors.tags = "Please select at least one tag"
        if (reviewText.trim().length < 10) newErrors.reviewText = "Please write a more detailed review (minimum 10 characters)"
        if (!termsAccepted) newErrors.terms = "You must agree to the guidelines"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (isChecking) return

        if (hasReviewed) {
            toast.error("Bhai, aap ne is course par pehle hi review de diya hai.")
            return
        }

        if (validateForm() && user) {
            setIsSubmitting(true)
            const toastId = toast.loading("Submitting your review...")

            try {
                // Double check before insert (Race condition protection)
                const { data: existing } = await supabase
                    .from('reviews')
                    .select('id')
                    .eq('course_id', course.id)
                    .eq('user_id', user.id)
                    .single()

                if (existing) {
                    toast.error("Aap pehle hi review de chuke hain.", { id: toastId })
                    setHasReviewed(true)
                    setIsSubmitting(false)
                    return
                }

                const { error } = await supabase
                    .from('reviews')
                    .insert([
                        {
                            course_id: course.id,
                            user_id: user.id,
                            rating: rating,
                            difficulty: 3, // Default for now
                            comment: reviewText,
                            worth_investment: worthInvestment,
                            recommend_friend: recommendFriend,
                            price_range: priceRange,
                            tags: selectedTags,
                            status: 'approved' // Live by default per user request
                        }
                    ])

                if (error) throw error

                toast.success("Review submitted! Thank you.", { id: toastId })
                router.push(`/courses/${course.id}/write-review/success`)
            } catch (error: any) {
                console.error("Submission error:", error)
                toast.error(error.message || "Failed to submit review", { id: toastId })
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    // Helper to render error message
    const ErrorMsg = ({ error }: { error?: string }) => {
        if (!error) return null
        return (
            <div className="flex items-center gap-1.5 text-red-500 text-[12px] font-bold mt-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
            </div>
        )
    }

    return (
        <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Column - Form */}
            <div className="flex-1 max-w-3xl">
                <h1 className="text-[34px] font-[800] text-black mb-1">Write a Review</h1>
                <p className="text-[14px] text-gray-600 font-bold mb-10">
                    Course: <Link href={`/courses/${course.id}`} className="text-[#0088EE] hover:underline font-[600]">{course.title}</Link>
                </p>

                <div className="flex flex-col gap-10">
                    {/* 1. Rate the course */}
                    <section>
                        <h3 className="text-[18px] font-[650] text-black mb-4">1. Rate the course</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => {
                                            setRating(star)
                                            if (errors.rating) setErrors({ ...errors, rating: '' })
                                        }}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${(hover || rating) >= star ? 'fill-[#0088EE] text-[#0088EE]' : 'fill-[#D1D5DB] text-[#9CA3AF]'}`}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-[#0088EE] font-bold text-[18px] min-h-[24px] mt-1">
                                {getRatingLabel(hover || rating)}
                            </span>
                            <ErrorMsg error={errors.rating} />
                        </div>
                    </section>

                    {/* 2. Was it worth the investment? */}
                    <section>
                        <h3 className="text-[18px] font-[650] text-black mb-4">2. Was it worth the investment?</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex bg-white border border-gray-300 rounded-full w-fit p-1">
                                <button
                                    onClick={() => {
                                        setWorthInvestment(true)
                                        if (errors.worthInvestment) setErrors({ ...errors, worthInvestment: '' })
                                    }}
                                    className={`px-8 py-1.5 rounded-full text-[14px] font-bold transition-all ${worthInvestment === true ? 'bg-[#0088EE] text-white' : 'bg-transparent text-black hover:bg-gray-50'}`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => {
                                        setWorthInvestment(false)
                                        if (errors.worthInvestment) setErrors({ ...errors, worthInvestment: '' })
                                    }}
                                    className={`px-8 py-1.5 rounded-full text-[14px] font-bold transition-all ${worthInvestment === false ? 'bg-[#0088EE] text-white' : 'bg-transparent text-black hover:bg-gray-50'}`}
                                >
                                    No
                                </button>
                            </div>
                            <ErrorMsg error={errors.worthInvestment} />
                        </div>
                    </section>

                    {/* 3. Would you recommend this course to a friend? */}
                    <section>
                        <h3 className="text-[18px] font-[650] text-black mb-4">3. Would you recommend this course to a friend?</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex bg-white border border-gray-300 rounded-full w-fit p-1">
                                <button
                                    onClick={() => {
                                        setRecommendFriend(true)
                                        if (errors.recommendFriend) setErrors({ ...errors, recommendFriend: '' })
                                    }}
                                    className={`px-8 py-1.5 rounded-full text-[14px] font-bold transition-all ${recommendFriend === true ? 'bg-[#0088EE] text-white' : 'bg-transparent text-black hover:bg-gray-50'}`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => {
                                        setRecommendFriend(false)
                                        if (errors.recommendFriend) setErrors({ ...errors, recommendFriend: '' })
                                    }}
                                    className={`px-8 py-1.5 rounded-full text-[14px] font-bold transition-all ${recommendFriend === false ? 'bg-[#0088EE] text-white' : 'bg-transparent text-black hover:bg-gray-50'}`}
                                >
                                    No
                                </button>
                            </div>
                            <ErrorMsg error={errors.recommendFriend} />
                        </div>
                    </section>

                    {/* 4. Price Range of the Course */}
                    <section>
                        <h3 className="text-[18px] font-[650] text-black mb-4">4. Price Range of the Course</h3>
                        <div className="relative w-full max-w-[340px]">
                            <select
                                value={priceRange}
                                onChange={(e) => {
                                    setPriceRange(e.target.value)
                                    if (errors.priceRange) setErrors({ ...errors, priceRange: '' })
                                }}
                                className={`w-full appearance-none bg-[#333] text-white px-5 py-2 text-[15px] font-[450] focus:outline-none cursor-pointer border-2 transition-all ${errors.priceRange ? 'border-red-500/50' : 'border-transparent'}`}
                            >
                                <option>Select a range</option>
                                <option>$0 - $100</option>
                                <option>$100 - $500</option>
                                <option>$500 - $1000</option>
                                <option>$1000+</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                        </div>
                        <ErrorMsg error={errors.priceRange} />
                        <p className="text-[13px] text-[#0088EE] font-[550] mt-2.5">
                            Price ranges are self-reported and may vary due to promotions, upsells, or refunds
                        </p>
                    </section>

                    {/* 5 Select up to 3 tags */}
                    <section>
                        <h3 className="text-[18px] font-[650] text-black mb-4"><span className="mr-2">5</span> Select up to 3 tags</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap gap-3">
                                {tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            toggleTag(tag)
                                            if (errors.tags) setErrors({ ...errors, tags: '' })
                                        }}
                                        className={`px-5 py-1 rounded-full text-[14px] font-montserrat font-[550] transition-all flex items-center gap-2 border-2 ${selectedTags.includes(tag)
                                            ? 'bg-[#0088EE] text-white border-[#0088EE] shadow-md'
                                            : 'bg-gray-50 text-gray-400 border-gray-50 hover:border-gray-200'
                                            }`}
                                    >
                                        {selectedTags.includes(tag) && <Check className="w-4 h-4 stroke-[4]" />}
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <ErrorMsg error={errors.tags} />
                        </div>
                    </section>

                    {/* 6 Write a Review */}
                    <section>
                        <h3 className="text-[18px] font-[650] text-black mb-4"><span className="mr-2">6</span> Write a Review</h3>
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={reviewText}
                                onChange={(e) => {
                                    setReviewText(e.target.value)
                                    if (errors.reviewText) setErrors({ ...errors, reviewText: '' })
                                }}
                                className={`w-full h-[180px] border border-black rounded-[10px] p-6 text-[14px] text-gray-800 font-bold focus:outline-none transition-all placeholder:text-gray-300 resize-none ${errors.reviewText ? 'border-red-100 bg-red-50/10' : 'border-black focus:border-[#0088EE]/30'}`}
                                placeholder="Discuss the Course or Course Owner professional abilities including teaching style and ability to convey the material clearly"
                            ></textarea>
                            <div className="flex justify-between items-center">
                                <ErrorMsg error={errors.reviewText} />
                                <span className={`text-[11px] font-bold ${reviewText.length < 10 ? 'text-gray-300' : 'text-green-500'}`}>
                                    {reviewText.length} characters
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 mt-8">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={termsAccepted}
                                    onChange={(e) => {
                                        setTermsAccepted(e.target.checked)
                                        if (errors.terms) setErrors({ ...errors, terms: '' })
                                    }}
                                    className="mt-1 w-4.5 h-4.5 border-2 border-gray-300 rounded cursor-pointer accent-[#0088EE]"
                                />
                                <label htmlFor="terms" className="text-[12px] text-[#0088EE] font-[550] leading-relaxed cursor-pointer select-none">
                                    By clicking Submit, I agree to the <span className="underline">Site Guidelines</span>, <span className="underline">Terms of Use</span> and <span className="underline">Privacy Policy</span>.
                                </label>
                            </div>
                            <ErrorMsg error={errors.terms} />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isChecking || hasReviewed}
                            style={{ backgroundColor: '#0080DB', color: 'white' }}
                            className={`!bg-[#0080DB] !text-white appearance-none py-2 px-10 border border-black font-montserrat rounded-[50px] mt-10 transition-all shadow-xl shadow-blue-100 text-[15px] active:scale-[0.98] ${(isSubmitting || isChecking || hasReviewed) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0080DB]'}`}
                        >
                            {isSubmitting ? 'Submitting...' : isChecking ? 'Checking...' : hasReviewed ? 'Already Reviewed' : 'Submit Now'}
                        </button>
                    </section>
                </div>
            </div>

            {/* Right Column - Sidebar */}
            <aside className="lg:w-[320px] pt-16">
                <div className="bg-[#D9D9D9] p-4 rounded-[10px] border border-gray-100 mb-8  top-24">
                    <div className="flex items-center gap-2 text-black font-black mb-2">
                        <div className="w-5 h-5 bg-[#0088EE] rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white stroke-[4]" />
                        </div>
                        <span className="text-[18px] font-[650] tracking-tight">Guidelines</span>
                    </div>
                    <ul className="flex flex-col gap-2 text-[13px] text-gray-500 font-bold font-montserrat leading-relaxed">
                        <li className="flex gap-2.5 font-[550] font-montserrat text-[14px] text-black">
                            <span className="text-black shrink-0">•</span>
                            Your rating could be removed if you use profanity or derogatory terms.
                        </li>
                        <li className="flex gap-2.5 font-[550] font-montserrat text-[14px] text-black">
                            <span className="text-black shrink-0">•</span>
                            Don't claim that the professor shows bias or favoritism for or against students.
                        </li>
                        <li className="flex gap-2.5 font-[550] font-montserrat text-[14px] text-black">
                            <span className="text-[#0088EE] shrink-0">•</span>
                            Don't forget to proof read!
                        </li>
                    </ul>
                    <Link href="#" className="text-[#0088EE] font-[550] text-[14px] mt-2 flex items-center gap-1.5 hover:underline group">
                        View all guidelines <ArrowUpRight className="w-3.5 h-3.5 stroke-[4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="flex flex-col items-center text-center px-4 mt-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                        <Lock className="w-6 h-7 text-[#0088EE]" />
                    </div>
                    <h4 className="font-[650] text-black text-[15px] mb-2">Your review is anonymous</h4>
                    <p className="text-[13px] text-gray-600 font-[550] font-montserrat">
                        We only verify that you took the course. Your public profile will not be linked unless you choose to.
                    </p>
                </div>
            </aside>
        </div>
    )
}
