'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const EditTestimonialPage = ({ params }: { params: Promise<{ id: string }> }) => {
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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        // Resolve params
        const resolvedParams = await params;
        const { id } = resolvedParams;
        
        const response = await fetch(`/api/testimonials/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonial');
        }
        
        const data = await response.json();
        console.log('Fetched testimonial data:', data); // For debugging
        
        // Ensure all fields are properly populated with fallbacks
        setFormData({
          name: data.name ?? '',
          content: data.description ?? '',
          company: data.company ?? '',
          role: data.role ?? '',
          imageUrl: data.imageUrl ?? ''
        });
      } catch (error: any) {
        console.error('Error fetching testimonial:', error);
        alert('Error fetching testimonial: ' + (error.message || 'Unknown error'));
        // Redirect to testimonials list on error
        router.push('/dashboard/testimonials');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonial();
  }, [params, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Resolve params
      const resolvedParams = await params;
      const { id } = resolvedParams;
      
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/dashboard/testimonials');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert((error as Error).message || 'Failed to update testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      // Resolve params
      const resolvedParams = await params;
      const { id } = resolvedParams;
      
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/dashboard/testimonials');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert((error as Error).message || 'Failed to delete testimonial. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="container mx-auto px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Edit Testimonial
            </h1>
            <Link
              href="/dashboard/testimonials"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800' 
                  : 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 hover:from-gray-400 hover:to-gray-600'
              }`}
            >
              Back to Testimonials
            </Link>
          </div>
          
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Client Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Testimonial Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
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
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500`}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-gradient-to-r from-cyan-500 to-gray-900 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 ${
                    isSubmitting 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:from-cyan-600 hover:to-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/30"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/testimonials')}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800' 
                      : 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 hover:from-gray-400 hover:to-gray-600'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTestimonialPage;