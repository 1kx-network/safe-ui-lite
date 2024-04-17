import { useCallback, useEffect } from 'react';

import ExternalStore from '../ExternalStore';

import local from './local';

// The setter accepts T or a function that takes the old value and returns T
// Mimics the behavior of useState
type Undefinable<T> = T | undefined;

export type Setter<T> = (val: T | ((prevVal: Undefinable<T>) => Undefinable<T>)) => void;

// External stores for each localStorage key which act as a shared cache for LS
const externalStores: Record<string, ExternalStore<any>> = {};

const useLocalStorage = <T>(key: string): [Undefinable<T>, Setter<T>] => {
  if (!externalStores[key]) {
    externalStores[key] = new ExternalStore<T>();
  }
  const { getStore, setStore, useStore } = externalStores[key] as ExternalStore<T>;

  // This is the setter that will be returned
  // It will update the local storage and cache
  const setNewValue = useCallback<Setter<T>>(
    value => {
      setStore(oldValue => {
        const newValue = value instanceof Function ? value(oldValue) : value;

        if (newValue !== oldValue) {
          local.setItem(key, newValue);
        }

        return newValue;
      });
    },
    [key, setStore]
  );

  // Set the initial value from LS on mount
  useEffect(() => {
    if (getStore() === undefined) {
      const lsValue = local.getItem<T>(key);
      if (lsValue !== null) {
        setStore(lsValue);
      }
    }
  }, [key, getStore, setStore]);

  // Subscribe to changes in local storage and update the cache
  // This will work across tabs
  useEffect(() => {
    const onStorageEvent = (event: StorageEvent) => {
      if (event.key === local.getPrefixedKey(key)) {
        const lsValue = local.getItem<T>(key);
        if (lsValue !== null && lsValue !== getStore()) {
          setStore(lsValue);
        }
      }
    };

    window.addEventListener('storage', onStorageEvent);

    return () => {
      window.removeEventListener('storage', onStorageEvent);
    };
  }, [key, getStore, setStore]);

  return [useStore(), setNewValue];
};

export default useLocalStorage;
