import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  DwTipsBannerlist: [],
  listStatus: "",
  isListFetching: false,
  isListSuccess: false,
  isListError: false,
  listErrorMessage: "",

  DwTipsBanner: [],
  bannerStatus: "",
  isBannerFetching: false,
  isBannerSuccess: false,
  isBannerError: false,
  bannerErrorMessage: "",

  createDwTipsBannerstatus: "",
  isCreateDwTipsBannerFetching: false,
  isCreateDwTipsBannerSuccess: false,
  isCreateDwTipsBannerError: false,
  createDwTipsBannerErrorMessage: "",

  updateDwTipsBannerstatus: "",
  isUpdateDwTipsBannerFetching: false,
  isUpdateDwTipsBannerSuccess: false,
  isUpdateDwTipsBannerError: false,
  updateDwTipsBannerErrorMessage: "",

  deleteDwTipsBannerstatus: "",
  isDeleteDwTipsBannerFetching: false,
  isDeleteDwTipsBannerSuccess: false,
  isDeleteDwTipsBannerError: false,
  deleteDwTipsBannerErrorMessage: "",
};

export const getDwTipsBannerlist = createAsyncThunk(
  "/DwTipsBanner/list",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/DwTipsBanner`)
      .get()
      .json((response: any) => response);
  }
);

export const getDwTipsBannerById = createAsyncThunk(
  "/DwTipsBanner/:id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/DwTipsBanner/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const createDwTipsBanner = createAsyncThunk(
  "/DwTipsBanner/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/DwTipsBanner`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDwTipsBanner = createAsyncThunk(
  "/DwTipsBanner/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/DwTipsBanner/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteDwTipsBanner = createAsyncThunk(
  "/DwTipsBanner/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/DwTipsBanner/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const DwTipsBannerlistSlice = createSlice({
  name: "DwTipsBannerlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDwTipsBannerlist.pending, (state, action) => {
      state.isListFetching = true;
      state.isListSuccess = false;
      state.listStatus = "Loading...";
    }),
    builder.addCase(getDwTipsBannerlist.fulfilled, (state, action) => {
      state.listStatus = "Success";
      state.isListFetching = false;
      state.isListSuccess = true;
      state.DwTipsBannerlist = action.payload;
    }),
    builder.addCase(getDwTipsBannerlist.rejected, (state, action: any) => {
      state.isListFetching = false;
      state.isListSuccess = false;
      state.isListError = true;
      state.listStatus = "Error";
      state.listErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getDwTipsBannerById.pending, (state, action) => {
      state.isBannerFetching = true;
      state.isBannerSuccess = false;
      state.bannerStatus = "Loading...";
    }),
    builder.addCase(getDwTipsBannerById.fulfilled, (state, action) => {
      state.bannerStatus = "Success";
      state.isBannerFetching = false;
      state.isBannerSuccess = true;
      state.DwTipsBanner = action.payload;
    }),
    builder.addCase(getDwTipsBannerById.rejected, (state, action: any) => {
      state.isBannerFetching = false;
      state.isBannerSuccess = false;
      state.isBannerError = true;
      state.bannerStatus = "Error";
      state.bannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(createDwTipsBanner.pending, (state, action) => {
      state.isCreateDwTipsBannerFetching = true;
      state.isCreateDwTipsBannerSuccess = false;
      state.createDwTipsBannerstatus = "Loading...";
    }),
    builder.addCase(createDwTipsBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.createDwTipsBannerstatus = "Success";
        state.isCreateDwTipsBannerFetching = false;
        state.isCreateDwTipsBannerSuccess = true;
      } else {
        state.isCreateDwTipsBannerFetching = false;
        state.isCreateDwTipsBannerSuccess = false;
        state.isCreateDwTipsBannerError = true;
        state.createDwTipsBannerstatus = "Error";
        state.createDwTipsBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(createDwTipsBanner.rejected, (state, action: any) => {
      state.isCreateDwTipsBannerFetching = false;
      state.isCreateDwTipsBannerSuccess = false;
      state.isCreateDwTipsBannerError = true;
      state.createDwTipsBannerstatus = "Error";
      state.createDwTipsBannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDwTipsBanner.pending, (state, action) => {
      state.isUpdateDwTipsBannerFetching = true;
      state.isUpdateDwTipsBannerSuccess = false;
      state.updateDwTipsBannerstatus = "Loading...";
    }),
    builder.addCase(updateDwTipsBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDwTipsBannerstatus = "Success";
        state.isUpdateDwTipsBannerFetching = false;
        state.isUpdateDwTipsBannerSuccess = true;
      } else {
        state.isUpdateDwTipsBannerFetching = false;
        state.isUpdateDwTipsBannerSuccess = false;
        state.isUpdateDwTipsBannerError = true;
        state.updateDwTipsBannerstatus = "Error";
        state.updateDwTipsBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDwTipsBanner.rejected, (state, action: any) => {
      state.isUpdateDwTipsBannerFetching = false;
      state.isUpdateDwTipsBannerSuccess = false;
      state.isUpdateDwTipsBannerError = true;
      state.updateDwTipsBannerstatus = "Error";
      state.updateDwTipsBannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDwTipsBanner.pending, (state, action) => {
      state.isDeleteDwTipsBannerFetching = true;
      state.isDeleteDwTipsBannerSuccess = false;
      state.deleteDwTipsBannerstatus = "Loading...";
    }),
    builder.addCase(deleteDwTipsBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDwTipsBannerstatus = "Success";
        state.isDeleteDwTipsBannerFetching = false;
        state.isDeleteDwTipsBannerSuccess = true;
      } else {
        state.isDeleteDwTipsBannerFetching = false;
        state.isDeleteDwTipsBannerSuccess = false;
        state.isDeleteDwTipsBannerError = true;
        state.deleteDwTipsBannerstatus = "Error";
        state.deleteDwTipsBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDwTipsBanner.rejected, (state, action: any) => {
      state.isDeleteDwTipsBannerFetching = false;
      state.isDeleteDwTipsBannerSuccess = false;
      state.isDeleteDwTipsBannerError = true;
      state.deleteDwTipsBannerstatus = "Error";
      state.deleteDwTipsBannerErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const DwTipsBannerSelector = (state: any) => state.DwTipsBannerlist;
export const { clearState } = DwTipsBannerlistSlice.actions;
export default DwTipsBannerlistSlice.reducer;
