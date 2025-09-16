'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

interface Testimonial {
  _id: string;
  name?: string;
  description: string;
  role?: string;
  company?: string;
  imageUrl?: string;
  user?: {
    name: string;
    image?: {
      url?: string;
    };
  };
  approved: boolean;
}

const MarqueeTestimonials = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { testimonials } = useSelector((state: RootState) => state.testimonial);
  
  // Get approved testimonials only
  const approvedTestimonials = testimonials.filter((testimonial: Testimonial) => testimonial.approved);
  
  // Duplicate testimonials to create seamless loop
  const duplicatedTestimonials = [...approvedTestimonials, ...approvedTestimonials];

  // Star rating component
  const StarRating = ({ rating = 5 }: { rating?: number }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
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
    <div className="py-12 overflow-hidden">
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className={`absolute top-0 left-0 h-full w-20 z-10 ${
          darkMode ? 'bg-gradient-to-r from-gray-900' : 'bg-gradient-to-r from-white'
        }`}></div>
        <div className={`absolute top-0 right-0 h-full w-20 z-10 ${
          darkMode ? 'bg-gradient-to-l from-gray-900' : 'bg-gradient-to-l from-white'
        }`}></div>
        
        {/* Marquee container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex w-max"
            animate={{ x: ['-25%', '-75%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial._id}-${index}`} 
                className="mx-4 flex-shrink-0 w-80"
              >
                <div className={`h-full p-6 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-2xl hover:shadow-cyan-500/20' 
                    : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
                }`}>
                  {/* Client Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      {testimonial?.imageUrl ? (
                        <Image
                          src={testimonial?.imageUrl}
                          alt={testimonial?.name || 'Client'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : testimonial?.user?.image?.url ? (
                        <Image
                          src={testimonial?.user?.image?.url}
                          alt={testimonial?.user?.name || 'Client'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500', 'bg-indigo-500'][index % 5]
                        }`}>
                          {(testimonial?.name || testimonial?.user?.name || 'C')?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {testimonial?.name || testimonial?.user?.name || 'Anonymous'}
                      </h4>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {testimonial?.role || 'Client'}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-3">
                    <StarRating />
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className={`text-sm leading-relaxed italic line-clamp-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    "{testimonial?.description}"
                  </blockquote>

                  {/* Company */}
                  {testimonial?.company && (
                    <p className={`text-xs mt-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {testimonial?.company}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeTestimonials;