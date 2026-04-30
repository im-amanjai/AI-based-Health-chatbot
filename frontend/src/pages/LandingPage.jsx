import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ShieldIcon from "@mui/icons-material/Shield";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <AutoAwesomeIcon />,
    title: "AI Disease Awareness",
    text: "Adaptive guidance for known symptoms and unfamiliar conditions.",
  },
  {
    icon: <MonitorHeartIcon />,
    title: "Risk Scoring",
    text: "Triage based on severity, duration, emergency signals, and disease type.",
  },
  {
    icon: <WarningAmberIcon />,
    title: "Emergency Mode",
    text: "Urgent care instructions surface when a high-risk pattern appears.",
  },
  {
    icon: <LocalHospitalIcon />,
    title: "Nearby Hospitals",
    text: "Location-aware hospital suggestions after critical triage results.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", overflow: "hidden" }}>
      <Box
        sx={{
          minHeight: { xs: "auto", md: "100vh" },
          py: { xs: 3, md: 4 },
          display: "flex",
          alignItems: "flex-start",
          background: "var(--hero-bg)",
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <Box
            sx={{
              mb: { xs: 4, md: 5 },
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  background: "linear-gradient(135deg, #087f7a, #2b6cb0)",
                  boxShadow: "0 12px 30px rgba(8, 127, 122, 0.25)",
                }}
              >
                <HealthAndSafetyIcon />
              </Box>
              <Typography variant="h5" fontWeight={800} color="var(--ink)">
                HealthAI
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              sx={{
                marginLeft: { sm: "auto" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="text"
                startIcon={<LoginIcon />}
                sx={{ color: "var(--ink)", fontWeight: 800 }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#087f7a",
                  borderRadius: 2,
                  px: 2.4,
                  boxShadow: "0 12px 28px rgba(8, 127, 122, 0.24)",
                  "&:hover": { bgcolor: "#055d5b" },
                }}
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 1fr) minmax(380px, 0.82fr)",
              },
              gap: { xs: 4, md: 6 },
              alignItems: "center",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Chip
                label="Hybrid rule-based + AI public health assistant"
                icon={<ShieldIcon />}
                sx={{
                  mb: 2.5,
                  px: 1,
                  maxWidth: "100%",
                  borderRadius: 2,
                  bgcolor: "rgba(213, 255, 253, 0.11)",
                  color: "#cdf7f6",
                  fontWeight: 800,
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  maxWidth: 680,
                  fontSize: { xs: 58, sm: 72, md: 86 },
                  lineHeight: 0.95,
                  letterSpacing: 0,
                  fontWeight: 800,
                  color: "var(--ink)",
                }}
              >
                HealthAI
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mt: 2,
                  maxWidth: 640,
                  color: "var(--soft-text)",
                  fontWeight: 500,
                  lineHeight: 1.55,
                  fontSize: { xs: 20, md: 24 },
                }}
              >
                A calm, guided triage experience for symptom checks, risk
                awareness, emergency guidance, nearby care, and personal health
                history.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.55,
                    px: 3.4,
                    borderRadius: 2,
                    bgcolor: "#087f7a",
                    fontWeight: 800,
                    boxShadow: "0 18px 36px rgba(8, 127, 122, 0.26)",
                    "&:hover": { bgcolor: "#055d5b" },
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Start Health Check
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.55,
                    px: 3.4,
                    borderRadius: 2,
                    color: "var(--ink)",
                    borderColor: "#9fc6c3",
                    fontWeight: 800,
                    bgcolor: "rgba(255,255,255,0.58)",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Continue Journey
                </Button>
              </Stack>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 390, md: 520 },
                }}
              >
                <Box
                  component="img"
                  alt="Clinician reviewing a digital health dashboard"
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1100&q=85"
                  sx={{
                    width: "100%",
                    height: { xs: 300, md: 410 },
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: "0 30px 80px rgba(16, 37, 38, 0.18)",
                    border: "1px solid rgba(255,255,255,0.8)",
                  }}
                />

                <Paper
                  elevation={0}
                  sx={{
                    position: "absolute",
                    left: { xs: 14, sm: 24 },
                    right: { xs: 14, sm: 24 },
                    bottom: { xs: 24, md: 54 },
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(215,230,228,0.9)",
                    boxShadow: "0 20px 50px rgba(16, 37, 38, 0.16)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        minWidth: 50,
                        height: 50,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        color: "#087f7a",
                        bgcolor: "#e2f5f1",
                      }}
                    >
                      <MonitorHeartIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography
                        fontWeight={800}
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "#102526"
                              : "#2f2d2d",
                        }}
                      >
                        Triage journey
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.4,
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "#607174"
                              : "#527165",
                        }}
                      >
                        Symptom input, guided questions, risk level, AI insight,
                        and saved health logs.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "var(--surface)", py: { xs: 4, md: 5 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2.5,
            }}
          >
            {features.map((feature) => (
              <Box key={feature.title} sx={{ minWidth: 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid var(--border)",
                    bgcolor: "var(--surface-soft)",
                  }}
                >
                  <Box sx={{ color: "#087f7a", mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={800} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="var(--muted)" lineHeight={1.6}>
                    {feature.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
