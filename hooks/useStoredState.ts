"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  readStoredRaw,
  removeStoredValue,
  STORED_VALUE_CHANGE_EVENT,
  type StoredValueChangeDetail,
  type StoredValueOptions,
  writeStoredValue,
} from "@/lib/storage";

export interface UseStoredStateOptions<T> extends StoredValueOptions<T> {
  sync?: boolean;
}

export interface StoredStateMeta {
  isHydrated: boolean;
  remove: () => void;
}

export type StoredStateResult<T> = readonly [
  T,
  Dispatch<SetStateAction<T>>,
  StoredStateMeta,
];

type InitialValue<T> = T | (() => T);

const subscribeToHydration = () => () => undefined;
const getHydratedClientSnapshot = () => true;
const getHydratedServerSnapshot = () => false;
const getServerStoredSnapshot = () => null;

function resolveInitialValue<T>(initialValue: InitialValue<T>): T {
  return typeof initialValue === "function"
    ? (initialValue as () => T)()
    : initialValue;
}

function deserializeStoredValue<T>(
  rawValue: string | null,
  fallback: T,
  deserialize?: (value: string) => T,
): T {
  if (rawValue === null) {
    return fallback;
  }

  try {
    return deserialize
      ? deserialize(rawValue)
      : (JSON.parse(rawValue) as T);
  } catch {
    return fallback;
  }
}

export function useStoredState<T>(
  key: string,
  initialValue: InitialValue<T>,
  options: UseStoredStateOptions<T> = {},
): StoredStateResult<T> {
  const { deserialize, serialize, storage, sync = true } = options;
  const [fallback] = useState<T>(() => resolveInitialValue(initialValue));

  const subscribe = useCallback(
    (notify: () => void) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      const handleStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) {
          notify();
        }
      };

      const handleLocalChange = (event: Event) => {
        const detail = (event as CustomEvent<StoredValueChangeDetail>).detail;

        if (detail?.key === key) {
          notify();
        }
      };

      if (sync) {
        window.addEventListener("storage", handleStorage);
      }
      window.addEventListener(STORED_VALUE_CHANGE_EVENT, handleLocalChange);

      return () => {
        if (sync) {
          window.removeEventListener("storage", handleStorage);
        }
        window.removeEventListener(STORED_VALUE_CHANGE_EVENT, handleLocalChange);
      };
    },
    [key, sync],
  );

  const getSnapshot = useCallback(
    () => readStoredRaw(key, storage),
    [key, storage],
  );
  const rawValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerStoredSnapshot,
  );
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedClientSnapshot,
    getHydratedServerSnapshot,
  );
  const value = useMemo(
    () => deserializeStoredValue(rawValue, fallback, deserialize),
    [deserialize, fallback, rawValue],
  );

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (nextValueOrUpdater) => {
      const currentValue = deserializeStoredValue(
        readStoredRaw(key, storage),
        value,
        deserialize,
      );
      const nextValue =
        typeof nextValueOrUpdater === "function"
          ? (nextValueOrUpdater as (currentValue: T) => T)(currentValue)
          : nextValueOrUpdater;

      writeStoredValue(key, nextValue, { deserialize, serialize, storage });
    },
    [deserialize, key, serialize, storage, value],
  );

  const remove = useCallback(() => {
    removeStoredValue(key, storage);
  }, [key, storage]);

  const meta = useMemo<StoredStateMeta>(
    () => ({ isHydrated, remove }),
    [isHydrated, remove],
  );

  return [value, setValue, meta] as const;
}
