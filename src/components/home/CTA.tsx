
import Link from 'next/link'

export function CTA() {
    return (
        <section className="relative w-full py-20 px-4 md:py-32 overflow-hidden flex items-center justify-center">
            {/* Background Image with Dark Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url("/images/hero-2-bg.png")',
                }}
            >
                <div className="absolute inset-0 bg-black/5 z-0" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h2 className="text-white text-3xl md:text-5xl  font-[800] font-montserrat mb-6 tracking-tight">
                    Can't find your course or coach?
                </h2>

                <p className="text-white text-base md:text-lg font-normal font-montserrat mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
                    Can't find your course or coach? Don't worry tell us what you're looking for, and we'll help you find it fast!
                </p>

                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 bg-[#0088EE] text-white px-8 py-3.5 rounded-full text-base font-[400] text-[20px] hover:bg-blue-600 transition-all shadow-lg border border-white/100 font-montserrat"
                >
                    <div className=" p-1.5 rounded-md flex items-center justify-center">
                        <img src="/icons/write-btn-icon.png" alt="Write Icon" className="w-7 h-7 object-contain" />
                    </div>
                    Write a Review
                </Link>
            </div>
        </section>
    )
}
