import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import axiosInstance from '@/utils/axios';

import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';

const PlacePage = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(false);

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

            <div className="mt-8 mb-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
                <div className="">
                    <div className="my-4 ">
                        <h2 className="text-2xl font-semibold">Description</h2>
                        {place.description}
                    </div>
                    Max number of guests: {place.maxGuests}
                    <PerksWidget perks={place?.perks} />

                    {/* Pre-booking Inquiry Button */}
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
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
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
