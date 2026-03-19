"use client";

import { PropsWithChildren, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/auth/msal";

export function AuthGuard({ children }: PropsWithChildren) {
  const { inProgress, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated && inProgress === "none") {
      void instance.loginRedirect(loginRequest);
    }
  }, [inProgress, instance, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: "grid", gap: 2, justifyItems: "center", py: 12 }}>
        <CircularProgress />
        <Typography color="text.secondary">Redirecting you to Microsoft Entra ID...</Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
