import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AccountNav from '../components/ui/AccountNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import Spinner from '../components/ui/Spinner';
import axiosInstance from '../utils/axios';

const FraudDetectionPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('report');
    const [places, setPlaces] = useState([]);
    const [fraudReports, setFraudReports] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState({
        reportType: 'suspicious_activity',
        propertyId: '',
        incidentType: 'identity_fraud',
        description: '',
        dateOccurred: '',
        timeOccurred: '',
        contactInfo: '',
        evidenceFiles: [],
        suspiciousDetails: '',
        actionsTaken: '',
        priority: 'medium',
        reporterName: '',
        reporterEmail: '',
        reporterPhone: ''
    });

    // Mock fraud reports data for demonstration
    const mockFraudReports = [
        {
            id: 1,
            type: 'Identity Fraud',
            status: 'under_investigation',
            property: 'Downtown Apartment',
            dateReported: '2025-06-15',
            priority: 'high',
            description: 'Guest used fake identity documents during check-in',
            investigator: 'Security Team Alpha'
        },
        {
            id: 2,
            type: 'Payment Fraud',
            status: 'resolved',
            property: 'Beach House Villa',
            dateReported: '2025-06-10',
            priority: 'medium',
            description: 'Suspicious credit card activity detected',
            investigator: 'Fraud Prevention Unit'
        },
        {
            id: 3,
            type: 'Listing Scam',
            status: 'pending',
            property: 'City Center Loft',
            dateReported: '2025-06-18',
            priority: 'high',
            description: 'Fake listing reported by multiple users',
            investigator: 'Pending Assignment'
        }
    ];

    useEffect(() => {
        fetchPlaces();
        setFraudReports(mockFraudReports);
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

    const handleSubmitReport = async (e) => {
        e.preventDefault();

        if (!formData.description || !formData.incidentType) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newReport = {
                id: Date.now(),
                type: formData.incidentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                status: 'pending',
                property: places.find(p => p._id === formData.propertyId)?.title || 'General Report',
                dateReported: new Date().toISOString().split('T')[0],
                priority: formData.priority,
                description: formData.description,
                investigator: 'Pending Assignment'
            };

            setFraudReports(prev => [newReport, ...prev]);
            setFormData({
                reportType: 'suspicious_activity',
                propertyId: '',
                incidentType: 'identity_fraud',
                description: '',
                dateOccurred: '',
                timeOccurred: '',
                contactInfo: '',
                evidenceFiles: [],
                suspiciousDetails: '',
                actionsTaken: '',
                priority: 'medium',
                reporterName: '',
                reporterEmail: '',
                reporterPhone: ''
            });

            setShowDialog(true);
            toast.success('Fraud report submitted successfully!');
            setActiveTab('reports');
        } catch (error) {
            toast.error('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'under_investigation':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'dismissed':
                return 'bg-gray-100 text-gray-800';
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
            case 'critical':
                return 'bg-red-200 text-red-900';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getIncidentIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'identity fraud':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'payment fraud':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            case 'listing scam':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
        }
    };

    if (loading && places.length === 0) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20">

            <div className="mx-auto max-w-6xl p-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Fraud Detection & Response
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Report suspicious activities and track fraud prevention measures
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
                            Report Incident
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            My Reports ({fraudReports.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('prevention')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'prevention'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Prevention Tips
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Security Analytics
                        </button>
                    </nav>
                </div>

                {/* Report Incident Tab */}
                {activeTab === 'report' && (
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Report Fraud Incident</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Provide detailed information about the suspected fraudulent activity
                            </p>
                        </div>

                        <form onSubmit={handleSubmitReport} className="space-y-6">
                            {/* Report Type and Property */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="reportType">Report Type *</Label>
                                    <select
                                        id="reportType"
                                        name="reportType"
                                        value={formData.reportType}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    >
                                        <option value="suspicious_activity">Suspicious Activity</option>
                                        <option value="confirmed_fraud">Confirmed Fraud</option>
                                        <option value="security_breach">Security Breach</option>
                                        <option value="policy_violation">Policy Violation</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="propertyId">Related Property</Label>
                                    <select
                                        id="propertyId"
                                        name="propertyId"
                                        value={formData.propertyId}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">Select a property (optional)</option>
                                        {places.map((place) => (
                                            <option key={place._id} value={place._id}>
                                                {place.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Incident Details */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="incidentType">Incident Type *</Label>
                                    <select
                                        id="incidentType"
                                        name="incidentType"
                                        value={formData.incidentType}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    >
                                        <option value="identity_fraud">Identity Fraud</option>
                                        <option value="payment_fraud">Payment Fraud</option>
                                        <option value="listing_scam">Listing Scam</option>
                                        <option value="fake_reviews">Fake Reviews</option>
                                        <option value="unauthorized_access">Unauthorized Access</option>
                                        <option value="phishing_attempt">Phishing Attempt</option>
                                        <option value="other">Other</option>
                                    </select>
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
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="dateOccurred">Date Incident Occurred</Label>
                                    <Input
                                        id="dateOccurred"
                                        name="dateOccurred"
                                        type="date"
                                        value={formData.dateOccurred}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="timeOccurred">Time Incident Occurred</Label>
                                    <Input
                                        id="timeOccurred"
                                        name="timeOccurred"
                                        type="time"
                                        value={formData.timeOccurred}
                                        onChange={handleInputChange}
                                    />
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
                                    placeholder="Describe the fraudulent activity in detail, including what happened, who was involved, and any suspicious behavior..."
                                    required
                                />
                            </div>

                            {/* Suspicious Details */}
                            <div>
                                <Label htmlFor="suspiciousDetails">Suspicious Details</Label>
                                <textarea
                                    id="suspiciousDetails"
                                    name="suspiciousDetails"
                                    value={formData.suspiciousDetails}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="List any red flags, unusual patterns, or suspicious indicators you noticed..."
                                />
                            </div>

                            {/* Contact Information */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Reporter Contact Information</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="reporterName">Full Name</Label>
                                        <Input
                                            id="reporterName"
                                            name="reporterName"
                                            value={formData.reporterName}
                                            onChange={handleInputChange}
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="reporterEmail">Email Address</Label>
                                        <Input
                                            id="reporterEmail"
                                            name="reporterEmail"
                                            type="email"
                                            value={formData.reporterEmail}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="reporterPhone">Phone Number</Label>
                                        <Input
                                            id="reporterPhone"
                                            name="reporterPhone"
                                            type="tel"
                                            value={formData.reporterPhone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions Taken */}
                            <div>
                                <Label htmlFor="actionsTaken">Actions Already Taken</Label>
                                <textarea
                                    id="actionsTaken"
                                    name="actionsTaken"
                                    value={formData.actionsTaken}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Describe any immediate actions you've taken in response to this incident..."
                                />
                            </div>

                            {/* Evidence Upload */}
                            <div>
                                <Label htmlFor="evidenceFiles">Upload Evidence (Optional)</Label>
                                <input
                                    id="evidenceFiles"
                                    name="evidenceFiles"
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto"
                                >
                                    {loading ? 'Submitting Report...' : 'Submit Fraud Report'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* My Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="space-y-4">
                        {fraudReports.length > 0 ? (
                            fraudReports.map((report) => (
                                <div key={report.id} className="rounded-lg bg-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-primary">
                                                    {getIncidentIcon(report.type)}
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {report.type}
                                                </h3>
                                            </div>

                                            <p className="text-gray-600 mb-3">{report.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('_', ' ')}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                                                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                <p><strong>Property:</strong> {report.property}</p>
                                                <p><strong>Reported:</strong> {report.dateReported}</p>
                                                <p><strong>Investigator:</strong> {report.investigator}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                            {report.status === 'pending' && (
                                                <Button variant="outline" size="sm">
                                                    Update Report
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No fraud reports found</h3>
                                <p className="text-gray-500 mb-4">You haven't submitted any fraud reports yet.</p>
                                <Button onClick={() => setActiveTab('report')}>
                                    Submit Your First Report
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Prevention Tips Tab */}
                {activeTab === 'prevention' && (
                    <div className="space-y-6">
                        {/* Hero Section */}
                        <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-6 md:p-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Fraud Prevention Guide</h2>
                                <p className="text-gray-600">
                                    Learn how to protect yourself and your properties from fraudulent activities
                                </p>
                            </div>
                        </div>

                        {/* Prevention Categories */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {[
                                {
                                    title: "Guest Verification",
                                    icon: (
                                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    ),
                                    tips: [
                                        "Always verify guest identity with government-issued ID",
                                        "Check profile completion and review history",
                                        "Be cautious of new accounts with no reviews",
                                        "Verify payment method matches ID name",
                                        "Use video calls for high-value bookings"
                                    ]
                                },
                                {
                                    title: "Payment Security",
                                    icon: (
                                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    ),
                                    tips: [
                                        "Only accept payments through verified platforms",
                                        "Never share banking details via email or text",
                                        "Be wary of overpayment scams",
                                        "Monitor for unauthorized transactions",
                                        "Report suspicious payment activities immediately"
                                    ]
                                },
                                {
                                    title: "Communication Safety",
                                    icon: (
                                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    ),
                                    tips: [
                                        "Keep all communications within the platform",
                                        "Never share personal information unnecessarily",
                                        "Be cautious of urgent requests for information",
                                        "Verify contact information independently",
                                        "Report suspicious messages immediately"
                                    ]
                                },
                                {
                                    title: "Property Protection",
                                    icon: (
                                        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    ),
                                    tips: [
                                        "Install security cameras in common areas",
                                        "Use smart locks with access codes",
                                        "Maintain an inventory of valuable items",
                                        "Require security deposits for protection",
                                        "Conduct property inspections regularly"
                                    ]
                                }
                            ].map((category, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {category.icon}
                                        <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {category.tips.map((tip, tipIndex) => (
                                            <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-red-800">Emergency Fraud Response</h3>
                            </div>
                            <p className="text-red-700 mb-4">
                                If you suspect active fraud or security breach, take immediate action:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 mb-2">Immediate Steps</h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        <li>• Change all passwords immediately</li>
                                        <li>• Contact your bank/payment provider</li>
                                        <li>• Document all evidence</li>
                                        <li>• Report to platform immediately</li>
                                    </ul>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 mb-2">24/7 Fraud Hotline</h4>
                                    <p className="text-sm text-red-700 mb-2">
                                        Call our emergency fraud response team:
                                    </p>
                                    <p className="font-bold text-red-800">+1 (800) FRAUD-HELP</p>
                                    <p className="text-xs text-red-600">Available 24/7 for urgent cases</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        {/* Security Overview Cards */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Active Alerts</dt>
                                            <dd className="text-lg font-medium text-gray-900">3</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Security Score</dt>
                                            <dd className="text-lg font-medium text-gray-900">87%</dd>
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">Under Review</dt>
                                            <dd className="text-lg font-medium text-gray-900">1</dd>
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
                                            <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                                            <dd className="text-lg font-medium text-gray-900">12</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fraud Trends */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900 mb-6">Fraud Detection Trends</h3>
                            <div className="space-y-4">
                                {[
                                    { type: 'Identity Fraud', incidents: 8, change: '+12%', color: 'bg-red-500' },
                                    { type: 'Payment Fraud', incidents: 5, change: '-8%', color: 'bg-orange-500' },
                                    { type: 'Listing Scams', incidents: 3, change: '+25%', color: 'bg-yellow-500' },
                                    { type: 'Fake Reviews', incidents: 2, change: '0%', color: 'bg-blue-500' }
                                ].map((trend, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${trend.color}`}></div>
                                            <span className="font-medium text-gray-900">{trend.type}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-semibold">{trend.incidents}</span>
                                            <span className={`text-sm px-2 py-1 rounded-full ${trend.change.includes('+') ? 'bg-red-100 text-red-700' :
                                                trend.change.includes('-') ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {trend.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Recommendations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">Security Recommendations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Enable two-factor authentication on all accounts",
                                    "Regularly update property security measures",
                                    "Review guest verification protocols",
                                    "Implement real-time fraud monitoring"
                                ].map((recommendation, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3">
                                        <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-blue-800">{recommendation}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">Report Submitted Successfully!</DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <p className="font-semibold text-gray-900">Your fraud report has been received!</p>
                            <p className="text-gray-600 text-sm">
                                Our security team will investigate and respond within 24-48 hours.
                                You can track the status in the "My Reports" section.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => {
                                    setShowDialog(false);
                                    setActiveTab('reports');
                                }}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                            >
                                View My Reports
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
        </div>
    );
};

export default FraudDetectionPage;
