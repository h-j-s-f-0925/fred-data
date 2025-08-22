import { useState, useEffect } from 'react';

export interface ChartDataPoint {
  year: string;
  value: number;
}

export interface FredApiData {
  success: boolean;
  data: ChartDataPoint[];
  error?: string;
  lastUpdated: string;
}

export function useFredData(endpoint: string) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/fred/${endpoint}`);
        const result: FredApiData = await response.json();
        
        if (result.success || result.data) {
          setData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        console.error(`Error fetching ${endpoint} data:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}