'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RootState } from '@/lib/redux/store';
import { getTestimonials } from '@/lib/redux/slices/testimonialSlice';

const TestimonialsSection = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { testimonials, loading } = useSelector((state: RootState) => state.testimonial);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTestimonials() as any);
  }, [dispatch]);

  // Get approved testimonials only
  const approvedTestimonials = testimonials.filter(testimonial => testimonial.approved);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Client Testimonials
          </h2>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            See what our clients have to say about working with us
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-8 rounded-2xl animate-pulse ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              </motion.div>
            ))
          ) : approvedTestimonials.length > 0 ? (
            approvedTestimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group p-8 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-2xl hover:shadow-blue-500/20' 
                    : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
                }`}
              >
                {/* Client Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    {testimonial?.image?.url ? (
                      <Image
                        src={testimonial?.image?.url}
                        alt={testimonial?.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-indigo-500'][index % 5]
                      }`}>
                        {testimonial?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {testimonial?.name}
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {testimonial?.position}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial?.rating} />
                </div>

                {/* Testimonial Text */}
                <blockquote className={`text-sm leading-relaxed italic ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  "{testimonial?.message}"
                </blockquote>

                {/* Quote Icon */}
                <div className="mt-6 flex justify-end">
                  <svg
                    className={`h-8 w-8 opacity-20 ${
                      darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
              </motion.div>
            ))
          ) : (
            // No testimonials fallback
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-12"
            >
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                💬
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No Testimonials Yet
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Be the first to share your experience working with us!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-16 p-8 md:p-12 rounded-3xl text-center ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-100'
          }`}
        >
          <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Want to be our next success story?
          </h3>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join our growing list of satisfied clients and let's create something amazing together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              Start Your Project
            </motion.a>
            <motion.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${
                darkMode
                  ? 'border-gray-600 text-white hover:bg-gray-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              View Our Work
            </motion.a>
          </div>
        </motion.div>

        {/* Add Review CTA for existing clients */}
        {approvedTestimonials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className={`text-sm mb-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Worked with us before?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              Leave a Review
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
