'use client'

import React from 'react'
import Link from 'next/link'
import { BlogPost } from './BlogData'

export function BlogRecentCard({ post }: { post: BlogPost }) {
    return (
        <Link href={post.link} className="block group">
            <div className="bg-[#0088EE] rounded-[24px] overflow-hidden flex flex-col h-full [box-shadow:0_15px_35px_rgba(0,0,0,0.25)] transition-all hover:scale-[1.02]">
                {/* Image Container */}
                <div className="p-4 w-full">
                    <div className="w-full aspect-video rounded-[20px] overflow-hidden border-2 border-white/20 bg-[#0077EE] p-3 [box-shadow:inset_0_4px_8px_rgba(0,0,0,0.2)]">
                        <div className="w-full h-full rounded-[18px] overflow-hidden shadow-inner">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x250/png?text=Recent+Post';
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 pt-2 flex flex-col flex-1 gap-3 text-white">
                    <div className="bg-[#0077EE]/50 w-fit px-3 py-1 rounded-full text-[12px] font-[550] text-white mb-2 [box-shadow:inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        {post.date}
                    </div>

                    <h3 className="font-bold text-[20px] leading-tight font-montserrat transition-all">
                        {post.title}
                    </h3>

                    <p className="text-sm text-white/90 font-montserrat leading-relaxed line-clamp-3">
                        {post.description}
                    </p>

                    {/* Author Info */}
                    <div className="mt-auto pt-4  flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/20">
                            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold font-montserrat">{post.author.name}</span>
                            {/* <span className="text-xs text-white/80 font-montserrat">{patch_date(post.date)}</span> */}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function patch_date(date: string) {
    // Small helper to ensure date format matches design if needed
    return date;
}
