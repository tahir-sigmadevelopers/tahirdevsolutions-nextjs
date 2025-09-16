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
    const user: any = await getCurrentUser();
    
    await connectDB();
    
    const { name, content, company, role, imageUrl } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { message: 'Please provide testimonial content' },
        { status: 400 }
      );
    }
    
    const testimonialData: any = {
      description: content,
      user: user?.id || null,
      approved: user?.role === 'admin', // Auto-approve if admin
      name: name || '',
      company: company || '',
      role: role || '',
      imageUrl: imageUrl || ''
    };
    
    // Remove the conditional field additions and always include all fields
    /*
    if (name) testimonialData.name = name;
    if (company) testimonialData.company = company;
    if (role) testimonialData.role = role;
    if (imageUrl) testimonialData.imageUrl = imageUrl;
    */
    
    const testimonial = await Testimonial.create(testimonialData);
    
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { message: 'Failed to create testimonial', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
