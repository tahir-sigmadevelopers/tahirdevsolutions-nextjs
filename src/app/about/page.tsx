'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { RootState } from '@/lib/redux/store';

const AboutPage = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);

  const skills = [
    { name: 'Webflow', level: 95 },
    { name: 'React.js', level: 95 },
    { name: 'Next.js', level: 90 },
    { name: 'Node.js', level: 88 },
    { name: 'Express.js', level: 85 },
    { name: 'MongoDB', level: 82 },
    { name: 'Firebase', level: 80 },
    { name: 'Tailwind CSS', level: 92 },
    { name: 'Bootstrap', level: 88 },
    { name: 'React Native', level: 75 },
    { name: 'Django', level: 70 },
    { name: 'REST APIs', level: 90 },
    { name: 'Git/GitHub', level: 85 },
    { name: 'Vercel/Netlify/Render', level: 88 },
    { name: 'JWT Authentication', level: 85 },
    { name: 'Cloudinary', level: 80 }
  ];

  const softSkills = [
    {
      title: 'Team Communication',
      description: 'Effective collaboration with cross-functional teams to achieve project goals and deliver quality solutions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h8z" />
        </svg>
      )
    },
    {
      title: 'Problem Solving',
      description: 'Analytical thinking and creative approaches to tackle complex technical challenges and find optimal solutions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Time Management',
      description: 'Efficiently managing multiple projects and deadlines while maintaining high-quality standards and meeting client expectations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Adaptability',
      description: 'Quick learning and adaptation to new technologies, frameworks, and methodologies in the ever-evolving tech landscape.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  const education = [
    {
      degree: 'Bachelor of Computer Science',
      institution: 'Bahauddin Zakariya University Multan of Pakistan - BZU',
      period: '2021 - 2025',
      description: 'Focused on Software Engineering, Web Development, App Development, Algorithms, OA, Networking, cyber security, and Data Structures.'
    },
    {
      degree: 'Full Stack Web Development',
      institution: 'Self-Taught & Online Courses',
      period: '2021 - 2023',
      description: 'Comprehensive training in MongoDB, Express, React, and Node.js development from youtube and github started from documentation.'
    },
    {
      degree: 'React Native Mobile Development',
      institution: 'Specialized Training',
      period: '2022 - 2023',
      description: 'Specialized training in building cross-platform mobile applications with React Native from youtube and google. Having experience in React so helped me to learn React Native quickly.'
    },
    {
      degree: 'Next.JS - Web Development',
      institution: 'Next.js Website Development',
      period: '2023 - 2024',
      description: 'Specialized training in building websites with Next.js from youtube and google. Existing experience in React so helped me to learn Next.js quickly. Learned from documentation.'
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
    hidden: { opacity: 0, y: 20 },
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
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-cyan-500/10`}>
        <div className="container mx-auto px-6 md:px-12 shadow-lg transition-all py-20 duration-300 rounded-xl hover:shadow-cyan-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
             Who Am I ?
            </h1>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Passionate developer crafting digital experiences that make a difference
            </p>
          </motion.div>

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative  transition-all duration-300 rounded-full"
            >
              <div className="relative w-80 h-80 mx-auto">
                {/* Gradient background */}
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${darkMode
                  ? 'bg-gradient-to-br from-cyan-500 via-cyan-400 to-cyan-600'
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                  }`}></div>

                {/* Profile image */}
                <div className="relative w-full h-full rounded-full  hover:shadow-cyan-500/30 overflow-hidden border-4 border-white/20 shadow-2xl">
                  <Image
                    src="/tahir - about.png"
                    alt="Muhammad Tahir"
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 
              w-48  px-2 py-3 rounded-full text-center font-semibold shadow-lg text-white
              ${darkMode
                      ? 'bg-gradient-to-l from-gray-900 to-cyan-600'
                      : 'bg-blue-500'}`}
                >
                  MERN + WebFlow
                </motion.div>

              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 transition-all duration-300 rounded-xl p-6 "
            >
              <h2 className={`text-4xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-500'
                }`}>
                Muhammad Tahir
              </h2>

              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                I'm a passionate Full Stack Developer from a middle-class background,
                turning complex problems into efficient, scalable solutions. With 2.5+
                years of experience, I specialize in building dynamic applications using the
                MERN stack.
              </p>

              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                I believe in continuous learning, delivering real value, and writing clean,
                maintainable code that helps businesses grow and succeed in the digital
                world.
              </p>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-3 mt-6">
                {['MERN Stack',, 'Webflow', 'React', 'Node.js', 'MongoDB', 'Next.js'].map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium text-white ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-gray-900' : 'bg-blue-500'
                      }`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} shadow-lg transition-all duration-300 hover:shadow-cyan-500/10`}>
        <div className="container mx-auto px-6 md:px-12 shadow-lg md:py-20 transition-all duration-300 rounded-xl hover:shadow-cyan-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
              My expertise spans across various technologies in the web development ecosystem.
            </h2>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/20 ${darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:shadow-lg'
                  }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {skill.name}
                  </h3>
                  <span className={`font-bold text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-500'
                    }`}>
                    {skill.level}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full ${darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-gray-900'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Soft Skills Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-cyan-500/10`}>
        <div className="container mx-auto px-6 md:px-12 md:py-20 shadow-lg transition-all duration-300 rounded-xl hover:shadow-cyan-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Soft Skills
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Beyond technical expertise, these qualities help me deliver exceptional results.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {softSkills.map((skill, index) => (
              <motion.div
                key={skill.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`p-8 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 ${darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 hover:shadow-2xl hover:shadow-cyan-500/20'
                  : 'bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-gray-300/50'
                  }`}
              >
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-full text-white ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-gray-900' : 'bg-blue-500'
                    }`}>
                    {skill.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  {skill.title}
                </h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} shadow-lg transition-all duration-300 hover:shadow-cyan-500/10`}>
        <div className="container mx-auto px-6 md:py-20 md:px-12 shadow-lg transition-all duration-300 rounded-xl hover:shadow-cyan-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Education & Certifications
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              My formal education and ongoing learning journey.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                variants={itemVariants}
                className={`p-8 rounded-2xl transition-all duration-300 hover:scale-102 shadow-lg hover:shadow-cyan-500/20 ${darkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:shadow-lg'
                  }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 ">
                  <h3 className={`text-2xl font-bold mb-2 md:mb-0 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {edu.degree}
                  </h3>
                  <span className="px-4 py-2 rounded-full shadow-md text-sm font-medium bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30">
                    {edu.period}
                  </span>
                </div>
                <p className={`text-lg font-medium mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                  {edu.institution}
                </p>
                <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  {edu.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client CTA Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:shadow-cyan-500/10`}>
        <div className="container md:py-20 mx-auto px-6 md:px-12 shadow-lg transition-all duration-300 rounded-xl hover:shadow-cyan-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Let's Build Something Great Together
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Ready to turn your vision into reality? Let's discuss your project and create innovative solutions that drive results.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 text-white ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start a Conversation
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/services"
                  className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 ${
                    darkMode
                      ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  View Services
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} shadow-lg transition-all duration-300 hover:shadow-cyan-500/10`}>
        <div className="container md:py-20 mx-auto px-6 md:px-12 shadow-lg transition-all duration-300 rounded-xl hover:shadow-cyan-500/20">
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
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'
              }`}>
              Ready to Work Together?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Let's collaborate to bring your ideas to life with cutting-edge web solutions
              that drive real results for your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-white ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/30'
                  }`}
                >
                  Get In Touch
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/projects"
                  className={`px-8 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${darkMode
                    ? 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  View My Work
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
