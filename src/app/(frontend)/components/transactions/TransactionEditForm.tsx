import { Save, X, Loader2 } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatDateForInput } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionEditFormProps {
  formData: Transaction;
  setFormData: React.Dispatch<React.SetStateAction<Transaction | null>>;
  onCancel: () => void;
  onSave: () => Promise<void>;
  isUpdating: boolean;
}

const TransactionEditForm = ({
  formData,
  setFormData,
  onCancel,
  onSave,
  isUpdating,
}: TransactionEditFormProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Transaction
  ) => {
    if (field === "amount") {
      // Convert string to number for amount field
      setFormData({
        ...formData,
        [field]: parseFloat(e.target.value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Edit Transaction</CardTitle>

          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCancel}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="sr-only">Save</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange(e, "description")}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleInputChange(e, "amount")}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formatDateForInput(formData.date)}
            onChange={(e) => handleInputChange(e, "date")}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            defaultValue={formData.category}
            onValueChange={handleCategoryChange}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.category} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
              <SelectItem value="Investment">Investment</SelectItem>
              <SelectItem value="Savings">Savings</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionEditForm;
