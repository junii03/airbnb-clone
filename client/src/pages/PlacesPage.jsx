import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import AccountNav from '@/components/ui/AccountNav';
import PlaceImg from '@/components/ui/PlaceImg';
import BookingDates from '@/components/ui/BookingDates';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';

const PlacesPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBookings = async () => {
            try {
                const { data } = await axiosInstance.get('/bookings');
                setBookings(data.booking);
            } catch (error) {
                console.log('Error: ', error);
                toast.error('Failed to load your bookings');
            } finally {
                setLoading(false);
            }
        };
        getBookings();
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Accommodation Applications</h1>
                    <p className="text-gray-600">View and manage your booking requests and reservations</p>
                </div>

                {/* Action Buttons */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse Accommodations
                    </Link>
                    <Link
                        to="/maintenance"
                        className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary py-3 px-6 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        </svg>
                        Maintenance & Support
                    </Link>
                </div>

                {/* Bookings List */}
                {bookings?.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <Link
                                to={`/account/bookings/${booking._id}`}
                                className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                key={booking._id}
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3">
                                        {booking?.place?.photos[0] && (
                                            <PlaceImg
                                                place={booking?.place}
                                                className="w-full h-48 md:h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col h-full">
                                            <div className="flex-1">
                                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                    {booking?.place?.title}
                                                </h2>
                                                <div className="text-gray-600 mb-3">
                                                    <BookingDates
                                                        booking={booking}
                                                        className="flex items-center gap-2"
                                                    />
                                                </div>
                                                <p className="text-gray-500 text-sm mb-4">
                                                    {booking?.place?.address}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                                    </svg>
                                                    <span>Total: Rs{booking.price}</span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    View Details →
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-6">
                            You haven't made any accommodation bookings yet. Start exploring!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Find Accommodations
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacesPage;
