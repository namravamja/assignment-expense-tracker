"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";
import TransactionView from "./TransactionView";
import TransactionEditForm from "./TransactionEditForm";
import { useUpdateTransactionMutation } from "@/app/lib/Transactions";

interface TransactionCardProps {
  transaction: Transaction;
  onDeleteRequest: (transaction: Transaction) => void;
  onUpdateSuccess: () => void;
  onUpdateError: (error: any) => void;
}

const TransactionCard = ({
  transaction,
  onDeleteRequest,
  onUpdateSuccess,
  onUpdateError,
}: TransactionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Transaction | null>(null);

  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();

  const handleEdit = () => {
    setIsEditing(true);
    setEditFormData({ ...transaction });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleSaveEdit = async () => {
    if (editFormData) {
      try {
        await updateTransaction(editFormData).unwrap();
        onUpdateSuccess();
        setIsEditing(false);
        setEditFormData(null);
      } catch (error) {
        onUpdateError(error);
      }
    }
  };

  return (
    <div
      className={`overflow-hidden ${isEditing ? "z-10" : ""}`}
      style={{
        height: isEditing ? "auto" : "175px",
        position: isEditing ? "relative" : "static",
      }}
    >
      {isEditing && editFormData ? (
        <TransactionEditForm
          formData={editFormData}
          setFormData={setEditFormData}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
          isUpdating={isUpdating}
        />
      ) : (
        <TransactionView
          transaction={transaction}
          onEdit={handleEdit}
          onDelete={() => onDeleteRequest(transaction)}
        />
      )}
    </div>
  );
};

export default TransactionCard;
