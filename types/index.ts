export interface ProjectImage {
  id: string; url: string; filename: string; caption: string; alt: string; order: number; size: number; mimetype: string;
}
export interface Project {
  id: string; name: string; stack: string; desc: string; longDesc: string; icon: string;
  liveUrl: string; githubUrl: string; images: ProjectImage[]; category: string;
  year: string; role: string; highlights: string[]; featured: boolean;
}
export interface Experience { id: string; title: string; company: string; period: string; desc: string; current: boolean; }
export interface Education { id: string; degree: string; school: string; year: string; desc: string; }
export interface Testimonial { id: string; text: string; name: string; role: string; initials: string; color: string; }
export interface SocialLinks { linkedin: string; github: string; twitter: string; website: string; dribbble: string; youtube: string; }
export interface SectionVisibility { hero: boolean; about: boolean; skills: boolean; projects: boolean; experience: boolean; education: boolean; services: boolean; testimonials: boolean; achievements: boolean; contact: boolean; }
export interface ThemeSettings {
  style: 'dark-luxury' | 'light-minimal' | 'bold-creative' | 'tech-clean' | 'warm-editorial';
  accent: 'gold' | 'purple' | 'teal' | 'rose' | 'sky' | 'orange' | 'green';
  font: 'playfair' | 'space' | 'syne' | 'dm';
  layout: 'centered' | 'left-aligned' | 'magazine' | 'asymmetric';
  tone: 'professional' | 'friendly' | 'creative' | 'technical';
  animation: 'subtle' | 'none' | 'expressive';
}
export interface PortfolioData {
  name: string; role: string; headline: string; about: string; email: string; location: string; phone: string;
  social: SocialLinks; skills: string[]; tools: string[]; services: string[];
  projects: Project[]; experience: Experience[]; education: Education[];
  testimonials: Testimonial[]; achievements: string[]; certifications: string[];
  theme: ThemeSettings; sections: SectionVisibility;
  profilePhoto: string; showProfilePhoto: boolean;
  seoTitle: string; seoDesc: string; seoImage: string; analytics: string;
  lastSaved: string; version: string;
}
export type BuilderSection = 'profile'|'skills'|'services'|'projects'|'experience'|'education'|'testimonials'|'achievements'|'photos'|'ai'|'design'|'sections';
export type PreviewMode = 'desktop'|'tablet'|'mobile';
export type AppPage = 'landing'|'dashboard'|'templates'|'builder'|'aimode'|'preview'|'export';
