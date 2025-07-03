import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks'

const AccountNav = () => {
    const { pathname } = useLocation();
    const auth = useAuth();
    let subpage = pathname.split('/')?.[2];

    if (subpage === undefined) {
        subpage = 'profile';
    }

    const linkClasses = (type = null) => {
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full';
        if (type === subpage ||
            (type === 'inquiries' && pathname === '/my-inquiries') ||
            (type === 'feedback' && pathname === '/my-feedback') ||
            (type === 'refunds' && pathname === '/my-refunds')) {
            classes += ' bg-primary text-white';
        } else {
            classes += ' bg-gray-200';
        }
        return classes;
    };

    // Check if user is admin
    const isAdmin = auth.user?.isAdmin && auth.user?.role === 'admin';

    return (
        <nav className="mb-8 mt-8 flex w-full justify-center gap-2 pt-20 flex-wrap">
            <Link className={linkClasses('profile')} to={'/account'}>
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
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                </svg>
                My profile
            </Link>

            {/* Customer-only navigation items */}
            {!isAdmin && (
                <>
                    <Link className={linkClasses('bookings')} to={'/account/bookings'}>
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
                                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                        </svg>
                        My bookings
                    </Link>

                    <Link className={linkClasses('places')} to={'/account/places'}>
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
                                d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18m2.25-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v3"
                            />
                        </svg>
                        My accommodations
                    </Link>

                    <Link className={linkClasses('inquiries')} to={'/my-inquiries'}>
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
                                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                            />
                        </svg>
                        My inquiries
                    </Link>

                    <Link className={linkClasses('feedback')} to={'/my-feedback'}>
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
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.691 1.594 3.094 3.563 3.163a.75.75 0 01.748.75v.25a.75.75 0 01-1.5 0v-.25a.75.75 0 01-.748-.75C2.5 14.677 2.5 13.584 2.5 12c0-4.242 4.03-7.5 9-7.5s9 3.258 9 7.5-4.03 7.5-9 7.5a8.963 8.963 0 01-2.555-.367"
                            />
                        </svg>
                        My feedback
                    </Link>

                    <Link className={linkClasses('refunds')} to={'/my-refunds'}>
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
                                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                            />
                        </svg>
                        My refunds
                    </Link>
                </>
            )}

            {/* Admin-only navigation - redirect to admin panel */}
            {isAdmin && (
                <Link
                    className="inline-flex gap-1 py-2 px-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    to={'/admin/dashboard'}
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
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m0 0L9 3m0 0l1.5 3M9 3v3m6 9h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 15H7.5m0 0l1.5 3m0 0l1.5-3M9 15v3"
                        />
                    </svg>
                    Admin Dashboard
                </Link>
            )}
        </nav>
    );
};

export default AccountNav;
