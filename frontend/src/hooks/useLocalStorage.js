import { useState, useEffect } from 'react';

/**
 * A custom hook to synchronize state with local storage.
 * 
 * @param {string} key LocalStorage key
 * @param {any} initialValue Fallback value if nothing is stored
 * @returns {[any, Function]} State and setter function
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
export default useLocalStorage;
