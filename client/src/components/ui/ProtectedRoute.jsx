import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks';

// Protected route for authenticated users only
export const ProtectedRoute = ({ children }) => {
    const auth = useAuth();

    if (auth.loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!auth.user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Protected route for admin users only
export const AdminRoute = ({ children }) => {
    const auth = useAuth();

    if (auth.loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!auth.user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!auth.user.isAdmin || auth.user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Protected route for customer users only (prevents admin from accessing customer features)
export const CustomerRoute = ({ children }) => {
    const auth = useAuth();

    if (auth.loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!auth.user) {
        return <Navigate to="/login" replace />;
    }

    if (auth.user.isAdmin || auth.user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};
