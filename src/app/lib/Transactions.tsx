import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Fetch the API URL dynamically from environment variables
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  tagTypes: ["Transactions"],

  endpoints: (builder) => ({
    // Fetch all transactions
    getTransactions: builder.query({
      query: () => "/Transactions/List",
      providesTags: ["Transactions"],
    }),

    // Add a new transaction
    addTransaction: builder.mutation({
      query: (credentials) => ({
        url: "/Transactions/Insert",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Transactions"],
    }),

    // Update an existing transaction
    updateTransaction: builder.mutation({
      query: (credentials) => ({
        url: `/Transactions/Update`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["Transactions"],
    }),

    // Delete a transaction
    deleteTransaction: builder.mutation({
      query: (credentials) => ({
        url: `/Transactions/Delete`,
        method: "DELETE",
        body: credentials,
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
