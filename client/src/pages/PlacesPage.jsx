import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import AccountNav from '@/components/ui/AccountNav';
import PlaceImg from '@/components/ui/PlaceImg';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';
import { Plus, Edit, Eye, MapPin, Users, DollarSign } from 'lucide-react';

const PlacesPage = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserPlaces = async () => {
            try {
                const { data } = await axiosInstance.get('/places/user/list');
                setPlaces(data.places || []);
            } catch (error) {
                console.log('Error: ', error);
                toast.error('Failed to load your accommodations');
            } finally {
                setLoading(false);
            }
        };
        getUserPlaces();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col items-center">
            <AccountNav />
            <div className="w-full max-w-6xl px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Accommodations</h1>
                    <p className="text-gray-600">Manage your property listings and reservations</p>
                </div>

                {/* Action Buttons */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/account/places/new"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Accommodation
                    </Link>
                    <Link
                        to="/account/bookings"
                        className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary py-3 px-6 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                        <Eye className="h-5 w-5" />
                        View My Bookings
                    </Link>
                </div>

                {/* Places List */}
                {places?.length > 0 ? (
                    <div className="space-y-6">
                        {places.map((place) => (
                            <div
                                key={place._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3">
                                        {place?.photos[0] && (
                                            <PlaceImg
                                                place={place}
                                                className="w-full h-48 md:h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col h-full">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h2 className="text-xl font-semibold text-gray-900">
                                                        {place.title}
                                                    </h2>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            to={`/place/${place._id}`}
                                                            className="p-2 text-gray-600 hover:text-primary transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            to={`/account/places/${place._id}`}
                                                            className="p-2 text-gray-600 hover:text-primary transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-sm">{place.address}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Users className="w-4 h-4" />
                                                        <span className="text-sm">Up to {place.maxGuests} guests</span>
                                                    </div>
                                                </div>

                                                {place.description && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {place.description}
                                                    </p>
                                                )}

                                                {place.perks && place.perks.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {place.perks.slice(0, 3).map((perk) => (
                                                            <span
                                                                key={perk}
                                                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                                            >
                                                                {perk}
                                                            </span>
                                                        ))}
                                                        {place.perks.length > 3 && (
                                                            <span className="text-gray-500 text-xs px-2 py-1">
                                                                +{place.perks.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-2 text-lg font-semibold text-primary">

                                                    <span>Rs {place.price}/night</span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Created: {new Date(place.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No accommodations yet</h3>
                        <p className="text-gray-600 mb-6">
                            Start hosting by adding your first accommodation!
                        </p>
                        <Link
                            to="/account/places/new"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Add Your First Place
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacesPage;
