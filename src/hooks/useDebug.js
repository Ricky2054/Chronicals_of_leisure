import { useState, useCallback } from 'react';

export function useDebug() {
  const [logs, setLogs] = useState([
    { message: 'Debug Console Initialized', type: 'info', timestamp: new Date().toLocaleTimeString() }
  ]);

  const addDebugLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = { message, type, timestamp };
    
    setLogs(prev => {
      const updated = [newLog, ...prev];
      // Keep only last 50 logs
      return updated.slice(0, 50);
    });
    
    // Also log to browser console
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  return [logs, addDebugLog];
}
