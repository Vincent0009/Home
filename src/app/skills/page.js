'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Lazy load components to reduce initial bundle size
const SkillsGrid = dynamic(() => import('../components/SkillsGrid'), {
  loading: () => <SkillsGridSkeleton />,
  ssr: false // Since this component has client-side interactions
});

const SkillModal = dynamic(() => import('../components/SkillModal'), {
  loading: () => null,
  ssr: false
});

// Optimized design system with CSS custom properties for better performance
const DESIGN_VARS = {
  '--primary-gradient': 'linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229))',
  '--secondary-gradient': 'linear-gradient(to right, rgb(31, 41, 55), rgb(29, 78, 216))',
  '--primary-color': 'rgb(37, 99, 235)',
  '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '--transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Skeleton component for better loading experience
const SkillsGridSkeleton = () => (
  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-blue-100/50 animate-pulse"
      >
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-sky-200 rounded-lg"></div>
          <div className="min-w-0 flex-1">
            <div className="h-5 sm:h-6 bg-gradient-to-r from-blue-100 to-sky-200 rounded mb-2"></div>
            <div className="h-3 sm:h-4 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-3/4"></div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-100 to-blue-100 rounded"></div>
          <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-100 to-blue-100 rounded w-4/5"></div>
        </div>
      </div>
    ))}
  </div>
);

