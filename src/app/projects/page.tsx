'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { RootState } from '@/lib/redux/store';
import { getProjects } from '@/lib/redux/slices/projectSlice';

const ProjectsPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { projects, loading } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);

  // Mock projects data for demonstration
  const mockProjects = [
    {
      _id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform built with MERN stack featuring user authentication, payment integration, and admin dashboard.',
      image: { url: '/project.jpg' },
      category: 'Full Stack',
      link: 'https://github.com/tahirsultan',
      featured: true,
      createdAt: new Date('2024-01-15'),
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'Completed'
    },
    {
      _id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: { url: '/project.jpg' },
      category: 'React',
      link: 'https://github.com/tahirsultan',
      featured: false,
      createdAt: new Date('2024-02-20'),
      technologies: ['React', 'Firebase', 'Material-UI'],
      status: 'Completed'
    },
    {
      _id: '3',
      title: 'Mobile Banking App',
      description: 'A secure mobile banking application built with React Native featuring biometric authentication and real-time transactions.',
      image: { url: '/project.jpg' },
      category: 'Mobile',
      link: 'https://github.com/tahirsultan',
      featured: true,
      createdAt: new Date('2024-03-10'),
      technologies: ['React Native', 'Node.js', 'PostgreSQL'],
      status: 'In Progress'
    },
    {
      _id: '4',
      title: 'AI Chat Assistant',
      description: 'An intelligent chat assistant powered by AI with natural language processing and contextual understanding.',
      image: { url: '/project.jpg' },
      category: 'AI/ML',
      link: 'https://github.com/tahirsultan',
      featured: false,
      createdAt: new Date('2024-04-05'),
      technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
      status: 'Completed'
    },
    {
      _id: '5',
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website showcasing projects and skills with dark mode and smooth animations.',
      image: { url: '/project.jpg' },
      category: 'Frontend',
      link: 'https://github.com/tahirsultan',
      featured: false,
      createdAt: new Date('2024-05-12'),
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      status: 'Completed'
    },
    {
      _id: '6',
      title: 'Social Media Dashboard',
      description: 'A comprehensive social media management dashboard with analytics, scheduling, and multi-platform integration.',
      image: { url: '/project.jpg' },
      category: 'Full Stack',
      link: 'https://github.com/tahirsultan',
      featured: true,
      createdAt: new Date('2024-06-18'),
      technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
      status: 'In Progress'
    }
  ];

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'React', 'Next.js'];

  useEffect(() => {
    dispatch(getProjects({}) as any);
  }, [dispatch]);

  useEffect(() => {
    const projectsToFilter = projects.length > 0 ? projects : mockProjects;
    let filtered = [...projectsToFilter];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies?.some((tech: string) => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, sortBy, mockProjects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const ProjectCard = ({ project, index }: { project: any; index: number }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-2xl hover:shadow-cyan-500/20' 
          : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
      }`}
    >
      <div className="relative overflow-hidden">
        <Image
          src={project.image?.url || '/project.jpg'}
          alt={project.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
              Featured
            </span>
          </div>
        )}

        {/* Overlay Links */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-3">
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              View Live
            </Link>
            <Link
              href={`/projects/${project._id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors duration-200"
            >
              Details
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
            {project.category}
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className={`text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors duration-200 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {project.title}
        </h3>
        
        <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 3).map((tech: string, techIndex: number) => (
            <span
              key={techIndex}
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
          >
            View Project
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      {/* Hero Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              My Projects
            </h1>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Explore my portfolio of web applications, mobile apps, and innovative solutions 
              built with modern technologies and best practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 ${darkMode ? 'focus:ring-cyan-500' : 'focus:ring-blue-500'} focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <svg
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A-Z</option>
                <option value="featured">Featured First</option>
              </select>

              {/* View Mode Toggle */}
              <div className={`flex rounded-lg border ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-l-lg transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? darkMode ? 'bg-gradient-to-r from-cyan-500 to-gray-900 text-white' : 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-r-lg transition-colors duration-200 ${
                    viewMode === 'list'
                      ? darkMode ? 'bg-gradient-to-r from-cyan-500 to-gray-900 text-white' : 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing {filteredProjects.length} of {projects.length > 0 ? projects.length : mockProjects.length} projects
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6 md:px-12">
          {loading ? (
            // Loading skeleton
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`rounded-2xl overflow-hidden animate-pulse ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : filteredProjects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}
            >
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project._id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            // No projects found
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                🔍
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No projects found
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search terms or filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-12 rounded-3xl text-center ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-100'
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Let's Work Together
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Have a project in mind? I'd love to help you bring your ideas to life with 
              cutting-edge technology and exceptional user experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-white ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                  }`}
                >
                  Start a Project
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className={`px-8 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${
                    darkMode
                      ? 'border-gray-600 text-white hover:bg-gray-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
