import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSingleJHA = createAsyncThunk(
  'singleJHA/fetchSingleJHA',
  async (jhaId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/jha/${jhaId}`);
      return response.data.jha;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const singleJHASlice = createSlice({
  name: 'singleJHA',
  initialState: {
    jha: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleJHA.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSingleJHA.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jha = action.payload;
      })
      .addCase(fetchSingleJHA.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default singleJHASlice.reducer;
