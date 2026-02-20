export interface BlogPost {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string; // e.g., "02/10/2026"
    imageUrl: string;
    link: string;
    featured?: boolean;
}

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Grow AI Agency – Reviews, Insights & Real Results',
        description: 'The Grow AI Agency category focuses on programs, courses, and strategies designed to help individuals build and scale AI-powered service agencies.',
        category: '02/10/2026', // Using date as category label based on design or vice-versa
        date: '02/10/2026',
        imageUrl: '/images/blog-1.png', // Placeholder
        link: '#',
        featured: true
    },
    {
        id: '2',
        title: 'Acquisition Offers – Client Getting & Lead Generation Reviews',
        description: 'The Acquisition Offers category covers courses, systems, and frameworks that claim to help users acquire clients, generate leads, and increase sales.',
        category: '09/17/2025',
        date: '09/17/2025',
        imageUrl: '/images/blog-2.png', // Placeholder
        link: '#'
    },
    {
        id: '3',
        title: 'High Ticket Inner Circle – Premium Program Reviews',
        description: 'The High Ticket Inner Circle category reviews premium coaching programs, masterminds, and mentorships that require a significant financial investment.',
        category: '03/14/2025',
        date: '03/14/2025',
        imageUrl: '/images/blog-3.png', // Placeholder
        link: '#'
    },
    {
        id: '4',
        title: 'Acquisition Offers – Client Getting & Lead Generation Reviews',
        description: 'The Acquisition Offers category covers courses, systems, and frameworks that claim to help users acquire clients, generate leads, and increase sales.',
        category: '09/17/2025',
        date: '09/17/2025',
        imageUrl: '/images/blog-4.png',
        link: '#'
    },
    {
        id: '5',
        title: 'High Ticket Inner Circle – Premium Program Reviews',
        description: 'The High Ticket Inner Circle category reviews premium coaching programs, masterminds, and mentorships that require a significant financial investment.',
        category: '03/14/2025',
        date: '03/14/2025',
        imageUrl: '/images/blog-5.png',
        link: '#'
    },
    {
        id: '6',
        title: 'Grow AI Agency – Reviews, Insights & Real Results',
        description: 'The AI category covers Artificial Intelligence courses, tools, and automation systems for beginners and professionals.',
        category: '02/10/2026',
        date: '02/10/2026',
        imageUrl: '/images/blog-6.png',
        link: '#'
    }
];

export const featuredPost = blogPosts[0];
export const recentPosts = blogPosts.slice(0, 3);
export const gridPosts = blogPosts.slice(1);
