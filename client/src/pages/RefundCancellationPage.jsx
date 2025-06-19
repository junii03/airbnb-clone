import React from 'react';
import RefundPolicySection from '@/components/ui/RefundPolicySection';
import RefundRequestForm from '@/components/ui/RefundRequestForm';

const RefundCancellationPage = () => {
    return (
        <div className="mt-4 overflow-x-hidden px-4 pt-20 md:px-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Refund & Cancellation</h1>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                    We understand that plans can change. Learn about our flexible cancellation policy
                    and submit a request for refunds or cancellations below.
                </p>
            </div>

            {/* Policy Section */}
            <RefundPolicySection />

            {/* Additional Information */}
            <div className="w-full max-w-4xl mx-auto mb-8">
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <h3 className="text-xl font-semibold mb-4">Important Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <p>Refunds are processed within 5-10 business days to your original payment method</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <p>Cancellation policies may vary by property and booking dates</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <p>Service fees are non-refundable except in special circumstances</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <p>Emergency situations may qualify for full refund consideration</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <p>Host cancellations result in automatic full refund</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <p>You will receive email confirmation for all requests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Form */}
            <RefundRequestForm />

            {/* Contact Support */}
            <div className="w-full max-w-2xl mx-auto mt-12 mb-8 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                        Our support team is available 24/7 to assist you with your refund or cancellation requests.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="mailto:support@airbnb.com"
                            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email Support
                        </a>
                        <a
                            href="tel:+1234567890"
                            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundCancellationPage;
