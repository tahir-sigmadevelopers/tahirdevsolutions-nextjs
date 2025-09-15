import mongoose from 'mongoose';
import { DATABASE_CONFIG } from '../src/config/database';
import Blog from '../src/models/Blog';
import { generateSlug, generateUniqueSlug } from '../src/lib/utils/slug';

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

async function addSlugsToExistingBlogs() {
  try {
    console.log('🔄 Adding slugs to existing blog posts...\n');
    
    // Find all blogs without slugs
    const blogs = await Blog.find({ 
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });
    
    console.log(`Found ${blogs.length} blogs without slugs`);
    
    if (blogs.length === 0) {
      console.log('✅ All blogs already have slugs!');
      return;
    }
    
    // Function to check if slug exists
    const slugExists = async (slug: string): Promise<boolean> => {
      const existingBlog = await Blog.findOne({ slug });
      return !!existingBlog;
    };
    
    let updatedCount = 0;
    
    for (const blog of blogs) {
      try {
        // Generate base slug from title
        const baseSlug = generateSlug(blog.title);
        
        // Generate unique slug
        const uniqueSlug = await generateUniqueSlug(baseSlug, slugExists);
        
        // Update the blog with the new slug
        await Blog.findByIdAndUpdate(blog._id, { slug: uniqueSlug });
        
        console.log(`✅ Updated: "${blog.title}" -> "${uniqueSlug}"`);
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Error updating blog "${blog.title}":`, error);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} blogs with slugs!`);
    
  } catch (error) {
    console.error('❌ Error adding slugs to blogs:', error);
  }
}

async function main() {
  await connectDB();
  await addSlugsToExistingBlogs();
  
  console.log('\n✅ Migration completed!');
  process.exit(0);
}

// Run the migration
main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});