import type { AccountInfo } from "@azure/msal-browser";

const toArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export const getAccountName = (account: AccountInfo | null | undefined) =>
  account?.name ?? "Unknown user";

export const getAccountEmail = (account: AccountInfo | null | undefined) => {
  const preferredUsername = account?.idTokenClaims?.preferred_username;
  return typeof preferredUsername === "string" ? preferredUsername : account?.username ?? "Unavailable";
};

export const getAccountRoles = (account: AccountInfo | null | undefined) =>
  toArray(account?.idTokenClaims?.roles);

export const getAccountGroups = (account: AccountInfo | null | undefined) =>
  toArray(account?.idTokenClaims?.groups);
