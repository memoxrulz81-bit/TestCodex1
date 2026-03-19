import { emitApiEvent } from "@/lib/errors/api-feedback-bus";

export class ApiError extends Error
{
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown, message: string) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = {
  accessToken?: string;
  body?: unknown;
  method?: "GET" | "POST";
  path: string;
};

const toJson = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const apiRequest = async <T>({
  accessToken,
  body,
  method = "GET",
  path,
}: ApiRequestOptions): Promise<T> => {
  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await toJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      emitApiEvent("unauthorized");
    }

    if (response.status === 403) {
      emitApiEvent("forbidden");
    }

    throw new ApiError(response.status, payload, `API request failed with status ${response.status}.`);
  }

  return payload as T;
};
