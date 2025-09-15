'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RootState } from '@/lib/redux/store';
import { getProjects } from '@/lib/redux/slices/projectSlice';

const ProjectSection = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { projects, loading } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  const [displayProjects, setDisplayProjects] = useState<any[]>([]);

  // Mock projects for demo purposes when database is empty
  const mockProjects = [
    {
      _id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform with modern design, secure payments, and admin dashboard.',
      image: { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop' },
      category: 'Full Stack',
      link: 'https://github.com/tahirsultan',
      featured: true,
      createdAt: new Date('2024-01-15'),
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'Completed'
    },
    {
      _id: '2',
      title: 'AI Chat Assistant',
      description: 'An intelligent chat assistant powered by AI with natural language processing capabilities.',
      image: { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop' },
      category: 'AI/ML',
      link: 'https://github.com/tahirsultan',
      featured: true,
      createdAt: new Date('2024-02-20'),
      technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
      status: 'Completed'
    },
    {
      _id: '3',
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website with dark mode and smooth animations.',
      image: { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop' },
      category: 'Frontend',
      link: 'https://github.com/tahirsultan',
      featured: true,
      createdAt: new Date('2024-03-10'),
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      status: 'Completed'
    }
  ];

  useEffect(() => {
    console.log('🏠 Home ProjectSection: Dispatching getProjects with featured=true');
    dispatch(getProjects({ featured: true }) as any);
  }, [dispatch]);

  useEffect(() => {
    console.log('🏠 Home ProjectSection: State changed', {
      projectsLength: projects.length,
      loading,
      featuredCount: projects.filter(p => p.featured).length
    });

    // Use real projects if available, otherwise use mock data
    const featuredProjects = projects.filter(project => project.featured);
    if (featuredProjects.length > 0) {
      console.log('🏠 Using database featured projects:', featuredProjects.length);
      setDisplayProjects(featuredProjects.slice(0, 3));
    } else if (!loading) {
      // Only show mock data if not loading and no real projects found
      console.log('🏠 Using mock featured projects');
      setDisplayProjects(mockProjects.slice(0, 3));
    }
  }, [projects, loading]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className={`py-20 relative z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-6 md:px-12 relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-30"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Featured Projects
          </h2>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            Explore our latest work and see how we bring ideas to life
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-40"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`rounded-2xl overflow-hidden shadow-lg animate-pulse relative z-50 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              </motion.div>
            ))
          ) : displayProjects.length > 0 ? (
            displayProjects.map((project: any, index: number) => (
              <motion.div
                key={project._id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative z-50 ${darkMode
                    ? 'bg-gray-700 hover:shadow-2xl hover:shadow-cyan-500/20'
                    : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
                  }`}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image?.url || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'}
                    alt={project.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Project Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center px-3 py-0 rounded-lg font-semibold transition-all duration-300 text-white ${darkMode
                      ? 'bg-gradient-to-r from-gray-500 to-cyan-600 hover:shadow-cyan-950'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                      } shadow-lg hover:scale-105`}>
                      {project.category}
                    </span>
                  </div>


                </div>

                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {project.description.length > 100
                      ? `${project.description.substring(0, 100)}...`
                      : project.description
                    }
                  </p>

                  {/* Technologies */}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className={`px-2 py-1 rounded-md text-xs font-medium ${darkMode
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* See Demo Link */}
                  <div className="mt-4">
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-white ${darkMode
                          ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                        } shadow-lg hover:scale-105`}
                    >
                      See Demo
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // No projects fallback
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-12 relative z-50"
            >
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                🚀
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                No Featured Projects Yet
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Check back soon for our latest work!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12 relative z-30"
        >
          <Link
            href="/projects"
            className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-white ${darkMode
                ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
              }`}
          >
            View All Projects
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectSection;
