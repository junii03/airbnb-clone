import React from 'react';
import InquiryHeroSection from '@/components/ui/InquiryHeroSection';
import InquiryGuidelinesSection from '@/components/ui/InquiryGuidelinesSection';
import InquiryForm from '@/components/ui/InquiryForm';
import InquiryContactSection from '@/components/ui/InquiryContactSection';

const PreBookingInquiryPage = () => {
    return (
        <div className="mt-4 overflow-x-hidden px-4 pt-20 md:px-8">
            {/* Hero Section */}
            <InquiryHeroSection />

            {/* Guidelines Section */}
            <InquiryGuidelinesSection />

            {/* Inquiry Form */}
            <InquiryForm />

            {/* Contact Support Section */}
            <InquiryContactSection />
        </div>
    );
};

export default PreBookingInquiryPage;
