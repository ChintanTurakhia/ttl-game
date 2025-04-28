import * as frame from "@farcaster/frame-sdk";

// Check if we're in a Frame environment
const isFrameAvailable = () => {
  return typeof window !== "undefined" && typeof frame.sdk !== "undefined";
};

export async function initializeFrame() {
  try {
    // Get user context properly
    if (isFrameAvailable()) {
      await frame.sdk.ready();

      // Access user information via the context
      const userInfo = await frame.sdk.getContext();

      if (userInfo && userInfo.fid) {
        window.userFid = userInfo.fid;
        window.username = userInfo.username;
        console.log("Frame authenticated with FID:", userInfo.fid);
      } else {
        console.log("Not in frame context or user not authenticated");
        // For development, set a test FID
        if (process.env.NODE_ENV === "development") {
          window.userFid = 1234; // Test FID for development
          window.username = "TestUser";
        }
      }
    } else if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      // For development outside Frame
      window.userFid = 1234; // Test FID for development
      window.username = "TestUser";
      console.log("Development mode - using test FID");
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
    }
  }
}

// Helper to open URLs
export async function openUrl(url: string) {
  try {
    if (isFrameAvailable()) {
      await frame.sdk.openUrl(url);
    } else {
      // Fallback for development
      window.open(url, "_blank");
    }
  } catch (error) {
    console.error("Error opening URL:", error);
    // Fallback if frame SDK fails
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }
}

// Helper to view a profile
export async function viewProfile(fid: number) {
  try {
    if (isFrameAvailable() && fid) {
      await frame.sdk.viewUser(fid);
    } else if (process.env.NODE_ENV === "development") {
      console.log("Would view profile for FID:", fid);
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
