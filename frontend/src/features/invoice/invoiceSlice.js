import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInvoiceBySupplier = createAsyncThunk(
  'invoice/fetchInvoiceBySupplier',
  async (id_supplier, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoice-pesanan/${id_supplier}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoiceList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceBySupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceBySupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceList = action.payload.data || [];
      })
      .addCase(fetchInvoiceBySupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch invoice data';
      });
  },
});

export default invoiceSlice.reducer;
