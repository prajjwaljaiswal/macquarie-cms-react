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

export default function Dashboard() {
  return (
    <>
      <NavBar />
      <Grid container>
        <SideBar />
        <Switch>
        <PrivateRoute
            exact
            path="/sg_cms/dashboard/fasttrack"
            component={FastTrackList}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/todaypick"
            component={TodayTopPick}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard"
            component={WarrantHotList}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/general-announcement"
            component={GeneralAnnouncement}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/morning-market-buzz"
            component={MorningMarketBuzz}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/overnight-market-wrap"
            component={OvernightMarketWrap}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/email"
            component={Email}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/newsletter"
            component={Newsletter}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/index-future"
            component={IndexFuture}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/live-matrics-contract"
            component={LiveMatricsContract}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/termsheet-listing-doc"
            component={TermSheetListingDoc}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/expiry-adjustment-notice"
            component={ExpiryAdjustmentNotice}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/seminars"
            component={Seminars}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/seminar-registration"
            component={SeminarRegistration}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/money-flow"
            component={MoneyFlow}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/ad-banner"
            component={AdBanner}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/home-banner"
            component={HomeBanner}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/video-banner"
            component={VideoBanner}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/album-cover"
            component={AlbumCover}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/photo-gallery"
            component={PhotoGallery}
          />
          <PrivateRoute
            exact
            path="/sg_cms/dashboard/reset-password"
            component={ResetPassword}
          />
        </Switch>
      </Grid>
    </>
  );
}
