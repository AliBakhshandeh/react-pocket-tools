import { useMemo, useCallback } from "react";
import { twMerge } from "tailwind-merge";

export type ClassValue =
  | string
  | undefined
  | null
  | false
  | Record<string, boolean>
  | ClassValue[];

export interface UseDynamicClassesReturn<T extends string = string> {
  className: T;
  merge: (...classes: ClassValue[]) => T;
  toggle: (clazz: string, on?: boolean) => T;
}

function normalizeInput(input: ClassValue): string[] {
  if (!input) return [];
  if (typeof input === "string") return input.trim().split(/\s+/).filter(Boolean);
  if (Array.isArray(input)) return input.flatMap(normalizeInput);
  if (typeof input === "object")
    return Object.keys(input).filter((k) =>
      Boolean((input as Record<string, boolean>)[k]),
    );
  return [];
}

function serializeClasses(inputs: ClassValue[]): string {
  const tokens = inputs.flatMap(normalizeInput);
  return twMerge(tokens.join(" ").trim());
}

export function useDynamicClasses<T extends string = string>(
  ...args: ClassValue[]
): UseDynamicClassesReturn<T> {
  const className = useMemo(() => serializeClasses(args), [args]) as T;

  const merge = useCallback(
    (...more: ClassValue[]) => serializeClasses([...args, ...more]) as T,
    [args],
  );

  const toggle = useCallback(
    (clazz: string, on?: boolean) => {
      const tokens = className.split(/\s+/).filter(Boolean);
      const has = tokens.includes(clazz);
      if (on === undefined) {
        return has
          ? (twMerge(tokens.filter((t) => t !== clazz).join(" ")) as T)
          : (twMerge([...tokens, clazz].join(" ")) as T);
      }
      if (on && !has) return twMerge([...tokens, clazz].join(" ")) as T;
      if (!on && has) return twMerge(tokens.filter((t) => t !== clazz).join(" ")) as T;
      return className;
    },
    [className],
  );

  return { className, merge, toggle };
}
