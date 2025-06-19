import React from 'react';
import FeedbackTypesSection from '@/components/ui/FeedbackTypesSection';
import FeedbackForm from '@/components/ui/FeedbackForm';

const FeedbackPage = () => {
    return (
        <div className="mt-4 overflow-x-hidden px-4 pt-20 md:px-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">We Value Your Feedback</h1>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                    Your opinions and experiences help us create a better platform for everyone.
                    Share your thoughts, suggestions, or let us know how we're doing.
                </p>
            </div>

            {/* Feedback Types Section */}
            <FeedbackTypesSection />

            {/* Why Feedback Matters */}
            <div className="w-full max-w-4xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4 text-center">Why Your Feedback Matters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Helps us identify areas for improvement in our platform</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Guides our development of new features and services</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Ensures we maintain high quality standards</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Creates a better experience for all users</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Helps resolve issues quickly and effectively</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Shows us what we're doing well so we can do more of it</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Form */}
            <FeedbackForm />

            {/* Additional Information */}
            <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">What Happens Next?</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold">We Review Your Feedback</h4>
                                <p>Our team carefully reviews all feedback within 24-48 hours</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold">We Take Action</h4>
                                <p>Feedback is categorized and sent to the appropriate teams for action</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold">We Follow Up</h4>
                                <p>If needed, we'll reach out to you for clarification or to update you on progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Alternatives */}
            <div className="w-full max-w-2xl mx-auto mt-8 mb-8 text-center">
                <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-2">Other Ways to Reach Us</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                        Prefer a different way to get in touch? We're here to help through multiple channels.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="mailto:feedback@airbnb.com"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-full transition-colors border"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 0 002 2z" />
                            </svg>
                            Email Feedback
                        </a>
                        <a
                            href="/refund-cancellation"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-full transition-colors border"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Support Center
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
