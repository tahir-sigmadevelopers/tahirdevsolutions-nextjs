import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const identifier = params.id;
    let blog;
    
    // Check if the identifier is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      // Try to find by ID first
      blog = await Blog.findById(identifier);
    }
    
    // If not found by ID or not a valid ObjectId, try to find by slug
    if (!blog) {
      blog = await Blog.findOne({ slug: identifier });
    }
    
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Increment share count
    blog.shareCount = (blog.shareCount || 0) + 1;
    await blog.save();
    
    return NextResponse.json({ 
      message: 'Share count updated',
      shareCount: blog.shareCount 
    });
  } catch (error) {
    console.error('Error updating share count:', error);
    return NextResponse.json(
      { message: 'Failed to update share count' },
      { status: 500 }
    );
  }
}