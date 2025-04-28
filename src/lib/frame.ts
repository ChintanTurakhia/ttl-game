import * as frame from "@farcaster/frame-sdk";

export async function initializeFrame() {
  try {
    const context = await frame.sdk.context;

    if (!context || !context.user) {
      console.log("not in frame context");
      return null;
    }

    const user = context.user;

    // Set user FID in window for client-side access
    if (typeof window !== "undefined") {
      window.userFid = user.fid;
      window.username = user.username;
    }

    // Call the ready function to remove splash screen
    await frame.sdk.actions.ready();

    return user;
  } catch (error) {
    console.error("Error initializing frame:", error);
    return null;
  }
}

// Helper to open URLs
export async function openUrl(url: string) {
  try {
    await frame.sdk.actions.openUrl({ url });
  } catch (error) {
    console.error("Error opening URL:", error);
  }
}

// Helper to view a profile
export async function viewProfile(fid: number) {
  try {
    await frame.sdk.actions.viewProfile({ fid });
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
