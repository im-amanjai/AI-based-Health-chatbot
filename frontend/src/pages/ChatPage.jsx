import { useState, useRef, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LogoutIcon from "@mui/icons-material/Logout";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import ShieldIcon from "@mui/icons-material/Shield";
import WarningIcon from "@mui/icons-material/Warning";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

const quickSymptoms = ["Chest pain", "Fever", "Headache", "Dengue", "Asthma"];

const riskStyles = {
  HIGH: { color: "#d92d20", bg: "#fff1f0", border: "#f4a7a1" },
  MEDIUM: { color: "#b45309", bg: "#fff7ed", border: "#fed7aa" },
  LOW: { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
};

const lightPanelText = {
  emergency: "#7c2d12",
  insight: "#14532d",
  neutral: "#102526",
};

const cleanAIText = (text) =>
  text
    .replace(/^#{1,6}\s*/, "")
    .replace(/\*\*/g, "")
    .trim();

const renderAIAdvice = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Stack spacing={1.2}>
      {lines.map((line, index) => {
        const isHeading = /^#{1,6}\s*/.test(line) || /^\d+\.\s+/.test(line);
        const isBullet = /^[-*]\s+/.test(line);
        const cleaned = cleanAIText(line.replace(/^[-*]\s+/, ""));

        if (isHeading) {
          return (
            <Typography
              key={`${line}-${index}`}
              fontWeight={900}
              color="#102526"
              sx={{ mt: index === 0 ? 0 : 1.2 }}
            >
              {cleaned}
            </Typography>
          );
        }

        if (isBullet) {
          return (
            <Stack
              key={`${line}-${index}`}
              direction="row"
              spacing={1.2}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#15803d",
                  mt: 1.05,
                  flexShrink: 0,
                }}
              />
              <Typography color="#31575a" lineHeight={1.6}>
                {cleaned}
              </Typography>
            </Stack>
          );
        }

        return (
          <Typography
            key={`${line}-${index}`}
            color="#31575a"
            lineHeight={1.65}
          >
            {cleaned}
          </Typography>
        );
      })}
    </Stack>
  );
};

export default function ChatPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

  const [triageMode, setTriageMode] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setLocation({
            lat: 12.9716,
            lng: 77.5946,
          });
        },
      );
    } else {
      setLocation({
        lat: 12.9716,
        lng: 77.5946,
      });
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatHistory]);

