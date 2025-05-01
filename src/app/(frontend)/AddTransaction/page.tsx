"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAddTransactionMutation } from "@/app/lib/Transactions";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

// Category options
const categories = [
  { value: "food", label: "Food" },
  { value: "housing", label: "Housing" },
  { value: "transportation", label: "Transportation" },
  { value: "utilities", label: "Utilities" },
  { value: "insurance", label: "Insurance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "entertainment", label: "Entertainment" },
  { value: "personal", label: "Personal" },
  { value: "education", label: "Education" },
  { value: "income", label: "Income" },
  { value: "other", label: "Other" },
];

function AddTransaction() {
  const router = useRouter();

  // Get current date for validation
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day for correct comparisons

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(today);
  const [category, setCategory] = useState("");
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );

  // Formatted date state
  const [formattedDate, setFormattedDate] = useState("");

  // RTK Query mutation hook
  const [addTransaction, { isLoading: isSubmitting }] =
    useAddTransactionMutation();

  // Form errors
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  // Update transaction type based on amount input
  useEffect(() => {
    if (amount) {
      const numAmount = parseFloat(amount);
      setTransactionType(numAmount < 0 ? "expense" : "income");
    }
  }, [amount]);

  // Format date on client side to prevent hydration mismatch
  useEffect(() => {
    if (date) {
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setFormattedDate(formatted);
    }
  }, [date]);

  // Function to check if a date is in the future
  const isFutureDate = (dateToCheck: Date): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to start of day
    return dateToCheck > currentDate;
  };

  // Form submission handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Simple validation
    const newErrors = {
      description: description ? "" : "Description is required",
      amount: amount ? "" : "Amount is required",
      category: category ? "" : "Category is required",
      date: isFutureDate(date) ? "Future dates are not allowed" : "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // Create transaction object
    const transaction = {
      description,
      amount: Number.parseFloat(amount),
      date: date.toISOString(), // Convert date to ISO string for API
      category,
      type: transactionType, // Add transaction type based on amount sign
    };

    try {
      // Use RTK Query mutation to send data
      await addTransaction(transaction).unwrap();

      // Show success notification with react-hot-toast
      toast.success("Transaction added successfully");

      // Navigate back to transactions list
      router.push("/Transactions");
    } catch (error) {
      // Handle error
      console.error("Failed to add transaction:", error);

      // Show error notification with react-hot-toast
      toast.error("Failed to add transaction. Please try again.");
    }
  }

  // Handle date selection with proper type handling and future date validation
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);

      // Clear date error if valid date selected
      if (isFutureDate(selectedDate)) {
        setErrors((prev) => ({
          ...prev,
          date: "Future dates are not allowed",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          date: "",
        }));
      }
    }
  };

  // Handle amount change with sign detection
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add Transaction</h1>
        <p className="text-muted-foreground">Create a new transaction record</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Enter the details of your transaction below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Grocery shopping"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                A brief description of the transaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount
                  {amount && (
                    <Badge
                      className="ml-2"
                      variant={
                        transactionType === "income" ? "default" : "destructive"
                      }
                    >
                      {transactionType === "income" ? "Income" : "Expense"}
                    </Badge>
                  )}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Use negative values (e.g., -50.00) for expenses, positive
                  values for income.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${
                        !formattedDate ? "text-muted-foreground" : ""
                      }`}
                    >
                      {formattedDate || <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      disabled={(dateToDisable) => {
                        return isFutureDate(dateToDisable);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Future dates are not allowed.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Select the category that best describes this transaction.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/Transactions")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddTransaction;
