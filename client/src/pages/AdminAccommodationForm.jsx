import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Perks from '@/components/ui/Perks';
import AdminNav from '@/components/ui/AdminNav';
import { useAuth } from '../../hooks';

const AdminAccommodationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        addedPhotos: [],
        description: '',
        perks: [],
        extraInfo: '',
        maxGuests: 1,
        price: 0,
    });

    useEffect(() => {
        // Check if user is admin using the auth context
        if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
            return;
        }

        if (id) {
            fetchPlace();
        } else {
            setLoading(false);
        }
    }, [id, auth.user]);

    const fetchPlace = async () => {
        try {
            const { data } = await axiosInstance.get(`/places/${id}`);
            const place = data.place;
            setFormData({
                title: place.title || '',
                address: place.address || '',
                addedPhotos: place.photos || [],
                description: place.description || '',
                perks: place.perks || [],
                extraInfo: place.extraInfo || '',
                maxGuests: place.maxGuests || 1,
                price: place.price || 0,
            });
        } catch (error) {
            console.error('Error fetching place:', error);
            toast.error('Failed to load place data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                // Update existing place
                await axiosInstance.put('/places/admin/update', {
                    id,
                    ...formData
                });
                toast.success('Accommodation updated successfully');
            } else {
                // Create new place
                await axiosInstance.post('/places/admin/add', formData);
                toast.success('Accommodation created successfully');
            }

            // Navigate back to accommodations list
            navigate('/admin/accommodations');
        } catch (error) {
            console.error('Error saving accommodation:', error);
            const message = error.response?.data?.message || 'Failed to save accommodation';
            toast.error(message);
        }
    };

    // Check authentication using the auth context
    if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
        return <Navigate to="/admin/login" />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Use AdminNav component */}
            <AdminNav />

            {/* Form */}
            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        to="/admin/accommodations"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Accommodations
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">
                        {id ? 'Edit Accommodation' : 'Add New Accommodation'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {id ? 'Update accommodation details' : 'Create a new property listing'}
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="My lovely apartment"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="123 Main St, City, Country"
                            />
                        </div>

                        {/* Photos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Photos
                            </label>
                            <PhotosUploader
                                addedPhotos={Array.isArray(formData.addedPhotos) ? formData.addedPhotos : []}
                                setAddedPhotos={(photos) => setFormData(prev => ({ ...prev, addedPhotos: photos }))}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Describe your place..."
                            />
                        </div>

                        {/* Perks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Perks
                            </label>
                            <Perks
                                selected={formData.perks}
                                setSelected={(perks) => setFormData(prev => ({ ...prev, perks }))}
                            />
                        </div>

                        {/* Extra Info */}
                        <div>
                            <label htmlFor="extraInfo" className="block text-sm font-medium text-gray-700 mb-2">
                                Extra Info
                            </label>
                            <textarea
                                id="extraInfo"
                                name="extraInfo"
                                value={formData.extraInfo}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="House rules, etc..."
                            />
                        </div>

                        {/* Max Guests and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Guests *
                                </label>
                                <input
                                    type="number"
                                    id="maxGuests"
                                    name="maxGuests"
                                    value={formData.maxGuests}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price per Night (Rs) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <Link
                                to="/admin/accommodations"
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                            >
                                {id ? 'Update Accommodation' : 'Create Accommodation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAccommodationForm;
