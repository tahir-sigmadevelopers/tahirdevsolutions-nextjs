/**
 * Enhanced Cloudinary Upload Utility
 * Provides better error handling and fallback options
 */

import { CLOUDINARY_CONFIG } from '@/config/database';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  publicId?: string;
}

export const uploadToCloudinary = async (
  file: File,
  options: {
    uploadPreset?: string;
    folder?: string;
    transformation?: string;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<UploadResult> => {
  const {
    uploadPreset = 'portfolio_projects',
    folder = 'portfolio',
    transformation,
    onProgress
  } = options;

  // Validate file
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please use JPEG, PNG, WebP, or GIF.'
    };
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'File size too large. Maximum size is 10MB.'
    };
  }

  // Validate Cloudinary config
  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    return {
      success: false,
      error: 'Cloudinary configuration is missing. Please check your settings.'
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  if (folder) {
    formData.append('folder', folder);
  }
  
  if (transformation) {
    formData.append('transformation', transformation);
  }

  try {
    console.log('🚀 Starting Cloudinary upload:', {
      cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
      uploadPreset,
      folder,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type
    });

    const xhr = new XMLHttpRequest();
    
    return new Promise<UploadResult>((resolve) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          
          if (xhr.status === 200 && response.secure_url) {
            console.log('✅ Upload successful:', response.secure_url);
            resolve({
              success: true,
              url: response.secure_url,
              publicId: response.public_id
            });
          } else {
            console.error('❌ Upload failed:', response);
            let errorMessage = 'Upload failed';
            
            if (response.error) {
              errorMessage = response.error.message || response.error;
              
              // Provide specific error messages
              if (errorMessage.includes('upload_preset')) {
                errorMessage = `Upload preset "${uploadPreset}" not found. Please create it in your Cloudinary dashboard.`;
              } else if (errorMessage.includes('Invalid image file')) {
                errorMessage = 'Invalid image file. Please try a different image.';
              } else if (errorMessage.includes('File size too large')) {
                errorMessage = 'File size is too large. Please use an image smaller than 10MB.';
              }
            }
            
            resolve({
              success: false,
              error: errorMessage
            });
          }
        } catch (parseError) {
          console.error('❌ Failed to parse response:', parseError);
          resolve({
            success: false,
            error: 'Invalid response from upload service'
          });
        }
      });

      xhr.addEventListener('error', () => {
        console.error('❌ Network error during upload');
        resolve({
          success: false,
          error: 'Network error. Please check your connection and try again.'
        });
      });

      xhr.addEventListener('timeout', () => {
        console.error('❌ Upload timeout');
        resolve({
          success: false,
          error: 'Upload timeout. Please try again with a smaller file.'
        });
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`);
      xhr.timeout = 60000; // 60 seconds timeout
      xhr.send(formData);
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
};

// Legacy function for backward compatibility
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const result = await uploadToCloudinary(file);
  
  if (!result.success) {
    throw new Error(result.error || 'Upload failed');
  }
  
  return result.url!;
};