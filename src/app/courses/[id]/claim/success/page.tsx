import React from 'react'
import Link from 'next/link'

// Custom icons for the timeline based on screenshot
export default function ClaimSuccessPage() {
    return (
        <main className="min-h-screen bg-white font-montserrat">

            <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">

                {/* Success Icon */}
                <div className="mb-8 flex justify-center">
                    <img src="/icons/success-icon.png" alt="Success Icon" className="w-14 h-14 object-contain" />
                </div>

                {/* Main Heading */}
                <h1 className="text-[40px] font-[800] text-black mb-4 text-center tracking-tight">
                    Submission Received!
                </h1>

                {/* Subheading */}
                <p className="text-[18px] text-black font-montserrat font-[500] text-center mb-16">
                    Thank you for helping grow our community.
                </p>

                {/* Status Timeline */}
                <div className="flex items-center gap-22 mb-20">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#0088EE] flex items-center justify-center shadow-lg shadow-blue-100 shrink-0">
                            <img src="/icons/is-this.png" alt="Received" className="w-5 h-5 object-contain brightness-0 invert" />
                        </div>
                        <span className="text-[#0088EE] font-[550] font-montserrat text-[15px]">Received</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                            <img src="/icons/in-review.png" alt="In Review" className="w-12 h-12 object-contain" />
                        </div>
                        <span className="text-[#0088EE] font-[550] font-montserrat text-[15px]">In Review</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-gray-400">
                            <img src="/icons/published.png" alt="Published" className="w-8 h-8 object-contain grayscale" />
                        </div>
                        <span className="text-gray-400 font-[550] font-montserrat text-[15px]">Published</span>
                    </div>
                </div>

                {/* What Happens Next Box */}
                <div className="w-full max-w-2xl bg-white rounded-2xl p-8 flex gap-5 mb-20">
                    <div className="mt-1 shrink-0">
                        <img src="/icons/what-happend.png" alt="What Next Icon" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[18px] font-[650] font-montserrat text-black">What happens next?</h3>
                        <p className="text-[15px] text-gray-500 font-[500] leading-relaxed">
                            Our admin team is currently reviewing your submission. We manually verify every profile to check for duplicates and ensure all details are accurate before publishing. This usually takes 24-48 hours.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-8">
                    <div className="flex items-center gap-4">
                        <Link href="/courses/1/claim" className="text-black font-[650] font-montserrat text-[18px] hover:underline">
                            Submit another profile
                        </Link>
                        <Link href="/courses" className="bg-[#0088EE] text-white font-[550] border border-black font-montserrat py-2 px-9 rounded-full text-[16px]  hover:bg-blue-600 transition-all shadow-lg shadow-blue-100">
                            Explore Courses
                        </Link>
                    </div>

                    <p className="text-[13px] text-gray-400 font-bold flex items-center gap-2">
                        <img src="/icons/submit-email.png" alt="Email Icon" className="w-4 h-4 object-contain" />
                        You will be notified via email once the profile is live.
                    </p>
                </div>

            </div>

        </main>
    )
}
