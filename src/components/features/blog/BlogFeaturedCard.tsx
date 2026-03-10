'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BlogPost } from './BlogData'

export function BlogFeaturedCard({ post }: { post: BlogPost }) {
    if (!post) return null;

    return (
        <div className="bg-[#0088EE] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center group transition-all hover:scale-[1.01] shadow-lg">
            {/* Image Container */}
            <div className="w-full md:w-[45%] aspect-[16/10] rounded-[24px] overflow-hidden bg-white/10 p-2">
                <div className="w-full h-full rounded-[20px] overflow-hidden border-2 border-white/20">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                             (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Featured+Blog';
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 flex-1 text-white">
                <h2 className="text-[24px] md:text-[32px] font-bold font-montserrat leading-tight tracking-tight">
                    {post.title}
                </h2>

                <p className="text-white/90 text-sm md:text-base font-medium font-montserrat line-clamp-3 leading-relaxed">
                    {post.description}
                </p>

                <div className="mt-2">
                    <Link href={post.link} className="inline-flex items-center gap-2 text-[18px] font-bold font-montserrat hover:gap-3 transition-all">
                        Read more <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/20">
                        <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold font-montserrat">{post.author.name}</span>
                        <span className="text-xs text-white/80 font-montserrat">{post.date} • {post.readTime}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
