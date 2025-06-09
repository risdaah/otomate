import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getSuppliersContent = createAsyncThunk('/suppliers/content', async () => {
	const response = await axios.get('https://reqres.in/api/users?page=1', {})
	return response.data;
})

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

    extraReducers: {
        [getSuppliersContent.pending]: (state) => {
            state.isLoading = true;
        },
        [getSuppliersContent.fulfilled]: (state, action) => {
            state.suppliers = action.payload.data;
            state.isLoading = false;
        },
        [getSuppliersContent.rejected]: (state) => {
            state.isLoading = false;
        }
    }
});

export const { addNewSupplier, deleteSupplier, editSupplier } = suppliersSlice.actions;

export default suppliersSlice.reducer;

