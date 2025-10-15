'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FilterSidebar from '@/components/FilterSidebar';

// Mock data for demo projects
const DEMO_PROJECTS = [
  {
    id: 1,
    title: 'TWITCH',
    subtitle: 'A global community creating the future of live entertainment',
    description: 'Twitch is the world\'s leading live streaming platform for gamers and the things we love. Watch and chat now with millions of other fans from around the world.',
    team: ['Emmett Shear', 'Justin Kan', 'Kyle Vogt', 'David Yang'],
    category: 'CONTENT',
    industries: ['AI'],
    color: 'from-orange-600 to-orange-800',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
    hasBookmark: true,
  },
  {
    id: 2,
    title: 'AXEL',
    subtitle: 'The future of education',
    description: 'An innovative educational platform that uses AI to personalize learning experiences for students of all ages.',
    team: ['Kailia Green'],
    category: 'EDUCATION',
    industries: ['AI', 'EDTECH'],
    color: 'from-teal-400 to-teal-500',
    image: null,
    hasBookmark: false,
  },
  {
    id: 3,
    title: 'BASH TRACK',
    subtitle: 'Event logistics',
    description: 'Comprehensive event management and logistics platform for organizing large-scale events and conferences.',
    team: ['David Yang', 'Carlos Godoy', 'Tony Xu', 'Jnc Reverend', 'Victoria Mayo'],
    category: 'OPERATIONS',
    industries: ['CONSUMER'],
    color: 'from-blue-600 to-black',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    hasBookmark: true,
  },
  {
    id: 4,
    title: 'NOTION',
    subtitle: 'The AI workspace where teams and AI agents get more done together.',
    description: 'Notion is a workspace that adapts to your needs. It\'s as minimal or as powerful as you need it to be.',
    team: ['Emmett Shear', 'Justin Kan', 'Kyle Vogt', 'David Yang'],
    category: 'OPERATIONS',
    industries: ['AI', 'PRODUCTIVITY'],
    color: 'from-white to-neutral-50',
    textColor: 'text-black',
    image: null,
    hasBookmark: true,
  },
  {
    id: 5,
    title: 'COINBASE',
    subtitle: 'Buy, sell, and manage cryptocurrencies.',
    description: 'Coinbase is a secure platform that makes it easy to buy, sell, and store cryptocurrency like Bitcoin, Ethereum, and more.',
    team: ['Brian Armstrong'],
    category: 'CRYPTO',
    industries: ['FINTECH'],
    color: 'from-blue-600 to-blue-700',
    image: null,
    hasBookmark: false,
  },
  {
    id: 6,
    title: 'AIRBNB',
    subtitle: 'Vacation rentals, cabins, beach houses, & more',
    description: 'Book unique homes and experiences all over the world. Find adventures nearby or in faraway places.',
    team: ['Brian Chesky', 'Nathan Blecharczyk', 'Joe Gebbia'],
    category: 'EDUCATION',
    industries: ['TRAVEL', 'CONSUMER'],
    color: 'from-neutral-800 to-neutral-900',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    hasBookmark: true,
  },
  {
    id: 7,
    title: 'DOORDASH',
    subtitle: 'Restaurant delivery',
    description: 'Get your favorite foods delivered in under an hour. DoorDash connects you with the best restaurants in your city.',
    team: ['Tony Xu', 'Andy Fang', 'Stanley Tang'],
    category: 'MARKETPLACE',
    industries: ['CONSUMER', 'FOOD'],
    color: 'from-red-500 to-red-600',
    image: null,
    hasBookmark: false,
  },
  {
    id: 8,
    title: 'AMPLITUDE',
    subtitle: 'Digital analytics platform',
    description: 'Product analytics platform helping companies build better products through data-driven insights.',
    team: ['Spencer Skates', 'Curtis Liu'],
    category: 'ANALYTICS',
    industries: ['DATA', 'SAAS'],
    color: 'from-neutral-700 to-neutral-800',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    hasBookmark: false,
  },
];

