import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  IFlist: [],
  listStatus: "",
  isListFetching: false,
  isListSuccess: false,
  isListError: false,
  listErrorMessage: "",

  IFWarrants: [],
  warrantsStatus: "",
  isWarrantsFetching: false,
  isWarrantsSuccess: false,
  isWarrantsError: false,
  warrantsErrorMessage: "",

  updateIFstatus: "",
  isUpdateIFFetching: false,
  isUpdateIFSuccess: false,
  isUpdateIFError: false,
  updateIFErrorMessage: "",
};

export const getIFlist = createAsyncThunk(
  "/if/list",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/if/list`)
      .get()
      .json((response: any) => response);
  }
);

export const getIFWarrantslist = createAsyncThunk(
  "/if/warrants",
  async ({ token }: any) => {
    return await baseService
      .url(`${api}/if/warrants`)
      .get()
      .json((response: any) => response);
  }
);

export const updateIF = createAsyncThunk(
  "/if/update",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/if`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const IFlistSlice = createSlice({
  name: "IFlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getIFlist.pending, (state, action) => {
      state.isListFetching = true;
      state.isListSuccess = false;
      state.listStatus = "Loading...";
    }),
    builder.addCase(getIFlist.fulfilled, (state, action) => {
      state.listStatus = "Success";
      state.isListFetching = false;
      state.isListSuccess = true;
      state.IFlist = action.payload;
    }),
    builder.addCase(getIFlist.rejected, (state, action: any) => {
      state.isListFetching = false;
      state.isListSuccess = false;
      state.isListError = true;
      state.listStatus = "Error";
      state.listErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getIFWarrantslist.pending, (state, action) => {
      state.isWarrantsFetching = true;
      state.isWarrantsSuccess = false;
      state.warrantsStatus = "Loading...";
    }),
    builder.addCase(getIFWarrantslist.fulfilled, (state, action) => {
      state.warrantsStatus = "Success";
      state.isWarrantsFetching = false;
      state.isWarrantsSuccess = true;
      state.IFWarrants = action.payload;
    }),
    builder.addCase(getIFWarrantslist.rejected, (state, action: any) => {
      state.isWarrantsFetching = false;
      state.isWarrantsSuccess = false;
      state.isWarrantsError = true;
      state.warrantsStatus = "Error";
      state.warrantsErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateIF.pending, (state, action) => {
      state.isUpdateIFFetching = true;
      state.isUpdateIFSuccess = false;
      state.updateIFstatus = "Loading...";
    }),
    builder.addCase(updateIF.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateIFstatus = "Success";
        state.isUpdateIFFetching = false;
        state.isUpdateIFSuccess = true;
      } else {
        state.isUpdateIFFetching = false;
        state.isUpdateIFSuccess = false;
        state.isUpdateIFError = true;
        state.updateIFstatus = "Error";
        state.updateIFErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateIF.rejected, (state, action: any) => {
      state.isUpdateIFFetching = false;
      state.isUpdateIFSuccess = false;
      state.isUpdateIFError = true;
      state.updateIFstatus = "Error";
      state.updateIFErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const IFSelector = (state: any) => state.IFlist;
export const { clearState } = IFlistSlice.actions;
export default IFlistSlice.reducer;
