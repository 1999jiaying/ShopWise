'use client';

import { useState, useEffect, useCallback } from 'react';

export function usePersistedState<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setStateRaw] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch { /* quota exceeded — ignore */ }
  }, [key, state]);

  const setState = useCallback((val: T | ((prev: T) => T)) => {
    setStateRaw(val);
  }, []);

  return [state, setState];
}
