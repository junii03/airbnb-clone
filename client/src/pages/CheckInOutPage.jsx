import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AccountNav from '../components/ui/AccountNav';
import AddressLink from '../components/ui/AddressLink';
import BookingDates from '../components/ui/BookingDates';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Spinner from '../components/ui/Spinner';
import axiosInstance from '../utils/axios';

const CheckInOutPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState({});
    const [loading, setLoading] = useState(false);
    const [processType, setProcessType] = useState(''); // 'checkin' or 'checkout'
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        guestName: '',
        guestPhone: '',
        numberOfGuests: 1,
        specialRequests: '',
        emergencyContact: '',
        checkInTime: '',
        checkOutTime: '',
        propertyCondition: '',
        damageReport: '',
        rating: 5,
        feedback: ''
    });

    const getBooking = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/bookings');
            const filteredBooking = data.booking.filter(
                (booking) => booking._id === id,
            );
            setBooking(filteredBooking[0]);
        } catch (error) {
            console.log('Error: ', error);
            toast.error('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBooking();
        // Determine if this is check-in or check-out based on current date
        const today = new Date();
        const checkIn = new Date(booking?.checkIn);
        const checkOut = new Date(booking?.checkOut);

        if (today >= checkIn && today < checkOut) {
            setProcessType('checkin');
        } else if (today >= checkOut) {
            setProcessType('checkout');
        }
    }, [id, booking?.checkIn, booking?.checkOut]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success(`${processType === 'checkin' ? 'Check-in' : 'Check-out'} completed successfully!`);
            navigate(`/account/bookings/${id}`);
        } catch (error) {
            toast.error('Process failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !booking?.place) {
        return <Spinner />;
    }

    const renderCheckInSteps = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Stay!</h2>
                            <p className="mt-2 text-gray-600">Let's get you checked in</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
                                <Input
                                    name="guestName"
                                    value={formData.guestName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <Input
                                    name="guestPhone"
                                    value={formData.guestPhone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                                <Input
                                    type="number"
                                    name="numberOfGuests"
                                    value={formData.numberOfGuests}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                                <Input
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleInputChange}
                                    placeholder="Emergency contact number"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Check-in Details</h2>
                            <p className="mt-2 text-gray-600">Confirm your arrival time and special requests</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                                <Input
                                    type="time"
                                    name="checkInTime"
                                    value={formData.checkInTime}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                                <textarea
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    placeholder="Any special requests or requirements?"
                                    rows="4"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Check-in Complete!</h2>
                            <p className="mt-2 text-gray-600">You're all set. Enjoy your stay!</p>
                        </div>

                        <div className="rounded-lg bg-green-50 p-6">
                            <h3 className="font-semibold text-green-800 mb-2">Important Information:</h3>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>• WiFi password: Available in your welcome packet</li>
                                <li>• Check-out time: 11:00 AM</li>
                                <li>• Emergency contact: Available 24/7</li>
                                <li>• House rules: Please review the guidelines</li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderCheckOutSteps = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Check-out Process</h2>
                            <p className="mt-2 text-gray-600">Let's get you checked out</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                                <Input
                                    type="time"
                                    name="checkOutTime"
                                    value={formData.checkOutTime}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Condition</label>
                                <textarea
                                    name="propertyCondition"
                                    value={formData.propertyCondition}
                                    onChange={handleInputChange}
                                    placeholder="Please describe the current condition of the property"
                                    rows="4"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Damage Report (if any)</label>
                                <textarea
                                    name="damageReport"
                                    value={formData.damageReport}
                                    onChange={handleInputChange}
                                    placeholder="Report any damages or issues"
                                    rows="3"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Rate Your Stay</h2>
                            <p className="mt-2 text-gray-600">How was your experience?</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex justify-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                            className={`text-3xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                                <textarea
                                    name="feedback"
                                    value={formData.feedback}
                                    onChange={handleInputChange}
                                    placeholder="Share your experience with us"
                                    rows="4"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Check-out Complete!</h2>
                            <p className="mt-2 text-gray-600">Thank you for staying with us!</p>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-6">
                            <h3 className="font-semibold text-blue-800 mb-2">What's Next:</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Your security deposit will be refunded within 3-5 business days</li>
                                <li>• A receipt will be sent to your email</li>
                                <li>• We hope to welcome you back soon!</li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const maxSteps = 3;
    const isLastStep = currentStep === maxSteps;
    const isFirstStep = currentStep === 1;

    return (
        <div className="min-h-screen bg-gray-50">
            <AccountNav />

            {booking?.place ? (
                <div className="mx-auto max-w-2xl p-4">
                    {/* Property Header */}
                    <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900">{booking?.place?.title}</h1>
                        <AddressLink
                            className="mt-2 block text-gray-600"
                            placeAddress={booking.place?.address}
                        />
                        <div className="mt-4">
                            <BookingDates booking={booking} />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            {Array.from({ length: maxSteps }, (_, i) => (
                                <div key={i} className="flex items-center">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${i + 1 <= currentStep
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {i + 1}
                                    </div>
                                    {i < maxSteps - 1 && (
                                        <div
                                            className={`mx-2 h-1 w-16 rounded-full ${i + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-center text-sm text-gray-600">
                            Step {currentStep} of {maxSteps}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        {processType === 'checkin' ? renderCheckInSteps() : renderCheckOutSteps()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex justify-between space-x-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevStep}
                            disabled={isFirstStep}
                            className="flex-1"
                        >
                            Previous
                        </Button>

                        {isLastStep ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? 'Processing...' : `Complete ${processType === 'checkin' ? 'Check-in' : 'Check-out'}`}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNextStep}
                                className="flex-1"
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <h1 className="text-xl text-gray-600">No booking data found</h1>
                </div>
            )}
        </div>
    );
};

export default CheckInOutPage;
