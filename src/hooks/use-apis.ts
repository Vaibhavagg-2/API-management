'use client';

import type { ApiDef } from '@/lib/types';
import { apis as initialApis } from '@/lib/data';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NewApiData = {
    name: string;
    version: string;
    description: string;
    endpoints: {
        path: string;
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        summary: string;
    }[];
};


export function useApis() {
  const [apis, setApis] = useState<ApiDef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedApis = localStorage.getItem('user_apis');
      if (storedApis) {
        setApis(JSON.parse(storedApis));
      } else {
        setApis(initialApis);
      }
    } catch (error) {
      console.error('Failed to load APIs from localStorage, using initial data.', error);
      setApis(initialApis);
    } finally {
      setLoading(false);
    }
  }, []);

  const addApi = useCallback((apiData: NewApiData) => {
    const newApi: ApiDef = {
      id: uuidv4(),
      name: apiData.name,
      version: apiData.version,
      description: apiData.description,
      endpoints: apiData.endpoints.map((e) => ({
        ...e,
        description: '', 
        parameters: [],
        responses: {},
      })),
      schemas: {}, 
    };
    
    setApis((prevApis) => {
      const updatedApis = [...prevApis, newApi];
      localStorage.setItem('user_apis', JSON.stringify(updatedApis));
      return updatedApis;
    });

    return newApi;
  }, []);

  return { apis, addApi, loading };
}
