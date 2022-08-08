import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  HomeBannerlist: [],
  listStatus: "",
  isListFetching: false,
  isListSuccess: false,
  isListError: false,
  listErrorMessage: "",

  HomeBanner: [],
  bannerStatus: "",
  isBannerFetching: false,
  isBannerSuccess: false,
  isBannerError: false,
  bannerErrorMessage: "",

  createHomeBannerstatus: "",
  isCreateHomeBannerFetching: false,
  isCreateHomeBannerSuccess: false,
  isCreateHomeBannerError: false,
  createHomeBannerErrorMessage: "",

  updateHomeBannerstatus: "",
  isUpdateHomeBannerFetching: false,
  isUpdateHomeBannerSuccess: false,
  isUpdateHomeBannerError: false,
  updateHomeBannerErrorMessage: "",

  deleteHomeBannerstatus: "",
  isDeleteHomeBannerFetching: false,
  isDeleteHomeBannerSuccess: false,
  isDeleteHomeBannerError: false,
  deleteHomeBannerErrorMessage: "",
};

export const getHomeBannerlist = createAsyncThunk(
  "/homebanner/list",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/homebanner`)
      .get()
      .json((response: any) =>  {
        console.log(response);
         return response
      });
  }
);

export const getHomeBannerById = createAsyncThunk(
  "/homebanner/:id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/homebanner/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const createHomeBanner = createAsyncThunk(
  "/homebanner/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/homebanner`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateHomeBanner = createAsyncThunk(
  "/homebanner/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/homebanner/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteHomeBanner = createAsyncThunk(
  "/homebanner/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/homebanner/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const HomeBannerlistSlice = createSlice({
  name: "AdHomeBannerlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getHomeBannerlist.pending, (state, action) => {
      state.isListFetching = true;
      state.isListSuccess = false;
      state.listStatus = "Loading...";
    }),
    builder.addCase(getHomeBannerlist.fulfilled, (state, action) => {
      state.listStatus = "Success";
      state.isListFetching = false;
      state.isListSuccess = true;
      state.HomeBannerlist = action.payload;
    }),
    builder.addCase(getHomeBannerlist.rejected, (state, action: any) => {
      state.isListFetching = false;
      state.isListSuccess = false;
      state.isListError = true;
      state.listStatus = "Error";
      state.listErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getHomeBannerById.pending, (state, action) => {
      state.isBannerFetching = true;
      state.isBannerSuccess = false;
      state.bannerStatus = "Loading...";
    }),
    builder.addCase(getHomeBannerById.fulfilled, (state, action) => {
      state.bannerStatus = "Success";
      state.isBannerFetching = false;
      state.isBannerSuccess = true;
      state.HomeBanner = action.payload;
    }),
    builder.addCase(getHomeBannerById.rejected, (state, action: any) => {
      state.isBannerFetching = false;
      state.isBannerSuccess = false;
      state.isBannerError = true;
      state.bannerStatus = "Error";
      state.bannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(createHomeBanner.pending, (state, action) => {
      state.isCreateHomeBannerFetching = true;
      state.isCreateHomeBannerSuccess = false;
      state.createHomeBannerstatus = "Loading...";
    }),
    builder.addCase(createHomeBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.createHomeBannerstatus = "Success";
        state.isCreateHomeBannerFetching = false;
        state.isCreateHomeBannerSuccess = true;
      } else {
        state.isCreateHomeBannerFetching = false;
        state.isCreateHomeBannerSuccess = false;
        state.isCreateHomeBannerError = true;
        state.createHomeBannerstatus = "Error";
        state.createHomeBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(createHomeBanner.rejected, (state, action: any) => {
      state.isCreateHomeBannerFetching = false;
      state.isCreateHomeBannerSuccess = false;
      state.isCreateHomeBannerError = true;
      state.createHomeBannerstatus = "Error";
      state.createHomeBannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateHomeBanner.pending, (state, action) => {
      state.isUpdateHomeBannerFetching = true;
      state.isUpdateHomeBannerSuccess = false;
      state.updateHomeBannerstatus = "Loading...";
    }),
    builder.addCase(updateHomeBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateHomeBannerstatus = "Success";
        state.isUpdateHomeBannerFetching = false;
        state.isUpdateHomeBannerSuccess = true;
      } else {
        state.isUpdateHomeBannerFetching = false;
        state.isUpdateHomeBannerSuccess = false;
        state.isUpdateHomeBannerError = true;
        state.updateHomeBannerstatus = "Error";
        state.updateHomeBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateHomeBanner.rejected, (state, action: any) => {
      state.isUpdateHomeBannerFetching = false;
      state.isUpdateHomeBannerSuccess = false;
      state.isUpdateHomeBannerError = true;
      state.updateHomeBannerstatus = "Error";
      state.updateHomeBannerErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteHomeBanner.pending, (state, action) => {
      state.isDeleteHomeBannerFetching = true;
      state.isDeleteHomeBannerSuccess = false;
      state.deleteHomeBannerstatus = "Loading...";
    }),
    builder.addCase(deleteHomeBanner.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteHomeBannerstatus = "Success";
        state.isDeleteHomeBannerFetching = false;
        state.isDeleteHomeBannerSuccess = true;
      } else {
        state.isDeleteHomeBannerFetching = false;
        state.isDeleteHomeBannerSuccess = false;
        state.isDeleteHomeBannerError = true;
        state.deleteHomeBannerstatus = "Error";
        state.deleteHomeBannerErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteHomeBanner.rejected, (state, action: any) => {
      state.isDeleteHomeBannerFetching = false;
      state.isDeleteHomeBannerSuccess = false;
      state.isDeleteHomeBannerError = true;
      state.deleteHomeBannerstatus = "Error";
      state.deleteHomeBannerErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const HomeBannerSelector = (state: any) => state.HomeBannerlist;
export const { clearState } = HomeBannerlistSlice.actions;
export default HomeBannerlistSlice.reducer;
