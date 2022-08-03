import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  stockCodeList: [],
  stockCodeStatus: "",
  isStockCodeFetching: false,
  isStockCodeSuccess: false,
  isStockCodeError: false,
  stockCodeErrorMessage: "",

  underlyingsList: [],
  underlyingsStatus: "",
  isUnderlyingsFetching: false,
  isUnderlyingsSuccess: false,
  isUnderlyingsError: false,
  underlyingsErrorMessage: "",

  warrantsList: [],
  warrantsStatus: "",
  isWarrantsFetching: false,
  isWarrantsSuccess: false,
  isWarrantsError: false,
  warrantsErrorMessage: "",

  stockCodeUpdateStatus: "",
  isStockCodeUpdateFetching: false,
  isStockCodeUpdateSuccess: false,
  isStockCodeUpdateError: false,
  stockCodeUpdateErrorMessage: "",
};

const objToQueryString = (obj: any) => {
  const keyValuePairs = [];
  for (let i = 0; i < Object.keys(obj).length; i += 1) {
    const paramToEncode: any = Object.values(obj)[i] || "";
    if (Object.values(obj)[i]) {
      keyValuePairs.push(
        `${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(
          paramToEncode
        )}`
      );
    }
  }
  return keyValuePairs.join("&");
};

export const getStockCodeList = createAsyncThunk(
  "/power-search",
  async (
    { token, ticker, dsply_name, limit = 100, skip = 0 }: any,
    { rejectWithValue, fulfillWithValue }
  ) => {
    const query: any = {
      limit,
      skip,
    };

    if (ticker) {
      query.ticker = ticker;
    }
    if (dsply_name) {
      query.dsply_name = dsply_name;
    }
    try {
      const result = await baseService
        .url(`${api}/power-search?${objToQueryString(query)}`)
        .get()
        .json();
      return fulfillWithValue(result);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const getUnderlyings = createAsyncThunk(
  "/power-search/underlying",
  async ({ token }: any) => {
    return await baseService.url(`${api}/power-search/underlying`).get().json();
  }
);

export const getWarrants = createAsyncThunk(
  "/power-search/warrants",
  async ({ token }: any) => {
    return await baseService.url(`${api}/power-search/warrants`).get().json();
  }
);

export const updateStockCodeList = createAsyncThunk(
  "/hotlist/:id",
  async (
    { token, ric, payload }: any,
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const res = await baseService
        .url(`${api}/hotlist/update/${ric}`)
        .post({ ...payload })
        .json();

      return fulfillWithValue(res);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const stockCodeSlice = createSlice({
  name: "stockCodeList",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getStockCodeList.pending, (state, action) => {
      state.isStockCodeFetching = true;
      state.isStockCodeSuccess = false;
      state.stockCodeStatus = "Loading...";
    }),
    builder.addCase(getStockCodeList.fulfilled, (state, action: any) => {
      if (Array.isArray(action?.payload)) {
        state.stockCodeStatus = "Success";
        state.isStockCodeFetching = false;
        state.isStockCodeSuccess = true;
        state.stockCodeList = action.payload;
      } else {
        state.isStockCodeFetching = false;
        state.isStockCodeSuccess = false;
        state.isStockCodeError = true;
        state.stockCodeStatus = "Error";
        state.stockCodeErrorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(getStockCodeList.rejected, (state, action: any) => {
      state.isStockCodeFetching = false;
      state.isStockCodeSuccess = false;
      state.isStockCodeError = true;
      state.stockCodeStatus = "Error";
      state.stockCodeErrorMessage = action?.payload?.message;
    }),
    builder.addCase(getUnderlyings.pending, (state, action) => {
      state.isUnderlyingsFetching = true;
      state.isUnderlyingsSuccess = false;
      state.underlyingsStatus = "Loading...";
    }),
    builder.addCase(getUnderlyings.fulfilled, (state, action: any) => {
      if (Array.isArray(action?.payload)) {
        state.underlyingsStatus = "Success";
        state.isUnderlyingsFetching = false;
        state.isUnderlyingsSuccess = true;
        state.underlyingsList = action.payload;
      } else {
        state.isUnderlyingsFetching = false;
        state.isUnderlyingsSuccess = false;
        state.isUnderlyingsError = true;
        state.underlyingsStatus = "Error";
        state.underlyingsErrorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(getUnderlyings.rejected, (state, action: any) => {
      state.isUnderlyingsFetching = false;
      state.isUnderlyingsSuccess = false;
      state.isUnderlyingsError = true;
      state.underlyingsStatus = "Error";
      state.underlyingsErrorMessage = action?.payload?.message;
    }),
    builder.addCase(getWarrants.pending, (state, action) => {
      state.isWarrantsFetching = true;
      state.isWarrantsSuccess = false;
      state.warrantsStatus = "Loading...";
    }),
    builder.addCase(getWarrants.fulfilled, (state, action: any) => {
      if (Array.isArray(action?.payload)) {
        state.warrantsStatus = "Success";
        state.isWarrantsFetching = false;
        state.isWarrantsSuccess = true;
        state.warrantsList = action.payload;
      } else {
        state.isWarrantsFetching = false;
        state.isWarrantsSuccess = false;
        state.isWarrantsError = true;
        state.warrantsStatus = "Error";
        state.warrantsErrorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(getWarrants.rejected, (state, action: any) => {
      state.isWarrantsFetching = false;
      state.isWarrantsSuccess = false;
      state.isWarrantsError = true;
      state.warrantsStatus = "Error";
      state.warrantsErrorMessage = action?.payload?.message;
    }),
    builder.addCase(updateStockCodeList.pending, (state, action) => {
      state.isStockCodeUpdateFetching = true;
      state.isStockCodeUpdateSuccess = false;
      state.stockCodeUpdateStatus = "Loading...";
    }),
    builder.addCase(updateStockCodeList.fulfilled, (state, action) => {
      if (action?.payload?.success) {
        state.stockCodeUpdateStatus = "Success";
        state.isStockCodeUpdateFetching = false;
        state.isStockCodeUpdateSuccess = true;
      } else {
        state.isStockCodeUpdateFetching = false;
        state.isStockCodeUpdateSuccess = false;
        state.stockCodeUpdateStatus = "Error";
        state.stockCodeUpdateErrorMessage = action?.payload?.message;
        state.isStockCodeUpdateError = true;
      }
    }),
    builder.addCase(updateStockCodeList.rejected, (state, action: any) => {
      state.isStockCodeUpdateFetching = false;
      state.isStockCodeUpdateSuccess = false;
      state.stockCodeUpdateStatus = "Error";
      state.stockCodeUpdateErrorMessage = action?.payload?.message;
      state.isStockCodeUpdateError = true;
    }),
  ],
});

export const stockCodeSelector = (state: any) => state.stockCodeList;
export const { clearState } = stockCodeSlice.actions;
export default stockCodeSlice.reducer;
