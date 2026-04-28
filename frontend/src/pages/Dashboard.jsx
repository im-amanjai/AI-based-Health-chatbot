import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WarningIcon from "@mui/icons-material/Warning";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/health/logs");
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to fetch logs");
      }
    };

    fetchLogs();
  }, []);

  // 📊 Stats
  const totalChecks = logs.length;
  const highRisk = logs.filter(
    (log) => log.riskLevel === "HIGH"
  ).length;

  const mediumRisk = logs.filter(
    (log) => log.riskLevel === "MEDIUM"
  ).length;

  const lowRisk = logs.filter(
    (log) => log.riskLevel === "LOW"
  ).length;

  const emergencies = logs.filter(
    (log) => log.emergency
  ).length;

  // 📈 Chart Data
  const chartData = logs.map((log, index) => ({
    name: `Check ${index + 1}`,
    risk:
      log.riskLevel === "HIGH"
        ? 3
        : log.riskLevel === "MEDIUM"
        ? 2
        : 1
  }));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f8fb", py: 4 }}>
      <Container maxWidth="lg">

        {/* HEADER */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            mb: 4,
            background: "linear-gradient(to right, #1976d2, #42a5f5)",
            color: "white"
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            <DashboardIcon sx={{ mr: 1 }} />
            Health Dashboard
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Welcome back, {user?.name}
          </Typography>
        </Paper>

        {/* STATS CARDS */}
        <Grid container spacing={3}>
          {[
            {
              title: "Total Health Checks",
              value: totalChecks,
              icon: <HealthAndSafetyIcon />
            },
            {
              title: "High Risk Cases",
              value: highRisk,
              icon: <WarningIcon />
            },
            {
              title: "Medium Risk Cases",
              value: mediumRisk,
              icon: <WarningIcon />
            },
            {
              title: "Emergency Alerts",
              value: emergencies,
              icon: <WarningIcon />
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  textAlign: "center",
                  py: 2
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {item.icon} {item.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="#1976d2"
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* RISK TREND CHART */}
        <Paper sx={{ p: 4, borderRadius: 4, mt: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
          >
            Risk Trend Analysis
          </Typography>

          {chartData.length === 0 ? (
            <Typography>No health data available yet.</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis
                  ticks={[1, 2, 3]}
                  tickFormatter={(value) =>
                    value === 3
                      ? "High"
                      : value === 2
                      ? "Medium"
                      : "Low"
                  }
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="#1976d2"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Paper>

        {/* PROFILE + HISTORY */}
        <Grid container spacing={4} sx={{ mt: 2 }}>

          {/* PROFILE SUMMARY */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
              >
                Profile Summary
              </Typography>

              <Typography>
                <strong>Name:</strong> {user?.name}
              </Typography>

              <Typography>
                <strong>Email:</strong> {user?.email}
              </Typography>

              <Typography sx={{ mt: 3 }}>
                <strong>Low Risk Cases:</strong> {lowRisk}
              </Typography>

              <Typography>
                <strong>Medium Risk Cases:</strong> {mediumRisk}
              </Typography>

              <Typography>
                <strong>High Risk Cases:</strong> {highRisk}
              </Typography>
            </Paper>
          </Grid>

          {/* RECENT LOGS */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
              >
                Recent Health Logs
              </Typography>

              {logs.length === 0 ? (
                <Typography>No health records yet.</Typography>
              ) : (
                logs.slice(0, 5).map((log, index) => (
                  <Card
                    key={index}
                    sx={{
                      mb: 2,
                      bgcolor: log.emergency
                        ? "#ffebee"
                        : "#ffffff",
                      borderRadius: 3
                    }}
                  >
                    <CardContent>
                      <Typography>
                        <strong>Symptoms:</strong>{" "}
                        {log.symptoms.join(", ")}
                      </Typography>

                      <Typography>
                        <strong>Risk:</strong> {log.riskLevel}
                      </Typography>

                      <Typography>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </Typography>

                      {log.emergency && (
                        <Typography
                          color="error"
                          fontWeight="bold"
                        >
                          🚨 Emergency Case
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </Paper>
          </Grid>

        </Grid>

        {/* ACTION BUTTONS */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: 2,
            flexWrap: "wrap"
          }}
        >
          {/* Back to Chat */}
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              px: 4
            }}
            onClick={() => navigate("/chat")}
          >
            Back to Chat
          </Button>

          {/* Logout */}
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              px: 4
            }}
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Box>

      </Container>
    </Box>
  );
}