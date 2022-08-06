import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  MarketCommentarylist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  MarketCommentaryData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertMarketCommentarystatus: "",
  isInsertMarketCommentaryFetching: false,
  isInsertMarketCommentarySuccess: false,
  isInsertMarketCommentaryError: false,
  insertMarketCommentaryErrorMessage: "",

  updateMarketCommentarystatus: "",
  isUpdateMarketCommentaryFetching: false,
  isUpdateMarketCommentarySuccess: false,
  isUpdateMarketCommentaryError: false,
  updateMarketCommentaryErrorMessage: "",

  deleteMarketCommentarystatus: "",
  isDeleteMarketCommentaryFetching: false,
  isDeleteMarketCommentarySuccess: false,
  isDeleteMarketCommentaryError: false,
  deleteMarketCommentaryErrorMessage: "",
};

export const getMarketCommentarylist = createAsyncThunk(
  "/market-commentary",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/market-commentary`)
      .get()
      .json((response: any) => response);
  }
);

export const getMarketCommentaryById = createAsyncThunk(
  "/market-commentary/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/market-commentary/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertMarketCommentary = createAsyncThunk(
  "/market-commentary/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/market-commentary`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateMarketCommentary = createAsyncThunk(
  "/market-commentary/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/market-commentary/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteMarketCommentary = createAsyncThunk(
  "/market-commentary/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/market-commentary/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const MarketCommentarylistSlice = createSlice({
  name: "MarketCommentarylist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getMarketCommentarylist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getMarketCommentarylist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.MarketCommentarylist = action.payload;
    }),
    builder.addCase(getMarketCommentarylist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getMarketCommentaryById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getMarketCommentaryById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.MarketCommentaryData = action.payload;
    }),
    builder.addCase(getMarketCommentaryById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertMarketCommentary.pending, (state, action) => {
      state.isInsertMarketCommentaryFetching = true;
      state.isInsertMarketCommentarySuccess = false;
      state.insertMarketCommentarystatus = "Loading...";
    }),
    builder.addCase(insertMarketCommentary.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertMarketCommentarystatus = "Success";
        state.isInsertMarketCommentaryFetching = false;
        state.isInsertMarketCommentarySuccess = true;
      } else {
        state.isInsertMarketCommentaryFetching = false;
        state.isInsertMarketCommentarySuccess = false;
        state.isInsertMarketCommentaryError = true;
        state.insertMarketCommentarystatus = "Error";
        state.insertMarketCommentaryErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertMarketCommentary.rejected, (state, action: any) => {
      state.isInsertMarketCommentaryFetching = false;
      state.isInsertMarketCommentarySuccess = false;
      state.isInsertMarketCommentaryError = true;
      state.insertMarketCommentarystatus = "Error";
      state.insertMarketCommentaryErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateMarketCommentary.pending, (state, action) => {
      state.isUpdateMarketCommentaryFetching = true;
      state.isUpdateMarketCommentarySuccess = false;
      state.updateMarketCommentarystatus = "Loading...";
    }),
    builder.addCase(updateMarketCommentary.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateMarketCommentarystatus = "Success";
        state.isUpdateMarketCommentaryFetching = false;
        state.isUpdateMarketCommentarySuccess = true;
      } else {
        state.isUpdateMarketCommentaryFetching = false;
        state.isUpdateMarketCommentarySuccess = false;
        state.isUpdateMarketCommentaryError = true;
        state.updateMarketCommentarystatus = "Error";
        state.updateMarketCommentaryErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateMarketCommentary.rejected, (state, action: any) => {
      state.isUpdateMarketCommentaryFetching = false;
      state.isUpdateMarketCommentarySuccess = false;
      state.isUpdateMarketCommentaryError = true;
      state.updateMarketCommentarystatus = "Error";
      state.updateMarketCommentaryErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteMarketCommentary.pending, (state, action) => {
      state.isDeleteMarketCommentaryFetching = true;
      state.isDeleteMarketCommentarySuccess = false;
      state.deleteMarketCommentarystatus = "Loading...";
    }),
    builder.addCase(deleteMarketCommentary.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteMarketCommentarystatus = "Success";
        state.isDeleteMarketCommentaryFetching = false;
        state.isDeleteMarketCommentarySuccess = true;
      } else {
        state.isDeleteMarketCommentaryFetching = false;
        state.isDeleteMarketCommentarySuccess = false;
        state.isDeleteMarketCommentaryError = true;
        state.deleteMarketCommentarystatus = "Error";
        state.deleteMarketCommentaryErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteMarketCommentary.rejected, (state, action: any) => {
      state.isDeleteMarketCommentaryFetching = false;
      state.isDeleteMarketCommentarySuccess = false;
      state.isDeleteMarketCommentaryError = true;
      state.deleteMarketCommentarystatus = "Error";
      state.deleteMarketCommentaryErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const MarketCommentarylistSelector = (state: any) => state.MarketCommentarylist;
export const { clearState } = MarketCommentarylistSlice.actions;
export default MarketCommentarylistSlice.reducer;
