'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BlogPost } from './BlogData'

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <div className="flex flex-col gap-3 group h-full border border-none  rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all bg-white">
            <div className="w-full aspect-video relative overflow-hidden  bg-gray-200">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col gap-2 flex-1 p-5">
                <span className="text-[10px] uppercase tracking-wider text-black border border-black rounded-sm px-1.5 py-0.5 w-fit font-medium mt-2">
                    {post.date}
                </span>

                <h3 className="font-bold text-[19px] font-extrabold leading-tight text-black group-hover:text-blue-600 transition-colors font-montserrat">
                    {post.title}
                </h3>

                <p className="text-md text-black line-clamp-3 font-montserrat font-[530]">
                    {post.description}
                </p>

                <div className="mt-auto pt-2">
                    <Link href={post.link} className="text-[20px] text-[#0088EE] font-montserrat font-[500] flex items-center gap-1 hover:underline">
                        Read more <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
