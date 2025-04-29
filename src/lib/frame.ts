import * as frame from "@farcaster/frame-sdk";

// Check if we're in a Frame environment
const isFrameAvailable = () => {
  const available =
    typeof window !== "undefined" && typeof frame.sdk !== "undefined";
  console.log(`isFrameAvailable check: ${available}`);
  return available;
};

export async function initializeFrame() {
  console.log("initializeFrame started");
  try {
    // Get user context properly
    if (isFrameAvailable()) {
      console.log(
        "Frame SDK detected, calling actions.ready() and getContext()"
      );
      // Use actions namespace as per documentation
      await frame.sdk.actions.ready();
      console.log("frame.sdk.actions.ready() called");

      // Access user information via the context
      const userInfo = await frame.sdk.getContext();
      console.log("frame.sdk.getContext() returned:", userInfo);

      if (userInfo && userInfo.fid) {
        window.userFid = userInfo.fid;
        window.username = userInfo.username;
        console.log(
          `Frame authenticated: FID=${userInfo.fid}, Username=${userInfo.username}`
        );
      } else {
        console.log(
          "Not in frame context or user not authenticated by getContext()"
        );
        // For development, set a test FID
        if (process.env.NODE_ENV === "development") {
          window.userFid = 1234; // Test FID for development
          window.username = "TestUser";
          console.log("Setting development fallback user (FID: 1234)");
        }
      }
    } else if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      // For development outside Frame
      console.log("Frame SDK not detected, but in development mode.");
      window.userFid = 1234; // Test FID for development
      window.username = "TestUser";
      console.log("Setting development fallback user (FID: 1234)");
    } else {
      console.log("Not in Frame environment and not in development mode.");
    }
  } catch (error) {
    console.error("Error initializing frame:", error);
    // For development, set a test FID if there's an error
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      window.userFid = 1234; // Test FID for development
      window.username = "TestUser";
      console.log(
        "Error occurred, setting development fallback user (FID: 1234)"
      );
    }
  }
  console.log(
    "initializeFrame finished. Current window.userFid:",
    window.userFid
  );
}

// Helper to open URLs
export async function openUrl(url: string) {
  console.log(`Attempting to open URL: ${url}`);
  try {
    if (isFrameAvailable()) {
      console.log("Using frame.sdk.actions.openUrl");
      // Use actions namespace as per documentation
      await frame.sdk.actions.openUrl({ url });
    } else {
      console.log("Frame SDK not available, using window.open");
      // Fallback for development
      window.open(url, "_blank");
    }
  } catch (error) {
    console.error("Error opening URL:", error);
    // Fallback if frame SDK fails
    if (typeof window !== "undefined") {
      console.log("Error opening URL via SDK, falling back to window.open");
      window.open(url, "_blank");
    }
  }
}

// Helper to view a profile
export async function viewProfile(fid: number) {
  console.log(`Attempting to view profile for FID: ${fid}`);
  try {
    if (isFrameAvailable() && fid) {
      console.log("Using frame.sdk.actions.viewProfile");
      // Use actions namespace as per documentation
      await frame.sdk.actions.viewProfile({ fid });
    } else if (process.env.NODE_ENV === "development") {
      console.log(`DEV MODE: Would view profile for FID: ${fid}`);
    } else {
      console.log(
        "Cannot view profile: Frame SDK not available or invalid FID."
      );
    }
  } catch (error) {
    console.error("Error viewing profile:", error);
  }
}

// Global type definitions
declare global {
  interface Window {
    userFid?: number;
    username?: string;
  }
}
