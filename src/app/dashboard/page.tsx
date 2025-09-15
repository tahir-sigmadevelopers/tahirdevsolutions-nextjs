'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RootState } from '@/lib/redux/store';
import axios from 'axios';

const DashboardPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState({
    projects: 0,
    blogs: 0,
    testimonials: 0,
    users: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data with individual error handling
      const results = await Promise.allSettled([
        axios.get('/api/projects'),
        axios.get('/api/blogs'),
        axios.get('/api/testimonials'),
        axios.get('/api/users')
      ]);

      // Extract successful responses
      const [projectsRes, blogsRes, testimonialsRes, usersRes] = results;
      
      setDashboardStats({
        projects: projectsRes.status === 'fulfilled' 
          ? (projectsRes.value.data.pagination?.total || projectsRes.value.data.projects?.length || 0)
          : 0,
        blogs: blogsRes.status === 'fulfilled' 
          ? (blogsRes.value.data.pagination?.total || blogsRes.value.data.blogs?.length || 0)
          : 0,
        testimonials: testimonialsRes.status === 'fulfilled' 
          ? (testimonialsRes.value.data.length || 0)
          : 0,
        users: usersRes.status === 'fulfilled' 
          ? (usersRes.value.data.length || 0)
          : 0
      });

      // Get recent items from successful responses
      setRecentBlogs(
        blogsRes.status === 'fulfilled' 
          ? (blogsRes.value.data.blogs?.slice(0, 3) || [])
          : []
      );
      setRecentProjects(
        projectsRes.status === 'fulfilled' 
          ? (projectsRes.value.data.projects?.slice(0, 3) || [])
          : []
      );
      
      // Log any failed requests for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const endpoints = ['/api/projects', '/api/blogs', '/api/testimonials', '/api/users'];
          console.warn(`Failed to fetch ${endpoints[index]}:`, result.reason?.response?.data || result.reason?.message);
        }
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } pt-20`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const statsDisplay = [
    { label: 'Total Projects', value: dashboardStats.projects.toString(), icon: '🚀', color: 'from-blue-500 to-cyan-500' },
    { label: 'Blog Posts', value: dashboardStats.blogs.toString(), icon: '📝', color: 'from-green-500 to-emerald-500' },
    { label: 'Testimonials', value: dashboardStats.testimonials.toString(), icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { label: 'Total Users', value: dashboardStats.users.toString(), icon: '👥', color: 'from-purple-500 to-pink-500' }
  ];

  const recentActivities = [
    ...recentBlogs.slice(0, 2).map((blog: any) => ({
      action: 'Blog post published',
      item: blog.title,
      time: new Date(blog.createdAt || blog.updatedAt || Date.now()).toLocaleDateString(),
      type: 'blog'
    })),
    ...recentProjects.slice(0, 2).map((project: any) => ({
      action: 'New project added',
      item: project.title,
      time: new Date(project.createdAt || project.updatedAt || Date.now()).toLocaleDateString(),
      type: 'project'
    }))
  ];

  const quickActions = [
    { title: 'Add New Project', href: '/dashboard/projects/new', icon: '➕', color: 'bg-blue-500' },
    { title: 'Write Blog Post', href: '/dashboard/blogs/new', icon: '✍️', color: 'bg-green-500' },
    { title: 'View Analytics', href: '/dashboard/analytics', icon: '📊', color: 'bg-purple-500' },
    { title: 'Manage Profile', href: '/dashboard/profile', icon: '⚙️', color: 'bg-orange-500' }
  ];

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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6 md:px-12 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Welcome back, {session.user?.name}! 👋
                </h1>
                <p className={`text-lg mt-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Here's what's happening with your portfolio today.
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Role: 
                </span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                  (session.user as any)?.role === 'admin' 
                    ? 'bg-purple-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {(session.user as any)?.role || 'User'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statsDisplay.map((stat: { label: string; value: string; icon: string; color: string }, index: number) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`p-6 rounded-2xl shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <div className={`p-6 rounded-2xl shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${
                        darkMode 
                          ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-3`}>
                          {action.icon}
                        </div>
                        <h3 className={`font-semibold text-sm ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {action.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <div className={`p-6 rounded-2xl shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'project' ? 'bg-blue-500' :
                        activity.type === 'blog' ? 'bg-green-500' :
                        activity.type === 'testimonial' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <span className="font-medium">{activity.action}</span>
                          <span className={`${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}> - {activity.item}</span>
                        </p>
                        <p className={`text-xs mt-1 ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Portfolio Overview */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className={`p-8 rounded-2xl shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Portfolio Overview
                </h2>
                <Link
                  href="/projects"
                  className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                >
                  View All →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    🎯
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Projects Completed
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Successfully delivered {dashboardStats.projects} projects with modern technologies and best practices.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    📈
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Skills Enhanced
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Continuously learning and implementing cutting-edge technologies.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    🌟
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Client Satisfaction
                  </h3>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Maintaining high client satisfaction with quality deliverables.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className={`p-8 rounded-2xl text-center ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-gray-700' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Ready to showcase your work?
              </h2>
              <p className={`mb-6 max-w-2xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your portfolio is looking great! Consider adding more projects, writing blog posts, 
                or updating your skills to attract more opportunities.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/projects"
                  className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 text-white ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                  }`}
                >
                  View Portfolio
                </Link>
                <Link
                  href="/contact"
                  className={`px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-200 ${
                    darkMode
                      ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;