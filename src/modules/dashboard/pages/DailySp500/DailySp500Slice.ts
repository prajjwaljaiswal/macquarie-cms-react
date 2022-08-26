import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  DailySp500list: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  DailySp500Data: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  DailySp500Image: [],
  ImageStatus: "",
  isImageFetching: false,
  isImageSuccess: false,
  isImageError: false,
  ImageErrorMessage: "",


  DailySp500DataSearch: [],
  isDataSearchStatus: "",
  isDataSearchFetching: false,
  isDataSearchSuccess: false,
  isDataSearchError: false,
  dataSearchErrorMessage: "",

  insertDailySp500status: "",
  isInsertDailySp500Fetching: false,
  isInsertDailySp500Success: false,
  isInsertDailySp500Error: false,
  insertDailySp500ErrorMessage: "",

  updateDailySp500status: "",
  isUpdateDailySp500Fetching: false,
  isUpdateDailySp500Success: false,
  isUpdateDailySp500Error: false,
  updateDailySp500ErrorMessage: "",

  deleteDailySp500status: "",
  isDeleteDailySp500Fetching: false,
  isDeleteDailySp500Success: false,
  isDeleteDailySp500Error: false,
  deleteDailySp500ErrorMessage: "",

  Watchlist: [],
  isWatchlistFetching: false,
  isWatchlistSuccess: false,
  isWatchlistError: false
};

export const getDailySp500list = createAsyncThunk(
  "/daily-sp-500",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/daily-sp-500`)
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

export const getDailySp500Search = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}`)
      .get()
      .json((response: any) => response);
  }
);


export const getDailySp500Newly = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}&type=n`)
      .get()
      .json((response: any) => response);
  }
);

export const getDailySp500ById = createAsyncThunk(
  "/todays-top-picks/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-sp-500/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const updateDailySp500Image: any = createAsyncThunk(
  "/daily-sp-500/upload/id",
  async ({ token, id, newPayload }: any) => {
    return await baseService
      .url(`${api}/daily-sp-500/upload/${id}`)
      .post({ ...newPayload })
      .json((response: any) => response);
  }
);

export const insertDailySp500 = createAsyncThunk(
  "/daily-sp-500/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/daily-sp-500`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDailySp500 = createAsyncThunk(
  "/daily-sp-500/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/daily-sp-500/update`)
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

export const deleteDailySp500 = createAsyncThunk(
  "/daily-sp-500/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-sp-500/delete/${id}`)
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

export const DailySp500listSlice: any = createSlice({
  name: "DailySp500list",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDailySp500list.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getDailySp500list.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.DailySp500list = action.payload;
    }),
    builder.addCase(getDailySp500list.rejected, (state, action: any) => {
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
    builder.addCase(getDailySp500Search.pending, (state, action) => {
      state.isDataSearchFetching = true;
      state.isDataSearchSuccess = false;
      state.isDataSearchStatus = "Loading...";
    }),
    builder.addCase(getDailySp500Search.fulfilled, (state, action) => {
      state.isDataSearchStatus = "Success";
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = true;
      state.DailySp500DataSearch = action.payload;
    }),
    builder.addCase(getDailySp500Search.rejected, (state, action: any) => {
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = false;
      state.isDataError = true;
      state.isDataSearchStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailySp500Image.pending, (state, action) => {
      state.isImageFetching = true;
      state.isImageSuccess = false;
      state.ImageStatus = "Loading...";
    }),
    builder.addCase(updateDailySp500Image.fulfilled, (state, action) => {
      state.ImageStatus = "Success";
      state.isImageFetching = false;
      state.isImageSuccess = true;
      state.DailySp500Image = action.payload;
    }),
    builder.addCase(updateDailySp500Image.rejected, (state, action: any) => {
      state.isImageFetching = false;
      state.isImageSuccess = false;
      state.isImageError = true;
      state.ImageStatus = "Error";
      state.ImageErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getDailySp500ById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getDailySp500ById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.DailySp500Data = action.payload;
    }),
    builder.addCase(getDailySp500ById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertDailySp500.pending, (state, action) => {
      state.isInsertDailySp500Fetching = true;
      state.isInsertDailySp500Success = false;
      state.insertDailySp500status = "Loading...";
    }),
    builder.addCase(insertDailySp500.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertDailySp500status = "Success";
        state.isInsertDailySp500Fetching = false;
        state.isInsertDailySp500Success = true;
      } else {
        state.isInsertDailySp500Fetching = false;
        state.isInsertDailySp500Success = false;
        state.isInsertDailySp500Error = true;
        state.insertDailySp500status = "Error";
        state.insertDailySp500ErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertDailySp500.rejected, (state, action: any) => {
      state.isInsertDailySp500Fetching = false;
      state.isInsertDailySp500Success = false;
      state.isInsertDailySp500Error = true;
      state.insertDailySp500status = "Error";
      state.insertDailySp500ErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailySp500.pending, (state, action) => {
      state.isUpdateDailySp500Fetching = true;
      state.isUpdateDailySp500Success = false;
      state.updateDailySp500status = "Loading...";
    }),
    builder.addCase(updateDailySp500.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDailySp500status = "Success";
        state.isUpdateDailySp500Fetching = false;
        state.isUpdateDailySp500Success = true;
      } else {
        state.isUpdateDailySp500Fetching = false;
        state.isUpdateDailySp500Success = false;
        state.isUpdateDailySp500Error = true;
        state.updateDailySp500status = "Error";
        state.updateDailySp500ErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDailySp500.rejected, (state, action: any) => {
      state.isUpdateDailySp500Fetching = false;
      state.isUpdateDailySp500Success = false;
      state.isUpdateDailySp500Error = true;
      state.updateDailySp500status = "Error";
      state.updateDailySp500ErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDailySp500.pending, (state, action) => {
      state.isDeleteDailySp500Fetching = true;
      state.isDeleteDailySp500Success = false;
      state.deleteDailySp500status = "Loading...";
    }),
    builder.addCase(deleteDailySp500.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDailySp500status = "Success";
        state.isDeleteDailySp500Fetching = false;
        state.isDeleteDailySp500Success = true;
      } else {
        state.isDeleteDailySp500Fetching = false;
        state.isDeleteDailySp500Success = false;
        state.isDeleteDailySp500Error = true;
        state.deleteDailySp500status = "Error";
        state.deleteDailySp500ErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDailySp500.rejected, (state, action: any) => {
      state.isDeleteDailySp500Fetching = false;
      state.isDeleteDailySp500Success = false;
      state.isDeleteDailySp500Error = true;
      state.deleteDailySp500status = "Error";
      state.deleteDailySp500ErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const DailySp500listSelector = (state: any) => state.DailySp500list;
export const { clearState } = DailySp500listSlice.actions;
export default DailySp500listSlice.reducer;
