import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  pendingList: [],
  pendingStatus: "",
  isPendingFetching: false,
  isPendingSuccess: false,
  isPendingError: false,
  pendingErrorMessage: "",

  confirmedList: [],
  confirmedStatus: "",
  isConfirmedFetching: false,
  isConfirmedSuccess: false,
  isConfirmedError: false,
  confirmedErrorMessage: "",

  insertTermsheetStatus: "",
  isInsertTermsheetFetching: false,
  isInsertTermsheetSuccess: false,
  isInsertTermsheetError: false,
  insertTermsheetErrorMessage: "",

  updateTermsheetStatus: "",
  isUpdateTermsheetFetching: false,
  isUpdateTermsheetSuccess: false,
  isUpdateTermsheetError: false,
  updateTermsheetErrorMessage: "",

  deleteTermsheetStatus: "",
  isDeleteTermsheetFetching: false,
  isDeleteTermsheetSuccess: false,
  isDeleteTermsheetError: false,
  deleteTermsheetErrorMessage: "",
};

export const getPendingList = createAsyncThunk(
  "/termsheet/pending",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/termsheet/pending`)
      .get()
      .json((response: any) => response);
  }
);

export const getConfirmedList = createAsyncThunk(
  "/termsheet/confirmed",
  async ({ token, id, page }: any) => {
    return await baseService
      .url(`${api}/termsheet/confirmed`)
      .get()
      .json((response: any) => response);
  }
);

export const insertTermsheet = createAsyncThunk(
  "/termsheet/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/termsheet`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateTermsheet = createAsyncThunk(
  "/termsheet/update",
  async ({ token, ticker, payload }: any) => {
    return await baseService
      .url(`${api}/termsheet/update/${ticker}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteTermsheet = createAsyncThunk(
  "/termsheet/delete",
  async ({ token, ticker }: any) => {
    return await baseService
      .url(`${api}/termsheet/delete/${ticker}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const TermsheetlistSlice = createSlice({
  name: "Termsheetlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getPendingList.pending, (state, action) => {
      state.isPendingFetching = true;
      state.isPendingSuccess = false;
      state.pendingStatus = "Loading...";
    }),
    builder.addCase(getPendingList.fulfilled, (state, action) => {
      state.pendingStatus = "Success";
      state.isPendingFetching = false;
      state.isPendingSuccess = true;
      state.pendingList = action.payload;
    }),
    builder.addCase(getPendingList.rejected, (state, action: any) => {
      state.isPendingFetching = false;
      state.isPendingSuccess = false;
      state.isPendingError = true;
      state.pendingStatus = "Error";
      state.pendingErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getConfirmedList.pending, (state, action) => {
      state.isConfirmedFetching = true;
      state.isConfirmedSuccess = false;
      state.confirmedStatus = "Loading...";
    }),
    builder.addCase(getConfirmedList.fulfilled, (state, action) => {
      state.confirmedStatus = "Success";
      state.isConfirmedFetching = false;
      state.isConfirmedSuccess = true;
      state.confirmedList = action.payload;
    }),
    builder.addCase(getConfirmedList.rejected, (state, action: any) => {
      state.isConfirmedFetching = false;
      state.isConfirmedSuccess = false;
      state.isConfirmedError = true;
      state.confirmedStatus = "Error";
      state.confirmedErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertTermsheet.pending, (state, action) => {
      state.isInsertTermsheetFetching = true;
      state.isInsertTermsheetSuccess = false;
      state.insertTermsheetStatus = "Loading...";
    }),
    builder.addCase(insertTermsheet.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertTermsheetStatus = "Success";
        state.isInsertTermsheetFetching = false;
        state.isInsertTermsheetSuccess = true;
      } else {
        state.isInsertTermsheetFetching = false;
        state.isInsertTermsheetSuccess = false;
        state.isInsertTermsheetError = true;
        state.insertTermsheetStatus = "Error";
        state.insertTermsheetErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertTermsheet.rejected, (state, action: any) => {
      state.isInsertTermsheetFetching = false;
      state.isInsertTermsheetSuccess = false;
      state.isInsertTermsheetError = true;
      state.insertTermsheetStatus = "Error";
      state.insertTermsheetErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateTermsheet.pending, (state, action) => {
      state.isUpdateTermsheetFetching = true;
      state.isUpdateTermsheetSuccess = false;
      state.updateTermsheetStatus = "Loading...";
    }),
    builder.addCase(updateTermsheet.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateTermsheetStatus = "Success";
        state.isUpdateTermsheetFetching = false;
        state.isUpdateTermsheetSuccess = true;
      } else {
        state.isUpdateTermsheetFetching = false;
        state.isUpdateTermsheetSuccess = false;
        state.isUpdateTermsheetError = true;
        state.updateTermsheetStatus = "Error";
        state.updateTermsheetErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateTermsheet.rejected, (state, action: any) => {
      state.isUpdateTermsheetFetching = false;
      state.isUpdateTermsheetSuccess = false;
      state.isUpdateTermsheetError = true;
      state.updateTermsheetStatus = "Error";
      state.updateTermsheetErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteTermsheet.pending, (state, action) => {
      state.isDeleteTermsheetFetching = true;
      state.isDeleteTermsheetSuccess = false;
      state.deleteTermsheetStatus = "Loading...";
    }),
    builder.addCase(deleteTermsheet.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteTermsheetStatus = "Success";
        state.isDeleteTermsheetFetching = false;
        state.isDeleteTermsheetSuccess = true;
      } else {
        state.isDeleteTermsheetFetching = false;
        state.isDeleteTermsheetSuccess = false;
        state.isDeleteTermsheetError = true;
        state.deleteTermsheetStatus = "Error";
        state.deleteTermsheetErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteTermsheet.rejected, (state, action: any) => {
      state.isDeleteTermsheetFetching = false;
      state.isDeleteTermsheetSuccess = false;
      state.isDeleteTermsheetError = true;
      state.deleteTermsheetStatus = "Error";
      state.deleteTermsheetErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const TermsheetlistSelector = (state: any) => state.Termsheetlist;
export const { clearState } = TermsheetlistSlice.actions;
export default TermsheetlistSlice.reducer;
