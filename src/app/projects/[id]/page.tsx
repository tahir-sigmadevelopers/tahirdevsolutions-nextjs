'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { RootState } from '@/lib/redux/store';

const ProjectDetailPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock project data for demonstration
  const mockProject = {
    _id: '1',
    title: 'E-Commerce Platform',
    description: 'A comprehensive e-commerce platform built with modern web technologies, featuring user authentication, payment integration, product management, and an intuitive admin dashboard. This full-stack application demonstrates proficiency in both frontend and backend development.',
    longDescription: `This e-commerce platform is a comprehensive solution designed to meet the needs of modern online businesses. Built with the MERN stack (MongoDB, Express.js, React, and Node.js), it showcases advanced web development practices and modern UI/UX design principles.

    The platform includes a responsive frontend built with React and styled using Tailwind CSS, ensuring a seamless experience across all devices. The backend API, built with Express.js and Node.js, provides robust functionality for user management, product catalog, order processing, and payment integration.

    Key features include real-time inventory management, secure payment processing with Stripe, user authentication and authorization, advanced search and filtering capabilities, and a comprehensive admin dashboard for managing products, orders, and users.

    The application follows best practices for security, performance, and scalability, making it suitable for production deployment and capable of handling high traffic loads.`,
    image: { url: '/project.jpg' },
    images: [
      { url: '/project.jpg', caption: 'Homepage with featured products' },
      { url: '/project.jpg', caption: 'Product detail page' },
      { url: '/project.jpg', caption: 'Shopping cart and checkout' },
      { url: '/project.jpg', caption: 'Admin dashboard' }
    ],
    category: 'Full Stack',
    link: 'https://github.com/tahirsultan',
    liveLink: 'https://ecommerce-demo.vercel.app',
    githubLink: 'https://github.com/tahirsultan/ecommerce-platform',
    featured: true,
    createdAt: new Date('2024-01-15'),
    technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Stripe', 'Tailwind CSS', 'JWT', 'Cloudinary'],
    status: 'Completed',
    features: [
      'User Authentication & Authorization',
      'Product Catalog with Search & Filters',
      'Shopping Cart & Wishlist',
      'Secure Payment Processing (Stripe)',
      'Order Management System',
      'Admin Dashboard',
      'Real-time Inventory Management',
      'Responsive Design',
      'Image Upload & Management',
      'Email Notifications'
    ],
    challenges: [
      'Implementing secure payment processing',
      'Managing complex state across the application',
      'Optimizing database queries for performance',
      'Creating a responsive and intuitive UI'
    ],
    learnings: [
      'Advanced React patterns and hooks',
      'Backend API design and security',
      'Database optimization techniques',
      'Payment gateway integration'
    ]
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="container mx-auto px-6 md:px-12 py-20">
          <div className="animate-pulse">
            <div className={`h-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'} rounded mb-4`}></div>
            <div className={`h-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'} rounded mb-8 w-3/4`}></div>
            <div className={`h-64 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'} rounded mb-8`}></div>
            <div className={`h-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'} rounded mb-2`}></div>
            <div className={`h-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'} rounded mb-2 w-5/6`}></div>
            <div className={`h-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'} rounded w-4/6`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Project Not Found
          </h1>
          <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The project you're looking for doesn't exist.
          </p>
          <Link
            href="/projects"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      {/* Header */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 mb-8">
              <Link href="/projects" className="text-blue-500 hover:text-blue-600">
                Projects
              </Link>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                /
              </span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {project.title}
              </span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                    {project.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'Completed' 
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white">
                      Featured
                    </span>
                  )}
                </div>

                <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.title}
                </h1>

                <p className={`text-lg md:text-xl leading-relaxed mb-8 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.liveLink && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 text-white ${
                          darkMode
                            ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Live Demo
                      </Link>
                    </motion.div>
                  )}
                  {project.githubLink && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-300 ${
                          darkMode
                            ? 'border-gray-600 text-white hover:bg-gray-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View Source Code
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Project Stats */}
              <div className={`lg:w-80 p-6 rounded-2xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Project Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Created:
                    </span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Category:
                    </span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {project.category}
                    </span>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Status:
                    </span>
                    <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Images */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={project.images?.[currentImageIndex]?.url || project.image.url}
                  alt={project.images?.[currentImageIndex]?.caption || project.title}
                  width={1200}
                  height={600}
                  className="w-full h-96 object-cover"
                />
                {project.images && project.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === 0 ? project.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === project.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {project.images?.[currentImageIndex]?.caption && (
                <p className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.images[currentImageIndex].caption}
                </p>
              )}
            </div>

            {/* Image Thumbnails */}
            {project.images && project.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
                      currentImageIndex === index
                        ? 'ring-4 ring-blue-500'
                        : 'hover:scale-105'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption}
                      width={300}
                      height={200}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Project Content */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className={`text-3xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Project Overview
                </h2>
                <div className={`prose prose-lg max-w-none ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {project.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </motion.div>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12"
              >
                <h3 className={`text-2xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        darkMode 
                          ? 'bg-gray-600 text-gray-300' 
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Challenges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Challenges Overcome
                </h3>
                <ul className="space-y-2">
                  {project.challenges.map((challenge: string, index: number) => (
                    <li key={index} className={`flex items-start ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className="text-orange-500 mr-2">•</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Key Learnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <h3 className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Key Learnings
                </h3>
                <ul className="space-y-2">
                  {project.learnings.map((learning: string, index: number) => (
                    <li key={index} className={`flex items-start ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className="text-blue-500 mr-2">•</span>
                      {learning}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} border-t ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center">
            <Link
              href="/projects"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>
            <Link
              href="/contact"
              className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 text-white ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg'
              }`}
            >
              Hire Me for Similar Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
