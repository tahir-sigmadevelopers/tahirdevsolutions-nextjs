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
import { SEOAnalyzer, SEOAnalysisResult } from '@/lib/utils/seoAnalyzer';

// Dynamic import for JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const EditBlogPage = ({ params }: { params: { id: string } }) => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
    category: '',
    imageUrl: '',
    author: 'Muhammad Tahir',
    primaryKeyword: ''
  });
  
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<{_id: string, category: string}[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
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
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [showSeoAnalysis, setShowSeoAnalysis] = useState(false);

  // Fetch categories and blog data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        } else {
          console.error('Failed to fetch categories');
        }
        
        // Fetch blog data
        const blogResponse = await fetch(`/api/blogs/${params.id}`);
        if (blogResponse.ok) {
          const blogData = await blogResponse.json();
          setFormData({
            title: blogData.title || '',
            shortDescription: blogData.shortDescription || '',
            content: blogData.content || '',
            category: blogData.category?._id || blogData.category || '',
            imageUrl: blogData.image?.url || '',
            author: blogData.author || 'Muhammad Tahir',
            primaryKeyword: ''
          });
          setImagePreview(blogData.image?.url || '');
        } else {
          console.error('Failed to fetch blog data');
          toast.error('Failed to load blog data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data');
      } finally {
        setIsLoadingCategories(false);
        setIsLoadingBlog(false);
      }
    };
    
    fetchData();
  }, [params.id]);
  
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
    if (!featuredImage) return formData.imageUrl;
    
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
  
  const analyzeSEO = () => {
    if (!formData.title || !formData.shortDescription || !formData.content) {
      toast.error('Please fill in title, description, and content to analyze SEO');
      return;
    }

    const analyzer = new SEOAnalyzer(
      formData.title,
      formData.shortDescription,
      formData.content,
      {
        primaryKeyword: formData.primaryKeyword,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-')
      }
    );

    const analysis = analyzer.analyze();
    setSeoAnalysis(analysis);
    setShowSeoAnalysis(true);
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
        }
      };
      
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      
      if (response.ok) {
        toast.success('Blog post updated successfully!');
        router.push('/dashboard/blogs');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingBlog) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
        <div className="container mx-auto px-6 md:px-12 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
                Edit Blog Post
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
                {/* Primary Keyword */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Primary Keyword (for SEO)
                  </label>
                  <input
                    type="text"
                    name="primaryKeyword"
                    value={formData.primaryKeyword}
                    onChange={handleChange}
                    placeholder="Enter your primary keyword..."
                    className={`w-full px-4 py-3 rounded-xl ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200`}
                  />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enter your main keyword for SEO analysis
                  </p>
                </div>

                {/* SEO Analysis Button */}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={analyzeSEO}
                    className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors ${!formData.title || !formData.shortDescription || !formData.content ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!formData.title || !formData.shortDescription || !formData.content}
                  >
                    Analyze SEO
                  </button>
                  
                  {seoAnalysis && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      seoAnalysis.score >= 80 
                        ? 'bg-green-100 text-green-800' 
                        : seoAnalysis.score >= 60 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      SEO Score: {seoAnalysis.score}/100
                    </div>
                  )}
                </div>

                {/* SEO Analysis Results */}
                {showSeoAnalysis && seoAnalysis && (
                  <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        SEO Analysis Results
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowSeoAnalysis(!showSeoAnalysis)}
                        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      >
                        <svg className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <h4 className="font-medium mb-2">Overall Score</h4>
                        <div className="flex items-center">
                          <div className="w-16 h-16 relative">
                            <svg className="w-16 h-16" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={darkMode ? "#374151" : "#e5e7eb"}
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={
                                  seoAnalysis.score >= 80 
                                    ? "#10B981" 
                                    : seoAnalysis.score >= 60 
                                      ? "#F59E0B" 
                                      : "#EF4444"
                                }
                                strokeWidth="3"
                                strokeDasharray={`${seoAnalysis.score}, 100`}
                              />
                              <text x="18" y="20.5" textAnchor="middle" fill={darkMode ? "#fff" : "#000"} fontSize="8" fontWeight="bold">
                                {seoAnalysis.score}
                              </text>
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {seoAnalysis.score >= 80 
                                ? 'Excellent' 
                                : seoAnalysis.score >= 60 
                                  ? 'Good' 
                                  : 'Needs Improvement'}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Based on 8 SEO factors
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                        <h4 className="font-medium mb-2">Quick Stats</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Title Length</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {seoAnalysis.details.title.length} chars
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Meta Description</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {seoAnalysis.details.metaDescription.length} chars
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Keyword Density</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {seoAnalysis.details.keyword.density.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Readability</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                              {seoAnalysis.details.readability.grade}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {seoAnalysis.issues.length > 0 && (
                      <div className="mb-6">
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Issues Found ({seoAnalysis.issues.length})
                        </h4>
                        <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {seoAnalysis.issues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {seoAnalysis.recommendations.length > 0 && (
                      <div>
                        <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Recommendations
                        </h4>
                        <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {seoAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
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
                        Updating...
                      </div>
                    ) : (
                      'Update Blog Post'
                    )}
                  </button>
                  
                  <Link
                    href="/dashboard/blogs"
                    className={`px-8 py-3 text-center ${darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                    } border-2 rounded-xl transition-all duration-200 font-semibold hover:shadow-md`}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditBlogPage;