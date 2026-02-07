import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Avatar from "./Avatar";
import Cookies from "js-cookie";
import { get_ProfileData, isJwtValid } from '../../lib/utils';



function Nav() {
  const navigate = useNavigate();
  const rawToken = Cookies.get("token");
  const accessToken = rawToken && isJwtValid(rawToken) ? rawToken : null;

  // Clean up invalid/expired tokens
  useEffect(() => {
    if (rawToken && !isJwtValid(rawToken)) {
      Cookies.remove('token');
      Cookies.remove('username');
    }
  }, [rawToken]);
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
        }
      }
    };
    fetchUserData();
  }, [accessToken]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-8 border-b-2 border-grunge-dark sticky top-0 bg-grunge-white/90 backdrop-blur z-50">
      <Link to="/" className="font-display text-4xl uppercase select-none cursor-pointer hover:text-grunge-accent transition-colors">
        Void<span className="text-grunge-accent">_Talk</span>
      </Link>
      <div className="flex items-center gap-6">
        {!accessToken && (
          <Button to="/login" variant="primary" className="px-6 py-2">
            LOGIN // JOIN
          </Button>
        )}
        {accessToken && (
          <div className="flex items-center gap-4">
            <Link to="/chat" className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase">Chat</Link>
            <Link to="/posts" className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase">Posts</Link>
            <Link to="/friends" className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase">Friends</Link>
            <Link to="/api-keys" className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase">API</Link>
            {userRole === "admin" && (
              <Link to="/admin" className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase">ADMIN</Link>
            )}
            <button
              onClick={handleLogout}
              className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase bg-transparent border-none cursor-pointer"
            >
              LOGOUT
            </button>
            <Link to="/profile">
              <Avatar src={userAvatar || undefined} alt="User" fallback={userInitial} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Nav;