import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const ThemeModeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("themeMode") || "light");

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#087f7a"
          },
          secondary: {
            main: "#2b6cb0"
          },
          background: {
            default: mode === "dark" ? "#071819" : "#eef7f5",
            paper: mode === "dark" ? "#0f2426" : "#ffffff"
          },
          text: {
            primary: mode === "dark" ? "#eefdfb" : "#102526",
            secondary: mode === "dark" ? "#a9c5c4" : "#607174"
          }
        },
        typography: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        components: {
          MuiTextField: {
            defaultProps: {
              variant: "outlined"
            }
          }
        }
      }),
    [mode]
  );

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((current) => (current === "light" ? "dark" : "light"))
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside AppThemeProvider");
  }

  return context;
}
