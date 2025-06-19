import React from 'react';

const RefundPolicySection = () => {
  const policies = [
    {
      title: "Free Cancellation",
      description: "Cancel for free up to 48 hours before check-in",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-green-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Partial Refund",
      description: "50% refund if cancelled 24-48 hours before check-in",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-yellow-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "No Refund",
      description: "No refund for cancellations within 24 hours of check-in",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-red-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Our Cancellation Policy</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {policies.map((policy, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              {policy.icon}
              <h3 className="font-semibold text-lg">{policy.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundPolicySection;