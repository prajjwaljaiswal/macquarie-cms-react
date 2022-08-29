import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  DailySingleStocklist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  DailySingleStockData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  DailySingleStockImage: [],
  ImageStatus: "",
  isImageFetching: false,
  isImageSuccess: false,
  isImageError: false,
  ImageErrorMessage: "",


  DailySingleStockDataSearch: [],
  isDataSearchStatus: "",
  isDataSearchFetching: false,
  isDataSearchSuccess: false,
  isDataSearchError: false,
  dataSearchErrorMessage: "",

  insertDailySingleStockstatus: "",
  isInsertDailySingleStockFetching: false,
  isInsertDailySingleStockSuccess: false,
  isInsertDailySingleStockError: false,
  insertDailySingleStockErrorMessage: "",

  updateDailySingleStockstatus: "",
  isUpdateDailySingleStockFetching: false,
  isUpdateDailySingleStockSuccess: false,
  isUpdateDailySingleStockError: false,
  updateDailySingleStockErrorMessage: "",

  deleteDailySingleStockstatus: "",
  isDeleteDailySingleStockFetching: false,
  isDeleteDailySingleStockSuccess: false,
  isDeleteDailySingleStockError: false,
  deleteDailySingleStockErrorMessage: "",

  Watchlist: [],
  isWatchlistFetching: false,
  isWatchlistSuccess: false,
  isWatchlistError: false
};

export const getDailySingleStocklist = createAsyncThunk(
  "/daily-single-stock",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/daily-single-stock`)
      .get()
      .json((response: any) => response);
  }
);

export const getWatchlist = createAsyncThunk(
  "/watchlist",
  async ({ token, payload }: { token: string, payload: any }) => {
    return await baseService
      .url(`${api}/watchlist`)
      .post({ ...payload })
      .json((response: any) => response);
  }
);

export const getDailySingleStockSearch = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}`)
      .get()
      .json((response: any) => response);
  }
);


