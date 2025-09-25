import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// Define context type for all handlers
type Context = { params: Promise<{ id: string }> };

// --------- Get a single project ---------
export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ message: 'Failed to fetch project' }, { status: 500 });
  }
}

// --------- Update a project ---------
export async function PUT(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const data = await req.json();
    const { title, description, link, category, image, featured } = data;

    if (!title || !description || !link || !category || !image?.url) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    // Delete old image if replaced
    if (project.image.public_id && project.image.public_id !== image.public_id) {
      await deleteFromCloudinary(project.image.public_id);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        link,
        category,
        image,
        featured: featured || false,
      },
      { new: true }
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ message: 'Failed to update project' }, { status: 500 });
  }
}

// --------- Delete a project ---------
export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const user = await getCurrentUser();
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Remove image from Cloudinary if present
    if (project.image.public_id) {
      await deleteFromCloudinary(project.image.public_id);
    }

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Failed to delete project' }, { status: 500 });
  }
}
