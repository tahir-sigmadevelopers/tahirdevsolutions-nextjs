'use client';

import React, { useEffect, useState } from 'react';

const DebugProjectsPage = () => {
  const [apiData, setApiData] = useState<any>(null);
  const [featuredApiData, setFeaturedApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        
        // Test regular projects API
        console.log('🧪 Testing /api/projects');
        const response1 = await fetch('/api/projects');
        if (response1.ok) {
          const data1 = await response1.json();
          setApiData(data1);
          console.log('✅ Regular API Success:', data1);
        } else {
          const error1 = await response1.text();
          setErrors(prev => ({ ...prev, regular: error1 }));
          console.error('❌ Regular API Error:', error1);
        }

        // Test featured projects API
        console.log('🧪 Testing /api/projects?featured=true');
        const response2 = await fetch('/api/projects?featured=true');
        if (response2.ok) {
          const data2 = await response2.json();
          setFeaturedApiData(data2);
          console.log('✅ Featured API Success:', data2);
        } else {
          const error2 = await response2.text();
          setErrors(prev => ({ ...prev, featured: error2 }));
          console.error('❌ Featured API Error:', error2);
        }
        
      } catch (error) {
        console.error('🚨 Network Error:', error);
        setErrors(prev => ({ ...prev, network: error.message }));
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔧 Projects API Debug Tool</h1>
      
      {loading && (
        <div className="bg-blue-100 p-4 rounded mb-4">
          <p>⏳ Testing APIs...</p>
        </div>
      )}

      {/* Regular API Results */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📡 Regular API (/api/projects)</h2>
        {errors.regular ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="font-bold text-red-800">❌ Error:</p>
            <pre className="text-sm text-red-700">{errors.regular}</pre>
          </div>
        ) : apiData ? (
          <div className="bg-green-100 p-4 rounded">
            <p className="font-bold text-green-800">✅ Success!</p>
            <p><strong>Projects Count:</strong> {apiData.projects?.length || 0}</p>
            <p><strong>Total:</strong> {apiData.pagination?.total || 0}</p>
            {apiData.projects?.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer">Show Projects</summary>
                <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(apiData.projects, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded">
            <p>⏳ Loading...</p>
          </div>
        )}
      </div>

      {/* Featured API Results */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">⭐ Featured API (/api/projects?featured=true)</h2>
        {errors.featured ? (
          <div className="bg-red-100 p-4 rounded">
            <p className="font-bold text-red-800">❌ Error:</p>
            <pre className="text-sm text-red-700">{errors.featured}</pre>
          </div>
        ) : featuredApiData ? (
          <div className="bg-green-100 p-4 rounded">
            <p className="font-bold text-green-800">✅ Success!</p>
            <p><strong>Projects Count:</strong> {featuredApiData.projects?.length || 0}</p>
            <p><strong>Featured Count:</strong> {featuredApiData.projects?.filter(p => p.featured).length || 0}</p>
            {featuredApiData.projects?.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer">Show Featured Projects</summary>
                <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(featuredApiData.projects, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded">
            <p>⏳ Loading...</p>
          </div>
        )}
      </div>

      {/* Network Errors */}
      {errors.network && (
        <div className="bg-red-100 p-4 rounded">
          <p className="font-bold text-red-800">🚨 Network Error:</p>
          <p className="text-red-700">{errors.network}</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">🔗 Quick Links:</h3>
        <ul className="space-y-1 text-blue-600">
          <li><a href="/api/projects" target="_blank" className="underline">/api/projects</a></li>
          <li><a href="/api/projects?featured=true" target="_blank" className="underline">/api/projects?featured=true</a></li>
          <li><a href="/test-projects" className="underline">/test-projects</a></li>
          <li><a href="/projects" className="underline">/projects</a></li>
          <li><a href="/" className="underline">Home</a></li>
        </ul>
      </div>
    </div>
  );
};

export default DebugProjectsPage;