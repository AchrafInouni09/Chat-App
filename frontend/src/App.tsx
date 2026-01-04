
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import AuthPage from "./components/AuthPage.tsx";


import './App.css'


function App() {

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
  )
}

export default App
