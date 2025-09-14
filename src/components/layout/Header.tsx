'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/lib/redux/slices/themeSlice';
import { RootState } from '@/lib/redux/store';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white dark:bg-gray-900 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Tahir Dev Solutions "
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Tahir Dev Solutions 
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={handleToggle}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/" active={pathname === '/'}>
            Home
          </NavLink>
          <NavLink href="/projects" active={pathname === '/projects'}>
            Projects
          </NavLink>
          <NavLink href="/blogs" active={pathname === '/blogs'}>
            Blog
          </NavLink>
          <NavLink href="/about" active={pathname === '/about'}>
            About
          </NavLink>
          <NavLink href="/services" active={pathname === '/services'}>
            Services
          </NavLink>
          <NavLink href="/contact" active={pathname === '/contact'}>
            Contact
          </NavLink>

          {session ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400"
              >
                Profile
              </Link>
              {(session.user as any)?.role === 'admin' && (
                <Link
                  href="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-cyan-500 dark:to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 dark:border dark:border-cyan-500"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-800"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/projects" onClick={() => setIsOpen(false)}>
              Projects
            </MobileNavLink>
            <MobileNavLink href="/blogs" onClick={() => setIsOpen(false)}>
              Blog
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
              About
            </MobileNavLink>
            <MobileNavLink href="/services" onClick={() => setIsOpen(false)}>
              Services
            </MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </MobileNavLink>

            {session ? (
              <>
                <MobileNavLink href="/profile" onClick={() => setIsOpen(false)}>
                  Profile
                </MobileNavLink>
                {(session.user as any)?.role === 'admin' && (
                  <MobileNavLink href="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-left py-2 text-gray-700 dark:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/login" onClick={() => setIsOpen(false)}>
                  Login
                </MobileNavLink>
                <MobileNavLink href="/register" onClick={() => setIsOpen(false)}>
                  Sign Up
                </MobileNavLink>
              </>
            )}

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700 dark:text-gray-300">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 dark:border dark:border-cyan-500"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5 text-cyan-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-base font-medium transition-colors duration-200 ${
        active
          ? 'text-blue-600 dark:text-cyan-400'
          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400"
    >
      {children}
    </Link>
  );
}
