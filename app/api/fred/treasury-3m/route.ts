import { NextResponse } from 'next/server';
import { fetchFredData, formatDateForChart, FRED_SERIES } from '@/lib/fred-api';

export async function GET() {
  try {
    // Fetch 3-month treasury bill data from FRED API
    const rawData = await fetchFredData(
      FRED_SERIES.TREASURY_3M,
      '2020-01-01',
      new Date().toISOString().split('T')[0]
    );

    // Format data for chart (quarterly aggregation)
    const chartData = rawData
      .slice(-20) // Last 20 data points (approximately 5 years of monthly data)
      .filter((_, index) => index % 3 === 0) // Take every 3rd month for quarterly view
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
    console.error('Error fetching 3-month treasury data:', error);
    
    // Fallback data if API fails
    const fallbackData = [
      { year: '2020 Q1', value: 1.54 },
      { year: '2020 Q2', value: 0.11 },
      { year: '2020 Q3', value: 0.09 },
      { year: '2020 Q4', value: 0.09 },
      { year: '2021 Q1', value: 0.02 },
      { year: '2021 Q2', value: 0.04 },
      { year: '2021 Q3', value: 0.04 },
      { year: '2021 Q4', value: 0.06 },
      { year: '2022 Q1', value: 0.54 },
      { year: '2022 Q2', value: 1.69 },
      { year: '2022 Q3', value: 3.12 },
      { year: '2022 Q4', value: 4.10 },
      { year: '2023 Q1', value: 4.88 },
      { year: '2023 Q2', value: 5.26 },
      { year: '2023 Q3', value: 5.42 },
      { year: '2023 Q4', value: 5.24 },
      { year: '2024 Q1', value: 5.36 },
      { year: '2024 Q2', value: 5.39 },
      { year: '2024 Q3', value: 4.35 },
    ];

    return NextResponse.json({
      success: false,
      data: fallbackData,
      error: 'Using fallback data',
      lastUpdated: new Date().toISOString()
    });
  }
}