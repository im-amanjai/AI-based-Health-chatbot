import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/login",
        formData
      );

      //Save auth token
      localStorage.setItem(
        "token",
        res.data.token
      );

      // Save full user profile
      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      alert("Login successful!");

      // First-time profile check
      const user = res.data.user;

      // If profile incomplete → Profile Setup
      if (
        !user.age ||
        !user.gender
      ) {
        navigate("/profile");
      }

      // If profile already exists → Direct Chat
      else {
        navigate("/chat");
      }

    } catch (error) {
      alert(
        error.response?.data?.msg ||
          "Login failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 5,
        background: "var(--hero-bg)"
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "0.95fr 1fr"
            },
            overflow: "hidden",
            borderRadius: 3,
            border:
              "1px solid var(--border)",
            boxShadow:
              "0 28px 80px rgba(16, 37, 38, 0.14)"
          }}
        >
          {/* LEFT PANEL */}
          <Box
            sx={{
              minHeight: {
                xs: 260,
                md: 620
              },
              p: {
                xs: 3,
                md: 5
              },
              color: "white",
              display: "flex",
              flexDirection:
                "column",
              justifyContent:
                "space-between",
              background:
                "linear-gradient(rgba(5, 93, 91, 0.7), rgba(16, 37, 38, 0.78)), url(https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=85)",
              backgroundSize:
                "cover",
              backgroundPosition:
                "center"
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <HealthAndSafetyIcon />

              <Typography
                variant="h5"
                fontWeight={800}
              >
                HealthAI
              </Typography>
            </Stack>

            <Box>
              <Typography
                variant="h3"
                fontWeight={800}
                lineHeight={1.05}
              >
                Welcome back to your
                health workspace.
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  maxWidth: 430,
                  color:
                    "rgba(255,255,255,0.82)"
                }}
              >
                Continue symptom
                checks, adaptive AI
                triage, dashboard
                insights, and saved
                health history in one
                place.
              </Typography>
            </Box>
          </Box>

          {/* RIGHT PANEL */}
          <Box
            sx={{
              p: {
                xs: 3,
                sm: 5,
                md: 7
              },
              bgcolor:
                "var(--surface)"
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: "grid",
                placeItems:
                  "center",
                color: "#087f7a",
                bgcolor:
                  "#e2f5f1",
                mb: 3
              }}
            >
              <LockOutlinedIcon />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              gutterBottom
            >
              Login
            </Typography>

            <Typography
              color="var(--muted)"
              sx={{ mb: 4 }}
            >
              Enter your account
              details to continue.
            </Typography>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <Stack
                spacing={2.25}
              >
                {/* EMAIL */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  required
                  onChange={
                    handleChange
                  }
                />

                {/* PASSWORD */}
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  required
                  onChange={
                    handleChange
                  }
                />

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={
                    <LoginIcon />
                  }
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      "#087f7a",
                    fontWeight: 800,
                    boxShadow:
                      "0 16px 34px rgba(8, 127, 122, 0.2)",
                    "&:hover":
                      {
                        bgcolor:
                          "#055d5b"
                      }
                  }}
                >
                  Login
                </Button>
              </Stack>
            </form>

            {/* SIGNUP LINK */}
            <Typography
              align="center"
              sx={{
                mt: 4,
                color:
                  "var(--muted)"
              }}
            >
              Do not have an
              account?{" "}
              <Link to="/signup">
                Create one
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}