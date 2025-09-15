'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RootState } from '@/lib/redux/store';

const HeroSection = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { scrollY } = useScroll();
  
  // Parallax effect values
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Array of catchy taglines for developers
  const catchyLines = [
    "Transforming ideas into exceptional digital experiences with clean code and innovative solutions.",
    "Crafting pixel-perfect interfaces that convert visitors into loyal customers.",
    "Building scalable web solutions that grow with your business needs.",
    "Turning complex problems into elegant, efficient code that drives results.",
    "Creating seamless user experiences that keep your customers coming back."
  ];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const originalText = catchyLines[currentLineIndex];
  const [displayedText, setDisplayedText] = useState(originalText);

  // Change the tagline every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLineIndex((prevIndex) => (prevIndex + 1) % catchyLines.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [catchyLines.length]);

  // Update displayed text when original text changes or on resize
  useEffect(() => {
    const handleResize = () => {
      const newText = window.innerWidth <= 768 ? catchyLines[currentLineIndex].substring(0, 120) + "..." : catchyLines[currentLineIndex];
      setDisplayedText(newText);
    };

    // Set initial text
    handleResize();

    // Update text on window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [catchyLines, currentLineIndex]);

  return (
    <section
      className={`${
        darkMode
          ? "bg-black"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      } overflow-hidden min-h-screen flex items-center pt-20`}
    >
      <motion.div 
        style={{ opacity }}
        className="w-full px-6 md:px-8 lg:px-12 py-24 md:py-36 lg:py-40 relative"
      >
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 10, -10, 0],
              y: [0, -10, 10, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut" 
            }}
            className="absolute top-10 left-10 w-64 h-64 bg-cyan-400 dark:bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30"
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              x: [0, -15, 15, 0],
              y: [0, 15, -15, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-0 right-10 w-72 h-72 bg-cyan-300 dark:bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-25"
          />
          <motion.div 
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              x: [0, 20, -20, 0],
              y: [0, -20, 20, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 30,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-10 left-20 w-72 h-72 bg-cyan-200 dark:bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-25"
          />
          <motion.div 
            animate={{ 
              scale: [1, 0.9, 1],
              x: [0, -10, 10, 0],
              y: [0, 10, -10, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 22,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-20 right-20 w-60 h-60 bg-cyan-300 dark:bg-cyan-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30"
          />
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-between relative z-10 gap-8 lg:gap-12">
          {/* Left Content */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-3/5 text-center lg:text-left mb-12 lg:mb-0"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Hi, I'm{" "}
              <motion.span 
                className={`text-transparent bg-clip-text inline-block ${
                  darkMode 
                    ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500'
                    : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
                }`}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
                style={{ 
                  backgroundSize: "200% auto"
                }}
              >
                MERN Specialist
              </motion.span>
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`mt-4 text-xl md:text-2xl font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <span>Crafting pixel-perfect interfaces that convert visitors into loyal customers.</span>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`mt-6 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {displayedText}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/projects"
                  className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-white ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                  }`}
                >
                  View Projects
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-900 border border-cyan-500 text-cyan-300 hover:bg-gray-800 hover:shadow-cyan-500/30"
                      : "bg-white text-gray-800 border hover:bg-gray-50 hover:shadow-gray-300/30"
                  }`}
                >
                  Get In Touch
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Social proof badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <div className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"} shadow-sm`}>
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                <span>2.5+ Years Experience</span>
              </div>
              <div className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"} shadow-sm`}>
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span>50+ Projects Completed</span>
              </div>
              <div className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${darkMode ? "bg-gray-900 border border-gray-700" : "bg-white"} shadow-sm`}>
                <span className="h-2 w-2 rounded-full bg-cyan-300"></span>
                <span>MERN Stack Expert</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.02, rotate: 1 }}
            className="relative group w-full lg:w-1/2 flex justify-center"
          >
            {/* Animated Gradient Glow Behind Image */}
            <motion.div 
              animate={{ 
                background: darkMode ? [
                  "linear-gradient(to tr, rgba(0, 240, 255, 0.4), rgba(34, 211, 238, 0.3), rgba(103, 232, 249, 0.2))",
                  "linear-gradient(to tr, rgba(34, 211, 238, 0.4), rgba(103, 232, 249, 0.3), rgba(0, 240, 255, 0.2))",
                  "linear-gradient(to tr, rgba(103, 232, 249, 0.4), rgba(0, 240, 255, 0.3), rgba(34, 211, 238, 0.2))",
                  "linear-gradient(to tr, rgba(0, 240, 255, 0.4), rgba(34, 211, 238, 0.3), rgba(103, 232, 249, 0.2))"
                ] : [
                  "linear-gradient(to tr, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.2), rgba(244, 114, 182, 0.2))",
                  "linear-gradient(to tr, rgba(168, 85, 247, 0.3), rgba(244, 114, 182, 0.2), rgba(59, 130, 246, 0.2))",
                  "linear-gradient(to tr, rgba(244, 114, 182, 0.3), rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))",
                  "linear-gradient(to tr, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.2), rgba(244, 114, 182, 0.2))"
                ]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute inset-0 rounded-3xl blur-2xl opacity-70 group-hover:opacity-90 transition"
            ></motion.div>

            {/* Hero Image with enhanced shadow */}
            <motion.div
              className="relative z-10 rounded-3xl shadow-xl object-cover w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto transition duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                boxShadow: darkMode ? 
                  "0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 10px 20px -10px rgba(0, 240, 255, 0.4)" : 
                  "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -10px rgba(59, 130, 246, 0.3)"
              }}
            >
              <Image
                src="/tahir.png"
                alt="Muhammad Tahir - Full Stack Developer"
                width={500}
                height={600}
                className="w-full h-auto"
                priority
              />
            </motion.div>

            {/* Floating Glass Badge (Experience) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-6 -right-6 px-6 py-3 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-800/70 shadow-lg z-20 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md ${
                  darkMode 
                    ? 'bg-gradient-to-r from-cyan-500 to-gray-900'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold">Available for Hire</p>
                  <p className="text-sm opacity-75">Full Stack Dev</p>
                </div>
              </div>
            </motion.div>

            {/* Tech Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -top-6 -left-6 px-5 py-2 rounded-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/70 shadow-lg z-20 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    darkMode ? 'text-cyan-400' : 'text-blue-500'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">MERN + Webflow</span>
              </div>
            </motion.div>
            
            {/* New badge - Years of experience */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              className="absolute top-1/2 -right-6 px-4 py-2 rounded-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/70 shadow-lg z-20 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                  darkMode ? 'text-cyan-300' : 'text-purple-500'
                }`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">2.5+ Years</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>


    </section>
  );
};

export default HeroSection;
