import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ShieldIcon from "@mui/icons-material/Shield";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const signupBenefits = [
  "Guided triage questions",
  "Risk level history",
  "Emergency-aware care guidance"
];

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
        py: { xs: 3, md: 5 },
        background: "var(--hero-bg)"
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.95fr 1fr" },
            overflow: "hidden",
            borderRadius: 3,
            border: "1px solid var(--border)",
            boxShadow: "0 28px 80px rgba(16, 37, 38, 0.14)"
          }}
        >
          <Box
            sx={{
              minHeight: { xs: 300, md: 650 },
              p: { xs: 3, md: 5 },
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background:
                "linear-gradient(rgba(5, 93, 91, 0.7), rgba(16, 37, 38, 0.8)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <HealthAndSafetyIcon />
              <Typography variant="h5" fontWeight={800}>
                HealthAI
              </Typography>
            </Stack>

            <Box>
              <Typography variant="h3" fontWeight={800} lineHeight={1.05}>
                Build your personal health workspace.
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 460, color: "rgba(255,255,255,0.82)" }}>
                Create an account to save symptom checks, continue your triage
                journey, and review risk patterns over time.
              </Typography>

              <Stack spacing={1.3} sx={{ mt: 4 }}>
                {signupBenefits.map((benefit) => (
                  <Stack key={benefit} direction="row" spacing={1.3} alignItems="center">
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "rgba(255,255,255,0.16)",
                        color: "#5eead4"
                      }}
                    >
                      <ShieldIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography fontWeight={700}>{benefit}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 3, sm: 5, md: 7 },
              bgcolor: "var(--surface)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                color: "#087f7a",
                bgcolor: "#e2f5f1",
                mb: 3
              }}
            >
              <AccountCircleIcon />
            </Box>

            <Typography variant="h4" fontWeight={800} gutterBottom>
              Create account
            </Typography>

            <Typography color="var(--muted)" sx={{ mb: 4 }}>
              Start with your login details. Your health profile comes next.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.25}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  required
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddAlt1Icon />}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: "#087f7a",
                    fontWeight: 800,
                    boxShadow: "0 16px 34px rgba(8, 127, 122, 0.2)",
                    "&:hover": { bgcolor: "#055d5b" }
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            </form>

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                border: "1px solid var(--border)",
                bgcolor: "var(--surface-soft)"
              }}
            >
              <Stack direction="row" spacing={1.4} alignItems="center">
                <MonitorHeartIcon sx={{ color: "#087f7a" }} />
                <Typography color="var(--soft-text)">
                  Next step: complete your profile so triage can personalize
                  your dashboard.
                </Typography>
              </Stack>
            </Paper>

            <Divider sx={{ my: 3 }} />

            <Typography align="center" sx={{ color: "var(--muted)" }}>
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
