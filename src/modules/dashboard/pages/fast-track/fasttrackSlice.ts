import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  fasttracklist: [],
  FastTrackListStatus: "",
  isFastTrackListFetching: false,
  isFastTrackListSuccess: false,
  isFastTrackListError: false,
  FastTrackListErrorMessage: "",



  isFastTrackListUpdating: false,
  FastTrackListUpdateStatus: "",
  isFastTrackListUpdateSuccess: false,
  HotListDeleteError: false,
  hotListDeleteErrorMessage: "",
};

export const getHotList = createAsyncThunk(
  "/fasttrack/get",
  async (
    { token }: { token: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await baseService.url(`${api}/fastrack`).get().json();
      return fulfillWithValue(response);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const updateFastTrackList = createAsyncThunk(
  "/fasttrack/update",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/fastrack/update`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const fasttrackSlice = createSlice({
  name: "Fasttracklist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getHotList.pending, (state, action) => {
      state.isFastTrackListFetching = true;
      state.isFastTrackListSuccess = false;
      state.FastTrackListStatus = "Loading...";
    }),
    builder.addCase(getHotList.fulfilled, (state, action: any) => {
      if (Array.isArray(action?.payload)) {
        state.FastTrackListStatus = "Success";
        state.isFastTrackListFetching = false;
        state.isFastTrackListSuccess = true;
        state.fasttracklist = action.payload;
      } else {
        state.isFastTrackListFetching = false;
        state.isFastTrackListSuccess = false;
        state.isFastTrackListError = true;
        state.FastTrackListStatus = "Error";
        state.FastTrackListErrorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(getHotList.rejected, (state, action: any) => {
      state.isFastTrackListFetching = false;
      state.isFastTrackListSuccess = false;
      state.isFastTrackListError = true;
      state.FastTrackListStatus = "Error";
      state.FastTrackListErrorMessage = action?.payload?.message;
    }),
    builder.addCase(updateFastTrackList.pending, (state, action: any) => {
      state.isFastTrackListUpdating = false;
      state.isFastTrackListUpdateSuccess = false;
      state.FastTrackListUpdateStatus = "Loading...";
    }),
    builder.addCase(updateFastTrackList.fulfilled, (state, action: any) => {
      if (action?.payload?.success) {
        state.FastTrackListUpdateStatus = "Success";
        state.isFastTrackListUpdating = false;
        state.isFastTrackListUpdateSuccess = true;
      } else {
        state.isFastTrackListUpdating = false;
        state.isFastTrackListUpdateSuccess = false;
        state.FastTrackListUpdateStatus = "Error";
        state.hotListDeleteErrorMessage = action?.payload?.message;
        state.HotListDeleteError = true;
      }
    }),
    builder.addCase(updateFastTrackList.rejected, (state, action: any) => {
      state.isFastTrackListUpdating = false;
      state.isFastTrackListUpdateSuccess = false;
      state.FastTrackListUpdateStatus = "Error";
      state.hotListDeleteErrorMessage = action?.payload?.message;
      state.HotListDeleteError = true;
    }),
  ],
});

export const FastTrackSelector = (state: any) => state.Fasttracklist;
export const { clearState } = fasttrackSlice.actions;
export default fasttrackSlice.reducer;
