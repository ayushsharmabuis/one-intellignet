// Define types for professional categories
export interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

export interface ProfessionalCategory {
  id: string;
  name: string;
  description?: string;
  subcategories: SubCategory[];
}

// Define professional categories and subcategories
export const professionalCategories: ProfessionalCategory[] = [
  {
    id: 'business',
    name: 'AI for Business',
    description: 'AI tools designed for business operations and management',
    subcategories: [
      { id: 'sales', name: 'AI for Sales' },
      { id: 'marketing', name: 'AI for Marketing' },
      { id: 'logo-design', name: 'AI for Logo Design' },
      { id: 'market-research', name: 'AI for Market Research' }
    ]
  },
  {
    id: 'content',
    name: 'AI for Content Creation',
    description: 'Tools for producing and editing various types of content',
    subcategories: [
      { id: 'writing', name: 'AI for Writing' },
      { id: 'video-editing', name: 'AI for Video Editing' },
      { id: 'image-generation', name: 'AI for Image Generation' },
      { id: 'blogging', name: 'AI for Blogging' }
    ]
  },
  {
    id: 'development',
    name: 'AI for Development',
    description: 'Tools for software development and programming tasks',
    subcategories: [
      { id: 'code-generation', name: 'AI for Code Generation' },
      { id: 'debugging', name: 'AI for Debugging' },
      { id: 'api-integration', name: 'AI for API Integration' },
      { id: 'automation', name: 'AI for Automation' }
    ]
  },
  // New categories
  {
    id: 'students',
    name: 'AI for Students',
    description: 'Tools to assist students with learning and academic tasks',
    subcategories: [
      { id: 'study-assistants', name: 'AI Study Assistants' },
      { id: 'writing-essays', name: 'AI Writing & Essay Tools' },
      { id: 'research-citation', name: 'AI Research & Citation Tools' },
      { id: 'tutoring-learning', name: 'AI Tutoring & Learning Platforms' }
    ]
  },
  {
    id: 'creatives',
    name: 'AI for Creatives',
    description: 'Tools for creative professionals across various media',
    subcategories: [
      { id: 'graphic-design', name: 'AI Graphic Design Tools' },
      { id: 'video-audio-editing', name: 'AI Video & Audio Editing' },
      { id: 'content-generation', name: 'AI Content Generation' },
      { id: 'music-sound', name: 'AI Music & Sound Design' }
    ]
  },
  {
    id: 'healthcare',
    name: 'AI for Healthcare',
    description: 'AI solutions for healthcare professionals and medical applications',
    subcategories: [
      { id: 'medical-diagnosis', name: 'AI Medical Diagnosis & Imaging' },
      { id: 'drug-discovery', name: 'AI Drug Discovery & Research' },
      { id: 'healthcare-assistants', name: 'AI Healthcare Assistants' },
      { id: 'fitness-wellness', name: 'AI Fitness & Wellness' }
    ]
  }
]; 