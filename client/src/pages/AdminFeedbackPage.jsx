import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import AdminNav from '@/components/ui/AdminNav';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

const AdminFeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [responseModal, setResponseModal] = useState({ open: false, feedback: null });
    const [response, setResponse] = useState('');
    const auth = useAuth();

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/feedback/admin/all');
            setFeedback(data.feedback);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            toast.error('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (feedbackId) => {
        try {
            if (!response.trim()) {
                toast.error('Please enter a response');
                return;
            }

            await axiosInstance.put(`/feedback/admin/${feedbackId}/respond`, {
                response: response
            });

            toast.success('Response sent successfully');
            setResponseModal({ open: false, feedback: null });
            setResponse('');
            fetchFeedback(); // Refresh the list
        } catch (error) {
            console.error('Error sending response:', error);
            toast.error('Failed to send response');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            reviewed: { color: 'bg-blue-100 text-blue-800', text: 'Reviewed' },
            resolved: { color: 'bg-green-100 text-green-800', text: 'Resolved' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getTypeDisplay = (type) => {
        const typeMap = {
            complaint: 'Complaint',
            suggestion: 'Suggestion',
            compliment: 'Compliment',
            bug_report: 'Bug Report',
            general: 'General'
        };
        return typeMap[type] || type;
    };

    const getPriorityColor = (type) => {
        const priorityColors = {
            complaint: 'border-l-red-500',
            bug_report: 'border-l-orange-500',
            suggestion: 'border-l-blue-500',
            compliment: 'border-l-green-500',
            general: 'border-l-gray-500'
        };
        return priorityColors[type] || 'border-l-gray-500';
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

    const filteredFeedback = feedback.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
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
                    <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
                    <p className="mt-2 text-gray-600">Manage customer feedback and responses</p>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'reviewed', 'resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                {status !== 'all' && (
                                    <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                                        {feedback.filter(f => f.status === status).length}
                                    </span>
                                )}
                                {status === 'all' && (
                                    <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                                        {feedback.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feedback List */}
                {filteredFeedback.length > 0 ? (
                    <div className="space-y-6">
                        {filteredFeedback.map((item) => (
                            <div
                                key={item._id}
                                className={`bg-white rounded-lg shadow border-l-4 ${getPriorityColor(item.type)} overflow-hidden`}
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {item.subject}
                                                </h3>
                                                {getStatusBadge(item.status)}
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {getTypeDisplay(item.type)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {item.user ? item.user.name : item.name}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {item.user ? item.user.email : item.email}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {formatDate(item.createdAt)}
                                                </span>
                                                {item.rating && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                        {item.rating}/5
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!item.adminResponse && (
                                                <button
                                                    onClick={() => setResponseModal({ open: true, feedback: item })}
                                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                                >
                                                    Respond
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{item.message}</p>
                                    </div>

                                    {/* Admin Response */}
                                    {item.adminResponse && (
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <h4 className="font-medium text-gray-900">Your Response</h4>
                                                {item.respondedAt && (
                                                    <span className="text-sm text-gray-500">
                                                        • {formatDate(item.respondedAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                                {item.adminResponse}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No {filter === 'all' ? '' : filter + ' '}feedback found
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'No feedback has been submitted yet.'
                                : `No ${filter} feedback found.`
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Response Modal */}
            {responseModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Respond to Feedback
                                </h3>
                                <button
                                    onClick={() => {
                                        setResponseModal({ open: false, feedback: null });
                                        setResponse('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Original Feedback */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    {responseModal.feedback?.subject}
                                </h4>
                                <p className="text-gray-700 text-sm mb-2">
                                    From: {responseModal.feedback?.user?.name || responseModal.feedback?.name}
                                    ({responseModal.feedback?.user?.email || responseModal.feedback?.email})
                                </p>
                                <p className="text-gray-700">
                                    {responseModal.feedback?.message}
                                </p>
                            </div>

                            {/* Response Form */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Response
                                </label>
                                <textarea
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    rows={6}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter your response to this feedback..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setResponseModal({ open: false, feedback: null });
                                        setResponse('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleRespond(responseModal.feedback._id)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Send Response
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedbackPage;