// Optimized skill categories - moved outside component to prevent recreation
const SKILL_CATEGORIES = {
  simulation: {
    title: 'Computational Modeling & Simulation',
    icon: '🔬',
    skills: [
      {
        name: 'COMSOL Multiphysics',
        skillLevel: 'Advanced',
        description: 'Specialized in phononic metamaterials modeling with focus on unit cell design optimization, dispersion curve calculations through eigenfrequency analysis, and frequency domain analysis for amplitude response characterization.',
        experience: '3+ years',
        projects: ['Phononic Metamaterials Design', 'Unit Cell Optimization', 'Dispersion Curve Analysis', 'Frequency Domain Analysis'],
        photos: [
          {
            url: '/images/comsol-simulation-1.gif',
            caption: 'Dynamic Analysis: moving load on steel structure',
            alt: 'COMSOL moving load analysis'
          },
          {
            url: '/images/DispersionCurve.png',
            caption: 'Calculate Disperion Curve of Unit Cell',
            alt: 'COMSOL Phononic Metamaterials'
          }
        ]
      },
      {
        name: 'COMSOL Java API',
        skillLevel: 'Advanced',
        description: 'Full workflow automation including random model generation, physics setup, boundary condition configuration, visual result extraction, and dispersion curve analysis. Complete end-to-end automation from model building to result processing through Java programming.',
        experience: '2+ years',
        projects: ['Automated Model Generation', 'Full Workflow Automation', 'Result Extraction & Analysis', 'Custom COMSOL Applications'],
        photos: [
          {
            url: '/images/JavaAPISnippet.png',
            caption: 'Code Snippet of COMSOL Java API building defining boundary conditions',
            alt: 'COMSOL Java API code Snippet'
          }
        ]
      },
      {
        name: 'Python',
        skillLevel: 'Advanced',
        description: 'Scientific computing for post-processing and signal analysis using SciPy modules. Specialized in bandgap detection, FFT for time-to-frequency domain conversion, and digital signal processing including Butterworth filtering.',
        experience: '4+ years',
        projects: ['Bandgap Detection', 'FFT Signal Processing', 'Digital Filtering', 'Post-processing Pipelines'],
        photos: [
          {
            url: '/images/Butterworth.png',
            caption: 'Applying Butterworth Filter to Remove Noise',
            alt: 'Butterworth Filter Example'
          }
        ]
      }
    ]
  },
  AI: {
    title: 'AI & Machine Learning',
    icon: '🤖',
    skills: [
      {
        name: 'PyTorch',
        skillLevel: 'Advanced',
        description: 'Deep learning framework expertise including DNNs, CNNs, Autoencoders, and Mixture Density Networks (MDN) for complex modeling tasks.',
        experience: '3+ years',
        projects: ['Neural Network Architectures', 'Autoencoder Models', 'MDN Implementation']
      },
      {
        name: 'Scikit-learn',
        skillLevel: 'Advanced',
        description: 'Classical machine learning algorithms, feature engineering, model evaluation, and pipeline development.',
        experience: '3+ years',
        projects: ['Classification Models', 'Regression Analysis', 'Feature Selection']
      },
      {
        name: 'Data Science Stack',
        skillLevel: 'Advanced',
        description: 'Comprehensive data analysis using Pandas, NumPy, Matplotlib, and Seaborn for data manipulation and visualization.',
        experience: '3+ years',
        projects: ['Data Analysis Pipelines', 'Statistical Modeling', 'Data Visualization']
      },
      {
        name: 'Hugging Face',
        skillLevel: 'Intermediate',
        description: 'Utilizing pre-trained models and transformers from Hugging Face for NLP and computer vision tasks.',
        experience: '1+ years',
        projects: ['Model Fine-tuning', 'Transfer Learning', 'NLP Applications']
      },
      {
        name: 'Prompt Engineering',
        skillLevel: 'Advanced',
        description: 'Expertise in crafting effective prompts and integrating OpenAI APIs for multimodal applications. Specialized in computer vision tasks including image analysis and structured description generation through Python implementations.',
        experience: '2+ years',
        projects: ['Automated Image Description', 'Custom Vision Systems', 'Multimodal AI Integration', 'Structured Output Generation']
      }
    ]
  },
  fullstack: {
    title: 'Full-Stack Development',
    icon: '💻',
    skills: [
      {
        name: 'Next.js 14',
        skillLevel: 'Advanced',
        description: 'Building modern full-stack applications with App Router, server components, API routes, and optimized rendering strategies (SSR/SSG).',
        experience: '2+ years',
        projects: ['Portfolio Website', 'Dynamic Web Applications', 'API Integration']
      },
      {
        name: 'React & TypeScript',
        skillLevel: 'Advanced',
        description: 'Developing type-safe, component-based user interfaces with advanced React patterns, custom hooks, and TypeScript for enhanced developer experience.',
        experience: '3+ years',
        projects: ['Interactive UIs', 'Component Libraries', 'State Management']
      },
      {
        name: 'Tailwind CSS & UI Components',
        skillLevel: 'Advanced',
        description: 'Creating responsive, accessible interfaces with utility-first CSS, custom animations, and component-driven design systems.',
        experience: '3+ years',
        projects: ['Responsive Layouts', 'Custom UI Components', 'Design Systems']
      },
      {
        name: 'MongoDB & Mongoose',
        skillLevel: 'Advanced',
        description: 'Designing NoSQL database schemas, implementing data models, and building efficient queries for scalable applications.',
        experience: '2+ years',
        projects: ['Document Databases', 'API Data Layer', 'Schema Design']
      },
      {
        name: 'API Development',
        skillLevel: 'Advanced',
        description: 'Creating RESTful and serverless API endpoints with Next.js API routes, middleware integration, and proper error handling.',
        experience: '2+ years',
        projects: ['REST APIs', 'Server Actions', 'Data Fetching']
      },
      {
        name: 'Full-Stack Architecture',
        skillLevel: 'Intermediate',
        description: 'Designing end-to-end application architecture with focus on performance, security, and maintainability using modern JavaScript/TypeScript patterns.',
        experience: '2+ years',
        projects: ['System Design', 'Code Organization', 'Performance Optimization']
      }
    ]
  },
  tools: {
    title: 'Development Tools & Technologies',
    icon: '🛠️',
    skills: [
      {
        name: 'Git & GitHub',
        skillLevel: 'Advanced',
        description: 'Version control, collaborative development, and open-source contribution workflows.',
        experience: '2+ years',
        projects: ['Open Source Projects', 'Team Collaboration', 'CI/CD Pipelines']
      },
      {
        name: 'Docker',
        skillLevel: 'Intermediate',
        description: 'Containerization for consistent development environments and deployment.',
        experience: '1+ years',
        projects: ['Container Deployment', 'Development Environments', 'Microservices']
      }
    ]
  }
};

