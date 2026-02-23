'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export function SuccessContent() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center pt-24 pb-24 px-4 font-montserrat min-h-[60vh]">
            {/* Green Checkmark Icon */}
            <div className="mb-8 flex justify-center">
                <img src="/icons/success-icon.png" alt="Success Icon" className="w-15 h-15 object-contain" />
            </div>

            {/* Title */}
            <h1 className="text-5xl font-extrabold font-montserrat text-[#0D1B2A] mb-6 tracking-tight">Success!</h1>

            {/* Description */}
            <div className="text-[#0D1B2A] text-lg font-[500] text-center max-w-xl leading-snug mb-12">
                Thank you for reaching out! Our support team has<br />
                received your message and will get back to you<br />
                within 24 hours.
            </div>

            {/* Message Sent Box */}
            <div className="flex items-center gap-4 mb-12 bg-white rounded-lg px-2">
                <div className="flex items-center justify-center">
                    <img src="/icons/success-message-send.png" alt="Message Sent Icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="text-left">
                    <h3 className="text-[16px] font-montserrat font-[650] text-[#0D1B2A] leading-tight flex items-center gap-2">
                        Message Sent
                    </h3>
                    <p className="text-[11px] text-gray-600 font-[500] font-montserrat tracking-wide">Inquiry #29384 received</p>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={() => router.push('/')}
                className="bg-[#0088EE] text-white px-15 py-2 rounded-[50px] text-[16px] font-montserrat font-[550] border border-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-100  tracking-wide"
            >
                Submit
            </button>
        </div>
    )
}
