'use client'

import React from 'react'
import Link from 'next/link'
import { BlogPost } from './BlogData'

export function BlogRecentCard({ post }: { post: BlogPost }) {
    return (
        <div className="bg-[#0088EE] rounded-[24px] overflow-hidden group flex flex-col h-full shadow-lg transition-all hover:scale-[1.02]">
            {/* Image Container */}
            <div className="p-4 w-full">
                <div className="w-full aspect-video rounded-[20px] overflow-hidden border-2 border-white/20 bg-white/10 p-1">
                    <div className="w-full h-full rounded-[18px] overflow-hidden">
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
                <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
                    {post.category}
                </span>

                <h3 className="font-bold text-[20px] leading-tight font-montserrat group-hover:underline transition-all">
                    {post.title}
                </h3>

                <p className="text-sm text-white/90 font-montserrat leading-relaxed line-clamp-3">
                    {post.description}
                </p>

                {/* Author Info */}
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/20">
                        <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold font-montserrat">{post.author.name}</span>
                        <span className="text-xs text-white/80 font-montserrat">{patch_date(post.date)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function patch_date(date: string) {
    // Small helper to ensure date format matches design if needed
    return date;
}
