import React from 'react';
import { SidebarFilter } from '@/components/features/courses/SidebarFilter';
import { NewsletterWidget } from '@/components/features/courses/NewsletterWidget';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default function Loading() {
    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">

                <Breadcrumbs />

                <div className="flex justify-between items-baseline mb-8 mt-4">
                    <h1 className="text-4xl font-bold text-gray-900 font-montserrat">
                        Courses
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Main Content (Grid) - Takes 3 columns */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Render 6 skeleton course cards */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden animate-pulse min-h-[380px]">
                                    {/* Image Skeleton */}
                                    <div className="w-full h-[180px] bg-gray-200" />

                                    {/* Content Skeleton */}
                                    <div className="p-5 flex flex-col flex-1 gap-3">
                                        <div className="h-6 w-3/4 bg-gray-200 rounded" />
                                        <div className="h-6 w-1/2 bg-gray-200 rounded" />
                                        <div className="h-4 w-1/3 bg-gray-200 rounded mt-1" />

                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-5 h-5 bg-gray-200 rounded-full" />
                                            <div className="h-5 w-8 bg-gray-200 rounded" />
                                            <div className="h-4 w-20 bg-gray-200 rounded" />
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <div className="h-4 w-24 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        {/* Filter Skeleton (we can just show the real un-interactive one since it's static UI or a skeleton version) */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                            <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                            <div className="space-y-4">
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                                <div className="h-4 w-4/6 bg-gray-200 rounded" />
                                <div className="h-4 w-full bg-gray-200 rounded" />
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 w-full" />

                        {/* Trending Section Skeleton */}
                        <div className="animate-pulse">
                            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                            <div className="flex flex-col gap-5">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0" />
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                            <div className="h-3 w-1/2 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <NewsletterWidget />
                    </div>

                </div>
            </div>
        </main>
    );
}
