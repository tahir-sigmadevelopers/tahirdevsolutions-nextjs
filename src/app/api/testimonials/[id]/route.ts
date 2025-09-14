import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { getCurrentUser } from '@/lib/auth';

// Get a single testimonial
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const testimonial = await Testimonial.findById(params.id)
      .populate('user', 'name image');
    
    if (!testimonial) {
      return NextResponse.json(
        { message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// Update a testimonial
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
    
    const testimonial = await Testimonial.findById(params.id);
    
    if (!testimonial) {
      return NextResponse.json(
        { message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    const { description, approved } = await req.json();
    
    if (!description) {
      return NextResponse.json(
        { message: 'Please provide a testimonial description' },
        { status: 400 }
      );
    }
    
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      {
        description,
        approved: approved !== undefined ? approved : testimonial.approved,
      },
      { new: true }
    );
    
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// Delete a testimonial
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const testimonial = await Testimonial.findById(params.id);
    
    if (!testimonial) {
      return NextResponse.json(
        { message: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    // Check if user is admin or the owner of the testimonial
    if (!user || (user.role !== 'admin' && (!testimonial.user || testimonial.user.toString() !== user.id))) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    await Testimonial.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
