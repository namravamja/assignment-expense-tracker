"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Budget } from "@/types/budget";
import { formatCurrency } from "@/lib/formatters";

interface BudgetTableProps {
  budgets: Budget[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<boolean>;
}

const BudgetTable: React.FC<BudgetTableProps> = ({
  budgets,
  isLoading,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading budgets...</div>;
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No budget categories set. Add your first budget category above.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Budget Amount</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((budget) => (
          <TableRow key={budget._id}>
            <TableCell className="font-medium capitalize">
              {budget.category}
            </TableCell>
            <TableCell>{formatCurrency(budget.maxAmount)}</TableCell>
            <TableCell>
              {new Date(budget.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(budget._id)}
                disabled={deletingId === budget._id}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BudgetTable;
