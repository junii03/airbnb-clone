import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks';
import axiosInstance from '@/utils/axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [adminFormData, setAdminFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [redirect, setRedirect] = useState(false);
    const [isAdminRegister, setIsAdminRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const auth = useAuth();

    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdminFormData = (e) => {
        const { name, value } = e.target;
        setAdminFormData({ ...adminFormData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const response = await auth.register(formData);
        if (response.success) {
            toast.success(response.message);
            setRedirect(true);
        } else {
            toast.error(response.message);
        }
    };

    const handleAdminFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axiosInstance.post('/user/admin/register', {
                name: adminFormData.name,
                email: adminFormData.email,
                password: adminFormData.password,
            });

            if (data.success) {
                toast.success('Admin account created successfully!');
                setAdminFormData({
                    name: '',
                    email: '',
                    password: '',
                });
                // Redirect to admin login
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 2000);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Admin registration failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credential) => {
        if (isAdminRegister) {
            toast.error('Admin registration via Google is not allowed.');
            return;
        }

        const response = await auth.googleLogin(credential);
        if (response.success) {
            toast.success(response.message);
            setRedirect(true);
        } else {
            toast.error(response.message);
        }
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
            <div className="mb-40">
                <h1 className="mb-4 text-center text-4xl">
                    {isAdminRegister ? 'Admin Registration' : 'Register'}
                </h1>

                {/* Registration Type Toggle */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            type="button"
                            onClick={() => setIsAdminRegister(false)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isAdminRegister
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            User Registration
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdminRegister(true)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isAdminRegister
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Admin Registration
                        </button>
                    </div>
                </div>

                {isAdminRegister ? (
                    // Admin Registration Form
                    <div className="mx-auto max-w-md">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-blue-800 mb-1">
                                        Administrative Registration
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        Create an administrator account to manage the platform.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleAdminFormSubmit}>
                            <input
                                name="name"
                                type="text"
                                placeholder="Administrator Name"
                                value={adminFormData.name}
                                onChange={handleAdminFormData}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={adminFormData.email}
                                onChange={handleAdminFormData}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Create strong password"
                                value={adminFormData.password}
                                onChange={handleAdminFormData}
                                required
                                minLength="6"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <Link
                                to="/admin/login"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Already have admin access? Login here
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Regular User Registration Form
                    <>
                        <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
                            <input
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleFormData}
                            />
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
                            <button className="primary my-2">Register</button>
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
                    Already a member?
                    <Link className="text-black underline" to={'/login'}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
