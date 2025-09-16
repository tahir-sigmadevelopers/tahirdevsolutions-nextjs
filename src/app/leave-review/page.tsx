'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LeaveReviewPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    company: '',
    role: '',
    imageUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          content: '',
          company: '',
          role: '',
          imageUrl: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit testimonial');
      }
    } catch (error: any) {
      console.error('Error submitting testimonial:', error);
      setSubmitError(error.message || 'Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitSuccess) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="container mx-auto px-6 md:px-12 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Thank You for Your Review!
              </h1>
              <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your testimonial has been submitted successfully. It will be reviewed and published shortly.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/"
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center ${
                    darkMode 
                      ? 'bg-gradient-to-r from-cyan-500 to-gray-900 text-white hover:from-cyan-600 hover:to-gray-800' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  Back to Home
                </Link>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      name: '',
                      content: '',
                      company: '',
                      role: '',
                      imageUrl: ''
                    });
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center ${
                    darkMode 
                      ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Submit Another Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="container mx-auto px-6 md:px-12 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Leave a Review
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We'd love to hear about your experience working with us
            </p>
          </div>
          
          <div className={`p-6 md:p-8 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {submitError && (
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                <p className={`font-medium ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                  {submitError}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Review *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors`}
                  placeholder="Tell us about your experience working with us..."
                  required
                ></textarea>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors`}
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors`}
                  placeholder="Your position at the company"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors`}
                  placeholder="Link to your profile image"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-gray-900 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 font-medium ${
                    isSubmitting 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:from-cyan-600 hover:to-gray-800 transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Review...
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
              
              <div className="text-center pt-4">
                <Link 
                  href="/" 
                  className={`text-sm ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                >
                  ← Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewPage;