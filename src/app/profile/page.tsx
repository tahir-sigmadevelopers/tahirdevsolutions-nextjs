'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    image?: {
        url?: string;
        public_id?: string;
    };
    role: string;
    joinedAt: string;
}

const ProfilePage = () => {
    const { data: session, status, update } = useSession();
    const { darkMode } = useSelector((state: RootState) => state.theme);
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [activeTab, setActiveTab] = useState('profile');
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        if (status === 'authenticated' && session?.user) {
            fetchUserProfile();
        }
    }, [status, session, router]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users/profile');

            if (response.ok) {
                const userData = await response.json();
                setProfile(userData);
                setName(userData.name || '');
                setEmail(userData.email || '');
            } else {
                toast.error('Failed to load profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!email.trim()) {
            toast.error('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setProfile(updatedUser);

                // Update session
                await update({
                    name: updatedUser.name,
                    email: updatedUser.email,
                });

                toast.success('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!currentPassword) {
            toast.error('Current password is required');
            return;
        }
        if (!newPassword) {
            toast.error('New password is required');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch('/api/users/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (response.ok) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordSection(false);
                toast.success('Password changed successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Enhanced file validation
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('image', file);

            // Create XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();

            const uploadPromise = new Promise<{ imageUrl: string }>((resolve, reject) => {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(progress);
                    }
                });

                xhr.addEventListener('load', () => {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (xhr.status === 200) {
                            resolve(response);
                        } else {
                            reject(new Error(response.message || 'Upload failed'));
                        }
                    } catch (error) {
                        reject(new Error('Invalid response from server'));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('timeout', () => {
                    reject(new Error('Upload timeout. Please try again.'));
                });

                xhr.open('POST', '/api/users/upload-avatar');
                xhr.timeout = 30000; // 30 seconds timeout
                xhr.send(formData);
            });

            const { imageUrl } = await uploadPromise;

            // Update profile state
            setProfile(prev => prev ? {
                ...prev,
                image: { url: imageUrl }
            } : null);

            // Update session
            await update({
                image: imageUrl,
            });

            toast.success('Profile picture updated successfully!');

        } catch (error: any) {
            console.error('Error uploading image:', error);
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            // Clear the input
            e.target.value = '';
        }
    };

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/');
            toast.success('Logged out successfully!');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to logout');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (status === 'loading' || loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
                    <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!session || !profile) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-20`}>
                <div className="text-center">
                    <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Access Denied
                    </h1>
                    <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Please sign in to view your profile.
                    </p>
                </div>
            </div>
        );
    }

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
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pt-24 pb-16`}>
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            My Profile
                        </h1>
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Manage your account settings and preferences
                        </p>
                    </motion.div>

                    {/* Profile Card */}
                    <motion.div
                        variants={itemVariants}
                        className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        {/* Profile Header */}
                        <div className="relative h-32 bg-gradient-to-r from-gray-800 via-gray-900 to-cyan-900 dark:from-gray-900 dark:via-black dark:to-cyan-800">
                            <div className="absolute -bottom-16 left-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                        {profile.image?.url ? (
                                            <Image
                                                src={profile.image.url}
                                                alt={profile.name}
                                                width={128}
                                                height={128}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-800 to-cyan-600 dark:from-gray-800 dark:via-gray-900 dark:to-cyan-700 flex items-center justify-center">
                                                <span className="text-white font-bold text-4xl">
                                                    {profile.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    <label className={`absolute bottom-2 right-2 ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'} bg-gradient-to-r from-gray-700 to-cyan-600 hover:from-gray-600 hover:to-cyan-500 text-white p-2 rounded-full transition-all duration-300 shadow-lg ${uploading ? 'opacity-75' : 'hover:scale-105'
                                        }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>

                                    {uploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                                            <div className="text-white text-xs font-medium">
                                                {uploadProgress}%
                                            </div>
                                            {uploadProgress > 0 && (
                                                <div className="w-16 bg-gray-700 rounded-full h-1 mt-1">
                                                    <div
                                                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-1 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="pt-20 px-8 pb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {profile.name}
                                    </h2>
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                        {profile.email}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.role === 'admin'
                                                ? 'bg-gradient-to-r from-gray-700 to-cyan-600 text-white'
                                                : 'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 dark:from-cyan-900 dark:to-cyan-800 dark:text-cyan-200'
                                            }`}>
                                            {profile.role}
                                        </span>
                                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Joined {formatDate(profile.joinedAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="px-8">
                                <nav className="flex justify-between items-center">
                                    <div className="flex space-x-8">
                                        {[
                                            { id: 'profile', name: 'Profile Info', icon: '👤' },
                                            { id: 'security', name: 'Security', icon: '🔒' },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                                    activeTab === tab.id
                                                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                                                }`}
                                            >
                                                <span className="mr-2">{tab.icon}</span>
                                                {tab.name}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            {activeTab === 'profile' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Personal Information
                                    </h3>

                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${darkMode
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                        }`}
                                                    placeholder="Enter your full name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${darkMode
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                        }`}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-6 py-3 bg-gradient-to-r from-gray-700  to-cyan-600 hover:from-gray-600 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Security Settings
                                    </h3>

                                    <div className="space-y-6">
                                        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        Password
                                                    </h4>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Update your password to keep your account secure
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                                                    className="px-4 py-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium transition-colors"
                                                >
                                                    {showPasswordSection ? 'Cancel' : 'Change Password'}
                                                </button>
                                            </div>

                                            {showPasswordSection && (
                                                <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                                                    <div>
                                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            Current Password *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={currentPassword}
                                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${darkMode
                                                                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                                }`}
                                                            placeholder="Enter current password"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            New Password *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${darkMode
                                                                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                                }`}
                                                            placeholder="Enter new password"
                                                            minLength={6}
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            Confirm New Password *
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${darkMode
                                                                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                                }`}
                                                            placeholder="Confirm new password"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setShowPasswordSection(false);
                                                                setCurrentPassword('');
                                                                setNewPassword('');
                                                                setConfirmPassword('');
                                                            }}
                                                            className={`px-4 py-2 font-medium rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                                                                }`}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={saving}
                                                            className="px-6 py-3 bg-gradient-to-r from-gray-700  to-cyan-600 hover:from-gray-600 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                                        >
                                                            {saving ? 'Updating...' : 'Update Password'}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;