import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  OMWlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  OMWData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertOMWstatus: "",
  isInsertOMWFetching: false,
  isInsertOMWSuccess: false,
  isInsertOMWError: false,
  insertOMWErrorMessage: "",

  updateOMWstatus: "",
  isUpdateOMWFetching: false,
  isUpdateOMWSuccess: false,
  isUpdateOMWError: false,
  updateOMWErrorMessage: "",

  deleteOMWstatus: "",
  isDeleteOMWFetching: false,
  isDeleteOMWSuccess: false,
  isDeleteOMWError: false,
  deleteOMWErrorMessage: "",
};

export const getOMWlist = createAsyncThunk(
  "/omw",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/omw`)
      .get()
      .json((response: any) => response);
  }
);

export const getOMWById = createAsyncThunk(
  "/omw/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/omw/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertOMW = createAsyncThunk(
  "/omw/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/omw`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateOMW = createAsyncThunk(
  "/omw/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/omw/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteOMW = createAsyncThunk(
  "/omw/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/omw/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const OMWlistSlice = createSlice({
  name: "OMWlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getOMWlist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getOMWlist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.OMWlist = action.payload;
    }),
    builder.addCase(getOMWlist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getOMWById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getOMWById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.OMWData = action.payload;
    }),
    builder.addCase(getOMWById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertOMW.pending, (state, action) => {
      state.isInsertOMWFetching = true;
      state.isInsertOMWSuccess = false;
      state.insertOMWstatus = "Loading...";
    }),
    builder.addCase(insertOMW.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertOMWstatus = "Success";
        state.isInsertOMWFetching = false;
        state.isInsertOMWSuccess = true;
      } else {
        state.isInsertOMWFetching = false;
        state.isInsertOMWSuccess = false;
        state.isInsertOMWError = true;
        state.insertOMWstatus = "Error";
        state.insertOMWErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertOMW.rejected, (state, action: any) => {
      state.isInsertOMWFetching = false;
      state.isInsertOMWSuccess = false;
      state.isInsertOMWError = true;
      state.insertOMWstatus = "Error";
      state.insertOMWErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateOMW.pending, (state, action) => {
      state.isUpdateOMWFetching = true;
      state.isUpdateOMWSuccess = false;
      state.updateOMWstatus = "Loading...";
    }),
    builder.addCase(updateOMW.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateOMWstatus = "Success";
        state.isUpdateOMWFetching = false;
        state.isUpdateOMWSuccess = true;
      } else {
        state.isUpdateOMWFetching = false;
        state.isUpdateOMWSuccess = false;
        state.isUpdateOMWError = true;
        state.updateOMWstatus = "Error";
        state.updateOMWErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateOMW.rejected, (state, action: any) => {
      state.isUpdateOMWFetching = false;
      state.isUpdateOMWSuccess = false;
      state.isUpdateOMWError = true;
      state.updateOMWstatus = "Error";
      state.updateOMWErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteOMW.pending, (state, action) => {
      state.isDeleteOMWFetching = true;
      state.isDeleteOMWSuccess = false;
      state.deleteOMWstatus = "Loading...";
    }),
    builder.addCase(deleteOMW.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteOMWstatus = "Success";
        state.isDeleteOMWFetching = false;
        state.isDeleteOMWSuccess = true;
      } else {
        state.isDeleteOMWFetching = false;
        state.isDeleteOMWSuccess = false;
        state.isDeleteOMWError = true;
        state.deleteOMWstatus = "Error";
        state.deleteOMWErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteOMW.rejected, (state, action: any) => {
      state.isDeleteOMWFetching = false;
      state.isDeleteOMWSuccess = false;
      state.isDeleteOMWError = true;
      state.deleteOMWstatus = "Error";
      state.deleteOMWErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const OMWlistSelector = (state: any) => state.OMWlist;
export const { clearState } = OMWlistSlice.actions;
export default OMWlistSlice.reducer;
