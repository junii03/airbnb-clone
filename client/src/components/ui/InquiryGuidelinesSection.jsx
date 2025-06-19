import React from 'react';

const InquiryGuidelinesSection = () => {
    const guidelines = [
        {
            title: "Property Details",
            description: "Ask about specific amenities, room layouts, or property features",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            title: "Availability Check",
            description: "Verify dates, pricing, and booking availability before reserving",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "Special Requests",
            description: "Inquire about accessibility, pet policies, or custom arrangements",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Local Information",
            description: "Get insights about neighborhood, transportation, and nearby attractions",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">What You Can Ask About</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {guidelines.map((guideline, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            {guideline.icon}
                            <h3 className="font-semibold text-gray-900">{guideline.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {guideline.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InquiryGuidelinesSection;
