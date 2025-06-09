import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getCategorysContent = createAsyncThunk('/categorys/content', async () => {
	const response = await axios.get('https://reqres.in/api/users?page=1', {})
	return response.data;
})

export const categorySlice = createSlice({
    name: 'Category',
    initialState: {
        isLoading: false,
        categorys: []
    },
    
    reducers: {
        addNewCategory: (state, action) => {
            const { newCategoryObj } = action.payload;
            state.categorys = [...state.categorys, newCategoryObj];
        },

        deleteCategory: (state, action) => {
            const { index } = action.payload;
            state.categorys.splice(index, 1);
        },

        editCategory: (state, action) => {
            const { index, updatedCategoryObj } = action.payload;
            state.categorys[index] = { ...state.categorys[index], ...updatedCategoryObj };
        }
    },

    extraReducers: {
        [getCategorysContent.pending]: (state) => {
            state.isLoading = true;
        },
        [getCategorysContent.fulfilled]: (state, action) => {
            state.categorys = action.payload.data;
            state.isLoading = false;
        },
        [getCategorysContent.rejected]: (state) => {
            state.isLoading = false;
        }
    }
});

export const { addNewCategory, deleteCategory, editCategory } = categorySlice.actions;

export default categorySlice.reducer;

