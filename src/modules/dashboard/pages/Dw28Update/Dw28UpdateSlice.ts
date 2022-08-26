import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  Dw28Updatelist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  Dw28UpdateData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertDw28Updatestatus: "",
  isInsertDw28UpdateFetching: false,
  isInsertDw28UpdateSuccess: false,
  isInsertDw28UpdateError: false,
  insertDw28UpdateErrorMessage: "",

  updateDw28Updatestatus: "",
  isUpdateDw28UpdateFetching: false,
  isUpdateDw28UpdateSuccess: false,
  isUpdateDw28UpdateError: false,
  updateDw28UpdateErrorMessage: "",

  deleteDw28Updatestatus: "",
  isDeleteDw28UpdateFetching: false,
  isDeleteDw28UpdateSuccess: false,
  isDeleteDw28UpdateError: false,
  deleteDw28UpdateErrorMessage: "",
};

export const getDw28Updatelist = createAsyncThunk(
  "/Dw28Update",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/Dw28Update`)
      .get()
      .json((response: any) => response);
  }
);

export const getDw28UpdateById = createAsyncThunk(
  "/Dw28Update/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/Dw28Update/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertDw28Update = createAsyncThunk(
  "/Dw28Update/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/Dw28Update`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDw28Update = createAsyncThunk(
  "/Dw28Update/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/Dw28Update/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteDw28Update = createAsyncThunk(
  "/Dw28Update/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/Dw28Update/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const Dw28UpdatelistSlice = createSlice({
  name: "Dw28Updatelist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDw28Updatelist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getDw28Updatelist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.Dw28Updatelist = action.payload;
    }),
    builder.addCase(getDw28Updatelist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getDw28UpdateById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getDw28UpdateById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.Dw28UpdateData = action.payload;
    }),
    builder.addCase(getDw28UpdateById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertDw28Update.pending, (state, action) => {
      state.isInsertDw28UpdateFetching = true;
      state.isInsertDw28UpdateSuccess = false;
      state.insertDw28Updatestatus = "Loading...";
    }),
    builder.addCase(insertDw28Update.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertDw28Updatestatus = "Success";
        state.isInsertDw28UpdateFetching = false;
        state.isInsertDw28UpdateSuccess = true;
      } else {
        state.isInsertDw28UpdateFetching = false;
        state.isInsertDw28UpdateSuccess = false;
        state.isInsertDw28UpdateError = true;
        state.insertDw28Updatestatus = "Error";
        state.insertDw28UpdateErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertDw28Update.rejected, (state, action: any) => {
      state.isInsertDw28UpdateFetching = false;
      state.isInsertDw28UpdateSuccess = false;
      state.isInsertDw28UpdateError = true;
      state.insertDw28Updatestatus = "Error";
      state.insertDw28UpdateErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDw28Update.pending, (state, action) => {
      state.isUpdateDw28UpdateFetching = true;
      state.isUpdateDw28UpdateSuccess = false;
      state.updateDw28Updatestatus = "Loading...";
    }),
    builder.addCase(updateDw28Update.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDw28Updatestatus = "Success";
        state.isUpdateDw28UpdateFetching = false;
        state.isUpdateDw28UpdateSuccess = true;
      } else {
        state.isUpdateDw28UpdateFetching = false;
        state.isUpdateDw28UpdateSuccess = false;
        state.isUpdateDw28UpdateError = true;
        state.updateDw28Updatestatus = "Error";
        state.updateDw28UpdateErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDw28Update.rejected, (state, action: any) => {
      state.isUpdateDw28UpdateFetching = false;
      state.isUpdateDw28UpdateSuccess = false;
      state.isUpdateDw28UpdateError = true;
      state.updateDw28Updatestatus = "Error";
      state.updateDw28UpdateErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDw28Update.pending, (state, action) => {
      state.isDeleteDw28UpdateFetching = true;
      state.isDeleteDw28UpdateSuccess = false;
      state.deleteDw28Updatestatus = "Loading...";
    }),
    builder.addCase(deleteDw28Update.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDw28Updatestatus = "Success";
        state.isDeleteDw28UpdateFetching = false;
        state.isDeleteDw28UpdateSuccess = true;
      } else {
        state.isDeleteDw28UpdateFetching = false;
        state.isDeleteDw28UpdateSuccess = false;
        state.isDeleteDw28UpdateError = true;
        state.deleteDw28Updatestatus = "Error";
        state.deleteDw28UpdateErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDw28Update.rejected, (state, action: any) => {
      state.isDeleteDw28UpdateFetching = false;
      state.isDeleteDw28UpdateSuccess = false;
      state.isDeleteDw28UpdateError = true;
      state.deleteDw28Updatestatus = "Error";
      state.deleteDw28UpdateErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const Dw28UpdatelistSelector = (state: any) => state.Dw28Updatelist;
export const { clearState } = Dw28UpdatelistSlice.actions;
export default Dw28UpdatelistSlice.reducer;
