'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CLOUDINARY_CONFIG } from '@/config/database';

const AddProjectPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null as File | null,
    imagePreview: '',
    liveUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const validateAndSetImage = (file: File) => {
    // Reset previous errors
    setImageError('');
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setImageError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setImageError('Image file size must be less than 10MB');
      return;
    }
    
    setFormData({
      ...formData,
      image: file
    });
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      imagePreview: previewUrl
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetImage(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: ''
    });
    setImageError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'portfolio_projects'); // Your custom preset - now configured!
    
    try {
      console.log('Uploading to Cloudinary:', {
        cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
        uploadPreset: 'portfolio_projects',
        fileSize: file.size,
        fileType: file.type
      });
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      console.log('Cloudinary response status:', response.status);
      
      const responseText = await response.text();
      console.log('Cloudinary response:', responseText);
      
      if (!response.ok) {
        let errorMessage = 'Failed to upload image';
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error && errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(`Upload failed: ${errorMessage}`);
      }
      
      const data = JSON.parse(responseText);
      console.log('Upload successful:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Set user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('upload_preset')) {
          setImageError('Upload configuration error. Please contact administrator.');
        } else if (error.message.includes('network')) {
          setImageError('Network error. Please check your connection and try again.');
        } else {
          setImageError(`Upload failed: ${error.message}`);
        }
      } else {
        setImageError('An unexpected error occurred during upload.');
      }
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (formData.image) {
        setUploadingImage(true);
        imageUrl = await uploadImageToCloudinary(formData.image);
        setUploadingImage(false);
      }
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image: { url: imageUrl },
        link: formData.liveUrl,
        featured: false
      };
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (response.ok) {
        router.push('/dashboard/projects');
        router.refresh();
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      <div className="container mx-auto px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Add New Project
            </h1>
            <Link
              href="/dashboard/projects"
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              Back to Projects
            </Link>
          </div>
          
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                ></textarea>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Image
                </label>
                <div className="space-y-4">
                  {/* Drag and Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
                      dragActive
                        ? darkMode
                          ? 'border-cyan-400 bg-cyan-900/20'
                          : 'border-blue-400 bg-blue-50'
                        : darkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={!formData.imagePreview}
                    />
                    <div className="text-center">
                      <div className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="mt-4">
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          PNG, JPG, WebP or GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {imageError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                      <p className="text-sm">{imageError}</p>
                    </div>
                  )}

                  {/* Image Preview */}
                  {formData.imagePreview && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Preview:
                        </p>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowImageModal(true)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${
                              darkMode
                                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            Full Size
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                          <img
                            src={formData.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain hover:object-cover transition-all duration-300 cursor-pointer"
                            onClick={() => setShowImageModal(true)}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setShowImageModal(true)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-black bg-opacity-50 text-white rounded-lg"
                            >
                              Click to enlarge
                            </button>
                          </div>
                        </div>
                        
                        {/* Image Info */}
                        {formData.image && (
                          <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>File: {formData.image.name}</p>
                            <p>Size: {formatFileSize(formData.image.size)}</p>
                            <p>Type: {formData.image.type}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Demo URL
                </label>
                <input
                  type="url"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                  placeholder="https://your-demo-url.com"
                  className={`w-full px-4 py-2 rounded-lg ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${darkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                  } text-white shadow-lg ${
                    (isSubmitting || uploadingImage) ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {uploadingImage ? 'Uploading Image...' : isSubmitting ? 'Saving Project...' : 'Save Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({
                    title: '',
                    description: '',
                    category: '',
                    image: null,
                    imagePreview: '',
                    liveUrl: ''
                  })}
                  className={`px-6 py-2 ${darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                  } rounded-lg transition-colors`}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Full Size Image Modal */}
      {showImageModal && formData.imagePreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={formData.imagePreview}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {formData.image && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-sm">
                  <span className="font-medium">{formData.image.name}</span> • 
                  {formatFileSize(formData.image.size)} • 
                  {formData.image.type}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProjectPage;