// Database Configuration
// Replace these values with your actual database credentials

export const DATABASE_CONFIG = {
  // MongoDB Connection String
  // Replace with your actual MongoDB URI
  MONGODB_URI: 'mongodb://ghareebstar:ghareebstar@ac-0wap9o3-shard-00-00.1yetbtu.mongodb.net:27017,ac-0wap9o3-shard-00-01.1yetbtu.mongodb.net:27017,ac-0wap9o3-shard-00-02.1yetbtu.mongodb.net:27017/ghareebstar-mern-portfolio?ssl=true&replicaSet=atlas-y7ih3p-shard-0&authSource=admin&retryWrites=true&w=majority',
  
  // Database Name (optional - usually included in URI)
  DATABASE_NAME: 'ghareebstar-mern-portfolio',
  
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
  // NextAuth Secret - Replace with a random secret key
  NEXTAUTH_SECRET: 'sfjioj(&*(*&(DFFNFIFIJF)))',
  
  // NextAuth URL - Replace with your domain in production
  NEXTAUTH_URL: 'http://localhost:3000',
};

// Cloudinary Configuration (for image uploads)
export const CLOUDINARY_CONFIG = {
  // Replace with your Cloudinary credentials
  CLOUD_NAME: 'dgktdwpc8',
  API_KEY: '148794556751194',
  API_SECRET: '1CqNr7glOBRmDHftiZjfKHU41O4',
};

// Email Configuration (for contact forms)
export const EMAIL_CONFIG = {
  // Replace with your email service credentials
  SERVICE: 'gmail',
  USERNAME: 'tahirsultanofficial@gmail.com',
  PASSWORD: 'zwnajhzdgfcrfdct',
  SERVER: 'smtp.gmail.com',
};
