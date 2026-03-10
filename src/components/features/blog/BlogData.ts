export interface BlogPost {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    imageUrl: string;
    link: string;
    author: {
        name: string;
        avatar: string;
    };
    readTime: string;
    featured?: boolean;
}

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Grow AI Agency – Reviews, Insights & Real Results',
        description: 'The Grow AI Agency category focuses on programs, courses, and strategies designed to help individuals build and scale AI-powered service agencies.',
        category: 'COURSES',
        date: 'Feb 12, 2026',
        imageUrl: '/images/blog-1.png',
        link: '#',
        author: {
            name: 'Nathalie Portmann',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathalie'
        },
        readTime: '7 min read',
        featured: true
    },
    {
        id: '2',
        title: 'Acquisition Offers – Client Getting & Lead Generation Reviews',
        description: 'The Acquisition Offers category covers courses, systems, and frameworks that claim to help users acquire clients, generate leads, and increase sales.',
        category: 'COURSES',
        date: 'Sept 17, 2025',
        imageUrl: '/images/blog-2.png',
        link: '#',
        author: {
            name: 'James Cameron',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
        },
        readTime: '12 min read'
    },
    {
        id: '3',
        title: 'High Ticket Inner Circle – Premium Program Reviews',
        description: 'The High Ticket Inner Circle category reviews premium coaching programs, masterminds, and mentorships that require a significant financial investment.',
        category: 'COURSES',
        date: 'Mar 14, 2025',
        imageUrl: '/images/blog-3.png',
        link: '#',
        author: {
            name: 'James Cameron',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
        },
        readTime: '10 min read'
    },
    {
        id: '4',
        title: 'Grow AI Agency – Reviews, Insights & Real Results',
        description: 'The AI category covers Artificial Intelligence courses, tools, and automation systems for beginners and professionals.',
        category: 'COURSES',
        date: 'July 10, 2025',
        imageUrl: '/images/blog-4.png',
        link: '#',
        author: {
            name: 'Nathalie Portmann',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathalie'
        },
        readTime: '5 min read'
    }
];

export const featuredPosts = blogPosts.slice(0, 3);
export const recentPosts = blogPosts.slice(0, 4);
