import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  DwSet50Tipslist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  DwSet50TipsData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertDwSet50Tipsstatus: "",
  isInsertDwSet50TipsFetching: false,
  isInsertDwSet50TipsSuccess: false,
  isInsertDwSet50TipsError: false,
  insertDwSet50TipsErrorMessage: "",

  updateDwSet50Tipsstatus: "",
  isUpdateDwSet50TipsFetching: false,
  isUpdateDwSet50TipsSuccess: false,
  isUpdateDwSet50TipsError: false,
  updateDwSet50TipsErrorMessage: "",

  deleteDwSet50Tipsstatus: "",
  isDeleteDwSet50TipsFetching: false,
  isDeleteDwSet50TipsSuccess: false,
  isDeleteDwSet50TipsError: false,
  deleteDwSet50TipsErrorMessage: "",
};

export const getDwSet50Tipslist = createAsyncThunk(
  "/DwSet50Tips",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/DwSet50Tips`)
      .get()
      .json((response: any) => response);
  }
);

export const getDwSet50TipsById = createAsyncThunk(
  "/DwSet50Tips/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/DwSet50Tips/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertDwSet50Tips = createAsyncThunk(
  "/DwSet50Tips/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/DwSet50Tips`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDwSet50Tips = createAsyncThunk(
  "/DwSet50Tips/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/DwSet50Tips/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteDwSet50Tips = createAsyncThunk(
  "/DwSet50Tips/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/DwSet50Tips/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const DwSet50TipslistSlice = createSlice({
  name: "DwSet50Tipslist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDwSet50Tipslist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getDwSet50Tipslist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.DwSet50Tipslist = action.payload;
    }),
    builder.addCase(getDwSet50Tipslist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getDwSet50TipsById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getDwSet50TipsById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.DwSet50TipsData = action.payload;
    }),
    builder.addCase(getDwSet50TipsById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertDwSet50Tips.pending, (state, action) => {
      state.isInsertDwSet50TipsFetching = true;
      state.isInsertDwSet50TipsSuccess = false;
      state.insertDwSet50Tipsstatus = "Loading...";
    }),
    builder.addCase(insertDwSet50Tips.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertDwSet50Tipsstatus = "Success";
        state.isInsertDwSet50TipsFetching = false;
        state.isInsertDwSet50TipsSuccess = true;
      } else {
        state.isInsertDwSet50TipsFetching = false;
        state.isInsertDwSet50TipsSuccess = false;
        state.isInsertDwSet50TipsError = true;
        state.insertDwSet50Tipsstatus = "Error";
        state.insertDwSet50TipsErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertDwSet50Tips.rejected, (state, action: any) => {
      state.isInsertDwSet50TipsFetching = false;
      state.isInsertDwSet50TipsSuccess = false;
      state.isInsertDwSet50TipsError = true;
      state.insertDwSet50Tipsstatus = "Error";
      state.insertDwSet50TipsErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDwSet50Tips.pending, (state, action) => {
      state.isUpdateDwSet50TipsFetching = true;
      state.isUpdateDwSet50TipsSuccess = false;
      state.updateDwSet50Tipsstatus = "Loading...";
    }),
    builder.addCase(updateDwSet50Tips.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDwSet50Tipsstatus = "Success";
        state.isUpdateDwSet50TipsFetching = false;
        state.isUpdateDwSet50TipsSuccess = true;
      } else {
        state.isUpdateDwSet50TipsFetching = false;
        state.isUpdateDwSet50TipsSuccess = false;
        state.isUpdateDwSet50TipsError = true;
        state.updateDwSet50Tipsstatus = "Error";
        state.updateDwSet50TipsErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDwSet50Tips.rejected, (state, action: any) => {
      state.isUpdateDwSet50TipsFetching = false;
      state.isUpdateDwSet50TipsSuccess = false;
      state.isUpdateDwSet50TipsError = true;
      state.updateDwSet50Tipsstatus = "Error";
      state.updateDwSet50TipsErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDwSet50Tips.pending, (state, action) => {
      state.isDeleteDwSet50TipsFetching = true;
      state.isDeleteDwSet50TipsSuccess = false;
      state.deleteDwSet50Tipsstatus = "Loading...";
    }),
    builder.addCase(deleteDwSet50Tips.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDwSet50Tipsstatus = "Success";
        state.isDeleteDwSet50TipsFetching = false;
        state.isDeleteDwSet50TipsSuccess = true;
      } else {
        state.isDeleteDwSet50TipsFetching = false;
        state.isDeleteDwSet50TipsSuccess = false;
        state.isDeleteDwSet50TipsError = true;
        state.deleteDwSet50Tipsstatus = "Error";
        state.deleteDwSet50TipsErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDwSet50Tips.rejected, (state, action: any) => {
      state.isDeleteDwSet50TipsFetching = false;
      state.isDeleteDwSet50TipsSuccess = false;
      state.isDeleteDwSet50TipsError = true;
      state.deleteDwSet50Tipsstatus = "Error";
      state.deleteDwSet50TipsErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const DwSet50TipslistSelector = (state: any) => state.DwSet50Tipslist;
export const { clearState } = DwSet50TipslistSlice.actions;
export default DwSet50TipslistSlice.reducer;
