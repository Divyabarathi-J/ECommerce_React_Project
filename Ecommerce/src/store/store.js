
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const persistedCart = persistReducer(
  { key: "cart", storage, whitelist: ["items", "wishlist"] },
  cartReducer
);

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: persistedCart,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
