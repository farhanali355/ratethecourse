export interface DetailedRating {
    label: string;
    score: string;
    description: string;
    icon?: string;
}

export interface CourseReview {
    id: string;
    user: string;
    initials: string;
    role: string;
    rating: number;
    comment: string;
    verified: boolean;
}

export interface Course {
    id: string;
    title: string;
    author: string;
    handle?: string; // e.g. "@bramdoppenberg"
    rating: number;
    reviews: number;
    category: string;
    subcategories?: string[]; // e.g. ["Sales", "Scaling"]
    imageUrl: string;
    badge?: string;
    link: string;
    fullDescription?: string;
    detailedRatings?: DetailedRating[];
    pros?: string[];
    cons?: string[];
    worthItText?: string;
    studentReviews?: CourseReview[];
}

export const courses: Course[] = [
    {
        id: '1',
        title: 'High Ticket Inner Circle',
        author: 'BRAM DOPPENBERG',
        handle: '@bramdoppenberg',
        rating: 4.6,
        reviews: 124,
        category: 'Business Strategy',
        subcategories: ['Sales', 'Scaling', 'Business Strategy'],
        imageUrl: '/images/course-1-image.png',
        badge: 'BEST SELLER',
        link: '/courses/1',
        fullDescription: 'The $100M Offers course by Alex Hormozi is designed to help entrepreneurs create irresistible offers that practically sell themselves. It covers the core psychology of value, how to structure pricing, and how to eliminate risk for the buyer.\n\nKey modules include the Value Equation, Naming & Packaging, Bonuses & Guarantees, and Scarcity & Urgency tactics. This is often considered the foundational course in the Acquisition.com curriculum.',
        detailedRatings: [
            { label: 'Safety Rating', score: '94%', description: 'Trusted & Secure' },
            { label: 'ROI Success', score: '78%', description: 'Strong ROI Potential' },
            { label: 'Recommendation', score: '88%', description: 'Highly Recommended' },
            { label: 'Overall Rating', score: '4.8/5', description: 'Excellent Overall Rating' }
        ],
        pros: [
            'Extremely practical \'Value Equation\' framework that can be applied immediately',
            'High production value with clear, engaging delivery style',
            'Actionable pricing strategies that often lead to quick ROI',
            'Comprehensive psychological approach to sales resistance'
        ],
        cons: [
            'Content is very dense and can be overwhelming for total beginners',
            'Examples lean heavily towards service-based and gym businesses',
            'Some older video modules have varying audio quality',
            'Requires multiple viewings to fully absorb all nuances'
        ],
        worthItText: 'The $100M Offers course by Alex Hormozi is designed to help entrepreneurs create irresistible offers that practically sell themselves. It covers the core psychology of value, how to structure pricing, and how to eliminate risk for the buyer.',
        studentReviews: [
            {
                id: 'r1',
                user: 'Mike K.',
                initials: 'MK',
                role: 'Agency Owner ($50k/mo)',
                rating: 5,
                comment: 'I was skeptical at first because everyone hypes Hormozi up. But the Grand Slam Offer framework is legit. I repackaged my agency...',
                verified: true
            },
            {
                id: 'r2',
                user: 'Sarah L.',
                initials: 'SL',
                role: 'Coach & Consultant',
                rating: 5,
                comment: 'The bonus module completely changed my perspective. I stopped discounting and started adding value instead. My refund rate dropped...',
                verified: true
            }
        ]
    },
    {
        id: '2',
        title: 'Acquisition Offers',
        author: 'ALEX HORMOZI',
        rating: 4.8,
        reviews: 954,
        category: 'AI Category',
        imageUrl: '/images/course-1-image.png',
        badge: 'Best Seller',
        link: '/courses/2'
    },
    {
        id: '3',
        title: 'High Ticket Inner Circle',
        author: 'BRAM DOPPENBERG',
        rating: 4.9,
        reviews: 124,
        category: 'Business Category',
        imageUrl: '/images/course-1-image.png',
        badge: 'Best Seller',
        link: '/courses/3'
    },
    // ... rest of the courses with basic info for now
    {
        id: '4',
        title: 'Grow AI Agency',
        author: 'JAKE ARNOLD',
        rating: 4.5,
        reviews: 42,
        category: 'Trending Category',
        imageUrl: '/images/course-1-image.png',
        badge: 'Best Seller',
        link: '/courses/4'
    }
];

// Re-using same data for others for now to satisfy links
for (let i = 5; i <= 9; i++) {
    courses.push({
        ...courses[0],
        id: i.toString(),
        link: `/courses/${i}`
    });
}

export interface TrendingCourse {
    id: string;
    title: string;
    author: string;
    rating: number;
    imageUrl: string;
    link: string;
}

export const trendingCourses: TrendingCourse[] = [
    {
        id: 't1',
        title: 'Agency Navigator 2.0',
        author: 'Iman Gadzhi',
        rating: 4.8,
        imageUrl: '/images/course-1-image.png',
        link: '#'
    },
    {
        id: 't2',
        title: 'Copywriting Mastery',
        author: 'Cardinal Mason',
        rating: 4.9,
        imageUrl: '/images/course-1-image.png',
        link: '#'
    },
    {
        id: 't3',
        title: 'Consulting Accelerator',
        author: 'Sam Ovens',
        rating: 4.7,
        imageUrl: '/images/course-1-image.png',
        link: '#'
    }
];
