'use client';

import React, { useState } from 'react';
import { SEOAnalyzer } from '@/lib/utils/seoAnalyzer';

export default function TestSEOAnalyzer() {
  const [title, setTitle] = useState('How to Build a Modern Website with Next.js 15');
  const [description, setDescription] = useState('Learn how to build a modern website with Next.js 15, including SEO best practices, server-side rendering, and performance optimization.');
  const [content, setContent] = useState(`
    <h1>How to Build a Modern Website with Next.js 15</h1>
    <p>Next.js 15 is the latest version of the popular React framework that provides excellent performance and SEO capabilities. In this guide, we'll explore how to build a modern website with Next.js 15.</p>
    
    <h2>Why Choose Next.js 15?</h2>
    <p>Next.js 15 offers several advantages for modern web development:</p>
    <ul>
      <li>Improved server-side rendering performance</li>
      <li>Better SEO optimization features</li>
      <li>Enhanced image optimization</li>
      <li>New React features integration</li>
    </ul>
    
    <h2>Setting Up Your Project</h2>
    <p>To get started with Next.js 15, you'll need to create a new project using the create-next-app command:</p>
    <pre><code>npx create-next-app@latest my-nextjs-website</code></pre>
    
    <h3>Configuring SEO Settings</h3>
    <p>Proper SEO configuration is crucial for your website's success. Make sure to set up your metadata correctly in your Next.js 15 application.</p>
    
    <p>For more information, visit <a href="https://nextjs.org/docs">Next.js documentation</a> and check out <a href="/blog/nextjs-seo-tips">our other articles on SEO</a>.</p>
    
    <img src="/images/nextjs-performance.png" alt="Next.js performance chart" />
    <img src="/images/seo-dashboard.png" alt="SEO dashboard showing improved metrics" />
  `);
  const [keyword, setKeyword] = useState('Next.js 15');
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = () => {
    const analyzer = new SEOAnalyzer(title, description, content, {
      primaryKeyword: keyword,
      slug: title.toLowerCase().replace(/\s+/g, '-')
    });

    const result = analyzer.analyze();
    setAnalysis(result);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">SEO Analyzer Test</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={10}
            />
          </div>
          
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Analyze SEO
          </button>
        </div>
        
        {analysis && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">SEO Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
                <div className="text-3xl font-bold text-center" style={{ color: analysis.score >= 80 ? '#10B981' : analysis.score >= 60 ? '#F59E0B' : '#EF4444' }}>
                  {analysis.score}/100
                </div>
                <p className="text-center mt-2">
                  {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <span>Title Length:</span>
                    <span>{analysis.details.title.length} chars</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Meta Description:</span>
                    <span>{analysis.details.metaDescription.length} chars</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Keyword Density:</span>
                    <span>{analysis.details.keyword.density.toFixed(1)}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>H1 Tags:</span>
                    <span>{analysis.details.headings.h1Count}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Internal Links:</span>
                    <span>{analysis.details.links.internal}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Images with Alt:</span>
                    <span>{analysis.details.images.withAlt}/{analysis.details.images.total}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {analysis.issues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Issues Found ({analysis.issues.length})</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.issues.map((issue: string, index: number) => (
                    <li key={index} className="text-red-600">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-blue-600">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}