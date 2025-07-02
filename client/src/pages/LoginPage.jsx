import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

import ProfilePage from './ProfilePage';
import { useAuth } from '../../hooks';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [redirect, setRedirect] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const auth = useAuth();

    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (isAdminLogin) {
            // Redirect to admin login page
            window.location.href = '/admin/login';
            return;
        }

        const response = await auth.login(formData);
        if (response.success) {
            toast.success(response.message);
            setRedirect(true);
        } else {
            toast.error(response.message);
        }
    };

    const handleGoogleLogin = async (credential) => {
        const response = await auth.googleLogin(credential);
        if (response.success) {
            toast.success(response.message);
            setRedirect(true);
        } else {
            toast.error(response.message);
        }
    };

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    if (auth.user) {
        return <ProfilePage />;
    }

    return (
        <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
            <div className="mb-40">
                <h1 className="mb-4 text-center text-4xl">
                    {isAdminLogin ? 'Admin Access' : 'Login'}
                </h1>

                {/* Login Type Toggle */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            type="button"
                            onClick={() => setIsAdminLogin(false)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isAdminLogin
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            User Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdminLogin(true)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isAdminLogin
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Admin Access
                        </button>
                    </div>
                </div>

                {isAdminLogin ? (
                    // Admin Login Section
                    <div className="mx-auto max-w-md">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-blue-700">
                                    Administrative access for property management
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/admin/login"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-md font-medium transition-colors"
                        >
                            Go to Admin Login
                        </Link>

                        <div className="mt-4 text-center text-sm text-gray-500">
                            Admin credentials required for access
                        </div>
                    </div>
                ) : (
                    // Regular User Login Form
                    <>
                        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
                            <input
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleFormData}
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="password"
                                value={formData.password}
                                onChange={handleFormData}
                            />
                            <button className="primary my-4">Login</button>
                        </form>

                        <div className="mb-4 flex w-full items-center gap-4">
                            <div className="h-0 w-1/2 border-[1px]"></div>
                            <p className="small -mt-1">or</p>
                            <div className="h-0 w-1/2 border-[1px]"></div>
                        </div>

                        {/* Google login button */}
                        <div className="flex h-[50px] justify-center">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    handleGoogleLogin(credentialResponse.credential);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                text="continue_with"
                                width="350"
                            />
                        </div>
                    </>
                )}

                <div className="py-2 text-center text-gray-500">
                    Don't have an account yet?{' '}
                    <Link className="text-black underline" to={'/register'}>
                        Register now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
