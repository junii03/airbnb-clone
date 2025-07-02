import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import AdminNav from '@/components/ui/AdminNav';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

const AdminRefundsPage = () => {
    const [refundRequests, setRefundRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [processModal, setProcessModal] = useState({ open: false, request: null });
    const [processData, setProcessData] = useState({
        status: '',
        adminNotes: '',
        refundAmount: '',
        refundMethod: 'original_payment'
    });
    const auth = useAuth();

    useEffect(() => {
        fetchRefundRequests();
    }, []);

    const fetchRefundRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/refunds/admin/all');
            setRefundRequests(data.refundRequests);
        } catch (error) {
            console.error('Error fetching refund requests:', error);
            toast.error('Failed to load refund requests');
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async () => {
        try {
            if (!processData.status) {
                toast.error('Please select a status');
                return;
            }

            await axiosInstance.put(`/refunds/admin/${processModal.request._id}/process`, processData);

            toast.success('Refund request processed successfully');
            setProcessModal({ open: false, request: null });
            setProcessData({
                status: '',
                adminNotes: '',
                refundAmount: '',
                refundMethod: 'original_payment'
            });
            fetchRefundRequests(); // Refresh the list
        } catch (error) {
            console.error('Error processing refund request:', error);
            toast.error('Failed to process refund request');
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

    const getPriorityColor = (reason) => {
        const priorityColors = {
            emergency: 'border-l-red-500',
            medical: 'border-l-red-500',
            host_issue: 'border-l-orange-500',
            property_issue: 'border-l-orange-500',
            change_of_plans: 'border-l-blue-500',
            other: 'border-l-gray-500'
        };
        return priorityColors[reason] || 'border-l-gray-500';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const filteredRequests = refundRequests.filter(request => {
        if (filter === 'all') return true;
        return request.status === filter;
    });

    // Check authentication
    if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
        return <Navigate to="/admin/login" />;
    }

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNav />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Refund Management</h1>
                    <p className="mt-2 text-gray-600">Manage customer refund and cancellation requests</p>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'under_review', 'approved', 'rejected', 'processed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                {status !== 'all' && (
                                    <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                                        {refundRequests.filter(r => r.status === status).length}
                                    </span>
                                )}
                                {status === 'all' && (
                                    <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                                        {refundRequests.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Refund Requests List */}
                {filteredRequests.length > 0 ? (
                    <div className="space-y-6">
                        {filteredRequests.map((request) => (
                            <div
                                key={request._id}
                                className={`bg-white rounded-lg shadow border-l-4 ${getPriorityColor(request.reason)} overflow-hidden`}
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {getRequestTypeDisplay(request.requestType)} Request
                                                </h3>
                                                {getStatusBadge(request.status)}
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {getReasonDisplay(request.reason)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {request.user ? request.user.name : request.name}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {request.user ? request.user.email : request.email}
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
                                        <div className="flex gap-2">
                                            {request.status === 'pending' && (
                                                <button
                                                    onClick={() => setProcessModal({ open: true, request })}
                                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                                >
                                                    Process
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    {(request.checkInDate || request.checkOutDate || request.totalAmount) && (
                                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Check-in:</span><br />
                                                    {request.checkInDate ? new Date(request.checkInDate).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Check-out:</span><br />
                                                    {request.checkOutDate ? new Date(request.checkOutDate).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Total Amount:</span><br />
                                                    {formatCurrency(request.totalAmount)}
                                                </div>
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No {filter === 'all' ? '' : filter.replace('_', ' ') + ' '}refund requests found
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'No refund requests have been submitted yet.'
                                : `No ${filter.replace('_', ' ')} refund requests found.`
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Process Modal */}
            {processModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Process Refund Request
                                </h3>
                                <button
                                    onClick={() => {
                                        setProcessModal({ open: false, request: null });
                                        setProcessData({
                                            status: '',
                                            adminNotes: '',
                                            refundAmount: '',
                                            refundMethod: 'original_payment'
                                        });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Request Summary */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    {getRequestTypeDisplay(processModal.request?.requestType)} - {getReasonDisplay(processModal.request?.reason)}
                                </h4>
                                <p className="text-gray-700 text-sm mb-2">
                                    From: {processModal.request?.user?.name || processModal.request?.name}
                                    ({processModal.request?.user?.email || processModal.request?.email})
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Amount: {formatCurrency(processModal.request?.totalAmount)}
                                </p>
                            </div>

                            {/* Process Form */}
                            <div className="space-y-4">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        value={processData.status}
                                        onChange={(e) => setProcessData({ ...processData, status: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">Select status</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="processed">Processed</option>
                                    </select>
                                </div>

                                {/* Refund Amount */}
                                {(processData.status === 'approved' || processData.status === 'processed') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Refund Amount
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={processData.refundAmount}
                                            onChange={(e) => setProcessData({ ...processData, refundAmount: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter refund amount"
                                        />
                                    </div>
                                )}

                                {/* Refund Method */}
                                {(processData.status === 'approved' || processData.status === 'processed') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Refund Method
                                        </label>
                                        <select
                                            value={processData.refundMethod}
                                            onChange={(e) => setProcessData({ ...processData, refundMethod: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="original_payment">Original Payment Method</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="check">Check</option>
                                            <option value="credit">Account Credit</option>
                                        </select>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        value={processData.adminNotes}
                                        onChange={(e) => setProcessData({ ...processData, adminNotes: e.target.value })}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Add notes about this decision..."
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setProcessModal({ open: false, request: null });
                                        setProcessData({
                                            status: '',
                                            adminNotes: '',
                                            refundAmount: '',
                                            refundMethod: 'original_payment'
                                        });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProcess}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Process Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRefundsPage;