export const getDailySingleStockNewly = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}&type=n`)
      .get()
      .json((response: any) => response);
  }
);

export const getDailySingleStockById = createAsyncThunk(
  "/todays-top-picks/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-single-stock/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const updateDailySingleStockImage: any = createAsyncThunk(
  "/daily-single-stock/upload/id",
  async ({ token, id, newPayload }: any) => {
    return await baseService
      .url(`${api}/daily-single-stock/upload/${id}`)
      .post({ ...newPayload })
      .json((response: any) => response);
  }
);

export const insertDailySingleStock = createAsyncThunk(
  "/daily-single-stock/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/daily-single-stock`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDailySingleStock = createAsyncThunk(
  "/daily-single-stock/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/daily-single-stock/update`)
      .post({ ...payload })
      .json((response: any) => {
        console.log(response);
        return response;
      })
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteDailySingleStock = createAsyncThunk(
  "/daily-single-stock/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-single-stock/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);


// Watchlist: [],
// isWatchlistFetching: false,
// isWatchlistSuccess: false,
// isWatchlistError: false

export const DailySingleStocklistSlice: any = createSlice({
  name: "DailySingleStocklist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDailySingleStocklist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getDailySingleStocklist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.DailySingleStocklist = action.payload;
    }),
    builder.addCase(getDailySingleStocklist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getWatchlist.pending, (state, action) => {
      state.isWatchlistFetching = true;
      state.isWatchlistSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getWatchlist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isWatchlistFetching = false;
      state.isWatchlistSuccess = true;
      state.Watchlist = action.payload;
    }),
    builder.addCase(getWatchlist.rejected, (state, action: any) => {
      state.isWatchlistFetching = false;
      state.isWatchlistSuccess = false;
      state.isWatchlistError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getDailySingleStockSearch.pending, (state, action) => {
      state.isDataSearchFetching = true;
      state.isDataSearchSuccess = false;
      state.isDataSearchStatus = "Loading...";
    }),
    builder.addCase(getDailySingleStockSearch.fulfilled, (state, action) => {
      state.isDataSearchStatus = "Success";
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = true;
      state.DailySingleStockDataSearch = action.payload;
    }),
    builder.addCase(getDailySingleStockSearch.rejected, (state, action: any) => {
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = false;
      state.isDataError = true;
      state.isDataSearchStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailySingleStockImage.pending, (state, action) => {
      state.isImageFetching = true;
      state.isImageSuccess = false;
      state.ImageStatus = "Loading...";
    }),
    builder.addCase(updateDailySingleStockImage.fulfilled, (state, action) => {
      state.ImageStatus = "Success";
      state.isImageFetching = false;
      state.isImageSuccess = true;
      state.DailySingleStockImage = action.payload;
    }),
    builder.addCase(updateDailySingleStockImage.rejected, (state, action: any) => {
      state.isImageFetching = false;
      state.isImageSuccess = false;
      state.isImageError = true;
      state.ImageStatus = "Error";
      state.ImageErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getDailySingleStockById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getDailySingleStockById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.DailySingleStockData = action.payload;
    }),
    builder.addCase(getDailySingleStockById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertDailySingleStock.pending, (state, action) => {
      state.isInsertDailySingleStockFetching = true;
      state.isInsertDailySingleStockSuccess = false;
      state.insertDailySingleStockstatus = "Loading...";
    }),
    builder.addCase(insertDailySingleStock.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertDailySingleStockstatus = "Success";
        state.isInsertDailySingleStockFetching = false;
        state.isInsertDailySingleStockSuccess = true;
      } else {
        state.isInsertDailySingleStockFetching = false;
        state.isInsertDailySingleStockSuccess = false;
        state.isInsertDailySingleStockError = true;
        state.insertDailySingleStockstatus = "Error";
        state.insertDailySingleStockErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertDailySingleStock.rejected, (state, action: any) => {
      state.isInsertDailySingleStockFetching = false;
      state.isInsertDailySingleStockSuccess = false;
      state.isInsertDailySingleStockError = true;
      state.insertDailySingleStockstatus = "Error";
      state.insertDailySingleStockErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailySingleStock.pending, (state, action) => {
      state.isUpdateDailySingleStockFetching = true;
      state.isUpdateDailySingleStockSuccess = false;
      state.updateDailySingleStockstatus = "Loading...";
    }),
    builder.addCase(updateDailySingleStock.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDailySingleStockstatus = "Success";
        state.isUpdateDailySingleStockFetching = false;
        state.isUpdateDailySingleStockSuccess = true;
      } else {
        state.isUpdateDailySingleStockFetching = false;
        state.isUpdateDailySingleStockSuccess = false;
        state.isUpdateDailySingleStockError = true;
        state.updateDailySingleStockstatus = "Error";
        state.updateDailySingleStockErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDailySingleStock.rejected, (state, action: any) => {
      state.isUpdateDailySingleStockFetching = false;
      state.isUpdateDailySingleStockSuccess = false;
      state.isUpdateDailySingleStockError = true;
      state.updateDailySingleStockstatus = "Error";
      state.updateDailySingleStockErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDailySingleStock.pending, (state, action) => {
      state.isDeleteDailySingleStockFetching = true;
      state.isDeleteDailySingleStockSuccess = false;
      state.deleteDailySingleStockstatus = "Loading...";
    }),
    builder.addCase(deleteDailySingleStock.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDailySingleStockstatus = "Success";
        state.isDeleteDailySingleStockFetching = false;
        state.isDeleteDailySingleStockSuccess = true;
      } else {
        state.isDeleteDailySingleStockFetching = false;
        state.isDeleteDailySingleStockSuccess = false;
        state.isDeleteDailySingleStockError = true;
        state.deleteDailySingleStockstatus = "Error";
        state.deleteDailySingleStockErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDailySingleStock.rejected, (state, action: any) => {
      state.isDeleteDailySingleStockFetching = false;
      state.isDeleteDailySingleStockSuccess = false;
      state.isDeleteDailySingleStockError = true;
      state.deleteDailySingleStockstatus = "Error";
      state.deleteDailySingleStockErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const DailySingleStocklistSelector = (state: any) => state.DailySingleStocklist;
export const { clearState } = DailySingleStocklistSlice.actions;
export default DailySingleStocklistSlice.reducer;
