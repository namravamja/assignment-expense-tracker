"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, CATEGORIES } from "@/types/budget";

interface BudgetFormProps {
  onSubmit: (category: Category, amount: string) => Promise<boolean>;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(selectedCategory, amount);

      if (success) {
        setSelectedCategory("");
        setAmount("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-96 mx-auto rounded-2xl shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl">Budget Categories</CardTitle>
        <CardDescription>
          Set limits for each spending category below
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as Category)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Budget Amount
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>

        <CardFooter className="pt-5">
          <Button
            type="submit"
            disabled={!selectedCategory || !amount || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Adding..." : "Add Budget Category"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BudgetForm;
