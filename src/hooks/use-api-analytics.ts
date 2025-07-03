'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ApiCallLog } from '@/lib/types';
import { initialApiLogs } from '@/lib/data';

const ANALYTICS_STORAGE_KEY = 'api_analytics_logs';

export function useApiAnalytics() {
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedLogs = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      } else {
        // Initialize with some mock data if nothing is stored
        setLogs(initialApiLogs);
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(initialApiLogs));
      }
    } catch (error) {
      console.error('Failed to load API logs from localStorage, using initial data.', error);
      setLogs(initialApiLogs);
    } finally {
      setLoading(false);
    }
  }, []);

  const logApiCall = useCallback((data: Omit<ApiCallLog, 'id' | 'timestamp'>) => {
    const newLog: ApiCallLog = {
      ...data,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };

    setLogs((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];
      // Keep the log history from getting too large
      if (updatedLogs.length > 500) {
        updatedLogs.length = 500;
      }
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updatedLogs));
      return updatedLogs;
    });

    return newLog;
  }, []);

  return { logs, logApiCall, loading };
}
