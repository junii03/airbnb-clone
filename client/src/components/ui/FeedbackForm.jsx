import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';

const StarRating = ({ rating, setRating, readOnly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && setRating(star)}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                    className={`transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                >
                    <svg
                        className={`h-6 w-6 ${star <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                    </svg>
                </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
                {rating ? `${rating} out of 5` : 'No rating'}
            </span>
        </div>
    );
};

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        feedbackType: 'service',
        rating: 0,
        subject: '',
        message: '',
        email: '',
        bookingId: '',
        anonymous: false
    });
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowDialog(true);
            toast.success('Feedback submitted successfully!');
        }, 1000);
    };

    const resetForm = () => {
        setFormData({
            feedbackType: 'service',
            rating: 0,
            subject: '',
            message: '',
            email: '',
            bookingId: '',
            anonymous: false
        });
        setShowDialog(false);
    };

    return (
        <>
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Share Your Feedback</h2>
                    <p className="text-gray-600">Your feedback helps us improve our service</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Feedback Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Feedback Type *
                        </label>
                        <select
                            name="feedbackType"
                            value={formData.feedbackType}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="service">Service Experience</option>
                            <option value="property">Property/Booking Experience</option>
                            <option value="app">App/Website Feedback</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="complaint">Complaint</option>
                            <option value="compliment">Compliment</option>
                        </select>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Overall Rating
                        </label>
                        <StarRating
                            rating={formData.rating}
                            setRating={(rating) => setFormData(prev => ({ ...prev, rating }))}
                        />
                    </div>

                    {/* Booking ID - Optional */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Booking ID (Optional)
                        </label>
                        <input
                            type="text"
                            name="bookingId"
                            value={formData.bookingId}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter booking ID if feedback is about a specific booking"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Brief summary of your feedback"
                            required
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Feedback *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            placeholder="Please share your detailed feedback, suggestions, or concerns..."
                            required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            {formData.message.length}/500 characters
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    {/* Anonymous Option */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="anonymous"
                            id="anonymous"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor="anonymous" className="text-sm text-gray-700">
                            Submit this feedback anonymously
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full transition-colors"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </div>
                        ) : (
                            'Submit Feedback'
                        )}
                    </Button>
                </form>
            </div>

            {/* Success Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">Thank You for Your Feedback!</DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600">
                            Your feedback has been received and will help us improve our service.
                            We may reach out to you if we need additional information.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={resetForm}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                            >
                                Submit More Feedback
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
        </>
    );
};

export default FeedbackForm;
