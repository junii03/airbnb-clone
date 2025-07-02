import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

const MyRefundsPage = () => {
    const [refundRequests, setRefundRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchRefundRequests();
    }, []);

    const fetchRefundRequests = async () => {
        try {
            setLoading(true);
            console.log('Fetching refund requests for user:', user?.email);
            const { data } = await axiosInstance.get('/refunds/user');
            console.log('Refund requests response:', data);
            setRefundRequests(data.refundRequests || []);
        } catch (error) {
            console.error('Error fetching refund requests:', error);
            const errorMessage = error.response?.data?.message || 'Failed to load refund requests';
            toast.error(errorMessage);

            // If it's an authentication error, the axios interceptor will handle it
            if (error.response?.status === 401) {
                console.log('Authentication error - user will be redirected to login');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            under_review: { color: 'bg-blue-100 text-blue-800', text: 'Under Review' },
            approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
            processed: { color: 'bg-purple-100 text-purple-800', text: 'Processed' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getRequestTypeDisplay = (type) => {
        const typeMap = {
            cancellation: 'Cancellation',
            refund: 'Refund',
            partial_refund: 'Partial Refund',
            emergency_cancellation: 'Emergency Cancellation'
        };
        return typeMap[type] || type;
    };

    const getReasonDisplay = (reason) => {
        const reasonMap = {
            change_of_plans: 'Change of Plans',
            emergency: 'Emergency',
            host_issue: 'Host Issue',
            property_issue: 'Property Issue',
            medical: 'Medical',
            other: 'Other'
        };
        return reasonMap[reason] || reason;
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
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
                        <h1 className="text-3xl font-semibold text-gray-900">My Refund Requests</h1>
                        <p className="mt-2 text-gray-600">Track your refund and cancellation requests</p>
                    </div>
                    <Link
                        to="/refund-cancellation"
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Request
                    </Link>
                </div>

                {refundRequests?.length > 0 ? (
                    <div className="space-y-6">
                        {refundRequests.map((request) => (
                            <div key={request._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {getRequestTypeDisplay(request.requestType)} Request
                                                </h3>
                                                {getStatusBadge(request.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    {getReasonDisplay(request.reason)}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(request.createdAt)}
                                                </span>
                                                {request.bookingReference && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Booking: {request.bookingReference}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    {(request.checkInDate || request.checkOutDate || request.totalAmount) && (
                                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                {request.checkInDate && (
                                                    <div>
                                                        <span className="font-medium">Check-in:</span><br />
                                                        {new Date(request.checkInDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                                {request.checkOutDate && (
                                                    <div>
                                                        <span className="font-medium">Check-out:</span><br />
                                                        {new Date(request.checkOutDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                                {request.totalAmount && (
                                                    <div>
                                                        <span className="font-medium">Total Amount:</span><br />
                                                        {formatCurrency(request.totalAmount)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Request Description:</h4>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.description}</p>
                                    </div>

                                    {/* Refund Information */}
                                    {(request.refundAmount || request.refundMethod) && (
                                        <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                            <h4 className="font-medium text-green-900 mb-2">Refund Information</h4>
                                            <div className="text-sm text-green-800">
                                                {request.refundAmount && (
                                                    <p>Approved Amount: <span className="font-medium">{formatCurrency(request.refundAmount)}</span></p>
                                                )}
                                                {request.refundMethod && (
                                                    <p>Refund Method: <span className="font-medium">{request.refundMethod.replace('_', ' ')}</span></p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Admin Notes */}
                                    {request.adminNotes && (
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <h4 className="font-medium text-gray-900">Admin Notes</h4>
                                                {request.processedAt && (
                                                    <span className="text-sm text-gray-500">
                                                        • {formatDate(request.processedAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                                {request.adminNotes}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Refund Requests Yet</h3>
                        <p className="text-gray-600 mb-6">
                            You haven't submitted any refund or cancellation requests yet.
                        </p>
                        <Link
                            to="/refund-cancellation"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                            </svg>
                            Submit Your First Request
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRefundsPage;
