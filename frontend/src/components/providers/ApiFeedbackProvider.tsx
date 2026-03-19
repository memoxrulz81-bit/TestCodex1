"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { subscribeToApiEvent } from "@/lib/errors/api-feedback-bus";

const messages = {
  forbidden: "The API rejected this action because the signed-in user does not have the required role.",
  unauthorized: "The API rejected the token or the session expired. Sign in again and retry.",
};

export function ApiFeedbackProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeUnauthorized = subscribeToApiEvent("unauthorized", () => setMessage(messages.unauthorized));
    const unsubscribeForbidden = subscribeToApiEvent("forbidden", () => setMessage(messages.forbidden));

    return () => {
      unsubscribeUnauthorized();
      unsubscribeForbidden();
    };
  }, []);

  return (
    <>
      {children}
      <Snackbar autoHideDuration={5000} onClose={() => setMessage(null)} open={Boolean(message)}>
        <Alert onClose={() => setMessage(null)} severity="warning" variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
