import React from 'react';

const InquiryContactSection = () => {
    const contactMethods = [
        {
            title: "Live Chat",
            description: "Get instant answers to quick questions",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            action: "Start Chat",
            available: "Available 24/7"
        },
        {
            title: "Phone Support",
            description: "Speak directly with our booking specialists",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            action: "Call Now",
            available: "9 AM - 10 PM Daily"
        },
        {
            title: "Email Support",
            description: "Send detailed inquiries for complex questions",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            action: "Send Email",
            available: "Response within 24 hours"
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Need Immediate Help?</h2>
                <p className="text-gray-600">
                    Can't wait for a response? Contact us directly through any of these channels
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {contactMethods.map((method, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                {method.icon}
                            </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                        <div className="space-y-2">
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-full transition-colors">
                                {method.action}
                            </button>
                            <p className="text-xs text-gray-500">{method.available}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">How quickly will I get a response?</h4>
                            <p className="text-gray-600">We typically respond to inquiries within 24 hours during business days.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Can I inquire about multiple properties?</h4>
                            <p className="text-gray-600">Yes! You can ask about multiple properties in a single inquiry or submit separate forms.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Do I need to create an account?</h4>
                            <p className="text-gray-600">No account needed for inquiries. You only need to register when you're ready to book.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">What information should I include?</h4>
                            <p className="text-gray-600">Include your travel dates, group size, and specific questions for the most helpful response.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Can hosts respond directly?</h4>
                            <p className="text-gray-600">Yes, property hosts may respond directly to inquiries about their specific listings.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Is my information secure?</h4>
                            <p className="text-gray-600">Absolutely. We protect your personal information and only share what's necessary with hosts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryContactSection;
