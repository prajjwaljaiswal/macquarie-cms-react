import { configureStore } from "@reduxjs/toolkit";
import hotlistSlice from "../modules/dashboard/pages/warrant-hotlist/hotlistSlice";
import stockCodeSlice from "../modules/dashboard/pages/warrant-hotlist/stockCodeSlice";
import MMBlistSlice from "../modules/dashboard/pages/morning-market-buzz/MorningMarketBuzzSlice";
import OMWlistSlice from "../modules/dashboard/pages/overnight-market-wrap/OvernightMarketWrapSlice";
import TodayTopPickSlice from "../modules/dashboard/pages/today-top-pick/TodayTopPickSlice";
import loginReducer from "../modules/login/loginSlice";
import IFlistSlice from "../modules/dashboard/pages/index-future/IndexFutureSlice";
import AdBannerlistSlice from "../modules/dashboard/pages/ad-banner/AdBannerSlice";
import HomeBannerlistSlice from "../modules/dashboard/pages/home-banner/HomeBannerSlice";
import SeminarlistSlice from "../modules/dashboard/pages/seminars/SeminarSlice";
import SeminarReglistSlice from "../modules/dashboard/pages/seminar-registration/SeminarRegistrationSlice";
import AlbumCoverSlice from "../modules/dashboard/pages/album-cover/AlbumCoverSlice";
import GallerylistSlice from "../modules/dashboard/pages/photo-gallery/PhotoGallerySlice";
import TermsheetlistSlice from "../modules/dashboard/pages/termsheet-listing-doc/TermSheetListingDocSlice";
import ExpiryAdjustmentNoticeSlice from "../modules/dashboard/pages/expiry-adjustment-notice/ExpiryAdjustmentNoticeSlice";
import ResetPasswordSlice from "../modules/dashboard/pages/reset-password/ResetPasswordSlice";
import NewsletterSlice from "../modules/dashboard/pages/newsletter/NewsletterSlice";
import fasttrackSlice from "../modules/dashboard/pages/fast-track/fasttrackSlice";
import DailySp500Slice from "../modules/dashboard/pages/DailySp500/DailySp500Slice";
import MarketCommentarySlice from "../modules/dashboard/pages/market-commentary/MarketCommentarySlice";
import DailyHsiDwSlice from "../modules/dashboard/pages/DailyHsiDw/DailyHsiDwSlice";
import DailySingleStockSlice from "../modules/dashboard/pages/DailySingleStock/DailySingleStockSlice";
import AllForeignIndexSlice from "../modules/dashboard/pages/AllForeignIndex/AllForeignIndexSlice";

const initState = {
  reducer: {
    login: loginReducer,
    hotlist: hotlistSlice,
    stockCodeList: stockCodeSlice,
    MMBlist: MMBlistSlice,
    OMWlist: OMWlistSlice,
    TTPlist: TodayTopPickSlice,
    IFlist: IFlistSlice,
    AdBannerlist: AdBannerlistSlice,
    HomeBannerlist: HomeBannerlistSlice,
    Seminarlist: SeminarlistSlice,
    SeminarReglist: SeminarReglistSlice,
    Albumlist: AlbumCoverSlice,
    Gallerylist: GallerylistSlice,
    Termsheetlist: TermsheetlistSlice,
    Noticelist: ExpiryAdjustmentNoticeSlice,
    Passwordlist: ResetPasswordSlice,
    Newsletterlist: NewsletterSlice,
    Fasttracklist:fasttrackSlice,
    DailySp500list: DailySp500Slice,
    MarketCommentarylist: MarketCommentarySlice,
    DailyHsiDwlist: DailyHsiDwSlice,
    DailySingleStocklist: DailySingleStockSlice,
    AllForeignIndexlist: AllForeignIndexSlice
  },
};
const store = configureStore(initState);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
