import React from 'react';

const FeedbackTypesSection = () => {
    const feedbackTypes = [
        {
            title: "Service Feedback",
            description: "Share your experience with our service and support",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            )
        },
        {
            title: "Property Experience",
            description: "Rate and review your stay experience",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        },
        {
            title: "App Suggestions",
            description: "Help us improve with your suggestions and ideas",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-purple-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189l5.25-1.286a1.125 1.125 0 01.75 2.122L12 16.5M12 18v-5.25m0 0a6.01 6.01 0 01-1.5-.189l-5.25-1.286a1.125 1.125 0 00-.75 2.122L12 16.5M12 18v-5.25m0 0a6.01 6.01 0 011.5-.189l5.25-1.286a1.125 1.125 0 01.75 2.122L12 16.5M12 18v-5.25m0 0a6.01 6.01 0 01-1.5-.189l-5.25-1.286a1.125 1.125 0 00-.75 2.122L12 16.5" />
                </svg>
            )
        }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">What would you like to share?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {feedbackTypes.map((type, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            {type.icon}
                            <h3 className="font-semibold text-lg">{type.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackTypesSection;
