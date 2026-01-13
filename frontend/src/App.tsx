
import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import ChatPage from "./components/ChatPage.tsx";
import AuthPage from "./components/AuthPage.tsx";
import ProfileField from "./components/ProfileField.tsx";
import AddFriendPage from "./components/AddFriendPage.tsx";
import AdminDashboard from "./components/AdminDashboard.tsx";
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
  return <>{children  }</>;
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ProtectedRoute role={["user", "admin"]}><ChatPage /></ProtectedRoute>} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/profile" element={<ProtectedRoute role={["user", "admin"]}><ProfileField /></ProtectedRoute>} />
      <Route path="/add-friends" element={<ProtectedRoute role={["user", "admin"]}><AddFriendPage /></ProtectedRoute>} />
      <Route path="/admin" element={ <ProtectedRoute role={["admin"]}><AdminDashboard /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
