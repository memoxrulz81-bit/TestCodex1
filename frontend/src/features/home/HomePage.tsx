"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import { AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Link,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { ResponsePanel } from "@/components/shared/ResponsePanel";
import { getAccountEmail, getAccountGroups, getAccountName, getAccountRoles } from "@/lib/auth/claims";
import { apiTokenRequest, msalInstance } from "@/lib/auth/msal";
import { portalApi } from "@/lib/api/portalApi";
import { clientEnv, usingPlaceholderIdentityConfig } from "@/lib/config/env";

const initialResponse = "No API call yet.";

const formatResponse = (value: unknown) => JSON.stringify(value, null, 2);

const getAccessToken = async (account: AccountInfo | null) => {
  if (!account) {
    throw new Error("No active account available.");
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...apiTokenRequest,
      account,
    });

    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({
        ...apiTokenRequest,
        account,
      });
    }

    throw error;
  }
};

export function HomePage() {
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = accounts[0] ?? null;
  const [responseTitle, setResponseTitle] = useState("API Response");
  const [responseBody, setResponseBody] = useState(initialResponse);
  const [isLoading, setIsLoading] = useState(false);

  const roles = useMemo(() => getAccountRoles(account), [account]);
  const groups = useMemo(() => getAccountGroups(account), [account]);
  const derivedRoles = useMemo(() => {
    const mergedRoles = new Set(roles);

    if (clientEnv.adminGroupId && groups.includes(clientEnv.adminGroupId)) {
      mergedRoles.add(clientEnv.adminRole);
    }

    return Array.from(mergedRoles);
  }, [groups, roles]);
  const isAdmin = derivedRoles.includes(clientEnv.adminRole);

  const runApiCall = async (title: string, callback: () => Promise<unknown>) => {
    setIsLoading(true);
    setResponseTitle(title);

    try {
      const response = await callback();
      setResponseBody(formatResponse(response));
    } catch (error) {
      const typedError = error as Error;
      setResponseBody(
        formatResponse({
          message: typedError.message,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="page-shell">
      <Paper className="hero-card" elevation={0}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={4}>
          <Box sx={{ maxWidth: 720 }}>
            <Typography className="eyebrow">Microsoft Entra ID Demo Portal</Typography>
            <Typography sx={{ mb: 2 }} variant="h1">
              A full-stack starter that makes auth, roles, and secured API testing visible.
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: "1.05rem", maxWidth: 620 }}>
              The home page is intentionally wired for validation: sign in, inspect token-derived profile data,
              call public and secured endpoints, and confirm that the Admin action only appears for the right role.
            </Typography>
          </Box>
          <Stack alignItems={{ xs: "stretch", md: "flex-end" }} justifyContent="space-between" spacing={2}>
            <Chip
              color={isAuthenticated ? "success" : "default"}
              icon={<LockPersonRoundedIcon />}
              label={isAuthenticated ? "Authenticated" : "Anonymous"}
            />
            <AuthButtons />
          </Stack>
        </Stack>
      </Paper>

      {usingPlaceholderIdentityConfig ? (
        <Alert severity="info" sx={{ mt: 3 }}>
          Placeholder Azure AD values are still in use. Update <code>.env.local</code> before testing login against
          your tenant.
        </Alert>
      ) : null}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                <PublicRoundedIcon color="primary" />
                <Typography variant="h5">Public Section</Typography>
              </Stack>
              <Typography color="text.secondary">
                Welcome to the demo portal. Authentication status is visible below so you can verify the client boot
                flow immediately after a page refresh or redirect.
              </Typography>
              <List dense sx={{ mt: 2 }}>
                <ListItem disableGutters>Logged in: {isAuthenticated ? "Yes" : "No"}</ListItem>
                <ListItem disableGutters>API base URL: {clientEnv.apiBaseUrl}</ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                <PersonRoundedIcon color="primary" />
                <Typography variant="h5">Authenticated Section</Typography>
              </Stack>
              {!isAuthenticated ? (
                <Typography color="text.secondary">
                  Sign in to reveal profile data, token-derived roles, and the protected dashboard link.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  <Typography>User name: {getAccountName(account)}</Typography>
                  <Typography>Email: {getAccountEmail(account)}</Typography>
                  <Box>
                    <Typography sx={{ mb: 1 }}>Roles:</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {derivedRoles.length > 0 ? (
                        derivedRoles.map((role) => <Chip key={role} label={role} />)
                      ) : (
                        <Chip label="No roles found" />
                      )}
                    </Stack>
                  </Box>
                  <Link component={NextLink} href="/dashboard" underline="hover">
                    Open protected dashboard <ArrowOutwardRoundedIcon fontSize="inherit" />
                  </Link>
                </Stack>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                <ApiRoundedIcon color="primary" />
                <Typography variant="h5">API Test Section</Typography>
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} flexWrap="wrap" gap={1.5}>
                <Button
                  onClick={() => runApiCall("Public API", () => portalApi.getPublicTest())}
                  startIcon={<PublicRoundedIcon />}
                  variant="contained"
                >
                  Call Public API
                </Button>
                <Button
                  disabled={!isAuthenticated || isLoading}
                  onClick={() =>
                    runApiCall("My Profile", () =>
                      portalApi.getMyProfile(() => getAccessToken(account))
                    )
                  }
                  startIcon={<PersonRoundedIcon />}
                  variant="outlined"
                >
                  Call My Profile
                </Button>
                {isAdmin ? (
                  <Button
                    color="secondary"
                    disabled={!isAuthenticated || isLoading}
                    onClick={() =>
                      runApiCall("Admin API", () =>
                        portalApi.getAdminTest(() => getAccessToken(account))
                      )
                    }
                    startIcon={<AdminPanelSettingsRoundedIcon />}
                    variant="contained"
                  >
                    Call Admin API
                  </Button>
                ) : null}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <ResponsePanel content={responseBody} title={responseTitle} />
        </Grid>
      </Grid>
    </Box>
  );
}
