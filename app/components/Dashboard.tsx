'use client'

import React from 'react';
import { CPIChart } from './charts/CPIChart';
import { LaborStatsChart } from './charts/LaborStatsChart';
import { InterestRatesChart } from './charts/InterestRatesChart';
import { InterestRates3MonthChart } from './charts/InterestRates3MonthChart';

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex-shrink-0">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">FRED Indicators</h2>
          <p className="text-sm text-gray-600">Economic Data Dashboard</p>
        </div>
        
        <nav className="space-y-2">
          <div className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center">
            <span className="mr-2">📊</span>
            Key Indicators
          </div>
          <div className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
            <span className="mr-2">📈</span>
            Inflation
          </div>
          <div className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
            <span className="mr-2">👥</span>
            Employment
          </div>
          <div className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
            <span className="mr-2">💰</span>
            Interest Rates
          </div>
          <div className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
            <span className="mr-2">📊</span>
            Economic Growth
          </div>
          <div className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
            <span className="mr-2">💱</span>
            Exchange Rates
          </div>
          <div className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
            <span className="mr-2">🏠</span>
            Housing
          </div>
          <div className="text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md flex items-center cursor-pointer">
            <span className="mr-2">💳</span>
            Consumer Spending
          </div>
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Data provided by Federal Reserve Economic Data (FRED)
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Economic Indicators Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time economic data from the Federal Reserve Economic Data (FRED) system
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CPIChart />
          <LaborStatsChart />
          <InterestRatesChart />
          <InterestRates3MonthChart />
        </div>
      </div>
    </div>
  );
}