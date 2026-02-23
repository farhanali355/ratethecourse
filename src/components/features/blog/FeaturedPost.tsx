'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BlogPost } from './BlogData'

export function FeaturedPost({ post }: { post: BlogPost }) {
    if (!post) return null;

    return (
        <div className="flex flex-col gap-6 group lg:w-[50%] w-full">
            {/* Image Container */}
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content below image */}
            <div className="flex flex-col gap-2 mt-2">
                <h2 className="text-[28px] md:text-[24px] font-bold font-montserrat leading-[1.1] text-black group-hover:text-[#0088EE] transition-colors tracking-tight">
                    {post.title}
                </h2>

                <p className="text-black text-[16px] md:text-[18px] font-medium font-montserrat leading-relaxed line-clamp-3">
                    {post.description}
                </p>

                <Link href={post.link} className="text-[#0088EE] font-bold text-[18px] flex items-center gap-1 hover:underline mt-2 font-montserrat">
                    Read more <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            </div>
        </div>
    )
}
