import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  updatePasswordStatus: "",
  isUpdatePasswordFetching: false,
  isUpdatePasswordSuccess: false,
  isUpdatePasswordError: false,
  updatePasswordErrorMessage: "",
};

export const updatePassword = createAsyncThunk(
  "/users/password",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/users/password`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => e);
  }
);

export const PasswordlistSlice = createSlice({
  name: "Passwordlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(updatePassword.pending, (state, action) => {
      state.isUpdatePasswordFetching = true;
      state.isUpdatePasswordSuccess = false;
      state.updatePasswordStatus = "Loading...";
    }),
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      console.log("ful", action);
      if (action?.payload?.SUCCESS) {
        state.updatePasswordStatus = "Success";
        state.isUpdatePasswordFetching = false;
        state.isUpdatePasswordSuccess = true;
      } else {
        state.isUpdatePasswordFetching = false;
        state.isUpdatePasswordSuccess = false;
        state.isUpdatePasswordError = true;
        state.updatePasswordStatus = "Error";
        state.updatePasswordErrorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(updatePassword.rejected, (state, action: any) => {
      console.log("rej", action);

      state.isUpdatePasswordFetching = false;
      state.isUpdatePasswordSuccess = false;
      state.isUpdatePasswordError = true;
      state.updatePasswordStatus = "Error";
      state.updatePasswordErrorMessage = action?.payload?.message;
    }),
  ],
});

export const PasswordlistSelector = (state: any) => state.Passwordlist;
export const { clearState } = PasswordlistSlice.actions;
export default PasswordlistSlice.reducer;
