import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const dark = mode === "dark";

  return (
    <Tooltip title={dark ? "Switch to light theme" : "Switch to dark theme"}>
      <IconButton
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={toggleMode}
        sx={{
          position: "fixed",
          right: { xs: 14, md: 22 },
          bottom: { xs: 14, md: 22 },
          zIndex: 1400,
          width: 48,
          height: 48,
          borderRadius: 2,
          color: dark ? "#facc15" : "#087f7a",
          bgcolor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 18px 40px rgba(16, 37, 38, 0.18)",
          "&:hover": {
            bgcolor: "var(--surface-soft)"
          }
        }}
      >
        {dark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
