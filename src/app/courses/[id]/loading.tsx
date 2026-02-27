import React from 'react'

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] font-montserrat animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8 w-full">

                {/* Breadcrumbs Skeleton */}
                <div className="h-6 w-48 bg-gray-200 rounded-md mb-6 mt-2"></div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-6 md:mt-8">
                    {/* Main Content (Left) */}
                    <div className="flex-1 min-w-0">

                        {/* Course Header Section */}
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8 md:mb-10 items-center md:items-start text-center md:text-left">
                            {/* Course Image Skeleton */}
                            <div className="w-[130px] h-[130px] md:w-[180px] md:h-[180px] rounded-[24px] bg-gray-200 flex-shrink-0"></div>

                            <div className="flex-1 flex flex-col pt-1 w-full min-w-0">
                                {/* Title and Rating Skeleton */}
                                <div className="flex flex-col md:flex-row items-center md:items-center justify-between mb-4 md:mb-0 w-full gap-4 md:gap-8 lg:gap-16">
                                    <div className="h-10 md:h-12 w-3/4 bg-gray-200 rounded-lg"></div>
                                    <div className="h-16 w-24 bg-gray-200 rounded-lg shrink-0 mt-2 md:mt-[-10px]"></div>
                                </div>

                                {/* Author Skeleton */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 mb-6 mt-4">
                                    <div className="h-6 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
                                </div>

                                {/* Tags Skeleton */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-8 md:mb-10">
                                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                                    <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
                                    <div className="h-6 w-28 bg-gray-200 rounded-full"></div>
                                </div>

                                {/* Button Skeleton */}
                                <div className="flex justify-center md:justify-start">
                                    <div className="h-12 w-48 bg-gray-200 rounded-[50px]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Stats Grid Skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-12 md:mb-16">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white border border-gray-100 p-4 rounded-[10px] flex flex-col h-[120px] justify-between">
                                    <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
                                </div>
                            ))}
                        </div>

                        {/* About Skeleton */}
                        <div className="mb-12 md:mb-16">
                            <div className="h-8 w-48 bg-gray-200 rounded-md mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Skeleton */}
                    <aside className="w-full lg:w-[350px] flex flex-col gap-8 md:gap-10">
                        {/* Claim Widget Skeleton */}
                        <div className="bg-gray-100 p-4 rounded-[10px] h-[160px]"></div>

                        {/* Trending Skeleton */}
                        <div className="flex flex-col gap-6">
                            <div className="h-7 w-48 bg-gray-200 rounded-md"></div>
                            <div className="flex flex-col gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-5">
                                        <div className="w-24 h-24 rounded-[18px] bg-gray-200 flex-shrink-0"></div>
                                        <div className="flex flex-col justify-center gap-2 w-full">
                                            <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Skeleton */}
                        <div className="h-64 bg-gray-200 rounded-[20px]"></div>
                    </aside>
                </div>
            </div>
        </main>
    )
}
