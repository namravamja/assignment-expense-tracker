"use client";

import { useState, type JSX } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// Define Transaction type
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

// Sample transaction data
const sampleTransactions: Transaction[] = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: -85.5,
    date: "2023-05-15",
    category: "Food",
  },
  {
    id: "2",
    description: "Salary Deposit",
    amount: 2500.0,
    date: "2023-05-01",
    category: "Income",
  },
  {
    id: "3",
    description: "Electric Bill",
    amount: -120.75,
    date: "2023-05-10",
    category: "Utilities",
  },
  {
    id: "4",
    description: "Freelance Payment",
    amount: 350.0,
    date: "2023-05-08",
    category: "Income",
  },
];

const Transactions = (): JSX.Element => {
  const router = useRouter();
  const [transactions, setTransactions] =
    useState<Transaction[]>(sampleTransactions);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const handleDelete = (id: string): void => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
    setDeleteDialogOpen(false);
  };

  const confirmDelete = (transaction: Transaction): void => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your recent transactions
          </p>
        </div>
        <Button
          onClick={() => router.push("/add-transaction")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {transaction.description}
                  </CardTitle>
                  <CardDescription>
                    {formatDate(transaction.date)}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/edit-transaction/${transaction.id}`)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => confirmDelete(transaction)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    transaction.category === "Income" ? "outline" : "secondary"
                  }
                >
                  {transaction.category}
                </Badge>
                <div className="flex items-center">
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownLeft className="mr-1 h-4 w-4 text-rose-500" />
                  )}
                  <span
                    className={
                      transaction.amount > 0
                        ? "text-emerald-600 font-medium"
                        : "text-rose-600 font-medium"
                    }
                  >
                    {formatAmount(transaction.amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {transactions.length === 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No transactions found</p>
            <Button
              onClick={() => router.push("/add-transaction")}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Add your first transaction
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction
              {transactionToDelete &&
                ` "${transactionToDelete.description}"`}{" "}
              from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                transactionToDelete && handleDelete(transactionToDelete.id)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transactions;
