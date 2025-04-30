import { configureStore } from "@reduxjs/toolkit";
import { transactionsApi } from "./Transactions";
// Add other API slices as needed

export const makeStore = () =>
  configureStore({
    reducer: {
      [transactionsApi.reducerPath]: transactionsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(transactionsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
