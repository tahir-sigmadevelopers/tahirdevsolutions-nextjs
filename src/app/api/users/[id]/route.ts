import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import bcrypt from 'bcryptjs';

// Get a single user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow users to access their own data or admins to access any data
    if (currentUser.id !== params.id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const user = await User.findById(params.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Update a user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow users to update their own data or admins to update any data
    if (currentUser.id !== params.id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    const data = await req.json();
    const { name, email, password, image, role } = data;
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Only hash and update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    // Update image if provided
    if (image) {
      // Delete old image from Cloudinary if it exists
      if (user.image?.public_id && user.image.public_id !== image.public_id) {
        await deleteFromCloudinary(user.image.public_id);
      }
      user.image = image;
    }
    
    // Only admins can update role
    if (role && currentUser.role === 'admin') {
      user.role = role;
    }
    
    await user.save();
    
    // Don't return the password
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow users to delete their own account or admins to delete any account
    if (currentUser.id !== params.id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const user = await User.findById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete user's image from Cloudinary if it exists
    if (user.image?.public_id) {
      await deleteFromCloudinary(user.image.public_id);
    }
    
    await User.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
