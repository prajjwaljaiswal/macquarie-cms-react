import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  TTPlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  TTPData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",


  TTPDataSearch: [],
  isDataSearchStatus: "",
  isDataSearchFetching: false,
  isDataSearchSuccess: false,
  isDataSearchError: false,
  dataSearchErrorMessage: "",

  insertTTPstatus: "",
  isInsertTTPFetching: false,
  isInsertTTPSuccess: false,
  isInsertTTPError: false,
  insertTTPErrorMessage: "",

  updateTTPstatus: "",
  isUpdateTTPFetching: false,
  isUpdateTTPSuccess: false,
  isUpdateTTPError: false,
  updateTTPErrorMessage: "",

  deleteTTPstatus: "",
  isDeleteTTPFetching: false,
  isDeleteTTPSuccess: false,
  isDeleteTTPError: false,
  deleteTTPErrorMessage: "",
};

export const getTTPlist = createAsyncThunk(
  "/todays-top-picks",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/todays-top-picks`)
      .get()
      .json((response: any) => {console.log(response); return response; });
  }
);

export const getTTPSearch = createAsyncThunk(
  "/power-search/symbol",
  async ({ token, ric }: any) => {
    return await baseService
      .url(`${api}/power-search/symbol?ric=${ric}`)
      .get()
      .json((response: any) => response);
  }
);

export const getTTPById = createAsyncThunk(
  "/todays-top-picks/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/todays-top-picks/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertTTP = createAsyncThunk(
  "/todays-top-picks/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/todays-top-picks`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateTTP = createAsyncThunk(
  "/todays-top-picks/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/todays-top-picks/update`)
      .post({ ...payload })
      .json((response: any) =>  {
        console.log(response);
       return response;} )
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteTTP = createAsyncThunk(
  "/todays-top-picks/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/todays-top-picks/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const TTPlistSlice: any = createSlice({
  name: "TTPlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getTTPlist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getTTPlist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.TTPlist = action.payload;
    }),
    builder.addCase(getTTPlist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getTTPSearch.pending, (state, action) => {
      state.isDataSearchFetching = true;
      state.isDataSearchSuccess = false;
      state.isDataSearchStatus = "Loading...";
    }),
    builder.addCase(getTTPSearch.fulfilled, (state, action) => {
      state.isDataSearchStatus = "Success";
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = true;
      state.TTPDataSearch = action.payload;
    }),
    builder.addCase(getTTPSearch.rejected, (state, action: any) => {
      state.isDataSearchFetching = false;
      state.isDataSearchSuccess = false;
      state.isDataError = true;
      state.isDataSearchStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getTTPById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getTTPById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.TTPData = action.payload;
    }),
    builder.addCase(getTTPById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertTTP.pending, (state, action) => {
      state.isInsertTTPFetching = true;
      state.isInsertTTPSuccess = false;
      state.insertTTPstatus = "Loading...";
    }),
    builder.addCase(insertTTP.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertTTPstatus = "Success";
        state.isInsertTTPFetching = false;
        state.isInsertTTPSuccess = true;
      } else {
        state.isInsertTTPFetching = false;
        state.isInsertTTPSuccess = false;
        state.isInsertTTPError = true;
        state.insertTTPstatus = "Error";
        state.insertTTPErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertTTP.rejected, (state, action: any) => {
      state.isInsertTTPFetching = false;
      state.isInsertTTPSuccess = false;
      state.isInsertTTPError = true;
      state.insertTTPstatus = "Error";
      state.insertTTPErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateTTP.pending, (state, action) => {
      state.isUpdateTTPFetching = true;
      state.isUpdateTTPSuccess = false;
      state.updateTTPstatus = "Loading...";
    }),
    builder.addCase(updateTTP.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateTTPstatus = "Success";
        state.isUpdateTTPFetching = false;
        state.isUpdateTTPSuccess = true;
      } else {
        state.isUpdateTTPFetching = false;
        state.isUpdateTTPSuccess = false;
        state.isUpdateTTPError = true;
        state.updateTTPstatus = "Error";
        state.updateTTPErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateTTP.rejected, (state, action: any) => {
      state.isUpdateTTPFetching = false;
      state.isUpdateTTPSuccess = false;
      state.isUpdateTTPError = true;
      state.updateTTPstatus = "Error";
      state.updateTTPErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteTTP.pending, (state, action) => {
      state.isDeleteTTPFetching = true;
      state.isDeleteTTPSuccess = false;
      state.deleteTTPstatus = "Loading...";
    }),
    builder.addCase(deleteTTP.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteTTPstatus = "Success";
        state.isDeleteTTPFetching = false;
        state.isDeleteTTPSuccess = true;
      } else {
        state.isDeleteTTPFetching = false;
        state.isDeleteTTPSuccess = false;
        state.isDeleteTTPError = true;
        state.deleteTTPstatus = "Error";
        state.deleteTTPErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteTTP.rejected, (state, action: any) => {
      state.isDeleteTTPFetching = false;
      state.isDeleteTTPSuccess = false;
      state.isDeleteTTPError = true;
      state.deleteTTPstatus = "Error";
      state.deleteTTPErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const TTPlistSelector = (state: any) => state.TTPlist;
export const { clearState } = TTPlistSlice.actions;
export default TTPlistSlice.reducer;
