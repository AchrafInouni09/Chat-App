import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import Avatar from "./Avatar";
import Cookies from "js-cookie";
import { get_ProfileData, isJwtValid } from '../../lib/utils';



function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const rawToken = Cookies.get("token");
  const [accessToken, setAccessToken] = useState<string | null>(
    rawToken && isJwtValid(rawToken) ? rawToken : null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const prevPathnameRef = useRef(location.pathname);
  
  // Clean up invalid/expired tokens on mount (sync, before render)
  if (rawToken && !isJwtValid(rawToken)) {
    Cookies.remove('token');
    Cookies.remove('username');
  }

  // Close sidebar on route change
  useLayoutEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    }
  }, [location.pathname, isSidebarOpen]);

  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState("ME");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        const userData = await get_ProfileData();
        if (userData && userData.user) {
          setUserAvatar(userData.user.avatar_url || null);
          setUserInitial(userData.user.username?.[0]?.toUpperCase() || "ME");
          setUserRole(userData.user.role || null);
        } else {
          // Server rejected token — clear auth state
          Cookies.remove('token');
          Cookies.remove('username');
          setAccessToken(null);
        }
      }
    };
    fetchUserData();
  }, [accessToken]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    setIsSidebarOpen(false);
    navigate("/login");
  };

  const navLinkClass = "font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase transition-colors";

  return (
    <>
      <nav className="flex justify-between items-center p-4 md:p-8 border-b-2 border-grunge-dark sticky top-0 bg-grunge-white/90 backdrop-blur z-50">
        <Link to="/" className="font-display text-2xl md:text-4xl uppercase select-none cursor-pointer hover:text-grunge-accent transition-colors">
          Void<span className="text-grunge-accent">_Talk</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          {!accessToken && (
            <Button to="/login" variant="primary" className="px-4 py-2 md:px-6">
              LOGIN // JOIN
            </Button>
          )}
          {accessToken && (
            <div className="flex items-center gap-4">
              {/* Desktop links */}
              <Link to="/chat" className={`hidden md:inline-block ${navLinkClass}`}>Chat</Link>
              <Link to="/posts" className={`hidden md:inline-block ${navLinkClass}`}>Posts</Link>
              <Link to="/friends" className={`hidden md:inline-block ${navLinkClass}`}>Friends</Link>
              <Link to="/api-keys" className={`hidden md:inline-block ${navLinkClass}`}>API</Link>
              {userRole === "admin" && (
                <Link to="/admin" className={`hidden md:inline-block ${navLinkClass}`}>ADMIN</Link>
              )}
              <button
                onClick={handleLogout}
                className={`hidden md:inline-block ${navLinkClass} bg-transparent border-none cursor-pointer`}
              >
                LOGOUT
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1 bg-transparent border-none cursor-pointer"
                aria-label="Open menu"
              >
                <span className="block w-6 h-0.5 bg-grunge-dark rounded" />
                <span className="block w-6 h-0.5 bg-grunge-dark rounded" />
                <span className="block w-6 h-0.5 bg-grunge-dark rounded" />
              </button>

              {/* Desktop avatar */}
              <Link to="/profile" className="hidden md:block">
                <Avatar src={userAvatar || undefined} alt="User" fallback={userInitial} />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-grunge-white border-l-2 border-grunge-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex justify-between items-center p-6 border-b-2 border-grunge-dark">
            <span className="font-display text-xl uppercase">Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-3xl font-bold hover:text-grunge-accent transition-colors bg-transparent border-none cursor-pointer leading-none p-2"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {/* User profile section */}
          {accessToken && (
            <div className="flex items-center gap-3 p-6 border-b-2 border-grunge-dark">
              <Avatar src={userAvatar || undefined} alt="User" fallback={userInitial} />
              <Link 
                to="/profile" 
                className="font-bold hover:text-grunge-accent uppercase"
              >
                Profile
              </Link>
            </div>
          )}

          {/* Navigation links */}
          <div className="flex flex-col gap-6 p-6 flex-1">
            <Link to="/chat" className={navLinkClass}>Chat</Link>
            <Link to="/posts" className={navLinkClass}>Posts</Link>
            <Link to="/friends" className={navLinkClass}>Friends</Link>
            <Link to="/api-keys" className={navLinkClass}>API</Link>
            {userRole === "admin" && (
              <Link to="/admin" className={navLinkClass}>ADMIN</Link>
            )}
          </div>

          {/* Logout button at bottom */}
          <div className="p-6 border-t-2 border-grunge-dark">
            <button
              onClick={handleLogout}
              className={`${navLinkClass} bg-transparent border-none cursor-pointer text-left w-full`}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Nav;