import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/ui/Layout';
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
import FeedbackPage from './pages/FeedbackPage';
import CheckInOutPage from './pages/CheckInOutPage';
import MaintenancePage from './pages/MaintenancePage';
import FinancialPage from './pages/FinancialPage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import axiosInstance from './utils/axios';
import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getItemFromLocalStorage } from './utils';
import NotFoundPage from './pages/NotFoundPage';

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
                            <Route index element={<IndexPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/account" element={<ProfilePage />} />
                            <Route path="/account/places" element={<PlacesPage />} />
                            <Route path="/account/places/new" element={<PlacesFormPage />} />
                            <Route path="/account/places/:id" element={<PlacesFormPage />} />
                            <Route path="/place/:id" element={<PlacePage />} />
                            <Route path="/account/bookings" element={<BookingsPage />} />
                            <Route
                                path="/account/bookings/:id"
                                element={<SingleBookedPlace />}
                            />
                            <Route
                                path="/account/bookings/:id/check-in-out"
                                element={<CheckInOutPage />}
                            />
                            <Route path="/refund-cancellation" element={<RefundCancellationPage />} />
                            <Route path="/pre-booking-inquiry" element={<PreBookingInquiryPage />} />
                            <Route path="/feedback" element={<FeedbackPage />} />
                            <Route path="/check-in-out" element={<CheckInOutPage />} />
                            <Route path="/maintenance" element={<MaintenancePage />} />
                            <Route path="/financial" element={<FinancialPage />} />
                            <Route path="/fraud-detection" element={<FraudDetectionPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                    <ToastContainer autoClose={2000} transition={Slide} />
                </PlaceProvider>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
