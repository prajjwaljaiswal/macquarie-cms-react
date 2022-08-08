import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  cautionlist: [],
  cautionlistStatus: "",
  iscautionlistFetching: false,
  iscautionlistSuccess: false,
  iscautionlistError: false,
  cautionlistErrorMessage: "",



  iscautionlistUpdating: false,
  cautionlistUpdateStatus: "",
  iscautionlistUpdateSuccess: false,
  HotListDeleteError: false,
  hotListDeleteErrorMessage: "",
};

export const getHotList = createAsyncThunk(
  "/caution-list/get",
  async (
    { token }: { token: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await baseService.url(`${api}/caution-list`).get().json();
      return fulfillWithValue(response);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const updatecautionlist = createAsyncThunk(
  "/caution-list/update",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/caution-list/update`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const cautionSlice = createSlice({
  name: "cautionlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getHotList.pending, (state, action) => {
      state.iscautionlistFetching = true;
      state.iscautionlistSuccess = false;
      state.cautionlistStatus = "Loading...";
    }),
    builder.addCase(getHotList.fulfilled, (state, action: any) => {
      if (Array.isArray(action?.payload)) {
        state.cautionlistStatus = "Success";
        state.iscautionlistFetching = false;
        state.iscautionlistSuccess = true;
        state.cautionlist = action.payload;
      } else {
        state.iscautionlistFetching = false;
        state.iscautionlistSuccess = false;
        state.iscautionlistError = true;
        state.cautionlistStatus = "Error";
        state.cautionlistErrorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(getHotList.rejected, (state, action: any) => {
      state.iscautionlistFetching = false;
      state.iscautionlistSuccess = false;
      state.iscautionlistError = true;
      state.cautionlistStatus = "Error";
      state.cautionlistErrorMessage = action?.payload?.message;
    }),
    builder.addCase(updatecautionlist.pending, (state, action: any) => {
      state.iscautionlistUpdating = false;
      state.iscautionlistUpdateSuccess = false;
      state.cautionlistUpdateStatus = "Loading...";
    }),
    builder.addCase(updatecautionlist.fulfilled, (state, action: any) => {
      if (action?.payload?.success) {
        state.cautionlistUpdateStatus = "Success";
        state.iscautionlistUpdating = false;
        state.iscautionlistUpdateSuccess = true;
      } else {
        state.iscautionlistUpdating = false;
        state.iscautionlistUpdateSuccess = false;
        state.cautionlistUpdateStatus = "Error";
        state.hotListDeleteErrorMessage = action?.payload?.message;
        state.HotListDeleteError = true;
      }
    }),
    builder.addCase(updatecautionlist.rejected, (state, action: any) => {
      state.iscautionlistUpdating = false;
      state.iscautionlistUpdateSuccess = false;
      state.cautionlistUpdateStatus = "Error";
      state.hotListDeleteErrorMessage = action?.payload?.message;
      state.HotListDeleteError = true;
    }),
  ],
});

export const cautionSelector = (state: any) => state.cautionlist;
export const { clearState } = cautionSlice.actions;
export default cautionSlice.reducer;
