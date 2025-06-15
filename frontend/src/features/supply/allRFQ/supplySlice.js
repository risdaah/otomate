import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ganti kalau beda
  withCredentials: true, // kalau pakai cookie auth
});

export const getSupplysContent = createAsyncThunk('Supply/getSupplysContent', async () => {
	console.log('Thunk getSupplysContent started');
	const response = await api.get('/pesanan-detail');
	console.log('API response:', response);
	return response.data;
})

export const supplysSlice = createSlice({
    name: 'Supply',
    initialState: {
        isLoading: false,
        supplys: []
    },
    
    reducers: {
        addNewSupply: (state, action) => {
            const { newSupplyObj } = action.payload;
            state.supplys = [...state.supplys, newSupplyObj];
        },

        deleteSupply: (state, action) => {
            const { index } = action.payload;
            state.supplys.splice(index, 1);
        },

        editSupply: (state, action) => {
            const { index, updatedSupplyObj } = action.payload;
            state.supplys[index] = { ...state.supplys[index], ...updatedSupplyObj };
        }
    },

    extraReducers: {
        [getSupplysContent.pending]: (state) => {
            state.isLoading = true;
        },
        [getSupplysContent.fulfilled]: (state, action) => {
            state.supplys = action.payload; // ✅ Langsung assign array-nya
            state.isLoading = false;
        },
        [getSupplysContent.rejected]: (state) => {
            state.isLoading = false;
        }
    }
});

export const { addNewSupply, deleteSupply, editSupply } = supplysSlice.actions;

export default supplysSlice.reducer;

