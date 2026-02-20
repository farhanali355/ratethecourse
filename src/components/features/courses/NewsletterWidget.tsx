'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function NewsletterWidget() {
    const router = useRouter()
    const [email, setEmail] = useState('')

    const handleSubscribe = () => {
        if (!email) {
            toast.error('Please enter your email address')
            return
        }

        // Basic email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address')
            return
        }

        router.push('/success')
    }

    return (
        <div className="font-montserrat">
            <div className=" rounded-[10px] p-4 text-center flex flex-col items-center gap-4 border border-[#13A4EC]">
                <div className="flex items-center justify-center pb-2">
                    <img src="/icons/email-icon.png" alt="Email Icon" className="w-10 h-10 object-contain" />
                </div>

                <div>
                    <h3 className="font-bold text-[22px] text-black mb-1 font-montserrat">
                        Get the weekly digest
                    </h3>
                    <p className="text-[17px] text-black font-medium leading-relaxed font-montserrat max-w-[300px]">
                        Join 10,000+ students getting honest reviews and course alerts.
                    </p>
                </div>

                <div className="w-full space-y-3">
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-400 rounded-md px-4 py-3 text-[15px] text-black outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleSubscribe}
                        className="w-[180px] bg-[#0088EE] font-montserrat border border-black  text-white font-[500] py-1 rounded-[50px] text-[16px] hover:bg-blue-600 transition-all shadow-md shadow-blue-100"
                    >
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    )
}
