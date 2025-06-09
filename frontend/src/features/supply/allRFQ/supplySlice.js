import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getSupplysContent = createAsyncThunk('/supplys/content', async () => {
	const response = await axios.get('https://reqres.in/api/users?page=1', {})
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
            state.supplys = action.payload.data;
            state.isLoading = false;
        },
        [getSupplysContent.rejected]: (state) => {
            state.isLoading = false;
        }
    }
});

export const { addNewSupply, deleteSupply, editSupply } = supplysSlice.actions;

export default supplysSlice.reducer;

