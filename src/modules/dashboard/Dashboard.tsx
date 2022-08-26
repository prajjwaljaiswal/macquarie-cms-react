import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, Switch, useHistory } from "react-router-dom";
import NavBar from "./navigation/NavBar";
import SideBar from "./sidebar/SideBar";
import "./Dashboard.css";
import PrivateRoute from "../app/PrivateRoutes";
import WarrantHotList from "./pages/warrant-hotlist/WarrantHotList";
import GeneralAnnouncement from "./pages/general-announcement/GeneralAnnouncement";
import MorningMarketBuzz from "./pages/morning-market-buzz/MorningMarketBuzz";
import OvernightMarketWrap from "./pages/overnight-market-wrap/OvernightMarketWrap";
import Email from "./pages/email/Email";
import IndexFuture from "./pages/index-future/IndexFuture";
import LiveMatricsContract from "./pages/live-matrics-contract/LiveMatricsContract";
import TermSheetListingDoc from "./pages/termsheet-listing-doc/TermSheetListingDoc";
import ExpiryAdjustmentNotice from "./pages/expiry-adjustment-notice/ExpiryAdjustmentNotice";
import Seminars from "./pages/seminars/Seminars";
import MoneyFlow from "./pages/money-flow/MoneyFlow";
import AdBanner from "./pages/ad-banner/AdBanner";
import HomeBanner from "./pages/home-banner/HomeBanner";
import VideoBanner from "./pages/video-banner/VideoBanner";
import AlbumCover from "./pages/album-cover/AlbumCover";
import PhotoGallery from "./pages/photo-gallery/PhotoGallery";
import SeminarRegistration from "./pages/seminar-registration/SeminarRegistration";
import { Container, Grid } from "@material-ui/core";
import Newsletter from "./pages/newsletter/Newsletter";
import ResetPassword from "./pages/reset-password/ResetPassword";
import FastTrackList from "./pages/fast-track/fasttrackList";
import TodayTopPick from "./pages/today-top-pick/TodayTopPick";
import DailySp500 from "./pages/DailySp500/DailySp500";
import MarketCommentary from "./pages/market-commentary/MarketCommentary";
import DailyHsiDw from "./pages/DailyHsiDw/DailyHsiDw";
import DailySingleStock from "./pages/DailySingleStock/DailySingleStock";
import AllForeignIndex from "./pages/AllForeignIndex/AllForeignIndex";
import Cautionlist from "./pages/caution-list/cautionList";
import Dw28Update from "./pages/Dw28Update/Dw28Update";
import DwInventory from "./pages/DwInventory/DwInventory";
import DailyMarketAnalysis from "./pages/DailyMarketAnalysis/DailyMarketAnalysis";
import DwSet50Tips from "./pages/DwSet50Tips/DwSet50Tips";
import HotTopicReview from "./pages/HotTopicReview/HotTopicReview";
import DwTipsBanner from "./pages/DwTipsBanner/DwTipsBanner";

export default function Dashboard() {
  return (
    <>
      <NavBar />
      <Grid container>
        <SideBar />
        <Switch>
        <PrivateRoute
            exact
            path="/th_cms/dashboard/fasttrack"
            component={FastTrackList}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/todaypick"
            component={TodayTopPick}
          />
           <PrivateRoute
            exact
            path="/th_cms/dashboard/market-commentary"
            component={MarketCommentary}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/dw-inventory"
            component={DwInventory}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/daily-market-analysis"
            component={DailyMarketAnalysis}
          />

          <PrivateRoute
            exact
            path="/th_cms/dashboard/dw-set50-tips"
            component={DwSet50Tips}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/dw-tips-banner"
            component={DwTipsBanner}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/hot-topic-review"
            component={HotTopicReview}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/DailySp500"
            component={DailySp500}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/DailyHsiDwUpdate"
            component={DailyHsiDw}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/DailySingleStockUpdate"
            component={DailySingleStock}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/AllForeignIndex"
            component={AllForeignIndex}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard"
            component={WarrantHotList}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/general-announcement"
            component={GeneralAnnouncement}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/morning-market-buzz"
            component={MorningMarketBuzz}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/overnight-market-wrap"
            component={OvernightMarketWrap}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/email"
            component={Email}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/newsletter"
            component={Newsletter}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/index-future"
            component={IndexFuture}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/dw28update"
            component={Dw28Update}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/cautionlist"
            component={Cautionlist}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/live-matrics-contract"
            component={LiveMatricsContract}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/termsheet-listing-doc"
            component={TermSheetListingDoc}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/expiry-adjustment-notice"
            component={ExpiryAdjustmentNotice}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/seminars"
            component={Seminars}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/seminar-registration"
            component={SeminarRegistration}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/money-flow"
            component={MoneyFlow}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/ad-banner"
            component={AdBanner}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/home-banner"
            component={HomeBanner}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/video-banner"
            component={VideoBanner}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/album-cover"
            component={AlbumCover}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/photo-gallery"
            component={PhotoGallery}
          />
          <PrivateRoute
            exact
            path="/th_cms/dashboard/reset-password"
            component={ResetPassword}
          />
        </Switch>
      </Grid>
    </>
  );
}
