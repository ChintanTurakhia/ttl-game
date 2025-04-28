"use client";

import { useEffect, useState } from "react";
import { initializeFrame } from "@/lib/frame";

export function FrameInit() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initializeFrame();
        setInitialized(true);
      } catch (error) {
        console.error("Failed to initialize frame:", error);
      }
    }

    init();
  }, []);

  return null;
}
