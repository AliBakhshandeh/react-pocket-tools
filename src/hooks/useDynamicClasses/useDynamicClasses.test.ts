import { renderHook } from "@testing-library/react";

import useDynamicClasses from "./useDynamicClasses";

const sorted = (value: string) => value.split(/\s+/).filter(Boolean).sort();

describe("useDynamicClasses", () => {
  it("کلاس‌ها را نرمال‌سازی و ترکیب می‌کند", () => {
    const { result } = renderHook(() =>
      useDynamicClasses("text-red-500  font-bold", [
        null,
        undefined,
        ["text-red-600", false],
        { italic: true },
      ]),
    );

    expect(sorted(result.current.className)).toEqual(
      sorted("text-red-600 font-bold italic"),
    );
  });

  it("merge کلاس‌های جدید را با اولویت درست اضافه می‌کند", () => {
    const { result } = renderHook(() =>
      useDynamicClasses("px-2 py-2 text-white", "bg-blue-500"),
    );

    const merged = result.current.merge("bg-emerald-500", ["px-4"]);

    expect(sorted(merged)).toEqual(sorted("py-2 text-white bg-emerald-500 px-4"));
  });

  it("toggle به درستی کلاس را اضافه و حذف می‌کند", () => {
    const { result } = renderHook(() =>
      useDynamicClasses("text-sm", { underline: true }),
    );

    // Each toggle call works on the original className, not previous toggle results
    const removed = result.current.toggle("underline", false);
    const added = result.current.toggle("font-bold", true);
    const toggled = result.current.toggle("italic");
    const removedItalic = result.current.toggle("underline", false);

    expect(sorted(removed)).toEqual(sorted("text-sm"));
    expect(sorted(added)).toEqual(sorted("text-sm underline font-bold"));
    // toggle("italic") adds italic since it's not in the original className
    expect(sorted(toggled)).toEqual(sorted("text-sm underline italic"));
    // toggle("underline", false) removes underline from original className
    expect(sorted(removedItalic)).toEqual(sorted("text-sm"));
  });

  it("هنگام تغییر آرگومان‌ها کلاس نهایی را به‌روزرسانی می‌کند", () => {
    const { result, rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) =>
        useDynamicClasses({
          "text-blue-500": isActive,
          "text-gray-500": !isActive,
        }),
      {
        initialProps: { isActive: true },
      },
    );

    expect(sorted(result.current.className)).toEqual(sorted("text-blue-500"));

    rerender({ isActive: false });

    expect(sorted(result.current.className)).toEqual(sorted("text-gray-500"));
  });
});
