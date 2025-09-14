'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CategoriesPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blogCounts, setBlogCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchCategoriesWithCounts();
  }, []);

  const fetchCategoriesWithCounts = async () => {
    try {
      setLoading(true);
      const [categoriesRes, blogsRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/blogs')
      ]);
      
      setCategories(categoriesRes.data || []);
      
      // Count blogs per category
      const counts: {[key: string]: number} = {};
      const blogs = blogsRes.data.blogs || [];
      
      categoriesRes.data.forEach((category: any) => {
        counts[category._id] = blogs.filter((blog: any) => 
          blog.category?._id === category._id || blog.category === category._id
        ).length;
      });
      
      setBlogCounts(counts);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      setCategories(categories.filter((category: any) => category._id !== categoryId));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Failed to delete category');
    }
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
              Category Management
            </h1>
            <Link
              href="/dashboard/categories/new"
              className={`px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors`}
            >
              Add New Category
            </Link>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="mb-6">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Blog Categories
              </h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your blog categories here. Add new categories, edit existing ones, or delete categories you no longer need.
              </p>
            </div>

            <div className="space-y-4">
              {error ? (
                <div className="p-6 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : categories.length === 0 ? (
                <div className={`p-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No categories found</h3>
                  <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get started by creating a new category.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/categories/new"
                      className={`inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Category
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category: any) => (
                    <div key={category._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {category.category}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              blogCounts[category._id] > 0
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {blogCounts[category._id] || 0} {blogCounts[category._id] === 1 ? 'post' : 'posts'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 ml-2">
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className={`px-3 py-1 text-xs rounded ${
                              blogCounts[category._id] > 0
                                ? `${darkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`
                                : `${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`
                            } transition-colors`}
                            disabled={blogCounts[category._id] > 0}
                            title={blogCounts[category._id] > 0 ? 'Cannot delete category with existing posts' : 'Delete category'}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {blogCounts[category._id] > 0 ? (
                          <p>This category is being used by {blogCounts[category._id]} blog {blogCounts[category._id] === 1 ? 'post' : 'posts'}.</p>
                        ) : (
                          <p>This category is not being used by any blog posts.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesPage;