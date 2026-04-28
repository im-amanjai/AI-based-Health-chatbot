import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    conditions: "",
    lifestyle: ""
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
      await API.put("/user/profile", {
        age: Number(formData.age),
        gender: formData.gender,
        conditions: formData.conditions
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        lifestyle: formData.lifestyle
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      });

      alert("Profile updated successfully!");

      // 👉 Move to chat page
      navigate("/chat");

    } catch (error) {
      alert(error.response?.data?.msg || "Profile update failed");
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
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Complete Your Health Profile
          </Typography>

          <Typography align="center" sx={{ mb: 3 }}>
            Help us personalize your healthcare experience
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              name="age"
              margin="normal"
              required
              onChange={handleChange}
            />

            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              margin="normal"
              required
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Medical Conditions (comma separated)"
              name="conditions"
              margin="normal"
              placeholder="diabetes, asthma"
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Lifestyle (comma separated)"
              name="lifestyle"
              margin="normal"
              placeholder="smoker, sedentary"
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
              Save & Continue
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}