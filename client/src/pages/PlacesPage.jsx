import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axiosInstance from '@/utils/axios';

import AccountNav from '@/components/ui/AccountNav';
import InfoCard from '@/components/ui/InfoCard';
import Spinner from '@/components/ui/Spinner';

const PlacesPage = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPlaces = async () => {
            try {
                const { data } = await axiosInstance.get('places/user-places');
                setPlaces(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getPlaces();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <AccountNav />
            <div className="text-center space-y-4">
                <Link
                    className="inline-flex gap-1 rounded-full bg-primary py-2 px-6 text-white"
                    to={'/account/places/new'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Add new place
                </Link>


                {/* Financial Management Button */}
                <div className="mt-4">
                    <Link
                        className="inline-flex gap-1 rounded-full bg-white border-2 border-green-600 text-green-600 py-2 px-6 hover:bg-green-600 hover:text-white transition-colors"
                        to={'/financial'}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Financial & Budgeting
                    </Link>
                </div>
            </div>
            <div className="mx-4 mt-4">
                {places.length > 0 &&
                    places.map((place) => <InfoCard place={place} key={place._id} />)}
            </div>
        </div>
    );
};

export default PlacesPage;
