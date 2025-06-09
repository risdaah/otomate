import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getUsersContent = createAsyncThunk('/users/content', async () => {
	const response = await axios.get('https://reqres.in/api/users?page=1', {})
	return response.data;
})

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
            state.users = action.payload.data;
            state.isLoading = false;
        },
        [getUsersContent.rejected]: (state) => {
            state.isLoading = false;
        }
    }
});

export const { addNewUser, deleteUser, editUser } = usersSlice.actions;

export default usersSlice.reducer;

