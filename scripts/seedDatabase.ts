import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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

// Seed data
const seedData = {
  categories: [
    { category: 'Web Development' },
    { category: 'Mobile Development' },
    { category: 'Machine Learning' },
    { category: 'DevOps' },
    { category: 'UI/UX Design' },
    { category: 'Backend Development' },
    { category: 'Frontend Development' },
    { category: 'Full Stack Development' },
    { category: 'Cloud Computing' },
    { category: 'Cybersecurity' }
  ],

  users: [
    {
      name: 'Mohammad Tahir',
      email: 'tahir@sigmadevelopers.com',
      password: 'password123',
      role: 'admin',
      image: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
      }
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      image: {
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user',
      image: {
        url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
      }
    },
    {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      role: 'user',
      image: {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      }
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'user',
      image: {
        url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      }
    }
  ],

  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce platform built with Next.js, MongoDB, and Stripe integration for seamless online shopping experience.',
      link: 'https://github.com/sigmadevelopers/ecommerce',
      category: 'Full Stack Development',
      image: {
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
      },
      featured: true
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, built using React, Node.js, and Socket.io.',
      link: 'https://github.com/sigmadevelopers/taskmanager',
      category: 'Web Development',
      image: {
        url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'
      },
      featured: true
    },
    {
      title: 'Weather Forecast Mobile App',
      description: 'React Native mobile application providing accurate weather forecasts with beautiful UI and location-based services.',
      link: 'https://github.com/sigmadevelopers/weather-app',
      category: 'Mobile Development',
      image: {
        url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop'
      },
      featured: false
    },
    {
      title: 'AI Image Recognition System',
      description: 'Machine learning project using TensorFlow and Python for advanced image recognition and classification.',
      link: 'https://github.com/sigmadevelopers/ai-image-recognition',
      category: 'Machine Learning',
      image: {
        url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop'
      },
      featured: true
    },
    {
      title: 'Cloud Infrastructure Automation',
      description: 'DevOps project implementing Infrastructure as Code using Terraform and AWS for scalable cloud deployments.',
      link: 'https://github.com/sigmadevelopers/cloud-automation',
      category: 'DevOps',
      image: {
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'
      },
      featured: false
    },
    {
      title: 'Design System Components',
      description: 'Comprehensive UI/UX design system with reusable components built in Figma and implemented in React.',
      link: 'https://github.com/sigmadevelopers/design-system',
      category: 'UI/UX Design',
      image: {
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
      },
      featured: false
    }
  ],

  testimonials: [
    {
      description: 'Working with Sigma Developers was an exceptional experience. They delivered our project on time with outstanding quality and attention to detail.'
    },
    {
      description: 'The team at Sigma Developers transformed our vision into reality. Their technical expertise and professional approach exceeded our expectations.'
    },
    {
      description: 'Highly recommend Sigma Developers for any web development project. They are responsive, skilled, and deliver excellent results.'
    },
    {
      description: 'Amazing work on our mobile app! The team was professional, communicative, and delivered exactly what we needed.'
    },
    {
      description: 'Sigma Developers helped us modernize our entire tech stack. Their knowledge of current technologies and best practices is impressive.'
    }
  ]
};

// Clear existing data
async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Blog.deleteMany({});
    await Category.deleteMany({});
    await Testimonial.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

