import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
  }),
  tagTypes: ["Budget"],

  endpoints: (builder) => ({
    getBudget: builder.query({
      query: () => "/Budget/Show",
      providesTags: ["Budget"],
    }),

    addBudget: builder.mutation({
      query: (credentials) => ({
        url: "/Budget/Add",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Budget"],
    }),

    deleteBudget: builder.mutation({
      query: (credentials) => ({
        url: `/Budget/Delete`,
        method: "DELETE",
        body: credentials,
      }),
      invalidatesTags: ["Budget"],
    }),
  }),
});

export const {
  useGetBudgetQuery,
  useAddBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApi;
