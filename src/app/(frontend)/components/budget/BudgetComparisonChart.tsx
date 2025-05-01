"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ComparisonData } from "@/types/budget";
import { formatCurrency } from "@/lib/formatters";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface BudgetComparisonChartProps {
  data: ComparisonData[];
}

const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({
  data,
}) => {
  // Custom tooltip for the chart
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{label}</p>
          <p className="text-blue-500">
            Budget: {formatCurrency(Number(payload[0].value))}
          </p>
          <p className="text-red-500">
            Actual: {formatCurrency(Number(payload[1].value))}
          </p>
          <p className="text-green-500">
            Remaining: {formatCurrency(Number(payload[2].value))}
          </p>
          <p className="text-gray-600">
            {Number(payload[1].value) > Number(payload[0].value)
              ? `${Math.round(
                  ((Number(payload[1].value) - Number(payload[0].value)) /
                    Number(payload[0].value)) *
                    100
                )}% over budget`
              : `${Math.round(
                  ((Number(payload[0].value) - Number(payload[1].value)) /
                    Number(payload[0].value)) *
                    100
                )}% under budget`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis
          tickFormatter={(value) =>
            value >= 1000 ? `${value / 1000}k` : `${value}`
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="budget" name="Budget" fill="#3b82f6" />
        <Bar dataKey="actual" name="Actual" fill="#ef4444" />
        <Bar dataKey="remaining" name="Remaining" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetComparisonChart;
