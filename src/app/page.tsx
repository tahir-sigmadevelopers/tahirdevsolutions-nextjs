'use client';

import React from 'react';
import ParticlesComponent from '@/components/layout/Particles';
import HeroSection from '@/components/home/HeroSection';
import ProjectSection from '@/components/home/ProjectSection';
import ServicesSection from '@/components/home/ServicesSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { motion } from 'framer-motion';

export default function Home() {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className={`relative ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <ParticlesComponent />
      
      <div className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <HeroSection />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <ProjectSection />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <ServicesSection />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <ExperienceSection />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          <TestimonialsSection />
        </motion.div>
      </div>
    </div>
  );
}