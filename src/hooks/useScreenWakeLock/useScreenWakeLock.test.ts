import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useScreenWakeLock } from "./useScreenWakeLock";

// Mock navigator.wakeLock
const mockWakeLock = {
    request: vi.fn(),
};

const mockWakeLockSentinel = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    release: vi.fn(),
    released: false,
    type: "screen" as WakeLockType,
};

describe("useScreenWakeLock", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mocks
        mockWakeLock.request.mockResolvedValue(mockWakeLockSentinel);
        mockWakeLockSentinel.addEventListener.mockClear();
        mockWakeLockSentinel.release.mockClear();

        // Mock navigator.wakeLock
        Object.defineProperty(navigator, "wakeLock", {
            value: mockWakeLock,
            writable: true,
            configurable: true,
        });

        // Reset document.visibilityState
        Object.defineProperty(document, "visibilityState", {
            value: "visible",
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("باید Wake Lock را درخواست کند وقتی enabled است", async () => {
        renderHook(() => useScreenWakeLock(true));

        await vi.waitFor(() => {
            expect(mockWakeLock.request).toHaveBeenCalledWith("screen");
        });
    });

    it("نباید Wake Lock را درخواست کند وقتی enabled نیست", () => {
        renderHook(() => useScreenWakeLock(false));

        expect(mockWakeLock.request).not.toHaveBeenCalled();
    });

    it("باید listener برای release event اضافه کند", async () => {
        renderHook(() => useScreenWakeLock(true));

        await vi.waitFor(() => {
            expect(mockWakeLock.request).toHaveBeenCalled();
        });

        // Wait for the async operation to complete and addEventListener to be called
        await vi.waitFor(() => {
            expect(mockWakeLockSentinel.addEventListener).toHaveBeenCalledWith(
                "release",
                expect.any(Function),
            );
        });
    });

    it("باید Wake Lock را release کند در cleanup", async () => {
        const { unmount } = renderHook(() => useScreenWakeLock(true));

        await vi.waitFor(() => {
            expect(mockWakeLock.request).toHaveBeenCalled();
        });

        // Wait for addEventListener to be called
        await vi.waitFor(() => {
            expect(mockWakeLockSentinel.addEventListener).toHaveBeenCalled();
        });

        unmount();

        // Wait for cleanup to complete
        await vi.waitFor(() => {
            expect(mockWakeLockSentinel.release).toHaveBeenCalled();
        });
    });

    it("نباید خطا بدهد اگر wakeLock در navigator موجود نباشد", () => {
        // Remove wakeLock from navigator
        Object.defineProperty(navigator, "wakeLock", {
            value: undefined,
            writable: true,
            configurable: true,
        });

        expect(() => {
            renderHook(() => useScreenWakeLock(true));
        }).not.toThrow();

        // Restore for other tests
        Object.defineProperty(navigator, "wakeLock", {
            value: mockWakeLock,
            writable: true,
            configurable: true,
        });
    });

    it("باید Wake Lock را دوباره درخواست کند وقتی visibility تغییر می‌کند", async () => {
        renderHook(() => useScreenWakeLock(true));

        await vi.waitFor(() => {
            expect(mockWakeLock.request).toHaveBeenCalledTimes(1);
        });

        // Wait for addEventListener to be called
        await vi.waitFor(() => {
            expect(mockWakeLockSentinel.addEventListener).toHaveBeenCalled();
        });

        // Simulate visibility change to hidden
        Object.defineProperty(document, "visibilityState", {
            value: "hidden",
            writable: true,
            configurable: true,
        });
        document.dispatchEvent(new Event("visibilitychange"));

        await vi.waitFor(() => {
            expect(mockWakeLockSentinel.release).toHaveBeenCalled();
        }, { timeout: 2000 });

        // Reset the release mock for the next check
        mockWakeLockSentinel.release.mockClear();

        // Simulate visibility change back to visible
        Object.defineProperty(document, "visibilityState", {
            value: "visible",
            writable: true,
            configurable: true,
        });
        document.dispatchEvent(new Event("visibilitychange"));

        await vi.waitFor(() => {
            expect(mockWakeLock.request).toHaveBeenCalledTimes(2);
        }, { timeout: 2000 });
    });
});

