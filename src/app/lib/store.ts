import { configureStore } from "@reduxjs/toolkit";
import { transactionsApi } from "./Transactions";
import { budgetApi } from "./Budget";

export const makeStore = () =>
  configureStore({
    reducer: {
      [transactionsApi.reducerPath]: transactionsApi.reducer,
      [budgetApi.reducerPath]: budgetApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        transactionsApi.middleware,
        budgetApi.middleware
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
