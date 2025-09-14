import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { getCurrentUser } from '@/lib/auth';

// Get a single comment with its replies
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const comment = await Comment.findById(params.id)
      .populate('user', 'name image');
    
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Get replies to this comment
    const replies = await Comment.find({ parentComment: params.id })
      .populate('user', 'name image')
      .sort({ createdAt: 1 });
    
    return NextResponse.json({
      comment,
      replies,
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { message: 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}

// Update a comment
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    await connectDB();
    
    const comment = await Comment.findById(params.id);
    
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if user is admin or the owner of the comment
    if (!currentUser || (currentUser.role !== 'admin' && (!comment.user || comment.user.toString() !== currentUser.id))) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const { commentText } = await req.json();
    
    if (!commentText) {
      return NextResponse.json(
        { message: 'Comment text is required' },
        { status: 400 }
      );
    }
    
    comment.comment = commentText;
    await comment.save();
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { message: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    await connectDB();
    
    const comment = await Comment.findById(params.id);
    
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if user is admin or the owner of the comment
    if (!currentUser || (currentUser.role !== 'admin' && (!comment.user || comment.user.toString() !== currentUser.id))) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    // Remove comment from blog's comments array
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: { comments: params.id },
    });
    
    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: params.id });
    
    // Delete the comment
    await Comment.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { message: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
