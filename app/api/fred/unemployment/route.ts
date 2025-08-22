import { NextResponse } from 'next/server';
import { fetchFredData, formatDateForChart, FRED_SERIES } from '@/lib/fred-api';

export async function GET() {
  try {
    // Fetch unemployment rate data from FRED API
    const rawData = await fetchFredData(
      FRED_SERIES.UNEMPLOYMENT,
      '2020-01-01',
      new Date().toISOString().split('T')[0]
    );

    // Format data for chart (quarterly aggregation)
    const chartData = rawData
      .filter((_, index) => index % 3 === 0) // Take every 3rd month for quarterly view
      .slice(-20) // Last 20 quarters (5 years)
      .map(item => ({
        year: formatDateForChart(item.date),
        value: item.value
      }));

    return NextResponse.json({
      success: true,
      data: chartData,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching unemployment data:', error);
    
    // Fallback data if API fails
    const fallbackData = [
      { year: '2020 Q1', value: 3.8 },
      { year: '2020 Q2', value: 13.0 },
      { year: '2020 Q3', value: 8.8 },
      { year: '2020 Q4', value: 6.7 },
      { year: '2021 Q1', value: 6.2 },
      { year: '2021 Q2', value: 5.9 },
      { year: '2021 Q3', value: 5.1 },
      { year: '2021 Q4', value: 3.9 },
      { year: '2022 Q1', value: 3.8 },
      { year: '2022 Q2', value: 3.6 },
      { year: '2022 Q3', value: 3.5 },
      { year: '2022 Q4', value: 3.5 },
      { year: '2023 Q1', value: 3.5 },
      { year: '2023 Q2', value: 3.6 },
      { year: '2023 Q3', value: 3.8 },
      { year: '2023 Q4', value: 3.7 },
      { year: '2024 Q1', value: 3.8 },
      { year: '2024 Q2', value: 4.0 },
      { year: '2024 Q3', value: 4.1 },
    ];

    return NextResponse.json({
      success: false,
      data: fallbackData,
      error: 'Using fallback data',
      lastUpdated: new Date().toISOString()
    });
  }
}