"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/lib/auth/msal";
import { ApiFeedbackProvider } from "@/components/providers/ApiFeedbackProvider";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0d8f7a",
    },
    secondary: {
      main: "#d95d39",
    },
    background: {
      default: "#f5efe5",
      paper: "rgba(255, 255, 255, 0.82)",
    },
    text: {
      primary: "#102a2a",
      secondary: "#415a5a",
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: "var(--font-sans)",
    h1: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(18px)",
          backgroundImage: "none",
          border: "1px solid rgba(16, 42, 42, 0.08)",
          boxShadow: "0 20px 60px rgba(16, 42, 42, 0.12)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          textTransform: "none",
        },
      },
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      await msalInstance.initialize();
      const response = await msalInstance.handleRedirectPromise();
      const account = response?.account ?? msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];

      if (account) {
        msalInstance.setActiveAccount(account);
      }

      setReady(true);
    };

    void bootstrap();
  }, []);

  if (!ready) {
    return <div className="app-loading">Preparing secure workspace...</div>;
  }

  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApiFeedbackProvider>{children}</ApiFeedbackProvider>
      </ThemeProvider>
    </MsalProvider>
  );
}
