import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
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
      const res = await API.post("/auth/login", formData);

      // ✅ Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");

      // 👉 Redirect to Profile Setup first
      navigate("/profile");

    } catch (error) {
      alert(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f8fb"
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            Welcome Back
          </Typography>

          <Typography align="center" sx={{ mb: 3 }}>
            Login to continue your health journey
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              margin="normal"
              required
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              margin="normal"
              required
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 3,
                bgcolor: "#1976d2"
              }}
            >
              Login
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 3 }}>
            Don’t have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}