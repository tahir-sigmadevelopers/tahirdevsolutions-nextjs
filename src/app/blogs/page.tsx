'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { RootState } from '@/lib/redux/store';
import { getBlogs } from '@/lib/redux/slices/blogSlice';

const BlogsPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { blogs, loading } = useSelector((state: RootState) => state.blog);
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(getBlogs({}) as any);
  }, [dispatch]);

  // Mock blog data if no blogs from API
  const mockBlogs = [
    {
      _id: '1',
      title: 'Boost Your Portfolio: 5 Must-Have Projects for Every Full Stack Developer in 2025',
      description: 'Whether you\'re aiming to land freelance clients, apply for a job, or simply showcase your skills, a strong portfolio is essential. As a full stack developer — especially one...',
      image: { url: '/blog.webp' },
      category: { name: 'MERN' },
      createdAt: new Date('2025-06-19'),
      readTime: 23,
      author: { name: 'Muhammad Tahir' }
    },
    {
      _id: '2',
      title: '🚀 MERN Stack Developer Roadmap (2025) – From Beginner to Pro',
      description: 'The MERN Stack is one of the most popular web development stacks today, powering everything from startups to enterprise-grade applications. It combines...',
      image: { url: '/blog.webp' },
      category: { name: 'MERN' },
      createdAt: new Date('2025-08-30'),
      readTime: 15,
      author: { name: 'Muhammad Tahir' }
    }
  ];

  const displayBlogs = blogs.length > 0 ? blogs : mockBlogs;
  
  // Filter blogs based on search and category
  const filteredBlogs = displayBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || 
                           blog.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All Categories', 'MERN', 'React', 'Node.js', 'JavaScript', 'Next.js', 'MongoDB'];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      {/* Hero Section */}
      <section className={`py-20 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700'
      }`}>
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Tahir.dev <span className="underline decoration-4 decoration-blue-400">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
              Insights, tutorials, and updates from our team of expert developers and 
              designers. Stay informed about the latest trends in web development 
              and design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-md"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex gap-2"
            >
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'All Categories'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setSelectedCategory('MERN')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'MERN'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                MERN
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Articles */}
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
          ) : filteredBlogs.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-2xl hover:shadow-blue-500/20' 
                      : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={blog.image?.url || '/blog.webp'}
                      alt={blog.title}
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                        {blog.category?.name || 'MERN'}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-900'
                      }`}>
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className={`text-xl font-bold mb-4 line-clamp-2 group-hover:text-blue-500 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {blog.title}
                    </h2>
                    
                    <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {blog.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/blogs/${blog._id}`}
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
                      >
                        Read More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
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
                      
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {blog.readTime || 23} min read
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            // No blogs found
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                📝
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No articles found
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search terms or filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
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
              📧 Subscribe to Our Newsletter
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get the latest articles, tutorials, and updates delivered straight to your inbox. Join 
              our community of developers and designers.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={`flex-1 px-4 py-3 rounded-lg border transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </form>

            <p className={`text-xs mt-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pagination (if needed) */}
      {filteredBlogs.length > 6 && (
        <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-full font-medium transition-all duration-200 ${
                    page === 1
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogsPage;
