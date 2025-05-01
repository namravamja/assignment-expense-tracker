"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComparisonData } from "@/types/budget";
import { formatCurrency } from "@/lib/formatters";

interface BudgetUsageSummaryProps {
  data: ComparisonData[];
}

const BudgetUsageSummary: React.FC<BudgetUsageSummaryProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Actual</TableHead>
          <TableHead>Remaining</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.category}>
            <TableCell className="font-medium">{item.category}</TableCell>
            <TableCell>{formatCurrency(item.budget)}</TableCell>
            <TableCell>{formatCurrency(item.actual)}</TableCell>
            <TableCell
              className={
                item.remaining < 0
                  ? "text-red-500 font-medium"
                  : "text-green-500"
              }
            >
              {formatCurrency(item.remaining)}
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      item.percentUsed >= 100
                        ? "bg-red-600"
                        : item.percentUsed > 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(100, item.percentUsed)}%`,
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-xs">{item.percentUsed}%</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BudgetUsageSummary;
