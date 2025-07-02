import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';
import axiosInstance from '@/utils/axios';
import { useAuth } from '../../hooks';

const MyFeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            console.log('Fetching feedback for user:', user?.email);
            const { data } = await axiosInstance.get('/feedback/user');
            console.log('Feedback response:', data);
            setFeedback(data.feedback || []);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            const errorMessage = error.response?.data?.message || 'Failed to load feedback';
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
                        <h1 className="text-3xl font-semibold text-gray-900">My Feedback</h1>
                        <p className="mt-2 text-gray-600">Track your submitted feedback and responses</p>
                    </div>
                    <Link
                        to="/feedback"
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Submit Feedback
                    </Link>
                </div>

                {feedback?.length > 0 ? (
                    <div className="space-y-6">
                        {feedback.map((item) => (
                            <div key={item._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{item.subject}</h3>
                                                {getStatusBadge(item.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    {getTypeDisplay(item.type)}
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
                                    </div>

                                    {/* Message */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Your Feedback:</h4>
                                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{item.message}</p>
                                    </div>

                                    {/* Admin Response */}
                                    {item.adminResponse && (
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <h4 className="font-medium text-gray-900">Response from Support</h4>
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Feedback Yet</h3>
                        <p className="text-gray-600 mb-6">
                            You haven't submitted any feedback yet. Share your thoughts to help us improve.
                        </p>
                        <Link
                            to="/feedback"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6" />
                            </svg>
                            Submit Your First Feedback
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFeedbackPage;
