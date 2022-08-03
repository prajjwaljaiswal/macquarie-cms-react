import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  Enabledlist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  galleryData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertGallerystatus: "",
  isInsertGalleryFetching: false,
  isInsertGallerySuccess: false,
  isInsertGalleryError: false,
  insertGalleryErrorMessage: "",

  deleteGallerystatus: "",
  isDeleteGalleryFetching: false,
  isDeleteGallerySuccess: false,
  isDeleteGalleryError: false,
  deleteGalleryErrorMessage: "",
};

export const getEnabledAlbumList = createAsyncThunk(
  "/album/get",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/album/enabledlist`)
      .get()
      .json((response: any) => response);
  }
);

export const getGalleryListById = createAsyncThunk(
  "/gallery/id",
  async ({ token, id, page }: any) => {
    return await baseService
      .url(`${api}/gallery/${id}/${page}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertGallery = createAsyncThunk(
  "/gallery/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/gallery`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteGallery = createAsyncThunk(
  "/gallery/delete",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/gallery/delete/`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const GallerylistSlice = createSlice({
  name: "Gallerylist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getEnabledAlbumList.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getEnabledAlbumList.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.Enabledlist = action.payload;
    }),
    builder.addCase(getEnabledAlbumList.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getGalleryListById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getGalleryListById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.galleryData = action.payload;
    }),
    builder.addCase(getGalleryListById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertGallery.pending, (state, action) => {
      state.isInsertGalleryFetching = true;
      state.isInsertGallerySuccess = false;
      state.insertGallerystatus = "Loading...";
    }),
    builder.addCase(insertGallery.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertGallerystatus = "Success";
        state.isInsertGalleryFetching = false;
        state.isInsertGallerySuccess = true;
      } else {
        state.isInsertGalleryFetching = false;
        state.isInsertGallerySuccess = false;
        state.isInsertGalleryError = true;
        state.insertGallerystatus = "Error";
        state.insertGalleryErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertGallery.rejected, (state, action: any) => {
      state.isInsertGalleryFetching = false;
      state.isInsertGallerySuccess = false;
      state.isInsertGalleryError = true;
      state.insertGallerystatus = "Error";
      state.insertGalleryErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteGallery.pending, (state, action) => {
      state.isDeleteGalleryFetching = true;
      state.isDeleteGallerySuccess = false;
      state.deleteGallerystatus = "Loading...";
    }),
    builder.addCase(deleteGallery.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteGallerystatus = "Success";
        state.isDeleteGalleryFetching = false;
        state.isDeleteGallerySuccess = true;
      } else {
        state.isDeleteGalleryFetching = false;
        state.isDeleteGallerySuccess = false;
        state.isDeleteGalleryError = true;
        state.deleteGallerystatus = "Error";
        state.deleteGalleryErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteGallery.rejected, (state, action: any) => {
      state.isDeleteGalleryFetching = false;
      state.isDeleteGallerySuccess = false;
      state.isDeleteGalleryError = true;
      state.deleteGallerystatus = "Error";
      state.deleteGalleryErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const GallerylistSelector = (state: any) => state.Gallerylist;
export const { clearState } = GallerylistSlice.actions;
export default GallerylistSlice.reducer;
