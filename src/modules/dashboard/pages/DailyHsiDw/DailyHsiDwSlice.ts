import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  DailyHsiDwlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  DailyHsiDwData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  DailyHsiDwImage: [],
  ImageStatus: "",
  isImageFetching: false,
  isImageSuccess: false,
  isImageError: false,
  ImageErrorMessage: "",


  DailyHsiDwDataSearch: [],
  isDataSearchStatus: "",
  isDataSearchFetching: false,
  isDataSearchSuccess: false,
  isDataSearchError: false,
  dataSearchErrorMessage: "",

  insertDailyHsiDwstatus: "",
  isInsertDailyHsiDwFetching: false,
  isInsertDailyHsiDwSuccess: false,
  isInsertDailyHsiDwError: false,
  insertDailyHsiDwErrorMessage: "",

  updateDailyHsiDwstatus: "",
  isUpdateDailyHsiDwFetching: false,
  isUpdateDailyHsiDwSuccess: false,
  isUpdateDailyHsiDwError: false,
  updateDailyHsiDwErrorMessage: "",

  deleteDailyHsiDwstatus: "",
  isDeleteDailyHsiDwFetching: false,
  isDeleteDailyHsiDwSuccess: false,
  isDeleteDailyHsiDwError: false,
  deleteDailyHsiDwErrorMessage: "",

  Watchlist: [],
  isWatchlistFetching: false,
  isWatchlistSuccess: false,
  isWatchlistError: false
};

export const getDailyHsiDwlist = createAsyncThunk(
  "/daily-hsi-dw",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/daily-hsi-dw`)
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

export const getDailyHsiDwSearch = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}`)
      .get()
      .json((response: any) => response);
  }
);


export const getDailyHsiDwNewly = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}&type=n`)
      .get()
      .json((response: any) => response);
  }
);

export const getDailyHsiDwById = createAsyncThunk(
  "/todays-top-picks/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-hsi-dw/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const updateDailyHsiDwImage: any = createAsyncThunk(
  "/daily-hsi-dw/upload/id",
  async ({ token, id, newPayload }: any) => {
    return await baseService
      .url(`${api}/daily-hsi-dw/upload/${id}`)
      .post({ ...newPayload })
      .json((response: any) => response);
  }
);

export const insertDailyHsiDw = createAsyncThunk(
  "/daily-hsi-dw/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/daily-hsi-dw`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDailyHsiDw = createAsyncThunk(
  "/daily-hsi-dw/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/daily-hsi-dw/update`)
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

export const deleteDailyHsiDw = createAsyncThunk(
  "/daily-hsi-dw/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-hsi-dw/delete/${id}`)
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

export const DailyHsiDwlistSlice: any = createSlice({
  name: "DailyHsiDwlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDailyHsiDwlist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getDailyHsiDwlist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.DailyHsiDwlist = action.payload;
    }),
    builder.addCase(getDailyHsiDwlist.rejected, (state, action: any) => {
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
    builder.addCase(getDailyHsiDwSearch.pending, (state, action) => {
      state.isDataSearchFetching = true;
      state.isDataSearchSuccess = false;
      state.isDataSearchStatus = "Loading...";
    }),
    builder.addCase(getDailyHsiDwSearch.fulfilled, (state, action) => {
      state.isDataSearchStatus = "Success";
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = true;
      state.DailyHsiDwDataSearch = action.payload;
    }),
    builder.addCase(getDailyHsiDwSearch.rejected, (state, action: any) => {
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = false;
      state.isDataError = true;
      state.isDataSearchStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailyHsiDwImage.pending, (state, action) => {
      state.isImageFetching = true;
      state.isImageSuccess = false;
      state.ImageStatus = "Loading...";
    }),
    builder.addCase(updateDailyHsiDwImage.fulfilled, (state, action) => {
      state.ImageStatus = "Success";
      state.isImageFetching = false;
      state.isImageSuccess = true;
      state.DailyHsiDwImage = action.payload;
    }),
    builder.addCase(updateDailyHsiDwImage.rejected, (state, action: any) => {
      state.isImageFetching = false;
      state.isImageSuccess = false;
      state.isImageError = true;
      state.ImageStatus = "Error";
      state.ImageErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getDailyHsiDwById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getDailyHsiDwById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.DailyHsiDwData = action.payload;
    }),
    builder.addCase(getDailyHsiDwById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertDailyHsiDw.pending, (state, action) => {
      state.isInsertDailyHsiDwFetching = true;
      state.isInsertDailyHsiDwSuccess = false;
      state.insertDailyHsiDwstatus = "Loading...";
    }),
    builder.addCase(insertDailyHsiDw.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertDailyHsiDwstatus = "Success";
        state.isInsertDailyHsiDwFetching = false;
        state.isInsertDailyHsiDwSuccess = true;
      } else {
        state.isInsertDailyHsiDwFetching = false;
        state.isInsertDailyHsiDwSuccess = false;
        state.isInsertDailyHsiDwError = true;
        state.insertDailyHsiDwstatus = "Error";
        state.insertDailyHsiDwErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertDailyHsiDw.rejected, (state, action: any) => {
      state.isInsertDailyHsiDwFetching = false;
      state.isInsertDailyHsiDwSuccess = false;
      state.isInsertDailyHsiDwError = true;
      state.insertDailyHsiDwstatus = "Error";
      state.insertDailyHsiDwErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailyHsiDw.pending, (state, action) => {
      state.isUpdateDailyHsiDwFetching = true;
      state.isUpdateDailyHsiDwSuccess = false;
      state.updateDailyHsiDwstatus = "Loading...";
    }),
    builder.addCase(updateDailyHsiDw.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDailyHsiDwstatus = "Success";
        state.isUpdateDailyHsiDwFetching = false;
        state.isUpdateDailyHsiDwSuccess = true;
      } else {
        state.isUpdateDailyHsiDwFetching = false;
        state.isUpdateDailyHsiDwSuccess = false;
        state.isUpdateDailyHsiDwError = true;
        state.updateDailyHsiDwstatus = "Error";
        state.updateDailyHsiDwErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDailyHsiDw.rejected, (state, action: any) => {
      state.isUpdateDailyHsiDwFetching = false;
      state.isUpdateDailyHsiDwSuccess = false;
      state.isUpdateDailyHsiDwError = true;
      state.updateDailyHsiDwstatus = "Error";
      state.updateDailyHsiDwErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDailyHsiDw.pending, (state, action) => {
      state.isDeleteDailyHsiDwFetching = true;
      state.isDeleteDailyHsiDwSuccess = false;
      state.deleteDailyHsiDwstatus = "Loading...";
    }),
    builder.addCase(deleteDailyHsiDw.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDailyHsiDwstatus = "Success";
        state.isDeleteDailyHsiDwFetching = false;
        state.isDeleteDailyHsiDwSuccess = true;
      } else {
        state.isDeleteDailyHsiDwFetching = false;
        state.isDeleteDailyHsiDwSuccess = false;
        state.isDeleteDailyHsiDwError = true;
        state.deleteDailyHsiDwstatus = "Error";
        state.deleteDailyHsiDwErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDailyHsiDw.rejected, (state, action: any) => {
      state.isDeleteDailyHsiDwFetching = false;
      state.isDeleteDailyHsiDwSuccess = false;
      state.isDeleteDailyHsiDwError = true;
      state.deleteDailyHsiDwstatus = "Error";
      state.deleteDailyHsiDwErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const DailyHsiDwlistSelector = (state: any) => state.DailyHsiDwlist;
export const { clearState } = DailyHsiDwlistSlice.actions;
export default DailyHsiDwlistSlice.reducer;
