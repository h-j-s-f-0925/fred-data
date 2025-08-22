import { NextResponse } from 'next/server';
import { fetchFredData, calculateYearOverYearChange, formatDateForChart, FRED_SERIES } from '@/lib/fred-api';

export async function GET() {
  try {
    // Fetch CPI data from FRED API
    const rawData = await fetchFredData(
      FRED_SERIES.CPI,
      '2019-01-01', // Start earlier to calculate year-over-year
      new Date().toISOString().split('T')[0]
    );

    // Calculate year-over-year percentage change
    const yoyData = calculateYearOverYearChange(rawData);

    // Format data for chart (quarterly aggregation)
    const chartData = yoyData
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
    console.error('Error fetching CPI data:', error);
    
    // Fallback data if API fails
    const fallbackData = [
      { year: '2020 Q1', value: 1.5 },
      { year: '2020 Q2', value: 0.1 },
      { year: '2020 Q3', value: 1.2 },
      { year: '2020 Q4', value: 1.4 },
      { year: '2021 Q1', value: 2.6 },
      { year: '2021 Q2', value: 5.0 },
      { year: '2021 Q3', value: 5.4 },
      { year: '2021 Q4', value: 6.8 },
      { year: '2022 Q1', value: 8.5 },
      { year: '2022 Q2', value: 9.1 },
      { year: '2022 Q3', value: 8.2 },
      { year: '2022 Q4', value: 6.5 },
      { year: '2023 Q1', value: 5.0 },
      { year: '2023 Q2', value: 3.0 },
      { year: '2023 Q3', value: 3.7 },
      { year: '2023 Q4', value: 3.1 },
      { year: '2024 Q1', value: 3.5 },
      { year: '2024 Q2', value: 3.0 },
      { year: '2024 Q3', value: 2.4 },
    ];

    return NextResponse.json({
      success: false,
      data: fallbackData,
      error: 'Using fallback data',
      lastUpdated: new Date().toISOString()
    });
  }
}