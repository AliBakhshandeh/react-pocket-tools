import { useMemo, useCallback } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Different types of class values that can be passed to the hook
 * - string: Class string
 * - undefined/null/false: Falsy values that are ignored
 * - Record<string, boolean>: Object that adds keys with true values as classes
 * - ClassValue[]: Array of the above types
 */
export type ClassValue =
  | string
  | undefined
  | null
  | false
  | Record<string, boolean>
  | ClassValue[];

/**
 * Return type from useDynamicClasses hook
 */
export interface UseDynamicClassesReturn<T extends string = string> {
  /** Final class string that has been merged and normalized */
  className: T;
  /** Function to merge new classes with current classes */
  merge: (...classes: ClassValue[]) => T;
  /** Function to toggle a class (add or remove) */
  toggle: (clazz: string, on?: boolean) => T;
}

/**
 * Convert different inputs to an array of class strings
 * This function normalizes different input types
 *
 * @param input - Input that can be string, array, object or falsy
 * @returns Array of class strings
 */
function normalizeInput(input: ClassValue): string[] {
  // Ignore falsy values
  if (!input) return [];
  // If string, split and filter
  if (typeof input === "string") return input.trim().split(/\s+/).filter(Boolean);
  // If array, normalize recursively
  if (Array.isArray(input)) return input.flatMap(normalizeInput);
  // If object, return only keys with true values
  if (typeof input === "object")
    return Object.keys(input).filter((k) =>
      Boolean((input as Record<string, boolean>)[k]),
    );
  return [];
}

/**
 * Convert an array of ClassValue to a final class string
 * This function uses twMerge to properly merge Tailwind classes
 *
 * @param inputs - Array of ClassValue
 * @returns Merged class string
 */
function serializeClasses(inputs: ClassValue[]): string {
  const tokens = inputs.flatMap(normalizeInput);
  return twMerge(tokens.join(" ").trim());
}

/**
 * Hook for dynamic CSS class management with Tailwind CSS support
 * This hook provides dynamic merge, toggle and class management capabilities
 *
 * @template T - Return string type (default: string)
 * @param args - Various class arguments (can be string, array, object, etc.)
 * @returns An object containing className, merge and toggle
 *
 * @example
 * ```tsx
 * function Button({ isActive, isDisabled }) {
 *   const { className, toggle } = useDynamicClasses(
 *     "px-4 py-2 rounded",
 *     { "bg-blue-500": isActive, "opacity-50": isDisabled }
 *   );
 *
 *   return <button className={className}>Click me</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { className, merge, toggle } = useDynamicClasses("text-sm");
 *
 *   // Merge new classes
 *   const merged = merge("font-bold", { italic: true });
 *
 *   // Toggle a class
 *   const toggled = toggle("underline");
 * }
 * ```
 */
export default function useDynamicClasses<T extends string = string>(
  ...args: ClassValue[]
): UseDynamicClassesReturn<T> {
  // Calculate final className with useMemo for optimization
  const className = useMemo(() => serializeClasses(args), [args]) as T;

  /**
   * Function to merge new classes with current classes
   * This function adds new classes to the original args and returns a new string
   *
   * @param more - New classes to merge
   * @returns Merged class string
   */
  const merge = useCallback(
    (...more: ClassValue[]) => serializeClasses([...args, ...more]) as T,
    [args],
  );

  /**
   * Function to toggle a class
   * If on is not specified, toggles the class (adds if not present, removes if present)
   * If on is specified, adds the class (on=true) or removes it (on=false)
   *
   * @param clazz - Class name to toggle
   * @param on - Desired state (true=add, false=remove, undefined=toggle)
   * @returns New class string
   */
  const toggle = useCallback(
    (clazz: string, on?: boolean) => {
      // Convert current className to array of tokens
      const tokens = className.split(/\s+/).filter(Boolean);
      const has = tokens.includes(clazz);

      // If on is not specified, toggle
      if (on === undefined) {
        return has
          ? (twMerge(tokens.filter((t) => t !== clazz).join(" ")) as T)
          : (twMerge([...tokens, clazz].join(" ")) as T);
      }

      // If on=true and class doesn't exist, add it
      if (on && !has) return twMerge([...tokens, clazz].join(" ")) as T;
      // If on=false and class exists, remove it
      if (!on && has) return twMerge(tokens.filter((t) => t !== clazz).join(" ")) as T;
      // Otherwise, return current className
      return className;
    },
    [className],
  );

  return { className, merge, toggle };
}