const CATEGORIES = ['all', 'simulation', 'AI', 'fullstack', 'tools'];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Optimized animation trigger with reduced timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsLoading(false);
    }, 600); // Reduced from 800ms

    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered skills to prevent unnecessary recalculations
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') {
      return Object.values(SKILL_CATEGORIES).flatMap(category =>
        category.skills.map(skill => ({
          ...skill,
          category: category.title,
          icon: category.icon
        }))
      );
    }
    return SKILL_CATEGORIES[selectedCategory]?.skills.map(skill => ({
      ...skill,
      category: SKILL_CATEGORIES[selectedCategory].title,
      icon: SKILL_CATEGORIES[selectedCategory].icon
    })) || [];
  }, [selectedCategory]);

  // Optimized event handlers with useCallback
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleSkillClick = useCallback((skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Reduced timeout for better UX
    setTimeout(() => {
      setSelectedSkill(null);
    }, 150);
  }, []);

  return (
    <>
      {/* Inject CSS custom properties for better performance */}
      <style jsx>{`
        :root {
          ${Object.entries(DESIGN_VARS).map(([key, value]) => `${key}: ${value};`).join('\n')}
        }
      `}</style>

      <div className="min-h-screen relative">
        {/* Optimized Hero Section with will-change for better animation performance */}
        <div className="relative overflow-hidden">
          {/* Simplified background decorations with transform3d for GPU acceleration */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"
              style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse"
              style={{
                willChange: 'transform',
                transform: 'translate3d(0, 0, 0)',
                animationDelay: '1s'
              }}
            />
          </div>

          <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <h1
              className="text-4xl md:text-6xl font-light mb-6 bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent"
              style={{ willChange: 'transform' }}
            >
              Skills & <span className="font-bold">Expertise</span>
            </h1>
            <p
              className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              style={{ willChange: 'transform, opacity' }}
            >
              Bridging Engineering Excellence with Cutting-Edge Technology
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Optimized Category Filter with reduced DOM manipulation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg hover:scale-105'
                  : 'bg-white text-gray-700 shadow-md hover:bg-blue-100 hover:text-blue-700 hover:transform hover:-translate-y-0.5'
                  }`}
                style={{ willChange: 'transform' }}
              >
                {category === 'all' ? 'All Skills' :
                  category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Skills Grid with optimized props */}
          <div className="relative z-10">
            <SkillsGrid
              skills={filteredSkills}
              onSkillClick={handleSkillClick}
              viewMode="detailed"
              isLoading={isLoading}
            />
          </div>

          {/* Optimized Stats Section
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Skills Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">4+</div>
                <div className="text-gray-600">Technologies</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-purple-600 mb-2">4+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-green-600 mb-2">2+</div>
                <div className="text-gray-600">Projects</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
                <div className="text-gray-600">Specializations</div>
              </div>
            </div>
          </div> */}

          {/* Simplified Call to Action */}
          <div className="mt-16 text-center">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative bg-white rounded-2xl shadow-xl border border-blue-100/50 p-8 sm:p-12 hover:shadow-2xl hover:border-blue-100 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />

                <h2 className="text-3xl sm:text-4xl font-light mb-4 text-gray-800">
                  Ready to <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Collaborate?</span>
                </h2>

                <p className="text-lg sm:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
                  Let's bring your ideas to life with cutting-edge technology
                </p>

                <Link href="/contact">
                  <button
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                    style={{ willChange: 'transform' }}
                  >
                    <span>Get In Touch</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Conditionally render modal only when needed */}
        {isModalOpen && selectedSkill && (
          <SkillModal
            skill={selectedSkill}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}
