import {
  makeStyles,
  Card,
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  Input,
  InputLabel,
  TextField,
  Fab,
  Checkbox,
  List,
  ListItemText,
  ListItemIcon,
  Paper,
  IconButton,
  Typography,
  LinearProgress,
  ListItem,
  InputAdornment,
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import React, { useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import "./ResetPassword.css";
import toast, { Toaster } from "react-hot-toast";
import { loginSelector } from "../../../login/loginSlice";
import {
  updatePassword,
  PasswordlistSelector,
  clearState,
} from "./ResetPasswordSlice";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  cardLay: {
    padding: "1em",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  meter: {
    flexGrow: 1,
    textAlign: "center",
  },
}));

export default function ResetPassword() {
  const classes = useStyles();
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm({
      defaultValues: {
        oldpw: "",
        newpw: "",
        cpw: "",
      },
    });
  const [passwordStren, setPasswordStren] = useState(0);
  const [strenText, setStrenText] = useState("");
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    isUpdatePasswordSuccess,
    isUpdatePasswordError,
    updatePasswordErrorMessage,
  } = useSelector(PasswordlistSelector);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isUpdatePasswordSuccess) {
      toast.success("Successfully reset password.");
    }

    if (isUpdatePasswordError) {
      toast.error(`${updatePasswordErrorMessage}`);
    }
    reset();
    setPasswordStren(0);
    dispatch(clearState());
  }, [isUpdatePasswordSuccess, isUpdatePasswordError]);

  const handleNewPassword = (data: string) => {
    if (
      new RegExp(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&+=])(?=\S+$).{12,}$/g
      ).test(data)
    ) {
      setPasswordStren(100);
      setStrenText("Very Strong");
    } else if (
      new RegExp(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&+=])(?=\S+$).*$/g
      ).test(data)
    ) {
      setPasswordStren(75);
      setStrenText("Strong");
    } else if (
      new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).*$/g).test(data)
    ) {
      setPasswordStren(50);
      setStrenText("Medium");
    } else if (data.length > 0) {
      setPasswordStren(25);
      setStrenText("Weak");
    } else {
      setPasswordStren(0);
      setStrenText("");
    }
  };

  const handleVisible = () => {
    setVisible(!visible);
  };

  const onSubmit = (data: any) => {
    setVisible(false);
    if (data.oldpw) {
      if (passwordStren === 100) {
        dispatch(
          updatePassword({
            token,
            payload: {
              login_id: sessionStorage.getItem("user"),
              password: data.oldpw,
              newPassword: data.newpw,
            },
          })
        );
      } else {
        toast.error("New password is not strong enough");
      }
    } else {
      toast.error("Please input old password");
    }
  };

  return (
    <div className="reset-password">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Reset Password</h2>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={5}>
          <Grid item container xs={12} spacing={0}>
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid item container spacing={4} xs={12} alignItems="center">
                <Grid item xs={3}>
                  <Typography>Old Password:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Controller
                      name="oldpw"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Old Password"
                          type={visible ? "text" : "password"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleVisible}>
                                  {visible ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <Typography>New Password:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Controller
                      name="newpw"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="New Password"
                          onChange={(e) => {
                            field.onChange(e);
                            handleNewPassword(e.target.value);
                          }}
                          type={visible ? "text" : "password"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleVisible}>
                                  {visible ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <LinearProgress
                    className={`progress-bar${passwordStren}`}
                    variant="determinate"
                    value={passwordStren}
                  />
                  <Typography variant="body1" className={classes.meter}>
                    <b>Password Strength: </b>
                    {strenText}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography>Confirm Password:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Controller
                      name="cpw"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Confirm Password"
                          error={!!error}
                          helperText={
                            error
                              ? "The password confirmation does not match."
                              : null
                          }
                          type={visible ? "text" : "password"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleVisible}>
                                  {visible ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      rules={{
                        validate: (cpw: string) => {
                          return cpw === getValues("newpw");
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Card>
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button>
                <ListItemText
                  primary={`Your new password should be 12 minimum length and requires all four character classes.`}
                />
              </ListItem>
              <ListItem button>
                <ListItemText primary={`i. Upper case alpha`} />
              </ListItem>

              <ListItem button>
                <ListItemText primary={`ii. Lower case alpha`} />
              </ListItem>

              <ListItem button>
                <ListItemText primary={`iii. Numeric`} />
              </ListItem>

              <ListItem button>
                <ListItemText primary={`iv. Special Character`} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