const handleSend = async (
  voiceInput = null
) => {
  const finalMessage =
    voiceInput || message;

  if (
    !finalMessage.trim()
  )
    return;

  const userMessage = {
    sender: "user",
    text: finalMessage
  };

  setChatHistory(
    (prev) => [
      ...prev,
      userMessage
    ]
  );

  try {
    if (triageMode) {
      const updatedAnswers =
        {
          ...answers,
          [questions[
            currentQuestionIndex
          ]]:
            finalMessage
        };

      setAnswers(
        updatedAnswers
      );

      if (
        currentQuestionIndex <
        questions.length - 1
      ) {
        const nextIndex =
          currentQuestionIndex +
          1;

        setCurrentQuestionIndex(
          nextIndex
        );

const nextQuestion =
  questions[nextIndex];

setChatHistory(
  (prev) => [
    ...prev,
    {
      sender: "bot",
      question:
        nextQuestion
    }
  ]
);

speakText(
  nextQuestion
);

      } else {
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

        const botMessage =
          {
            sender: "bot",
            risk:
              finalResponse.data
                .risk,
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

setChatHistory(
  (prev) => [
    ...prev,
    botMessage
  ]
);

//  Speak final diagnosis
const finalSpeech =
  `${finalResponse.data.risk} risk. ${finalResponse.data.message}`;

speakText(
  finalSpeech
);

        setTriageMode(
          false
        );
        setCurrentQuestionIndex(
          0
        );
        setQuestions([]);
        setAnswers({});
        setCurrentSymptom(
          ""
        );
      }

    } else {
      const response =
        await API.post(
          "/triage/start",
          {
            symptom:
              finalMessage
          }
        );

      setTriageMode(true);
      setCurrentSymptom(
        finalMessage
      );
      setQuestions(
        response.data
          .questions
      );
      setCurrentQuestionIndex(
        0
      );

const firstQuestion =
  response.data
    .questions[0];

setChatHistory(
  (prev) => [
    ...prev,
    {
      sender: "bot",
      question:
        firstQuestion
    }
  ]
);

speakText(
  firstQuestion
);
    }

  } catch (error) {
    alert(
      error.response?.data
        ?.msg ||
        "Analysis failed"
    );
  }

  setMessage("");
};
const startListening = () => {
  // Prevent duplicate sessions
  if (isListening) return;

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech recognition not supported in this browser."
    );
    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  setIsListening(true);

  recognition.start();

  recognition.onresult = (
    event
  ) => {
const transcript =
  event.results[0][0]
    .transcript
    .trim()
    .replace(/\.$/, "")
    .toLowerCase();

    setMessage(
      transcript
    );

    setIsListening(
      false
    );

    // Auto send spoken input
    handleSend(
      transcript
    );
  };

  recognition.onerror =
    (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(
        false
      );
    };

  recognition.onend =
    () => {
      setIsListening(
        false
      );
    };
};
const speakText = (text) => {
  if (
    !window.speechSynthesis
  )
    return;

  const utterance =
    new SpeechSynthesisUtterance(
      text
    );

  utterance.lang =
    "en-US";

  utterance.rate = 1;
  utterance.pitch = 1;

  // Stop overlap
  window.speechSynthesis.cancel();

  utterance.onend =
    () => {
      // 🎤 Auto restart mic ONLY during question flow
      if (
        triageMode && 
        voiceMode
      ) {
        setTimeout(() => {
          startListening();
        }, 700);
      }
    };

  window.speechSynthesis.speak(
    utterance
  );
};

  const activeProgress =
    triageMode && questions.length
      ? `${currentQuestionIndex + 1}/${questions.length}`
      : "Ready";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        background: "var(--page-bg)",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          overflowX: "hidden",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={{ xs: 1.6, md: 2 }}
          sx={{ mb: { xs: 2, md: 3 }, maxWidth: "100%" }}
        >
          <Box sx={{ minWidth: 0, width: "100%" }}>
            <Stack direction="row" spacing={1.4} alignItems="flex-start">
              <Box
                sx={{
                  width: { xs: 42, md: 44 },
                  minWidth: { xs: 42, md: 44 },
                  height: { xs: 56, md: 44 },
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  bgcolor: "#087f7a",
                }}
              >
                <HealthAndSafetyIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    fontSize: { xs: 40, sm: 44, md: 42 },
                    lineHeight: { xs: 1.08, md: 1.2 },
                  }}
                >
                  HealthAI Assistant
                </Typography>
                <Typography
                  color="var(--muted)"
                  sx={{
                    mt: { xs: 0.6, md: 0 },
                    maxWidth: { xs: 300, sm: "none" },
                    lineHeight: 1.45,
                  }}
                >
                  Symptom triage, risk analysis, AI insight, and nearby care.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, max-content)",
                md: "repeat(2, max-content)",
              },
              gap: 1,
              justifyContent: { xs: "stretch", md: "end" },
            }}
          >
            <Chip
              icon={<GpsFixedIcon />}
              label={
                location.lat ? "Live location enabled" : "Default location"
              }
              sx={{
                borderRadius: 2,
                bgcolor: "#e2f5f1",
                color: "#055d5b",
                fontWeight: 800,
                maxWidth: "100%",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
            <Chip
  icon={<MicIcon />}
  label={
    voiceMode
      ? "Voice Mode ON"
      : "Voice Mode OFF"
  }
  onClick={() =>
    setVoiceMode(
      !voiceMode
    )
  }
  sx={{
    borderRadius: 2,
    cursor: "pointer",
    bgcolor: voiceMode
      ? "#e2f5f1"
      : "#f3f4f6",
    color: voiceMode
      ? "#055d5b"
      : "#6b7280",
    fontWeight: 800,
    "&:hover": {
      bgcolor: voiceMode
        ? "#c9ebe5"
        : "#e5e7eb"
    }
  }}
/>
            <Chip
              icon={<MonitorHeartIcon />}
              label={`Triage: ${activeProgress}`}
              sx={{
                borderRadius: 2,
                bgcolor: "#eff6ff",
                color: "#2b6cb0",
                fontWeight: 800,
                maxWidth: "100%",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
<Chip
  icon={<MicIcon />}
  label={
    !voiceMode
      ? "Voice: OFF"
      : voiceMode &&
        triageMode
        ? "Voice: Auto Interview"
        : isListening
          ? "Voice: Listening..."
          : "Voice: Ready"
  }
  sx={{
    borderRadius: 2,
    bgcolor:
      !voiceMode
        ? "#f3f4f6"
        : voiceMode &&
          triageMode
          ? "#eff6ff"
          : isListening
            ? "#fff1f0"
            : "#f0fdf4",

    color:
      !voiceMode
        ? "#6b7280"
        : voiceMode &&
          triageMode
          ? "#2b6cb0"
          : isListening
            ? "#d92d20"
            : "#15803d",

    fontWeight: 800,
    maxWidth: "100%",

    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }}
/>
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 2fr) minmax(340px, 0.72fr)",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                minHeight: { xs: "72vh", md: "calc(100vh - 190px)" },
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid var(--border)",
                bgcolor: "var(--surface)",
                boxShadow: "0 24px 70px rgba(16, 37, 38, 0.12)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderBottom: "1px solid var(--border)",
                  background:
                    "linear-gradient(135deg, rgba(8,127,122,0.1), rgba(43,108,176,0.08))",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{ fontSize: { xs: 26, md: 20 }, lineHeight: 1.35 }}
                    >
                      Start with any symptom or disease
                    </Typography>
                    <Typography color="var(--muted)" sx={{ lineHeight: 1.5 }}>
                      Known conditions use guided rules. Unknown ones get
                      adaptive AI triage questions.
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      triageMode ? `Checking ${currentSymptom}` : "New check"
                    }
                    sx={{
                      alignSelf: { xs: "flex-start", md: "center" },
                      borderRadius: 2,
                      bgcolor: triageMode ? "#fff7ed" : "#f0fdf4",
                      color: triageMode ? "#b45309" : "#15803d",
                      fontWeight: 800,
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    mt: 2.5,
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(5, max-content)",
                    },
                    gap: 1,
                  }}
                >
                  {quickSymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant="outlined"
                      size="small"
                      onClick={() => setMessage(symptom)}
                      sx={{
                        borderRadius: 2,
                        borderColor: "var(--border)",
                        color: "var(--ink)",
                        fontWeight: 800,
                        bgcolor: "var(--surface)",
                        minWidth: 0,
                        px: { xs: 1, sm: 1.5 },
                        whiteSpace: "normal",
                        lineHeight: 1.25,
                      }}
                    >
                      {symptom}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  minHeight: { xs: 320, md: 420 },
                  maxHeight: { xs: "56vh", md: "calc(100vh - 430px)" },
                  overflowY: "auto",
                  p: { xs: 1.5, sm: 2, md: 3 },
                  bgcolor: "var(--surface-soft)",
                }}
              >
                {chatHistory.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: 2,
                      border: "1px dashed var(--border)",
                      bgcolor: "var(--surface)",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <AutoAwesomeIcon sx={{ color: "#087f7a" }} />
                      <Typography
                        color="var(--soft-text)"
                        sx={{ lineHeight: 1.5 }}
                      >
                        Try "Dengue", "Chest pain", or describe how you feel.
                      </Typography>
                    </Stack>
                  </Paper>
                )}

                {chatHistory.map((chat, index) => {
                  const risk = riskStyles[chat.risk] || riskStyles.LOW;

                  return (
                    <Box key={index} sx={{ mb: 2.5 }}>
                      {chat.sender === "user" ? (
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            sx={{
                              bgcolor: "#087f7a",
                              color: "white",
                              px: 2,
                              py: 1.4,
                              borderRadius: "18px 18px 4px 18px",
                              display: "inline-block",
                              maxWidth: "78%",
                              boxShadow: "0 10px 24px rgba(8,127,122,0.18)",
                              textAlign: "left",
                            }}
                          >
                            {chat.text}
                          </Typography>
                        </Box>
                      ) : (
                        <Card
                          elevation={0}
                          sx={{
                            maxWidth: "92%",
                            bgcolor: chat.emergency
                              ? "#fff7f6"
                              : "var(--surface)",
                            border: `1px solid ${chat.emergency ? "#f4a7a1" : "var(--border)"}`,
                            borderRadius: 3,
                            boxShadow: "0 12px 35px rgba(16,37,38,0.08)",
                            color: chat.emergency
                              ? lightPanelText.emergency
                              : "var(--ink)",
                          }}
                        >
                          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                            {chat.question && (
                              <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="flex-start"
                              >
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    display: "grid",
                                    placeItems: "center",
                                    color: "#087f7a",
                                    bgcolor: "#e2f5f1",
                                    flexShrink: 0,
                                  }}
                                >
                                  <ShieldIcon fontSize="small" />
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="var(--muted)"
                                    fontWeight={800}
                                    textTransform="uppercase"
                                  >
                                    Question{" "}
                                    {questions.indexOf(chat.question) + 1}/
                                    {questions.length}
                                  </Typography>
                               <>
  <Typography
    fontWeight={800}
    sx={{ mt: 0.5 }}
  >
    {chat.question}
  </Typography>

  <Typography
    variant="caption"
    sx={{
      display: "block",
      mt: 0.8,
      color: "#087f7a",
      fontWeight: 700
    }}
  >
    🎤 Tap mic or type your answer
  </Typography>
</>
                                </Box>
                              </Stack>
                            )}

                            {chat.risk && (
                              <Stack spacing={2}>
                                <Stack
                                  direction="row"
                                  spacing={1.5}
                                  alignItems="center"
                                >
                                  <Chip
                                    label={`${chat.risk} Risk`}
                                    sx={{
                                      borderRadius: 2,
                                      bgcolor: risk.bg,
                                      color: risk.color,
                                      border: `1px solid ${risk.border}`,
                                      fontWeight: 900,
                                    }}
                                  />
                                  {chat.emergency && (
                                    <Chip
                                      icon={<WarningIcon />}
                                      label="Emergency mode"
                                      sx={{
                                        borderRadius: 2,
                                        bgcolor: "#fff1f0",
                                        color: "#d92d20",
                                        fontWeight: 900,
                                      }}
                                    />
                                  )}
                                </Stack>

                                <Typography
                                  color={
                                    chat.emergency
                                      ? lightPanelText.emergency
                                      : "var(--soft-text)"
                                  }
                                >
                                  {chat.message}
                                </Typography>

                                {chat.aiAdvice && (
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 2,
                                      bgcolor: "#f0fdf4",
                                      borderRadius: 2,
                                      border: "1px solid #bbf7d0",
                                      color: lightPanelText.insight,
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                      sx={{ mb: 1 }}
                                    >
                                      <AutoAwesomeIcon
                                        sx={{ color: "#15803d" }}
                                      />
                                      <Typography
                                        fontWeight={800}
                                        color={lightPanelText.insight}
                                      >
                                        AI Health Insight
                                      </Typography>
                                    </Stack>
                                    {renderAIAdvice(chat.aiAdvice)}
                                  </Paper>
                                )}

                                {chat.emergency && (
                                  <Alert
                                    severity="error"
                                    icon={<WarningIcon />}
                                    sx={{
                                      borderRadius: 2,
                                      alignItems: "flex-start",

                                      bgcolor: "#fff1f0",
                                      border: "1px solid #f4a7a1",
                                      color: "#7a271a",

                                      "& .MuiAlert-icon": {
                                        color: "#d92d20",
                                      },
                                    }}
                                  >
                                    <Typography fontWeight={800}>
                                      Emergency Steps
                                    </Typography>
                                    <Typography>Stay calm</Typography>
                                    <Typography>
                                      Contact emergency services
                                    </Typography>
                                    <Typography>
                                      Visit nearest hospital immediately
                                    </Typography>
                                  </Alert>
                                )}

                                {chat.hospitals?.length > 0 && (
                                  <Box>
                                    <Typography fontWeight={800} sx={{ mb: 1 }}>
                                      Nearby Hospitals
                                    </Typography>

                                    <Box
                                      sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                          xs: "1fr",
                                          sm: "repeat(2, minmax(0, 1fr))",
                                        },
                                        gap: 1.5,
                                      }}
                                    >
                                      {chat.hospitals.map((hospital, i) => (
                                        <Box key={i} sx={{ minWidth: 0 }}>
                                          <Paper
                                            elevation={0}
                                            sx={{
                                              p: 1.6,
                                              borderRadius: 2,
                                              bgcolor: "#f0fdf4",
                                              border: "1px solid #bbf7d0",
                                              color: lightPanelText.insight,
                                            }}
                                          >
                                            <Stack
                                              direction="row"
                                              spacing={1.2}
                                              alignItems="center"
                                            >
                                              <LocalHospitalIcon
                                                sx={{ color: "#15803d" }}
                                              />

                                              <Typography fontWeight={800}>
                                                {hospital.name}
                                              </Typography>
                                            </Stack>
                                          </Paper>
                                        </Box>
                                      ))}
                                    </Box>
                                  </Box>
                                )}
                              </Stack>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                  );
                })}

                <div ref={chatEndRef}></div>
              </Box>

              <Box
                sx={{
                  p: { xs: 2, md: 2.5 },
                  borderTop: "1px solid var(--border)",
                  bgcolor: "var(--surface)",
                }}
              >
