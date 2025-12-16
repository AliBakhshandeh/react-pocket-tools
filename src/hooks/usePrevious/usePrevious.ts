import { useRef, useEffect } from "react";

/**
 * Hook for storing the previous value of a variable
 * This hook returns the previous value on each render and stores the new value for the next render
 *
 * @template T - Value type
 * @param value - Current value
 * @returns Previous value (undefined on first render)
 *
 * @example
 * ```tsx
 * function Counter({ count }) {
 *   const previousCount = usePrevious(count);
 *
 *   return (
 *     <div>
 *       <p>Current: {count}</p>
 *       {previousCount !== undefined && (
 *         <p>Previous: {previousCount}</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
function usePrevious<T>(value?: T) {
  // Use ref to store value without triggering re-render
  const ref = useRef<T>();

  // After each render, store current value in ref
  // This is done in useEffect so it happens after render
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (stored in previous render)
  return ref.current;
}

export default usePrevious;
