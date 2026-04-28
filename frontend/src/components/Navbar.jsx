import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from "@mui/material";

import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Hide navbar on auth pages
  const hideNavbarRoutes = ["/login", "/signup"];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        background: "linear-gradient(to right, #1976d2, #42a5f5)"
      }}
    >
      <Toolbar>

        {/* Logo / Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          <HealthAndSafetyIcon sx={{ mr: 1 }} />

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            HealthAI
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Button
          color="inherit"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
          sx={{ mx: 1, borderRadius: 3 }}
        >
          Home
        </Button>

        <Button
          color="inherit"
          startIcon={<ChatIcon />}
          onClick={() => navigate("/chat")}
          sx={{ mx: 1, borderRadius: 3 }}
        >
          Chat
        </Button>

        <Button
          color="inherit"
          startIcon={<DashboardIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{ mx: 1, borderRadius: 3 }}
        >
          Dashboard
        </Button>

        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            ml: 2,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.15)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.25)"
            }
          }}
        >
          Logout
        </Button>

      </Toolbar>
    </AppBar>
  );
}