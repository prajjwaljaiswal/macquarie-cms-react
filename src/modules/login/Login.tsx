import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import TwoFactorAuthModal from "../2fa/TwoFactorAuthModal";
import {
  Avatar,
  Container,
  Grid,
  Typography,
  Link,
  Button,
  Checkbox,
  CssBaseline,
  TextField,
  makeStyles,
  FormControlLabel,
} from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAuthToken, loginSelector, clearState, checkIP } from "./loginSlice";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { isFetching, isSuccess, isError, errorMessage } =
    useSelector(loginSelector);
  const { register, handleSubmit, control } = useForm();

  const authCodeRef = useRef<any>();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleResend = () => {
    // console.log(authCodeRef?.current?.value);
  };
  const handle2FaSubmit = () => {};

  useEffect(() => {
    sessionStorage.setItem("token", "");
    checkIPHandler();
    dispatch(clearState());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      if(errorMessage > 15)
        history.push("/th_cms/dashboard");
      else {
        toast.error("Your account password will expire after " + errorMessage + " day(s).");

        if(errorMessage < 4)
          history.push("/th_cms/dashboard/reset-password");
        else
          history.push("/th_cms/dashboard");
      }
    }
    if (isError) {
      var finalmessage = "";
      try {
        finalmessage = JSON.parse(errorMessage).message;
      } catch(ex) {
        finalmessage = "Please Login again with correct credentials."
      }

      toast.error(finalmessage);
      dispatch(clearState());
      history.push("/th_cms");
    }
  }, [isSuccess, isError]);

  async function signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      if (username && password) {
        sessionStorage.setItem("user", username);

        const publicIp = require("react-public-ip");
        const ipv4: string = await publicIp.v4() || "";
        dispatch(getAuthToken({ username, password, ipv4 }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function checkIPHandler() {
    const publicIp = require("react-public-ip");
    const ipv4: string = await publicIp.v4() || "";
    console.log(ipv4);
    dispatch(checkIP({ ipv4 }));
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Toaster />
      <div className={classes.paper}>
        <img src="./logo.png" />

        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(signIn)}
        >
          <TextField
            {...register("username", { required: true })}
            name="username"
            variant="outlined"
            margin="normal"
            fullWidth
            autoComplete="username"
            autoFocus
            label="Username"
          />
          <TextField
            variant="outlined"
            margin="normal"
            {...register("password", { required: true })}
            name="password"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
      <TwoFactorAuthModal
        show={show}
        handleClose={handleClose}
        setShow={setShow}
        handleResend={handleResend}
        handle2FaSubmit={handle2FaSubmit}
        authCodeRef={authCodeRef}
      />
    </Container>
  );
};
export default Login;
