import { NextResponse } from 'next/server';
import { fetchFredData, formatDateForChart, FRED_SERIES } from '@/lib/fred-api';

export async function GET() {
  try {
    // Fetch 10-year treasury bond data from FRED API
    const rawData = await fetchFredData(
      FRED_SERIES.BOND_10Y,
      '2020-01-01',
      new Date().toISOString().split('T')[0]
    );

    // Format data for chart (monthly aggregation - take first day of each month)
    const monthlyData = rawData.filter(item => {
      const date = new Date(item.date);
      return date.getDate() <= 7; // First week of month
    });

    const chartData = monthlyData
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
    console.error('Error fetching 10-year bond data:', error);
    
    // Fallback data if API fails
    const fallbackData = [
      { year: '2020 Q1', value: 1.54 },
      { year: '2020 Q2', value: 0.65 },
      { year: '2020 Q3', value: 0.68 },
      { year: '2020 Q4', value: 0.93 },
      { year: '2021 Q1', value: 1.74 },
      { year: '2021 Q2', value: 1.44 },
      { year: '2021 Q3', value: 1.31 },
      { year: '2021 Q4', value: 1.52 },
      { year: '2022 Q1', value: 2.34 },
      { year: '2022 Q2', value: 3.49 },
      { year: '2022 Q3', value: 3.83 },
      { year: '2022 Q4', value: 3.88 },
      { year: '2023 Q1', value: 3.66 },
      { year: '2023 Q2', value: 3.81 },
      { year: '2023 Q3', value: 4.57 },
      { year: '2023 Q4', value: 4.33 },
      { year: '2024 Q1', value: 4.20 },
      { year: '2024 Q2', value: 4.47 },
      { year: '2024 Q3', value: 4.28 },
    ];

    return NextResponse.json({
      success: false,
      data: fallbackData,
      error: 'Using fallback data',
      lastUpdated: new Date().toISOString()
    });
  }
}