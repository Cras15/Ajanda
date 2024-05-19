import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk to fetch appointments
export const fetchDates = createAsyncThunk(
  'dates/fetchDates',
  async () => {
    const response = await window.db?.readAllDate();
    return response;
  }
);

// Slice
const dateSlice = createSlice({
  name: 'dates',
  initialState: {
    dates: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDates.pending, (state) => {
        state.status = 'loading';
        console.log("loading")
      })
      .addCase(fetchDates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dates = action.payload;
        console.log(action.payload);
      })
      .addCase(fetchDates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dateSlice.reducer;