import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/auth';

// Get all users (admin only)
export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Users API: Starting request');
    
    const currentUser = await getCurrentUser();
    console.log('👤 Current user:', currentUser ? { id: (currentUser as any).id, role: (currentUser as any).role } : 'No user found');
    
    if (!currentUser) {
      console.log('❌ Users API: No authenticated user');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    if ((currentUser as any).role !== 'admin') {
      console.log('❌ Users API: User is not admin, role:', (currentUser as any).role);
      return NextResponse.json(
        { message: 'Not authorized - admin access required' },
        { status: 403 }
      );
    }
    
    console.log('🔗 Users API: Connecting to database');
    await connectDB();
    
    console.log('📊 Users API: Fetching users');
    const users = await User.find()
      .select('-password')
      .sort({ joinedAt: -1 });
      
    console.log(`✅ Users API: Found ${users.length} users`);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('❌ Users API Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}