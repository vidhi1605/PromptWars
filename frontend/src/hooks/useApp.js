import { useContext } from 'react';
import { AppContext } from '../context/AppContextObject.js';

/**
 * Custom hook to retrieve the global app context state.
 * 
 * @returns {import('../context/AppContext').AppContext} AppContext value
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default useApp;
