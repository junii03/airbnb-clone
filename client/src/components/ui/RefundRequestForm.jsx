import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import axiosInstance from '@/utils/axios';

const RefundRequestForm = () => {
    const [formData, setFormData] = useState({
        bookingId: '',
        requestType: 'cancellation',
        reason: '',
        name: '',
        contactEmail: '',
        additionalDetails: ''
    });
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Map frontend form values to backend enum values
            const requestTypeMapping = {
                'cancellation': 'cancellation',
                'refund': 'refund',
                'modification': 'partial_refund' // Map modification to partial_refund
            };

            const reasonMapping = {
                'emergency': 'emergency',
                'property_issue': 'property_issue',
                'host_cancelled': 'host_issue',
                'travel_restrictions': 'change_of_plans',
                'other': 'other'
            };

            // Map frontend form data to backend API format
            const submissionData = {
                bookingReference: formData.bookingId,
                requestType: requestTypeMapping[formData.requestType] || 'refund',
                reason: reasonMapping[formData.reason] || 'other',
                name: formData.name,
                email: formData.contactEmail,
                description: formData.additionalDetails
            };

            const response = await axiosInstance.post('/refunds', submissionData);

            if (response.data.success) {
                setIsSubmitting(false);
                setShowDialog(true);
                toast.success('Request submitted successfully!');
            }
        } catch (error) {
            setIsSubmitting(false);
            const message = error.response?.data?.message || 'Failed to submit request';
            toast.error(message);
            console.error('Error submitting refund request:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            bookingId: '',
            requestType: 'cancellation',
            reason: '',
            name: '',
            contactEmail: '',
            additionalDetails: ''
        });
        setShowDialog(false);
    };

    return (
        <>
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Submit a Request</h2>
                    <p className="text-gray-600">Fill out the form below to request a refund or cancellation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
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
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Booking ID */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Booking ID *
                        </label>
                        <input
                            type="text"
                            name="bookingId"
                            value={formData.bookingId}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your booking ID (e.g., BK123456)"
                            required
                        />
                    </div>

                    {/* Request Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Request Type *
                        </label>
                        <select
                            name="requestType"
                            value={formData.requestType}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="cancellation">Cancellation</option>
                            <option value="refund">Refund Request</option>
                            <option value="modification">Booking Modification</option>
                        </select>
                    </div>

                    {/* Contact Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contact Email *
                        </label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Reason for Request *
                        </label>
                        <select
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Select a reason</option>
                            <option value="emergency">Emergency/Unforeseen circumstances</option>
                            <option value="property_issue">Property not as described</option>
                            <option value="host_cancelled">Host cancelled booking</option>
                            <option value="travel_restrictions">Travel restrictions</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Additional Details */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Additional Details
                        </label>
                        <textarea
                            name="additionalDetails"
                            value={formData.additionalDetails}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Provide any additional information that might help us process your request..."
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full transition-colors"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </div>
                        ) : (
                            'Submit Request'
                        )}
                    </Button>
                </form>
            </div>

            {/* Success Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">Request Submitted Successfully!</DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-gray-600">
                            Your request has been received and will be processed within 24-48 hours.
                            You will receive an email confirmation shortly.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={resetForm}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                            >
                                Submit Another Request
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

export default RefundRequestForm;
