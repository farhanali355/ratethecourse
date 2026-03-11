'use client'

import React from 'react'
import Link from 'next/link'

export function BlogSubscription() {
    return (
        <div className="max-w-4xl mx-auto pt-10 pb-20 px-6 text-center">
            <h2 className="text-[32px] md:text-[42px] font-[850] font-montserrat text-black mb-3">
                Get the latest Updates
            </h2>
            <p className="text-black max-w-[820px] font-[450] mx-auto mb-10 font-montserrat text-[20px] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius <br className="hidden md:block" /> enim in eros elementum tristique.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 items-stretch justify-center max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-8 py-3 border border-black rounded-[50px] bg-[#0088EE] text-white placeholder:text-white/80 focus:outline-none transition-all font-montserrat font-medium text-[19px] [box-shadow:0_10px_30px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(0,0,0,0.3)]"
                />
                <button
                    type="submit"
                    className="bg-[#0088EE] text-white border border-black px-12 py-3 rounded-[50px] font-[450] font-montserrat hover:bg-blue-600 transition-all [box-shadow:0_10px_30px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(0,0,0,0.3)] active:scale-95 whitespace-nowrap text-[19px]"
                >
                    Subscribe
                </button>
            </form>

            <p className="mt-8 text-[15px] text-black font-montserrat font-[450]">
                By clicking Subscribe Up you're confirming that you agree with our <Link href="/terms" className="text-[#0088EE] hover:underline">Terms and Conditions</Link>.
            </p>
        </div>
    )
}
