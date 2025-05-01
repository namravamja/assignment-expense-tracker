"use client";

import React, { useState, useEffect } from "react";
import {
  useAddBudgetMutation,
  useDeleteBudgetMutation,
  useGetBudgetQuery,
} from "@/app/lib/Budget";
import { useGetTransactionsQuery } from "@/app/lib/Transactions";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetTable from "../components/budget/BudgetTable";
import BudgetComparisonChart from "../components/budget/BudgetComparisonChart";
import BudgetUsageSummary from "../components/budget/BudgetUsageSummary";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { ComparisonData } from "@/types/budget";

// Define expected types
type Transaction = {
  amount: number;
  date: string;
  type: "income" | "expense";
  description: string;
  category: string;
  _id?: string;
};

type BudgetType = {
  _id: string;
  category: string;
  maxAmount: number;
};

const Categories = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  const { data: budgets, isLoading: budgetsLoading } =
    useGetBudgetQuery(undefined);
  const { data: transactions, isLoading: transactionsLoading } =
    useGetTransactionsQuery(undefined);
  const [addBudget] = useAddBudgetMutation();
  const [deleteBudget] = useDeleteBudgetMutation();

  useEffect(() => {
    if (budgets && transactions) {
      const expensesByCategory: Record<string, number> = {};

      (transactions as Transaction[]).forEach((transaction) => {
        if (transaction.type === "expense") {
          const category = transaction.category;
          expensesByCategory[category] =
            (expensesByCategory[category] || 0) + Math.abs(transaction.amount);
        }
      });

      const budgetsArray: BudgetType[] = Array.isArray(budgets)
        ? budgets
        : Array.isArray(budgets?.data)
        ? budgets.data
        : [];

      const comparison: ComparisonData[] = budgetsArray.map((budget) => {
        const actualExpense = expensesByCategory[budget.category] || 0;
        const remaining = budget.maxAmount - actualExpense;
        const percentUsed =
          budget.maxAmount > 0
            ? Math.min(
                100,
                Math.round((actualExpense / budget.maxAmount) * 100)
              )
            : 0;

        return {
          category:
            budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
          budget: budget.maxAmount,
          actual: actualExpense,
          remaining,
          percentUsed,
        };
      });

      setComparisonData(comparison);
    }
  }, [budgets, transactions]);

  const handleAddBudget = async (category: string, amount: string) => {
    try {
      await addBudget({
        category,
        maxAmount: parseFloat(amount),
      }).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to add budget:", error);
      return false;
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget({ id: budgetId }).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to delete budget:", error);
      return false;
    }
  };

  const isLoading = budgetsLoading || transactionsLoading;

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-10 items-start">
      <div className="space-y-6 w-96">
        <BudgetForm onSubmit={handleAddBudget} />

        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
            <CardDescription>Manage your budget categories</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetTable
              budgets={Array.isArray(budgets) ? budgets : budgets?.data || []}
              isLoading={budgetsLoading}
              onDelete={handleDeleteBudget}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Budget vs Actual Expenses</CardTitle>
            <CardDescription>
              Comparison of your budgeted amounts with actual spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading data...</div>
            ) : comparisonData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-80">
                  <BudgetComparisonChart data={comparisonData} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Budget Usage Summary
                  </h3>
                  <BudgetUsageSummary data={comparisonData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No budget comparison data available. Please add budget
                categories and record your expenses.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;
