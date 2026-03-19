const getValue = (value: string | undefined, fallback: string) => value ?? fallback;

export const clientEnv = {
  apiBaseUrl: getValue(process.env.NEXT_PUBLIC_API_BASE_URL, "https://localhost:7001"),
  tenantId: getValue(process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID, "00000000-0000-0000-0000-000000000000"),
  clientId: getValue(process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID, "00000000-0000-0000-0000-000000000000"),
  authority: getValue(
    process.env.NEXT_PUBLIC_AZURE_AD_AUTHORITY,
    "https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000"
  ),
  redirectUri: getValue(process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI, "http://localhost:3000"),
  postLogoutRedirectUri: getValue(
    process.env.NEXT_PUBLIC_AZURE_AD_POST_LOGOUT_REDIRECT_URI,
    "http://localhost:3000"
  ),
  apiScope: getValue(
    process.env.NEXT_PUBLIC_AZURE_AD_API_SCOPE,
    "api://00000000-0000-0000-0000-000000000000/Portal.Access"
  ),
  adminRole: getValue(process.env.NEXT_PUBLIC_AZURE_AD_ADMIN_ROLE, "Admin"),
  adminGroupId: process.env.NEXT_PUBLIC_AZURE_AD_ADMIN_GROUP_ID,
};

export const usingPlaceholderIdentityConfig =
  clientEnv.clientId === "00000000-0000-0000-0000-000000000000" ||
  clientEnv.tenantId === "00000000-0000-0000-0000-000000000000";
