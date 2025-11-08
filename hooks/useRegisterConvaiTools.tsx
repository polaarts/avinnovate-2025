"use client";
import { useEffect } from "react";

export function useRegisterConvaiTools(tools: Record<string, Function>) {
  useEffect(() => {
    const handler = (event: any) => {
      event.detail.config.clientTools = tools;
    };
    window.addEventListener("elevenlabs-convai:call", handler);
    return () => window.removeEventListener("elevenlabs-convai:call", handler);
  }, [tools]);
}