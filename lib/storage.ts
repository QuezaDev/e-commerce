export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface StoredValueOptions<T> {
  storage?: StorageLike | null;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export interface StoredValueChangeDetail {
  key: string;
  newValue: string | null;
}

export const STORED_VALUE_CHANGE_EVENT = "coringao-loko:storage-change";

const defaultSerialize = <T,>(value: T): string => JSON.stringify(value);
const defaultDeserialize = <T,>(value: string): T => JSON.parse(value) as T;

function getBrowserStorage(storage?: StorageLike | null): StorageLike | null {
  if (storage !== undefined) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function emitStoredValueChange(key: string, newValue: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<StoredValueChangeDetail>(STORED_VALUE_CHANGE_EVENT, {
      detail: { key, newValue },
    }),
  );
}

export function readStoredRaw(
  key: string,
  storage?: StorageLike | null,
): string | null {
  const resolvedStorage = getBrowserStorage(storage);

  if (!resolvedStorage) {
    return null;
  }

  try {
    return resolvedStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readStoredValue<T>(
  key: string,
  fallback: T,
  options: StoredValueOptions<T> = {},
): T {
  try {
    const value = readStoredRaw(key, options.storage);

    if (value === null) {
      return fallback;
    }

    return (options.deserialize ?? defaultDeserialize<T>)(value);
  } catch {
    return fallback;
  }
}

export function writeStoredValue<T>(
  key: string,
  value: T,
  options: StoredValueOptions<T> = {},
): boolean {
  const storage = getBrowserStorage(options.storage);

  if (!storage) {
    return false;
  }

  try {
    const serializedValue = (options.serialize ?? defaultSerialize<T>)(value);
    storage.setItem(key, serializedValue);
    emitStoredValueChange(key, serializedValue);
    return true;
  } catch {
    return false;
  }
}

export function removeStoredValue(
  key: string,
  storage?: StorageLike | null,
): boolean {
  const resolvedStorage = getBrowserStorage(storage);

  if (!resolvedStorage) {
    return false;
  }

  try {
    resolvedStorage.removeItem(key);
    emitStoredValueChange(key, null);
    return true;
  } catch {
    return false;
  }
}
