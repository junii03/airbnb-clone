import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

const MyInquiriesPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/inquiries/user');
            setInquiries(data.inquiries);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            responded: { color: 'bg-blue-100 text-blue-800', text: 'Responded' },
            resolved: { color: 'bg-green-100 text-green-800', text: 'Resolved' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getInquiryTypeDisplay = (type) => {
        const typeMap = {
            property_details: 'Property Details',
            availability: 'Availability Check',
            special_requests: 'Special Requests',
            local_info: 'Local Information',
            pricing: 'Pricing & Discounts',
            other: 'Other'
        };
        return typeMap[type] || type;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="flex flex-col items-center">
            <AccountNav />

            <div className="w-full max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">My Inquiries</h1>
                        <p className="mt-2 text-gray-600">Track your property inquiries and responses</p>
                    </div>
                    <Link
                        to="/pre-booking-inquiry"
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Inquiry
                    </Link>
                </div>

                {inquiries?.length > 0 ? (
                    <div className="space-y-6">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{inquiry.subject}</h3>
                                                {getStatusBadge(inquiry.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    {getInquiryTypeDisplay(inquiry.inquiryType)}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(inquiry.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Information */}
                                    {inquiry.property && (
                                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {inquiry.property.photos?.[0] && (
                                                    <img
                                                        src={inquiry.property.photos[0]}
                                                        alt={inquiry.property.title}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{inquiry.property.title}</h4>
                                                    <p className="text-sm text-gray-600">{inquiry.property.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Travel Details */}
                                    {(inquiry.checkIn || inquiry.checkOut || inquiry.guests > 1) && (
                                        <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                                            {inquiry.checkIn && (
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Check-in: {new Date(inquiry.checkIn).toLocaleDateString()}
                                                </span>
                                            )}
                                            {inquiry.checkOut && (
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Check-out: {new Date(inquiry.checkOut).toLocaleDateString()}
                                                </span>
                                            )}
                                            {inquiry.guests > 1 && (
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                    </svg>
                                                    {inquiry.guests} guests
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Message */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Your Message:</h4>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>
                                    </div>

                                    {/* Admin Response */}
                                    {inquiry.adminResponse && (
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <h4 className="font-medium text-gray-900">Response from Support</h4>
                                                {inquiry.respondedAt && (
                                                    <span className="text-sm text-gray-500">
                                                        • {formatDate(inquiry.respondedAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                                {inquiry.adminResponse}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Inquiries Yet</h3>
                        <p className="text-gray-600 mb-6">
                            You haven't submitted any inquiries yet. Start by asking about properties you're interested in.
                        </p>
                        <Link
                            to="/pre-booking-inquiry"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submit Your First Inquiry
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInquiriesPage;
