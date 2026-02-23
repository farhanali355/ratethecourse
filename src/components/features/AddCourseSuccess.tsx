import Link from 'next/link'
import { Info } from 'lucide-react'

export function AddCourseSuccess() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-2xl mx-auto font-montserrat animation-fade-in">
            {/* Illustration */}
            <div className="mb-8 w-48 h-48 rounded-lg overflow-hidden relative">
                {/* Illustration */}
                <img
                    src="/images/addmycourse-submit-image.png"
                    alt="Success Illustration"
                    className="w-full h-full object-contain"
                />
            </div>

            <h2 className="text-4xl font-extrabold text-black mb-4">
                Thanks for your feedback!
            </h2>

            <p className="text-[#3F6E8F] text-lg mb-10 max-w-lg leading-relaxed font-medium">
                To maintain high quality, our team will review your post within 24-48 hours. We'll notify you once it's live.
            </p>

            <div className="flex gap-4 mb-12">
                <Link
                    href="/courses"
                    className="bg-[#EBEBEB] text-black font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors shadow-sm"
                >
                    Back to Course
                </Link>
                <Link
                    href="/profile"
                    className="bg-[#0088EE] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                >
                    Go to My Profile
                </Link>
            </div>

            <button className="flex items-center gap-2 text-[#5E7DA8] hover:text-[#0088EE] transition-colors text-sm font-medium">
                <Info className="w-4 h-4" />
                Why do we moderate?
            </button>
        </div>
    )
}
