import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  DailySet50list: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  DailySet50Data: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  DailySet50Image: [],
  ImageStatus: "",
  isImageFetching: false,
  isImageSuccess: false,
  isImageError: false,
  ImageErrorMessage: "",


  DailySet50DataSearch: [],
  isDataSearchStatus: "",
  isDataSearchFetching: false,
  isDataSearchSuccess: false,
  isDataSearchError: false,
  dataSearchErrorMessage: "",

  insertDailySet50status: "",
  isInsertDailySet50Fetching: false,
  isInsertDailySet50Success: false,
  isInsertDailySet50Error: false,
  insertDailySet50ErrorMessage: "",

  updateDailySet50status: "",
  isUpdateDailySet50Fetching: false,
  isUpdateDailySet50Success: false,
  isUpdateDailySet50Error: false,
  updateDailySet50ErrorMessage: "",

  deleteDailySet50status: "",
  isDeleteDailySet50Fetching: false,
  isDeleteDailySet50Success: false,
  isDeleteDailySet50Error: false,
  deleteDailySet50ErrorMessage: "",

  Watchlist: [],
  isWatchlistFetching: false,
  isWatchlistSuccess: false,
  isWatchlistError: false
};

export const getDailySet50list = createAsyncThunk(
  "/daily-set50-aecs",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/daily-set50-aecs`)
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

export const getDailySet50Search = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}`)
      .get()
      .json((response: any) => response);
  }
);


export const getDailySet50Newly = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}&type=n`)
      .get()
      .json((response: any) => response);
  }
);

export const getDailySet50ById = createAsyncThunk(
  "/todays-top-picks/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-set50-aecs/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const updateDailySet50Image: any = createAsyncThunk(
  "/daily-set50-aecs/upload/id",
  async ({ token, id, newPayload }: any) => {
    return await baseService
      .url(`${api}/daily-set50-aecs/upload/${id}`)
      .post({ ...newPayload })
      .json((response: any) => response);
  }
);

export const insertDailySet50 = createAsyncThunk(
  "/daily-set50-aecs/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/daily-set50-aecs`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDailySet50 = createAsyncThunk(
  "/daily-set50-aecs/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/daily-set50-aecs/update`)
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

export const deleteDailySet50 = createAsyncThunk(
  "/daily-set50-aecs/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/daily-set50-aecs/delete/${id}`)
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

export const DailySet50listSlice: any = createSlice({
  name: "DailySet50list",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDailySet50list.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getDailySet50list.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.DailySet50list = action.payload;
    }),
    builder.addCase(getDailySet50list.rejected, (state, action: any) => {
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
    builder.addCase(getDailySet50Search.pending, (state, action) => {
      state.isDataSearchFetching = true;
      state.isDataSearchSuccess = false;
      state.isDataSearchStatus = "Loading...";
    }),
    builder.addCase(getDailySet50Search.fulfilled, (state, action) => {
      state.isDataSearchStatus = "Success";
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = true;
      state.DailySet50DataSearch = action.payload;
    }),
    builder.addCase(getDailySet50Search.rejected, (state, action: any) => {
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = false;
      state.isDataError = true;
      state.isDataSearchStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailySet50Image.pending, (state, action) => {
      state.isImageFetching = true;
      state.isImageSuccess = false;
      state.ImageStatus = "Loading...";
    }),
    builder.addCase(updateDailySet50Image.fulfilled, (state, action) => {
      state.ImageStatus = "Success";
      state.isImageFetching = false;
      state.isImageSuccess = true;
      state.DailySet50Image = action.payload;
    }),
    builder.addCase(updateDailySet50Image.rejected, (state, action: any) => {
      state.isImageFetching = false;
      state.isImageSuccess = false;
      state.isImageError = true;
      state.ImageStatus = "Error";
      state.ImageErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getDailySet50ById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getDailySet50ById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.DailySet50Data = action.payload;
    }),
    builder.addCase(getDailySet50ById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertDailySet50.pending, (state, action) => {
      state.isInsertDailySet50Fetching = true;
      state.isInsertDailySet50Success = false;
      state.insertDailySet50status = "Loading...";
    }),
    builder.addCase(insertDailySet50.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertDailySet50status = "Success";
        state.isInsertDailySet50Fetching = false;
        state.isInsertDailySet50Success = true;
      } else {
        state.isInsertDailySet50Fetching = false;
        state.isInsertDailySet50Success = false;
        state.isInsertDailySet50Error = true;
        state.insertDailySet50status = "Error";
        state.insertDailySet50ErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertDailySet50.rejected, (state, action: any) => {
      state.isInsertDailySet50Fetching = false;
      state.isInsertDailySet50Success = false;
      state.isInsertDailySet50Error = true;
      state.insertDailySet50status = "Error";
      state.insertDailySet50ErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailySet50.pending, (state, action) => {
      state.isUpdateDailySet50Fetching = true;
      state.isUpdateDailySet50Success = false;
      state.updateDailySet50status = "Loading...";
    }),
    builder.addCase(updateDailySet50.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDailySet50status = "Success";
        state.isUpdateDailySet50Fetching = false;
        state.isUpdateDailySet50Success = true;
      } else {
        state.isUpdateDailySet50Fetching = false;
        state.isUpdateDailySet50Success = false;
        state.isUpdateDailySet50Error = true;
        state.updateDailySet50status = "Error";
        state.updateDailySet50ErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDailySet50.rejected, (state, action: any) => {
      state.isUpdateDailySet50Fetching = false;
      state.isUpdateDailySet50Success = false;
      state.isUpdateDailySet50Error = true;
      state.updateDailySet50status = "Error";
      state.updateDailySet50ErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDailySet50.pending, (state, action) => {
      state.isDeleteDailySet50Fetching = true;
      state.isDeleteDailySet50Success = false;
      state.deleteDailySet50status = "Loading...";
    }),
    builder.addCase(deleteDailySet50.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDailySet50status = "Success";
        state.isDeleteDailySet50Fetching = false;
        state.isDeleteDailySet50Success = true;
      } else {
        state.isDeleteDailySet50Fetching = false;
        state.isDeleteDailySet50Success = false;
        state.isDeleteDailySet50Error = true;
        state.deleteDailySet50status = "Error";
        state.deleteDailySet50ErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDailySet50.rejected, (state, action: any) => {
      state.isDeleteDailySet50Fetching = false;
      state.isDeleteDailySet50Success = false;
      state.isDeleteDailySet50Error = true;
      state.deleteDailySet50status = "Error";
      state.deleteDailySet50ErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const DailySet50listSelector = (state: any) => state.DailySet50list;
export const { clearState } = DailySet50listSlice.actions;
export default DailySet50listSlice.reducer;
