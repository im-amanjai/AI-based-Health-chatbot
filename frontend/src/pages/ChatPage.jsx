import { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import WarningIcon from "@mui/icons-material/Warning";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ChatPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // 📍 Real user location
  const [location, setLocation] = useState({
    lat: null,
    lng: null
  });

  const chatEndRef = useRef(null);

  // 📍 Fetch real location once on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error(
            "Location access denied:",
            error.message
          );

          // Fallback (Bengaluru)
          setLocation({
            lat: 12.9716,
            lng: 77.5946
          });
        }
      );
    } else {
      // Browser unsupported fallback
      setLocation({
        lat: 12.9716,
        lng: 77.5946
      });
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // User message
    const userMessage = {
      sender: "user",
      text: message
    };

    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const response = await API.post("/health/analyze", {
        symptoms: [message],
        lat: location.lat,
        lng: location.lng
      });

      // Bot response
      const botMessage = {
        sender: "bot",
        risk: response.data.risk,
        emergency: response.data.emergency,
        message: response.data.message,
        hospitals: response.data.hospitals,
        aiAdvice: response.data.aiAdvice
      };

      setChatHistory((prev) => [...prev, botMessage]);

    } catch (error) {
      alert("Analysis failed");
    }

    setMessage("");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f8fb", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>

          {/* LEFT SECTION - CHAT */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                minHeight: "85vh",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Header */}
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="#1976d2"
              >
                AI Health Assistant
              </Typography>

              <Typography sx={{ mb: 2 }}>
                Describe your symptoms and get instant health guidance.
              </Typography>

              {/* Quick Symptom Buttons */}
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap"
                }}
              >
                {[
                  "Chest pain",
                  "Fever",
                  "Headache",
                  "Breathing difficulty",
                  "Cold and cough"
                ].map((symptom) => (
                  <Button
                    key={symptom}
                    variant="outlined"
                    size="small"
                    onClick={() => setMessage(symptom)}
                  >
                    {symptom}
                  </Button>
                ))}
              </Box>

              {/* Chat History */}
              <Box
                sx={{
                  flexGrow: 1,
                  maxHeight: "60vh",
                  overflowY: "auto",
                  pr: 1
                }}
              >
                {chatHistory.map((chat, index) => (
                  <Box key={index} sx={{ mb: 3 }}>

                    {/* USER MESSAGE */}
                    {chat.sender === "user" ? (
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            bgcolor: "#1976d2",
                            color: "white",
                            p: 2,
                            borderRadius: 3,
                            display: "inline-block",
                            maxWidth: "75%"
                          }}
                        >
                          {chat.text}
                        </Typography>
                      </Box>
                    ) : (

                      /* BOT RESPONSE */
                      <Card
                        sx={{
                          bgcolor: chat.emergency
                            ? "#ffebee"
                            : "#e3f2fd",
                          border: chat.emergency
                            ? "2px solid red"
                            : "1px solid #bbdefb",
                          borderRadius: 4
                        }}
                      >
                        <CardContent>

                          {/* Risk */}
                          <Typography
                            fontWeight="bold"
                            gutterBottom
                          >
                            Risk Level: {chat.risk}
                          </Typography>

                          {/* Rule-Based Message */}
                          <Typography sx={{ mb: 2 }}>
                            {chat.message}
                          </Typography>

                          {/* 🤖 AI Advice */}
                          {chat.aiAdvice && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: "#f1f8e9",
                                borderRadius: 3,
                                border:
                                  "1px solid #8bc34a",
                                mb: 2
                              }}
                            >
                              <Typography
                                fontWeight="bold"
                                gutterBottom
                              >
                                🤖 AI Health Insight:
                              </Typography>

                              <Typography
                                sx={{
                                  whiteSpace:
                                    "pre-line"
                                }}
                              >
                                {chat.aiAdvice}
                              </Typography>
                            </Box>
                          )}

                          {/* Emergency Box */}
                          {chat.emergency && (
                            <Box
                              sx={{
                                p: 2,
                                bgcolor: "#ffcdd2",
                                borderRadius: 3,
                                border:
                                  "2px solid red",
                                mb: 2
                              }}
                            >
                              <Typography
                                color="error"
                                fontWeight="bold"
                                gutterBottom
                              >
                                <WarningIcon fontSize="small" /> Emergency Steps:
                              </Typography>

                              <Typography>
                                • Stay calm and sit down
                              </Typography>

                              <Typography>
                                • Contact emergency services
                              </Typography>

                              <Typography>
                                • Visit nearest hospital immediately
                              </Typography>
                            </Box>
                          )}

                          {/* Nearby Hospitals */}
                          {chat.hospitals?.length > 0 && (
                            <Box>
                              <Typography
                                fontWeight="bold"
                                gutterBottom
                              >
                                Nearby Hospitals:
                              </Typography>

                              {chat.hospitals.map(
                                (hospital, i) => (
                                  <Card
                                    key={i}
                                    sx={{
                                      mt: 1,
                                      borderRadius: 3,
                                      boxShadow: 2
                                    }}
                                  >
                                    <CardContent>
                                      <Typography
                                        fontWeight="bold"
                                      >
                                        <LocalHospitalIcon
                                          fontSize="small"
                                          sx={{
                                            mr: 1
                                          }}
                                        />
                                        {
                                          hospital.name
                                        }
                                      </Typography>

                                      {hospital.distance && (
                                        <Typography variant="body2">
                                          Distance:{" "}
                                          {
                                            hospital.distance
                                          }
                                        </Typography>
                                      )}
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </Box>
                          )}

                        </CardContent>
                      </Card>
                    )}

                  </Box>
                ))}

                {/* Auto-scroll */}
                <div ref={chatEndRef}></div>
              </Box>

              {/* Input Section */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 3
                }}
              >
                <TextField
                  fullWidth
                  label="Describe your symptoms..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleSend()
                  }
                />

                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSend}
                  sx={{
                    px: 4,
                    borderRadius: 3
                  }}
                >
                  Send
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* RIGHT SECTION - PROFILE */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                minHeight: "85vh"
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
              >
                Welcome, {user?.name}
              </Typography>

              <Typography>
                Email: {user?.email}
              </Typography>

              {/* 📍 Location Status */}
              <Typography sx={{ mt: 1 }}>
                Location Status:{" "}
                {location.lat && location.lng
                  ? "📍 Live Location Enabled"
                  : "⚠️ Using Default Location"}
              </Typography>

              <Typography sx={{ mt: 3 }}>
                Your AI health assistant helps
                assess symptoms, explain risks,
                provide preventive tips, detect
                emergencies, and suggest nearby
                healthcare.
              </Typography>

              {/* Emergency Tip */}
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  bgcolor: "#fff3e0",
                  borderRadius: 3
                }}
              >
                <Typography
                  fontWeight="bold"
                  gutterBottom
                >
                  Emergency Tip:
                </Typography>

                <Typography color="error">
                  If experiencing chest pain,
                  breathing difficulty, or severe
                  bleeding, seek immediate medical
                  help.
                </Typography>
              </Box>

              {/* Dashboard Button */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<DashboardIcon />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 3
                }}
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                View Dashboard
              </Button>

              {/* Logout Button */}
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 3
                }}
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}