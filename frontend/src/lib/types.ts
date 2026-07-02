export interface Profile {
  _id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  cvFile: string;
  heroTagline: string;
  heroSubtitle: string;
  stats: {
    clients: number;
    experience: number;
    companies: number;
    successRate: number;
  };
  previousCompanies: {
    _id?: string;
    name: string;
    logo: string;
    role: string;
    period: string;
  }[];
  testimonials: {
    _id?: string;
    name: string;
    role: string;
    avatar: string;
    text: string;
    rating: number;
  }[];
  socialLinks: {
    linkedin: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
    facebook: string;
  };
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'full_time' | 'part_time' | 'remote' | 'freelance' | 'internship';
  description: string;
  requirements: string[];
  salary: string;
  applyLink: string;
  image: string;
  isActive: boolean;
  deadline?: string;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
  readTime: number;
  createdAt: string;
}

export interface Tool {
  _id: string;
  name: string;
  description: string;
  category: string;
  link: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface Booking {
  _id: string;
  name: string;
  whatsapp: string;
  jobStatus: string;
  message: string;
  date: string;
  time: string;
  platform: 'google_meet' | 'zoom';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface WorkingHour {
  _id?: string;
  dayOfWeek: number;
  isActive: boolean;
  slots: { start: string; end: string }[];
}
