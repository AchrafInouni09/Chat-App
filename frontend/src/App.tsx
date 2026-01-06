
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import ChatPage from "./components/ChatPage.tsx";
import AuthPage from "./components/AuthPage.tsx";
import ProfileField from "./components/ProfileField.tsx";
import AddFriendPage from "./components/AddFriendPage.tsx";


import './App.css'


function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/profile" element={<ProfileField />} />
      <Route path="/add-friends" element={<AddFriendPage />} />
    </Routes>
  )
}

export default App
