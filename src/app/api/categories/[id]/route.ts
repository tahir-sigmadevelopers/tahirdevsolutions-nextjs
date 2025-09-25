import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Blog from '@/models/Blog';
import { getCurrentUser } from '@/lib/auth';

// ---------- Types ----------
type Context = { params: Promise<{ id: string }> };

// ---------- Get a single category ----------
export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    await connectDB();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ message: 'Failed to fetch category' }, { status: 500 });
  }
}

// ---------- Update a category ----------
export async function PUT(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const { category } = await req.json();
    if (!category) {
      return NextResponse.json({ message: 'Please provide a category name' }, { status: 400 });
    }

    const existing = await Category.findById(id);
    if (!existing) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const updated = await Category.findByIdAndUpdate(id, { category }, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}

// ---------- Delete a category ----------
export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Block deletion if category is used in any blogs
    const inUse = await Blog.countDocuments({ category: id });
    if (inUse > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category that is in use' },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
  }
}