export default function ProjectsModalDemo() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const selectedProject = selectedProjectIndex !== null ? DEMO_PROJECTS[selectedProjectIndex] : null;

  const openModal = (index: number) => {
    setSelectedProjectIndex(index);
  };

  const closeModal = () => {
    setSelectedProjectIndex(null);
  };

  const goToPrevious = () => {
    if (selectedProjectIndex !== null && selectedProjectIndex > 0) {
      setSelectedProjectIndex(selectedProjectIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedProjectIndex !== null && selectedProjectIndex < DEMO_PROJECTS.length - 1) {
      setSelectedProjectIndex(selectedProjectIndex + 1);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#E8E8E8]">
        {/* Left Sidebar */}
        <FilterSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">PURSUIT PAGES</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">{DEMO_PROJECTS.length} of 12</span>
              <div className="flex gap-1 border border-neutral-300 rounded bg-white">
                <button className="p-2 hover:bg-neutral-50 rounded-l">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-neutral-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-neutral-50 rounded-r bg-neutral-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex items-center gap-4">
            <Link href="/projects/modal-demo" className="rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white">
              PROJECTS
            </Link>
            <Link href="/people/modal-demo" className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm hover:bg-neutral-50">
              PEOPLE
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {DEMO_PROJECTS.map((project, index) => (
              <button
                key={project.id}
                onClick={() => openModal(index)}
                className="group relative overflow-hidden rounded-2xl shadow-sm transition hover:shadow-xl text-left h-[400px]"
              >
                {/* Background with gradient or image */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`}>
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover opacity-40 mix-blend-overlay"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                </div>

                {/* Bookmark */}
                {project.hasBookmark && (
                  <div className="absolute top-0 right-4 w-8 h-12 bg-blue-500 clip-bookmark"></div>
                )}

                {/* Content Overlay */}
                <div className={`relative h-full flex flex-col justify-between p-6 ${project.textColor || 'text-white'}`}>
                  {/* Top Section */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm opacity-90">{project.subtitle}</p>
                  </div>

                  {/* Bottom Section */}
                  <div>
                    {/* Team */}
                    <div className="mb-4">
                      <p className="text-xs opacity-75 mb-2">Project Team</p>
                      <ul className="space-y-0.5">
                        {project.team.slice(0, 4).map((member, i) => (
                          <li key={i} className="text-sm opacity-90">• {member}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Category Badge and Arrow */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-medium">
                        {project.category}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          {/* Navigation Arrows */}
          {selectedProjectIndex !== null && selectedProjectIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-neutral-50 transition z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {selectedProjectIndex !== null && selectedProjectIndex < DEMO_PROJECTS.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-neutral-50 transition z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Modal Content */}
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Project Content */}
            <div className="p-8">
              {/* Hero Section */}
              <div className={`relative rounded-xl overflow-hidden mb-8 h-64 bg-gradient-to-br ${selectedProject.color}`}>
                {selectedProject.image && (
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                    sizes="800px"
                  />
                )}
                <div className={`relative h-full flex flex-col justify-center p-8 ${selectedProject.textColor || 'text-white'}`}>
                  <h2 className="text-4xl font-bold mb-2">{selectedProject.title}</h2>
                  <p className="text-lg opacity-90">{selectedProject.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">About the Project</h3>
                <p className="text-neutral-700 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Project Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Team */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Project Team</h3>
                  <ul className="space-y-2">
                    {selectedProject.team.map((member, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                          {member.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-neutral-700">{member}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Industries */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.industries.map((industry, i) => (
                      <span key={i} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                        {industry}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Category</h4>
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                      {selectedProject.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    View on GitHub
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Website
                  </a>
                </div>
              </div>
            </div>

            {/* Position Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-500">
              {selectedProjectIndex !== null && `${selectedProjectIndex + 1} of ${DEMO_PROJECTS.length}`}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
