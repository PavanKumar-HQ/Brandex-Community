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
  Member,
  Opportunity,
  Enquiry
} from '../models/types';
import { extractYouTubeId } from '../utils/youtube';

export const defaultInstitutionId = 'inst-brandex-01';

export const mockInstitution: Institution = {
  id: defaultInstitutionId,
  name: 'Brandex Ecosystem',
  slug: 'brandex',
  logo: '/brandex-logo.webp',
  coverImage: '/brandex-full-logo.webp',
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
    coverImage: '/brandex-full-logo.webp',
    logo: '/brandex-icon.webp',
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
    coverImage: '/brandex-full-logo.webp',
    logo: '/brandex-icon.webp',
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
    coverImage: '/brandex-full-logo.webp',
    logo: '/brandex-icon.webp',
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
    coverImage: '/geniusphere-banner.webp',
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
    gallery: ['/brandex-logo.webp', '/brandex-full-logo.webp'],
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
    coverImage: '/brandex-full-logo.webp',
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
    gallery: ['/brandex-full-logo.webp'],
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
    coverImage: '/brandex-full-logo.webp',
    date: '12 July 2026',
    time: '10:00 AM - 05:00 PM',
    venue: 'Cyber Lab 4',
    location: 'Berlin Campus',
    type: 'In-Person',
    category: 'Cybersecurity',
    speakers: [
      { name: 'Elena Rostova', role: 'Security Lead', organization: 'CyberDef' }
    ],
    gallery: ['/brandex-logo.webp'],
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
    image: '/brandex-full-logo.webp',
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
    image: '/brandex-logo.webp',
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
    image: '/brandex-icon.webp',
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
    image: '/brandex-logo.webp',
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
    image: '/brandex-icon.webp',
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
    content: 'Over 180 students participated in a 1-day immersive technology workshop. With guidance from Brandex mentors, teams designed, coded, and deployed functional interactive web applications by afternoon.\n\nWe saw kids who had never written a single line of CSS or HTML successfully structure layouts, connect interactive Javascript click handlers, and deploy their static build files to public stages. The sheer excitement of seeing their creations live on their mobile phones was unmatched.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Sathvik.N',
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
    content: 'Participants engineered production-grade vector search and tool calling pipelines using open models. The winning team built an automated security vulnerability scanner.\n\nThe challenge was simple: build a coordinate team of agentic models that could scan GitHub repos, look for leaked credentials, cross-reference them with vulnerability databases, and draft mitigations. Working through the night, builders tested libraries, configured vector index stores, and developed complete mock-up CLI dashboards.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '05 July 2026',
    category: 'Community Story',
    featured: true,
    displayOrder: 2,
    status: 'published'
  },
  {
    id: 'sto-3',
    institutionId: defaultInstitutionId,
    title: 'Reimagining Tech Sharing: Why We Built Brandex',
    slug: 'reimagining-tech-sharing-why-we-built-brandex',
    excerpt: 'The story of how Brandex was created to avoid educational difficulties and build a collaborative knowledge network.',
    content: 'For years, traditional computer science curricula have struggled to keep pace with modern engineering practices. We noticed a severe disconnect between what students write in classrooms and what developers build in production. \n\nWe founded Brandex to bridge this gap. Our goal is to avoid academic gatekeeping and enhance real-world knowledge sharing. By providing a digital stage, we ensure builders are well-aware of modern frameworks, meet active industry professionals, network, and exchange practical knowledge. Through live meetups, wargames, and coding labs, we guarantee technology education is accessible to all.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '28 August 2026',
    category: 'Founders Story',
    featured: true,
    displayOrder: 3,
    status: 'published'
  },
  {
    id: 'sto-4',
    institutionId: defaultInstitutionId,
    title: 'Democratizing Education: Open-Sourcing the Geniusphere Curriculum',
    slug: 'democratizing-education-open-sourcing-geniusphere',
    excerpt: 'Why we open-sourced our entire secondary school lab syllabus and deployed it to geniusphere.tech.',
    content: 'Practical education shouldn\'t be locked behind expensive institution walls. The Geniusphere Series has trained hundreds of high schoolers in fundamentals of programming, logic, and simple hardware components. \n\nTo maximize public welfare, we made the entire Geniusphere curriculum completely open-source. Anyone can download the slide decks, lab sheets, and workshop code templates. To make it even easier to access, we have officially deployed the digital platform at geniusphere.tech. Teachers and self-guided students can visit the live platform to start hosting their own technology circles instantly.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Sathvik.N',
    date: '22 August 2026',
    category: 'Open Source',
    featured: true,
    displayOrder: 4,
    status: 'published'
  },
  {
    id: 'sto-5',
    institutionId: defaultInstitutionId,
    title: 'Hands-on Engineering: Moving Beyond Classroom Lectures',
    slug: 'hands-on-engineering-beyond-classroom-lectures',
    excerpt: 'Why slides and lectures fail in modern tech, and how coding wargames prepare builders for production.',
    content: 'You cannot learn to swim by reading a textbook. Similarly, you cannot learn system architecture, threat hunting, or AI orchestration by listening to slides. \n\nAt Brandex, we replace lectures with wargames. Whether it\'s a cybersecurity capture-the-flag (CTF) tournament or an AI vector search sprint, students learn by failing, reading console logs, and collaborating in team circles. This practical focus ensures builders gain actual muscle memory for terminal commands, debugging, and network protocols, making them immediately ready to contribute to real-world software operations.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '14 August 2026',
    category: 'Education Philosophy',
    featured: true,
    displayOrder: 5,
    status: 'published'
  },
  {
    id: 'sto-6',
    institutionId: defaultInstitutionId,
    title: 'Scaling Security: How Zero-Trust Architecture Changed Our Workshops',
    slug: 'scaling-security-zero-trust-workshops',
    excerpt: 'An inside look at how we deploy secure lab environments for high schoolers using zero-trust models.',
    content: 'Teaching cybersecurity requires giving students access to vulnerable machines without compromising the host network. By adopting a zero-trust network perimeter for our workshop environments, we achieved isolated sandboxes that scale dynamically. Students can now practice threat hunting and exploitation safely. This shift has not only improved the quality of our CTF events but also provided a real-world infrastructure lesson for the participants.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Sathvik.N',
    date: '10 September 2026',
    category: 'Cybersecurity',
    featured: false,
    displayOrder: 6,
    status: 'published'
  },
  {
    id: 'sto-7',
    institutionId: defaultInstitutionId,
    title: 'Building Resilient Communities in the Age of AI',
    slug: 'building-resilient-communities-ai',
    excerpt: 'Why human connection matters more than ever as artificial intelligence automates our workflows.',
    content: 'As AI tools become capable of generating complex boilerplate code and architecture diagrams, the role of a software engineer is fundamentally shifting. But one thing AI cannot replace is community. Our latest series of meetups focused on collaborative design and paired architecture reviews. We found that when builders share their failures and mentor each other in person, the learning curve is drastically shortened. Community is the ultimate moat.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '02 September 2026',
    category: 'Community Story',
    featured: false,
    displayOrder: 7,
    status: 'published'
  },
  {
    id: 'sto-8',
    institutionId: defaultInstitutionId,
    title: 'The Future of Web Interfaces: Moving Beyond Standard UI Components',
    slug: 'future-web-interfaces-beyond-standard-ui',
    excerpt: 'Exploring micro-animations, glassmorphism, and spatial layouts for next-generation platforms.',
    content: 'Web development is no longer just about building a functional grid. Today’s users expect seamless transitions, state-aware animations, and interfaces that feel alive. In our latest UI/UX guild session, we explored how abandoning standard component libraries in favor of custom, physics-based micro-animations can dramatically increase user engagement. From subtle hover glows to fluid page transitions, the web is becoming an interactive canvas.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '25 August 2026',
    category: 'Design & UX',
    featured: true,
    displayOrder: 8,
    status: 'published'
  },
  {
    id: 'sto-9',
    institutionId: defaultInstitutionId,
    title: 'Top 10 Web Development Frameworks for Students in 2026',
    slug: 'top-web-development-frameworks-students',
    excerpt: 'A comprehensive guide to React, Next.js, and modern tools for beginner developers.',
    content: 'When starting in web development, choosing the right framework is crucial. In this guide, we break down the top tools used by industry professionals and explain why we teach React and Vite at Brandex.\n\nReact remains the undisputed king of component-based UI design. Its declarative nature and massive ecosystem mean students can find a library for almost any feature they want to build. Next.js builds on React by offering server-side rendering and static site generation, making it the go-to for production-grade applications that need excellent SEO.\n\nAt Brandex, we emphasize mastering vanilla JavaScript before jumping into frameworks. However, once the fundamentals are solid, frameworks like Vite drastically speed up the development process by providing instant hot module replacement (HMR). Learning these modern stacks early prepares students for real-world internships and scalable production environments.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Pavan Kumar.S',
    date: '12 September 2026',
    category: 'Web Development',
    featured: false,
    displayOrder: 9,
    status: 'published'
  },
  {
    id: 'sto-10',
    institutionId: defaultInstitutionId,
    title: 'How to Win Your First Cybersecurity CTF (Capture The Flag)',
    slug: 'how-to-win-first-cybersecurity-ctf',
    excerpt: 'Essential strategies and tools for beginners entering the world of ethical hacking.',
    content: 'Capture The Flag (CTF) competitions are the best way to learn ethical hacking. We cover the essential tools like Wireshark, Nmap, and Burp Suite that you need to master.\n\nThe first step to winning a CTF is enumeration. You cannot attack what you do not understand. Tools like Nmap allow you to scan target networks for open ports and vulnerable services. Once you have a map of the network, you can begin inspecting traffic using Wireshark to find unencrypted credentials or hidden API endpoints.\n\nWeb exploitation is another massive category. Learning how to intercept HTTP requests using Burp Suite is critical for finding SQL injections and Cross-Site Scripting (XSS) vulnerabilities. Join our next Brandex cybersecurity workshop to practice these skills in a safe, sandboxed environment against live targets.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '15 September 2026',
    category: 'Cybersecurity',
    featured: false,
    displayOrder: 10,
    status: 'published'
  },
  {
    id: 'sto-11',
    institutionId: defaultInstitutionId,
    title: 'Understanding Large Language Models (LLMs) for High Schoolers',
    slug: 'understanding-llms-high-schoolers',
    excerpt: 'Breaking down artificial intelligence, transformers, and prompt engineering.',
    content: 'Artificial Intelligence is no longer sci-fi. In our latest Geniusphere series, we break down how Transformers and Large Language Models actually work under the hood.\n\nAt their core, LLMs are simply incredibly powerful pattern recognition engines. They don\'t "think" in the human sense; they predict the most mathematically probable next word in a sequence based on billions of parameters of training data. Understanding this architecture is crucial for learning how to effectively prompt these models and constrain their outputs to avoid hallucinations.\n\nWe teach students how to interact with APIs and build their own autonomous agents using open-source models. By connecting LLMs to external tools like calculators or web scrapers, students can create agentic workflows that solve complex, multi-step problems autonomously.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '18 September 2026',
    category: 'Artificial Intelligence',
    featured: false,
    displayOrder: 11,
    status: 'published'
  },
  {
    id: 'sto-12',
    institutionId: defaultInstitutionId,
    title: 'Why Every Tech Community Needs Open-Source Projects',
    slug: 'why-tech-community-needs-open-source',
    excerpt: 'The benefits of collaborative coding and contributing to public repositories.',
    content: 'Open-source is the backbone of modern software. At Brandex, we encourage every member to push code to public GitHub repositories.\n\nWhen you build in public, you invite peer review, which is the fastest way to improve your code quality. Open-source projects force developers to write clean documentation, maintain issue trackers, and handle pull requests from strangers. These are the exact skills required in professional engineering teams.\n\nNot only does this build a strong portfolio for college applications and recruiter interviews, but it also fosters a culture of shared knowledge. We believe that technology education should not be siloed, and open-source is the ultimate equalizer.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Sathvik.N',
    date: '20 September 2026',
    category: 'Community Story',
    featured: false,
    displayOrder: 12,
    status: 'published'
  },
  {
    id: 'sto-13',
    institutionId: defaultInstitutionId,
    title: 'A Beginner’s Guide to Cloud Deployment and Hosting',
    slug: 'beginners-guide-cloud-deployment',
    excerpt: 'Learn how to push your first web app to the internet using modern cloud providers.',
    content: 'You’ve built a web app on localhost, but how do you share it with the world? This guide covers the basics of cloud hosting, DNS, and continuous deployment pipelines using platforms like Vercel and Netlify, perfect for student hackathon projects.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '22 September 2026',
    category: 'Cloud Engineering',
    featured: false,
    displayOrder: 13,
    status: 'published'
  },
  {
    id: 'sto-14',
    institutionId: defaultInstitutionId,
    title: 'UI/UX Principles Every Developer Should Know',
    slug: 'ui-ux-principles-every-developer-should-know',
    excerpt: 'Stop building ugly apps! Master the basics of color theory, spacing, and typography.',
    content: 'Great code means nothing if the interface is unusable. We explore fundamental design principles—contrast, alignment, padding, and visual hierarchy—that instantly elevate any side project from a generic template to a polished product.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '25 September 2026',
    category: 'Design & UX',
    featured: false,
    displayOrder: 14,
    status: 'published'
  },
  {
    id: 'sto-15',
    institutionId: defaultInstitutionId,
    title: 'How to Organize a Successful Tech Hackathon at Your School',
    slug: 'organize-successful-tech-hackathon',
    excerpt: 'A step-by-step blueprint for student leaders to host coding events.',
    content: 'Hosting a hackathon requires logistics, sponsorships, and technical infrastructure. Drawing from our experience running Brandex summits, we provide a complete playbook for student leaders looking to ignite tech culture in their local schools.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Pavan Kumar.S',
    date: '28 September 2026',
    category: 'Leadership',
    featured: false,
    displayOrder: 15,
    status: 'published'
  },
  {
    id: 'sto-16',
    institutionId: defaultInstitutionId,
    title: 'Mastering Git and Version Control for Collaborative Coding',
    slug: 'mastering-git-version-control',
    excerpt: 'Stop emailing zip files. Learn how to use Git, branches, and pull requests.',
    content: 'Version control is the most critical skill missing from high school computer science classes. This tutorial walks through Git basics—commit, push, pull, and merge conflicts—so you can confidently collaborate on group projects without deleting your friend\'s code.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '01 October 2026',
    category: 'Software Engineering',
    featured: false,
    displayOrder: 16,
    status: 'published'
  },
  {
    id: 'sto-17',
    institutionId: defaultInstitutionId,
    title: 'The Rise of TypeScript: Why We Use It in All Brandex Workshops',
    slug: 'rise-of-typescript-brandex-workshops',
    excerpt: 'Understanding static typing and how it prevents runtime bugs in web apps.',
    content: 'JavaScript is flexible, but TypeScript is reliable. We explain why the industry has shifted toward strictly typed languages and how integrating TypeScript into our beginner curriculum has drastically reduced debugging time for our students.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '03 October 2026',
    category: 'Web Development',
    featured: false,
    displayOrder: 17,
    status: 'published'
  },
  {
    id: 'sto-18',
    institutionId: defaultInstitutionId,
    title: 'Building a Personal Portfolio That Stands Out to Recruiters',
    slug: 'building-personal-portfolio-recruiters',
    excerpt: 'Actionable tips on showcasing your technical projects and hackathon wins.',
    content: 'A static resume isn\'t enough. We showcase examples of incredible student portfolios and discuss what recruiters actually look for: live demos, clean source code, and detailed README files that explain your engineering decisions.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Sathvik.N',
    date: '05 October 2026',
    category: 'Career Advice',
    featured: false,
    displayOrder: 18,
    status: 'published'
  },
  {
    id: 'sto-19',
    institutionId: defaultInstitutionId,
    title: 'Introduction to API Integration: Connecting Your Frontend to Data',
    slug: 'intro-api-integration-frontend-data',
    excerpt: 'Learn how to fetch data from REST APIs using fetch and Axios in React.',
    content: 'Modern apps don\'t live in isolation. This guide introduces students to RESTful APIs, JSON data structures, and asynchronous JavaScript, showing them how to populate their UI with live data from external services.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '08 October 2026',
    category: 'Software Engineering',
    featured: false,
    displayOrder: 19,
    status: 'published'
  },
  {
    id: 'sto-20',
    institutionId: defaultInstitutionId,
    title: 'Demystifying Web Accessibility (a11y) for Student Developers',
    slug: 'demystifying-web-accessibility-student-developers',
    excerpt: 'Why building inclusive software matters and how to implement ARIA tags.',
    content: 'Accessibility shouldn\'t be an afterthought. We teach young developers how to use semantic HTML, ARIA labels, and keyboard navigation to ensure their hackathon projects are usable by everyone, regardless of physical ability.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '10 October 2026',
    category: 'Design & UX',
    featured: false,
    displayOrder: 20,
    status: 'published'
  },
  {
    id: 'sto-21',
    institutionId: defaultInstitutionId,
    title: 'Exploring Edge Computing and Serverless Architecture',
    slug: 'exploring-edge-computing-serverless',
    excerpt: 'A high-level overview of modern infrastructure for aspiring cloud engineers.',
    content: 'What does "serverless" actually mean? We break down the evolution of web hosting from dedicated servers to edge functions, explaining how platforms like Cloudflare and AWS Lambda allow developers to scale infinitely with zero maintenance.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Pavan Kumar.S',
    date: '12 October 2026',
    category: 'Cloud Engineering',
    featured: false,
    displayOrder: 21,
    status: 'published'
  },
  {
    id: 'sto-22',
    institutionId: defaultInstitutionId,
    title: 'The Psychology of Gamification in EdTech Platforms',
    slug: 'psychology-gamification-edtech',
    excerpt: 'How points, badges, and wargames keep students engaged in learning to code.',
    content: 'Learning complex engineering concepts is hard. We explore the psychological principles behind gamification and why our CTF-style wargames create highly motivated feedback loops that keep students coming back for more.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '15 October 2026',
    category: 'Education Philosophy',
    featured: false,
    displayOrder: 22,
    status: 'published'
  },
  {
    id: 'sto-23',
    institutionId: defaultInstitutionId,
    title: 'Python vs JavaScript: Which Language Should You Learn First?',
    slug: 'python-vs-javascript-learn-first',
    excerpt: 'A pragmatic comparison of the two most popular programming languages for beginners.',
    content: 'The eternal debate: Python or JS? We analyze the use-cases for both, from data science and machine learning to interactive web apps, helping new members decide which path aligns best with their career goals.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '18 October 2026',
    category: 'Software Engineering',
    featured: false,
    displayOrder: 23,
    status: 'published'
  },
  {
    id: 'sto-24',
    institutionId: defaultInstitutionId,
    title: 'Creating a Local Development Environment: A Setup Guide',
    slug: 'local-development-environment-setup',
    excerpt: 'How to install VS Code, Node.js, and essential extensions for max productivity.',
    content: 'Before you can build, you need a workbench. This step-by-step tutorial walks beginners through setting up their local machine, configuring terminal environments, and installing the VS Code extensions that professional developers rely on.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Sathvik.N',
    date: '20 October 2026',
    category: 'Web Development',
    featured: false,
    displayOrder: 24,
    status: 'published'
  },
  {
    id: 'sto-25',
    institutionId: defaultInstitutionId,
    title: 'Data Privacy and Ethics in Software Engineering',
    slug: 'data-privacy-ethics-software-engineering',
    excerpt: 'Why the next generation of coders must prioritize user data protection.',
    content: 'With great power comes great responsibility. We discuss the ethical implications of data collection, the basics of GDPR compliance, and why student developers need to adopt a privacy-first mindset when designing databases.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Pavan Kumar.S',
    date: '22 October 2026',
    category: 'Cybersecurity',
    featured: false,
    displayOrder: 25,
    status: 'published'
  },
  {
    id: 'sto-26',
    institutionId: defaultInstitutionId,
    title: 'The Art of Writing Clean, Maintainable Code',
    slug: 'art-of-writing-clean-maintainable-code',
    excerpt: 'Moving beyond "it works" to code that your team can actually understand.',
    content: 'Writing code for a machine is easy; writing code for other humans is hard. We introduce the principles of clean code, self-documenting variables, and the importance of modular architecture in collaborative engineering environments.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '25 October 2026',
    category: 'Software Engineering',
    featured: false,
    displayOrder: 26,
    status: 'published'
  },
  {
    id: 'sto-27',
    institutionId: defaultInstitutionId,
    title: 'How to Leverage AI Coding Assistants (Without Losing Your Skills)',
    slug: 'leverage-ai-coding-assistants-safely',
    excerpt: 'Using tools like Copilot and ChatGPT effectively in your learning journey.',
    content: 'AI assistants are incredibly powerful, but relying on them too early can stunt your learning. We share our philosophy on using LLMs as pair-programming mentors rather than crutches, ensuring foundational logic skills remain sharp.',
    coverImage: '/geniusphere-banner.webp',
    author: 'Pavan Kumar.S',
    date: '28 October 2026',
    category: 'Artificial Intelligence',
    featured: false,
    displayOrder: 27,
    status: 'published'
  },
  {
    id: 'sto-28',
    institutionId: defaultInstitutionId,
    title: 'Networking in Tech: Why Your Local Community Matters',
    slug: 'networking-in-tech-local-community',
    excerpt: 'The hidden value of attending meetups, conferences, and student circles.',
    content: 'Your network is your net worth. Beyond the code, we highlight the career-changing benefits of attending local Brandex events, shaking hands with industry professionals, and finding mentors who can guide your technical journey.',
    coverImage: '/geniusphere-collab-ghibli.webp',
    author: 'Sathvik.N',
    date: '30 October 2026',
    category: 'Community Story',
    featured: false,
    displayOrder: 28,
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
    authorAvatar: '/brandex-icon.webp',
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
    avatarUrl: '/brandex-icon.webp',
    domains: ['Artificial Intelligence'],
    bio: 'Lead AI Researcher.',
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Geniusphere AI Agent Circle — Cohort 04 Lead',
    type: 'circle_seat',
    category: 'Artificial Intelligence',
    description: 'Open seats for student researchers to co-lead weekly autonomous multi-agent sprint sessions and mentor secondary school teams.',
    deadline: '15 September 2026',
    seatsTotal: 12,
    seatsFilled: 8,
    requirements: ['Python / TypeScript basics', 'Interest in LLM workflows', '2 hrs / week commitment'],
    actionText: 'Apply for Seat',
    actionUrl: '/community',
    status: 'published'
  },
  {
    id: 'opp-2',
    title: 'Brandex Bangalore Campus Ambassador 2026',
    type: 'ambassador_slot',
    category: 'Leadership & Outreach',
    description: 'Represent Brandex at your university or secondary school. Organize local coding labs and receive official sponsorships.',
    deadline: '30 September 2026',
    seatsTotal: 25,
    seatsFilled: 19,
    requirements: ['Active student enrollment', 'Passion for tech education', 'Leadership drive'],
    actionText: 'Join Ambassador Guild',
    actionUrl: '/ambassador',
    status: 'published'
  },
  {
    id: 'opp-3',
    title: 'Red-Team Wargame Defense Volunteer Lead',
    type: 'volunteer',
    category: 'Cybersecurity',
    description: 'Help coordinate simulated vulnerability scenarios, telemetry dashboards, and participant debriefs for the upcoming summit.',
    deadline: '10 October 2026',
    seatsTotal: 6,
    seatsFilled: 4,
    requirements: ['Linux & networking basics', 'CTF / Security enthusiasm'],
    actionText: 'Volunteer with Team',
    actionUrl: '/contact',
    status: 'published'
  },
  {
    id: 'opp-4',
    title: 'UX Systems & Accessibility Research Fellow',
    type: 'circle_seat',
    category: 'Design & Systems',
    description: 'Participate in real-world user research sprints, crafting accessible design systems for open educational platforms.',
    deadline: '20 October 2026',
    seatsTotal: 8,
    seatsFilled: 3,
    requirements: ['Figma familiarity', 'Interest in inclusive web design'],
    actionText: 'Claim Research Slot',
    actionUrl: '/community',
    status: 'published'
  }
];

