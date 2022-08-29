import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      flexGrow: 1,
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: 1000
    },

    logo: {
      justifyContent: "center",
      background: "black",

    },
  })
);

export default function NavBar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.logo}>
          <img src="../../../th_cms/cms_header.png" />
        </Toolbar>
      </AppBar>
    </div>
  );
}
