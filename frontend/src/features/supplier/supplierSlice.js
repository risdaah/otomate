import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ubah jika beda
  withCredentials: true, // jika pakai cookie auth
});

// Async Thunks
export const getSuppliersContent = createAsyncThunk(
  'Supplier/getSupplierContent',
  async () => {
    console.log('Thunk getSupplierContent started');
    const response = await api.get('/supplier');
    console.log('API response:', response);
    return response.data;
  }
);

export const suppliersSlice = createSlice({
    name: 'Supplier',
    initialState: {
        isLoading: false,
        suppliers: []
    },
    
    reducers: {
        addNewSupplier: (state, action) => {
            const { newSupplierObj } = action.payload;
            state.suppliers = [...state.suppliers, newSupplierObj];
        },

        deleteSupplier: (state, action) => {
            const { index } = action.payload;
            state.suppliers.splice(index, 1);
        },

        editSupplier: (state, action) => {
            const { index, updatedSupplierObj } = action.payload;
            state.suppliers[index] = { ...state.suppliers[index], ...updatedSupplierObj };
        }
    },

    extraReducers: (builder) => {
    builder
        .addCase(getSuppliersContent.pending, (state) => {
        state.isLoading = true;
        })
        .addCase(getSuppliersContent.fulfilled, (state, action) => {
        console.log("Fulfilled Payload:", action.payload); // Debug
        state.suppliers = action.payload; // Assign the array directly
        state.isLoading = false;
        })
        .addCase(getSuppliersContent.rejected, (state) => {
        state.isLoading = false;
        });
    }

});

export const { addNewSupplier, deleteSupplier, editSupplier } = suppliersSlice.actions;

export default suppliersSlice.reducer;

