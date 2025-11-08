import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import usePrevious from "./usePrevious";

function Example() {
  const [count, setCount] = useState(0);
  const [note, setNote] = useState("سلام دنیا");

  const previousCount = usePrevious(count);
  const previousNote = usePrevious(note);

  return (
    <div className="flex max-w-md flex-col gap-4 text-sm">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">نمونه‌ی شمارنده</h2>
        <p className="text-slate-600">
          مقدار فعلی و مقدار قبلی شمارنده در هر کلیک نمایش داده می‌شود.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCount((value) => value - 1)}
            className="rounded border border-slate-300 px-3 py-1 font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            -۱
          </button>

          <span className="text-lg font-semibold text-slate-900 px-2">{count}</span>

          <button
            type="button"
            onClick={() => setCount((value) => value + 1)}
            className="rounded border border-slate-300 px-3 py-1 font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            +۱
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-slate-100 p-2 text-slate-700">
            <span className="block font-semibold text-slate-900">مقدار فعلی</span>
            {count}
          </div>
          <div className="rounded bg-emerald-50 p-2 text-emerald-700">
            <span className="block font-semibold text-emerald-800">مقدار قبلی</span>
            {previousCount ?? "—"}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">نمونه‌ی ورودی متن</h2>
        <label className="mt-2 flex flex-col gap-1">
          <span className="font-medium text-slate-700">یادداشت</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="h-24 rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="یک متن را وارد کنید"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-slate-100 p-2 text-slate-700">
            <span className="block font-semibold text-slate-900"> مقدار فعلی: </span>
            <span className="line-clamp-3 break-words">{note || "خالی"}</span>
          </div>
          <div className="rounded bg-emerald-50 p-2 text-emerald-700">
            <span className="block font-semibold text-emerald-800"> مقدار قبلی: </span>
            <span className="line-clamp-3 break-words">
              {previousNote == null || previousNote === "" ? "خالی" : previousNote}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof Example> = {
  title: "Hooks/usePrevious",
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
