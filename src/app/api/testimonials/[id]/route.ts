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
    const user: any = await getCurrentUser();
    
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
    
    const { name, content, company, role, imageUrl, description, approved } = await req.json();
    
    // Use content if provided, otherwise fallback to description for backward compatibility
    const testimonialDescription = content || description;
    
    if (!testimonialDescription) {
      return NextResponse.json(
        { message: 'Please provide a testimonial description' },
        { status: 400 }
      );
    }
    
    const updateData: any = {
      description: testimonialDescription,
      approved: approved !== undefined ? approved : testimonial.approved,
      name: name !== undefined ? name : testimonial.name,
      company: company !== undefined ? company : testimonial.company,
      role: role !== undefined ? role : testimonial.role,
      imageUrl: imageUrl !== undefined ? imageUrl : testimonial.imageUrl,
    };
    
    // Remove the conditional field additions
    /*
    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (role !== undefined) updateData.role = role;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    */
    
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );
    
    return NextResponse.json(updatedTestimonial);
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to update testimonial', error: error.message || 'Unknown error' },
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
    const user: any = await getCurrentUser();
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
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to delete testimonial', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}