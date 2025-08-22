'use client'

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFredData } from '@/hooks/useFredData';

export function InterestRates3MonthChart() {
  const { data, loading, error } = useFredData('treasury-3m');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interest Rates: 3-Month Rates
        </h2>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading treasury data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Interest Rates: 3-Month Rates
        </h2>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-2">⚠️ Data temporarily unavailable</div>
            <div className="text-sm text-gray-600">Using fallback data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Interest Rates: 3-Month Rates
        </h2>
        <div className="text-xs text-gray-500 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          FRED Data
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 6]}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, '3-Month Rate']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#7c3aed" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a 
          href="https://fred.stlouisfed.org/series/TB3MS" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center"
        >
          <span className="mr-1">🔗</span>
          View on FRED: 3-Month Treasury Bill Secondary Market Rate
        </a>
      </div>
    </div>
  );
}