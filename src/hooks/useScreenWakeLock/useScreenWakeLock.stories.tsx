import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { useScreenWakeLock } from "./useScreenWakeLock";

function Example() {
  const [enabled, setEnabled] = useState(true);

  useScreenWakeLock(enabled);

  const isSupported = typeof window !== "undefined" && "wakeLock" in navigator;

  return (
    <div className="flex max-w-md flex-col gap-4 text-sm">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Screen Wake Lock</h2>
        <p className="mt-2 text-slate-600">
          این هوک صفحه نمایش را روشن نگه می‌دارد و از خاموش شدن خودکار جلوگیری می‌کند.
        </p>

        {!isSupported && (
          <div className="mt-4 rounded-md bg-amber-50 p-3 text-amber-800">
            <p className="text-xs font-medium">
              ⚠️ مرورگر شما از Screen Wake Lock API پشتیبانی نمی‌کند.
            </p>
          </div>
        )}

        {isSupported && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-md bg-slate-50 p-3">
              <span className="font-medium text-slate-700">وضعیت:</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  enabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {enabled ? "فعال" : "غیرفعال"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setEnabled((prev) => !prev)}
              className="w-full rounded border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {enabled ? "غیرفعال کردن" : "فعال کردن"} Wake Lock
            </button>

            <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800">
              <p className="font-semibold">💡 نکته:</p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                <li>
                  وقتی صفحه نمایش خاموش می‌شود، Wake Lock به صورت خودکار غیرفعال می‌شود
                </li>
                <li>با بازگشت به تب، Wake Lock دوباره فعال می‌شود</li>
                <li>برای تست، می‌توانید تب را به پس‌زمینه ببرید و دوباره باز کنید</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const meta: Meta<typeof Example> = {
  title: "Hooks/useScreenWakeLock",
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
