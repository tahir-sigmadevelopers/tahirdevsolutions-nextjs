'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RootState } from '@/lib/redux/store';

const ServicesSection = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);

  const services = [
    {
      id: 1,
      title: "Buy Fixing & Debugging",
      description: "We offer top-notch web development services with cutting-edge technologies to bring your ideas to life.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
          01
        </div>
      ),
      features: ["React & Next.js", "Node.js & Express", "MongoDB & PostgreSQL", "API Development"],
      learnMore: "#"
    },
    {
      id: 2,
      title: "Landing Page Design",
      description: "Beautiful and responsive landing page designs that convert visitors into customers with modern UI/UX.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-purple-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
      ),
      features: ["Responsive Design", "Modern UI/UX", "Fast Loading", "SEO Optimized"],
      learnMore: "#"
    },
    {
      id: 3,
      title: "Full Stack Web Apps",
      description: "Complete web applications with modern frontend and robust backend solutions for your business needs.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      ),
      features: ["MERN Stack", "Authentication", "Database Design", "API Integration"],
      learnMore: "#"
    },
    {
      id: 4,
      title: "REST API Development",
      description: "Scalable and secure REST APIs built with Node.js, Express, and modern database technologies.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      features: ["RESTful APIs", "JWT Authentication", "Rate Limiting", "API Documentation"],
      learnMore: "#"
    },
    {
      id: 5,
      title: "NEXT API Development",
      description: "Modern Next.js API routes with server-side rendering and optimal performance for your applications.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-yellow-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
      features: ["Next.js 13+", "Server Components", "Edge Runtime", "TypeScript"],
      learnMore: "#"
    },
    {
      id: 6,
      title: "E-Commerce Development",
      description: "Complete e-commerce solutions with payment integration, inventory management, and admin dashboards.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-pink-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      ),
      features: ["Shopping Cart", "Payment Gateway", "Order Management", "Admin Panel"],
      learnMore: "#"
    },
    {
      id: 7,
      title: "Progressive Web Apps",
      description: "Build fast, reliable Progressive Web Apps that work offline and provide native app-like experience.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      features: ["Offline Support", "Push Notifications", "App-like Experience", "Fast Loading"],
      learnMore: "#"
    },
    {
      id: 8,
      title: "UX/UI Design",
      description: "User-centered design approach to create intuitive interfaces that enhance user experience and engagement.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-teal-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
      ),
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      learnMore: "#"
    },
    {
      id: 9,
      title: "Website Design & Optimization",
      description: "Comprehensive website optimization for better performance, SEO, and user experience across all devices.",
      icon: (
        <div className="h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      ),
      features: ["Performance Optimization", "SEO Optimization", "Mobile Responsive", "Analytics Setup"],
      learnMore: "#"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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
            Services I Offer
          </h2>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Specialized solutions to help you business grow and succeed in the digital world
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group p-8 rounded-2xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-2xl hover:shadow-blue-500/20' 
                  : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
              }`}
            >
              {/* Service Icon */}
              <div className="mb-6">
                {service.icon}
              </div>

              {/* Service Title */}
              <h3 className={`text-xl font-bold mb-4 group-hover:text-blue-500 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {service.title}
              </h3>

              {/* Service Description */}
              <p className={`text-sm leading-relaxed mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {service.description}
              </p>

              {/* Service Features */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learn More Link */}
              <div className="mt-auto">
                <Link
                  href={service.learnMore}
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <h3 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to transform your ideas into reality?
          </h3>
          <p className={`text-lg mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Let's work together to build something amazing
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
