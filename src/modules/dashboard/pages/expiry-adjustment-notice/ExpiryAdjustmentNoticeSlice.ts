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

  noticeData: "",
  noticeStatus: "",
  isNoticeFetching: false,
  isNoticeSuccess: false,
  isNoticeError: false,
  noticeErrorMessage: "",

  insertNoticeStatus: "",
  isInsertNoticeFetching: false,
  isInsertNoticeSuccess: false,
  isInsertNoticeError: false,
  insertNoticeErrorMessage: "",

  updateNoticeStatus: "",
  isUpdateNoticeFetching: false,
  isUpdateNoticeSuccess: false,
  isUpdateNoticeError: false,
  updateNoticeErrorMessage: "",

  deleteNoticeStatus: "",
  isDeleteNoticeFetching: false,
  isDeleteNoticeSuccess: false,
  isDeleteNoticeError: false,
  deleteNoticeErrorMessage: "",
};

export const getPendingList = createAsyncThunk(
  "/notice/pending",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/notice/pending`)
      .get()
      .json((response: any) => response);
  }
);

export const getConfirmedList = createAsyncThunk(
  "/notice/confirmed",
  async ({ token, id, page }: any) => {
    return await baseService
      .url(`${api}/notice/confirmed`)
      .get()
      .json((response: any) => response);
  }
);

export const getNoticeById = createAsyncThunk(
  "/notice/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/notice/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertNotice = createAsyncThunk(
  "/notice/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/notice`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateNotice = createAsyncThunk(
  "/notice/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/notice/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteNotice = createAsyncThunk(
  "/notice/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/notice/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const NoticelistSlice = createSlice({
  name: "Noticelist",
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
    builder.addCase(getNoticeById.pending, (state, action) => {
      state.isNoticeFetching = true;
      state.isNoticeSuccess = false;
      state.noticeStatus = "Loading...";
    }),
    builder.addCase(getNoticeById.fulfilled, (state, action) => {
      state.noticeStatus = "Success";
      state.isNoticeFetching = false;
      state.isNoticeSuccess = true;
      state.noticeData = action.payload;
    }),
    builder.addCase(getNoticeById.rejected, (state, action: any) => {
      state.isNoticeFetching = false;
      state.isNoticeSuccess = false;
      state.isNoticeError = true;
      state.noticeStatus = "Error";
      state.noticeErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertNotice.pending, (state, action) => {
      state.isInsertNoticeFetching = true;
      state.isInsertNoticeSuccess = false;
      state.insertNoticeStatus = "Loading...";
    }),
    builder.addCase(insertNotice.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertNoticeStatus = "Success";
        state.isInsertNoticeFetching = false;
        state.isInsertNoticeSuccess = true;
      } else {
        state.isInsertNoticeFetching = false;
        state.isInsertNoticeSuccess = false;
        state.isInsertNoticeError = true;
        state.insertNoticeStatus = "Error";
        state.insertNoticeErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertNotice.rejected, (state, action: any) => {
      state.isInsertNoticeFetching = false;
      state.isInsertNoticeSuccess = false;
      state.isInsertNoticeError = true;
      state.insertNoticeStatus = "Error";
      state.insertNoticeErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateNotice.pending, (state, action) => {
      state.isUpdateNoticeFetching = true;
      state.isUpdateNoticeSuccess = false;
      state.updateNoticeStatus = "Loading...";
    }),
    builder.addCase(updateNotice.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateNoticeStatus = "Success";
        state.isUpdateNoticeFetching = false;
        state.isUpdateNoticeSuccess = true;
      } else {
        state.isUpdateNoticeFetching = false;
        state.isUpdateNoticeSuccess = false;
        state.isUpdateNoticeError = true;
        state.updateNoticeStatus = "Error";
        state.updateNoticeErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateNotice.rejected, (state, action: any) => {
      state.isUpdateNoticeFetching = false;
      state.isUpdateNoticeSuccess = false;
      state.isUpdateNoticeError = true;
      state.updateNoticeStatus = "Error";
      state.updateNoticeErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteNotice.pending, (state, action) => {
      state.isDeleteNoticeFetching = true;
      state.isDeleteNoticeSuccess = false;
      state.deleteNoticeStatus = "Loading...";
    }),
    builder.addCase(deleteNotice.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteNoticeStatus = "Success";
        state.isDeleteNoticeFetching = false;
        state.isDeleteNoticeSuccess = true;
      } else {
        state.isDeleteNoticeFetching = false;
        state.isDeleteNoticeSuccess = false;
        state.isDeleteNoticeError = true;
        state.deleteNoticeStatus = "Error";
        state.deleteNoticeErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteNotice.rejected, (state, action: any) => {
      state.isDeleteNoticeFetching = false;
      state.isDeleteNoticeSuccess = false;
      state.isDeleteNoticeError = true;
      state.deleteNoticeStatus = "Error";
      state.deleteNoticeErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const NoticelistSelector = (state: any) => state.Noticelist;
export const { clearState } = NoticelistSlice.actions;
export default NoticelistSlice.reducer;
