import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { getCurrentUser } from '@/lib/auth';

// Define the correct type for the context
type Context = { params: Promise<{ id: string }> };

// ---------- Get a single comment with its replies ----------
export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    await connectDB();

    const comment = await Comment.findById(id).populate('user', 'name image');

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    const replies = await Comment.find({ parentComment: id })
      .populate('user', 'name image')
      .sort({ createdAt: 1 });

    return NextResponse.json({ comment, replies });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json({ message: 'Failed to fetch comment' }, { status: 500 });
  }
}

// ---------- Update a comment ----------
export async function PUT(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const currentUser = await getCurrentUser();
    await connectDB();

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    // Check if user is admin or owner
    if (
      !currentUser ||
      ((currentUser as any).role !== 'admin' &&
        (!comment.user || comment.user.toString() !== (currentUser as any).id))
    ) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { commentText } = await req.json();
    if (!commentText) {
      return NextResponse.json({ message: 'Comment text is required' }, { status: 400 });
    }

    comment.comment = commentText;
    await comment.save();

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ message: 'Failed to update comment' }, { status: 500 });
  }
}

// ---------- Delete a comment ----------
export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const currentUser = await getCurrentUser();
    await connectDB();

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (
      !currentUser ||
      ((currentUser as any).role !== 'admin' &&
        (!comment.user || comment.user.toString() !== (currentUser as any).id))
    ) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    // Remove comment from blog's comments array
    await Blog.findByIdAndUpdate(comment.blog, { $pull: { comments: id } });

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: id });

    // Delete the comment itself
    await Comment.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'Failed to delete comment' }, { status: 500 });
  }
}