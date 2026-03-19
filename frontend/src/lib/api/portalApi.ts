import { apiRequest } from "@/lib/api/apiClient";
import { clientEnv } from "@/lib/config/env";

type AccessTokenProvider = () => Promise<string>;

const getUrl = (path: string) => `${clientEnv.apiBaseUrl}${path}`;

export const portalApi = {
  getProjects: async () =>
    apiRequest<unknown[]>({
      path: getUrl("/api/projects"),
    }),
  getPublicTest: async () =>
    apiRequest<Record<string, unknown>>({
      path: getUrl("/api/test/public"),
    }),
  getMyProfile: async (getAccessToken: AccessTokenProvider) =>
    apiRequest<Record<string, unknown>>({
      path: getUrl("/api/test/me"),
      accessToken: await getAccessToken(),
    }),
  getAdminTest: async (getAccessToken: AccessTokenProvider) =>
    apiRequest<Record<string, unknown>>({
      path: getUrl("/api/test/admin"),
      accessToken: await getAccessToken(),
    }),
};
