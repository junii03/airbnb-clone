import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../../../hooks';
import SearchBar from './SearchBar';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

export const Header = () => {
    const auth = useAuth();
    const location = useLocation();

    const [showSearchBar, setShowSearchBar] = useState(true);
    const [hasShadow, setHasShadow] = useState(false);
    const { user } = auth;

    // Check if user is admin
    const isAdmin = user?.isAdmin && user?.role === 'admin';

    const handleScroll = () => {
        const shouldHaveShadow = window.scrollY > 0;
        setHasShadow(shouldHaveShadow);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // hide searchbar based on url
        if (location.pathname === '/') {
            setShowSearchBar(true);
        } else {
            setShowSearchBar(false);
        }
        // clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);

    return (
        <header
            className={`fixed top-0 z-10 flex w-screen justify-center bg-white py-4 ${hasShadow ? 'shadow-md' : ''
                }`}
        >
            <div
                className={`flex ${showSearchBar ? 'justify-around' : 'justify-between px-10'
                    } w-screen max-w-screen-xl`}
            >
                <a href="/" className="flex items-center gap-1">
                    <img
                        className="h-8 w-8 md:h-10 md:w-10"
                        src="https://cdn-icons-png.flaticon.com/512/2111/2111320.png"
                        alt=""
                    />

                    <span className="hidden text-2xl font-bold text-red-500 md:block">
                        airbnb
                    </span>
                </a>

                {showSearchBar && <SearchBar />}

                {/* Navigation Links */}
                <div className="flex items-center gap-4">
                    {/* Customer-only links */}
                    {user && !isAdmin && (
                        <>
                            {/* Refund & Cancellation Link */}
                            <Link
                                to="/refund-cancellation"
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H4.5m2.25 0v3.75m0-3.75a1.125 1.125 0 011.125-1.125h1.125m-3.375 0h3.375m-3.375 0a1.125 1.125 0 00-1.125 1.125v3.75m1.5 0h1.125M12 9.75V21m3-12.75a1.5 1.5 0 11-3 0V9.75m3 0a1.5 1.5 0 11-3 0V9.75"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Refunds</span>
                            </Link>

                            {/* Pre-booking Inquiry Link */}
                            <Link
                                to="/pre-booking-inquiry"
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Inquiries</span>
                            </Link>

                            {/* Feedback Link */}
                            <Link
                                to="/feedback"
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.691 1.309 3.062 2.943 3.133c.651.036 1.287.106 1.911.197c.961.142 1.923-.003 2.833-.33c1.015-.366 1.994-.848 2.889-1.446c.638-.426 1.262-.874 1.868-1.34c.321-.247.65-.502.98-.764C11.34 11.18 12 10.239 12 9.187C12 8.136 11.34 7.195 10.188 6.137C8.98 4.826 7.265 3.75 5.25 3.75C3.235 3.75 1.52 4.826.312 6.137C-.84 7.195-1.5 8.136-1.5 9.187c0 1.052.66 1.993 1.812 3.051c.321.262.65.517.98.764c.606.466 1.23.914 1.868 1.34c.895.598 1.874 1.08 2.889 1.446c.91.327 1.872.472 2.833.33c.624-.091 1.26-.161 1.911-.197c1.634-.071 2.943-1.442 2.943-3.133v-8.64H7.5z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Feedback</span>
                            </Link>
                        </>
                    )}

                    {/* Admin-only link */}
                    {isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5 text-blue-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m0 0L9 3m0 0l1.5 3M9 3v3m6 9h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 15H7.5m0 0l1.5 3m0 0l1.5-3M9 15v3"
                                />
                            </svg>
                            <span className="text-sm font-medium text-blue-700">Admin Panel</span>
                        </Link>
                    )}

                    {/* User Account Link */}
                    <Link
                        to={
                            user
                                ? isAdmin
                                    ? '/admin/dashboard'
                                    : '/account'
                                : '/login'
                        }
                        className="flex h-full items-center gap-2 rounded-full border-gray-300 py-1 px-2 md:border"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="hidden h-6 w-6 md:block"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>

                        <div className="z-10 h-[35px] w-[35px] overflow-hidden rounded-full">
                            {user ? (
                                <Avatar>
                                    {user?.picture ? (
                                        <AvatarImage src={user.picture} className="h-full w-full" />
                                    ) : (
                                        <AvatarImage
                                            src="https://res.cloudinary.com/rahul4019/image/upload/v1695133265/pngwing.com_zi4cre.png"
                                            className="h-full w-full"
                                        />
                                    )}
                                </Avatar>
                            ) : (
                                <svg
                                    fill="#858080"
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    viewBox="796 796 200 200"
                                    enableBackground="new 796 796 200 200"
                                    xmlSpace="preserve"
                                    stroke="#858080"
                                    className="h-8 w-8"
                                >
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M896,796c-55.14,0-99.999,44.86-99.999,100c0,55.141,44.859,100,99.999,100c55.141,0,99.999-44.859,99.999-100 C995.999,840.86,951.141,796,896,796z M896.639,827.425c20.538,0,37.189,19.66,37.189,43.921c0,24.257-16.651,43.924-37.189,43.924 s-37.187-19.667-37.187-43.924C859.452,847.085,876.101,827.425,896.639,827.425z M896,983.86 c-24.692,0-47.038-10.239-63.016-26.695c-2.266-2.335-2.984-5.775-1.84-8.82c5.47-14.556,15.718-26.762,28.817-34.761 c2.828-1.728,6.449-1.393,8.91,0.828c7.706,6.958,17.316,11.114,27.767,11.114c10.249,0,19.69-4.001,27.318-10.719 c2.488-2.191,6.128-2.479,8.932-0.711c12.697,8.004,22.618,20.005,27.967,34.253c1.144,3.047,0.425,6.482-1.842,8.817 C943.037,973.621,920.691,983.86,896,983.86z"></path>{' '}
                                    </g>
                                </svg>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
            <br className="border border-gray-600" />
        </header>
    );
};
