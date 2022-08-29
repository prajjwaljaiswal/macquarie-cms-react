import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  Activitieslist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  ActivitiesData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertActivitiesstatus: "",
  isInsertActivitiesFetching: false,
  isInsertActivitiesSuccess: false,
  isInsertActivitiesError: false,
  insertActivitiesErrorMessage: "",

  updateActivitiesstatus: "",
  isUpdateActivitiesFetching: false,
  isUpdateActivitiesSuccess: false,
  isUpdateActivitiesError: false,
  updateActivitiesErrorMessage: "",

  deleteActivitiesstatus: "",
  isDeleteActivitiesFetching: false,
  isDeleteActivitiesSuccess: false,
  isDeleteActivitiesError: false,
  deleteActivitiesErrorMessage: "",
};

export const getActivitieslist = createAsyncThunk(
  "/Activities",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/activities`)
      .get()
      .json((response: any) => response);
  }
);

export const getActivitiesById = createAsyncThunk(
  "/Activities/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/activities/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertActivities = createAsyncThunk(
  "/Activities/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/activities`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateActivities = createAsyncThunk(
  "/Activities/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/activities/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteActivities = createAsyncThunk(
  "/Activities/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/activities/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const ActivitieslistSlice = createSlice({
  name: "Activitieslist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getActivitieslist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getActivitieslist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.Activitieslist = action.payload;
    }),
    builder.addCase(getActivitieslist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getActivitiesById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getActivitiesById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.ActivitiesData = action.payload;
    }),
    builder.addCase(getActivitiesById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertActivities.pending, (state, action) => {
      state.isInsertActivitiesFetching = true;
      state.isInsertActivitiesSuccess = false;
      state.insertActivitiesstatus = "Loading...";
    }),
    builder.addCase(insertActivities.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertActivitiesstatus = "Success";
        state.isInsertActivitiesFetching = false;
        state.isInsertActivitiesSuccess = true;
      } else {
        state.isInsertActivitiesFetching = false;
        state.isInsertActivitiesSuccess = false;
        state.isInsertActivitiesError = true;
        state.insertActivitiesstatus = "Error";
        state.insertActivitiesErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertActivities.rejected, (state, action: any) => {
      state.isInsertActivitiesFetching = false;
      state.isInsertActivitiesSuccess = false;
      state.isInsertActivitiesError = true;
      state.insertActivitiesstatus = "Error";
      state.insertActivitiesErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateActivities.pending, (state, action) => {
      state.isUpdateActivitiesFetching = true;
      state.isUpdateActivitiesSuccess = false;
      state.updateActivitiesstatus = "Loading...";
    }),
    builder.addCase(updateActivities.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateActivitiesstatus = "Success";
        state.isUpdateActivitiesFetching = false;
        state.isUpdateActivitiesSuccess = true;
      } else {
        state.isUpdateActivitiesFetching = false;
        state.isUpdateActivitiesSuccess = false;
        state.isUpdateActivitiesError = true;
        state.updateActivitiesstatus = "Error";
        state.updateActivitiesErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateActivities.rejected, (state, action: any) => {
      state.isUpdateActivitiesFetching = false;
      state.isUpdateActivitiesSuccess = false;
      state.isUpdateActivitiesError = true;
      state.updateActivitiesstatus = "Error";
      state.updateActivitiesErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteActivities.pending, (state, action) => {
      state.isDeleteActivitiesFetching = true;
      state.isDeleteActivitiesSuccess = false;
      state.deleteActivitiesstatus = "Loading...";
    }),
    builder.addCase(deleteActivities.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteActivitiesstatus = "Success";
        state.isDeleteActivitiesFetching = false;
        state.isDeleteActivitiesSuccess = true;
      } else {
        state.isDeleteActivitiesFetching = false;
        state.isDeleteActivitiesSuccess = false;
        state.isDeleteActivitiesError = true;
        state.deleteActivitiesstatus = "Error";
        state.deleteActivitiesErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteActivities.rejected, (state, action: any) => {
      state.isDeleteActivitiesFetching = false;
      state.isDeleteActivitiesSuccess = false;
      state.isDeleteActivitiesError = true;
      state.deleteActivitiesstatus = "Error";
      state.deleteActivitiesErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const ActivitieslistSelector = (state: any) => state.Activitieslist;
export const { clearState } = ActivitieslistSlice.actions;
export default ActivitieslistSlice.reducer;
