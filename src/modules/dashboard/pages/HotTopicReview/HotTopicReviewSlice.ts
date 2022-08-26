import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  HotTopicReviewlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  HotTopicReviewData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertHotTopicReviewstatus: "",
  isInsertHotTopicReviewFetching: false,
  isInsertHotTopicReviewSuccess: false,
  isInsertHotTopicReviewError: false,
  insertHotTopicReviewErrorMessage: "",

  updateHotTopicReviewstatus: "",
  isUpdateHotTopicReviewFetching: false,
  isUpdateHotTopicReviewSuccess: false,
  isUpdateHotTopicReviewError: false,
  updateHotTopicReviewErrorMessage: "",

  deleteHotTopicReviewstatus: "",
  isDeleteHotTopicReviewFetching: false,
  isDeleteHotTopicReviewSuccess: false,
  isDeleteHotTopicReviewError: false,
  deleteHotTopicReviewErrorMessage: "",
};

export const getHotTopicReviewlist = createAsyncThunk(
  "/HotTopicReview",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/HotTopicReview`)
      .get()
      .json((response: any) => response);
  }
);

export const getHotTopicReviewById = createAsyncThunk(
  "/HotTopicReview/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/HotTopicReview/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertHotTopicReview = createAsyncThunk(
  "/HotTopicReview/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/HotTopicReview`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateHotTopicReview = createAsyncThunk(
  "/HotTopicReview/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/HotTopicReview/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteHotTopicReview = createAsyncThunk(
  "/HotTopicReview/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/HotTopicReview/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const HotTopicReviewlistSlice = createSlice({
  name: "HotTopicReviewlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getHotTopicReviewlist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getHotTopicReviewlist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.HotTopicReviewlist = action.payload;
    }),
    builder.addCase(getHotTopicReviewlist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getHotTopicReviewById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getHotTopicReviewById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.HotTopicReviewData = action.payload;
    }),
    builder.addCase(getHotTopicReviewById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertHotTopicReview.pending, (state, action) => {
      state.isInsertHotTopicReviewFetching = true;
      state.isInsertHotTopicReviewSuccess = false;
      state.insertHotTopicReviewstatus = "Loading...";
    }),
    builder.addCase(insertHotTopicReview.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertHotTopicReviewstatus = "Success";
        state.isInsertHotTopicReviewFetching = false;
        state.isInsertHotTopicReviewSuccess = true;
      } else {
        state.isInsertHotTopicReviewFetching = false;
        state.isInsertHotTopicReviewSuccess = false;
        state.isInsertHotTopicReviewError = true;
        state.insertHotTopicReviewstatus = "Error";
        state.insertHotTopicReviewErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertHotTopicReview.rejected, (state, action: any) => {
      state.isInsertHotTopicReviewFetching = false;
      state.isInsertHotTopicReviewSuccess = false;
      state.isInsertHotTopicReviewError = true;
      state.insertHotTopicReviewstatus = "Error";
      state.insertHotTopicReviewErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateHotTopicReview.pending, (state, action) => {
      state.isUpdateHotTopicReviewFetching = true;
      state.isUpdateHotTopicReviewSuccess = false;
      state.updateHotTopicReviewstatus = "Loading...";
    }),
    builder.addCase(updateHotTopicReview.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateHotTopicReviewstatus = "Success";
        state.isUpdateHotTopicReviewFetching = false;
        state.isUpdateHotTopicReviewSuccess = true;
      } else {
        state.isUpdateHotTopicReviewFetching = false;
        state.isUpdateHotTopicReviewSuccess = false;
        state.isUpdateHotTopicReviewError = true;
        state.updateHotTopicReviewstatus = "Error";
        state.updateHotTopicReviewErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateHotTopicReview.rejected, (state, action: any) => {
      state.isUpdateHotTopicReviewFetching = false;
      state.isUpdateHotTopicReviewSuccess = false;
      state.isUpdateHotTopicReviewError = true;
      state.updateHotTopicReviewstatus = "Error";
      state.updateHotTopicReviewErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteHotTopicReview.pending, (state, action) => {
      state.isDeleteHotTopicReviewFetching = true;
      state.isDeleteHotTopicReviewSuccess = false;
      state.deleteHotTopicReviewstatus = "Loading...";
    }),
    builder.addCase(deleteHotTopicReview.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteHotTopicReviewstatus = "Success";
        state.isDeleteHotTopicReviewFetching = false;
        state.isDeleteHotTopicReviewSuccess = true;
      } else {
        state.isDeleteHotTopicReviewFetching = false;
        state.isDeleteHotTopicReviewSuccess = false;
        state.isDeleteHotTopicReviewError = true;
        state.deleteHotTopicReviewstatus = "Error";
        state.deleteHotTopicReviewErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteHotTopicReview.rejected, (state, action: any) => {
      state.isDeleteHotTopicReviewFetching = false;
      state.isDeleteHotTopicReviewSuccess = false;
      state.isDeleteHotTopicReviewError = true;
      state.deleteHotTopicReviewstatus = "Error";
      state.deleteHotTopicReviewErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const HotTopicReviewlistSelector = (state: any) => state.HotTopicReviewlist;
export const { clearState } = HotTopicReviewlistSlice.actions;
export default HotTopicReviewlistSlice.reducer;
