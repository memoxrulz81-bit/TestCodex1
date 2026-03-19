"use client";

import { Paper, Typography } from "@mui/material";

type ResponsePanelProps = {
  content: string;
  title: string;
};

export function ResponsePanel({ content, title }: ResponsePanelProps) {
  return (
    <Paper sx={{ minHeight: 220, p: 3 }}>
      <Typography gutterBottom variant="h6">
        {title}
      </Typography>
      <pre className="response-pre">{content}</pre>
    </Paper>
  );
}
