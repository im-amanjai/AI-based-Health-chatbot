import { useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import SaveIcon from "@mui/icons-material/Save";
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
      navigate("/chat");
    } catch (error) {
      alert(error.response?.data?.msg || "Profile update failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        background: "var(--page-bg)"
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ width: "100%", mx: "auto" }}>
          <Paper
            elevation={0}
            sx={{
              minHeight: { xs: 260, md: 294 },
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background:
                "linear-gradient(rgba(5, 93, 91, 0.78), rgba(16, 37, 38, 0.84)), url(https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1500&q=85)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 24px 70px rgba(16, 37, 38, 0.18)"
            }}
          >
            <MonitorHeartIcon sx={{ fontSize: 44, mb: 3 }} />
            <Typography
              variant="h3"
              fontWeight={800}
              lineHeight={1.08}
              sx={{ fontSize: { xs: 40, md: 58 } }}
            >
              Personalize your care.
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 980,
                color: "rgba(255,255,255,0.86)",
                lineHeight: 1.7,
                fontSize: { xs: 16, md: 20 }
              }}
            >
              Your profile helps the assistant frame triage questions and
              dashboard summaries around your context.
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              mt: { xs: 3, md: 4 },
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              border: "1px solid var(--border)",
              bgcolor: "var(--surface)",
              boxShadow: "0 24px 70px rgba(16, 37, 38, 0.12)",
              overflow: "hidden"
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 4 }}
            >
                <Box
                  sx={{
                    width: 56,
                    minWidth: 56,
                    height: 56,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    color: "#087f7a",
                    bgcolor: "#e2f5f1"
                  }}
                >
                  <AssignmentIndIcon />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    Health Profile
                  </Typography>
                  <Typography color="var(--muted)">
                    Add the essentials before starting your first check.
                  </Typography>
                </Box>
              </Stack>

              <form onSubmit={handleSubmit}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "minmax(180px, 0.85fr) minmax(210px, 0.85fr) minmax(260px, 1.15fr) minmax(260px, 1.15fr)"
                    },
                    gap: { xs: 2.5, md: 3 },
                    alignItems: "start"
                  }}
                >
                  <Box>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      name="age"
                      required
                      onChange={handleChange}
                    />
                  </Box>

                  <Box>
                    <TextField
                      select
                      fullWidth
                      label="Gender"
                      name="gender"
                      required
                      onChange={handleChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      label="Medical Conditions"
                      name="conditions"
                      placeholder="diabetes, asthma"
                      helperText="Separate multiple conditions with commas."
                      onChange={handleChange}
                    />
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      label="Lifestyle"
                      name="lifestyle"
                      placeholder="smoker, sedentary, active"
                      helperText="Add lifestyle notes separated by commas."
                      onChange={handleChange}
                    />
                  </Box>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: "var(--surface-soft)",
                    border: "1px solid var(--border)"
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <FavoriteIcon sx={{ color: "#d92d20" }} />
                    <Typography color="var(--soft-text)">
                      Severe chest pain, breathlessness, fainting, or sudden
                      weakness should be treated as urgent.
                    </Typography>
                  </Stack>
                </Paper>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: "#087f7a",
                    fontWeight: 800,
                    boxShadow: "0 16px 34px rgba(8, 127, 122, 0.2)",
                    "&:hover": { bgcolor: "#055d5b" }
                  }}
                >
                  Save and Continue
                </Button>
              </form>
            </Paper>
        </Box>
      </Container>
    </Box>
  );
}
