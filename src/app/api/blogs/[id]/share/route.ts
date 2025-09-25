import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const { id: identifier } = resolvedParams;
    let blog;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      blog = await Blog.findById(identifier);
    }

    if (!blog) {
      blog = await Blog.findOne({ slug: identifier });
    }

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    blog.shareCount = (blog.shareCount || 0) + 1;
    await blog.save();

    return NextResponse.json({
      message: 'Share count updated',
      shareCount: blog.shareCount,
    });
  } catch (error) {
    console.error('Error updating share count:', error);
    return NextResponse.json(
      { message: 'Failed to update share count' },
      { status: 500 }
    );
  }
}