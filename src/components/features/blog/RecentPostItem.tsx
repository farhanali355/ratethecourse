'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BlogPost } from './BlogData'

export function RecentPostItem({ post }: { post: BlogPost }) {
    return (
        <div className="flex gap-4 md:gap-5 items-start group">
            <div className="w-[120px] h-[110px] md:w-[160px] md:h-[110px] relative flex-shrink-0 lg:mt-[-10px] mt-0 rounded-lg overflow-hidden bg-black shadow-sm">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex-1 flex flex-col gap-1 md:gap-1.5">
                <span className="text-[11px] font-bold text-gray-500 border border-gray-300 rounded-md px-2 py-0.5 w-fit">
                    {post.date}
                </span>
                <h3 className="font-bold text-[18px] lg:text-[20px] leading-[1.3] text-black group-hover:text-[#0088EE] transition-colors font-montserrat">
                    {post.title}
                </h3>
                <Link href={post.link} className="text-[14px] text-[#0088EE] font-bold flex items-center gap-0.5 hover:underline font-montserrat">
                    Read more <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
            </div>
        </div>
    )
}
