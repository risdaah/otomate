import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ubah jika beda
  withCredentials: true, // jika pakai cookie auth
});

// Async Thunks
export const getCategories = createAsyncThunk(
  'Category/getCategories',
  async () => {
    console.log('Thunk getCategories started');
    const response = await api.get('/kategori');
    console.log('API response:', response);
    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  'Category/createCategory',
  async (newCategoryObj, { rejectWithValue }) => {
    try {
      console.log('Thunk createCategory started');
      const response = await api.post('/kategori', newCategoryObj);
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Gagal menambahkan kategori');
    }
  }
);

export const editCategoryApi = createAsyncThunk(
  'Category/editCategoryApi',
  async (updatedCategoryObj, { rejectWithValue }) => {
    try {
      console.log('Thunk editCategoryApi started');
      const response = await api.put(`/kategori/${updatedCategoryObj.id}`, updatedCategoryObj);
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Gagal mengedit kategori');
    }
  }
);

export const deleteCategoryApi = createAsyncThunk('Category/deleteCategoryApi', async (id_kategori, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/kategori/${id_kategori}`)
    return { id_kategori }
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Gagal menghapus kategori')
  }
})

// Slice
const categorySlice = createSlice({
  name: 'Category',
  initialState: {
    isLoading: false,
    categories: [],
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action) => {
      const id = action.payload;
      state.categories = state.categories.filter(cat => cat.id !== id);
    },
    editCategoryLocal: (state, action) => {
      const updatedCategory = action.payload;
      const index = state.categories.findIndex(cat => cat.id === updatedCategory.id);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...updatedCategory };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })
      .addCase(getCategories.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(editCategoryApi.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.categories.findIndex(cat => cat.id === updated.id);
        if (index !== -1) {
          state.categories[index] = { ...state.categories[index], ...updated };
        }
      })
      .addCase(deleteCategoryApi.fulfilled, (state, action) => {
        const { id_kategori } = action.payload
        state.categorys = state.categorys.filter(cat => cat.id !== id_kategori)
      })
  },
});

export const { addCategory, deleteCategory, editCategoryLocal } = categorySlice.actions;

export default categorySlice.reducer;
