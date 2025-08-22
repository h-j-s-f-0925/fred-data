import { fredDataCache } from './cache';

export interface FredDataPoint {
  date: string;
  value: number;
}

export interface FredApiResponse {
  observations: Array<{
    date: string;
    value: string;
  }>;
}

export const FRED_SERIES = {
  CPI: 'CPIAUCSL',           // Consumer Price Index for All Urban Consumers
  UNEMPLOYMENT: 'UNRATE',    // Unemployment Rate
  BOND_10Y: 'DGS10',        // 10-Year Treasury Constant Maturity Rate
  TREASURY_3M: 'TB3MS',     // 3-Month Treasury Bill Secondary Market Rate
} as const;

export async function fetchFredData(
  seriesId: string,
  startDate?: string,
  endDate?: string
): Promise<FredDataPoint[]> {
  const apiKey = process.env.FRED_API_KEY;
  const baseUrl = process.env.FRED_API_BASE_URL || 'https://api.stlouisfed.org/fred';
  
  // Check if API key is configured
  if (!apiKey || apiKey === 'your_fred_api_key_here') {
    console.warn('FRED_API_KEY is not properly configured. Using fallback data.');
    throw new Error('FRED_API_KEY is not configured');
  }

  // Create cache key without sensitive data
  const cacheKey = `fred_${seriesId}_${startDate || '2020-01-01'}_${endDate || new Date().toISOString().split('T')[0]}`;
  
  // Check cache first
  const cachedData = fredDataCache.get(cacheKey);
  if (cachedData) {
    console.log(`Using cached data for series: ${seriesId}`);
    return cachedData;
  }

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    start_date: startDate || '2020-01-01',
    end_date: endDate || new Date().toISOString().split('T')[0],
  });

  const url = `${baseUrl}/series/observations?${params}`;
  
  // Safe logging - remove API key from logs
  console.log(`Fetching FRED data for series: ${seriesId}`);
  
  try {
    const response = await fetch(url, {
      // Disable Next.js caching to prevent API key exposure in cache error logs
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`FRED API error response for series ${seriesId}:`, errorText.substring(0, 200));
      throw new Error(`FRED API error: ${response.status} ${response.statusText}`);
    }
    
    const data: FredApiResponse = await response.json();
    
    if (!data.observations || data.observations.length === 0) {
      throw new Error(`No data available for series ${seriesId}`);
    }
    
    const processedData = data.observations
      .filter(obs => obs.value !== '.' && obs.value !== null)
      .map(obs => ({
        date: obs.date,
        value: parseFloat(obs.value)
      }))
      .filter(obs => !isNaN(obs.value));

    // Cache the processed data for 1 hour
    fredDataCache.set(cacheKey, processedData, 3600000);
    
    return processedData;
      
  } catch (error) {
    console.error(`Error fetching FRED data for series ${seriesId}:`, error);
    throw error;
  }
}

export function calculateYearOverYearChange(data: FredDataPoint[]): FredDataPoint[] {
  const result: FredDataPoint[] = [];
  
  for (let i = 12; i < data.length; i++) {
    const currentValue = data[i].value;
    const yearAgoValue = data[i - 12].value;
    
    if (yearAgoValue !== 0) {
      const yearOverYearChange = ((currentValue - yearAgoValue) / yearAgoValue) * 100;
      result.push({
        date: data[i].date,
        value: Math.round(yearOverYearChange * 100) / 100 // Round to 2 decimal places
      });
    }
  }
  
  return result;
}

export function formatDateForChart(date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const quarter = Math.ceil(month / 3);
  
  return `${year} Q${quarter}`;
}