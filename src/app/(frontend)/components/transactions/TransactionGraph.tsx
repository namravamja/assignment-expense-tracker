"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetTransactionsQuery } from "@/app/lib/Transactions";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";

// Transaction type - used for transactions data structure
type Transaction = {
  date: string;
  amount: number;
  type: "income" | "expense";
  category?: string; // Added category field
};

// Graph data type
interface GraphData {
  day: string;
  income: number;
  expense: number;
}

export default function TransactionGraph() {
  const { data, isLoading, isError } = useGetTransactionsQuery(undefined);

  // Use useMemo to prevent recreating this array on every render
  const transactions = useMemo(() => {
    return Array.isArray(data) ? data : data?.transactions ?? [];
  }, [data]);

  const [availableMonths, setAvailableMonths] = useState<
    { value: string; label: string }[]
  >([]);
  const [monthYear, setMonthYear] = useState<string>("");
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  // New states for category filtering
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Extract unique months and categories from transactions
  useEffect(() => {
    if (!Array.isArray(transactions)) return;

    // Process months
    const monthsMap = new Map<string, string>();
    // Process categories
    const categoriesSet = new Set<string>();

    transactions.forEach((transaction: Transaction) => {
      // Process month data
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;
      const label = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      monthsMap.set(value, label);

      // Process category data
      if (transaction.category) {
        categoriesSet.add(transaction.category);
      }
    });

    const monthsArray = Array.from(monthsMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([value, label]) => ({ value, label }));

    // Update available months if changed
    const monthsDifferent =
      availableMonths.length !== monthsArray.length ||
      availableMonths.some((m, i) => m.value !== monthsArray[i].value);

    if (monthsDifferent) {
      setAvailableMonths(monthsArray);
    }

    // Update available categories if changed
    const categoriesArray = Array.from(categoriesSet).sort();
    const categoriesDifferent =
      availableCategories.length !== categoriesArray.length ||
      availableCategories.some((c, i) => c !== categoriesArray[i]);

    if (categoriesDifferent) {
      setAvailableCategories(categoriesArray);
    }

    // Set default month if not set
    if (!monthYear && monthsArray.length > 0) {
      setMonthYear(monthsArray[0].value);
    }

    // Fallback to current month if no transactions
    if (transactions.length === 0) {
      const now = new Date();
      const defaultMonthYear = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!monthYear) {
        setMonthYear(defaultMonthYear);
        setAvailableMonths([
          {
            value: defaultMonthYear,
            label: now.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          },
        ]);
      }
    }
  }, [transactions, availableMonths, availableCategories, monthYear]);

  // Process graph data with category filtering
  useEffect(() => {
    if (!monthYear || transactions.length === 0) return;

    const [year, month] = monthYear.split("-").map(Number);

    // Filter transactions by selected month and category
    const filteredTransactions = transactions.filter(
      (transaction: Transaction) => {
        const date = new Date(transaction.date);
        const matchesMonth =
          date.getFullYear() === year && date.getMonth() === month - 1;

        // If "all" is selected or the transaction matches the selected category
        const matchesCategory =
          selectedCategory === "all" ||
          transaction.category === selectedCategory;

        return matchesMonth && matchesCategory;
      }
    );

    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData: { [key: string]: GraphData } = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = String(i).padStart(2, "0");
      dailyData[dayStr] = {
        day: dayStr,
        income: 0,
        expense: 0,
      };
    }

    filteredTransactions.forEach((t: Transaction) => {
      const day = String(new Date(t.date).getDate()).padStart(2, "0");
      if (t.type === "income") {
        dailyData[day].income += Math.abs(t.amount);
      } else {
        dailyData[day].expense += Math.abs(t.amount);
      }
    });

    const sorted = Object.values(dailyData).sort(
      (a, b) => parseInt(a.day) - parseInt(b.day)
    );

    const totalIn = sorted.reduce((sum, d) => sum + d.income, 0);
    const totalOut = sorted.reduce((sum, d) => sum + d.expense, 0);

    setGraphData(sorted);
    setTotalIncome(totalIn);
    setTotalExpense(totalOut);
  }, [monthYear, transactions, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        Loading transaction data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-8 text-red-500">
        Error loading transaction data
      </div>
    );
  }

  const remainingAmount = totalIncome - totalExpense;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="text-lg sm:text-xl">
            Transaction Overview
          </CardTitle>
          <CardDescription className="text-sm">
            View your income and expenses by month and category
          </CardDescription>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:gap-2 sm:space-y-0">
          <Select value={monthYear} onValueChange={setMonthYear}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {selectedCategory !== "all" && (
          <div className="mb-4">
            <Badge variant="outline" className="text-sm">
              Filtered by: {selectedCategory}
            </Badge>
          </div>
        )}

        <div className="h-60 sm:h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graphData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: "0.75rem" }}
                tickCount={graphData.length > 15 ? 5 : undefined} // Show fewer ticks on small screens
              />
              <YAxis
                tickFormatter={(value) =>
                  value === 0
                    ? "0"
                    : value >= 1000
                    ? `${(value / 1000).toFixed(1)}k`
                    : value
                }
                tick={{ fontSize: "0.75rem" }}
                width={40}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: string) => `Day ${label}`}
                contentStyle={{ fontSize: "0.875rem" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "0.75rem", paddingTop: "5px" }}
                iconSize={12}
              />
              <Bar dataKey="income" name="Income" fill="#4ade80" />
              <Bar dataKey="expense" name="Expense" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Summary Section */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-lg bg-green-50 p-3 md:p-4">
            <div className="text-xs md:text-sm font-medium text-green-800">
              Total Income
            </div>
            <div className="mt-1 text-lg md:text-2xl font-bold text-green-700">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-3 md:p-4">
            <div className="text-xs md:text-sm font-medium text-red-800">
              Total Expenses
            </div>
            <div className="mt-1 text-lg md:text-2xl font-bold text-red-700">
              {formatCurrency(totalExpense)}
            </div>
          </div>
          <div
            className={`rounded-lg p-3 md:p-4 ${
              remainingAmount >= 0 ? "bg-blue-50" : "bg-amber-50"
            }`}
          >
            <div
              className={`text-xs md:text-sm font-medium ${
                remainingAmount >= 0 ? "text-blue-800" : "text-amber-800"
              }`}
            >
              Remaining Amount
            </div>
            <div
              className={`mt-1 text-lg md:text-2xl font-bold ${
                remainingAmount >= 0 ? "text-blue-700" : "text-amber-700"
              }`}
            >
              {formatCurrency(remainingAmount)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
