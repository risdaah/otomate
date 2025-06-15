import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ubah jika beda
  withCredentials: true, // jika pakai cookie auth
});

// get all
export const getUsersContent = createAsyncThunk(
  'People/getUsersContent',
  async () => {
    console.log('Thunk getUsersContent started');
    const response = await api.get('/supplier-user');
    console.log('API response:', response);
    return response.data.data;
  }
);

// create
export const registerNewSupplier = createAsyncThunk(
  'People/registerNewSupplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await api.post('/register-supplier', supplierData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to register supplier' });
    }
  }
);

// update
export const updateSupplierUser = createAsyncThunk(
  'People/updateSupplierUser',
  async ({ id_user, data }) => {
    const response = await api.put(`/supplier/${id_user}`, data);
    return response.data;
  }
);


export const usersSlice = createSlice({
    name: 'User',
    initialState: {
        isLoading: false,
        users: []
    },
    
    reducers: {
        addNewUser: (state, action) => {
            const { newUserObj } = action.payload;
            state.users = [...state.users, newUserObj];
        },

        deleteUser: (state, action) => {
            const { index } = action.payload;
            state.users.splice(index, 1);
        },

        editUser: (state, action) => {
            const { index, updatedUserObj } = action.payload;
            state.users[index] = { ...state.users[index], ...updatedUserObj };
        }
    },

    extraReducers: {
    [getUsersContent.pending]: (state) => {
        state.isLoading = true;
    },
    [getUsersContent.fulfilled]: (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
    },
    [getUsersContent.rejected]: (state) => {
        state.isLoading = false;
    },

    // Tambahkan handler jika kamu mau update UI setelah tambah supplier
    [registerNewSupplier.fulfilled]: (state, action) => {
        state.users.push(action.payload); // Jika API mengembalikan data supplier baru
    }
    }

});

export const { addNewUser, deleteUser, editUser } = usersSlice.actions;

export default usersSlice.reducer;

