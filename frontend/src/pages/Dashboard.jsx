import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LogoutIcon from "@mui/icons-material/Logout";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

const cardColors = {
  total: { bg: "#e2f5f1", color: "#087f7a" },
  high: { bg: "#fff1f0", color: "#d92d20" },
  medium: { bg: "#fff7ed", color: "#b45309" },
  emergency: { bg: "#eff6ff", color: "#2b6cb0" },
};

const riskColor = {
  HIGH: { bg: "#fff1f0", color: "#d92d20", border: "#f4a7a1" },
  MEDIUM: { bg: "#fff7ed", color: "#b45309", border: "#fed7aa" },
  LOW: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
};

export default function Dashboard() {
  const navigate = useNavigate();

const [user, setUser] = useState(
  JSON.parse(
    localStorage.getItem("user")
  ) || {}
);

const [logs, setLogs] =
  useState([]);

//Fetch BOTH logs + latest profile
useEffect(() => {
  const fetchDashboardData =
    async () => {
      try {
        // Health logs
        const logsRes =
          await API.get(
            "/health/logs"
          );

        setLogs(
          logsRes.data
        );

        // Latest profile
        const profileRes =
          await API.get(
            "/user/profile"
          );

        setUser(
          profileRes.data
        );

        // Sync localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(
            profileRes.data
          )
        );

      } catch (error) {
        console.error(
          "Failed to fetch dashboard data"
        );
      }
    };

  fetchDashboardData();
}, []);

  const totalChecks = logs.length;
  const highRisk = logs.filter((log) => log.riskLevel === "HIGH").length;
  const mediumRisk = logs.filter((log) => log.riskLevel === "MEDIUM").length;
  const lowRisk = logs.filter((log) => log.riskLevel === "LOW").length;
  const emergencies = logs.filter((log) => log.emergency).length;

  const chartData = logs.map((log, index) => ({
    x: index,
    name: `Check ${index + 1}`,
    risk: log.riskLevel === "HIGH" ? 3 : log.riskLevel === "MEDIUM" ? 2 : 1,
  }));

  const chartXDomain =
    chartData.length <= 1 ? [-1, 1] : [-0.7, chartData.length - 0.3];

  const stats = [
    {
      title: "Total Health Checks",
      value: totalChecks,
      icon: <HealthAndSafetyIcon />,
      tone: cardColors.total,
    },
    {
      title: "High Risk Cases",
      value: highRisk,
      icon: <WarningIcon />,
      tone: cardColors.high,
    },
    {
      title: "Medium Risk Cases",
      value: mediumRisk,
      icon: <TrendingUpIcon />,
      tone: cardColors.medium,
    },
    {
      title: "Emergency Alerts",
      value: emergencies,
      icon: <MonitorHeartIcon />,
      tone: cardColors.emergency,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 5 },
        background: "var(--page-bg)",
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 3 } }}>
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2.5, md: 3 },
      borderRadius: 3,
      mb: 2.5,
      color: "white",
      background:
        "linear-gradient(135deg, rgba(5,93,91,0.94), rgba(43,108,176,0.9)), url(https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=85)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow:
        "0 24px 70px rgba(16, 37, 38, 0.16)"
    }}
  >
    <Stack
      direction={{
        xs: "column",
        md: "row"
      }}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        md: "center"
      }}
      spacing={2}
    >
      {/* LEFT SECTION */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <DashboardIcon />

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: 32,
                md: 40
              }
            }}
          >
            Health Dashboard
          </Typography>
        </Stack>

        <Typography
          sx={{
            mt: 0.8,
            color:
              "rgba(255,255,255,0.82)"
          }}
        >
          Welcome back, {user?.name}.
          Review triage history and
          risk patterns from your
          saved health checks.
        </Typography>
      </Box>

      {/* RIGHT BUTTONS */}
      <Stack
        direction="row"
        spacing={1.5}
        flexWrap="wrap"
        useFlexGap
        justifyContent={{
          xs: "flex-start",
          md: "flex-end"
        }}
        sx={{
          ml: { md: "auto" },
          flexShrink: 0
        }}
      >
        {/* BACK TO CHAT */}
        <Button
          variant="contained"
          startIcon={<ChatIcon />}
          sx={{
            borderRadius: 2,
            minHeight: 48,
            bgcolor: "#ffffff",
            color: "#087f7a",
            fontWeight: 800,
            "&:hover": {
              bgcolor: "#eef8f6"
            }
          }}
          onClick={() =>
            navigate("/chat")
          }
        >
          Back to Chat
        </Button>

        {/* PROFILE BUTTON */}
        <Button
          variant="contained"
          startIcon={<PersonIcon />}
          sx={{
            borderRadius: 2,
            minHeight: 48,
            bgcolor: "#e2f5f1",
            color: "#055d5b",
            fontWeight: 800,
            "&:hover": {
              bgcolor: "#c9ebe5"
            }
          }}
          onClick={() =>
            navigate(
              "/profile-view"
            )
          }
        >
          Profile
        </Button>

        {/* LOGOUT */}
        <Button
          variant="outlined"
          startIcon={
            <LogoutIcon />
          }
          sx={{
            borderRadius: 2,
            minHeight: 48,
            color: "#ffffff",
            borderColor:
              "rgba(255,255,255,0.65)",
            fontWeight: 800,
            "&:hover": {
              borderColor:
                "#ffffff",
              bgcolor:
                "rgba(255,255,255,0.08)"
            }
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
  </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2.5,
          }}
        >
          {stats.map((item) => (
            <Box key={item.title} sx={{ minWidth: 0 }}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid var(--border)",
                  bgcolor: "var(--surface)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) auto",
                      alignItems: "start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography color="#607174" fontWeight={800}>
                        {item.title}
                      </Typography>
                      <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
                        {item.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: item.tone.bg,
                        color: item.tone.color,
                      }}
                    >
                      {item.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.35fr) minmax(340px, 0.65fr)",
            },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: "1px solid var(--border)",
                bgcolor: "var(--surface)",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Risk Trend Analysis
                  </Typography>
                  <Typography color="#607174">
                    Low, medium, and high results across recent checks.
                  </Typography>
                </Box>
              </Stack>

              {chartData.length === 0 ? (
                <Box
                  sx={{
                    minHeight: 300,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2,
                    border: "1px dashed #9fc6c3",
                    bgcolor: "#f8fcfb",
                  }}
                >
                  <Typography color="#607174">
                    No health data available yet.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 300, sm: 330 },
                    mt: { xs: 1.5, md: 0 },
                    overflow: "hidden",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{
                        top: 14,
                        right: 14,
                        left: 14,
                        bottom: 8,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="riskFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#087f7a"
                            stopOpacity={0.28}
                          />
                          <stop
                            offset="95%"
                            stopColor="#087f7a"
                            stopOpacity={0.03}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d7e6e4" />
                      <XAxis
                        dataKey="x"
                        type="number"
                        domain={chartXDomain}
                        ticks={chartData.map((item) => item.x)}
                        // tickFormatter={(value) =>
                        //   chartData.find((item) => item.x === value)?.name || ""
                        // }
                        stroke="var(--muted)"
                        tickMargin={8}
                        interval={0}
                      />
                      <YAxis
                        width={62}
                        domain={[1, 3]}
                        ticks={[1, 2, 3]}
                        stroke="var(--muted)"
                        tickMargin={8}
                        tickFormatter={(value) =>
                          value === 3 ? "High" : value === 2 ? "Medium" : "Low"
                        }
                      />
                      <Tooltip
                        formatter={(value) => [
                          value === 3 ? "High" : value === 2 ? "Medium" : "Low",
                          "Risk",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="risk"
                        stroke="#087f7a"
                        strokeWidth={3}
                        fill="url(#riskFill)"
                        dot={{
                          r: 4,
                          fill: "#087f7a",
                          stroke: "#ffffff",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Paper>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid var(--border)",
                bgcolor: "var(--surface)",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 2.5 }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#e2f5f1",
                    color: "#087f7a",
                  }}
                >
                  <PersonIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Profile Summary
                  </Typography>
                  <Typography color="var(--muted)">{user?.email}</Typography>
                </Box>
              </Stack>

              <Stack spacing={1.5}>
                {[
                  ["Name", user?.name || "User"],
                  ["Low Risk Cases", lowRisk],
                  ["Medium Risk Cases", mediumRisk],
                  ["High Risk Cases", highRisk],
                ].map(([label, value]) => (
                  <Stack
                    key={label}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{
                      p: 1.7,
                      borderRadius: 2,
                      bgcolor: "var(--surface-soft)",
                      border: "1px solid var(--border)",
                      gap: 2,
                    }}
                  >
                    <Typography color="var(--muted)" fontWeight={700}>
                      {label}
                    </Typography>
                    <Typography fontWeight={800}>{value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Recent Health Logs
          </Typography>

          {logs.length === 0 ? (
            <Typography color="text.secondary">
              No health records yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: logs.length === 1 ? "1fr" : "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {logs.slice(0, 6).map((log, index) => {
                const tone = riskColor[log.riskLevel] || riskColor.LOW;

                return (
                  <Box key={index} sx={{ minWidth: 0 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        border: (theme) =>
                          `1px solid ${
                            log.emergency
                              ? theme.palette.error.light
                              : theme.palette.divider
                          }`,
                        bgcolor: (theme) =>
                          log.emergency
                            ? theme.palette.mode === "light"
                              ? "#fff7f6"
                              : "#3b1f1f"
                            : theme.palette.background.paper,
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, md: 2.25 } }}>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", md: "center" }}
                          spacing={2}
                        >
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ mb: 1 }}
                            >
                              <Chip
                                label={log.riskLevel}
                                sx={{
                                  borderRadius: 2,
                                  bgcolor: tone.bg,
                                  color: tone.color,
                                  border: `1px solid ${tone.border}`,
                                  fontWeight: 900,
                                }}
                              />
                              {log.emergency && (
                                <WarningIcon sx={{ color: "error.main" }} />
                              )}
                            </Stack>

                            <Typography fontWeight={800}>
                              {log.symptoms?.join(", ")}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              textAlign: { xs: "left", md: "right" },
                              flexShrink: 0,
                            }}
                          >
                            <Typography color="text.secondary">
                              {new Date(log.createdAt).toLocaleString()}
                            </Typography>

                            {log.emergency && (
                              <Typography
                                color="error.main"
                                fontWeight={800}
                                sx={{ mt: 0.5 }}
                              >
                                Emergency Case
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
