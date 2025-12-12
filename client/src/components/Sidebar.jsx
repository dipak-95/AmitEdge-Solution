import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaTasks, FaCalendarCheck, FaUserTie, FaFileAlt, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const isAdmin = user?.role !== 'employee';

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
        { name: 'Tasks', path: '/tasks', icon: <FaTasks /> },
        { name: 'Attendance', path: '/attendance', icon: <FaCalendarCheck /> },
        { name: 'Leaves', path: '/leaves', icon: <FaFileAlt /> },
    ];

    if (isAdmin) {
        links.push({ name: 'Employees', path: '/employees', icon: <FaUsers /> });
        links.push({ name: 'Reports', path: '/reports', icon: <FaFileAlt /> }); // Reports icon same for now
    }

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-8">AmitEdge Solution</h1>
            <nav>
                <ul>
                    {links.map((link) => (
                        <li key={link.path} className="mb-2">
                            <Link
                                to={link.path}
                                className={`flex items-center p-2 rounded hover:bg-gray-700 ${location.pathname === link.path ? 'bg-gray-700' : ''}`}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
