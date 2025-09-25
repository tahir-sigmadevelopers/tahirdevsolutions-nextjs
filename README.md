# Tahir Dev  - Next.js 15 Portfolio Website

A modern portfolio website built with Next.js 15, featuring a blog, project showcase, and admin dashboard.

## Features

- Responsive design with Tailwind CSS
- Dark/Light mode toggle
- Server-side rendering with Next.js 15
- MongoDB database integration
- Authentication with NextAuth.js
- Admin dashboard for content management
- Blog with categories and comments
- Project showcase
- Testimonials
- Contact form
- File uploads with Cloudinary

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **File Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- MongoDB database
- Cloudinary account
- SMTP server for emails

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tahir-sigmadevelopers/tahirdevsolutions-nextjs.git
   cd tahirdevsolutions-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the required environment variables (see `.env.example`).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
tahirdev-nextjs/
├── public/             # Static assets
├── src/
│   ├── app/            # App router pages
│   ├── components/     # React components
│   ├── lib/            # Utility functions
│   │   ├── db.ts       # Database connection
│   │   ├── auth.ts     # Authentication utilities
│   │   ├── cloudinary.ts # File upload utilities
│   │   └── redux/      # Redux store and slices
│   └── models/         # Mongoose models
├── .env.local          # Environment variables (create this)
├── .env.example        # Example environment variables
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── vercel.json         # Vercel deployment configuration
```

## Deployment

The project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

Make sure to add all the required environment variables in the Vercel dashboard.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Vercel](https://vercel.com/)