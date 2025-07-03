import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';

const PlacePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check if user is admin
    const isAdmin = user?.isAdmin && user?.role === 'admin';

    // Check if current user is the owner of this accommodation
    const isOwner = user && place?.owner && (user.id === place.owner._id || user.id === place.owner);

    useEffect(() => {
        if (!id) {
            return '';
        }

        setLoading(true);

        const getPlace = async () => {
            const { data } = await axiosInstance.get(`/places/${id}`);
            setPlace(data.place);
            setLoading(false);
        };
        getPlace();
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

    if (!place) {
        return;
    }

    return (
        <div className="mt-4 overflow-x-hidden px-8 pt-20 ">
            <h1 className="text-3xl">{place.title}</h1>

            <AddressLink placeAddress={place.address} />
            <PlaceGallery place={place} />

            <div className={`mt-8 mb-8 grid gap-8 ${isAdmin ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-[2fr_1fr]'}`}>
                <div className="">
                    <div className="my-4 ">
                        <h2 className="text-2xl font-semibold">Description</h2>
                        {place.description}
                    </div>
                    Max number of guests: {place.maxGuests}
                    <PerksWidget perks={place?.perks} />

                    {/* Pre-booking Inquiry Button - Hidden for admin and accommodation owner */}
                    {!isAdmin && !isOwner && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                            <h3 className="text-lg font-semibold mb-2">Have Questions?</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Get answers about this property, amenities, or local area before booking.
                            </p>
                            <Link
                                to={`/pre-booking-inquiry?propertyId=${place._id}&propertyTitle=${encodeURIComponent(place.title)}`}
                                className="inline-flex items-center gap-2 bg-white border border-primary text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.162 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                                    />
                                </svg>
                                Ask About This Property
                            </Link>
                        </div>
                    )}

                    {/* Fraud Detection & Security Section - Hidden for admin and accommodation owner */}
                    {!isAdmin && !isOwner && (
                        <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                            <h3 className="text-lg font-semibold mb-2 text-red-800">Security & Safety</h3>
                            <p className="text-red-700 text-sm mb-4">
                                Report suspicious activities or security concerns related to this property.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/fraud-detection"
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.306-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                        />
                                    </svg>
                                    Report Security Issue
                                </Link>
                                <a
                                    href="tel:+1-800-FRAUD-HELP"
                                    className="inline-flex items-center gap-2 bg-white border border-red-600 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                        />
                                    </svg>
                                    Emergency Hotline
                                </a>
                            </div>
                        </div>
                    )}
                </div>
                {!isAdmin && (
                    <div>
                        <BookingWidget place={place} />
                    </div>
                )}
            </div>
            <div className="-mx-8 border-t bg-white px-8 py-8">
                <div>
                    <h2 className="mt-4 text-2xl font-semibold">Extra Info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm leading-5 text-gray-700">
                    {place.extraInfo}
                </div>
            </div>
        </div>
    );
};

export default PlacePage;
