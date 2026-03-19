"use client";

import { Button, Stack } from "@mui/material";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/auth/msal";

export function AuthButtons() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = async () => {
    await instance.loginRedirect(loginRequest);
  };

  const handleLogout = async () => {
    await instance.logoutRedirect();
  };

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      {!isAuthenticated ? (
        <Button color="primary" onClick={handleLogin} size="large" variant="contained">
          Login
        </Button>
      ) : (
        <Button color="secondary" onClick={handleLogout} size="large" variant="contained">
          Logout
        </Button>
      )}
    </Stack>
  );
}
