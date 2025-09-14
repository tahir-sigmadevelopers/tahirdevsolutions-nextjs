'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode } from '@/lib/redux/slices/themeSlice';
import { RootState } from '@/lib/redux/store';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if darkMode is stored in localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
      dispatch(setDarkMode(JSON.parse(savedDarkMode)));
    } else {
      // Default to dark mode if no saved preference
      dispatch(setDarkMode(true));
    }
  }, [dispatch]);

  useEffect(() => {
    // Update the document class when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}
