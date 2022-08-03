import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  MMBlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  MMBData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  titleData: "",
  titleStatus: "",
  isTitleFetching: false,
  isTitleSuccess: false,
  isTitleError: false,
  titleErrorMessage: "",

  insertMMBstatus: "",
  isInsertMMBFetching: false,
  isInsertMMBSuccess: false,
  isInsertMMBError: false,
  insertMMBErrorMessage: "",

  updateMMBstatus: "",
  isUpdateMMBFetching: false,
  isUpdateMMBSuccess: false,
  isUpdateMMBError: false,
  updateMMBErrorMessage: "",

  deleteMMBstatus: "",
  isDeleteMMBFetching: false,
  isDeleteMMBSuccess: false,
  isDeleteMMBError: false,
  deleteMMBErrorMessage: "",
};

export const getMMBList = createAsyncThunk(
  "/mmb/get",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/mmb`)
      .get()
      .json((response: any) => response);
  }
);

export const getMMBById = createAsyncThunk(
  "/mmb/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/mmb/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const getLatestTitle = createAsyncThunk(
  "/mmb/latest",
  async ({ token }: any) => {
    return await baseService
      .url(`${api}/mmb/latest`)
      .get()
      .json((response: any) => response);
  }
);

export const insertMMB = createAsyncThunk(
  "/mmb/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/mmb`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateMMB = createAsyncThunk(
  "/mmb/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/mmb/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteMMB = createAsyncThunk(
  "/mmb/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/mmb/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const MMBlistSlice = createSlice({
  name: "MMBlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getMMBList.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getMMBList.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.MMBlist = action.payload;
    }),
    builder.addCase(getMMBList.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getMMBById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getMMBById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.MMBData = action.payload;
    }),
    builder.addCase(getMMBById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getLatestTitle.pending, (state, action) => {
      state.isTitleFetching = true;
      state.isTitleSuccess = false;
      state.titleStatus = "Loading...";
    }),
    builder.addCase(getLatestTitle.fulfilled, (state, action) => {
      state.titleStatus = "Success";
      state.isTitleFetching = false;
      state.isTitleSuccess = true;
      state.titleData = action.payload;
    }),
    builder.addCase(getLatestTitle.rejected, (state, action: any) => {
      state.isTitleFetching = false;
      state.isTitleSuccess = false;
      state.isTitleError = true;
      state.titleStatus = "Error";
      state.titleErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertMMB.pending, (state, action) => {
      state.isInsertMMBFetching = true;
      state.isInsertMMBSuccess = false;
      state.insertMMBstatus = "Loading...";
    }),
    builder.addCase(insertMMB.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertMMBstatus = "Success";
        state.isInsertMMBFetching = false;
        state.isInsertMMBSuccess = true;
      } else {
        state.isInsertMMBFetching = false;
        state.isInsertMMBSuccess = false;
        state.isInsertMMBError = true;
        state.insertMMBstatus = "Error";
        state.insertMMBErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertMMB.rejected, (state, action: any) => {
      state.isInsertMMBFetching = false;
      state.isInsertMMBSuccess = false;
      state.isInsertMMBError = true;
      state.insertMMBstatus = "Error";
      state.insertMMBErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateMMB.pending, (state, action) => {
      state.isUpdateMMBFetching = true;
      state.isUpdateMMBSuccess = false;
      state.updateMMBstatus = "Loading...";
    }),
    builder.addCase(updateMMB.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateMMBstatus = "Success";
        state.isUpdateMMBFetching = false;
        state.isUpdateMMBSuccess = true;
      } else {
        state.isUpdateMMBFetching = false;
        state.isUpdateMMBSuccess = false;
        state.isUpdateMMBError = true;
        state.updateMMBstatus = "Error";
        state.updateMMBErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateMMB.rejected, (state, action: any) => {
      state.isUpdateMMBFetching = false;
      state.isUpdateMMBSuccess = false;
      state.isUpdateMMBError = true;
      state.updateMMBstatus = "Error";
      state.updateMMBErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteMMB.pending, (state, action) => {
      state.isDeleteMMBFetching = true;
      state.isDeleteMMBSuccess = false;
      state.deleteMMBstatus = "Loading...";
    }),
    builder.addCase(deleteMMB.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteMMBstatus = "Success";
        state.isDeleteMMBFetching = false;
        state.isDeleteMMBSuccess = true;
      } else {
        state.isDeleteMMBFetching = false;
        state.isDeleteMMBSuccess = false;
        state.isDeleteMMBError = true;
        state.deleteMMBstatus = "Error";
        state.deleteMMBErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteMMB.rejected, (state, action: any) => {
      state.isDeleteMMBFetching = false;
      state.isDeleteMMBSuccess = false;
      state.isDeleteMMBError = true;
      state.deleteMMBstatus = "Error";
      state.deleteMMBErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const MMBlistSelector = (state: any) => state.MMBlist;
export const { clearState } = MMBlistSlice.actions;
export default MMBlistSlice.reducer;
