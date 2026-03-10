'use client'

import React from 'react'

export function BlogSubscription() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6 text-center">
            <h2 className="text-[32px] md:text-[40px] font-extrabold text-black font-montserrat mb-3">
                Get the latest Updates
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10 font-montserrat text-sm md:text-base leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 items-stretch justify-center max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0088EE] transition-all font-montserrat text-black placeholder:text-gray-400 bg-white"
                />
                <button
                    type="submit"
                    className="bg-[#0088EE] text-white px-10 py-4 rounded-full font-bold font-montserrat hover:bg-blue-600 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                >
                    Subscribe
                </button>
            </form>

            <p className="mt-6 text-xs text-gray-400 font-montserrat">
                By joining, you agree to our Terms and Conditions.
            </p>
        </div>
    )
}
