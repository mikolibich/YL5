import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import MyTickets from "./pages/Tickets";
import Settings from "./pages/Settings";
import NavBar from "./components/NavBar";
import Landing from "./pages/Landing";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const ProtectedRoute = ({ children }) => {
    if (isLoading) return null;
    return isLoggedIn ? children : <Navigate to="/landing" replace />;
  };

  if (isLoading) return null;
  if (location.pathname === "/") {
    return <Navigate to={isLoggedIn ? "/home" : "/landing"} replace />;
  }

  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />

      {/* Login page */}
      <Route path="/login" element={<Login onLogin={setIsLoggedIn} />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <NavBar />
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <NavBar />
            <MyTickets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <NavBar />
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
