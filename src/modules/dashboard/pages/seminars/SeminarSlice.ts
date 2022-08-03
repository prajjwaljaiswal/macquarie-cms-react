import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  Seminarlist: [],
  listStatus: "",
  isListFetching: false,
  isListSuccess: false,
  isListError: false,
  listErrorMessage: "",

  Seminar: [],
  seminarStatus: "",
  isSeminarFetching: false,
  isSeminarSuccess: false,
  isSeminarError: false,
  seminarErrorMessage: "",

  createSeminarstatus: "",
  isCreateSeminarFetching: false,
  isCreateSeminarSuccess: false,
  isCreateSeminarError: false,
  createSeminarErrorMessage: "",

  updateSeminarstatus: "",
  isUpdateSeminarFetching: false,
  isUpdateSeminarSuccess: false,
  isUpdateSeminarError: false,
  updateSeminarErrorMessage: "",

  deleteSeminarstatus: "",
  isDeleteSeminarFetching: false,
  isDeleteSeminarSuccess: false,
  isDeleteSeminarError: false,
  deleteSeminarErrorMessage: "",
};

export const getSeminarlist = createAsyncThunk(
  "/seminar/list",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/seminar`)
      .get()
      .json((response: any) => response);
  }
);

export const getSeminarById = createAsyncThunk(
  "/seminar/:id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/seminar/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const createSeminar = createAsyncThunk(
  "/seminar/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/seminar`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateSeminar = createAsyncThunk(
  "/seminar/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/seminar/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteSeminar = createAsyncThunk(
  "/seminar/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/seminar/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const SeminarlistSlice = createSlice({
  name: "Seminarlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getSeminarlist.pending, (state, action) => {
      state.isListFetching = true;
      state.isListSuccess = false;
      state.listStatus = "Loading...";
    }),
    builder.addCase(getSeminarlist.fulfilled, (state, action) => {
      state.listStatus = "Success";
      state.isListFetching = false;
      state.isListSuccess = true;
      state.Seminarlist = action.payload;
    }),
    builder.addCase(getSeminarlist.rejected, (state, action: any) => {
      state.isListFetching = false;
      state.isListSuccess = false;
      state.isListError = true;
      state.listStatus = "Error";
      state.listErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getSeminarById.pending, (state, action) => {
      state.isSeminarFetching = true;
      state.isSeminarSuccess = false;
      state.seminarStatus = "Loading...";
    }),
    builder.addCase(getSeminarById.fulfilled, (state, action) => {
      state.seminarStatus = "Success";
      state.isSeminarFetching = false;
      state.isSeminarSuccess = true;
      state.Seminar = action.payload;
    }),
    builder.addCase(getSeminarById.rejected, (state, action: any) => {
      state.isSeminarFetching = false;
      state.isSeminarSuccess = false;
      state.isSeminarError = true;
      state.seminarStatus = "Error";
      state.seminarErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(createSeminar.pending, (state, action) => {
      state.isCreateSeminarFetching = true;
      state.isCreateSeminarSuccess = false;
      state.createSeminarstatus = "Loading...";
    }),
    builder.addCase(createSeminar.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.createSeminarstatus = "Success";
        state.isCreateSeminarFetching = false;
        state.isCreateSeminarSuccess = true;
      } else {
        state.isCreateSeminarFetching = false;
        state.isCreateSeminarSuccess = false;
        state.isCreateSeminarError = true;
        state.createSeminarstatus = "Error";
        state.createSeminarErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(createSeminar.rejected, (state, action: any) => {
      state.isCreateSeminarFetching = false;
      state.isCreateSeminarSuccess = false;
      state.isCreateSeminarError = true;
      state.createSeminarstatus = "Error";
      state.createSeminarErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateSeminar.pending, (state, action) => {
      state.isUpdateSeminarFetching = true;
      state.isUpdateSeminarSuccess = false;
      state.updateSeminarstatus = "Loading...";
    }),
    builder.addCase(updateSeminar.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateSeminarstatus = "Success";
        state.isUpdateSeminarFetching = false;
        state.isUpdateSeminarSuccess = true;
      } else {
        state.isUpdateSeminarFetching = false;
        state.isUpdateSeminarSuccess = false;
        state.isUpdateSeminarError = true;
        state.updateSeminarstatus = "Error";
        state.updateSeminarErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateSeminar.rejected, (state, action: any) => {
      state.isUpdateSeminarFetching = false;
      state.isUpdateSeminarSuccess = false;
      state.isUpdateSeminarError = true;
      state.updateSeminarstatus = "Error";
      state.updateSeminarErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteSeminar.pending, (state, action) => {
      state.isDeleteSeminarFetching = true;
      state.isDeleteSeminarSuccess = false;
      state.deleteSeminarstatus = "Loading...";
    }),
    builder.addCase(deleteSeminar.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteSeminarstatus = "Success";
        state.isDeleteSeminarFetching = false;
        state.isDeleteSeminarSuccess = true;
      } else {
        state.isDeleteSeminarFetching = false;
        state.isDeleteSeminarSuccess = false;
        state.isDeleteSeminarError = true;
        state.deleteSeminarstatus = "Error";
        state.deleteSeminarErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteSeminar.rejected, (state, action: any) => {
      state.isDeleteSeminarFetching = false;
      state.isDeleteSeminarSuccess = false;
      state.isDeleteSeminarError = true;
      state.deleteSeminarstatus = "Error";
      state.deleteSeminarErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const SeminarSelector = (state: any) => state.Seminarlist;
export const { clearState } = SeminarlistSlice.actions;
export default SeminarlistSlice.reducer;
