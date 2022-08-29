import { List, ListItem, makeStyles, MenuItem, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { clearState } from "../../login/loginSlice";
import "./SideBar.css";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: "5px",
    cursor: "pointer",
    color: "black",
  },
}));

export default function SideBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selected, setSelected] = useState<number>(0);

  async function handleLogout() {
    try {
      if (confirm("Are you sure to logout?")) {
        sessionStorage.setItem("token", "");
        dispatch(clearState());
        history.push("/th_cms/");
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
          <Link to="/th_cms/dashboard" className="link">
              <ListItem
                selected={selected === 0}
                className={classes.listItem}
                onClick={() => setSelected(0)}
              >
                Trending Warrants
              </ListItem>
            </Link>

          <Link to="/th_cms/dashboard/fasttrack" className="link">
              <ListItem
                selected={selected === 1}
                className={classes.listItem}
                onClick={() => setSelected(1)}
              >
                Fast Track
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/daily-set50" className="link">
              <ListItem
                selected={selected === 2}
                className={classes.listItem}
                onClick={() => setSelected(2)}
              >
                    Daily Set50 by AECs 
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/market-commentary" className="link">
              <ListItem
                selected={selected === 3}
                className={classes.listItem}
                onClick={() => setSelected(3)}
              >
                Market Commentary
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/overnight-market-wrap" className="link">
              <ListItem
                selected={selected === 4}
                className={classes.listItem}
                onClick={() => setSelected(4)}
              >
                Overnight Market Wrap
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/DailySp500" className="link">
              <ListItem
                selected={selected === 5}
                className={classes.listItem}
                onClick={() => setSelected(5)}
              >
                  Daily S&P500 DW update	
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/DailyHsiDwUpdate" className="link">
              <ListItem
                selected={selected === 6}
                className={classes.listItem}
                onClick={() => setSelected(6)}
              >
                  Daily HSI DW update	
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/DailySingleStockUpdate" className="link">
              <ListItem
                selected={selected === 7}
                className={classes.listItem}
                onClick={() => setSelected(7)}
              >
                  Daily Single Stock update	
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/daily-market-analysis" className="link">
              <ListItem
                selected={selected === 8}
                className={classes.listItem}
                onClick={() => setSelected(8)}
              >
                Daily Market Analysis
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/newsletter" className="link">
              <ListItem
                selected={selected === 9}
                className={classes.listItem}
                onClick={() => setSelected(9)}
              >
                Newsletter
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/AllForeignIndex" className="link">
              <ListItem
                selected={selected === 10}
                className={classes.listItem}
                onClick={() => setSelected(10)}
              >
                All Foreign Index DW Trading Tips	
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/dw-set50-tips" className="link">
              <ListItem
                selected={selected === 11}
                className={classes.listItem}
                onClick={() => setSelected(11)}
              >
                     Daily and Set50 Tips 
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/hot-topic-review" className="link">
              <ListItem
                selected={selected === 12}
                className={classes.listItem}
                onClick={() => setSelected(12)}
              >
                Hot topic Hot issue review  
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/dw-tips-banner" className="link">
              <ListItem
                selected={selected === 13}
                className={classes.listItem}
                onClick={() => setSelected(13)}
              >
                    Dw Tips Banner
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/home-banner" className="link">
              <ListItem
                selected={selected === 14}
                className={classes.listItem}
                onClick={() => setSelected(14)}
              >
                Home Banner
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/ad-banner" className="link">
              <ListItem
                selected={selected === 15}
                className={classes.listItem}
                onClick={() => setSelected(15)}
              >
                Ad Banner
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/index-future" className="link">
              <ListItem
                selected={selected === 16}
                className={classes.listItem}
                onClick={() => setSelected(16)}
              >
                Index Future
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/dw-inventory" className="link">
              <ListItem
                selected={selected === 17}
                className={classes.listItem}
                onClick={() => setSelected(17)}
              >
               DW Inventory Sold-out
              </ListItem>
            </Link>



            <Link to="/th_cms/dashboard/seminars" className="link">
              <ListItem
                selected={selected === 18}
                className={classes.listItem}
                onClick={() => setSelected(18)}
              >
                Seminars
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/seminar-registration" className="link">
              <ListItem
                selected={selected === 19}
                className={classes.listItem}
                onClick={() => setSelected(19)}
              >
                Seminar Registration
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/fasttrack" className="link">
              <ListItem
                selected={selected === 20}
                className={classes.listItem}
                onClick={() => setSelected(20)}
              >
                <Typography style={{ color: "red" }}>
                    Seminar Reminder
                </Typography>  
              </ListItem>
            </Link>


            <Link to="/th_cms/dashboard/dw28update" className="link">
              <ListItem
                selected={selected === 21}
                className={classes.listItem}
                onClick={() => setSelected(21)}
              >
               Dw28 Update
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/reset-password" className="link">
              <ListItem
                selected={selected === 22}
                className={classes.listItem}
                onClick={() => setSelected(22)}
              >
                Reset Password
              </ListItem>
            </Link>


            
            <Link to="/th_cms/dashboard/cautionlist" className="link">
              <ListItem
                selected={selected === 23}
                className={classes.listItem}
                onClick={() => setSelected(23)}
              >
               Caution List
              </ListItem>
            </Link>

            <Link to="/th_cms/dashboard/activities" className="link">
              <ListItem
                selected={selected === 20}
                className={classes.listItem}
                onClick={() => setSelected(20)}
              >
                    Activities
              </ListItem>
            </Link>


            <ListItem className={classes.listItem} onClick={handleLogout}>
              Logout
            </ListItem>

            {/* End sidebar list */}

          {/* 
            <Link to="/th_cms/dashboard/todaypick" className="link">
              <ListItem
                selected={selected === 16}
                className={classes.listItem}
                onClick={() => setSelected(16)}
              >
                Today's Top Picks
              </ListItem>
            </Link>








            <Link to="/th_cms/dashboard/morning-market-buzz" className="link">
              <ListItem
                selected={selected === 2}
                className={classes.listItem}
                onClick={() => setSelected(2)}
              >
                Morning Market Buzz
              </ListItem>
            </Link>


 

       
            <Link to="/th_cms/dashboard/termsheet-listing-doc" className="link">
              <ListItem
                selected={selected === 7}
                className={classes.listItem}
                onClick={() => setSelected(7)}
              >
                Termsheets & Listing Doc
              </ListItem>
            </Link> */}


            {/* <Link
              to="/th_cms/dashboard/expiry-adjustment-notice"
              className="link"
            >
              <ListItem
                selected={selected === 8}
                className={classes.listItem}
                onClick={() => setSelected(8)}
              >
                Expiry & Adjustment Notice
              </ListItem>
            </Link> */}
            
            {/* <Link to="/th_cms/dashboard/album-cover" className="link">
              <ListItem
                selected={selected === 11}
                className={classes.listItem}
                onClick={() => setSelected(11)}
              >
                Photo Gallery Album Cover
              </ListItem>
            </Link>
            <Link to="/th_cms/dashboard/photo-gallery" className="link">
              <ListItem
                selected={selected === 12}
                className={classes.listItem}
                onClick={() => setSelected(12)}
              >
                Photo Gallery
              </ListItem>
            </Link>

 */}


          </List>
        </div>
       
      </div>
    </div>
  );
}
