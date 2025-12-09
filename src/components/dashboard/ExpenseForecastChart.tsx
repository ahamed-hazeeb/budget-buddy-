import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { AdvancedExpenseForecast } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface ExpenseForecastChartProps {
  forecast?: AdvancedExpenseForecast;
  isLoading?: boolean;
}

const ExpenseForecastChart: React.FC<ExpenseForecastChartProps> = ({ forecast, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={24} />
          Advanced Expense Forecast
        </h3>
        <LoadingSpinner size="md" className="py-8" />
      </div>
    );
  }

  if (!forecast || !forecast.predictions || forecast.predictions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={24} />
          Advanced Expense Forecast
        </h3>
        <div className="text-center py-8">
          <AlertCircle className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-500">No forecast data available</p>
          <p className="text-sm text-slate-400 mt-1">
            Add at least 3 months of transactions to generate forecasts
          </p>
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = forecast.predictions.map((pred) => ({
    month: pred.month,
    expense: pred.predicted_expense,
    confidence: pred.confidence * 100,
    // Calculate confidence range
    upper: pred.predicted_expense * (1 + (1 - pred.confidence) * 0.2),
    lower: pred.predicted_expense * (1 - (1 - pred.confidence) * 0.2),
  }));

  // Calculate trend
  const firstExpense = forecast.predictions[0]?.predicted_expense || 0;
  const lastExpense = forecast.predictions[forecast.predictions.length - 1]?.predicted_expense || 0;
  const trendPercentage = firstExpense > 0 ? ((lastExpense - firstExpense) / firstExpense) * 100 : 0;
  const trend = trendPercentage > 5 ? 'increasing' : trendPercentage < -5 ? 'decreasing' : 'stable';

  const getTrendColor = () => {
    if (trend === 'increasing') return 'text-red-600';
    if (trend === 'decreasing') return 'text-green-600';
    return 'text-blue-600';
  };

  const getTrendIcon = () => {
    if (trend === 'increasing') return '📈';
    if (trend === 'decreasing') return '📉';
    return '➡️';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Advanced Expense Forecast
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTrendIcon()}</span>
            <div className="text-right">
              <p className="text-xs text-slate-500">Trend</p>
              <p className={`text-sm font-bold ${getTrendColor()}`}>
                {Math.abs(trendPercentage).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Chart */}
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'expense') return [`Rs. ${value.toLocaleString()}`, 'Predicted Expense'];
                  if (name === 'confidence') return [`${value.toFixed(1)}%`, 'Confidence'];
                  return [value, name];
                }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="line"
                wrapperStyle={{ fontSize: '12px' }}
              />
              {/* Confidence area */}
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="#93c5fd"
                fillOpacity={0.2}
                name="Confidence Range"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="#93c5fd"
                fillOpacity={0.2}
              />
              {/* Main forecast line */}
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                name="Predicted Expense"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-600 mb-1">Avg. Expense</p>
            <p className="text-lg font-bold text-blue-600">
              Rs. {(chartData.reduce((sum, d) => sum + d.expense, 0) / chartData.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-600 mb-1">Avg. Confidence</p>
            <p className="text-lg font-bold text-purple-600">
              {(chartData.reduce((sum, d) => sum + d.confidence, 0) / chartData.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-600 mb-1">Forecast Period</p>
            <p className="text-lg font-bold text-slate-700">
              {chartData.length} months
            </p>
          </div>
        </div>

        {/* Model accuracy */}
        {forecast.metadata?.accuracy && (
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Model Accuracy: <span className="font-semibold">{(forecast.metadata.accuracy * 100).toFixed(1)}%</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseForecastChart;
