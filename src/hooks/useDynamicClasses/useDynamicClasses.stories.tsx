import { useState, useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

import useDynamicClasses from "./useDynamicClasses";

function Example() {
  const [isPrimary, setIsPrimary] = useState(true);
  const [isRounded, setIsRounded] = useState(false);
  const [hasUnderline, setHasUnderline] = useState(false);

  const { className, merge, toggle } = useDynamicClasses(
    "px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
      "bg-blue-600 text-white hover:bg-blue-700": isPrimary,
      "bg-slate-200 text-slate-900 hover:bg-slate-300": !isPrimary,
    },
    isRounded && "rounded-full",
  );

  const buttonClassName = toggle("underline", hasUnderline);
  const badgeClassName = merge(
    "inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700",
  );
  const cardClassName = merge(
    "flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left text-slate-900 shadow-sm transition-shadow hover:shadow-md",
  );

  const toggleButtonClass = useMemo(
    () => ({
      base: "inline-flex items-center gap-2 rounded border px-3 py-1 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
      active: "border-blue-600 bg-blue-50 text-blue-700 focus:ring-blue-500",
      inactive:
        "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 focus:ring-slate-300",
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex gap-2">
        <button
          type="button"
          className={`${toggleButtonClass.base} ${isPrimary ? toggleButtonClass.active : toggleButtonClass.inactive}`}
          onClick={() => setIsPrimary((prev) => !prev)}
        >
          {isPrimary ? <FaCheckCircle /> : <FaRegCircle />}
          تغییر حالت primary
        </button>
        <button
          type="button"
          className={`${toggleButtonClass.base} ${isRounded ? toggleButtonClass.active : toggleButtonClass.inactive}`}
          onClick={() => setIsRounded((prev) => !prev)}
        >
          {isRounded ? <FaCheckCircle /> : <FaRegCircle />}
          تغییر حالت rounded
        </button>
        <button
          type="button"
          className={`${toggleButtonClass.base} ${hasUnderline ? toggleButtonClass.active : toggleButtonClass.inactive}`}
          onClick={() => setHasUnderline((prev) => !prev)}
        >
          {hasUnderline ? <FaCheckCircle /> : <FaRegCircle />}
          تغییر underline
        </button>
      </div>

      <button type="button" className={buttonClassName}>
        دکمه‌ی نمونه با useDynamicClasses
      </button>

      <div className="flex flex-col gap-1">
        <span>نتیجه‌ی موجود:</span>
        <code className="rounded bg-slate-900 p-2 text-slate-100">{className}</code>
      </div>

      <div className="flex flex-col gap-1">
        <span>نمونه‌ی merge:</span>
        <span className={badgeClassName}>Badge</span>
      </div>

      <div className="flex flex-col gap-1">
        <span>پیش‌نمایش روی کارت:</span>
        <div className={cardClassName}>
          <h3 className="text-base font-semibold">عنوان کارت</h3>
          <p className="text-sm text-slate-600">
            این کارت با استفاده از رشته‌ی کلاس تولیدشده توسط هوک ساخته شده است و می‌تواند
            حالت‌های مختلف را نمایش دهد.
          </p>
          <button type="button" className={buttonClassName}>
            دکمه داخل کارت
          </button>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof Example> = {
  title: "Hooks/useDynamicClasses",
  component: Example,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Example />,
};
