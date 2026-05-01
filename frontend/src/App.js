import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/ProfileSetup";
import ChatPage from "./pages/ChatPage";
import Dashboard from "./pages/Dashboard";
import ProfileView from "./pages/ProfileView";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { AppThemeProvider } from "./theme/ThemeContext.jsx";

function App() {
  return (
    <AppThemeProvider>
      <Router>
        <ThemeToggle />
        <Routes>

        {/* 🌐 Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/profile-view"
  element={
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  }
/>

        </Routes>
      </Router>
    </AppThemeProvider>
  );
}

export default App;
