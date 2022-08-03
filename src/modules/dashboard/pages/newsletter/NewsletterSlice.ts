import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { baseService } from "../../../../services/baseApi";
const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

const initialState = {
  Newsletterlist: "",
  newsletterStatus: "",
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",

  Tipslist: [],
  tipsStatus: "",
  isTipsFetching: false,
  isTipsSuccess: false,
  isTipsError: false,
  tipsErrorMessage: "",

  Newslist: [],
  newsStatus: "",
  isNewsFetching: false,
  isNewsSuccess: false,
  isNewsError: false,
  newsErrorMessage: "",

  updateNewsletterStatus: "",
  isUpdateNewsletterFetching: false,
  isUpdateNewsletterSuccess: false,
  isUpdateNewsletterError: false,
  updateNewsletterErrorMessage: "",

  updateSendStatus: "",
  isUpdateSendFetching: false,
  isUpdateSendSuccess: false,
  isUpdateSendError: false,
  updateSendErrorMessage: "",

  deleteTipsStatus: "",
  isDeleteTipsFetching: false,
  isDeleteTipsSuccess: false,
  isDeleteTipsError: false,
  deleteTipsErrorMessage: "",

  deleteNewsStatus: "",
  isDeleteNewsFetching: false,
  isDeleteNewsSuccess: false,
  isDeleteNewsError: false,
  deleteNewsErrorMessage: "",
};

