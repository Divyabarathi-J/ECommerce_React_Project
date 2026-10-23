
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    wishlist: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload.product || action.payload;
      const quantity = Math.max(1, Number(action.payload.quantity) || 1);
      const existing = state.items.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
    },

    increase: (state, action) => {
      const item = state.items.find(
        (item) => String(item.id) === String(action.payload)
      );
      if (item) item.quantity++;
    },

    decrease: (state, action) => {
      const item = state.items.find(
        (item) => String(item.id) === String(action.payload)
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.items = state.items.filter(
            (product) => String(product.id) !== String(action.payload)
          );
        }
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item.id) !== String(action.payload)
      );
    },

    clearCart: (state) => {
      state.items = [];
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.wishlist.some(
        (item) => String(item.id) === String(product.id)
      );

      state.wishlist = exists
        ? state.wishlist.filter(
            (item) => String(item.id) !== String(product.id)
          )
        : [...state.wishlist, product];
    },

    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => String(item.id) !== String(action.payload)
      );
    },
  },
});

export const {
  addToCart,
  increase,
  decrease,
  removeFromCart,
  clearCart,
  toggleWishlist,
  removeFromWishlist,
} = cartSlice.actions;

export const selectTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

export const selectTotalPrice = (state) =>
  state.cart.items.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

export default cartSlice.reducer;
