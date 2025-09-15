'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';
import toast from 'react-hot-toast';

// Dynamic import for JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const AddBlogPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    category: '',
    imageUrl: '',
    author: 'Muhammad Tahir'
  });
  
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<{_id: string, category: string}[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useRef(null);
  
  // Jodit editor configuration
  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your amazing blog content here... ✨',
    height: 400,
    theme: darkMode ? 'dark' : 'default',
    toolbar: true,
    spellcheck: true,
    language: 'en',
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    beautyHTML: true
  }), [darkMode]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content: content
    });
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadFeaturedImage = async (): Promise<string | null> => {
    if (!featuredImage) return null;
    
    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(featuredImage, {
        folder: 'blog-images',
        uploadPreset: 'portfolio_projects',
        onProgress: setUploadProgress
      });
      
      if (result.success && result.url) {
        toast.success('Image uploaded successfully!');
        return result.url;
      } else {
        toast.error(result.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      toast.error('Error uploading image');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error('Please enter a blog title');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.shortDescription.trim()) {
        toast.error('Please enter a short description');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.content.trim()) {
        toast.error('Please enter blog content');
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.category) {
        toast.error('Please select a category');
        setIsSubmitting(false);
        return;
      }
      
      let imageUrl = formData.imageUrl;
      
      // Upload featured image if one is selected
      if (featuredImage) {
        const uploadedUrl = await uploadFeaturedImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setIsSubmitting(false);
          return;
        }
      }
      
      // Check if we have an image
      if (!imageUrl) {
        toast.error('Please upload a featured image');
        setIsSubmitting(false);
        return;
      }
      
      const blogData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        image: {
          url: imageUrl
        },
        tags: [] // Empty array for now, can be added later
      };
      
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      
      if (response.ok) {
        toast.success('Blog post created successfully!');
        router.push('/dashboard/blogs');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create blog post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="container mx-auto px-6 md:px-12 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Create New Blog Post
              </h1>
              <Link
                href="/dashboard/blogs"
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                Back to Blog Posts
              </Link>
            </div>
            
            <div className={`p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging blog title..."
                    className={`w-full px-4 py-3 rounded-xl text-lg ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                    required
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Short Description *
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Write a compelling summary of your blog post..."
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none`}
                    required
                  />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    This will be used as the blog preview text and meta description.
                  </p>
                </div>

                {/* Featured Image Upload */}
                <div className="space-y-4">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Featured Image *
                  </label>
                  
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Featured image preview"
                          className="w-full h-64 object-cover rounded-xl border-2 border-dashed border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFeaturedImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${imagePreview ? 'hidden' : ''}`}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="space-y-4">
                        <div className={`mx-auto w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                          <svg className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                          >
                            Choose Featured Image
                          </button>
                          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Uploading...</span>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{uploadProgress}%</span>
                        </div>
                        <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Editor */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Content *
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Rich text editor
                      </span>
                      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
                    </div>
                  </div>
                  
                  <div className={`relative ${darkMode ? 'jodit-dark' : 'jodit-light'}`}>
                    <div className="editor-wrapper">
                      <JoditEditor
                        ref={editor}
                        value={formData.content}
                        config={editorConfig}
                        onBlur={(newContent) => handleContentChange(newContent)}
                        onChange={(newContent) => handleContentChange(newContent)}
                      />
                    </div>
                    
                    {/* Editor Tips */}
                    <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
                      <div className="flex items-start space-x-2">
                        <svg className={`w-4 h-4 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="space-y-1">
                          <p className={`text-xs font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                            Pro Tips:
                          </p>
                          <ul className={`text-xs space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <li>• Use headings to structure your content</li>
                            <li>• Add images to make your blog more engaging</li>
                            <li>• Use bold and italic for emphasis</li>
                            <li>• Preview your content before publishing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category and Author Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    {isLoadingCategories ? (
                      <div className={`w-full px-4 py-3 rounded-xl ${darkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-500'
                      } border-2`}>
                        Loading categories...
                      </div>
                    ) : (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl ${darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                        } border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                    )}
                    {categories.length === 0 && !isLoadingCategories && (
                      <p className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        No categories found. Please create categories first in the Categories section.
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl ${darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                      } border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className={`flex-1 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg ${(
                      isSubmitting || isUploading
                    ) ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </div>
                    ) : (
                      'Publish Blog Post'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        title: '',
                        shortDescription: '',
                        content: '',
                        category: '',
                        imageUrl: '',
                        author: 'Muhammad Tahir'
                      });
                      setFeaturedImage(null);
                      setImagePreview('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    disabled={isSubmitting || isUploading}
                    className={`px-8 py-3 ${darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                    } border-2 rounded-xl transition-all duration-200 font-semibold ${(
                      isSubmitting || isUploading
                    ) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddBlogPage;