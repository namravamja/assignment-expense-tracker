import { Save, X, Loader2 } from "lucide-react";
import { Transaction, TransactionType } from "@/types/transaction";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      // Always store amount as positive in the form
      // The actual sign will be applied on save based on transaction type
      setFormData({
        ...formData,
        [field]: Math.abs(parseFloat(e.target.value) || 0),
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

  const handleTypeChange = (value: TransactionType) => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  // Display absolute amount for editing
  const displayAmount = Math.abs(formData.amount);

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
          <Label>Transaction Type</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value: any) =>
              handleTypeChange(value as TransactionType)
            }
            className="flex space-x-4"
            disabled={isUpdating}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="income" />
              <Label htmlFor="income" className="cursor-pointer">
                Income
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense" className="cursor-pointer">
                Expense
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={displayAmount}
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
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionEditForm;
