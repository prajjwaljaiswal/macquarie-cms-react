import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  SeminarReglist: [],
  listStatus: "",
  isListFetching: false,
  isListSuccess: false,
  isListError: false,
  listErrorMessage: "",

  Enabledlist: [],
  enabledlistStatus: "",
  isEnabledListFetching: false,
  isEnabledListSuccess: false,
  isEnabledListError: false,
  enabledListErrorMessage: "",

  insertSeminarRegstatus: "",
  isInsertSeminarRegFetching: false,
  isInsertSeminarRegSuccess: false,
  isInsertSeminarRegError: false,
  insertSeminarRegErrorMessage: "",

  deleteSeminarRegstatus: "",
  isDeleteSeminarRegFetching: false,
  isDeleteSeminarRegSuccess: false,
  isDeleteSeminarRegError: false,
  deleteSeminarRegErrorMessage: "",
};

export const getSeminarReglist = createAsyncThunk(
  "/seminarreg/list",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/seminarreg/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const getEnabledSeminar = createAsyncThunk(
  "/seminar/reglist",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/seminar/reglist`)
      .get()
      .json((response: any) => response);
  }
);

export const insertSeminarReg = createAsyncThunk(
  "/seminarreg/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/seminarreg`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteSeminarReg = createAsyncThunk(
  "/seminar/delete",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/seminarreg/delete`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const SeminarReglistSlice = createSlice({
  name: "SeminarReglist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getSeminarReglist.pending, (state, action) => {
      state.isListFetching = true;
      state.isListSuccess = false;
      state.listStatus = "Loading...";
    }),
    builder.addCase(getSeminarReglist.fulfilled, (state, action) => {
      state.listStatus = "Success";
      state.isListFetching = false;
      state.isListSuccess = true;
      state.SeminarReglist = action.payload;
    }),
    builder.addCase(getSeminarReglist.rejected, (state, action: any) => {
      state.isListFetching = false;
      state.isListSuccess = false;
      state.isListError = true;
      state.listStatus = "Error";
      state.listErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getEnabledSeminar.pending, (state, action) => {
      state.isEnabledListFetching = true;
      state.isEnabledListSuccess = false;
      state.enabledlistStatus = "Loading...";
    }),
    builder.addCase(getEnabledSeminar.fulfilled, (state, action) => {
      state.enabledlistStatus = "Success";
      state.isEnabledListFetching = false;
      state.isEnabledListSuccess = true;
      state.Enabledlist = action.payload;
    }),
    builder.addCase(getEnabledSeminar.rejected, (state, action: any) => {
      state.isEnabledListFetching = false;
      state.isEnabledListSuccess = false;
      state.isEnabledListError = true;
      state.enabledlistStatus = "Error";
      state.enabledListErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertSeminarReg.pending, (state, action) => {
      state.isInsertSeminarRegFetching = true;
      state.isInsertSeminarRegSuccess = false;
      state.insertSeminarRegstatus = "Loading...";
    }),
    builder.addCase(insertSeminarReg.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertSeminarRegstatus = "Success";
        state.isInsertSeminarRegFetching = false;
        state.isInsertSeminarRegSuccess = true;
      } else {
        state.isInsertSeminarRegFetching = false;
        state.isInsertSeminarRegSuccess = false;
        state.isInsertSeminarRegError = true;
        state.insertSeminarRegstatus = "Error";
        state.insertSeminarRegErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertSeminarReg.rejected, (state, action: any) => {
      state.isInsertSeminarRegFetching = false;
      state.isInsertSeminarRegSuccess = false;
      state.isInsertSeminarRegError = true;
      state.insertSeminarRegstatus = "Error";
      state.insertSeminarRegErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteSeminarReg.pending, (state, action) => {
      state.isDeleteSeminarRegFetching = true;
      state.isDeleteSeminarRegSuccess = false;
      state.deleteSeminarRegstatus = "Loading...";
    }),
    builder.addCase(deleteSeminarReg.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteSeminarRegstatus = "Success";
        state.isDeleteSeminarRegFetching = false;
        state.isDeleteSeminarRegSuccess = true;
      } else {
        state.isDeleteSeminarRegFetching = false;
        state.isDeleteSeminarRegSuccess = false;
        state.isDeleteSeminarRegError = true;
        state.deleteSeminarRegstatus = "Error";
        state.deleteSeminarRegErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteSeminarReg.rejected, (state, action: any) => {
      state.isDeleteSeminarRegFetching = false;
      state.isDeleteSeminarRegSuccess = false;
      state.isDeleteSeminarRegError = true;
      state.deleteSeminarRegstatus = "Error";
      state.deleteSeminarRegErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const SeminarRegSelector = (state: any) => state.SeminarReglist;
export const { clearState } = SeminarReglistSlice.actions;
export default SeminarReglistSlice.reducer;
