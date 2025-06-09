import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getProductsContent = createAsyncThunk('/products/content', async () => {
	const response = await axios.get('https://reqres.in/api/users?page=1', {})
	return response.data;
})

export const productsSlice = createSlice({
    name: 'Product',
    initialState: {
        isLoading: false,
        products: []
    },
    
    reducers: {
        addNewProduct: (state, action) => {
            const { newProductObj } = action.payload;
            state.products = [...state.products, newProductObj];
        },

        deleteProduct: (state, action) => {
            const { index } = action.payload;
            state.products.splice(index, 1);
        },

        editProduct: (state, action) => {
            const { index, updatedProductObj } = action.payload;
            state.products[index] = { ...state.products[index], ...updatedProductObj };
        }
    },

    extraReducers: {
        [getProductsContent.pending]: (state) => {
            state.isLoading = true;
        },
        [getProductsContent.fulfilled]: (state, action) => {
            state.products = action.payload.data;
            state.isLoading = false;
        },
        [getProductsContent.rejected]: (state) => {
            state.isLoading = false;
        }
    }
});

export const { addNewProduct, deleteProduct, editProduct } = productsSlice.actions;

export default productsSlice.reducer;

