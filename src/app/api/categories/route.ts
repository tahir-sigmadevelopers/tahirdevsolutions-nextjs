import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/auth';

// Get all categories
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const categories = await Category.find().sort({ category: 1 });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { name, description } = await req.json();
    
    if (!name) {
      return NextResponse.json(
        { message: 'Please provide a category name' },
        { status: 400 }
      );
    }
    
    const existingCategory = await Category.findOne({ category: name });
    
    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category already exists' },
        { status: 400 }
      );
    }
    
    const newCategory = await Category.create({ 
      category: name,
      description: description || '' 
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Failed to create category', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}