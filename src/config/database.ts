// Database Configuration
// Uses environment variables for security

export const DATABASE_CONFIG = {
  // MongoDB Connection String
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://ghareebstar:ghareebstar@ac-0wap9o3-shard-00-00.1yetbtu.mongodb.net:27017,ac-0wap9o3-shard-00-01.1yetbtu.mongodb.net:27017,ac-0wap9o3-shard-00-02.1yetbtu.mongodb.net:27017/tahirdevsolutions?ssl=true&replicaSet=atlas-y7ih3p-shard-0&authSource=admin&retryWrites=true&w=majority',
  
  // Database Name
  DATABASE_NAME: process.env.DATABASE_NAME || 'tahirdevsolutions',
  
  // Connection Options
  OPTIONS: {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

// NextAuth Configuration
export const AUTH_CONFIG = {
  // NextAuth Secret
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'sfjioj(&*(*&(DFFNFIFIJF)))',
  
  // NextAuth URL
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

// Cloudinary Configuration (for image uploads)
export const CLOUDINARY_CONFIG = {
  // Cloudinary credentials
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dkywvlpkj',
  API_KEY: process.env.CLOUDINARY_API_KEY || '136987479159238',
  API_SECRET: process.env.CLOUDINARY_API_SECRET || 'iEmsLEbLwN4sCCIt5TeCzF14x1c',
};

// Email Configuration (for contact forms)
export const EMAIL_CONFIG = {
  // Email service credentials
  SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  USERNAME: process.env.EMAIL_USERNAME || 'tahirsultanofficial@gmail.com',
  PASSWORD: process.env.EMAIL_PASSWORD || 'zwnajhzdgfcrfdct',
  SERVER: process.env.EMAIL_SERVER || 'smtp.gmail.com',
};
