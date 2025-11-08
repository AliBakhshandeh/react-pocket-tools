type StorageType = "session" | "local";

type UseStorageReturnValue = {
  getItem: (key: string, type?: StorageType) => string | null;
  setItem: (key: string, value: string, type?: StorageType) => boolean;
  removeItem: (key: string, type?: StorageType) => void;
  clearStorage: () => void;
};

const useStorage = (): UseStorageReturnValue => {
  const isBrowser = typeof window !== "undefined";

  const storageType = (type?: StorageType): "localStorage" | "sessionStorage" =>
    type === "local" ? "localStorage" : "sessionStorage";

  const getItem = (key: string, type?: StorageType): string | null => {
    if (!isBrowser) return null;
    return window[storageType(type)].getItem(key);
  };

  const setItem = (key: string, value: string, type?: StorageType): boolean => {
    if (!isBrowser) return false;
    window[storageType(type)].setItem(key, value);
    return true;
  };

  const removeItem = (key: string, type?: StorageType): void => {
    if (isBrowser) window[storageType(type)].removeItem(key);
  };

  const clearStorage = (): void => {
    if (isBrowser) {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
  };

  return { getItem, setItem, removeItem, clearStorage };
};

export default useStorage;
