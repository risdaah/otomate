import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// ✅ GET all produk
export const getProductsContent = createAsyncThunk('Product/getProductsContent', async () => {
  const response = await api.get('/produk');
  return response.data;
});

// ✅ POST: create produk baru ke backend
export const createNewProduct = createAsyncThunk('Product/createNewProduct', async (productData) => {
  const response = await api.post('/produk', productData);
  return response.data;
});

// ✅ GET: kategori, mobil, dan jenis stok
export const fetchKategori = createAsyncThunk('Product/fetchKategori', async () => {
  const res = await api.get('/kategori');
  return res.data;
});

// ✅ PUT: update produk ke backend
export const updateProduct = createAsyncThunk('Product/updateProduct', async ({ id, data }) => {
  const params = new URLSearchParams();
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      params.append(key, data[key]);
    }
  }
  const response = await api.put(`/produk/${id}`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
});

// ✅ DELETE produk
export const deleteProductAsync = createAsyncThunk('Product/deleteProductAsync', async (id) => {
  await api.delete(`/produk/${id}`);
  return id;
});

export const fetchMobil = createAsyncThunk('Product/fetchMobil', async () => {
  const res = await api.get('/mobil');
  return res.data;
});

export const fetchJenisStok = createAsyncThunk('Product/fetchJenisStok', async () => {
  const res = await api.get('/jenis-stok');
  return res.data;
});

export const productsSlice = createSlice({
  name: 'Product',
  initialState: {
    isLoading: false,
    products: [],
    kategoriList: [],
    mobilList: [],
    jenisStokList: []
  },

  reducers: {
    deleteProduct: (state, action) => {
      const { index } = action.payload;
      state.products.splice(index, 1);
    },
    editProduct: (state, action) => {
      const { index, updatedProductObj } = action.payload;
      state.products[index] = { ...state.products[index], ...updatedProductObj };
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ GET produk
      .addCase(getProductsContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsContent.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(getProductsContent.rejected, (state) => {
        state.isLoading = false;
      })

      // ✅ POST produk baru
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // ✅ Fetch kategori
      .addCase(fetchKategori.fulfilled, (state, action) => {
        state.kategoriList = action.payload;
      })

      // ✅ Fetch mobil
      .addCase(fetchMobil.fulfilled, (state, action) => {
        state.mobilList = action.payload;
      })

      // ✅ Fetch jenis stok
      .addCase(fetchJenisStok.fulfilled, (state, action) => {
        state.jenisStokList = action.payload;
      })
      
      // Update Produk
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.products.findIndex((p) => p.id_produk === updated.id_produk);
        if (index !== -1) {
          state.products[index] = updated;
        }
      })

      // Delete Produk
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        const id = action.payload;
        state.products = state.products.filter(p => p.id_produk !== id);
      })
      ;
  }
});

export const { deleteProduct, editProduct } = productsSlice.actions;
export default productsSlice.reducer;
