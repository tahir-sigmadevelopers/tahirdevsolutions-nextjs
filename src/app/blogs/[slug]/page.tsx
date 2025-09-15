'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  author: string;
  category: {
    _id: string;
    category: string;
  };
  image: {
    url: string;
    public_id?: string;
  };
  tags: string[];
  createdAt: string;
  shareCount: number;
  comments: any[];
}

interface Comment {
  _id: string;
  content: string;
  author: {
    name: string;
    image?: {
      url: string;
    };
  };
  createdAt: string;
}

const BlogDetailPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const params = useParams();
  const blogSlug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (blogSlug) {
      fetchBlogData();
    }
  }, [blogSlug]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching blog with slug:', blogSlug);
      
      // Fetch blog details by slug
      const blogResponse = await fetch(`/api/blogs/${blogSlug}`);
      console.log('📡 Blog API response status:', blogResponse.status);
      
      if (!blogResponse.ok) {
        const errorData = await blogResponse.text();
        console.error('❌ Blog API error:', errorData);
        throw new Error('Blog not found');
      }
      
      const blogData = await blogResponse.json();
      console.log('✅ Blog data received:', { title: blogData.title, slug: blogData.slug });
      setBlog(blogData);
      
      // Fetch comments
      const commentsResponse = await fetch(`/api/comments?blogId=${blogData._id}`);
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
        console.log('💬 Comments loaded:', commentsData.length);
      }
      
      // Fetch related blogs
      if (blogData.category) {
        const relatedResponse = await fetch(`/api/blogs?category=${blogData.category._id}&limit=3`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedBlogs(relatedData.blogs.filter((b: Blog) => b._id !== blogData._id));
          console.log('🔗 Related blogs loaded:', relatedData.blogs.length);
        }
      }
      
    } catch (error: any) {
      console.error('💥 Error fetching blog:', error);
      setError(error.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = blog?.title || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        } catch (err) {
          toast.error('Failed to copy link');
        }
        setIsSharing(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Update share count
      try {
        await fetch(`/api/blogs/${blogSlug}/share`, { method: 'POST' });
        if (blog) {
          setBlog({ ...blog, shareCount: blog.shareCount + 1 });
        }
      } catch (error) {
        console.error('Error updating share count:', error);
      }
    }
    
    setTimeout(() => setIsSharing(false), 1000);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          blogId: blog?._id,
        }),
      });
      
      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
        toast.success('Comment added successfully!');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {error || 'Blog not found'}
          </h1>
          <Link
            href="/blogs"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className={`${darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition-colors`}
                  >
                    Home
                  </Link>
                </li>
                <li className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className={`${darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600'} transition-colors`}
                  >
                    Blogs
                  </Link>
                </li>
                <li className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {blog.title.length > 50 ? blog.title.substring(0, 50) + '...' : blog.title}
                </li>
              </ol>
            </motion.nav>

            {/* Article Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {blog.category?.category || 'Technology'}
                </span>
              </div>

              {/* Title */}
              <h1 className={`text-4xl md:text-5xl font-bold leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {blog.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {blog.author}
                    </p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Author
                    </p>
                  </div>
                </div>
                
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>

                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{calculateReadTime(blog.content)} min read</span>
                  </div>
                </div>

                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>{blog.shareCount} shares</span>
                  </div>
                </div>
              </div>
            </motion.header>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={blog.image?.url || '/blog.webp'}
                alt={blog.title}
                width={1200}
                height={600}
                className="w-full h-[400px] md:h-[500px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              {/* Article Content */}
              <article className={`prose prose-lg max-w-none ${
                darkMode 
                  ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-green-400' 
                  : 'prose-gray prose-a:text-green-600'
              }`}>
                <div
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  className="leading-relaxed"
                />
              </article>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors cursor-pointer`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700"
              >
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Share this article
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Twitter', icon: '🐦', platform: 'twitter' },
                    { name: 'Facebook', icon: '📘', platform: 'facebook' },
                    { name: 'LinkedIn', icon: '💼', platform: 'linkedin' },
                    { name: 'Copy Link', icon: '🔗', platform: 'copy' }
                  ].map((social) => (
                    <button
                      key={social.platform}
                      onClick={() => handleShare(social.platform)}
                      disabled={isSharing}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-white hover:bg-gray-50 text-gray-700'
                      } shadow-md hover:shadow-lg disabled:opacity-50`}
                    >
                      <span>{social.icon}</span>
                      <span>{social.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Comments Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-16"
              >
                <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Comments ({comments.length})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-12">
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Add a comment
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.length === 0 ? (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className={`p-6 rounded-xl ${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        } shadow-md`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {comment.author.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {comment.author.name}
                              </h4>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.section>
            </motion.main>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1 space-y-8"
            >
              {/* Table of Contents */}
              <div className={`sticky top-8 p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  <Link
                    href="#content"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
                    }`}
                  >
                    Article Content
                  </Link>
                  <Link
                    href="#comments"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-green-400' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'
                    }`}
                  >
                    Comments ({comments.length})
                  </Link>
                </nav>
              </div>

              {/* Related Articles */}
              {relatedBlogs.length > 0 && (
                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                      <Link
                        key={relatedBlog._id}
                        href={`/blogs/${relatedBlog.slug}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <Image
                            src={relatedBlog.image?.url || '/blog.webp'}
                            alt={relatedBlog.title}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium mb-1 line-clamp-2 group-hover:text-green-500 transition-colors ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {relatedBlog.title}
                            </h4>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {formatDate(relatedBlog.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className={`p-6 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 text-white`}>
                <h3 className="text-lg font-semibold mb-4">
                  Stay Updated
                </h3>
                <p className="text-sm mb-4 opacity-90">
                  Get the latest articles and insights delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-200 ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-white hover:bg-gray-100 text-gray-900'
        } hover:shadow-xl`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

export default BlogDetailPage;