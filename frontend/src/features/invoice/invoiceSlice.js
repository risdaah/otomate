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

export const acceptPesanan = createAsyncThunk(
  'invoice/acceptPesanan',
  async (id_pesanan, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/invoice/${id_pesanan}/acceptPesanan`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadInvoicePDF = (id_invoice) => async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/invoice/${id_invoice}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
      })
      .addCase(acceptPesanan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptPesanan.fulfilled, (state, action) => {
        state.loading = false;
        // Update the invoiceList to reflect the accepted pesanan status
        const updatedPesanan = action.payload;
        state.invoiceList = state.invoiceList.map((invoice) =>
          invoice.id_pesanan === updatedPesanan.id_pesanan ? { ...invoice, Pesanan: updatedPesanan } : invoice
        );
      })
      .addCase(acceptPesanan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to accept pesanan';
      });
  },
});

export default invoiceSlice.reducer;
