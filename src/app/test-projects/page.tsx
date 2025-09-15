'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { getProjects } from '@/lib/redux/slices/projectSlice';

const ProjectsDebugTest = () => {
  const { projects, loading, error } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('🧪 Test Component: Dispatching getProjects');
    dispatch(getProjects({}) as any);
  }, [dispatch]);

  useEffect(() => {
    console.log('🧪 Test Component: State changed', {
      projectsLength: projects.length,
      loading,
      error,
      projects: projects.slice(0, 1)
    });
  }, [projects, loading, error]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Projects Debug Test</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Redux State:</h2>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Projects Count: {projects.length}</p>
      </div>

      {projects.length > 0 && (
        <div className="bg-green-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">✅ Projects Found:</h2>
          {projects.map((project, index) => (
            <div key={project._id} className="mb-2 p-2 bg-white rounded">
              <p><strong>{index + 1}. {project.title}</strong></p>
              <p>Category: {project.category}</p>
              <p>Featured: {project.featured ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-bold mb-2">❌ No Projects Found</h2>
          <p>The Redux store is empty. Check the API response.</p>
        </div>
      )}

      {loading && (
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-bold mb-2">⏳ Loading...</h2>
          <p>Fetching projects from API...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-bold mb-2">🚨 Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsDebugTest;