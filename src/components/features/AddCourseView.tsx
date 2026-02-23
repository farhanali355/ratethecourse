'use client'

import React, { useState } from 'react'
import { AddCourseForm } from './AddCourseForm'
import { AddCourseSuccess } from './AddCourseSuccess'

export function AddCourseView() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    if (isSubmitted) {
        return <AddCourseSuccess />
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animation-fade-in">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
                <h1 className="text-4xl font-[700] font-montserrat mb-4 text-black">Add a New Course or Coach</h1>
                <p className="text-[#000000] mb-10 text-lg">
                    Help other students find great learning resources by contributing to the library.
                </p>

                <AddCourseForm onSuccess={() => setIsSubmitted(true)} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">

                {/* Did you know card */}
                <div className="bg-[#D9D9D9] p-6 rounded-xl">
                    <div className="flex items-start gap-4 mb-3">
                        <div className="bg-[#8ACCFA] backdrop-blur-sm p-1.5 rounded-full shrink-0 shadow-sm ">
                            <img src="/icons/did-you-know.png" alt="Lightbulb Icon" className="w-6 h-6 object-contain" />
                        </div>
                        <h3 className="text-[23px] font-[600] font-montserrat text-black mt-1">Did you know?</h3>
                    </div>
                    <p className="text-[15px] font-[550] font-montserrat ml-12 text-black leading-relaxed">
                        Students like you are the primary contributors to this library. By adding accurate details, you help thousands of others avoid bad courses and find the hidden gems.
                    </p>
                </div>

                {/* Submission Guidelines card */}
                <div className="bg-[#D9D9D9] p-6 rounded-xl">
                    <div className="flex items-start gap-4 mb-4">
                        <img src="/icons/is-this.png" alt="Check Icon" className="w-8 h-8 object-contain shrink-0" />
                        <h3 className="text-[23px] font-[600] font-montserrat text-black mt-0.5">Submission Guidelines</h3>
                    </div>

                    <ul className="space-y-4 ml-10">
                        <li className="flex items-start gap-3">
                            <img src="/icons/submission-icon.png" alt="Check Icon" className="w-4 h-4 object-contain shrink-0 mt-0.5" />
                            <p className="text-[15px] font-[550] font-montserrat text-black leading-snug">
                                Verify the official URL before pasting. Broken links frustrate everyone!
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <img src="/icons/submission-icon.png" alt="Check Icon" className="w-4 h-4 object-contain shrink-0 mt-0.5" />
                            <p className="text-[15px] font-[550] font-montserrat text-black leading-snug">
                                Use the full name of the coach (First & Last) if possible.
                            </p>
                        </li>
                        <li className="flex items-start gap-3">
                            <img src="/icons/submission-icon.png" alt="Check Icon" className="w-4 h-4 object-contain shrink-0 mt-0.5" />
                            <p className="text-[15px] font-[550] font-montserrat text-black leading-snug">
                                Avoid duplicate entries by searching first.
                            </p>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
