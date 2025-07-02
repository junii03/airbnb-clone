import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/ui/Layout';
import { ProtectedRoute, AdminRoute, CustomerRoute } from './components/ui/ProtectedRoute';
import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import BookingsPage from './pages/BookingsPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import SingleBookedPlace from './pages/SingleBookedPlace';
import RefundCancellationPage from './pages/RefundCancellationPage';
import PreBookingInquiryPage from './pages/PreBookingInquiryPage';
import MyInquiriesPage from './pages/MyInquiriesPage';
import FeedbackPage from './pages/FeedbackPage';
import CheckInOutPage from './pages/CheckInOutPage';
import MaintenancePage from './pages/MaintenancePage';
import FinancialPage from './pages/FinancialPage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminAccommodations from './pages/AdminAccommodations';
import AdminAccommodationForm from './pages/AdminAccommodationForm';
import AdminInquiriesPage from './pages/AdminInquiriesPage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import AdminRefundsPage from './pages/AdminRefundsPage';
import NotFoundPage from './pages/NotFoundPage';
import MyFeedbackPage from './pages/MyFeedbackPage';
import MyRefundsPage from './pages/MyRefundsPage';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';
import axiosInstance from './utils/axios';
import { getItemFromLocalStorage } from './utils';

function App() {
    useEffect(() => {
        // set the token on refreshing the website
        axiosInstance.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${getItemFromLocalStorage('token')}`;
    }, []);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <UserProvider>
                <PlaceProvider>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            {/* Public routes */}
                            <Route index element={<IndexPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/place/:id" element={<PlacePage />} />

                            {/* Customer-only routes */}
                            <Route path="/account" element={
                                <CustomerRoute>
                                    <ProfilePage />
                                </CustomerRoute>
                            } />
                            <Route path="/account/bookings" element={
                                <CustomerRoute>
                                    <BookingsPage />
                                </CustomerRoute>
                            } />
                            <Route path="/account/bookings/:id" element={
                                <CustomerRoute>
                                    <SingleBookedPlace />
                                </CustomerRoute>
                            } />
                            <Route path="/account/bookings/:id/check-in-out" element={
                                <CustomerRoute>
                                    <CheckInOutPage />
                                </CustomerRoute>
                            } />
                            <Route path="/refund-cancellation" element={
                                <CustomerRoute>
                                    <RefundCancellationPage />
                                </CustomerRoute>
                            } />
                            <Route path="/pre-booking-inquiry" element={
                                <CustomerRoute>
                                    <PreBookingInquiryPage />
                                </CustomerRoute>
                            } />
                            <Route path="/feedback" element={
                                <CustomerRoute>
                                    <FeedbackPage />
                                </CustomerRoute>
                            } />
                            <Route path="/my-inquiries" element={
                                <CustomerRoute>
                                    <MyInquiriesPage />
                                </CustomerRoute>
                            } />
                            <Route path="/my-feedback" element={
                                <CustomerRoute>
                                    <MyFeedbackPage />
                                </CustomerRoute>
                            } />
                            <Route path="/my-refunds" element={
                                <CustomerRoute>
                                    <MyRefundsPage />
                                </CustomerRoute>
                            } />

                            {/* Admin authentication routes */}
                            <Route path="/admin/login" element={<AdminLoginPage />} />

                            {/* Admin-only routes */}
                            <Route path="/admin/dashboard" element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            } />
                            <Route path="/admin/accommodations" element={
                                <AdminRoute>
                                    <AdminAccommodations />
                                </AdminRoute>
                            } />
                            <Route path="/admin/accommodations/new" element={
                                <AdminRoute>
                                    <AdminAccommodationForm />
                                </AdminRoute>
                            } />
                            <Route path="/admin/accommodations/edit/:id" element={
                                <AdminRoute>
                                    <AdminAccommodationForm />
                                </AdminRoute>
                            } />
                            <Route path="/admin/inquiries" element={
                                <AdminRoute>
                                    <AdminInquiriesPage />
                                </AdminRoute>
                            } />
                            <Route path="/admin/feedback" element={
                                <AdminRoute>
                                    <AdminFeedbackPage />
                                </AdminRoute>
                            } />
                            <Route path="/admin/refunds" element={
                                <AdminRoute>
                                    <AdminRefundsPage />
                                </AdminRoute>
                            } />
                            <Route path="/admin/financial" element={
                                <AdminRoute>
                                    <FinancialPage />
                                </AdminRoute>
                            } />
                            <Route path="/admin/maintenance" element={
                                <AdminRoute>
                                    <MaintenancePage />
                                </AdminRoute>
                            } />
                            <Route path="/admin/fraud-detection" element={
                                <AdminRoute>
                                    <FraudDetectionPage />
                                </AdminRoute>
                            } />

                            {/* Remove old incorrect routes */}
                            <Route path="/account/places" element={
                                <AdminRoute>
                                    <PlacesPage />
                                </AdminRoute>
                            } />
                            <Route path="/account/places/new" element={
                                <AdminRoute>
                                    <PlacesFormPage />
                                </AdminRoute>
                            } />
                            <Route path="/account/places/:id" element={
                                <AdminRoute>
                                    <PlacesFormPage />
                                </AdminRoute>
                            } />

                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                    <ToastContainer autoClose={1500} transition={Slide} />
                </PlaceProvider>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
