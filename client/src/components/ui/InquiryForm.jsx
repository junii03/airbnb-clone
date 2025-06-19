import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';

const InquiryForm = () => {
    const [searchParams] = useSearchParams();
    const propertyIdFromUrl = searchParams.get('propertyId');
    const propertyTitleFromUrl = searchParams.get('propertyTitle');

    const [formData, setFormData] = useState({
        propertyId: '',
        inquiryType: 'property_details',
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: '1',
        subject: '',
        message: ''
    });
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-populate form when coming from a specific property page
    useEffect(() => {
        if (propertyIdFromUrl) {
            setFormData(prev => ({
                ...prev,
                propertyId: propertyIdFromUrl,
                subject: propertyTitleFromUrl ? `Inquiry about: ${propertyTitleFromUrl}` : 'Property inquiry'
            }));
        }
    }, [propertyIdFromUrl, propertyTitleFromUrl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowDialog(true);
            toast.success('Inquiry submitted successfully!');
        }, 1000);
    };

    const resetForm = () => {
        setFormData({
            propertyId: '',
            inquiryType: 'property_details',
            name: '',
            email: '',
            phone: '',
            checkIn: '',
            checkOut: '',
            guests: '1',
            subject: '',
            message: ''
        });
        setShowDialog(false);
    };

    return (
        <>
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Send Your Inquiry</h2>
                    <p className="text-gray-600">Fill out the details below and we'll get back to you within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Property ID and Inquiry Type Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Property ID (Optional)
                            </label>
                            <input
                                type="text"
                                name="propertyId"
                                value={formData.propertyId}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., PL123456"
                            />
                            <p className="text-xs text-gray-500 mt-1">If you have a specific property in mind</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Inquiry Type *
                            </label>
                            <select
                                name="inquiryType"
                                value={formData.inquiryType}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            >
                                <option value="property_details">Property Details</option>
                                <option value="availability">Availability Check</option>
                                <option value="special_requests">Special Requests</option>
                                <option value="local_info">Local Information</option>
                                <option value="pricing">Pricing & Discounts</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Personal Information Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    {/* Travel Details Row */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Travel Details (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Check-in Date
                                </label>
                                <input
                                    type="date"
                                    name="checkIn"
                                    value={formData.checkIn}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Check-out Date
                                </label>
                                <input
                                    type="date"
                                    name="checkOut"
                                    value={formData.checkOut}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Number of Guests
                                </label>
                                <select
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Brief description of your inquiry"
                            required
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Message *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Please provide detailed information about your inquiry. The more specific you are, the better we can assist you..."
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-12 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full transition-colors"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending Inquiry...
                                </div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send Inquiry
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Success Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">Inquiry Sent Successfully!</DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <p className="font-semibold text-gray-900">Thank you for your inquiry!</p>
                            <p className="text-gray-600 text-sm">
                                We've received your message and will respond within 24 hours.
                                Please check your email for a confirmation.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={resetForm}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                            >
                                Send Another Inquiry
                            </Button>
                            <Button
                                onClick={() => setShowDialog(false)}
                                variant="outline"
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InquiryForm;
