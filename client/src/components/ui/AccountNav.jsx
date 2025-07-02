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
        if (type === subpage) {
            classes += ' bg-primary text-white';
        } else {
            classes += ' bg-gray-200';
        }
        return classes;
    };

    // Check if user is admin
    const isAdmin = auth.user?.isAdmin && auth.user?.role === 'admin';

    return (
        <nav className="mb-8 mt-8 flex w-full justify-center gap-2 pt-20">
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

            {/* Customer-only navigation */}
            {!isAdmin && (
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
            )}

            {/* Admin-only navigation - redirect to admin panel */}
            {isAdmin && (
                <Link
                    className="inline-flex gap-1 py-2 px-6 rounded-full bg-blue-600 text-white hover:bg-blue-700"
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
