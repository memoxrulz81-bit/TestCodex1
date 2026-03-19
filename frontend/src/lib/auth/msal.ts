import type { Configuration, RedirectRequest } from "@azure/msal-browser";
import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { clientEnv } from "@/lib/config/env";

const msalConfig: Configuration = {
  auth: {
    clientId: clientEnv.clientId,
    authority: clientEnv.authority,
    redirectUri: clientEnv.redirectUri,
    postLogoutRedirectUri: clientEnv.postLogoutRedirectUri,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest: RedirectRequest = {
  scopes: ["openid", "profile", "email"],
};

export const apiTokenRequest: RedirectRequest = {
  scopes: [clientEnv.apiScope],
};

export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
    event.payload &&
    "account" in event.payload &&
    event.payload.account
  ) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});
