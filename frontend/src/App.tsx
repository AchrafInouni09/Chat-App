
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import ChatPage from "./components/ChatPage.tsx";
import AuthPage from "./components/AuthPage.tsx";
import ProfileField from "./components/ProfileField.tsx";
import AddFriendPage from "./components/AddFriendPage.tsx";
import FriendsPage from "./components/FriendsPage.tsx";
import AdminDashboard from "./components/AdminDashboard.tsx";
import PostsPage from "./components/PostsPage.tsx";
import ApiKeysPage from "./components/ApiKeysPage.tsx";
import ComponentsPage from "./components/ComponentsPage.tsx";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage.tsx";
import TermsOfServicePage from "./components/TermsOfServicePage.tsx";

import { checkRole, isJwtValid } from "./lib/utils";
import Cookies from "js-cookie";

import './App.css'

function ProtectedRoute({ children, role }: { children: ReactNode, role?: string[] }) {
  const token = Cookies.get('token');
  if (!token || !isJwtValid(token)) {
    return <Navigate to="/login" />;
  }
  if (role && !checkRole(token, role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

function App() {
  // Clean up invalid tokens on app load
  useEffect(() => {
    const token = Cookies.get('token');
    if (token && !isJwtValid(token)) {
      Cookies.remove('token');
      Cookies.remove('username');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/components" element={<ComponentsPage />} />

      <Route path="/posts" element={<ProtectedRoute role={["user", "admin"]}><PostsPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute role={["user", "admin"]}><ChatPage /></ProtectedRoute>} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/profile" element={<ProtectedRoute role={["user", "admin"]}><ProfileField /></ProtectedRoute>} />
      <Route path="/add-friends" element={<ProtectedRoute role={["user", "admin"]}><AddFriendPage /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute role={["user", "admin"]}><FriendsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/api-keys" element={<ProtectedRoute role={["user", "admin"]}><ApiKeysPage /></ProtectedRoute>} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
    </Routes>
  )
}

export default App
