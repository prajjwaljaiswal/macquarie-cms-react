import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  AllForeignIndexlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  AllForeignIndexData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertAllForeignIndexstatus: "",
  isInsertAllForeignIndexFetching: false,
  isInsertAllForeignIndexSuccess: false,
  isInsertAllForeignIndexError: false,
  insertAllForeignIndexErrorMessage: "",

  updateAllForeignIndexstatus: "",
  isUpdateAllForeignIndexFetching: false,
  isUpdateAllForeignIndexSuccess: false,
  isUpdateAllForeignIndexError: false,
  updateAllForeignIndexErrorMessage: "",

  deleteAllForeignIndexstatus: "",
  isDeleteAllForeignIndexFetching: false,
  isDeleteAllForeignIndexSuccess: false,
  isDeleteAllForeignIndexError: false,
  deleteAllForeignIndexErrorMessage: "",
};

export const getAllForeignIndexlist = createAsyncThunk(
  "/AllForeignIndex",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/AllForeignIndex`)
      .get()
      .json((response: any) => response);
  }
);

export const getAllForeignIndexById = createAsyncThunk(
  "/AllForeignIndex/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/AllForeignIndex/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertAllForeignIndex = createAsyncThunk(
  "/AllForeignIndex/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/AllForeignIndex`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateAllForeignIndex = createAsyncThunk(
  "/AllForeignIndex/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/AllForeignIndex/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteAllForeignIndex = createAsyncThunk(
  "/AllForeignIndex/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/AllForeignIndex/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const AllForeignIndexlistSlice = createSlice({
  name: "AllForeignIndexlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getAllForeignIndexlist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getAllForeignIndexlist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.AllForeignIndexlist = action.payload;
    }),
    builder.addCase(getAllForeignIndexlist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getAllForeignIndexById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getAllForeignIndexById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.AllForeignIndexData = action.payload;
    }),
    builder.addCase(getAllForeignIndexById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertAllForeignIndex.pending, (state, action) => {
      state.isInsertAllForeignIndexFetching = true;
      state.isInsertAllForeignIndexSuccess = false;
      state.insertAllForeignIndexstatus = "Loading...";
    }),
    builder.addCase(insertAllForeignIndex.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertAllForeignIndexstatus = "Success";
        state.isInsertAllForeignIndexFetching = false;
        state.isInsertAllForeignIndexSuccess = true;
      } else {
        state.isInsertAllForeignIndexFetching = false;
        state.isInsertAllForeignIndexSuccess = false;
        state.isInsertAllForeignIndexError = true;
        state.insertAllForeignIndexstatus = "Error";
        state.insertAllForeignIndexErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertAllForeignIndex.rejected, (state, action: any) => {
      state.isInsertAllForeignIndexFetching = false;
      state.isInsertAllForeignIndexSuccess = false;
      state.isInsertAllForeignIndexError = true;
      state.insertAllForeignIndexstatus = "Error";
      state.insertAllForeignIndexErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateAllForeignIndex.pending, (state, action) => {
      state.isUpdateAllForeignIndexFetching = true;
      state.isUpdateAllForeignIndexSuccess = false;
      state.updateAllForeignIndexstatus = "Loading...";
    }),
    builder.addCase(updateAllForeignIndex.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateAllForeignIndexstatus = "Success";
        state.isUpdateAllForeignIndexFetching = false;
        state.isUpdateAllForeignIndexSuccess = true;
      } else {
        state.isUpdateAllForeignIndexFetching = false;
        state.isUpdateAllForeignIndexSuccess = false;
        state.isUpdateAllForeignIndexError = true;
        state.updateAllForeignIndexstatus = "Error";
        state.updateAllForeignIndexErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateAllForeignIndex.rejected, (state, action: any) => {
      state.isUpdateAllForeignIndexFetching = false;
      state.isUpdateAllForeignIndexSuccess = false;
      state.isUpdateAllForeignIndexError = true;
      state.updateAllForeignIndexstatus = "Error";
      state.updateAllForeignIndexErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteAllForeignIndex.pending, (state, action) => {
      state.isDeleteAllForeignIndexFetching = true;
      state.isDeleteAllForeignIndexSuccess = false;
      state.deleteAllForeignIndexstatus = "Loading...";
    }),
    builder.addCase(deleteAllForeignIndex.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteAllForeignIndexstatus = "Success";
        state.isDeleteAllForeignIndexFetching = false;
        state.isDeleteAllForeignIndexSuccess = true;
      } else {
        state.isDeleteAllForeignIndexFetching = false;
        state.isDeleteAllForeignIndexSuccess = false;
        state.isDeleteAllForeignIndexError = true;
        state.deleteAllForeignIndexstatus = "Error";
        state.deleteAllForeignIndexErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteAllForeignIndex.rejected, (state, action: any) => {
      state.isDeleteAllForeignIndexFetching = false;
      state.isDeleteAllForeignIndexSuccess = false;
      state.isDeleteAllForeignIndexError = true;
      state.deleteAllForeignIndexstatus = "Error";
      state.deleteAllForeignIndexErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const AllForeignIndexlistSelector = (state: any) => state.AllForeignIndexlist;
export const { clearState } = AllForeignIndexlistSlice.actions;
export default AllForeignIndexlistSlice.reducer;
