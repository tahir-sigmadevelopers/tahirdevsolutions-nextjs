import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { getCurrentUser } from '@/lib/auth';

type Context = { params: Promise<{ id: string }> };

// -------- Get a single testimonial --------
export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    await connectDB();

    const testimonial = await Testimonial.findById(id).populate('user', 'name image');
    if (!testimonial) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json({ message: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// -------- Update a testimonial --------
export async function PUT(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    const { name, content, company, role, imageUrl, description, approved } = await req.json();
    const testimonialDescription = content || description;
    if (!testimonialDescription) {
      return NextResponse.json({ message: 'Please provide a testimonial description' }, { status: 400 });
    }

    const updateData: any = {
      description: testimonialDescription,
      approved: approved ?? testimonial.approved,
      name: name ?? testimonial.name,
      company: company ?? testimonial.company,
      role: role ?? testimonial.role,
      imageUrl: imageUrl ?? testimonial.imageUrl,
    };

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedTestimonial);
  } catch (error: any) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to update testimonial', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// -------- Delete a testimonial --------
export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const user: any = await getCurrentUser();
    await connectDB();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    // Only admin or owner can delete
    if (!user || (user.role !== 'admin' && testimonial.user?.toString() !== user.id)) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to delete testimonial', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
