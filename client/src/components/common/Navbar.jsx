import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, Search, User, LogOut, Briefcase, Award, 
  Settings, CheckCircle, Menu, X, ChevronDown, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (user?.role === 'student') {
      navigate(`/student/jobs?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-purple-200">Placement Officer</span>;
      case 'recruiter':
        return <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-200">Recruiter</span>;
      default:
        return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-blue-200">Student</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button 
                onClick={onToggleSidebar}
                className="p-2 rounded-lg lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-blue-600 bg-clip-text text-transparent">
                PlacePrep
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Fills the Nav bar) */}
          <div className="hidden md:flex items-center justify-center gap-8 flex-1">
            {isHome ? (
              <>
                <a href="#features" className="text-xs font-bold text-slate-500 hover:text-brand-600 hover:scale-105 transition-all">
                  Features
                </a>
                <a href="#portals" className="text-xs font-bold text-slate-500 hover:text-brand-600 hover:scale-105 transition-all">
                  Portals
                </a>
                <a href="#sandbox" className="text-xs font-bold text-slate-500 hover:text-brand-600 hover:scale-105 transition-all">
                  Sandbox
                </a>
                <a href="#about" className="text-xs font-bold text-slate-500 hover:text-brand-600 hover:scale-105 transition-all">
                  Process
                </a>
              </>
            ) : (
              user && (
                <form onSubmit={handleSearch} className="w-full max-w-sm relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, skills, companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-full border outline-none transition-all bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 border-slate-200/80 focus:border-brand-500"
                  />
                </form>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                {/* Notifications Popover */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 rounded-xl relative transition-colors text-slate-600 hover:text-brand-600 hover:bg-slate-100"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 text-slate-800">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="bg-brand-50 text-brand-600 text-xs px-2 py-0.5 rounded-full font-medium">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) navigate(n.link);
                                setShowNotifs(false);
                              }}
                              className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${
                                !n.isRead ? 'bg-brand-50/20' : ''
                              }`}
                            >
                              <div className="flex-1">
                                <h4 className="text-xs font-bold text-slate-900 mb-0.5">{n.title}</h4>
                                <p className="text-xs text-slate-600 leading-normal">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {!n.isRead && (
                                <span className="w-2 h-2 bg-brand-600 rounded-full shrink-0 mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <ChevronDown className="w-4 h-4 transition-transform text-slate-500" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 text-slate-800">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="font-bold text-xs text-slate-900 truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-500 truncate mb-1.5">{user.email}</div>
                        {getRoleBadge(user.role)}
                      </div>

                      {user.role === 'student' && (
                        <>
                          <Link
                            to="/student/dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                          >
                            <User className="w-4 h-4" /> My Dashboard
                          </Link>
                          <Link
                            to="/student/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                          >
                            <Settings className="w-4 h-4" /> Edit Profile
                          </Link>
                        </>
                      )}

                      {user.role === 'recruiter' && (
                        <Link
                          to="/recruiter/company"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <Briefcase className="w-4 h-4" /> Company Profile
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-500 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register/student"
                  className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}