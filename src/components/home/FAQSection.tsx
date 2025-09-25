'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
    const { darkMode } = useSelector((state: RootState) => state.theme);
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

    const faqs = [
        {
            question: "What do you need to start?",
            answer: "I need details about your business goals, target audience, design preferences, and specific functionalities. Any reference websites and brand guidelines would also be helpful."
        },
        {
            question: "How long will it take?",
            answer: "Project timeline depends on complexity: Basic websites (3 pages) take 4-7 days, Standard projects (5 pages) take 10-14 days, and Premium custom solutions (10+ pages) take 21-30 days. I provide regular updates throughout the development process."
        },
        {
            question: "What platforms do you use?",
            answer: "I specialize in modern web technologies including React, Next.js, Node.js, MongoDB, and TypeScript for full-stack applications. I also work with Webflow for design-focused projects and can integrate with various CMS platforms and third-party services."
        },
        {
            question: "Will my website be mobile-friendly?",
            answer: "Absolutely! All websites I develop are fully responsive and optimized for mobile devices. I follow mobile-first design principles to ensure your site looks and performs perfectly on smartphones, tablets, and desktops."
        },
        {
            question: "Do you provide ongoing support?",
            answer: "Yes, I provide ongoing support and maintenance services. This includes regular updates, security patches, bug fixes, content updates, and technical support. I offer different support packages based on your needs and can discuss long-term maintenance plans."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl font-bold sm:text-4xl mb-4 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        FAQ
                    </h2>
                    <p className={`text-lg ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Frequently asked questions about my web development services
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`rounded-lg border overflow-hidden ${
                                darkMode 
                                    ? 'bg-gray-900 border-gray-700' 
                                    : 'bg-white border-gray-200'
                            }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className={`w-full px-6 py-4 text-left flex justify-between items-center hover:bg-opacity-50 transition-colors duration-200 ${
                                    darkMode 
                                        ? 'hover:bg-gray-800' 
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <h3 className={`text-lg font-medium ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {faq.question}
                                </h3>
                                <motion.svg
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`w-5 h-5 flex-shrink-0 ${
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className={`px-6 pb-4 ${
                                            darkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Additional CTA */}
                <div className="mt-12 text-center">
                    <p className={`text-lg mb-4 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Still have questions?
                    </p>
                    <button 
                        onClick={() => {
                            const phoneNumber = "+923241553013";
                            const message = "Hi! I have some questions about your web development services. Could you help me understand more about your process?";
                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                        }}
                        className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                            darkMode
                                ? 'bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-500/25'
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25'
                        }`}
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                        </svg>
                        Contact Me
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;