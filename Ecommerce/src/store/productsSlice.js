
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const categories = [
  { name: "All", value: "all" },
  { name: "Men", value: "men" },
  { name: "Women", value: "women" },
  { name: "Beauty", value: "beauty" },
  { name: "Fragrances", value: "fragrances" },
  { name: "Watches", value: "watches" },
  { name: "Bags", value: "bags" },
  { name: "Jewellery", value: "jewellery" },
  { name: "Sunglasses", value: "sunglasses" },
];

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=0");

      if (!response.ok) {
        throw new Error(`Products API returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.products)) {
        throw new Error("The API response does not contain a products array");
      }

      return data.products.filter(
        (product) =>
          product.id &&
          product.title &&
          (product.thumbnail || product.images?.some(Boolean))
      );
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to connect to the products API"
      );
    }
  }
);

export const matchesCategory = (product, category) => {
  const c = (product.category || "").toLowerCase();
  const title = (product.title || "").toLowerCase();
  const description = (product.description || "").toLowerCase();
  const text = `${title} ${description} ${c}`;

  if (category === "all") return true;

  if (category === "men") {
    return c.startsWith("mens-") ||
      /\b(men|mens|male)\b/.test(text);
  }

  if (category === "women") {
    return c.startsWith("womens-") ||
      ["tops", "womens-dresses", "womens-shoes"].includes(c) ||
      /\b(women|womens|female)\b/.test(text);
  }

  if (category === "watches") return c.includes("watches");
  if (category === "bags") return c.includes("bags");
  if (category === "jewellery") return c.includes("jewellery");
  if (category === "sunglasses") return c.includes("sunglasses");

  return c === category;
};

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Unable to load products";
      });
  },
});

export default productsSlice.reducer;
