"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { portalApi } from "@/lib/api/portalApi";

export function ProtectedDashboard() {
  const { accounts } = useMsal();
  const [projects, setProjects] = useState<string>("Loading projects...");

  useEffect(() => {
    const loadProjects = async () => {
      const response = await portalApi.getProjects();
      setProjects(JSON.stringify(response, null, 2));
    };

    void loadProjects();
  }, [accounts]);

  return (
    <AuthGuard>
      <Box className="page-shell">
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h2">Protected Dashboard</Typography>
          <Button component={NextLink} href="/" startIcon={<ArrowBackRoundedIcon />} variant="text">
            Back Home
          </Button>
        </Stack>
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            This route is client-protected and demonstrates a post-login destination inside the App Router.
          </Typography>
          {projects === "Loading projects..." ? <CircularProgress size={24} /> : <pre className="response-pre">{projects}</pre>}
        </Paper>
      </Box>
    </AuthGuard>
  );
}
