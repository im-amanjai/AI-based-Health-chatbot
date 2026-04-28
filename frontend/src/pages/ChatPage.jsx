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

  // 💬 Main Chat
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // 📍 Real user location
  const [location, setLocation] = useState({
    lat: null,
    lng: null
  });

  // 🧠 Hybrid Triage State
  const [triageMode, setTriageMode] = useState(false);
  const [currentSymptom, setCurrentSymptom] =
    useState("");
  const [questions, setQuestions] = useState([]);
  const [
    currentQuestionIndex,
    setCurrentQuestionIndex
  ] = useState(0);
  const [answers, setAnswers] = useState({});

  const chatEndRef = useRef(null);

  // 📍 Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setLocation({
            lat: 12.9716,
            lng: 77.5946
          });
        }
      );
    } else {
      setLocation({
        lat: 12.9716,
        lng: 77.5946
      });
    }
  }, []);

  // 🔽 Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chatHistory]);

  // 🚀 Main Chat Handler
  const handleSend = async () => {
    if (!message.trim()) return;

    // Save user message
    const userMessage = {
      sender: "user",
      text: message
    };

    setChatHistory((prev) => [
      ...prev,
      userMessage
    ]);

    try {
      // 🧠 TRIAGE MODE ACTIVE
      if (triageMode) {
        const updatedAnswers = {
          ...answers,
          [questions[currentQuestionIndex]]:
            message
        };

        setAnswers(updatedAnswers);

        // More questions remaining
        if (
          currentQuestionIndex <
          questions.length - 1
        ) {
          const nextIndex =
            currentQuestionIndex + 1;

          setCurrentQuestionIndex(nextIndex);

          setChatHistory((prev) => [
            ...prev,
            {
              sender: "bot",
              question:
                questions[nextIndex]
            }
          ]);
        }

        // Final submission
        else {
          const finalResponse =
            await API.post(
              "/triage/submit",
              {
                symptom:
                  currentSymptom,
                answers:
                  updatedAnswers,
                lat: location.lat,
                lng: location.lng
              }
            );

          const botMessage = {
            sender: "bot",
            risk:
              finalResponse.data.risk,
            emergency:
              finalResponse.data
                .emergency,
            message:
              finalResponse.data
                .message,
            hospitals:
              finalResponse.data
                .hospitals,
            aiAdvice:
              finalResponse.data
                .aiAdvice
          };

          setChatHistory((prev) => [
            ...prev,
            botMessage
          ]);

          // Reset triage
          setTriageMode(false);
          setCurrentQuestionIndex(0);
          setQuestions([]);
          setAnswers({});
          setCurrentSymptom("");
        }
      }

      // 🟢 START TRIAGE MODE
      else {
        const response =
          await API.post(
            "/triage/start",
            {
              symptom: message
            }
          );

        setTriageMode(true);
        setCurrentSymptom(message);
        setQuestions(
          response.data.questions
        );
        setCurrentQuestionIndex(0);

        setChatHistory((prev) => [
          ...prev,
          {
            sender: "bot",
            question:
              response.data
                .questions[0]
          }
        ]);
      }
    } catch (error) {
      alert(
        error.response?.data?.msg ||
          "Analysis failed"
      );
    }

    setMessage("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f8fb",
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* LEFT CHAT */}
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
                Enter any symptom or disease
                for adaptive triage.
              </Typography>

              {/* Quick Buttons */}
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
                  "Dengue",
                  "Asthma"
                ].map((symptom) => (
                  <Button
                    key={symptom}
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setMessage(symptom)
                    }
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
                {chatHistory.map(
                  (chat, index) => (
                    <Box
                      key={index}
                      sx={{ mb: 3 }}
                    >
                      {/* USER */}
                      {chat.sender ===
                      "user" ? (
                        <Box
                          sx={{
                            textAlign:
                              "right"
                          }}
                        >
                          <Typography
                            sx={{
                              bgcolor:
                                "#1976d2",
                              color:
                                "white",
                              p: 2,
                              borderRadius: 3,
                              display:
                                "inline-block",
                              maxWidth:
                                "75%"
                            }}
                          >
                            {chat.text}
                          </Typography>
                        </Box>
                      ) : (
                        <Card
                          sx={{
                            bgcolor:
                              chat.emergency
                                ? "#ffebee"
                                : "#e3f2fd",
                            border:
                              chat.emergency
                                ? "2px solid red"
                                : "1px solid #bbdefb",
                            borderRadius: 4
                          }}
                        >
                          <CardContent>
                            {/* Question */}
                            {chat.question && (
                              <Typography fontWeight="bold">
                                {`Question ${
                                  questions.indexOf(
                                    chat.question
                                  ) + 1
                                }/${
                                  questions.length
                                }: ${
                                  chat.question
                                }`}
                              </Typography>
                            )}

                            {/* Final Result */}
                            {chat.risk && (
                              <>
                                <Typography
                                  fontWeight="bold"
                                  gutterBottom
                                >
                                  Risk Level:{" "}
                                  {
                                    chat.risk
                                  }
                                </Typography>

                                <Typography sx={{ mb: 2 }}>
                                  {
                                    chat.message
                                  }
                                </Typography>

                                {/* AI Advice */}
                                {chat.aiAdvice && (
                                  <Box
                                    sx={{
                                      mt: 2,
                                      p: 2,
                                      bgcolor:
                                        "#f1f8e9",
                                      borderRadius: 3,
                                      border:
                                        "1px solid #8bc34a",
                                      mb: 2
                                    }}
                                  >
                                    <Typography fontWeight="bold">
                                      🤖 AI Health Insight:
                                    </Typography>

                                    <Typography
                                      sx={{
                                        whiteSpace:
                                          "pre-line"
                                      }}
                                    >
                                      {
                                        chat.aiAdvice
                                      }
                                    </Typography>
                                  </Box>
                                )}

                                {/* Emergency */}
                                {chat.emergency && (
                                  <Box
                                    sx={{
                                      p: 2,
                                      bgcolor:
                                        "#ffcdd2",
                                      borderRadius: 3,
                                      border:
                                        "2px solid red",
                                      mb: 2
                                    }}
                                  >
                                    <Typography
                                      color="error"
                                      fontWeight="bold"
                                    >
                                      <WarningIcon fontSize="small" /> Emergency Steps:
                                    </Typography>

                                    <Typography>
                                      • Stay calm
                                    </Typography>
                                    <Typography>
                                      • Contact emergency services
                                    </Typography>
                                    <Typography>
                                      • Visit nearest hospital immediately
                                    </Typography>
                                  </Box>
                                )}

                                {/* Hospitals */}
                                {chat.hospitals?.length >
                                  0 && (
                                  <Box>
                                    <Typography fontWeight="bold">
                                      Nearby Hospitals:
                                    </Typography>

                                    {chat.hospitals.map(
                                      (
                                        hospital,
                                        i
                                      ) => (
                                        <Card
                                          key={
                                            i
                                          }
                                          sx={{
                                            mt: 1,
                                            borderRadius: 3
                                          }}
                                        >
                                          <CardContent>
                                            <Typography fontWeight="bold">
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
                                          </CardContent>
                                        </Card>
                                      )
                                    )}
                                  </Box>
                                )}
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                  )
                )}

                <div ref={chatEndRef}></div>
              </Box>

              {/* Input */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 3
                }}
              >
                <TextField
                  fullWidth
                  label={
                    triageMode
                      ? "Answer the question..."
                      : "Enter symptom or disease..."
                  }
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
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

          {/* RIGHT PANEL */}
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
              >
                Welcome, {user?.name}
              </Typography>

              <Typography>
                Email: {user?.email}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Location Status:{" "}
                {location.lat
                  ? "📍 Live Location Enabled"
                  : "⚠️ Default Location"}
              </Typography>

              <Typography sx={{ mt: 3 }}>
                Adaptive disease triage +
                AI-powered health guidance.
              </Typography>

              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  bgcolor: "#fff3e0",
                  borderRadius: 3
                }}
              >
                <Typography fontWeight="bold">
                  Emergency Tip:
                </Typography>

                <Typography color="error">
                  Severe symptoms +
                  breathlessness = immediate care
                </Typography>
              </Box>

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
                  navigate(
                    "/dashboard"
                  )
                }
              >
                View Dashboard
              </Button>

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
                  navigate(
                    "/login"
                  );
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