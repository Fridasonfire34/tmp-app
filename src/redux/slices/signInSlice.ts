import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

import type {RootState} from '../store';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface signInState {
  loading: boolean;
  error: string;
  user: User;
}

export const fetchUser = createAsyncThunk(
  'signIn/fetchUser',
  async ({email, password}: {email: string; password: string}) => {
    const response = await axios('http://localhost:3000/api/auth/sign-in', {
      headers: {
        email,
        password,
      },
    });
    return response.data as User;
  },
);

const initialState: signInState = {
  loading: false,
  error: '',
  user: {} as User,
};

export const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '';
      });
  },
});

export const {} = signInSlice.actions;

export const selectLoading = (state: RootState) => state.signIn.loading;
export const selectError = (state: RootState) => state.signIn.error;
export const selectUser = (state: RootState) => state.signIn.user;

export default signInSlice.reducer;
