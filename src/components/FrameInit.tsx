"use client";

import { useEffect } from "react";
import { initializeFrame } from "@/lib/frame";

export function FrameInit() {
  useEffect(() => {
    async function init() {
      try {
        await initializeFrame();
      } catch (error) {
        console.error("Failed to initialize frame:", error);
      }
    }

    init();
  }, []);

  return null;
}
