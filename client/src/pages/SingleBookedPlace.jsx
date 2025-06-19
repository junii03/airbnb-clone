import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import AccountNav from '../components/ui/AccountNav';
import AddressLink from '../components/ui/AddressLink';
import BookingDates from '../components/ui/BookingDates';
import { Button } from '../components/ui/button';
import PlaceGallery from '../components/ui/PlaceGallery';
import Spinner from '../components/ui/Spinner';
import axiosInstance from '../utils/axios';

const SingleBookedPlace = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState({});
    const [loading, setLoading] = useState(false);

    const getBookings = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/bookings');

            // filter the data to get current booking
            const filteredBooking = data.booking.filter(
                (booking) => booking._id === id,
            );

            setBooking(filteredBooking[0]);
        } catch (error) {
            console.log('Error: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookings();
    }, [id]);

    // Helper function to determine check-in/check-out status
    const getBookingStatus = () => {
        if (!booking?.checkIn || !booking?.checkOut) return null;

        const today = new Date();
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);

        if (today < checkIn) {
            return { status: 'upcoming', label: 'Upcoming Stay' };
        } else if (today >= checkIn && today < checkOut) {
            return { status: 'active', label: 'Active Stay - Ready for Check-in' };
        } else if (today >= checkOut) {
            return { status: 'checkout', label: 'Ready for Check-out' };
        }
        return null;
    };

    const bookingStatus = getBookingStatus();

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <AccountNav />
            {booking?.place ? (
                <div className="p-4">
                    <h1 className="text-3xl">{booking?.place?.title}</h1>

                    <AddressLink
                        className="my-2 block"
                        placeAddress={booking.place?.address}
                    />

                    <div className="my-6 flex flex-col items-center justify-between rounded-2xl bg-gray-200 p-6 sm:flex-row">
                        <div className="w-full sm:w-auto">
                            <h2 className="mb-4 text-2xl md:text-2xl">
                                Your booking information
                            </h2>
                            <BookingDates booking={booking} />

                            {/* Booking Status and Action Buttons */}
                            {bookingStatus && (
                                <div className="mt-4">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${bookingStatus.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                        bookingStatus.status === 'active' ? 'bg-green-100 text-green-800' :
                                            'bg-orange-100 text-orange-800'
                                        }`}>
                                        {bookingStatus.label}
                                    </div>

                                    {(bookingStatus.status === 'active' || bookingStatus.status === 'checkout') && (
                                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                            <Link to={`/account/bookings/${id}/check-in-out`}>
                                                <Button
                                                    className="w-full sm:w-auto"
                                                    variant={bookingStatus.status === 'active' ? 'default' : 'outline'}
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                    {bookingStatus.status === 'active' ? 'Start Check-in' : 'Start Check-out'}
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-5 w-full rounded-2xl bg-primary p-6 text-white sm:mt-0 sm:w-auto">
                            <div className="hidden md:block">Total price</div>
                            <div className="flex justify-center text-3xl">
                                <span>Rs{booking?.price}</span>
                            </div>
                        </div>
                    </div>

                    <PlaceGallery place={booking?.place} />
                </div>
            ) : (
                <h1> No data</h1>
            )}
        </div>
    );
};

export default SingleBookedPlace;
