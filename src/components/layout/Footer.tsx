'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
    const pathname = usePathname()

    // Hide footer on admin routes
    if (pathname?.startsWith('/admin')) {
        return null
    }

    return (
        <footer className="bg-black text-white py-12 px-6 md:px-12 font-montserrat">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Top Section - Logo */}
                <div className="flex justify-start">
                    <Link href="/" className="inline-block">
                        <img src="/images/logo.png" alt="RTC Logo" className="h-8 w-auto brightness-0 invert" />
                    </Link>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-white"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">

                    {/* Copyright */}
                    <div className="tracking-wider">
                        © 2026 RTC, LLC. All Rights Reserved
                    </div>

                    {/* Socials */}
                    <div className="flex gap-4">
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <img src="/icons/linkedin.png" alt="LinkedIn" className="w-5 h-5 object-contain" />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <img src="/icons/tiktok.png" alt="TikTok" className="w-5 h-5 object-contain" />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <img src="/icons/insta.png" alt="Instagram" className="w-5 h-5 object-contain" />
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-white transition-colors tracking-wider">Terms of Service</Link>
                        <Link href="/guidelines" className="hover:text-white transition-colors tracking-wider">Review Guidelines</Link>
                    </div>

                </div>
            </div>
        </footer>
    )
}
