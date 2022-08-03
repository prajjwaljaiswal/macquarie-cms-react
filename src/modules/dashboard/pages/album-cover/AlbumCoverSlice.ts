import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  Albumlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  Cover: [],
  coverStatus: "",
  isCoverFetching: false,
  isCoverSuccess: false,
  isCoverError: false,
  coverErrorMessage: "",

  createAlbumstatus: "",
  isCreateAlbumFetching: false,
  isCreateAlbumSuccess: false,
  isCreateAlbumError: false,
  createAlbumErrorMessage: "",

  updateAlbumstatus: "",
  isUpdateAlbumFetching: false,
  isUpdateAlbumSuccess: false,
  isUpdateAlbumError: false,
  updateAlbumErrorMessage: "",

  deleteAlbumstatus: "",
  isDeleteAlbumFetching: false,
  isDeleteAlbumSuccess: false,
  isDeleteAlbumError: false,
  deleteAlbumErrorMessage: "",
};

export const getAlbumList = createAsyncThunk(
  "/album/get",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/album`)
      .get()
      .json((response: any) => response);
  }
);

export const getAlbumById = createAsyncThunk(
  "/album/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/album/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertAlbum = createAsyncThunk(
  "/album/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/album`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateAlbum = createAsyncThunk(
  "/album/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/album/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteAlbum = createAsyncThunk(
  "/album/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/album/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const AlbumlistSlice = createSlice({
  name: "Albumlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getAlbumList.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getAlbumList.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.Albumlist = action.payload;
    }),
    builder.addCase(getAlbumList.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getAlbumById.pending, (state, action) => {
      state.isCoverFetching = true;
      state.isCoverSuccess = false;
      state.coverStatus = "Loading...";
    }),
    builder.addCase(getAlbumById.fulfilled, (state, action) => {
      state.coverStatus = "Success";
      state.isCoverFetching = false;
      state.isCoverSuccess = true;
      state.Cover = action.payload;
    }),
    builder.addCase(getAlbumById.rejected, (state, action: any) => {
      state.isCoverFetching = false;
      state.isCoverSuccess = false;
      state.isCoverError = true;
      state.coverStatus = "Error";
      state.coverErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertAlbum.pending, (state, action) => {
      state.isCreateAlbumFetching = true;
      state.isCreateAlbumSuccess = false;
      state.createAlbumstatus = "Loading...";
    }),
    builder.addCase(insertAlbum.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.createAlbumstatus = "Success";
        state.isCreateAlbumFetching = false;
        state.isCreateAlbumSuccess = true;
      } else {
        state.isCreateAlbumFetching = false;
        state.isCreateAlbumSuccess = false;
        state.isCreateAlbumError = true;
        state.createAlbumstatus = "Error";
        state.createAlbumErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertAlbum.rejected, (state, action: any) => {
      state.isCreateAlbumFetching = false;
      state.isCreateAlbumSuccess = false;
      state.isCreateAlbumError = true;
      state.createAlbumstatus = "Error";
      state.createAlbumErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateAlbum.pending, (state, action) => {
      state.isUpdateAlbumFetching = true;
      state.isUpdateAlbumSuccess = false;
      state.updateAlbumstatus = "Loading...";
    }),
    builder.addCase(updateAlbum.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateAlbumstatus = "Success";
        state.isUpdateAlbumFetching = false;
        state.isUpdateAlbumSuccess = true;
      } else {
        state.isUpdateAlbumFetching = false;
        state.isUpdateAlbumSuccess = false;
        state.isUpdateAlbumError = true;
        state.updateAlbumstatus = "Error";
        state.updateAlbumErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateAlbum.rejected, (state, action: any) => {
      state.isUpdateAlbumFetching = false;
      state.isUpdateAlbumSuccess = false;
      state.isUpdateAlbumError = true;
      state.updateAlbumstatus = "Error";
      state.updateAlbumErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteAlbum.pending, (state, action) => {
      state.isDeleteAlbumFetching = true;
      state.isDeleteAlbumSuccess = false;
      state.deleteAlbumstatus = "Loading...";
    }),
    builder.addCase(deleteAlbum.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteAlbumstatus = "Success";
        state.isDeleteAlbumFetching = false;
        state.isDeleteAlbumSuccess = true;
      } else {
        state.isDeleteAlbumFetching = false;
        state.isDeleteAlbumSuccess = false;
        state.isDeleteAlbumError = true;
        state.deleteAlbumstatus = "Error";
        state.deleteAlbumErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteAlbum.rejected, (state, action: any) => {
      state.isDeleteAlbumFetching = false;
      state.isDeleteAlbumSuccess = false;
      state.isDeleteAlbumError = true;
      state.deleteAlbumstatus = "Error";
      state.deleteAlbumErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const AlbumlistSelector = (state: any) => state.Albumlist;
export const { clearState } = AlbumlistSlice.actions;
export default AlbumlistSlice.reducer;
