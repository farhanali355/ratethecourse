
import { Search } from 'lucide-react'

export function Hero() {
    return (
        <div className="relative w-full h-[600px] flex flex-col items-center justify-center text-center px-4">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url("/images/hero-image.png")',
                    // filter: 'brightness(0.6)' // Removed filter to match "same to same" unless needed. Image usually handles it or overlay.
                }}
            >
                <div className="absolute inset-0 bg-black/5"></div> {/* Reduced overlay opacity further as requested */}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center pt-12 md:pt-20">

                {/* Title Image */}
                <div className="flex items-center justify-center mb-8 w-full">
                    <img
                        src="/images/Group 1707479323.png"
                        alt="Rate the Courses"
                        className="h-auto max-w-[90%] md:max-w-[500px] object-contain"
                    />
                </div>


                <h2 className="text-white text-lg md:text-2xl font-[450] mb-8 md:mb-10 tracking-wide drop-shadow-md font-montserrat max-w-[90%] md:max-w-none">
                    Honest reviews from real students for professional <br className="hidden md:block" />
                    <span className="font-montserrat font-bold text-2xl md:text-3xl block mt-2 md:inline md:mt-0">Coach and Courses.</span>
                </h2>

                {/* Search Bar */}
                <form
                    action="/search"
                    className="w-[70%] max-w-3xl bg-white rounded-xl md:rounded-lg p-1 md:p-1.5 flex flex-col md:flex-row shadow-2xl  md:mb-5 border-2 border-white/20"
                >
                    <div className="flex-1 flex items-center px-4 py-2 md:py-0">
                        <Search className="w-4 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            name="q"
                            placeholder="Search courses, couches, or topics..."
                            className="
    flex-1
    py-2 md:py-3
    text-gray-600
    outline-none
    text-sm md:text-base
    font-medium
font-montserrat
    placeholder:text-grey
    placeholder:text-base md:placeholder:text-lg
    placeholder:font-medium
  "
                        />

                    </div>
                    <button
                        type="submit"
                        className="bg-[#0088EE] text-white px-8 md:px-8 py-3 md:py-3 rounded-lg md:rounded-sm font-[400] font-montserrat text-md md:text-lg hover:bg-blue-600 transition-colors m-1 md:m-0 shadow-lg shadow-blue-200/50"
                    >
                        Search
                    </button>
                </form>

                {/* Filters */}
                <div className="w-full flex items-center justify-center px-4 mt-2 overflow-x-hidden">
                    <div
                        className="
                            flex items-center
                            rounded-sm
                            bg-[#414141]/60
                            backdrop-blur-xl
                            border border-white/80
                            shadow-2xl
                            text-white
                            font-montserrat
                            text-[11px] md:text-sm
                            py-0 px-2 md:px-0
                            overflow-x-auto
                            scrollbar-hide
                            max-w-full
                        "
                    >
                        {/* Category */}
                        <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors rounded-lg font-montserrat">
                            <span className="font-[300] text-[13px] md:text-lg text-white ">Category</span>
                            <span className="text-[9px] md:text-[10px] opacity-70">▼</span>
                        </div>

                        {/* Price range */}
                        <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors rounded-lg font-montserrat">
                            <span className="font-[300] text-[13px] md:text-lg text-white ">Price range</span>
                            <span className="text-[9px] md:text-[10px] opacity-70">▼</span>
                        </div>

                        {/* Trust Metrics */}
                        <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors rounded-lg font-montserrat">
                            <span className="font-[300] text-[13px] md:text-lg text-white ">Trust Metrics</span>
                            <span className="text-[9px] md:text-[10px] opacity-70">▼</span>
                        </div>

                        {/* Divider */}
                        <div className="mx-2 h-7 w-px bg-white/50 hidden md:block"></div>

                        {/* Clear all */}
                        <div className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2.5 cursor-pointer whitespace-nowrap hover:bg-red-500/20 text-red-200 md:text-white transition-colors rounded-lg font-montserrat">
                            <span className="text-sm md:text-lg leading-none">×</span>
                            <span className="font-[300] text-[13px] md:text-lg text-white ">Clear All</span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
