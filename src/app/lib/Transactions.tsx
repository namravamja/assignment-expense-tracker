import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api", // Change if needed
  }),
  tagTypes: ["Transactions"],

  endpoints: (builder) => ({
    // Fetch all transactions
    getTransactions: builder.query({
      query: () => "/transactions",
      providesTags: ["Transactions"],
    }),

    // Add a new transaction
    addTransaction: builder.mutation({
      query: (newTransaction) => ({
        url: "/transactions",
        method: "POST",
        body: newTransaction,
      }),
      invalidatesTags: ["Transactions"],
    }),

    // Update an existing transaction
    updateTransaction: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `/transactions/${id}`,
        method: "PUT",
        body: updatedFields,
      }),
      invalidatesTags: ["Transactions"],
    }),

    // Delete a transaction
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi;
