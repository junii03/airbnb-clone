import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';

const AdminNav = () => {
    const { pathname } = useLocation();
    const auth = useAuth();

    const getLinkClasses = (path) => {
        const isActive = pathname === path;
        return `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
            }`;
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 mb-6 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">


                    {/* User Info and Logout */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Welcome, {auth.user?.name}
                        </span>
                        <button
                            onClick={() => auth.logout()}
                            className="text-sm text-red-600 hover:text-red-800 font-medium p-2 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNav;
