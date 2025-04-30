"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetTransactionsQuery } from "@/app/lib/Transactions";
import TransactionCard from "@/app/(frontend)/components/transactions/TransactionCard";
import DeleteTransactionDialog from "@/app/(frontend)/components/transactions/DeleteTransactionDialog";
import { Transaction } from "@/types/transaction";

const TransactionsPage = () => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  // RTK Query hook for fetching transactions
  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetTransactionsQuery(undefined);

  // Ensure transactions is always an array
  const transactions = Array.isArray(responseData)
    ? responseData
    : responseData?.transactions || responseData?.data || [];

  const handleDeleteRequest = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    toast.success("Transaction deleted successfully");
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleDeleteError = (error: any) => {
    toast.error("Failed to delete transaction");
    console.error("Delete error:", error);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader />

      {Array.isArray(transactions) && transactions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((transaction: Transaction) => (
            <TransactionCard
              key={
                transaction._id ||
                `transaction-${Math.random().toString(36).substr(2, 9)}`
              }
              transaction={transaction}
              onDeleteRequest={handleDeleteRequest}
              onUpdateSuccess={() =>
                toast.success("Transaction updated successfully")
              }
              onUpdateError={(error) => {
                toast.error("Failed to update transaction");
                console.error("Update error:", error);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <DeleteTransactionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        transaction={transactionToDelete}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />
    </div>
  );
};

const PageHeader = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage your recent transactions
        </p>
      </div>
      <Button
        onClick={() => router.push("/AddTransaction")}
        className="gap-2 hover:cursor-pointer"
      >
        <Plus className="h-4 w-4" /> Add Transaction
      </Button>
    </div>
  );
};

const LoadingState = () => (
  <div className="container mx-auto py-6 flex justify-center items-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading transactions...</p>
    </div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="container mx-auto py-6">
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-destructive mb-4">Error loading transactions</p>
        <Button onClick={onRetry} className="gap-2">
          Try Again
        </Button>
      </CardContent>
    </Card>
  </div>
);

const EmptyState = () => {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground mb-4">No transactions found</p>
        <Button
          onClick={() => router.push("/AddTransaction")}
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Add your first transaction
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransactionsPage;
