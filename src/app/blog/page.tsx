import React from 'react'
import Link from 'next/link'
import { featuredPost, recentPosts, gridPosts } from '@/components/features/blog/BlogData'
import { FeaturedPost } from '@/components/features/blog/FeaturedPost'
import { RecentPostItem } from '@/components/features/blog/RecentPostItem'
import { BlogCard } from '@/components/features/blog/BlogCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-white">

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">

                <Breadcrumbs />

                <div className="mb-10">
                    <h1 className="text-[38px] md:text-[40px] font-[700] text-black font-montserrat tracking-tight leading-none mb-4">
                        Blog
                    </h1>
                </div>

                {/* Top Section: Featured + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr]  gap-x-12 gap-y-12 mb-16">

                    {/* Featured Post */}
                    <div>
                        <FeaturedPost post={featuredPost} />
                    </div>

                    {/* Recently Published */}
                    <div className='lg:ml-[-350px] lg:mt-[-50px] ml-0 mt-0'>

                        <div className="flex flex-col">
                            <h2 className="text-[24px] font-bold text-black font-montserrat mb-8 tracking-tight">
                                Recently Published
                            </h2>

                            <div className="flex flex-col gap-8">
                                {recentPosts.map(post => (
                                    <RecentPostItem key={post.id} post={post} />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>


                {/* Bottom Section: Grid of Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridPosts.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Load More Button */}
                <div className="flex justify-center mt-16 mb-20">
                    <button className="bg-[#0088EE] text-white tracking-wider font-[500] py-3 px-8 rounded-full hover:bg-blue-600 transition-colors shadow-md text-sm font-montserrat border border-black">
                        Load more blogs
                    </button>
                </div>

            </div>

        </main>
    )
}
