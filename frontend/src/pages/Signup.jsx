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

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await API.post("/auth/signup", formData);

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.msg || "Signup failed");
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
            Create Account
          </Typography>

          <Typography align="center" sx={{ mb: 3 }}>
            Join your AI Health Assistant
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              margin="normal"
              required
              onChange={handleChange}
            />

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
              Sign Up
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}