export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
  createdAt?: string;
  updatedAt?: string;
}