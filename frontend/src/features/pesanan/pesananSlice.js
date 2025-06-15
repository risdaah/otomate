import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch pesanan by supplier
export const fetchPesananBySupplier = createAsyncThunk(
  'pesanan/fetchBySupplier',
  async (id_supplier, thunkAPI) => {
    console.log("📡 CALL API: fetchPesananBySupplier with ID:", id_supplier);
    try {
      const response = await axios.get(`http://localhost:5000/api/pesanan-detail/${id_supplier}`);
      console.log("✅ API RESPONSE:", response.data);
      return response.data; // Pastikan ini adalah array
    } catch (error) {
      console.error("❌ API ERROR:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch');
    }
  }
);

// Accept pesanan
export const acceptPesanan = createAsyncThunk(
  'pesanan/accept',
  async (id_pesanan, thunkAPI) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/invoice/${id_pesanan}/acceptPesanan`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to accept');
    }
  }
);

// Reject pesanan
export const rejectPesanan = createAsyncThunk(
  'pesanan/reject',
  async (id_pesanan, thunkAPI) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/invoice/${id_pesanan}/rejectPesanan`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to reject');
    }
  }
);

const pesananSlice = createSlice({
  name: 'pesanan',
  initialState: {
    pesananList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPesananBySupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPesananBySupplier.fulfilled, (state, action) => {
        console.log("🎯 SET pesananList to:", action.payload); // Tambahan log
        state.loading = false;
        state.pesananList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPesananBySupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch pesanan';
      })

      // Accept
      .addCase(acceptPesanan.fulfilled, (state, action) => {
        const index = state.pesananList.findIndex(p => p.id_pesanan === action.payload.id_pesanan);
        if (index !== -1) {
          state.pesananList[index] = action.payload;
        }
      })

      // Reject
      .addCase(rejectPesanan.fulfilled, (state, action) => {
        const index = state.pesananList.findIndex(p => p.id_pesanan === action.payload.id_pesanan);
        if (index !== -1) {
          state.pesananList[index] = action.payload;
        }
      });
  },
});

export default pesananSlice.reducer;
