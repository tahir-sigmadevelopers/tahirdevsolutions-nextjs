'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RootState } from '@/lib/redux/store';

const ServicesPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);

  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Custom-built web applications with modern technologies to provide exceptional user experiences with responsive design and optimal performance.",
      icon: (
        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white ${
          darkMode ? 'bg-cyan-500' : 'bg-blue-500'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
      ),
      skills: ['React.js', 'Next.js', 'JavaScript', 'HTML/CSS'],
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Cross-browser Compatible'],
      link: "/contact"
    },
    {
      id: 2,
      title: "Backend Development",
      description: "Robust and scalable server-side solutions that power your applications with secure APIs and efficient database management.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        </div>
      ),
      skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
      features: ['Authentication', 'Database Design', 'API Integration', 'Security Implementation'],
      link: "/contact"
    },
    {
      id: 3,
      title: "Full-Stack Development",
      description: "End-to-end solutions that combine front-end and back-end expertise to create complete, integrated applications.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-purple-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      ),
      skills: ['MERN Stack', 'React', 'JWT', 'Context API'],
      features: ['Database Design', 'User Authentication', 'Content API', 'Admin Dashboard'],
      link: "/contact"
    },
    {
      id: 4,
      title: "E-Commerce Solutions",
      description: "Custom online shopping experiences with secure payment integration, inventory management, and user-friendly interfaces.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      ),
      skills: ['Payment Gateways', 'Shopping Cart', 'User Authentication', 'Order Processing'],
      features: ['Secure Payments', 'Inventory Management', 'User Dashboard', 'Admin Panel'],
      link: "/contact"
    },
    {
      id: 5,
      title: "Mobile App Development",
      description: "Cross-platform mobile applications that provide native-like experiences on both iOS and Android devices.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-pink-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      skills: ['React Native', 'Expo', 'Mobile UI/UX', 'Push Notifications'],
      features: ['Cross-platform', 'Native Performance', 'Offline Support', 'App Store Deployment'],
      link: "/contact"
    },
    {
      id: 6,
      title: "UI/UX Design",
      description: "Creating intuitive and visually appealing interfaces that enhance user experience and engagement with your digital products.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </div>
      ),
      skills: ['Sketch/Figma', 'Wireframing', 'Prototyping', 'Responsive Design'],
      features: ['User Research', 'Design Systems', 'Interactive Prototypes', 'Usability Testing'],
      link: "/contact"
    },
    {
      id: 7,
      title: "Performance Optimization",
      description: "Improve the speed and efficiency of your existing web applications for better user experience and higher conversion rates.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-yellow-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
      skills: ['Lazy Loading', 'Code Splitting', 'Image Optimization', 'Caching Strategies'],
      features: ['Speed Optimization', 'SEO Enhancement', 'Core Web Vitals', 'Performance Monitoring'],
      link: "/contact"
    },
    {
      id: 8,
      title: "Progressive Web Apps",
      description: "Create web applications that provide native app-like experience with offline capabilities and high performance.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-teal-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      ),
      skills: ['Service Workers', 'Push Notifications', 'App Manifest', 'Lighthouse Optimization'],
      features: ['Offline Support', 'Installable', 'Push Notifications', 'Fast Loading'],
      link: "/contact"
    },
    {
      id: 9,
      title: "DevOps & Deployment",
      description: "Streamline your development workflow with CI/CD pipelines and optimize your application deployment process.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-gray-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      ),
      skills: ['Docker', 'AWS', 'GitHub', 'Server Configuration'],
      features: ['Automated Deployment', 'Version Control', 'Server Setup', 'Performance Monitoring'],
      link: "/contact"
    },
    {
      id: 10,
      title: "CMS Development",
      description: "Create custom content management systems or extend existing ones to streamline your content creation workflow.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-red-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      ),
      skills: ['WordPress', 'Headless CMS', 'Content Entity', 'User Roles'],
      features: ['Custom Post Types', 'User Management', 'SEO Optimization', 'Multi-language Support'],
      link: "/contact"
    },
    {
      id: 11,
      title: "API Development & Integration",
      description: "Build custom APIs and integrate third-party services to extend your application's functionality and connectivity.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-cyan-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ),
      skills: ['REST APIs', 'API Authentication', 'Webhooks', 'Third-party Integration'],
      features: ['Custom Endpoints', 'Data Validation', 'Rate Limiting', 'Documentation'],
      link: "/contact"
    },
    {
      id: 12,
      title: "Website Maintenance & Support",
      description: "Ongoing technical support, regular updates, and maintenance to keep your website secure, fast, and up-to-date.",
      icon: (
        <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      ),
      skills: ['Security Updates', 'Performance Monitoring', 'Content Updates', 'Bug Fixes'],
      features: ['24/7 Monitoring', 'Regular Backups', 'Security Patches', 'Technical Support'],
      link: "/contact"
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
      {/* Hero Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              My Services
            </h1>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              I offer a comprehensive range of development services tailored to meet your specific needs. 
              From designing beautiful user interfaces to building powerful backend systems, I'm committed 
              to delivering high-quality solutions that help you achieve your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6 md:px-12">
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
                    ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-2xl hover:shadow-cyan-500/20' 
                    : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
                }`}
              >
                {/* Service Icon */}
                <div className="mb-6">
                  {service.icon}
                </div>

                {/* Service Title */}
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                  darkMode 
                    ? 'text-white group-hover:text-cyan-400' 
                    : 'text-gray-900 group-hover:text-blue-500'
                }`}>
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className={`text-sm leading-relaxed mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {service.description}
                </p>

                {/* Skills & Technologies */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    SKILLS & TECHNOLOGIES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    FEATURES
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-center text-xs ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-2 text-green-500"
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
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn More Link */}
                <div className="mt-auto">
                  <Link
                    href={service.link}
                    className={`inline-flex items-center font-medium text-sm transition-colors duration-200 ${
                      darkMode 
                        ? 'text-cyan-400 hover:text-cyan-300'
                        : 'text-blue-500 hover:text-blue-600'
                    }`}
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
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-12 rounded-3xl text-center shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 ${darkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-700'
              : 'bg-gradient-to-br from-blue-50 to-indigo-100'
              }`}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Work Together?
            </h2>
            <p className={`text-lg mb-8 max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Let's collaborate to bring your ideas to life. Whether you need a simple website or a 
              complex web application, I'm here to help you achieve your goals with high-quality 
              development services.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 text-white ${
                  darkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
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
                Contact Me
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

  
    </div>
  );
};

export default ServicesPage;
