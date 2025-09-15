import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { getCurrentUser } from '@/lib/auth';
import { generateSlug, generateUniqueSlug } from '@/lib/utils/slug';

// Get all blogs
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (category) {
      query = { category };
    }
    
    const blogs = await Blog.find(query)
      .populate('category', 'category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments(query);
    
    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// Create a new blog
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const data = await req.json();
    const { title, author, shortDescription, category, content, image, tags } = data;
    
    if (!title || !shortDescription || !category || !content || !image?.url) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Generate unique slug from title
    const baseSlug = generateSlug(title);
    const slug = await generateUniqueSlug(baseSlug, async (slug: string) => {
      const existingBlog = await Blog.findOne({ slug });
      return !!existingBlog;
    });
    
    const blog = await Blog.create({
      title,
      slug,
      author: author || user.name,
      shortDescription,
      category,
      content,
      image,
      tags: tags || [],
    });
    
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { message: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
