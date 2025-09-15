import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { getCurrentUser } from '@/lib/auth';

// Get all comments
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const blogId = url.searchParams.get('blog');
    
    if (!blogId) {
      return NextResponse.json(
        { message: 'Blog ID is required' },
        { status: 400 }
      );
    }
    
    const comments = await Comment.find({ blog: blogId, parentComment: null })
      .populate('user', 'name image')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    await connectDB();
    
    const { blog, name, email, comment, parentComment } = await req.json();
    
    if (!blog || !comment || !name || !email) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    const blogExists = await Blog.findById(blog);
    
    if (!blogExists) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Validate parent comment if provided
    if (parentComment) {
      const parentCommentExists = await Comment.findById(parentComment);
      
      if (!parentCommentExists) {
        return NextResponse.json(
          { message: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }
    
    const newComment = await Comment.create({
      blog,
      user: (currentUser as any)?.id || null,
      name,
      email,
      comment,
      parentComment: parentComment || null,
    });
    
    // Add comment to blog's comments array
    await Blog.findByIdAndUpdate(blog, {
      $push: { comments: newComment._id },
    });
    
    // Populate user data before returning
    const populatedComment = await Comment.findById(newComment._id)
      .populate('user', 'name image');
    
    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { message: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
