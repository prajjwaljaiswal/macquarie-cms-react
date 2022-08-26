import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import { baseService } from "../../../../services/baseApi";

const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
    DwInventorylist: [],
    status: "",
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",

    isDeleteFetching: false,
    isDeleteSuccess: false,
    isDeleteError: false,


    insertDwInventorystatus: "",
    isInsertDwInventoryFetching: false,
    isInsertDwInventorySuccess: false,
    isInsertDwInventoryError: false,
    insertDwInventoryErrorMessage: "",


    DailyInventoryDataSearch: [],
    isDataSearchStatus: "",
    isDataSearchFetching: false,
    isDataSearchSuccess: false,
    isDataSearchError: false,
    dataSearchErrorMessage: "",

    isDataError: false,
    dataErrorMessage: "",

}

export const getDwInventorylist = createAsyncThunk(
    "DwInventory",
    async ({token}: {token: string}) => {
        return await baseService
        .url(`${api}/dwInventory`)
        .get()
        .json((response: any) => response)
    }
);


export const getDailyInventorySearch = createAsyncThunk(
    "/power-search/symbol",
    async ({ token, ric }: any) => {
      return await baseService
        .url(`${api}/power-search/symbol?ric=${ric}`)
        .get()
        .json((response: any) => response);
    }
  );


  export const insertDwInventory = createAsyncThunk(
    "/DwInventory/post",
    async ({ token, payload }: any) => {
      return await baseService
        .url(`${api}/DwInventory`)
        .post({ ...payload })
        .json((response: any) => response)
        .catch((e: any) => {
          throw e;
        });
    }
  );


  export const deleteDwInventory = createAsyncThunk(
    "/DwInventory/delete",
    async ({ token, selected }: any) => {
      return await baseService
        .url(`${api}/DwInventory/delete`)
        .post({ ...selected })
        .json((response: any) => response)
        .catch((e: any) => {
          throw e;
        });
    }
  );


export const DwInventorySlice: any = createSlice({
    name: "DwInventory",
    initialState,
    reducers: {
        clearState: (state) => initialState,        
    },
    extraReducers: (builder) => [
        builder.addCase(getDwInventorylist.pending, (state, action) => {
          state.isFetching = true;
          state.isSuccess = false;
          state.status = "Loading...";
        }),
        builder.addCase(getDwInventorylist.fulfilled, (state, action) => {
          state.status = "Success";
          state.isFetching = false;
          state.isSuccess = true;
          state.DwInventorylist = action.payload;
        }),
        builder.addCase(getDwInventorylist.rejected, (state, action: any) => {
          state.isDeleteFetching = false;
          state.isDeleteSuccess = false;
          state.isDeleteError = true;
          state.status = "Error";
          state.errorMessage = action?.payload?.message;
        }),

        builder.addCase(deleteDwInventory.pending, (state, action) => {
          state.isDeleteFetching = true;
          state.isDeleteSuccess = false;
          state.status = "Loading...";
        }),
        builder.addCase(deleteDwInventory.fulfilled, (state, action) => {
          state.status = "Success";
          state.isDeleteFetching = false;
          state.isDeleteSuccess = true;
          state.isDeleteError = false;
        }),
        builder.addCase(deleteDwInventory.rejected, (state, action: any) => {
          state.isFetching = false;
          state.isSuccess = false;
          state.isError = true;
          state.status = "Error";
          state.errorMessage = action?.payload?.message;
        }),

        builder.addCase(getDailyInventorySearch.pending, (state, action) => {
            state.isDataSearchFetching = true;
            state.isDataSearchSuccess = false;
            state.isDataSearchStatus = "Loading...";
          }),
          builder.addCase(getDailyInventorySearch.fulfilled, (state, action) => {
            state.isDataSearchStatus = "Success";
            state.isDataSearchFetching = false;
            state.isDataSearchSuccess = true;
            state.DailyInventoryDataSearch = action.payload;
          }),
          builder.addCase(getDailyInventorySearch.rejected, (state, action: any) => {
            state.isDataSearchFetching = false;
            state.isDataSearchSuccess = false;
            state.isDataError = true;
            state.isDataSearchStatus = "Error";
            state.dataErrorMessage = action?.payload?.MESSAGE;
          }),
          builder.addCase(insertDwInventory.pending, (state, action) => {
            state.isInsertDwInventoryFetching = true;
            state.isInsertDwInventorySuccess = false;
            state.insertDwInventorystatus = "Loading...";
          }),
          builder.addCase(insertDwInventory.fulfilled, (state, action) => {
            if (action?.payload?.SUCCESS) {
              state.insertDwInventorystatus = "Success";
              state.isInsertDwInventoryFetching = false;
              state.isInsertDwInventorySuccess = true;
            } else {
              state.isInsertDwInventoryFetching = false;
              state.isInsertDwInventorySuccess = false;
              state.isInsertDwInventoryError = true;
              state.insertDwInventorystatus = "Error";
              state.insertDwInventoryErrorMessage = action?.payload?.MESSAGE;
            }
          }),
          builder.addCase(insertDwInventory.rejected, (state, action: any) => {
            state.isInsertDwInventoryFetching = false;
            state.isInsertDwInventorySuccess = false;
            state.isInsertDwInventoryError = true;
            state.insertDwInventorystatus = "Error";
            state.insertDwInventoryErrorMessage = action?.payload?.MESSAGE;
          }),
    ]

})

export const DwInventorySelector = (state: any) => state.DwInventorylist;

export const { clearState } = DwInventorySlice.actions;

export default DwInventorySlice.reducer;
