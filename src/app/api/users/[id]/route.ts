import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import bcrypt from 'bcryptjs';

type Context = { params: Promise<{ id: string }> };

// ---------- Get a single user ----------
export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    if ((currentUser as any).id !== id && (currentUser as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
  }
}

// ---------- Update a user ----------
export async function PUT(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    if ((currentUser as any).id !== id && (currentUser as any).role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { name, email, password, image, role } = await req.json();

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (image) {
      if (user.image?.public_id && user.image.public_id !== image.public_id) {
        await deleteFromCloudinary(user.image.public_id);
      }
      user.image = image;
    }

    if (role && (currentUser as any).role === 'admin') {
      user.role = role;
    }

    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}

// ---------- Delete a user ----------
export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params;
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    if ((currentUser as any)?.id !== id && (currentUser as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.image?.public_id) {
      await deleteFromCloudinary(user.image.public_id);
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}
