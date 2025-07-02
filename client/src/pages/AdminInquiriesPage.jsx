import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNav from '@/components/ui/AdminNav';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

const AdminInquiriesPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(null);
    const [response, setResponse] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const auth = useAuth();

    useEffect(() => {
        if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
            return;
        }
        fetchInquiries();
    }, [auth.user, statusFilter]);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
            const { data } = await axiosInstance.get(`/inquiries/admin/all${params}`);
            setInquiries(data.inquiries || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (inquiryId) => {
        if (!response.trim()) {
            toast.error('Please enter a response');
            return;
        }

        try {
            await axiosInstance.put(`/inquiries/admin/${inquiryId}/respond`, {
                response: response.trim()
            });

            toast.success('Response sent successfully');
            setResponding(null);
            setResponse('');
            fetchInquiries(); // Refresh the list
        } catch (error) {
            console.error('Error sending response:', error);
            toast.error('Failed to send response');
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

    // Check authentication
    if (!auth.user || !auth.user.isAdmin || auth.user.role !== 'admin') {
        return <Navigate to="/admin/login" />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <AdminNav />
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNav />

            <div className="max-w-7xl mx-auto py-6 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Inquiry Management</h1>
                    <p className="text-gray-600 mt-2">Manage and respond to customer inquiries</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Inquiries</option>
                        <option value="pending">Pending</option>
                        <option value="responded">Responded</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <Button
                        onClick={fetchInquiries}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        Refresh
                    </Button>
                </div>

                {/* Inquiries List */}
                {inquiries.length > 0 ? (
                    <div className="space-y-6">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{inquiry.subject}</h3>
                                                {getStatusBadge(inquiry.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>{getInquiryTypeDisplay(inquiry.inquiryType)}</span>
                                                <span>•</span>
                                                <span>{formatDate(inquiry.createdAt)}</span>
                                                <span>•</span>
                                                <span>{inquiry.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Name:</span> {inquiry.name}
                                            </div>
                                            <div>
                                                <span className="font-medium">Email:</span> {inquiry.email}
                                            </div>
                                            {inquiry.phone && (
                                                <div>
                                                    <span className="font-medium">Phone:</span> {inquiry.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Property Info */}
                                    {inquiry.property && (
                                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">Property Information</h4>
                                            <div className="flex items-center gap-3">
                                                {inquiry.property.photos?.[0] && (
                                                    <img
                                                        src={inquiry.property.photos[0]}
                                                        alt={inquiry.property.title}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium">{inquiry.property.title}</p>
                                                    <p className="text-sm text-gray-600">{inquiry.property.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Travel Details */}
                                    {(inquiry.checkIn || inquiry.checkOut || inquiry.guests > 1) && (
                                        <div className="mb-4 p-4 bg-green-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">Travel Details</h4>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                {inquiry.checkIn && (
                                                    <span>Check-in: {new Date(inquiry.checkIn).toLocaleDateString()}</span>
                                                )}
                                                {inquiry.checkOut && (
                                                    <span>Check-out: {new Date(inquiry.checkOut).toLocaleDateString()}</span>
                                                )}
                                                {inquiry.guests > 1 && (
                                                    <span>Guests: {inquiry.guests}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Message */}
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Customer Message</h4>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>
                                    </div>

                                    {/* Admin Response */}
                                    {inquiry.adminResponse ? (
                                        <div className="mb-4 border-t pt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <h4 className="font-semibold text-gray-900">Admin Response</h4>
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
                                    ) : responding === inquiry._id ? (
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Send Response</h4>
                                            <textarea
                                                value={response}
                                                onChange={(e) => setResponse(e.target.value)}
                                                rows={4}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="Type your response here..."
                                            />
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    onClick={() => handleRespond(inquiry._id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    Send Response
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setResponding(null);
                                                        setResponse('');
                                                    }}
                                                    variant="outline"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-t pt-4">
                                            <Button
                                                onClick={() => setResponding(inquiry._id)}
                                                className="bg-primary hover:bg-primary/90 text-white"
                                            >
                                                Respond to Inquiry
                                            </Button>
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Inquiries Found</h3>
                        <p className="text-gray-600">
                            {statusFilter === 'all'
                                ? 'No customer inquiries have been submitted yet.'
                                : `No ${statusFilter} inquiries found.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInquiriesPage;
