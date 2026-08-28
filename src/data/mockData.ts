import {
  Institution,
  Community,
  Event,
  Photo,
  YouTubeVideo,
  MediaItem,
  Achievement,
  Story,
  Statistic,
  Announcement,
  TrainingProgram,
  Discussion,
  Workshop,
  Resource,
  Member
} from '../models/types';
import { extractYouTubeId } from '../utils/youtube';

export const defaultInstitutionId = 'inst-brandex-01';

export const mockInstitution: Institution = {
  id: defaultInstitutionId,
  name: 'Brandex Ecosystem',
  slug: 'brandex',
  logo: '/brandex-logo.png',
  coverImage: '/brandex-full-logo.png',
  shortDescription: 'A technology, education, training and community showcase platform.',
  fullDescription: 'Brandex organizes and presents live community initiatives, educational workshops, student projects, achievements, and events into a polished digital experience.',
  location: 'Berlin, Germany / Digital Stage',
  website: 'https://brandex.org',
  email: 'hello@brandex.org',
  phone: '+49 30 901820',
  socialLinks: {
    website: 'https://brandex.org',
    github: 'https://github.com/brandex',
    twitter: 'https://twitter.com/brandex',
    linkedin: 'https://linkedin.com/company/brandex',
    youtube: 'https://youtube.com/@brandex'
  },
  institutionType: 'Technology & Education Ecosystem',
  establishedYear: 2026,
  featured: true,
  status: 'published'
};

export const mockStatistics: Statistic[] = [
  {
    id: 'stat-1',
    institutionId: defaultInstitutionId,
    label: 'Students & Learners',
    number: 1250,
    suffix: '+',
    description: 'Active participants across workshops and school programs.',
    displayOrder: 1,
    visible: true
  },
  {
    id: 'stat-2',
    institutionId: defaultInstitutionId,
    label: 'Communities & Circles',
    number: 8,
    suffix: '',
    description: 'Specialized domain communities in AI, Cyber, and UX.',
    displayOrder: 2,
    visible: true
  },
  {
    id: 'stat-3',
    institutionId: defaultInstitutionId,
    label: 'Events & Summits',
    number: 45,
    suffix: '+',
    description: 'Live hackathons, school series, and technology panels.',
    displayOrder: 3,
    visible: true
  },
  {
    id: 'stat-4',
    institutionId: defaultInstitutionId,
    label: 'Projects Built',
    number: 120,
    suffix: '+',
    description: 'Open-source software, security tools, and models.',
    displayOrder: 4,
    visible: true
  }
];

