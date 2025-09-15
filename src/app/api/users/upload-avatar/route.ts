import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from '@/config/database';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
  api_key: CLOUDINARY_CONFIG.API_KEY,
  api_secret: CLOUDINARY_CONFIG.API_SECRET,
});

// Upload user avatar
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Please upload an image file' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Image size should be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'profile-avatars',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const cloudinaryResult = uploadResponse as any;

    // Get current user to check for existing avatar
    const user = await User.findById((currentUser as any).id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Delete old avatar from Cloudinary if exists
    if (user.image?.public_id) {
      try {
        await deleteFromCloudinary(user.image.public_id);
      } catch (error) {
        console.warn('Failed to delete old avatar:', error);
        // Don't fail the upload if old image deletion fails
      }
    }

    // Update user with new avatar
    const updatedUser = await User.findByIdAndUpdate(
      (currentUser as any).id,
      {
        image: {
          public_id: cloudinaryResult.public_id,
          url: cloudinaryResult.secure_url,
        },
      },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      message: 'Avatar uploaded successfully',
      imageUrl: cloudinaryResult.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { message: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}