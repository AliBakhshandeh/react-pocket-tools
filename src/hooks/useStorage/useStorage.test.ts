import { renderHook } from "@testing-library/react";
import { beforeEach, vi } from "vitest";

import useStorage from "./useStorage";

describe("useStorage", () => {
  beforeEach(() => {
    // Create storage-like objects that actually store values
    const createStorage = () => {
      const store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          Object.keys(store).forEach((key) => delete store[key]);
        },
      };
    };
    
    Object.defineProperty(window, "localStorage", {
      value: createStorage(),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "sessionStorage", {
      value: createStorage(),
      writable: true,
      configurable: true,
    });
  });

  it("داده‌ها را در sessionStorage ذخیره و بازیابی می‌کند", () => {
    const { result } = renderHook(() => useStorage());

    expect(result.current.setItem("token", "123")).toBe(true);
    expect(window.sessionStorage.getItem("token")).toBe("123");
    expect(result.current.getItem("token")).toBe("123");
  });

  it("ذخیره‌سازی در localStorage را با نوع مشخص‌شده مدیریت می‌کند", () => {
    const { result } = renderHook(() => useStorage());

    expect(result.current.setItem("theme", "dark", "local")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(result.current.getItem("theme", "local")).toBe("dark");
  });

  it("آیتم‌ها را حذف می‌کند", () => {
    window.sessionStorage.setItem("removeMe", "1");
    const { result } = renderHook(() => useStorage());

    result.current.removeItem("removeMe");

    expect(window.sessionStorage.getItem("removeMe")).toBeNull();
  });

  it("هر دو storage را پاک می‌کند", () => {
    window.sessionStorage.setItem("sessionKey", "s");
    window.localStorage.setItem("localKey", "l");
    const { result } = renderHook(() => useStorage());

    result.current.clearStorage();

    expect(window.sessionStorage.getItem("sessionKey")).toBeNull();
    expect(window.localStorage.getItem("localKey")).toBeNull();
  });
});
