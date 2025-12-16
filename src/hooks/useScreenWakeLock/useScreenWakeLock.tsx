import { useEffect, useRef } from "react";

/**
 * Hook for enabling Screen Wake Lock API
 * This hook prevents the screen from turning off
 *
 * @param enabled - Whether wake lock is enabled or disabled (default: true)
 *
 * @example
 * ```tsx
 * function VideoPlayer() {
 *   useScreenWakeLock(true);
 *   return <video src="video.mp4" />;
 * }
 * ```
 */
export function useScreenWakeLock(enabled: boolean = true): void {
  // Store reference to wake lock sentinel
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  // Check if component is still mounted (to prevent race condition)
  const isMountedRef = useRef<boolean>(false);
  // Store reference to handler for removing event listener in cleanup
  const releaseHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // If wake lock is disabled, do nothing
    if (!enabled) return;
    // Check if we're in browser environment
    if (typeof window === "undefined") return;
    // Check if Wake Lock API exists and is available
    if (!("wakeLock" in navigator) || !navigator.wakeLock) return;

    isMountedRef.current = true;

    /**
     * Request wake lock from browser
     * This function is async because the request may take time
     */
    const requestWakeLock = async (): Promise<void> => {
      try {
        // Check if mounted before requesting
        if (!isMountedRef.current) return;

        const wakeLock = await navigator.wakeLock.request("screen");

        // Check again if mounted after async operation to prevent race condition
        // If component has unmounted, release wake lock immediately
        if (!isMountedRef.current) {
          wakeLock.release();
          return;
        }

        // Remove previous listener if exists (to prevent memory leak)
        if (
          wakeLockRef.current &&
          releaseHandlerRef.current &&
          typeof wakeLockRef.current.removeEventListener === "function"
        ) {
          wakeLockRef.current.removeEventListener("release", releaseHandlerRef.current);
        }

        wakeLockRef.current = wakeLock;

        // Create and store handler for release event
        // This handler is called when wake lock is automatically released
        const handleRelease = (): void => {
          wakeLockRef.current = null;
        };
        releaseHandlerRef.current = handleRelease;

        // Add listener for release event
        wakeLock.addEventListener("release", handleRelease);
      } catch (error) {
        // On error, only log and don't throw
        console.error("Screen Wake Lock error:", error);
      }
    };

    // Initial wake lock request
    requestWakeLock();

    /**
     * Handler for visibility change
     * When page becomes visible, request wake lock again
     * When page becomes hidden, release wake lock
     */
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        // Page became visible again, request wake lock
        requestWakeLock();
      } else {
        // Page became hidden, release wake lock
        if (wakeLockRef.current) {
          wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      }
    };

    // Add listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function: when effect unmounts or enabled changes
    return () => {
      isMountedRef.current = false;
      // Remove visibility change listener
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Clean up event listener and release wake lock
      if (wakeLockRef.current) {
        // Remove release event listener to prevent memory leak
        if (
          releaseHandlerRef.current &&
          typeof wakeLockRef.current.removeEventListener === "function"
        ) {
          wakeLockRef.current.removeEventListener("release", releaseHandlerRef.current);
        }
        // Release wake lock
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      releaseHandlerRef.current = null;
    };
  }, [enabled]);
}
