'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for demo
const DEMO_PEOPLE = [
  {
    id: 1,
    name: 'Jovanni Luna',
    title: 'Full-Stack Software Engineer',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'A child of immigrants and a proud New Yorker, Jovanni knew that he wanted to go into technology as a kid. He gained business, logistics, and customer skills working as a lead concierge at a luxury building and a sales associate at Best Buy.\n\nAfter completing Pursuit, Jovanni worked as a Software Engineer II at Foursquare. He focused on backend engineering, developing scalable systems with Scala, Python, PostgreSQL, and MongoDB.',
    highlights: ['3 years of experience at FSQ', 'Customer service and consumer expert'],
    skills: ['JavaScript', 'Ruby', 'SQL', 'MongoDB', 'PostgreSQL', 'React', 'Ruby on Rails', 'Node.js', 'Express', 'Next.js'],
    industryExpertise: ['AI', 'TRAVEL', 'CONSUMER'],
    experience: [
      { org: 'Foursquare', role: 'Software Engineer II', years: '2021 - 2024' },
      { org: 'Pursuit', role: 'Fellowship: Full-stack Web', years: '2019' },
      { org: 'PBS Facility Service', role: 'Lead Concierge', years: '2016 - 2019' },
    ],
    projects: [
      { name: 'Twitch', description: 'A global community creating the future of live entertainment', link: 'Github →' },
      { name: 'Airbnb', description: 'Book accommodations around the world.', link: 'App Store →' },
      { name: 'Reddit', description: 'The frontpage of the internet', link: 'Github →' },
    ],
  },
  {
    id: 2,
    name: 'Sarah Chen',
    title: 'Product Designer & UX Lead',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Sarah is a product designer with a passion for creating intuitive, accessible experiences. With a background in cognitive science and 8 years of design experience, she has led design teams at multiple startups.',
    highlights: ['Led design for 10M+ user products', 'Built 3 design systems from scratch'],
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility', 'HTML/CSS'],
    industryExpertise: ['FINTECH', 'HEALTHTECH', 'CONSUMER'],
    experience: [
      { org: 'Stripe', role: 'Senior Product Designer', years: '2020 - 2024' },
      { org: 'Oscar Health', role: 'Product Designer', years: '2018 - 2020' },
    ],
    projects: [
      { name: 'Stripe Dashboard', description: 'Complete redesign of payment dashboard', link: 'View →' },
      { name: 'Health Portal', description: 'Patient-facing health platform', link: 'View →' },
    ],
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    title: 'Machine Learning Engineer',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Marcus specializes in building and deploying ML models at scale. From recommendation systems to computer vision, he has worked across the ML stack.',
    highlights: ['PhD in Computer Science (ML)', 'Built ML platform serving 100M+ predictions/day'],
    skills: ['Python', 'PyTorch', 'TensorFlow', 'AWS', 'Kubernetes', 'MLOps', 'NLP', 'Computer Vision'],
    industryExpertise: ['AI', 'EDTECH', 'FINTECH'],
    experience: [
      { org: 'Databricks', role: 'Senior ML Engineer', years: '2021 - 2024' },
      { org: 'Coursera', role: 'ML Engineer', years: '2019 - 2021' },
    ],
    projects: [
      { name: 'DataViz Pro', description: 'ML-powered data visualization', link: 'Github →' },
    ],
  },
];

export default function ModalDemoPage() {
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(null);

  const selectedPerson = selectedPersonIndex !== null ? DEMO_PEOPLE[selectedPersonIndex] : null;

  const openModal = (index: number) => {
    setSelectedPersonIndex(index);
  };

  const closeModal = () => {
    setSelectedPersonIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPersonIndex !== null && selectedPersonIndex > 0) {
      setSelectedPersonIndex(selectedPersonIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPersonIndex !== null && selectedPersonIndex < DEMO_PEOPLE.length - 1) {
      setSelectedPersonIndex(selectedPersonIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modal Profile Demo</h1>
        <p className="text-neutral-600 mb-8">Click on a person card to open their profile in a modal</p>

        {/* People Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DEMO_PEOPLE.map((person, index) => (
            <button
              key={person.id}
              onClick={() => openModal(index)}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl text-left"
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold">{person.name}</h3>
                <p className="mb-3 text-sm text-neutral-600">{person.title}</p>
                <div className="flex flex-wrap gap-1">
                  {person.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                      {skill}
                    </span>
                  ))}
                  {person.skills.length > 3 && (
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                      +{person.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        {selectedPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            {/* Navigation Arrows */}
            {selectedPersonIndex !== null && selectedPersonIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg hover:bg-neutral-50 transition z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {selectedPersonIndex !== null && selectedPersonIndex < DEMO_PEOPLE.length - 1 && (
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
            <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Profile Content */}
              <div className="p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  {/* Photo */}
                  <div className="relative w-full md:w-64 h-64 flex-shrink-0">
                    <Image
                      src={selectedPerson.photo}
                      alt={selectedPerson.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="256px"
                    />
                  </div>

                  {/* Bio */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-3xl font-bold">{selectedPerson.name}</h2>
                      <div className="flex gap-2">
                        <a href="#" className="text-neutral-600 hover:text-black">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                        <a href="#" className="text-neutral-600 hover:text-blue-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a href="#" className="text-neutral-600 hover:text-black">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <p className="text-neutral-600 mb-4">{selectedPerson.title}</p>
                    <div className="mb-4">
                      <h3 className="font-semibold text-sm mb-2">Bio & Credentials</h3>
                      <p className="text-sm text-neutral-700 whitespace-pre-line">{selectedPerson.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Four Column Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {/* Highlights */}
                  <div className="bg-black text-white rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Highlights</h3>
                    <div className="space-y-3">
                      {selectedPerson.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </div>
                          <p className="text-sm">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="font-semibold mb-4 text-sm">Experience + Education</h3>
                    <div className="space-y-4">
                      {selectedPerson.experience.map((exp, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded bg-blue-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-700">
                            {exp.org.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{exp.org}</p>
                            <p className="text-xs text-neutral-600">{exp.role}</p>
                            <p className="text-xs text-neutral-500">{exp.years}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold mb-4 text-sm">Skills</h3>
                    <ul className="space-y-1">
                      {selectedPerson.skills.map((skill, i) => (
                        <li key={i} className="text-sm text-neutral-700">• {skill}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Industry Expertise */}
                  <div>
                    <h3 className="font-semibold mb-4 text-sm">Industry Expertise</h3>
                    <div className="space-y-2">
                      {selectedPerson.industryExpertise.map((industry, i) => {
                        const colors = ['bg-pink-100 text-pink-800', 'bg-blue-100 text-blue-800', 'bg-green-100 text-green-800'];
                        return (
                          <div key={i} className={`rounded-full px-3 py-1 text-xs font-medium ${colors[i % colors.length]}`}>
                            {industry}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Select Projects */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Select Projects</h3>
                    <button className="text-sm text-neutral-600 hover:text-black">View all →</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedPerson.projects.map((project, i) => (
                      <div key={i} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mb-3"></div>
                        <h4 className="font-semibold mb-1">{project.name}</h4>
                        <p className="text-xs text-neutral-600 mb-2">{project.description}</p>
                        <a href="#" className="text-xs text-blue-600 hover:underline">{project.link}</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Position Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-500">
                {selectedPersonIndex !== null && `${selectedPersonIndex + 1} of ${DEMO_PEOPLE.length}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
