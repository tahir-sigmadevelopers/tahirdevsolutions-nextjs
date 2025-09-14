import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { getCurrentUser } from '@/lib/auth';

// Get all testimonials
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const approved = url.searchParams.get('approved');
    
    let query = {};
    
    if (approved === 'true') {
      query = { approved: true };
    }
    
    const testimonials = await Testimonial.find(query)
      .populate('user', 'name image')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// Create a new testimonial
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    await connectDB();
    
    const { description } = await req.json();
    
    if (!description) {
      return NextResponse.json(
        { message: 'Please provide a testimonial description' },
        { status: 400 }
      );
    }
    
    const testimonial = await Testimonial.create({
      description,
      user: user?.id || null,
      approved: user?.role === 'admin', // Auto-approve if admin
    });
    
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