export const mockCommunities: Community[] = [
  {
    id: 'comm-1',
    institutionId: defaultInstitutionId,
    name: 'Artificial Intelligence Circle',
    slug: 'ai-circle',
    shortDescription: 'Neural networks, vector search, and practical autonomous agent systems.',
    description: 'A community circle dedicated to exploring modern AI model architectures, vector databases, multi-agent supervision, and LLM evaluation benchmarks.',
    category: 'AI & Research',
    coverImage: '/brandex-full-logo.png',
    logo: '/brandex-icon.png',
    activities: [
      'Weekly Vector DB & RAG Coding Sessions',
      'Open Weights Model Fine-Tuning Labs',
      'AI Safety & Evaluation Benchmarking'
    ],
    socialLinks: { github: 'https://github.com/brandex/ai' },
    contactEmail: 'ai@brandex.org',
    featured: true,
    displayOrder: 1,
    status: 'published',
    memberCount: 420
  },
  {
    id: 'comm-2',
    institutionId: defaultInstitutionId,
    name: 'Cybersecurity & Defense Guild',
    slug: 'cybersecurity-guild',
    shortDescription: 'Zero-trust perimeter engineering, eBPF telemetry, and defensive security.',
    description: 'Brings together security researchers and incident responders to practice threat hunting, kernel telemetry analysis, and cloud container hardening.',
    category: 'Cybersecurity',
    coverImage: '/brandex-full-logo.png',
    logo: '/brandex-icon.png',
    activities: [
      'Red vs Blue Team Capture The Flag Wargames',
      'eBPF System Call Monitoring Workshops',
      'SIEM Alert Tuning & Forensic Analysis'
    ],
    socialLinks: { github: 'https://github.com/brandex/cyber' },
    contactEmail: 'security@brandex.org',
    featured: true,
    displayOrder: 2,
    status: 'published',
    memberCount: 310
  },
  {
    id: 'comm-3',
    institutionId: defaultInstitutionId,
    name: 'Digital Skills & Systems Club',
    slug: 'systems-club',
    shortDescription: 'High-concurrency web services, distributed databases, and frontend UX.',
    description: 'Focused on high-throughput backend APIs in Go & Rust, database query optimization, and responsive user interface engineering.',
    category: 'Technology',
    coverImage: '/brandex-full-logo.png',
    logo: '/brandex-icon.png',
    activities: [
      'Concurrency & Async Server Architecture',
      'PostgreSQL Query Plan Optimization',
      'Modern Frontend Component Architecture'
    ],
    contactEmail: 'systems@brandex.org',
    featured: true,
    displayOrder: 3,
    status: 'published',
    memberCount: 520
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt-geniusphere',
    institutionId: defaultInstitutionId,
    title: 'Geniusphere School Series 2026',
    slug: 'geniusphere-school-series-2026',
    shortDescription: 'Interactive technology foundation workshop introducing secondary school students to coding logic and AI principles.',
    description: 'Hosted at Vignan Public High School. Students learn algorithmic thinking, simple web application construction, and AI model basics in guided team sessions.',
    coverImage: '/brandex-full-logo.png',
    date: '18 August 2026',
    time: '09:30 AM - 03:30 PM',
    venue: 'Vignan Public High School Auditorium',
    location: 'Main Campus',
    type: 'In-Person',
    category: 'Education & Schools',
    speakers: [
      { name: 'Dr. Aris Thorne', role: 'AI Lead', organization: 'Brandex Research' },
      { name: 'Sophia Lindqvist', role: 'Education Lead', organization: 'Brandex Academy' }
    ],
    registrationUrl: 'https://brandex.org/join',
    gallery: ['/brandex-logo.png', '/brandex-full-logo.png'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    featured: true,
    displayOrder: 1,
    status: 'published',
    isPast: false
  },
  {
    id: 'evt-summit',
    institutionId: defaultInstitutionId,
    title: 'Brandex Autumn Technology Summit 2026',
    slug: 'brandex-autumn-technology-summit-2026',
    shortDescription: 'Our flagship gathering bringing together engineers, researchers, students, and founders for live keynotes and workshops.',
    description: 'A 2-day technical conference featuring live architecture teardowns, security demos, and project showcases.',
    coverImage: '/brandex-full-logo.png',
    date: '14 October 2026',
    time: '09:00 AM - 06:00 PM',
    venue: 'Brandex Auditorium',
    location: 'Berlin Main Campus',
    type: 'In-Person',
    category: 'Technology',
    speakers: [
      { name: 'Dr. Aris Thorne', role: 'AI Lead', organization: 'Brandex' },
      { name: 'Elena Rostova', role: 'Security Architect', organization: 'CyberDef' }
    ],
    registrationUrl: 'https://brandex.org/join',
    gallery: ['/brandex-full-logo.png'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    featured: true,
    displayOrder: 2,
    status: 'published',
    isPast: false
  },
  {
    id: 'evt-wargame',
    institutionId: defaultInstitutionId,
    title: 'Brandex Cyber Defence CTF Wargame (Past Session)',
    slug: 'past-cyber-defence-wargame',
    shortDescription: 'Live red vs blue team incident handling competition testing real-time perimeter defence.',
    description: 'Participants defended simulated infrastructure against active exploitation vectors. Included telemetry debriefing.',
    coverImage: '/brandex-full-logo.png',
    date: '12 July 2026',
    time: '10:00 AM - 05:00 PM',
    venue: 'Cyber Lab 4',
    location: 'Berlin Campus',
    type: 'In-Person',
    category: 'Cybersecurity',
    speakers: [
      { name: 'Elena Rostova', role: 'Security Lead', organization: 'CyberDef' }
    ],
    gallery: ['/brandex-logo.png'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    featured: false,
    displayOrder: 3,
    status: 'published',
    isPast: true
  }
];

export const mockPhotos: Photo[] = [
  {
    id: 'pho-1',
    institutionId: defaultInstitutionId,
    image: '/brandex-full-logo.png',
    caption: 'Students collaborating during the Geniusphere School Series coding workshop.',
    altText: 'Geniusphere School Workshop',
    eventId: 'evt-geniusphere',
    category: 'Education',
    date: '18 August 2026',
    featured: true,
    displayOrder: 1,
    status: 'published'
  },
  {
    id: 'pho-2',
    institutionId: defaultInstitutionId,
    image: '/brandex-logo.png',
    caption: 'Blue team defense station analysis during the Cyber Defence CTF.',
    altText: 'Cyber CTF Wargame',
    eventId: 'evt-wargame',
    communityId: 'comm-2',
    category: 'Cybersecurity',
    date: '12 July 2026',
    featured: true,
    displayOrder: 2,
    status: 'published'
  },
  {
    id: 'pho-3',
    institutionId: defaultInstitutionId,
    image: '/brandex-icon.png',
    caption: 'AI Autonomous Agent architecture demonstration.',
    altText: 'AI Demo Session',
    communityId: 'comm-1',
    category: 'Artificial Intelligence',
    date: '02 June 2026',
    featured: false,
    displayOrder: 3,
    status: 'published'
  }
];

export const mockVideos: YouTubeVideo[] = [
  {
    id: 'vid-1',
    institutionId: defaultInstitutionId,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Building Autonomous AI Agents: Keynote & Technical Teardown',
    description: 'Dr. Aris Thorne walks through line-by-line implementations of multi-agent control loops.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    category: 'Artificial Intelligence',
    eventId: 'evt-summit',
    communityId: 'comm-1',
    publishedDate: '28 July 2026',
    featured: true,
    displayOrder: 1,
    status: 'published'
  },
  {
    id: 'vid-2',
    institutionId: defaultInstitutionId,
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Zero-Trust Network Perimeter & Telemetry Hardening',
    description: 'Elena Rostova demonstrates threat hunting using open-source eBPF probe dashboards.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    category: 'Cybersecurity',
    eventId: 'evt-wargame',
    communityId: 'comm-2',
    publishedDate: '14 July 2026',
    featured: true,
    displayOrder: 2,
    status: 'published'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    institutionId: defaultInstitutionId,
    title: 'State Digital Education Excellence Award 2026',
    description: 'Recognized for impact in school tech education through the Geniusphere Series.',
    date: 'August 2026',
    category: 'Educational Excellence',
    image: '/brandex-logo.png',
    recipientName: 'Brandex Education Team',
    externalUrl: 'https://brandex.org',
    featured: true,
    displayOrder: 1,
    status: 'published'
  },
  {
    id: 'ach-2',
    institutionId: defaultInstitutionId,
    title: 'National Cyber Security Hackathon First Place',
    description: 'Brandex Cyber Guild team awarded 1st place in infrastructure defence.',
    date: 'July 2026',
    category: 'Competition Win',
    image: '/brandex-icon.png',
    recipientName: 'Brandex Cyber Defence Team',
    featured: true,
    displayOrder: 2,
    status: 'published'
  }
];

export const mockStories: Story[] = [
  {
    id: 'sto-1',
    institutionId: defaultInstitutionId,
    title: 'How Secondary School Students Built Their First Web App in 6 Hours',
    slug: 'how-students-built-first-web-app',
    excerpt: 'Highlights from the Geniusphere School Series at Vignan Public High School.',
    content: 'Over 180 students participated in a 1-day immersive technology workshop. With guidance from Brandex mentors, teams designed, coded, and deployed functional interactive web applications by afternoon.',
    coverImage: '/brandex-full-logo.png',
    author: 'Brandex Education Team',
    date: '19 August 2026',
    category: 'School Impact Story',
    featured: true,
    displayOrder: 1,
    status: 'published'
  },
  {
    id: 'sto-2',
    institutionId: defaultInstitutionId,
    title: 'Inside the 24-Hour Autonomous AI Agent Buildathon',
    slug: 'inside-ai-agent-buildathon',
    excerpt: 'A look behind the scenes at how student developers engineered multi-agent vector search workflows.',
    content: 'Participants engineered production-grade vector search and tool calling pipelines using open models. The winning team built an automated security vulnerability scanner.',
    coverImage: '/brandex-full-logo.png',
    author: 'AI Research Circle',
    date: '05 July 2026',
    category: 'Community Story',
    featured: true,
    displayOrder: 2,
    status: 'published'
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    institutionId: defaultInstitutionId,
    title: 'Geniusphere School Series 2026 Registrations Open',
    slug: 'geniusphere-school-series-2026-open',
    summary: 'High schools can now apply for hosted technology workshops and student coding initiatives.',
    content: 'Brandex is opening cohort applications for schools seeking hands-on technology education workshops.',
    publishedDate: '15 August 2026',
    category: 'Announcement',
    important: true,
    featured: true,
    status: 'published'
  }
];

export const mockTrainingPrograms: TrainingProgram[] = [
  {
    id: 'tp-1',
    institutionId: defaultInstitutionId,
    title: 'AI Foundations & Autonomous Agentic Systems',
    slug: 'ai-foundations-agentic-systems',
    shortDescription: 'Master modern artificial intelligence, LLM orchestration, and practical agentic workflows.',
    description: 'A deep-dive technical workshop covering prompt engineering, vector databases, and multi-agent coordination frameworks.',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    duration: '6 Weeks (Saturdays)',
    instructor: 'Dr. Aris Thorne',
    date: 'September 2026',
    venue: 'Brandex Lab & Online Stage',
    registrationUrl: 'https://brandex.org/join',
    status: 'published',
    featured: true,
    outcomes: [
      'Architect production-grade vector search and RAG systems.',
      'Deploy autonomous agents capable of dynamic tool calling.'
    ],
    modules: [
      {
        id: 'm1',
        order: 1,
        title: 'Module 01: Core Neural Architecture & Embeddings',
        description: 'Mathematical foundations of transformers and vector spaces.',
        topics: ['Transformers', 'Vector Search']
      }
    ]
  },
  {
    id: 'tp-2',
    institutionId: defaultInstitutionId,
    title: 'Cybersecurity Defensive Architecture & Hardening',
    slug: 'cybersecurity-defensive-architecture',
    shortDescription: 'Build resilient network perimeters, zero-trust infrastructure, and incident response pipelines.',
    description: 'Learn modern security practices from active incident responders. Covers threat hunting, SIEM setup, and eBPF telemetry.',
    category: 'Cybersecurity',
    level: 'Advanced',
    duration: '8 Weeks (Bi-weekly)',
    instructor: 'Elena Rostova',
    date: 'October 2026',
    venue: 'Brandex Cyber Lab',
    registrationUrl: 'https://brandex.org/join',
    status: 'published',
    featured: true,
    outcomes: ['Design Zero-Trust network topologies'],
    modules: []
  }
];

export const mockDiscussions: Discussion[] = [
  {
    id: 'disc-1',
    title: 'Best practices for evaluating RAG context relevance with open-weight models?',
    category: 'Artificial Intelligence',
    authorName: 'David K.',
    authorRole: 'AI Engineer',
    authorAvatar: '/brandex-icon.png',
    repliesCount: 18,
    lastActive: '2 hours ago',
    pinned: true,
  }
];

export const mockWorkshops: Workshop[] = [
  {
    id: 'ws-1',
    title: 'Vector Databases in Practice: Qdrant & Embeddings Pipeline',
    slug: 'vector-databases-qdrant',
    category: 'Artificial Intelligence',
    description: 'Hands-on 3-hour session setting up vector indexing.',
    date: '08 September 2026',
    duration: '3 Hours',
    instructor: 'Dr. Aris Thorne',
    level: 'Intermediate',
    seatsRemaining: 14,
  }
];

export const mockResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Brandex Agentic AI Architecture Blueprint 2026',
    slug: 'agentic-ai-architecture-blueprint',
    category: 'Artificial Intelligence',
    description: 'Comprehensive 32-page guide detailing multi-agent state machines.',
    type: 'PDF',
    fileSize: '4.2 MB',
    publishedAt: '2026-08-01',
  }
];

export const mockMembers: Member[] = [
  {
    id: 'mem-1',
    name: 'Dr. Aris Thorne',
    email: 'aris@brandex.org',
    role: 'Mentor',
    joinedAt: '2025-01-10',
    avatarUrl: '/brandex-icon.png',
    domains: ['Artificial Intelligence'],
    bio: 'Lead AI Researcher.',
  }
];
