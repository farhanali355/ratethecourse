'use client'

import React, { useState } from 'react'
import { featuredPosts, recentPosts } from '@/components/features/blog/BlogData'
import { BlogFeaturedCard } from '@/components/features/blog/BlogFeaturedCard'
import { BlogRecentCard } from '@/components/features/blog/BlogRecentCard'
import { BlogSubscription } from '@/components/features/blog/BlogSubscription'

export default function BlogPage() {
    const [visibleCount, setVisibleCount] = useState(2);

    const loadMore = () => {
        setVisibleCount(prev => prev + 2);
    };

    return (
        <main className="min-h-screen font-montserrat" style={{ backgroundColor: '#0B1120' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">

                {/* Featured Blog Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-lg md:text-xl font-[550] text-gray-900 tracking-[0.1em] whitespace-nowrap">
                            FEATURED BLOG
                        </h2>
                        <div className="h-px bg-gray-800 flex-1"></div>
                    </div>

                    <div className="flex flex-col gap-8 md:gap-12">
                        {featuredPosts.slice(0, 3).map(post => (
                            <BlogFeaturedCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>

                {/* Recent Blog Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-lg md:text-xl font-[550] text-gray-900 tracking-[0.1em] whitespace-nowrap">
                            RECENT BLOG
                        </h2>
                        <div className="h-px bg-gray-800 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-16">
                        {recentPosts.slice(0, visibleCount).map(post => (
                            <BlogRecentCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>

                {/* Load More Button */}
                {visibleCount < recentPosts.length && (
                    <div className="flex justify-center mt-8 mb-4">
                        <button 
                            onClick={loadMore}
                            className="bg-[#0088EE] text-white font-[500] font-montserrat border border-black py-2 px-8 rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95 border border-[#0088EE]"
                        >
                            Load more blogs
                        </button>
                    </div>
                )}

            </div>

            {/* Subscription Section */}
            <div>
                <BlogSubscription />
            </div>
        </main>
    )
}