export const mockEnquiries: Enquiry[] = [
  {
    id: 'enq-101',
    type: 'school',
    orgName: 'Vignan Academy of Sciences',
    contactName: 'Prof. Ramesh Rao',
    email: 'ramesh.rao@vignan.edu.in',
    phone: '+91 98450 11223',
    message: 'We would like to introduce the Geniusphere coding syllabus and host a 2-day AI workshop for our Grade 11-12 students.',
    status: 'reviewed',
    adminNotes: 'Contacted dean on phone; sent syllabus curriculum PDF. Follow up next Monday.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'enq-102',
    type: 'corporate',
    orgName: 'Nexus Cloud Systems Pvt Ltd',
    contactName: 'Ananya Deshmukh',
    email: 'ananya.d@nexuscloud.io',
    phone: '+91 99887 66554',
    message: 'Looking for a custom security wargame training track for our 30-member junior backend engineering team.',
    status: 'new',
    adminNotes: '',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'enq-103',
    type: 'sponsorship',
    orgName: 'Bangalore Dev Labs',
    contactName: 'Karthik Sundaram',
    email: 'karthik@bangaloredevlabs.com',
    phone: '+91 91234 56789',
    message: 'Interested in sponsoring prize tracks and providing server infrastructure for the Autumn 2026 Summit.',
    status: 'contacted',
    adminNotes: 'Intro call complete; tier 2 sponsorship agreement sent for review.',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString()
  }
];

