import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  AdBannerlist: [],
  listStatus: "",
  isListFetching: false,
  isListSuccess: false,
  isListError: false,
  listErrorMessage: "",

  AdBanner: [],
  bannerStatus: "",
  isBannerFetching: false,
  isBannerSuccess: false,
  isBannerError: false,
  bannerErrorMessage: "",

  createAdBannerstatus: "",
  isCreateAdBannerFetching: false,
  isCreateAdBannerSuccess: false,
  isCreateAdBannerError: false,
  createAdBannerErrorMessage: "",

  updateAdBannerstatus: "",
  isUpdateAdBannerFetching: false,
  isUpdateAdBannerSuccess: false,
  isUpdateAdBannerError: false,
  updateAdBannerErrorMessage: "",

  deleteAdBannerstatus: "",
  isDeleteAdBannerFetching: false,
  isDeleteAdBannerSuccess: false,
  isDeleteAdBannerError: false,
  deleteAdBannerErrorMessage: "",
};

export const getAdBannerlist = createAsyncThunk(
  "/adbanner/list",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/adbanner`)
      .get()
      .json((response: any) => response);
  }
);

export const getAdBannerById = createAsyncThunk(
  "/adbanner/:id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/adbanner/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const createAdBanner = createAsyncThunk(
  "/adbanner/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/adbanner`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateAdBanner = createAsyncThunk(
  "/adbanner/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/adbanner/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteAdBanner = createAsyncThunk(
  "/adbanner/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/adbanner/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const AdBannerlistSlice = createSlice({
  name: "AdBannerlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getAdBannerlist.pending, (state, action) => {
      state.isListFetching = true;
      state.isListSuccess = false;
      state.listStatus = "Loading...";
    }),
    builder.addCase(getAdBannerlist.fulfilled, (state, action) => {
      state.listStatus = "Success";
      state.isListFetching = false;
      state.isListSuccess = true;
      state.AdBannerlist = action.payload;
    }),
    builder.addCase(getAdBannerlist.rejected, (state, action: any) => {
      state.isListFetching = false;
      state.isListSuccess = false;
      state.isListError = true;
      state.listStatus = "Error";
      state.listErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getAdBannerById.pending, (state, action) => {
      state.isBannerFetching = true;
      state.isBannerSuccess = false;
      state.bannerStatus = "Loading...";
    }),
    builder.addCase(getAdBannerById.fulfilled, (state, action) => {
      state.bannerStatus = "Success";
      state.isBannerFetching = false;
      state.isBannerSuccess = true;
      state.AdBanner = action.payload;
    }),
    builder.addCase(getAdBannerById.rejected, (state, action: any) => {
      state.isBannerFetching = false;
      state.isBannerSuccess = false;
      state.isBannerError = true;
      state.bannerStatus = "Error";
      state.bannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(createAdBanner.pending, (state, action) => {
      state.isCreateAdBannerFetching = true;
      state.isCreateAdBannerSuccess = false;
      state.createAdBannerstatus = "Loading...";
    }),
    builder.addCase(createAdBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.createAdBannerstatus = "Success";
        state.isCreateAdBannerFetching = false;
        state.isCreateAdBannerSuccess = true;
      } else {
        state.isCreateAdBannerFetching = false;
        state.isCreateAdBannerSuccess = false;
        state.isCreateAdBannerError = true;
        state.createAdBannerstatus = "Error";
        state.createAdBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(createAdBanner.rejected, (state, action: any) => {
      state.isCreateAdBannerFetching = false;
      state.isCreateAdBannerSuccess = false;
      state.isCreateAdBannerError = true;
      state.createAdBannerstatus = "Error";
      state.createAdBannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateAdBanner.pending, (state, action) => {
      state.isUpdateAdBannerFetching = true;
      state.isUpdateAdBannerSuccess = false;
      state.updateAdBannerstatus = "Loading...";
    }),
    builder.addCase(updateAdBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateAdBannerstatus = "Success";
        state.isUpdateAdBannerFetching = false;
        state.isUpdateAdBannerSuccess = true;
      } else {
        state.isUpdateAdBannerFetching = false;
        state.isUpdateAdBannerSuccess = false;
        state.isUpdateAdBannerError = true;
        state.updateAdBannerstatus = "Error";
        state.updateAdBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateAdBanner.rejected, (state, action: any) => {
      state.isUpdateAdBannerFetching = false;
      state.isUpdateAdBannerSuccess = false;
      state.isUpdateAdBannerError = true;
      state.updateAdBannerstatus = "Error";
      state.updateAdBannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteAdBanner.pending, (state, action) => {
      state.isDeleteAdBannerFetching = true;
      state.isDeleteAdBannerSuccess = false;
      state.deleteAdBannerstatus = "Loading...";
    }),
    builder.addCase(deleteAdBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteAdBannerstatus = "Success";
        state.isDeleteAdBannerFetching = false;
        state.isDeleteAdBannerSuccess = true;
      } else {
        state.isDeleteAdBannerFetching = false;
        state.isDeleteAdBannerSuccess = false;
        state.isDeleteAdBannerError = true;
        state.deleteAdBannerstatus = "Error";
        state.deleteAdBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteAdBanner.rejected, (state, action: any) => {
      state.isDeleteAdBannerFetching = false;
      state.isDeleteAdBannerSuccess = false;
      state.isDeleteAdBannerError = true;
      state.deleteAdBannerstatus = "Error";
      state.deleteAdBannerErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const AdBannerSelector = (state: any) => state.AdBannerlist;
export const { clearState } = AdBannerlistSlice.actions;
export default AdBannerlistSlice.reducer;
