import { AITool } from '../components/AIToolCard';

// Professional AI tools organized by category and subcategory
export const professionalTools: AITool[] = [
  // Business Tools
  {
    id: 'biz-1',
    name: 'Salesforce Einstein',
    description: 'AI-powered CRM that helps sales teams predict customer needs and close deals faster.',
    category: 'AI for Business',
    icon: '',
    url: 'https://www.salesforce.com/products/einstein/overview/',
    rating: 4.7,
    pricing: 'Paid (Contact for pricing)',
    tags: ['Sales', 'CRM', 'Business Intelligence']
  },
  {
    id: 'biz-2',
    name: 'HubSpot Marketing Hub',
    description: 'AI marketing platform that helps businesses attract visitors and convert leads.',
    category: 'AI for Business',
    icon: '',
    url: 'https://www.hubspot.com/products/marketing',
    rating: 4.6,
    pricing: 'Freemium (Starting at $45/month)',
    tags: ['Marketing', 'Lead Generation', 'Analytics']
  },
  {
    id: 'biz-3',
    name: 'Crayon',
    description: 'Competitive intelligence platform that tracks competitors and market changes using AI.',
    category: 'AI for Business',
    icon: '',
    url: 'https://www.crayon.co/',
    rating: 4.5,
    pricing: 'Paid (Contact for pricing)',
    tags: ['Market Research', 'Competitive Analysis']
  },
  {
    id: 'biz-4',
    name: 'Looka',
    description: 'AI-powered logo and brand identity designer for businesses.',
    category: 'AI for Business',
    icon: '',
    url: 'https://looka.com/',
    rating: 4.4,
    pricing: 'Paid (Starting at $20)',
    tags: ['Logo Design', 'Brand Identity']
  },
  
  // Content Creation Tools
  {
    id: 'content-1',
    name: 'Surfer SEO',
    description: 'AI content optimization tool that helps writers create SEO-friendly content.',
    category: 'AI for Content Creation',
    icon: '',
    url: 'https://surferseo.com/',
    rating: 4.8,
    pricing: 'Paid (Starting at $59/month)',
    tags: ['Writing', 'SEO', 'Content Optimization']
  },
  {
    id: 'content-2',
    name: 'Descript',
    description: 'All-in-one audio/video editor with AI transcription and editing features.',
    category: 'AI for Content Creation',
    icon: '',
    url: 'https://www.descript.com/',
    rating: 4.7,
    pricing: 'Freemium (Pro at $12/month)',
    tags: ['Video Editing', 'Audio Editing', 'Transcription']
  },
  {
    id: 'content-3',
    name: 'Canva Pro',
    description: 'Design platform with AI-powered features for professional content creation.',
    category: 'AI for Content Creation',
    icon: '',
    url: 'https://www.canva.com/pro/',
    rating: 4.9,
    pricing: 'Paid ($12.99/month)',
    tags: ['Image Generation', 'Design', 'Graphics']
  },
  {
    id: 'content-4',
    name: 'RiteKit',
    description: 'AI-powered social media optimization tools for blogging and content marketing.',
    category: 'AI for Content Creation',
    icon: '',
    url: 'https://ritekit.com/',
    rating: 4.5,
    pricing: 'Paid (Starting at $15/month)',
    tags: ['Blogging', 'Social Media', 'Content Marketing']
  },
  
  // Development Tools
  {
    id: 'dev-1',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps write better code faster.',
    category: 'AI for Development',
    icon: '',
    url: 'https://github.com/features/copilot',
    rating: 4.9,
    pricing: 'Paid ($10/month)',
    tags: ['Code Generation', 'Programming', 'Developer Tools']
  },
  {
    id: 'dev-2',
    name: 'DeepSource',
    description: 'AI-powered code review tool that automatically finds and fixes bugs.',
    category: 'AI for Development',
    icon: '',
    url: 'https://deepsource.io/',
    rating: 4.6,
    pricing: 'Freemium (Team plans at $12/user/month)',
    tags: ['Debugging', 'Code Quality', 'Static Analysis']
  },
  {
    id: 'dev-3',
    name: 'Postman with API Builder',
    description: 'API development platform with AI capabilities for API creation and testing.',
    category: 'AI for Development',
    icon: '',
    url: 'https://www.postman.com/',
    rating: 4.7,
    pricing: 'Freemium (Team plans at $12/user/month)',
    tags: ['API Integration', 'Testing', 'Development']
  },
  {
    id: 'dev-4',
    name: 'Zapier',
    description: 'Workflow automation platform for connecting apps and automating workflows.',
    category: 'AI for Development',
    icon: '',
    url: 'https://zapier.com/',
    rating: 4.8,
    pricing: 'Freemium (Starting at $19.99/month)',
    tags: ['Automation', 'Integration', 'Workflow']
  },
  
  // Student Tools
  {
    id: 'student-1',
    name: 'Socratic by Google',
    description: 'AI learning assistant that helps students with homework and studying.',
    category: 'AI for Students',
    icon: '',
    url: 'https://socratic.org/',
    rating: 4.7,
    pricing: 'Free',
    tags: ['Study Assistants', 'Homework', 'Learning']
  },
  {
    id: 'student-2',
    name: 'Grammarly',
    description: 'AI writing assistant for error-free, well-structured essays and papers.',
    category: 'AI for Students',
    icon: '',
    url: 'https://www.grammarly.com/edu',
    rating: 4.8,
    pricing: 'Freemium (Premium at $12/month)',
    tags: ['Writing & Essay Tools', 'Grammar', 'Editing']
  },
  {
    id: 'student-3',
    name: 'Zotero with ZotFile',
    description: 'AI-enhanced research tool for collecting, organizing, and citing research.',
    category: 'AI for Students',
    icon: '',
    url: 'https://www.zotero.org/',
    rating: 4.6,
    pricing: 'Free (Storage plans available)',
    tags: ['Research & Citation Tools', 'Academic', 'Bibliography']
  },
  {
    id: 'student-4',
    name: 'Khan Academy',
    description: 'Personalized learning platform with AI-driven recommendations.',
    category: 'AI for Students',
    icon: '',
    url: 'https://www.khanacademy.org/',
    rating: 4.9,
    pricing: 'Free',
    tags: ['Tutoring & Learning Platforms', 'Education', 'Courses']
  },
  
  // Creative Tools
  {
    id: 'creative-1',
    name: 'Adobe Firefly',
    description: 'AI image generation and editing tools for creative professionals.',
    category: 'AI for Creatives',
    icon: '',
    url: 'https://www.adobe.com/products/firefly.html',
    rating: 4.8,
    pricing: 'Included with Creative Cloud ($54.99/month)',
    tags: ['Graphic Design Tools', 'Image Generation', 'Creative']
  },
  {
    id: 'creative-2',
    name: 'DaVinci Resolve',
    description: 'Professional video editing software with AI-powered tools.',
    category: 'AI for Creatives',
    icon: '',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve/',
    rating: 4.8,
    pricing: 'Freemium (Studio at $295)',
    tags: ['Video & Audio Editing', 'Post-Production', 'Professional']
  },
  {
    id: 'creative-3',
    name: 'Runway',
    description: 'AI-powered creative suite for generating and editing content.',
    category: 'AI for Creatives',
    icon: '',
    url: 'https://runwayml.com/',
    rating: 4.7,
    pricing: 'Paid (Starting at $12/month)',
    tags: ['Content Generation', 'Video', 'Creative Tools']
  },
  {
    id: 'creative-4',
    name: 'AIVA',
    description: 'AI music composition platform for creating original soundtracks.',
    category: 'AI for Creatives',
    icon: '',
    url: 'https://www.aiva.ai/',
    rating: 4.6,
    pricing: 'Freemium (Pro at $19/month)',
    tags: ['Music & Sound Design', 'Composition', 'Soundtrack']
  },
  
  // Healthcare Tools
  {
    id: 'health-1',
    name: 'IBM Watson for Oncology',
    description: 'AI-powered clinical decision support tool for cancer treatment.',
    category: 'AI for Healthcare',
    icon: '',
    url: 'https://www.ibm.com/watson-health',
    rating: 4.7,
    pricing: 'Enterprise (Contact for pricing)',
    tags: ['Medical Diagnosis & Imaging', 'Oncology', 'Clinical']
  },
  {
    id: 'health-2',
    name: 'Atomwise',
    description: 'AI technology for drug discovery, helping researchers develop new medicines.',
    category: 'AI for Healthcare',
    icon: '',
    url: 'https://www.atomwise.com/',
    rating: 4.6,
    pricing: 'Enterprise (Contact for pricing)',
    tags: ['Drug Discovery & Research', 'Pharmaceutical', 'Molecular']
  },
  {
    id: 'health-3',
    name: 'Ada Health',
    description: 'AI-powered symptom assessment and care navigation platform.',
    category: 'AI for Healthcare',
    icon: '',
    url: 'https://ada.com/',
    rating: 4.8,
    pricing: 'Free for patients (Enterprise solutions available)',
    tags: ['Healthcare Assistants', 'Symptom Checker', 'Diagnostics']
  },
  {
    id: 'health-4',
    name: 'Fitbit Premium',
    description: 'AI-enhanced fitness tracking and personalized health insights.',
    category: 'AI for Healthcare',
    icon: '',
    url: 'https://www.fitbit.com/global/us/products/services/premium',
    rating: 4.5,
    pricing: 'Paid ($9.99/month)',
    tags: ['Fitness & Wellness', 'Health Tracking', 'Personalized']
  }
];

// Helper function to get tools by category
export const getToolsByProfessionalCategory = (categoryId: string, subcategoryId?: string) => {
  // Filter by main category
  let filtered = professionalTools.filter(tool => 
    tool.category.toLowerCase() === professionalCategories.find(cat => cat.id === categoryId)?.name.toLowerCase()
  );
  
  // If subcategory is provided, further filter
  if (subcategoryId) {
    const subcategory = professionalCategories
      .find(cat => cat.id === categoryId)
      ?.subcategories.find(sub => sub.id === subcategoryId);
      
    if (subcategory) {
      filtered = filtered.filter(tool => 
        tool.tags.some(tag => tag.toLowerCase().includes(subcategory.name.toLowerCase().replace('AI for ', '')))
      );
    }
  }
  
  return filtered;
};

// Import the professional categories for the helper function
import { professionalCategories } from './professionalCategories'; 