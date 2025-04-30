import {
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatDate, formatAmount } from "@/lib/formatters";
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
import { Badge } from "@/components/ui/badge";

interface TransactionViewProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionView = ({
  transaction,
  onEdit,
  onDelete,
}: TransactionViewProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{transaction.description}</CardTitle>
            <CardDescription>{formatDate(transaction.date)}</CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
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
              transaction.category?.toLowerCase() === "income"
                ? "outline"
                : "secondary"
            }
          >
            {transaction.category || "Uncategorized"}
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
  );
};

export default TransactionView;
