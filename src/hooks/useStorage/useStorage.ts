/**
 * Storage type: session or local
 */
type StorageType = "session" | "local";

/**
 * Return type from useStorage hook
 */
type UseStorageReturnValue = {
  /** Get value from storage */
  getItem: (key: string, type?: StorageType) => string | null;
  /** Set value in storage */
  setItem: (key: string, value: string, type?: StorageType) => boolean;
  /** Remove an item from storage */
  removeItem: (key: string, type?: StorageType) => void;
  /** Clear all storage */
  clearStorage: () => void;
};

/**
 * Hook for working with localStorage and sessionStorage
 * This hook provides a unified interface for working with both storage types
 *
 * @returns An object containing getItem, setItem, removeItem and clearStorage methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const storage = useStorage();
 *
 *   // Store in sessionStorage (default)
 *   storage.setItem("token", "abc123");
 *
 *   // Store in localStorage
 *   storage.setItem("theme", "dark", "local");
 *
 *   // Read from storage
 *   const token = storage.getItem("token");
 *   const theme = storage.getItem("theme", "local");
 * }
 * ```
 */
const useStorage = (): UseStorageReturnValue => {
  // Check if we're in browser environment
  const isBrowser = typeof window !== "undefined";

  /**
   * Convert storage type to actual storage API name
   * @param type - Storage type (local or session)
   * @returns Storage API name
   */
  const storageType = (type?: StorageType): "localStorage" | "sessionStorage" =>
    type === "local" ? "localStorage" : "sessionStorage";

  /**
   * Get value from storage
   * @param key - Item key
   * @param type - Storage type (default: session)
   * @returns Stored value or null
   */
  const getItem = (key: string, type?: StorageType): string | null => {
    if (!isBrowser) return null;
    return window[storageType(type)].getItem(key);
  };

  /**
   * Set value in storage
   * @param key - Item key
   * @param value - Value to store
   * @param type - Storage type (default: session)
   * @returns true if successful, false otherwise
   */
  const setItem = (key: string, value: string, type?: StorageType): boolean => {
    if (!isBrowser) return false;
    window[storageType(type)].setItem(key, value);
    return true;
  };

  /**
   * Remove an item from storage
   * @param key - Item key to remove
   * @param type - Storage type (default: session)
   */
  const removeItem = (key: string, type?: StorageType): void => {
    if (isBrowser) window[storageType(type)].removeItem(key);
  };

  /**
   * Clear all localStorage and sessionStorage
   */
  const clearStorage = (): void => {
    if (isBrowser) {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  };

  return { getItem, setItem, removeItem, clearStorage };
};

export default useStorage;
