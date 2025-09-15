'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
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
  content?: string;
  comment?: string;
  user?: {
    _id: string;
    name: string;
    image?: {
      url: string;
    };
  };
  name?: string;
  email?: string;
  createdAt: string;
}

const BlogDetailPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const params = useParams();
  const blogId = params.id as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlogData();
    }
  }, [blogId]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching blog with identifier:', blogId);
      
      // Fetch blog details by ID or slug
      const blogResponse = await fetch(`/api/blogs/${blogId}`);
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
      const commentsResponse = await fetch(`/api/comments?blog=${blogData._id}`);
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
        await fetch(`/api/blogs/${blogId}/share`, { method: 'POST' });
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
    
    // Validate required fields
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    if (!commentName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!commentEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(commentEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setSubmittingComment(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog: blog?._id,
          name: commentName.trim(),
          email: commentEmail.trim(),
          comment: newComment.trim(),
        }),
      });
      
      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
        setCommentName('');
        setCommentEmail('');
        toast.success('Comment added successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribing(true);
    try {
      // Mock newsletter subscription - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
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

  const extractHeadings = (content: string) => {
    const headingRegex = /<h([1-6]).*?id=["'](.*?)["'].*?>(.*?)<\/h[1-6]>/gi;
    const headings: { level: number; id: string; text: string }[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3].replace(/<[^>]+>/g, ''), // Remove HTML tags
      });
    }
    
    return headings;
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
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Breadcrumb Navigation */}
      <section className="pt-24 pb-4">
        <div className="container mx-auto px-6 md:px-12">
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2 text-sm mb-6"
          >
            <Link href="/" className={`hover:text-green-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Home
            </Link>
            <span className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>→</span>
            <Link href="/blogs" className={`hover:text-green-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Blog
            </Link>
            <span className={`${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>→</span>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
              {blog.category?.category}
            </span>
          </motion.nav>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="lg:w-3/4">
            {/* Article Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                  {blog.category?.category}
                </span>
              </div>

              {/* Title */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  
                  <img className='w-14 h-14 rounded-full bg-gradient-to-r flex items-center justify-center' src="/tahir - about.png" alt="" />
               
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {blog.author}
                    </p>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>{formatDate(blog.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{calculateReadTime(blog.content)} min read</span>
                      <span className="mx-2">•</span>
                      <span>{blog.shareCount} shares</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.header>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 -mx-6 md:mx-0"
            >
              <div className="relative overflow-hidden rounded-none md:rounded-2xl">
                <Image
                  src={blog.image?.url || '/blog.webp'}
                  alt={blog.title}
                  width={1200}
                  height={600}
                  className="w-full h-[300px] md:h-[500px] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`prose prose-lg lg:prose-xl max-w-none ${darkMode 
                ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-green-400' 
                : 'prose-gray prose-a:text-green-600'
              }`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="leading-relaxed"
              />
            </motion.div>

            {/* Enhanced Share & Engagement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border border-green-100 dark:border-gray-600"
            >
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Found this helpful?
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Share it with your network!
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
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
                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                      darkMode 
                        ? 'bg-gray-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
                    } disabled:opacity-50`}
                  >
                    <span className="text-lg">{social?.icon}</span>
                    <span>{social?.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16"
            >
              <h3 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Your name *"
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      placeholder="Your email *"
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts... *"
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim() || !commentName.trim() || !commentEmail.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-gray-900 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className={`text-4xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>💬</div>
                    <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      No comments yet
                    </h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Be the first to share your thoughts!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {comment?.user?.image?.url ? (
                            <Image
                              src={comment.user.image.url}
                              alt={comment.user.name || comment.name || 'User'}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(comment?.user?.name || comment?.name)?.charAt(0).toUpperCase() || 'A'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {comment?.user?.name || comment?.name || 'Anonymous'}
                            </h4>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(comment?.createdAt)}
                            </span>
                          </div>
                          <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {comment?.comment || comment?.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-24 space-y-8">
              {/* Author Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-cyan-500/30">
                    <Image
                      src="/tahir - about.png"
                      alt="Muhammad Tahir"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {blog.author}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Full-stack developer passionate about sharing knowledge.
                  </p>
                </div>
              </motion.div>

              {/* Newsletter Subscription */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-gray-900 text-white shadow-lg"
              >
                <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                <p className="text-cyan-100 mb-4 text-sm">
                  Get the latest articles delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full px-4 py-2 bg-white text-cyan-700 font-medium rounded-lg hover:bg-cyan-50 hover:text-cyan-800 hover:shadow-md hover:scale-105 transform transition-all duration-300 text-sm disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </motion.div>

              {/* Related Articles */}
              {relatedBlogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={relatedBlog.image?.url || '/blog.webp'}
                              alt={relatedBlog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium text-sm line-clamp-2 group-hover:text-green-500 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {relatedBlog.title}
                            </h4>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formatDate(relatedBlog.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: readingProgress > 10 ? 1 : 0, scale: readingProgress > 10 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg transition-all duration-200 z-40 ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-white hover:bg-gray-100 text-gray-900'
        } hover:shadow-xl hover:scale-110`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

export default BlogDetailPage;
