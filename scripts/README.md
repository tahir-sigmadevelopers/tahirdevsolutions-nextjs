# Database Seeding Scripts

This directory contains scripts to seed and verify the database with sample data for the Sigma Developers portfolio website.

## Scripts

### 1. seedDatabase.ts
Seeds the database with comprehensive sample data including:
- **Categories** (10 items): Web Development, Mobile Development, Machine Learning, etc.
- **Users** (5 items): Admin and regular users with hashed passwords
- **Projects** (6 items): Featured and regular projects with detailed descriptions
- **Blogs** (5 items): Technical articles with rich content and proper category associations
- **Testimonials** (5 items): Client testimonials linked to users
- **Comments** (12 items): Comments on blog posts with user associations

### 2. verifyDatabase.ts
Verifies that the seeded data was inserted correctly and displays a summary of the database contents.

## Usage

### Seed the Database
```bash
npm run seed
```

### Verify Seeded Data
```bash
npm run verify:db
```

### Alternative Development Command
```bash
npm run seed:dev
```

## Sample Data Details

### Users
- **Admin User**: Mohammad Tahir (tahir@sigmadevelopers.com)
- **Regular Users**: John Doe, Jane Smith, Alex Johnson, Sarah Wilson
- **Password**: All users have the password "password123" (hashed with bcrypt)

### Projects
- E-Commerce Platform (Featured)
- Task Management App (Featured)
- Weather Forecast Mobile App
- AI Image Recognition System (Featured)
- Cloud Infrastructure Automation
- Design System Components

### Categories
- Web Development
- Mobile Development
- Machine Learning
- DevOps
- UI/UX Design
- Backend Development
- Frontend Development
- Full Stack Development
- Cloud Computing
- Cybersecurity

### Blogs
- Getting Started with Next.js 15
- Building Scalable APIs with Node.js
- Machine Learning in JavaScript
- React Native vs Flutter: A Comprehensive Comparison
- DevOps Best Practices for Modern Applications

## Features

### Data Relationships
- Blogs are properly linked to categories
- Comments are associated with both blogs and users
- Testimonials are linked to users
- All foreign key relationships are maintained

### Realistic Content
- Rich HTML content for blog posts
- Professional project descriptions
- Authentic user testimonials
- Meaningful comments with user interactions

### Data Integrity
- Passwords are properly hashed using bcrypt
- Random like counts and share counts for realistic metrics
- Mixed approval status for testimonials
- Proper date distribution for created content

## Database Structure

The seeding follows the established Mongoose schema relationships:

```
Users ←→ Testimonials
Users ←→ Comments
Categories ←→ Blogs
Blogs ←→ Comments
```

## Cleanup

The seeding script automatically clears existing data before inserting new sample data to ensure a clean state. This includes:
- All existing users, projects, blogs, categories, testimonials, and comments are removed
- Fresh sample data is inserted with proper relationships
- Database indexes and constraints are preserved

## Security Notes

- Sample passwords are hashed using bcrypt with salt rounds of 12
- Email addresses use example domains
- All sensitive data uses placeholder values
- Database connection uses existing configuration from `/src/config/database.ts`

## Troubleshooting

### Connection Issues
Ensure your MongoDB connection string is properly configured in `/src/config/database.ts`

### Permission Issues
Make sure your database user has read/write permissions for the specified database

### TypeScript Issues
The scripts use `tsx` to run TypeScript files directly. If you encounter issues, ensure the tsx package is installed:
```bash
npm install tsx --save-dev
```

## Extending the Seed Data

To add more sample data:

1. Edit `seedDatabase.ts`
2. Add new items to the respective `seedData` object
3. Modify the seeding functions if needed
4. Run the seed script to apply changes

The script is designed to be idempotent - you can run it multiple times safely.