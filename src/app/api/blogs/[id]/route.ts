import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import mongoose from 'mongoose';

// Get a single blog by ID or slug
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 API: Starting blog fetch for identifier:', params.id);
    await connectDB();
    console.log('✅ API: Database connected');
    
    const identifier = params.id;
    let blog;
    
    // Check if the identifier is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      console.log('🔍 API: Searching by ObjectId:', identifier);
      // Try to find by ID first
      blog = await Blog.findById(identifier)
        .populate('category', 'category');
      console.log('📊 API: ObjectId search result:', blog ? 'Found' : 'Not found');
    }
    
    // If not found by ID or not a valid ObjectId, try to find by slug
    if (!blog) {
      console.log('🔍 API: Searching by slug:', identifier);
      blog = await Blog.findOne({ slug: identifier })
        .populate('category', 'category');
      console.log('📊 API: Slug search result:', blog ? 'Found' : 'Not found');
    }
    
    if (!blog) {
      console.log('❌ API: Blog not found for identifier:', identifier);
      
      // Let's check what blogs exist in the database
      const allBlogs = await Blog.find({}).select('title slug _id').limit(5);
      console.log('📋 API: Available blogs:', allBlogs.map(b => ({ id: b._id, slug: b.slug, title: b.title })));
      
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ API: Blog found:', { id: blog._id, title: blog.title, slug: blog.slug });
    
    // Increment view count (share count tracks views)
    blog.shareCount = (blog.shareCount || 0) + 1;
    await blog.save();
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('❌ API: Error fetching blog:', error);
    return NextResponse.json(
      { message: 'Failed to fetch blog', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Update a blog
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    const data = await req.json();
    const { title, author, shortDescription, category, content, image, tags } = data;
    
    if (!title || !shortDescription || !category || !content || !image?.url) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // If image is changed, delete old image from Cloudinary
    if (blog.image.public_id && blog.image.public_id !== image.public_id) {
      await deleteFromCloudinary(blog.image.public_id);
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      {
        title,
        author: author || blog.author,
        shortDescription,
        category,
        content,
        image,
        tags: tags || blog.tags,
      },
      { new: true }
    );
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { message: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// Delete a blog
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Delete image from Cloudinary
    if (blog.image.public_id) {
      await deleteFromCloudinary(blog.image.public_id);
    }
    
    await Blog.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { message: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
