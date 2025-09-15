# 🔧 Configuration Guide - Database & Services Setup

This guide shows you where to put your database and service credentials directly in the project files instead of using environment variables.

## 📂 Main Configuration File

### Location: `src/config/database.ts`

This is the **MAIN FILE** where you need to update all your credentials:

```typescript
// Database Configuration
export const DATABASE_CONFIG = {
  // 🗄️ REPLACE THIS with your MongoDB connection string
  MONGODB_URI: 'mongodb://your-username:your-password@your-cluster-url/your-database-name',
  
  // 📊 Database name (usually included in the URI above)
  DATABASE_NAME: 'your-database-name',
  
  // ⚙️ Connection settings (you can leave these as-is)
  OPTIONS: {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

// 🔐 Authentication Configuration
export const AUTH_CONFIG = {
  // 🔑 REPLACE THIS with a random secret key for JWT tokens
  NEXTAUTH_SECRET: 'your-random-secret-key-here',
  
  // 🌐 REPLACE THIS with your domain (keep localhost:3000 for development)
  NEXTAUTH_URL: 'http://localhost:3000',
};

// 📸 Image Upload Configuration (Cloudinary)
export const CLOUDINARY_CONFIG = {
  // 🖼️ REPLACE THESE with your Cloudinary credentials
  CLOUD_NAME: 'dkywvlpkj',
  API_KEY: '136987479159238',
  API_SECRET: 'iEmsLEbLwN4sCCIt5TeCzF14x1c',
};

// 📧 Email Configuration (for contact forms and password reset)
export const EMAIL_CONFIG = {
  // 📮 REPLACE THESE with your email service credentials
  SERVICE: 'gmail',
  USERNAME: 'tahirsultanofficial@gmail.com',
  PASSWORD: 'zwnajhzdgfcrfdct',
  SERVER: 'smtp.gmail.com',
};
```

## 🔍 What You Need to Update

### 1. 🗄️ MongoDB Database (REQUIRED)
```typescript
MONGODB_URI: 'mongodb://username:password@cluster-url/database-name'
```
**Where to get this:**
- MongoDB Atlas: Database → Connect → Connect your application
- Local MongoDB: `mongodb://localhost:27017/your-database-name`

### 2. 🔑 NextAuth Secret (REQUIRED)
```typescript
NEXTAUTH_SECRET: 'your-random-secret-key'
```
**How to generate:**
- Use any random string generator
- Example: `openssl rand -base64 32` (in terminal)
- Or use: https://generate-secret.vercel.app/32

### 3. 📧 Email Configuration (OPTIONAL - for contact forms)
```typescript
EMAIL_CONFIG: {
  USERNAME: 'your-email@gmail.com',
  PASSWORD: 'your-app-password',
}
```
**For Gmail:**
1. Enable 2-factor authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use the generated password (not your regular password)

### 4. 🖼️ Cloudinary (OPTIONAL - for image uploads)
```typescript
CLOUDINARY_CONFIG: {
  CLOUD_NAME: 'your-cloud-name',
  API_KEY: 'your-api-key',
  API_SECRET: 'your-api-secret',
}
```
**Where to get this:**
- Cloudinary Dashboard → Settings → Account

## 🚀 Quick Setup Steps

### Step 1: Update Database Connection
1. Open `src/config/database.ts`
2. Replace `MONGODB_URI` with your actual MongoDB connection string
3. Save the file

### Step 2: Update NextAuth Secret
1. In the same file, replace `NEXTAUTH_SECRET` with a random secret
2. Save the file

### Step 3: Test the Connection
```bash
npm run dev
```
The MongoDB error should now be resolved!

## 📁 Files That Were Updated

These files now use the configuration instead of environment variables:

1. **`src/lib/db.ts`** - Database connection
2. **`src/app/api/auth/[...nextauth]/route.ts`** - Authentication
3. **`src/app/api/auth/forgot-password/route.ts`** - Email functionality

## 🔧 Troubleshooting

### MongoDB Connection Issues:
- ✅ Check your connection string format
- ✅ Ensure your IP is whitelisted in MongoDB Atlas
- ✅ Verify username/password are correct
- ✅ Check if database name exists

### Authentication Issues:
- ✅ Ensure NEXTAUTH_SECRET is set
- ✅ Check if the secret is long enough (32+ characters)

### Email Issues (if using contact forms):
- ✅ Use App Password, not regular password for Gmail
- ✅ Enable 2-factor authentication first
- ✅ Check spam folder for test emails

## 🎯 Current Configuration Status

✅ **Database**: Direct configuration in `src/config/database.ts`  
✅ **Authentication**: Direct configuration  
✅ **Email**: Direct configuration  
✅ **No Environment Variables**: Everything is in project files  

## 🔒 Security Note

**For Production:** Consider using environment variables or secure secret management services. This direct configuration method is mainly for development and testing purposes.

---

**Need help?** Check the configuration file at `src/config/database.ts` and update the values marked with "REPLACE THIS" comments.
