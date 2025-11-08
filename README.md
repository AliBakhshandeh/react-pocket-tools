# react-pocket-tools

کتابخانه‌ای از هوک‌ها و ابزارهای کمکی React که توسعه رابط‌های کاربری را آسان‌تر می‌کند. هر ابزار با Storybook مستند شده و تست‌های واحد اطمینان می‌دهند رفتارها پایدار بمانند.

## ویژگی‌ها

- پشتیبانی از TypeScript و خروجی‌های `cjs`, `esm`, `d.ts`
- Storybook آماده برای مستندسازی و نمایش Playground
- پیکربندی Vitest و Testing Library برای نوشتن تست‌های واحد
- ESLint و Prettier برای حفظ کیفیت و یکنواختی کد

## شروع سریع

```bash
pnpm install
pnpm storybook
```

با اجرای دستور دوم، Storybook روی `http://localhost:6006` اجرا می‌شود و می‌توانید هر هوک را به‌صورت تعاملی بررسی کنید.

## نمونه استفاده

```tsx
import { useStorage } from "react-pocket-tools";

function Settings() {
  const { getItem, setItem } = useStorage();

  const saveTheme = (theme: "light" | "dark") => {
    setItem("preferred-theme", theme, "local");
  };

  const theme = getItem("preferred-theme", "local") ?? "light";

  return (
    <button onClick={() => saveTheme(theme === "light" ? "dark" : "light")}>
      Theme: {theme}
    </button>
  );
}
```

## اسکریپت‌های مهم

- `pnpm storybook` – اجرای Storybook در حالت توسعه
- `pnpm build:storybook` – تولید خروجی استاتیک Storybook در پوشه `storybook-static`
- `pnpm build` – باندل کتابخانه با Tsup و تولید خروجی در `dist`
- `pnpm lint` – بررسی کیفیت کد
- `pnpm test` – اجرای تست‌ها با Vitest

## ساختار پروژه

- `src/hooks` – هوک‌های اصلی پروژه
- `src/utils` – توابع کمکی اشتراکی
- `src/components` – کامپوننت‌های کوچک نمایشی و پشتیبان Storybook
- `.storybook` – پیکربندی Storybook
- `vitest.setup.ts` – تنظیمات تست‌ها

## مشارکت

۱. ریپازیتوری را Fork کنید و شاخه جدید بسازید.  
۲. بعد از اعمال تغییرات، تست‌ها و Lint را اجرا کنید:

```bash
pnpm lint
pnpm test
```

۳. برای بررسی دستی، Storybook را بالا بیاورید و سناریوهای مرتبط را بررسی کنید.  
۴. Pull Request باز کنید و توضیح دهید چه چیزی اضافه یا اصلاح شده است.

## انتشار

```bash
pnpm build
pnpm publish --access public
```

خروجی `dist` شامل باندل‌های CommonJS و ESModule به‌همراه تعریف‌های TypeScript است.
