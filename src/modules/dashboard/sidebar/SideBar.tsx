import { List, ListItem, makeStyles, MenuItem } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { clearState } from "../../login/loginSlice";
import "./SideBar.css";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: "5px",
    cursor: "pointer",
  },
}));

export default function SideBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selected, setSelected] = useState<number>(1);

  async function handleLogout() {
    try {
      if (confirm("Are you sure to logout?")) {
        sessionStorage.setItem("token", "");
        dispatch(clearState());
        history.push("/sg_cms/");
      }
    } catch {
      console.log("failed to logout");
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-wrapper">
        <div className="sidebar-menu">
          <List className="sidebar-list">


          <Link to="/sg_cms/dashboard" className="link">
              <ListItem
                selected={selected === 1}
                className={classes.listItem}
                onClick={() => setSelected(1)}
              >
                Trending Warrants
              </ListItem>
            </Link>

          <Link to="/sg_cms/dashboard/fasttrack" className="link">
              <ListItem
                selected={selected === 15}
                className={classes.listItem}
                onClick={() => setSelected(15)}
              >
                Fast Track
              </ListItem>
            </Link>



            <Link to="/sg_cms/dashboard/todaypick" className="link">
              <ListItem
                selected={selected === 16}
                className={classes.listItem}
                onClick={() => setSelected(16)}
              >
                Today's Top Picks
              </ListItem>
            </Link>


            <Link to="/sg_cms/dashboard/market-commentary" className="link">
              <ListItem
                selected={selected === 18}
                className={classes.listItem}
                onClick={() => setSelected(18)}
              >
                Market Commentary
              </ListItem>
            </Link>


            <Link to="/sg_cms/dashboard/DailySp500" className="link">
              <ListItem
                selected={selected === 17}
                className={classes.listItem}
                onClick={() => setSelected(17)}
              >
                Daily S&P500 DW update	
              </ListItem>
            </Link>

            <Link to="/sg_cms/dashboard/DailyHsiDwUpdate" className="link">
              <ListItem
                selected={selected === 19}
                className={classes.listItem}
                onClick={() => setSelected(19)}
              >
                Daily HSI DW update	
              </ListItem>
            </Link>


            <Link to="/sg_cms/dashboard/DailySingleStockUpdate" className="link">
              <ListItem
                selected={selected === 20}
                className={classes.listItem}
                onClick={() => setSelected(20)}
              >
                Daily Single Stock update	
              </ListItem>
            </Link>


            <Link to="/sg_cms/dashboard/AllForeignIndex" className="link">
              <ListItem
                selected={selected === 21}
                className={classes.listItem}
                onClick={() => setSelected(21)}
              >
                All Foreign Index DW Trading Tips	
              </ListItem>
            </Link>

            <Link to="/sg_cms/dashboard/morning-market-buzz" className="link">
              <ListItem
                selected={selected === 2}
                className={classes.listItem}
                onClick={() => setSelected(2)}
              >
                Morning Market Buzz
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/overnight-market-wrap" className="link">
              <ListItem
                selected={selected === 3}
                className={classes.listItem}
                onClick={() => setSelected(3)}
              >
                Overnight Market Wrap
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/newsletter" className="link">
              <ListItem
                selected={selected === 4}
                className={classes.listItem}
                onClick={() => setSelected(4)}
              >
                Newsletter
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/index-future" className="link">
              <ListItem
                selected={selected === 5}
                className={classes.listItem}
                onClick={() => setSelected(5)}
              >
                Index Future
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/ad-banner" className="link">
              <ListItem
                selected={selected === 6}
                className={classes.listItem}
                onClick={() => setSelected(6)}
              >
                Ad Banner
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/home-banner" className="link">
              <ListItem
                selected={selected === 14}
                className={classes.listItem}
                onClick={() => setSelected(14)}
              >
                Home Banner
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/termsheet-listing-doc" className="link">
              <ListItem
                selected={selected === 7}
                className={classes.listItem}
                onClick={() => setSelected(7)}
              >
                Termsheets & Listing Doc
              </ListItem>
            </Link>
            <Link
              to="/sg_cms/dashboard/expiry-adjustment-notice"
              className="link"
            >
              <ListItem
                selected={selected === 8}
                className={classes.listItem}
                onClick={() => setSelected(8)}
              >
                Expiry & Adjustment Notice
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/seminars" className="link">
              <ListItem
                selected={selected === 9}
                className={classes.listItem}
                onClick={() => setSelected(9)}
              >
                Seminars
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/seminar-registration" className="link">
              <ListItem
                selected={selected === 10}
                className={classes.listItem}
                onClick={() => setSelected(10)}
              >
                Seminar Registration
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/album-cover" className="link">
              <ListItem
                selected={selected === 11}
                className={classes.listItem}
                onClick={() => setSelected(11)}
              >
                Photo Gallery Album Cover
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/photo-gallery" className="link">
              <ListItem
                selected={selected === 12}
                className={classes.listItem}
                onClick={() => setSelected(12)}
              >
                Photo Gallery
              </ListItem>
            </Link>
            <Link to="/sg_cms/dashboard/reset-password" className="link">
              <ListItem
                selected={selected === 13}
                className={classes.listItem}
                onClick={() => setSelected(13)}
              >
                Reset Password
              </ListItem>
            </Link>


            <ListItem className={classes.listItem} onClick={handleLogout}>
              Logout
            </ListItem>
          </List>
        </div>
        {/* <div className="sidebar-menu">
          <h3 className="sidebar-title">Email and Matrices</h3>
          <ul className="sidebar-list">
          </ul>
        </div>

        <div className="sidebar-menu">
          <h3 className="sidebar-title">TimeSheets and Notices</h3>
          <ul className="sidebar-list">
          </ul>
        </div>
        <div className="sidebar-menu">
          <h3 className="sidebar-title">Seminars</h3>
          <ul className="sidebar-list">
          </ul>
        </div>
        <div className="sidebar-menu">
          <h3 className="sidebar-title">Others</h3>
          <ul className="sidebar-list">
          </ul>
        </div>
        <div className="sidebar-menu">
          <h3 className="sidebar-title">User Actions</h3>
          <ul className="sidebar-list">
          </ul>
        </div> */}
      </div>
    </div>
  );
}
