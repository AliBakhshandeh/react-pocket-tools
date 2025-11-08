import { useCallback, useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import useStorage from "./useStorage";

type StorageChoice = "session" | "local";

function Example() {
  const [key, setKey] = useState("demo-key");
  const [value, setValue] = useState("سلام دنیا");
  const [storageType, setStorageType] = useState<StorageChoice>("session");
  const [lastRead, setLastRead] = useState<string | null>(null);
  const [snapshotVersion, bumpSnapshotVersion] = useState(0);

  const { getItem, setItem, removeItem, clearStorage } = useStorage();

  const snapshot = useMemo(() => {
    if (typeof window === "undefined") return { session: [], local: [] };

    const sessionEntries: Array<[string, string]> = [];
    const localEntries: Array<[string, string]> = [];

    for (let i = 0; i < window.sessionStorage.length; i += 1) {
      const storageKey = window.sessionStorage.key(i);
      if (!storageKey || storageKey !== key) continue;
      sessionEntries.push([storageKey, window.sessionStorage.getItem(storageKey) ?? ""]);
    }

    for (let i = 0; i < window.localStorage.length; i += 1) {
      const storageKey = window.localStorage.key(i);
      if (!storageKey || storageKey !== key) continue;
      localEntries.push([storageKey, window.localStorage.getItem(storageKey) ?? ""]);
    }

    return {
      session: sessionEntries,
      local: localEntries,
    };
  }, [key, snapshotVersion]);

  const handleSave = useCallback(() => {
    setItem(key, value, storageType);
    setLastRead(getItem(key, storageType));
    bumpSnapshotVersion((current) => current + 1);
  }, [getItem, key, setItem, storageType, value]);

  const handleLoad = useCallback(() => {
    setLastRead(getItem(key, storageType));
    bumpSnapshotVersion((current) => current + 1);
  }, [getItem, key, storageType]);

  const handleRemove = useCallback(() => {
    removeItem(key, storageType);
    setLastRead(null);
    bumpSnapshotVersion((current) => current + 1);
  }, [key, removeItem, storageType]);

  const handleClearAll = useCallback(() => {
    clearStorage();
    setLastRead(null);
    bumpSnapshotVersion((current) => current + 1);
  }, [clearStorage]);

  const storageLabel = storageType === "session" ? "sessionStorage" : "localStorage";

  return (
    <div className="flex max-w-xl flex-col gap-4 text-sm">
      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">مدیریت ذخیره‌سازی</h2>

        <label className="flex flex-col gap-1">
          <span className="font-medium text-slate-700">کلید</span>
          <input
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="مثلاً user-token"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium text-slate-700">مقدار</span>
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="h-24 rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="مقدار موردنظر را وارد کنید"
          />
        </label>

        <label className="flex items-center gap-2 text-slate-700">
          <span className="font-medium">نوع ذخیره‌سازی:</span>
          <select
            value={storageType}
            onChange={(event) => setStorageType(event.target.value as StorageChoice)}
            className="rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="session">sessionStorage</option>
            <option value="local">localStorage</option>
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ذخیره در {storageLabel}
          </button>
          <button
            type="button"
            onClick={handleLoad}
            className="rounded border border-blue-600 px-3 py-1.5 font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            خواندن از {storageLabel}
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded border border-amber-500 px-3 py-1.5 font-medium text-amber-600 transition-colors hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            حذف کلید
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded border border-rose-500 px-3 py-1.5 font-medium text-rose-600 transition-colors hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
          >
            پاک کردن هر دو storage
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">آخرین مقدار خوانده شده</h3>
        <code className="mt-2 block min-h-[2rem] rounded bg-slate-900 p-2 text-xs text-slate-100">
          {lastRead ?? ""}
        </code>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">sessionStorage</h3>
          {snapshot.session.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">هیچ مقداری ذخیره نشده است.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {snapshot.session.map(([entryKey, entryValue]) => (
                <li key={entryKey}>
                  <span className="font-semibold">{entryKey}:</span>{" "}
                  {entryValue || "«خالی»"}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">localStorage</h3>
          {snapshot.local.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">هیچ مقداری ذخیره نشده است.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {snapshot.local.map(([entryKey, entryValue]) => (
                <li key={entryKey}>
                  <span className="font-semibold">{entryKey}:</span>{" "}
                  {entryValue || "«خالی»"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof Example> = {
  title: "Hooks/useStorage",
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
