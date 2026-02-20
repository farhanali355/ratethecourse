'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface AuthGuardLinkProps {
    href: string
    className?: string
    children: React.ReactNode
    message?: string
    onClick?: () => void
}

export function AuthGuardLink({ href, className, children, message, onClick }: AuthGuardLinkProps) {
    const { user } = useAuth()
    const router = useRouter()

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) onClick()

        if (!user) {
            e.preventDefault()
            toast.info(message || "Sign in required", {
                description: "Please log in or create an account to perform this action.",
                duration: 4000,
            })
        }
    }

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    )
}
