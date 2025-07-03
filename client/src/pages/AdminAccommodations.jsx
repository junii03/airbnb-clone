import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import AdminNav from '@/components/ui/AdminNav';
import { useAuth } from '../../hooks';

const AdminAccommodations = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();

    useEffect(() => {
        // Check if user is admin using the auth context
        if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
            return;
        }

        fetchPlaces();
    }, [auth.user]);

    const fetchPlaces = async () => {
        try {
            const { data } = await axiosInstance.get('/places/admin/list');
            console.log('Admin places response:', data);
            // Handle the new response format
            if (data.success && data.places) {
                setPlaces(data.places);
            } else {
                // Fallback for old format
                setPlaces(data || []);
            }
        } catch (error) {
            console.error('Error fetching places:', error);
            toast.error('Failed to load accommodations');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlace = async (placeId) => {
        if (!window.confirm('Are you sure you want to delete this accommodation?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/places/admin/${placeId}/delete`);
            setPlaces(places.filter(place => place._id !== placeId));
            toast.success('Accommodation deleted successfully');
        } catch (error) {
            console.error('Error deleting place:', error);
            toast.error('Failed to delete accommodation');
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

            {/* Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Accommodation Management</h1>
                        <p className="text-gray-600 mt-1">View and manage all user-created property listings</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total Properties: {places.length}
                    </div>
                </div>

                {places.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No accommodations</h3>
                        <p className="mt-1 text-sm text-gray-500">No user has created any property listings yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {places.map((place) => (
                            <div key={place._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                                <div className="aspect-w-16 aspect-h-10">
                                    {place.photos && place.photos[0] && (
                                        <img
                                            className="w-full h-48 object-cover"
                                            src={place.photos[0]}
                                            alt={place.title}
                                        />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{place.title}</h3>

                                    {/* Owner Information */}
                                    <div className="mb-3 p-2 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-600 font-medium">Owner:</p>
                                        <p className="text-sm text-gray-800">{place.owner?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{place.owner?.email || 'No email'}</p>
                                    </div>

                                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {place.address}
                                    </p>
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{place.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-bold text-primary">Rs{place.price}/night</span>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                            Max {place.maxGuests} guests
                                        </span>
                                    </div>

                                    {/* Creation Date */}
                                    <div className="text-xs text-gray-500 mb-4">
                                        Created: {new Date(place.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/place/${place._id}`}
                                            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleDeletePlace(place._id)}
                                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAccommodations;
