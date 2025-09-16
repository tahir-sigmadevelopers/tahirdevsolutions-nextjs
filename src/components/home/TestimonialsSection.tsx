'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/lib/redux/store';
import { getTestimonials } from '@/lib/redux/slices/testimonialSlice';
import MarqueeTestimonials from './MarqueeTestimonials';
import Link from 'next/link';

const TestimonialsSection = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { testimonials, loading } = useSelector((state: RootState) => state.testimonial);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTestimonials({ approved: true }) as any); // Fetch only approved testimonials
  }, [dispatch]);

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

        {/* Marquee Testimonials */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className={`w-12 h-12 rounded-full animate-spin border-4 ${
                darkMode 
                  ? 'border-cyan-500 border-t-transparent' 
                  : 'border-blue-500 border-t-transparent'
              }`}></div>
            </div>
          ) : testimonials.filter((t: any) => t.approved).length > 0 ? (
            <MarqueeTestimonials />
          ) : (
            <div className={`text-center py-12 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`text-4xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
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
            </div>
          )}
        </motion.div>

        
        {/* Add Review CTA for existing clients */}
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/leave-review"
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 inline-block ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-gray-900 text-white hover:from-cyan-600 hover:to-gray-800 shadow-lg hover:shadow-cyan-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              Leave a Review
            </Link>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-16 p-8 md:p-12 rounded-3xl text-center shadow-2xl transition-all duration-300 ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 hover:shadow-cyan-500/20' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-blue-500/20'
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
              className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-white ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
              }`}
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

      </div>
    </section>
  );
};

export default TestimonialsSection;