export const getNewsletter = createAsyncThunk(
  "/newsletter",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/newsletter`)
      .get()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const getNewsletterTips = createAsyncThunk(
  "/newsletter/tips",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/newsletter/tips`)
      .get()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const getNewsletterNews = createAsyncThunk(
  "/newsletter/news",
  async ({ token }: { token: string }) => {
    return await baseService
      .url(`${api}/newsletter/news`)
      .get()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateNewsletter = createAsyncThunk(
  "/newsletter/post",
  async ({ token, payload }: any) => {
    return await baseService
      .url(`${api}/newsletter`)
      .post({ ...payload })
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const updateSendStatus = createAsyncThunk(
  "/newsletter/status",
  async ({ token }: any) => {
    return await baseService
      .url(`${api}/newsletter/status`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteTips = createAsyncThunk(
  "/newsletter/delete/tips",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/newsletter/delete/tips/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const deleteNews = createAsyncThunk(
  "/newsletter/delete/news",
  async ({ token, id }: any) => {
    return await baseService
      .url(`${api}/newsletter/delete/news/${id}`)
      .post()
      .json((response: any) => response)
      .catch((e: any) => {
        throw e;
      });
  }
);

export const NewsletterlistSlice = createSlice({
  name: "Newsletterlist",
  initialState,
  reducers: {
    clearState: (state) => initialState,
  },
  extraReducers: (builder) => [
    builder.addCase(getNewsletter.pending, (state, action) => {
      state.isFetching = true;
      state.isSuccess = false;
      state.newsletterStatus = "Loading...";
    }),
    builder.addCase(getNewsletter.fulfilled, (state, action) => {
      state.newsletterStatus = "Success";
      state.isFetching = false;
      state.isSuccess = true;
      state.Newsletterlist = action.payload;
    }),
    builder.addCase(getNewsletter.rejected, (state, action: any) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = true;
      state.newsletterStatus = "Error";
      state.errorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getNewsletterTips.pending, (state, action) => {
      state.isTipsFetching = true;
      state.isTipsSuccess = false;
      state.tipsStatus = "Loading...";
    }),
    builder.addCase(getNewsletterTips.fulfilled, (state, action) => {
      state.tipsStatus = "Success";
      state.isTipsFetching = false;
      state.isTipsSuccess = true;
      state.Tipslist = action.payload;
    }),
    builder.addCase(getNewsletterTips.rejected, (state, action: any) => {
      state.isTipsFetching = false;
      state.isTipsSuccess = false;
      state.isTipsError = true;
      state.tipsStatus = "Error";
      state.tipsErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(getNewsletterNews.pending, (state, action) => {
      state.isNewsFetching = true;
      state.isNewsSuccess = false;
      state.newsStatus = "Loading...";
    }),
    builder.addCase(getNewsletterNews.fulfilled, (state, action) => {
      state.newsStatus = "Success";
      state.isNewsFetching = false;
      state.isNewsSuccess = true;
      state.Newslist = action.payload;
    }),
    builder.addCase(getNewsletterNews.rejected, (state, action: any) => {
      state.isNewsFetching = false;
      state.isNewsSuccess = false;
      state.isNewsError = true;
      state.newsStatus = "Error";
      state.newsErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateNewsletter.pending, (state, action) => {
      state.isUpdateNewsletterFetching = true;
      state.isUpdateNewsletterSuccess = false;
      state.updateNewsletterStatus = "Loading...";
    }),
    builder.addCase(updateNewsletter.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateNewsletterStatus = "Success";
        state.isUpdateNewsletterFetching = false;
        state.isUpdateNewsletterSuccess = true;
      } else {
        state.isUpdateNewsletterFetching = false;
        state.isUpdateNewsletterSuccess = false;
        state.isUpdateNewsletterError = true;
        state.updateNewsletterStatus = "Error";
        state.updateNewsletterErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateNewsletter.rejected, (state, action: any) => {
      state.isUpdateNewsletterFetching = false;
      state.isUpdateNewsletterSuccess = false;
      state.isUpdateNewsletterError = true;
      state.updateNewsletterStatus = "Error";
      state.updateNewsletterErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(updateSendStatus.pending, (state, action) => {
      state.isUpdateSendFetching = true;
      state.isUpdateSendSuccess = false;
      state.updateSendStatus = "Loading...";
    }),
    builder.addCase(updateSendStatus.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.updateSendStatus = "Success";
        state.isUpdateSendFetching = false;
        state.isUpdateSendSuccess = true;
      } else {
        state.isUpdateSendFetching = false;
        state.isUpdateSendSuccess = false;
        state.isUpdateSendError = true;
        state.updateSendStatus = "Error";
        state.updateSendErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(updateSendStatus.rejected, (state, action: any) => {
      state.isUpdateSendFetching = false;
      state.isUpdateSendSuccess = false;
      state.isUpdateSendError = true;
      state.updateSendStatus = "Error";
      state.updateSendErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteTips.pending, (state, action) => {
      state.isDeleteTipsFetching = true;
      state.isDeleteTipsSuccess = false;
      state.deleteTipsStatus = "Loading...";
    }),
    builder.addCase(deleteTips.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteTipsStatus = "Success";
        state.isDeleteTipsFetching = false;
        state.isDeleteTipsSuccess = true;
      } else {
        state.isDeleteTipsFetching = false;
        state.isDeleteTipsSuccess = false;
        state.isDeleteTipsError = true;
        state.deleteTipsStatus = "Error";
        state.deleteTipsErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteTips.rejected, (state, action: any) => {
      state.isDeleteTipsFetching = false;
      state.isDeleteTipsSuccess = false;
      state.isDeleteTipsError = true;
      state.deleteTipsStatus = "Error";
      state.deleteTipsErrorMessage = action?.payload?.MESSAGE;
    }),
    builder.addCase(deleteNews.pending, (state, action) => {
      state.isDeleteNewsFetching = true;
      state.isDeleteNewsSuccess = false;
      state.deleteNewsStatus = "Loading...";
    }),
    builder.addCase(deleteNews.fulfilled, (state, action) => {
      if (action?.payload?.SUCCESS) {
        state.deleteNewsStatus = "Success";
        state.isDeleteNewsFetching = false;
        state.isDeleteNewsSuccess = true;
      } else {
        state.isDeleteNewsFetching = false;
        state.isDeleteNewsSuccess = false;
        state.isDeleteNewsError = true;
        state.deleteNewsStatus = "Error";
        state.deleteNewsErrorMessage = action?.payload?.MESSAGE;
      }
    }),
    builder.addCase(deleteNews.rejected, (state, action: any) => {
      state.isDeleteNewsFetching = false;
      state.isDeleteNewsSuccess = false;
      state.isDeleteNewsError = true;
      state.deleteNewsStatus = "Error";
      state.deleteNewsErrorMessage = action?.payload?.MESSAGE;
    }),
  ],
});

export const NewsletterlistSelector = (state: any) => state.Newsletterlist;
export const { clearState } = NewsletterlistSlice.actions;
export default NewsletterlistSlice.reducer;
