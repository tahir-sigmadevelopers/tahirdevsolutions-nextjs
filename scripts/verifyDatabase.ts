import mongoose from 'mongoose';
import { DATABASE_CONFIG } from '../src/config/database';

// Import models
import User from '../src/models/User';
import Project from '../src/models/Project';
import Blog from '../src/models/Blog';
import Category from '../src/models/Category';
import Testimonial from '../src/models/Testimonial';
import Comment from '../src/models/Comment';

const MONGODB_URI = DATABASE_CONFIG.MONGODB_URI;

// Connect to database
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, DATABASE_CONFIG.OPTIONS);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function verifyData() {
  try {
    console.log('🔍 Verifying seeded data...\n');
    
    // Count documents in each collection
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const blogCount = await Blog.countDocuments();
    const categoryCount = await Category.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();
    const commentCount = await Comment.countDocuments();
    
    console.log('📊 Database Contents:');
    console.log(`   - Categories: ${categoryCount}`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Projects: ${projectCount}`);
    console.log(`   - Testimonials: ${testimonialCount}`);
    console.log(`   - Blogs: ${blogCount}`);
    console.log(`   - Comments: ${commentCount}\n`);
    
    // Show sample data
    console.log('🎯 Sample Data:\n');
    
    // Categories
    const categories = await Category.find().limit(3);
    console.log('📂 Categories:');
    categories.forEach(cat => console.log(`   - ${cat.category}`));
    
    // Users
    const users = await User.find().select('name email role').limit(3);
    console.log('\n👥 Users:');
    users.forEach(user => console.log(`   - ${user.name} (${user.email}) - ${user.role}`));
    
    // Projects
    const projects = await Project.find().select('title category featured').limit(3);
    console.log('\n🚀 Projects:');
    projects.forEach(project => console.log(`   - ${project.title} (${project.category}) ${project.featured ? '⭐' : ''}`));
    
    // Blogs with categories
    const blogs = await Blog.find().populate('category').select('title author category').limit(3);
    console.log('\n📝 Blogs:');
    blogs.forEach(blog => console.log(`   - ${blog.title} by ${blog.author} (Category: ${blog.category?.category || 'N/A'})`));
    
    // Testimonials with users
    const testimonials = await Testimonial.find().populate('user').select('description user approved').limit(3);
    console.log('\n💬 Testimonials:');
    testimonials.forEach(testimonial => {
      const userName = testimonial.user?.name || 'Anonymous';
      const status = testimonial.approved ? '✅ Approved' : '⏳ Pending';
      console.log(`   - "${testimonial.description.substring(0, 50)}..." by ${userName} (${status})`);
    });
    
    // Comments with blog titles
    const comments = await Comment.find().populate('blog user').select('comment blog user').limit(3);
    console.log('\n💭 Comments:');
    comments.forEach(comment => {
      const blogTitle = comment.blog?.title || 'Unknown Blog';
      const userName = comment.user?.name || 'Anonymous';
      console.log(`   - "${comment.comment.substring(0, 40)}..." by ${userName} on "${blogTitle}"`);
    });
    
    console.log('\n✅ Data verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Main function
async function main() {
  await connectDB();
  await verifyData();
}

// Run the verification script
main();