// Seed functions
async function seedCategories() {
  try {
    const categories = await Category.insertMany(seedData.categories);
    console.log(`✅ Seeded ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    return [];
  }
}

async function seedUsers() {
  try {
    const usersWithHashedPasswords = await Promise.all(
      seedData.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Seeded ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    return [];
  }
}

async function seedProjects() {
  try {
    const projects = await Project.insertMany(seedData.projects);
    console.log(`✅ Seeded ${projects.length} projects`);
    return projects;
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    return [];
  }
}

async function seedTestimonials(users: any[]) {
  try {
    const testimonialsWithUsers = seedData.testimonials.map((testimonial, index) => ({
      ...testimonial,
      user: users[index % users.length]._id,
      approved: Math.random() > 0.3 // 70% approved
    }));
    
    const testimonials = await Testimonial.insertMany(testimonialsWithUsers);
    console.log(`✅ Seeded ${testimonials.length} testimonials`);
    return testimonials;
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
    return [];
  }
}

async function seedBlogs(categories: any[], users: any[]) {
  try {
    const blogData = [
      {
        title: 'Getting Started with Next.js 15',
        author: 'Mohammad Tahir',
        shortDescription: 'Learn the fundamentals of Next.js 15 and how to build modern web applications with the latest features.',
        content: `
          <h2>Introduction to Next.js 15</h2>
          <p>Next.js 15 brings exciting new features and improvements that make building React applications even more powerful and efficient. In this comprehensive guide, we'll explore the key features and learn how to get started.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li>Improved App Router with better performance</li>
            <li>Enhanced Server Components</li>
            <li>Better TypeScript support</li>
            <li>Optimized bundling and caching</li>
          </ul>
          
          <h3>Getting Started</h3>
          <p>To create a new Next.js 15 project, run the following command:</p>
          <pre><code>npx create-next-app@latest my-app</code></pre>
          
          <p>This will set up a new Next.js project with all the latest features and best practices.</p>
        `,
        category: categories.find(c => c.category === 'Web Development')?._id,
        image: {
          url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop'
        },
        tags: ['Next.js', 'React', 'JavaScript', 'Web Development'],
        shareCount: 45
      },
      {
        title: 'Building Scalable APIs with Node.js',
        author: 'Mohammad Tahir',
        shortDescription: 'Best practices for creating robust and scalable REST APIs using Node.js, Express, and MongoDB.',
        content: `
          <h2>Building Scalable APIs</h2>
          <p>Creating scalable APIs is crucial for modern web applications. In this article, we'll explore best practices for building robust REST APIs using Node.js.</p>
          
          <h3>Architecture Principles</h3>
          <ul>
            <li>Separation of concerns</li>
            <li>Error handling strategies</li>
            <li>Database optimization</li>
            <li>Caching mechanisms</li>
          </ul>
          
          <h3>Implementation</h3>
          <p>We'll use Express.js as our web framework and implement proper middleware for authentication, validation, and error handling.</p>
        `,
        category: categories.find(c => c.category === 'Backend Development')?._id,
        image: {
          url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
        },
        tags: ['Node.js', 'Express', 'API', 'Backend'],
        shareCount: 32
      },
      {
        title: 'Machine Learning in JavaScript',
        author: 'Mohammad Tahir',
        shortDescription: 'Explore how to implement machine learning algorithms directly in JavaScript using TensorFlow.js.',
        content: `
          <h2>Machine Learning with JavaScript</h2>
          <p>JavaScript has evolved to become a powerful platform for machine learning. With TensorFlow.js, we can now run ML models directly in the browser.</p>
          
          <h3>Getting Started with TensorFlow.js</h3>
          <p>TensorFlow.js allows you to develop ML models in JavaScript and use them in browsers or Node.js environments.</p>
          
          <h3>Use Cases</h3>
          <ul>
            <li>Image classification</li>
            <li>Natural language processing</li>
            <li>Recommendation systems</li>
            <li>Predictive analytics</li>
          </ul>
        `,
        category: categories.find(c => c.category === 'Machine Learning')?._id,
        image: {
          url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop'
        },
        tags: ['Machine Learning', 'TensorFlow.js', 'JavaScript', 'AI'],
        shareCount: 67
      },
      {
        title: 'React Native vs Flutter: A Comprehensive Comparison',
        author: 'Mohammad Tahir',
        shortDescription: 'An in-depth comparison of React Native and Flutter for cross-platform mobile development.',
        content: `
          <h2>React Native vs Flutter</h2>
          <p>Choosing the right framework for cross-platform mobile development is crucial. Let's compare React Native and Flutter across various dimensions.</p>
          
          <h3>Performance</h3>
          <p>Both frameworks offer excellent performance, but they achieve it differently. Flutter compiles to native ARM code, while React Native uses a JavaScript bridge.</p>
          
          <h3>Development Experience</h3>
          <p>React Native leverages existing React knowledge, while Flutter uses Dart programming language with its own widget system.</p>
        `,
        category: categories.find(c => c.category === 'Mobile Development')?._id,
        image: {
          url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'
        },
        tags: ['React Native', 'Flutter', 'Mobile Development', 'Cross-platform'],
        shareCount: 89
      },
      {
        title: 'DevOps Best Practices for Modern Applications',
        author: 'Mohammad Tahir',
        shortDescription: 'Essential DevOps practices for continuous integration, deployment, and infrastructure management.',
        content: `
          <h2>DevOps Best Practices</h2>
          <p>DevOps is essential for modern software development. Let's explore key practices that enable teams to deliver software faster and more reliably.</p>
          
          <h3>CI/CD Pipeline</h3>
          <p>Implementing automated testing and deployment pipelines is crucial for maintaining code quality and reducing deployment risks.</p>
          
          <h3>Infrastructure as Code</h3>
          <p>Managing infrastructure through code ensures consistency, repeatability, and version control of your infrastructure.</p>
        `,
        category: categories.find(c => c.category === 'DevOps')?._id,
        image: {
          url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop'
        },
        tags: ['DevOps', 'CI/CD', 'Infrastructure', 'Automation'],
        shareCount: 56
      }
    ];

    const blogs = await Blog.insertMany(blogData);
    console.log(`✅ Seeded ${blogs.length} blogs`);
    return blogs;
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    return [];
  }
}

async function seedComments(blogs: any[], users: any[]) {
  try {
    const commentsData = [];
    
    blogs.forEach((blog, blogIndex) => {
      // Add 2-4 comments per blog
      const commentCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < commentCount; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        commentsData.push({
          blog: blog._id,
          user: user._id,
          name: user.name,
          email: user.email,
          comment: [
            'Great article! Very informative and well-written.',
            'This helped me understand the concept much better. Thank you!',
            'Excellent tutorial. Looking forward to more content like this.',
            'Clear explanations and good examples. Keep up the good work!',
            'Very useful information. I will definitely try this in my project.',
            'Thanks for sharing your knowledge. This is exactly what I was looking for.',
            'Well explained! Could you also cover advanced topics in the next article?',
            'Perfect timing for this article. Just what I needed for my current project.'
          ][Math.floor(Math.random() * 8)],
          likes: users.slice(0, Math.floor(Math.random() * 3)).map(u => u._id),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in last 30 days
        });
      }
    });

    const comments = await Comment.insertMany(commentsData);
    
    // Update blogs with comment references
    for (const blog of blogs) {
      const blogComments = comments.filter(comment => 
        comment.blog.toString() === blog._id.toString()
      );
      blog.comments = blogComments.map(comment => comment._id);
      await blog.save();
    }
    
    console.log(`✅ Seeded ${comments.length} comments`);
    return comments;
  } catch (error) {
    console.error('❌ Error seeding comments:', error);
    return [];
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearDatabase();
    
    // Seed in correct order due to dependencies
    const categories = await seedCategories();
    const users = await seedUsers();
    const projects = await seedProjects();
    const testimonials = await seedTestimonials(users);
    const blogs = await seedBlogs(categories, users);
    const comments = await seedComments(blogs, users);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Blogs: ${blogs.length}`);
    console.log(`   - Comments: ${comments.length}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Seeding interrupted');
  await mongoose.disconnect();
  process.exit(0);
});

// Run the seeding script
seedDatabase();