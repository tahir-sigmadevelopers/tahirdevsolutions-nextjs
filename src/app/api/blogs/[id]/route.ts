import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// Get a single blog
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const blog = await Blog.findById(params.id)
      .populate('category', 'category')
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'user',
          select: 'name image',
        },
      });
    
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Increment share count on view
    blog.shareCount += 1;
    await blog.save();
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { message: 'Failed to fetch blog' },
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
    
    if (!user || user.role !== 'admin') {
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
    
    if (!user || user.role !== 'admin') {
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
