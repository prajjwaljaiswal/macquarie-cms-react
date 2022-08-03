import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseService } from "../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";
const { networkInterfaces } = require('os');

const initialState = {
  token: sessionStorage.getItem("token"),
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

export const checkIP = createAsyncThunk(
  "/auth/checkip",
  async (
    args: { ipv4: string; },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const result = await baseService
        .url(`${api}/auth/checkip`)
        .post({ ...args })
        .json();
      return fulfillWithValue(result);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const getAuthToken = createAsyncThunk(
  "/auth/login",
  async (
    args: { username: string; password: string; ipv4: string; },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const result = await baseService
        .url(`${api}/auth/login`)
        .post({ ...args })
        .json();
      return fulfillWithValue(result);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getAuthToken.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getAuthToken.fulfilled, (state, action: any) => {
      if (action?.payload?.access_token) {
        state.status = "Success";
        state.isFetching = false;
        state.isSuccess = true;
        state.token = action.payload.access_token;
        state.errorMessage = action.payload.expire;
        sessionStorage.setItem("token", action.payload.access_token);
      } else {
        state.isFetching = false;
        state.isSuccess = false;
        state.isError = true;
        state.status = "Error";
        state.errorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(getAuthToken.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
  ],
});

export const loginSelector = (state: any) => state.login;
export const { clearState } = loginSlice.actions;
export default loginSlice.reducer;
