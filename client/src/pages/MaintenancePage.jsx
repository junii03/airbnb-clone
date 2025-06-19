import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AccountNav from '../components/ui/AccountNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Spinner from '../components/ui/Spinner';
import axiosInstance from '../utils/axios';

const MaintenancePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('report');
    const [places, setPlaces] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [formData, setFormData] = useState({
        placeId: '',
        title: '',
        description: '',
        priority: 'medium',
        category: 'plumbing',
        urgency: 'normal',
        location: '',
        tenantContact: '',
        preferredTime: '',
        images: []
    });

    // Mock data for demonstration
    const mockRequests = [
        {
            id: 1,
            title: 'Leaking Faucet in Kitchen',
            description: 'Kitchen sink faucet has been dripping constantly',
            priority: 'high',
            category: 'plumbing',
            status: 'in-progress',
            place: 'Downtown Apartment',
            dateReported: '2025-06-15',
            estimatedCompletion: '2025-06-20'
        },
        {
            id: 2,
            title: 'Air Conditioning Not Working',
            description: 'AC unit in living room stopped cooling',
            priority: 'high',
            category: 'hvac',
            status: 'pending',
            place: 'Beach House Villa',
            dateReported: '2025-06-18',
            estimatedCompletion: 'TBD'
        },
        {
            id: 3,
            title: 'Light Bulb Replacement',
            description: 'Multiple light bulbs need replacement in bedrooms',
            priority: 'low',
            category: 'electrical',
            status: 'completed',
            place: 'City Center Loft',
            dateReported: '2025-06-10',
            estimatedCompletion: '2025-06-12'
        }
    ];

    useEffect(() => {
        fetchPlaces();
        setMaintenanceRequests(mockRequests);
    }, []);

    const fetchPlaces = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('places/user-places');
            setPlaces(data);
        } catch (error) {
            console.log('Error fetching places:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: Array.from(files)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();

        if (!formData.placeId || !formData.title || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newRequest = {
                id: Date.now(),
                ...formData,
                status: 'pending',
                dateReported: new Date().toISOString().split('T')[0],
                estimatedCompletion: 'TBD',
                place: places.find(p => p._id === formData.placeId)?.title || 'Unknown Property'
            };

            setMaintenanceRequests(prev => [newRequest, ...prev]);
            setFormData({
                placeId: '',
                title: '',
                description: '',
                priority: 'medium',
                category: 'plumbing',
                urgency: 'normal',
                location: '',
                tenantContact: '',
                preferredTime: '',
                images: []
            });

            toast.success('Maintenance request submitted successfully!');
            setActiveTab('requests');
        } catch (error) {
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'plumbing':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                );
            case 'electrical':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'hvac':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                );
            case 'general':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                );
        }
    };

    if (loading && places.length === 0) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AccountNav />

            <div className="mx-auto max-w-6xl p-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Maintenance & Issue Resolution
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage property maintenance requests and track their progress
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('report')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'report'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Report Issue
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            My Requests ({maintenanceRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Analytics
                        </button>
                    </nav>
                </div>

                {/* Report Issue Tab */}
                {activeTab === 'report' && (
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Submit New Maintenance Request</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Provide detailed information about the maintenance issue
                            </p>
                        </div>

                        <form onSubmit={handleSubmitRequest} className="space-y-6">
                            {/* Property Selection */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="placeId">Property *</Label>
                                    <select
                                        id="placeId"
                                        name="placeId"
                                        value={formData.placeId}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    >
                                        <option value="">Select a property</option>
                                        {places.map((place) => (
                                            <option key={place._id} value={place._id}>
                                                {place.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    >
                                        <option value="plumbing">Plumbing</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="hvac">HVAC</option>
                                        <option value="appliances">Appliances</option>
                                        <option value="structural">Structural</option>
                                        <option value="general">General Maintenance</option>
                                        <option value="cleaning">Cleaning</option>
                                        <option value="landscaping">Landscaping</option>
                                    </select>
                                </div>
                            </div>

                            {/* Title and Priority */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="title">Issue Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of the issue"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="priority">Priority Level *</Label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    >
                                        <option value="low">Low - Can wait</option>
                                        <option value="medium">Medium - Should be addressed soon</option>
                                        <option value="high">High - Urgent attention needed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="description">Detailed Description *</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Please provide a detailed description of the issue, including when it started, what might have caused it, and any other relevant information..."
                                    required
                                />
                            </div>

                            {/* Location and Contact */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="location">Specific Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Kitchen sink, Master bedroom, Living room"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tenantContact">Contact Number</Label>
                                    <Input
                                        id="tenantContact"
                                        name="tenantContact"
                                        type="tel"
                                        value={formData.tenantContact}
                                        onChange={handleInputChange}
                                        placeholder="Your phone number for updates"
                                    />
                                </div>
                            </div>

                            {/* Preferred Time and Images */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="preferredTime">Preferred Service Time</Label>
                                    <select
                                        id="preferredTime"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">No preference</option>
                                        <option value="morning">Morning (8AM - 12PM)</option>
                                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                        <option value="evening">Evening (5PM - 8PM)</option>
                                        <option value="weekend">Weekend</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="images">Upload Images (Optional)</Label>
                                    <input
                                        id="images"
                                        name="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto"
                                >
                                    {loading ? 'Submitting...' : 'Submit Maintenance Request'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {maintenanceRequests.length > 0 ? (
                            maintenanceRequests.map((request) => (
                                <div key={request.id} className="rounded-lg bg-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-primary">
                                                    {getCategoryIcon(request.category)}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {request.title}
                                                </h3>
                                            </div>

                                            <p className="text-gray-600 mb-3">{request.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                <p><strong>Property:</strong> {request.place}</p>
                                                <p><strong>Reported:</strong> {request.dateReported}</p>
                                                <p><strong>Est. Completion:</strong> {request.estimatedCompletion}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                            {request.status === 'pending' && (
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-12 w-12 text-gray-400">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by submitting your first maintenance request.</p>
                                <div className="mt-6">
                                    <Button onClick={() => setActiveTab('report')}>
                                        Submit Request
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Stats Cards */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                                        <dd className="text-lg font-medium text-gray-900">{maintenanceRequests.length}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-white">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {maintenanceRequests.filter(r => r.status === 'pending').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {maintenanceRequests.filter(r => r.status === 'completed').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="md:col-span-2 lg:col-span-3 rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Requests by Category</h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {['plumbing', 'electrical', 'hvac', 'general'].map((category) => {
                                    const count = maintenanceRequests.filter(r => r.category === category).length;
                                    return (
                                        <div key={category} className="text-center">
                                            <div className="mx-auto mb-2 text-primary">
                                                {getCategoryIcon(category)}
                                            </div>
                                            <div className="text-2xl font-semibold text-gray-900">{count}</div>
                                            <div className="text-sm text-gray-500 capitalize">{category}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenancePage;
