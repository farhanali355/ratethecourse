'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

export function BlogSubscription() {
    const [email, setEmail] = useState('');

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error('Please enter your email before subscribing.');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        // Simulating a successful subscription
        toast.success('Thank you for subscribing! Check your inbox for updates.');
        setEmail('');
    };

    return (
        <div className="max-w-4xl mx-auto pt-10 pb-20 px-6 text-center font-montserrat">
            <h2 className="text-[32px] md:text-[42px] font-[850] text-white mb-3">
                Get the latest Updates
            </h2>
            <p className="text-white max-w-[820px] font-[450] mx-auto mb-10 text-[20px] leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius <br className="hidden md:block" /> enim in eros elementum tristique.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 items-stretch justify-center max-w-xl mx-auto" onSubmit={handleSubscribe}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-8 py-3 border border-black rounded-[50px] bg-[#0088EE] text-white placeholder:text-white/80 focus:outline-none transition-all font-medium text-[19px] [box-shadow:0_10px_30_rgba(0,0,0,0.2),inset_0_4_8_rgba(0,0,0,0.3)]"
                />
                <button
                    type="submit"
                    className="bg-[#0088EE] text-white border border-black px-12 py-3 rounded-[50px] font-[450] hover:bg-blue-600 transition-all [box-shadow:0_10px_30_rgba(0,0,0,0.2),inset_0_4_8_rgba(0,0,0,0.3)] active:scale-95 whitespace-nowrap text-[19px]"
                >
                    Subscribe
                </button>
            </form>

            <p className="mt-8 text-[15px] text-white font-[450]">
                By clicking Subscribe Up you're confirming that you agree with our <Link href="/terms" className="text-[#0088EE] hover:underline font-semibold">Terms and Conditions</Link>.
            </p>
        </div>
    )
}
