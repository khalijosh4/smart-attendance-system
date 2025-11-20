import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaSignOutAlt, 
  FaChartPie, 
  FaCog, 
  FaPlus, 
  FaSearch,
  FaBuilding,
  FaThLarge,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ to, icon, label }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group ${
          active 
            ? 'bg-white text-indigo-600 shadow-sm font-medium' 
            : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
        }`}
      >
        <span className={`mr-3 text-lg ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
          {icon}
        </span>
        {label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 p-4 flex flex-col gap-6 bg-[#F3F4F6] transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* App Brand */}
        <div className="px-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <FaThLarge className="text-sm" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800">TeamSync</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* Create Button */}
        <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-2.5 px-4 rounded-xl shadow-sm border border-gray-200/60 transition-all flex items-center justify-center gap-2 group">
          <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FaPlus className="text-xs" />
          </div>
          <span>Quick Action</span>
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </div>
          <NavItem to="/" icon={<FaChartPie />} label="Dashboard" />
          <NavItem to="/employees" icon={<FaUsers />} label="Employees" />
          <NavItem to="/departments" icon={<FaBuilding />} label="Departments" />
          <NavItem to="/attendance" icon={<FaCalendarAlt />} label="Attendance" />
          
          <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            System
          </div>
          <NavItem to="/settings" icon={<FaCog />} label="Settings" />
        </nav>

        {/* User Profile / Logout */}
        <div className="mt-auto pt-4 border-t border-gray-200/60">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group"
          >
            <FaSignOutAlt className="mr-3 text-gray-400 group-hover:text-red-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-hidden flex flex-col h-screen w-full">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-4 px-2 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
            >
              <FaBars />
            </button>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="hover:text-gray-900 cursor-pointer hidden sm:inline">Home</span>
              <span className="mx-2 hidden sm:inline">/</span>
              <span className="font-medium text-gray-900 capitalize truncate max-w-[150px] sm:max-w-none">
                {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white pl-10 pr-4 py-2 rounded-full text-sm border-none shadow-sm w-40 lg:w-64 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">⌘K</span>
              </div>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
              A
            </div>
          </div>
        </header>

        {/* Content Card */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