<Stack
  direction={{ xs: "column", sm: "row" }}
  spacing={1.5}
>
  {/* TEXT / VOICE INPUT */}
  <TextField
    fullWidth
    label={
      triageMode
        ? "Answer by typing or voice..."
        : "Enter symptom/disease by typing or voice..."
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

  {/* MIC BUTTON */}
<Button
  variant="outlined"
  onClick={
    voiceMode &&
    triageMode
      ? undefined
      : startListening
  }
  disabled={
    voiceMode &&
    triageMode
  }
    sx={{
      minWidth: 72,
      borderRadius: 2,
      fontWeight: 800,
      borderColor:
        isListening
          ? "#d92d20"
          : "#087f7a",
      color:
        isListening
          ? "#d92d20"
          : "#087f7a",
      bgcolor:
        isListening
          ? "#fff1f0"
          : "transparent",
      "&:hover": {
        bgcolor:
          isListening
            ? "#ffe4e1"
            : "#eef8f6"
      }
    }}
  >
    <Stack
      direction="column"
      alignItems="center"
      spacing={0.4}
    >
      <MicIcon />
      <Typography
        variant="caption"
        fontWeight={800}
      >
{voiceMode &&
triageMode
  ? "Auto"
  : isListening
    ? "Listening..."
    : "Voice"}
      </Typography>
    </Stack>
  </Button>

  {/* SEND BUTTON */}
  <Button
    variant="contained"
    endIcon={
      <SendIcon />
    }
    onClick={
      handleSend
    }
    sx={{
      px: 4,
      borderRadius: 2,
      bgcolor: "#087f7a",
      fontWeight: 800,
      "&:hover": {
        bgcolor: "#055d5b"
      }
    }}
  >
    Send
  </Button>
</Stack>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #d7e6e4",
                  bgcolor: "#102526",
                  color: "white",
                  overflow: "hidden",
                }}
              >
                <Typography variant="h5" fontWeight={800}>
                  Welcome, {user?.name}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.7 }}>
                  {user?.email}
                </Typography>
                <Divider
                  sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.16)" }}
                />
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <GpsFixedIcon sx={{ color: "#5eead4" }} />
                    <Typography>
                      {location.lat
                        ? "Location ready for hospital lookup"
                        : "Using fallback location"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MonitorHeartIcon sx={{ color: "#93c5fd" }} />
                    <Typography>
                      {triageMode
                        ? "Triage in progress"
                        : "Ready for symptom check"}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #fed7aa",
                  bgcolor: "#fff7ed",
                  color: lightPanelText.emergency,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <WarningIcon sx={{ color: "#b45309" }} />
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color={lightPanelText.emergency}
                  >
                    Emergency Signal
                  </Typography>
                </Stack>
                <Typography color="#7c2d12" lineHeight={1.6}>
                  Severe symptoms with breathlessness, fainting, or sudden
                  weakness require immediate medical care.
                </Typography>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid var(--border)",
                  bgcolor: "var(--surface)",
                  color: "var(--ink)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ mb: 2 }}
                  color="var(--ink)"
                >
                  Triage Flow
                </Typography>
                {["Symptom", "Questions", "Risk", "Advice", "Health log"].map(
                  (step, index) => (
                    <Stack
                      key={step}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: index === 2 ? "#eff6ff" : "#e2f5f1",
                          color: index === 2 ? "#2b6cb0" : "#087f7a",
                          fontWeight: 900,
                          fontSize: 13,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography fontWeight={700} color="var(--soft-text)">
                        {step}
                      </Typography>
                    </Stack>
                  ),
                )}
              </Paper>

              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DashboardIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: "#2b6cb0",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#225b95" },
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  View Dashboard
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 800,
                    bgcolor: "var(--surface)",
                  }}
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
