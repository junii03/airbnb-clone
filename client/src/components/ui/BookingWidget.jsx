import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';

import { useAuth } from '../../../hooks';
import axiosInstance from '@/utils/axios';
import DatePickerWithRange from './DatePickerWithRange';

const BookingWidget = ({ place }) => {
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [bookingData, setBookingData] = useState({
        noOfGuests: 1,
        name: '',
        phone: '',
    });
    const [redirect, setRedirect] = useState('');
    const { user } = useAuth();

    const { noOfGuests, name, phone } = bookingData;
    const { _id: id, price, owner } = place;

    // Check if current user is the owner of this accommodation
    const isOwner = user && owner && (user.id === owner._id || user.id === owner);

    useEffect(() => {
        if (user) {
            setBookingData({ ...bookingData, name: user.name });
        }
    }, [user]);

    const numberOfNights =
        dateRange.from && dateRange.to
            ? differenceInDays(
                new Date(dateRange.to).setHours(0, 0, 0, 0),
                new Date(dateRange.from).setHours(0, 0, 0, 0),
            )
            : 0;

    // handle booking form
    const handleBookingData = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleBooking = async () => {
        // User must be signed in to book place
        if (!user) {
            return setRedirect(`/login`);
        }

        // Prevent users from booking their own accommodation
        if (isOwner) {
            return toast.error('You cannot book your own accommodation');
        }

        // BOOKING DATA VALIDATION
        if (numberOfNights < 1) {
            return toast.error('Please select valid dates');
        } else if (noOfGuests < 1) {
            return toast.error("No. of guests can't be less than 1");
        } else if (noOfGuests > place.maxGuests) {
            return toast.error(`Allowed max. no. of guests: ${place.maxGuests}`);
        } else if (name.trim() === '') {
            return toast.error("Name can't be empty");
        } else if (phone.trim() === '') {
            return toast.error("Phone can't be empty");
        }

        try {
            const response = await axiosInstance.post('/bookings', {
                checkIn: dateRange.from,
                checkOut: dateRange.to,
                noOfGuests,
                name,
                phone,
                place: id,
                price: numberOfNights * price,
            });

            const bookingId = response.data.booking._id;

            setRedirect(`/account/bookings/${bookingId}`);
            toast('Congratulations! Enjoy your trip.');
        } catch (error) {
            // Handle the specific error for booking own accommodation
            if (error.response?.status === 403) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Something went wrong!');
            }
            console.log('Error: ', error);
        }
    };

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    // Show different content if user owns this accommodation
    if (isOwner) {
        return (
            <div className="rounded-2xl bg-white p-4 shadow-xl">
                <div className="text-center">
                    <div className="mb-4 text-xl font-semibold text-gray-700">
                        This is Your Accommodation
                    </div>
                    <div className="mb-4 text-gray-600">
                        You cannot book your own property, but you can manage it from your account.
                    </div>
                    <div className="space-y-2">
                        <a
                            href={`/account/places/${id}`}
                            className="block w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Edit This Accommodation
                        </a>
                        <a
                            href="/account/places"
                            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            View All My Accommodations
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white p-4 shadow-xl">
            <div className="text-center text-xl">
                Price: <span className="font-semibold">Rs{place.price}</span> / per night
            </div>
            <div className="mt-4 rounded-2xl border">
                <div className="flex w-full ">
                    <DatePickerWithRange setDateRange={setDateRange} />
                </div>
                <div className="border-t py-3 px-4">
                    <label>Number of guests: </label>
                    <input
                        type="number"
                        name="noOfGuests"
                        placeholder={`Max. guests: ${place.maxGuests}`}
                        min={1}
                        max={place.maxGuests}
                        value={noOfGuests}
                        onChange={handleBookingData}
                    />
                </div>
                <div className="border-t py-3 px-4">
                    <label>Your full name: </label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleBookingData}
                    />
                    <label>Phone number: </label>
                    <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={handleBookingData}
                    />
                </div>
            </div>
            <button onClick={handleBooking} className="primary mt-4">
                Book this place
                {numberOfNights > 0 && <span> Rs{numberOfNights * place.price}</span>}
            </button>
        </div>
    );
};

export default BookingWidget;
