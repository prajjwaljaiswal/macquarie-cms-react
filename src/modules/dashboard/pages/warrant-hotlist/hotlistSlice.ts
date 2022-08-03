import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  hotlist: [],
  hotListStatus: "",
  isHotListFetching: false,
  isHotListSuccess: false,
  isHotListError: false,
  hotListErrorMessage: "",
  isHotListDeleting: false,
  hotListDeleteStatus: "",
  isHotListDeleteSuccess: false,
  HotListDeleteError: false,
  hotListDeleteErrorMessage: "",
};

export const getHotList = createAsyncThunk(
  "/hotlist/get",
  async (
    { token }: { token: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await baseService.url(`${api}/hotlist`).get().json();
      return fulfillWithValue(response);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const deleteHotList = createAsyncThunk(
  "/hotlist/delete",
  async (
    { token, category, id }: { token: string; category: string; id: number },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await baseService
        .url(`${api}/hotlist/delete`)
        .post({ category: category, id: id })
        .json();
      return fulfillWithValue(response);
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const hotlistSlice = createSlice({
  name: "hotlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getHotList.pending, (state, action) => {
      state.isHotListFetching = true;
      state.isHotListSuccess = false;
      state.hotListStatus = "Loading...";
    }),
    builder.addCase(getHotList.fulfilled, (state, action: any) => {
      if (Array.isArray(action?.payload)) {
        state.hotListStatus = "Success";
        state.isHotListFetching = false;
        state.isHotListSuccess = true;
        state.hotlist = action.payload;
      } else {
        state.isHotListFetching = false;
        state.isHotListSuccess = false;
        state.isHotListError = true;
        state.hotListStatus = "Error";
        state.hotListErrorMessage = action?.payload?.message;
      }
    }),
    builder.addCase(getHotList.rejected, (state, action: any) => {
      state.isHotListFetching = false;
      state.isHotListSuccess = false;
      state.isHotListError = true;
      state.hotListStatus = "Error";
      state.hotListErrorMessage = action?.payload?.message;
    }),
    builder.addCase(deleteHotList.pending, (state, action: any) => {
      state.isHotListDeleting = false;
      state.isHotListDeleteSuccess = false;
      state.hotListDeleteStatus = "Loading...";
    }),
    builder.addCase(deleteHotList.fulfilled, (state, action: any) => {
      if (action?.payload?.success) {
        state.hotListDeleteStatus = "Success";
        state.isHotListDeleting = false;
        state.isHotListDeleteSuccess = true;
      } else {
        state.isHotListDeleting = false;
        state.isHotListDeleteSuccess = false;
        state.hotListDeleteStatus = "Error";
        state.hotListDeleteErrorMessage = action?.payload?.message;
        state.HotListDeleteError = true;
      }
    }),
    builder.addCase(deleteHotList.rejected, (state, action: any) => {
      state.isHotListDeleting = false;
      state.isHotListDeleteSuccess = false;
      state.hotListDeleteStatus = "Error";
      state.hotListDeleteErrorMessage = action?.payload?.message;
      state.HotListDeleteError = true;
    }),
  ],
});

export const hotlistSelector = (state: any) => state.hotlist;
export const { clearState } = hotlistSlice.actions;
export default hotlistSlice.reducer;
