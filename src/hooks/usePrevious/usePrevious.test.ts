import { renderHook } from "@testing-library/react";

import usePrevious from "./usePrevious";

describe("usePrevious", () => {
  it("در اولین رندر مقدار undefined برمی‌گرداند", () => {
    const { result } = renderHook(() => usePrevious("value"));

    expect(result.current).toBeUndefined();
  });

  it("پس از تغییر ورودی مقدار قبلی را نگه می‌دارد", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => usePrevious(value),
      {
        initialProps: { value: 1 },
      },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 2 });

    expect(result.current).toBe(1);
  });

  it("مرجع مقدار قبلی را بدون تغییر نگه می‌دارد", () => {
    const initialObject = { id: 1 };
    const { result, rerender } = renderHook(
      ({ value }: { value: { id: number } }) => usePrevious(value),
      {
        initialProps: { value: initialObject },
      },
    );

    expect(result.current).toBeUndefined();

    const nextObject = { id: 2 };
    rerender({ value: nextObject });

    expect(result.current).toBe(initialObject);
  });

  it("در صورت ثابت ماندن ورودی مقدار قبلی تغییر نمی‌کند", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => usePrevious(value),
      {
        initialProps: { value: "اول" },
      },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: "اول" });

    expect(result.current).toBe("اول");

    rerender({ value: "دوم" });

    expect(result.current).toBe("اول");
  });
});
