import { Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #1976d2, #42a5f5)",
        display: "flex",
        alignItems: "center",
        color: "white"
      }}
    >
      <Container>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          AI-Driven Public Health Assistant
        </Typography>

        <Typography variant="h6" sx={{ mb: 4 }}>
          Risk Detection • Emergency Alerts • Nearby Hospitals • Personalized Healthcare
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{ mr: 2, bgcolor: "white", color: "#1976d2" }}
          onClick={() => navigate("/signup")}
        >
          Get Started
        </Button>

        <Button
          variant="outlined"
          size="large"
          sx={{ color: "white", borderColor: "white" }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Container>
    </Box>
  );
}