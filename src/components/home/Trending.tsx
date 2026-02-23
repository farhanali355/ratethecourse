
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'

const courses = [
    {
        id: '1',
        name: 'High Ticket Inner Circle',
        coach: 'BRAM DOPPENBERG',
        rating: 4.9,
        reviews: 124,
        metrics: { credibility: 98, roi: 72, recommend: 95 },
        image: '/images/course-1-image.png'
    },
    {
        id: '2',
        name: 'Acquisition Offers',
        coach: 'ALEX HORMOZI',
        rating: 4.8,
        reviews: 856,
        metrics: { credibility: 99, roi: 88, recommend: 92 },
        image: '/images/course-1-image.png'
    },
    {
        id: '4',
        name: 'Grow AI Agency',
        coach: 'JAKE ARNOLD',
        rating: 4.5,
        reviews: 42,
        metrics: { credibility: 92, roi: 60, recommend: 78 },
        image: '/images/course-1-image.png'
    }
]

export function Trending() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-[38px] font-montserrat font-[800] text-black tracking-tight">Trending Courses</h2>
                    <Link href="/courses" className="text-blue-500 text-lg font-semibold flex items-center hover:underline font-montserrat">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map((course, idx) => (
                        <div key={idx} className="bg-black text-white rounded-xl p-6 relative overflow-hidden flex flex-col h-full">
                            {/* Card Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <img src={course.image} alt={course.coach} className="w-14 h-14 rounded-full border-2 border-gray-700 object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-[600] text-[28px] font-montserrat leading-tight">{course.name}</h3>
                                    <p className="text-xs text-white text-[14px] uppercase tracking-widest mt-1 font-montserrat">{course.coach}</p>
                                    {/* Star Rating */}
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 " />
                                        <span className="text-yellow-500 font-bold text-lg">{course.rating}</span>
                                        <span className="text-white text-lg ml-1">{course.reviews} Reviews</span>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics */}
                            <div className="space-y-4 mb-8 flex-1">
                                <Metric label="Credibility Score" value={course.metrics.credibility} icon="/icons/credibility.png" />
                                <Metric label="Positive ROI" value={course.metrics.roi} icon="/icons/positive.png" />
                                <Metric label="Recommend" value={course.metrics.recommend} icon="/icons/recommend.png" />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-800">
                                <span className='text-[16px] font-montserrat font-[400] text-white'>Trending Category</span>
                                <Link href={`/courses/${course.id}`} className="text-blue-400 hover:text-blue-300 text-[16px] font-montserrat font-[400]">See Reviews</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function Metric({ label, value, icon }: { label: string, value: number, icon: string }) {
    return (
        <div>
            <div className="flex justify-between text-[16px] font-montserrat font-[400] mb-2">
                <span className="flex items-center gap-2">
                    <img src={icon} alt={label} className="w-4 h-4 object-contain" />
                    {label}
                </span>
                <span className="font-bold">{value}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                    className="bg-white h-1.5 rounded-full"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    )
}
