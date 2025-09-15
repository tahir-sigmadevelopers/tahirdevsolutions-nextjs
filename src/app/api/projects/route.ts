import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { getCurrentUser } from '@/lib/auth';

// Get all projects
export async function GET(req: NextRequest) {
  try {
    console.log('🚀 Projects API: Starting request');
    console.log('🔍 Projects API: Request URL:', req.url);
    
    await connectDB();
    console.log('🔗 Projects API: Database connected');
    
    const url = new URL(req.url);
    const featured = url.searchParams.get('featured');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    console.log('🔍 Projects API: Query params:', { featured, page, limit, skip });
    
    let query: any = {};
    
    if (featured === 'true') {
      query.featured = true;
      console.log('🌟 Projects API: Filtering for featured projects');
    }
    
    console.log('📊 Projects API: Database query:', query);
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments(query);
    
    console.log(`✅ Projects API: Found ${projects.length} projects (total: ${total})`);
    if (featured === 'true') {
      console.log('🌟 Projects API: Featured projects:', projects.map(p => ({ title: p.title, featured: p.featured })));
    }
    
    const response = {
      projects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
    
    console.log('📤 Projects API: Sending response:', {
      projectCount: response.projects.length,
      pagination: response.pagination,
      query
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Projects API Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch projects', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Create a new project
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
    
    const data = await req.json();
    const { title, description, link, category, image, featured } = data;
    
    if (!title || !description || !link || !category || !image?.url) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    const project = await Project.create({
      title,
      description,
      link,
      category,
      image,
      featured: featured || false,
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { message: 'Failed to create project' },
      { status: 500 }
    );
  }
}
