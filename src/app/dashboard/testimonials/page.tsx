'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const TestimonialsPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/testimonials');
      setTestimonials(response.data || []);
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      setError(error.response?.data?.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await axios.delete(`/api/testimonials/${testimonialId}`);
      setTestimonials(testimonials.filter((testimonial: any) => testimonial._id !== testimonialId));
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      alert(error.response?.data?.message || 'Failed to delete testimonial');
    }
  };

  const handleToggleApproval = async (testimonialId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/testimonials/${testimonialId}`, {
        approved: !currentStatus
      });
      setTestimonials(testimonials.map((testimonial: any) => 
        testimonial._id === testimonialId 
          ? { ...testimonial, approved: !currentStatus }
          : testimonial
      ));
    } catch (error: any) {
      console.error('Error updating testimonial:', error);
      alert(error.response?.data?.message || 'Failed to update testimonial');
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6 md:px-12 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Testimonial Management
            </h1>
            <Link
              href="/dashboard/testimonials/new"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-gray-900 text-white rounded-lg hover:from-cyan-600 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
            >
              Add New Testimonial
            </Link>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="mb-6">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Client Testimonials
              </h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your testimonials here. Add new testimonials, edit existing ones, or delete testimonials you no longer want to showcase.
              </p>
            </div>

            <div className="space-y-4">
              {error ? (
                <div className="p-6 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : testimonials.length === 0 ? (
                <div className={`p-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No testimonials found</h3>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get started by adding a new testimonial.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/testimonials/new"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-gray-900 text-white rounded-lg hover:from-cyan-600 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Testimonial
                    </Link>
                  </div>
                </div>
              ) : (
                testimonials.map((testimonial: any) => (
                  <div key={testimonial._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          {testimonial.user?.image?.url ? (
                            <img 
                              src={testimonial.user.image.url} 
                              alt={testimonial.user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center`}>
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {testimonial.user?.name?.charAt(0).toUpperCase() || 'A'}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {testimonial.user?.name || 'Anonymous'}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                testimonial.approved 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {testimonial.approved ? '✅ Approved' : '⏳ Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <blockquote className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} italic border-l-4 border-yellow-500 pl-4 mb-3`}>
                          "{truncateText(testimonial.description || '', 300)}"
                        </blockquote>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleToggleApproval(testimonial._id, testimonial.approved)}
                          className={`px-4 py-2 text-sm rounded transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 ${
                            testimonial.approved
                              ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:from-amber-600 hover:to-amber-800'
                              : 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800'
                          }`}
                        >
                          {testimonial.approved ? 'Unapprove' : 'Approve'}
                        </button>
                        <Link
                          href={`/dashboard/testimonials/${testimonial._id}`}
                          className="px-4 py-2 text-sm text-center bg-gradient-to-r from-cyan-500 to-gray-900 text-white rounded transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 hover:from-cyan-600 hover:to-gray-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial._id)}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-700 text-white rounded transition-all duration-300 shadow-lg hover:shadow-red-500/30 hover:from-red-600 hover:to-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsPage;