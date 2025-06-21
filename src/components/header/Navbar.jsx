import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportDropdown, setReportDropdown] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleReportDropdown = () => setReportDropdown(!reportDropdown);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-blue-600">Flat Manager</h1>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center relative">
            <Link to="/dashboard" className="hover:text-blue-600 font-medium">Daily Entry</Link>
            <Link to="/dashboard/monthly-summary" className="hover:text-blue-600 font-medium">Monthly Summary</Link>

            {/* Report Dropdown */}
            <div className="relative group">
              <button
                onClick={toggleReportDropdown}
                className="hover:text-blue-600 font-medium flex items-center gap-1"
              >
                Reports <ChevronDown size={16} />
              </button>

              {reportDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border shadow rounded w-48 z-50">
                  <Link
                    to="/dashboard/dailyreport"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setReportDropdown(false)}
                  >
                    Daily Report
                  </Link>
                  <Link
                    to="/dashboard/monthly-report"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setReportDropdown(false)}
                  >
                    Monthly Report
                  </Link>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="ml-4 text-red-600 font-medium hover:text-red-700"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            <Link to="/dashboard" className="block px-2 py-1 hover:text-blue-600">Daily Entry</Link>
            <Link to="/dashboard/monthly-summary" className="block px-2 py-1 hover:text-blue-600">Monthly Summary</Link>
            
            {/* Mobile Dropdown Style */}
            <div className="border-t pt-2">
              <p className="px-2 font-semibold text-gray-700">Reports</p>
              <Link to="/dashboard/dailyreport" className="block px-4 py-1 text-sm hover:text-blue-600">Daily Report</Link>
              <Link to="/dashboard/monthly-report" className="block px-4 py-1 text-sm hover:text-blue-600">Monthly Report</Link>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 font-medium hover:text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
