import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import MyTickets from "./pages/Tickets";
import Settings from "./pages/Settings";
import NavBar from "./components/NavBar";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Liked from "./pages/Liked";
import Notifications from "./pages/Notifications";
import Guest from "./pages/Guest";

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
    <>
      <div id="pageWrapper">
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login onLogin={setIsLoggedIn} />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
                <NavBar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <MyTickets />
                <NavBar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
                <NavBar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/liked"
            element={
              <ProtectedRoute>
                <Liked />
                <NavBar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
                <NavBar />
              </ProtectedRoute>
            }
          />

          <Route path="/signup" element={<Signup onSignup={setIsLoggedIn} />} />
          <Route path="/guest" element={<Guest />} />
        </Routes>
      </div>
    </>
  );
}
