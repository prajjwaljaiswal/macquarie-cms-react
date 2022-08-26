import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  DailyMarketAnalysislist: [],
  status: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  DailyMarketAnalysisData: [],
  dataStatus: "",
  isDataFetching: false,
  isDataSuccess: false,
  isDataError: false,
  dataErrorMessage: "",

  insertDailyMarketAnalysisstatus: "",
  isInsertDailyMarketAnalysisFetching: false,
  isInsertDailyMarketAnalysisSuccess: false,
  isInsertDailyMarketAnalysisError: false,
  insertDailyMarketAnalysisErrorMessage: "",

  updateDailyMarketAnalysisstatus: "",
  isUpdateDailyMarketAnalysisFetching: false,
  isUpdateDailyMarketAnalysisSuccess: false,
  isUpdateDailyMarketAnalysisError: false,
  updateDailyMarketAnalysisErrorMessage: "",

  deleteDailyMarketAnalysisstatus: "",
  isDeleteDailyMarketAnalysisFetching: false,
  isDeleteDailyMarketAnalysisSuccess: false,
  isDeleteDailyMarketAnalysisError: false,
  deleteDailyMarketAnalysisErrorMessage: "",
};

export const getDailyMarketAnalysislist = createAsyncThunk(
  "/DailyMarketAnalysis",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/DailyMarketAnalysis`)
      .get()
      .json((response: any) => response);
  }
);

export const getDailyMarketAnalysisById = createAsyncThunk(
  "/DailyMarketAnalysis/id",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/DailyMarketAnalysis/${id}`)
      .get()
      .json((response: any) => response);
  }
);

export const insertDailyMarketAnalysis = createAsyncThunk(
  "/DailyMarketAnalysis/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/DailyMarketAnalysis`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateDailyMarketAnalysis = createAsyncThunk(
  "/DailyMarketAnalysis/update",
  async ({ token, id, payload }: any) => {
    return await baseService
      .url(`${api}/DailyMarketAnalysis/update/${id}`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteDailyMarketAnalysis = createAsyncThunk(
  "/DailyMarketAnalysis/delete",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/DailyMarketAnalysis/delete/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const DailyMarketAnalysislistSlice = createSlice({
  name: "DailyMarketAnalysislist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getDailyMarketAnalysislist.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.status = "Loading...";
    }),
    builder.addCase(getDailyMarketAnalysislist.fulfilled, (state, action) => {
      state.status = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.DailyMarketAnalysislist = action.payload;
    }),
    builder.addCase(getDailyMarketAnalysislist.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.status = "Error";
      state.errorMessage = action?.payload?.message;
    }),
    builder.addCase(getDailyMarketAnalysisById.pending, (state, action) => {
      state.isDataFetching = true;
      state.isDataSuccess = false;
      state.dataStatus = "Loading...";
    }),
    builder.addCase(getDailyMarketAnalysisById.fulfilled, (state, action) => {
      state.dataStatus = "Success";
      state.isDataFetching = false;
      state.isDataSuccess = true;
      state.DailyMarketAnalysisData = action.payload;
    }),
    builder.addCase(getDailyMarketAnalysisById.rejected, (state, action: any) => {
      state.isDataFetching = false;
      state.isDataSuccess = false;
      state.isDataError = true;
      state.dataStatus = "Error";
      state.dataErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(insertDailyMarketAnalysis.pending, (state, action) => {
      state.isInsertDailyMarketAnalysisFetching = true;
      state.isInsertDailyMarketAnalysisSuccess = false;
      state.insertDailyMarketAnalysisstatus = "Loading...";
    }),
    builder.addCase(insertDailyMarketAnalysis.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.insertDailyMarketAnalysisstatus = "Success";
        state.isInsertDailyMarketAnalysisFetching = false;
        state.isInsertDailyMarketAnalysisSuccess = true;
      } else {
        state.isInsertDailyMarketAnalysisFetching = false;
        state.isInsertDailyMarketAnalysisSuccess = false;
        state.isInsertDailyMarketAnalysisError = true;
        state.insertDailyMarketAnalysisstatus = "Error";
        state.insertDailyMarketAnalysisErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(insertDailyMarketAnalysis.rejected, (state, action: any) => {
      state.isInsertDailyMarketAnalysisFetching = false;
      state.isInsertDailyMarketAnalysisSuccess = false;
      state.isInsertDailyMarketAnalysisError = true;
      state.insertDailyMarketAnalysisstatus = "Error";
      state.insertDailyMarketAnalysisErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateDailyMarketAnalysis.pending, (state, action) => {
      state.isUpdateDailyMarketAnalysisFetching = true;
      state.isUpdateDailyMarketAnalysisSuccess = false;
      state.updateDailyMarketAnalysisstatus = "Loading...";
    }),
    builder.addCase(updateDailyMarketAnalysis.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateDailyMarketAnalysisstatus = "Success";
        state.isUpdateDailyMarketAnalysisFetching = false;
        state.isUpdateDailyMarketAnalysisSuccess = true;
      } else {
        state.isUpdateDailyMarketAnalysisFetching = false;
        state.isUpdateDailyMarketAnalysisSuccess = false;
        state.isUpdateDailyMarketAnalysisError = true;
        state.updateDailyMarketAnalysisstatus = "Error";
        state.updateDailyMarketAnalysisErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateDailyMarketAnalysis.rejected, (state, action: any) => {
      state.isUpdateDailyMarketAnalysisFetching = false;
      state.isUpdateDailyMarketAnalysisSuccess = false;
      state.isUpdateDailyMarketAnalysisError = true;
      state.updateDailyMarketAnalysisstatus = "Error";
      state.updateDailyMarketAnalysisErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteDailyMarketAnalysis.pending, (state, action) => {
      state.isDeleteDailyMarketAnalysisFetching = true;
      state.isDeleteDailyMarketAnalysisSuccess = false;
      state.deleteDailyMarketAnalysisstatus = "Loading...";
    }),
    builder.addCase(deleteDailyMarketAnalysis.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteDailyMarketAnalysisstatus = "Success";
        state.isDeleteDailyMarketAnalysisFetching = false;
        state.isDeleteDailyMarketAnalysisSuccess = true;
      } else {
        state.isDeleteDailyMarketAnalysisFetching = false;
        state.isDeleteDailyMarketAnalysisSuccess = false;
        state.isDeleteDailyMarketAnalysisError = true;
        state.deleteDailyMarketAnalysisstatus = "Error";
        state.deleteDailyMarketAnalysisErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteDailyMarketAnalysis.rejected, (state, action: any) => {
      state.isDeleteDailyMarketAnalysisFetching = false;
      state.isDeleteDailyMarketAnalysisSuccess = false;
      state.isDeleteDailyMarketAnalysisError = true;
      state.deleteDailyMarketAnalysisstatus = "Error";
      state.deleteDailyMarketAnalysisErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const DailyMarketAnalysislistSelector = (state: any) => state.DailyMarketAnalysislist;
export const { clearState } = DailyMarketAnalysislistSlice.actions;
export default DailyMarketAnalysislistSlice.reducer;
