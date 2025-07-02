import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlacesFormPage = () => {
    useEffect(() => {
        toast.error('Access denied. Only administrators can create accommodations.');
    }, []);

    // Redirect users away from this page since they shouldn't create accommodations
    return <Navigate to="/account/places" replace />;
};

export default PlacesFormPage;
