// src/components/home/PricingSection.tsx

import { RootState } from '@/lib/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';

const PricingSection = () => {
    const { darkMode } = useSelector((state: RootState) => state.theme);

    // WhatsApp contact function
    const handleWhatsAppContact = (planName: string, price: string) => {
        const phoneNumber = "+923241553013"; // Replace with your WhatsApp number
        const message = `Hi! I'm interested in discussing the ${planName} package (${price}). Could you please provide more details about this service?`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Custom project WhatsApp contact function
    const handleCustomProjectContact = () => {
        const phoneNumber = "+923241553013"; // Replace with your WhatsApp number
        const message = `Hi! I want to discuss a custom project. I have specific requirements that don't fit into your standard packages. Could we schedule a consultation to discuss my needs?`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };


    const plans = [
        {
            name: 'Basic',
            price: '$200 USD',
            description: 'Starter Website Development Basic Website Development Within 3 Pages, Without API Integration, Following Client\'s Design',
            delivery: '4-day delivery',
            revisions: 'Unlimited Revisions (Fixes)',
            features: [
                'Functional website',
                '3 pages',
                'Content upload',
                'E-commerce functionality',
                '5 products',
                'Payment Integration',
                'Opt-in form',
                'Autoreponder integration',
                'Hosting setup',
                'Social media icons'
            ],
            highlightedFeatures: ['Functional website', '3 pages', 'Content upload', '5 plugins/extensions']
        },
        {
            name: 'Standard',
            price: '$500 USD',
            description: 'Enhanced Website Development Enhanced Web Development Service With 5 Pages, Basic API Integration, Following Client\'s Design',
            delivery: '10-day delivery',
            revisions: 'Unlimited Revisions (Fixes)',
            features: [
                'Functional website',
                '5 pages',
                'Content upload',
                'E-commerce functionality',
                '10 products',
                'Payment Integration',
                'Opt-in form',
                'Autoreponder integration',
                'Hosting setup',
                'Social media icons'
            ],
            highlightedFeatures: ['Functional website', '5 pages', 'Content upload', '8 plugins/extensions', 'E-commerce functionality']
        },
        {
            name: 'Premium',
            price: '$1000 USD',
            description: 'Pro Website Development Pro and Scalable Pack: Customize Features According to the Client\'s Need Within 10 Pages',
            delivery: '21-day delivery',
            revisions: 'Unlimited Revisions (Fixes)',
            features: [
                'Functional website',
                '10 pages',
                'Content upload',
                'E-commerce functionality',
                '15 products',
                'Payment Integration',
                'Opt-in form',
                'Autoreponder integration',
                'Hosting setup',
                'Social media icons'
            ],
            highlightedFeatures: ['Functional website', '10 pages', 'Content upload', '10 plugins/extensions', 'E-commerce functionality', '15 products']
        }
    ];

    return (
        <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className={`text-3xl font-extrabold sm:text-4xl ${darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Choose Your Plan
                    </h2>
                    <p className={`mt-4 text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Select the perfect package for your website development needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`group p-8 rounded-2xl transition-all duration-300 shadow-lg ${darkMode
                                ? 'bg-gray-800 hover:bg-gray-900 hover:shadow-2xl hover:shadow-cyan-500/20'
                                : 'bg-white hover:shadow-2xl hover:shadow-gray-300/50'
                                }`}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>{plan.name}</h3>
                                    <span className={`text-sm font-medium ${plan.name === 'Premium' ? 'text-purple-600' :
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {plan.name === 'Premium' ? 'Most Popular' : ''}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>{plan.price}</div>
                                    {/* <div className="text-sm text-gray-300 mt-1">Save up to 10% with <span className="text-green-600 font-medium">Subscribe to Save</span></div> */}
                                </div>

                                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{plan.description}</p>

                                <div className="mb-6">
                                    <div className={`flex items-center text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {plan.delivery}
                                    </div>
                                    <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.356-2m15.356 2H15" />
                                        </svg>
                                        {plan.revisions}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>What's Included</h4>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                <svg
                                                    className={`w-4 h-4 mr-2 flex-shrink-0 ${plan.highlightedFeatures.includes(feature)
                                                        ? 'text-green-600'
                                                        : 'text-gray-400'
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className={`${plan.highlightedFeatures.includes(feature)
                                                    ? (darkMode ? 'text-white' : 'text-gray-900')
                                                    : (darkMode ? 'text-gray-400' : 'text-gray-500')
                                                    }`}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    className={`w-full font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-3 relative overflow-hidden ${darkMode
                                        ? 'bg-gradient-to-r from-cyan-500 to-gray-900 hover:shadow-cyan-500/30'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="flex items-center justify-center w-full">
                                        Continue
                                        <svg className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </button>
                                <button 
                                    onClick={() => handleWhatsAppContact(plan.name, plan.price)}
                                    className={`w-full font-medium py-2 px-4 border rounded-md transition-colors duration-200 ${
                                        darkMode
                                            ? 'text-white border-gray-600 hover:bg-gray-800 hover:shadow-2xl hover:shadow-cyan-500/20'
                                            : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-lg'
                                        }`}
                                >
                                    <span className="flex items-center justify-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                                        </svg>
                                        Contact me
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Order CTA Section */}
                <div className="mt-16 text-center">
                    <div className={`p-8 rounded-2xl shadow-lg ${
                        darkMode 
                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700' 
                            : 'bg-gradient-to-r from-gray-50 to-white border border-gray-200'
                    }`}>
                        <div className="max-w-2xl mx-auto">
                            <h3 className={`text-2xl font-bold mb-4 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Need Something Custom?
                            </h3>
                            <p className={`text-lg mb-6 ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Have unique requirements that don't fit our standard packages? Let's discuss your custom project and create a tailored solution just for you.
                            </p>
                            <button 
                                onClick={handleCustomProjectContact}
                                className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                                    darkMode
                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25'
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                                </svg>
                                Discuss Custom Project
                                <svg className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;