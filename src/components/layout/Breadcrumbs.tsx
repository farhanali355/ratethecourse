'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
    const pathname = usePathname()

    const links = [
        { label: 'Home', href: '/' },
        { label: 'Courses', href: '/courses' },
        { label: 'Blog', href: '/blog' }
    ]

    return (
        <div className="flex items-center gap-2 text-md text-black  mb-6 font-montserrat">
            {links.map((link, index) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))

                return (
                    <React.Fragment key={link.href}>
                        <Link
                            href={link.href}
                            className={`transition-colors hover:text-black ${isActive ? 'text-[#0088EE] font-semibold' : 'hover:text-black'}`}
                        >
                            {link.label}
                        </Link>
                        {index < links.length - 1 && <span>/</span>}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
