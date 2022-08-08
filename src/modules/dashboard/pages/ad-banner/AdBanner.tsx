import {
  makeStyles,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  IconButton,
  TextField,
  Fab,
  Typography,
  Button,
  Checkbox,
  ListItemIcon,
  ListItem,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./AdBanner.css";
import {
  getAdBannerlist,
  getAdBannerById,
  createAdBanner,
  updateAdBanner,
  deleteAdBanner,
  AdBannerSelector,
  clearState,
} from "./AdBannerSlice";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const api: string = process.env.REACT_APP_API_URL || "localhost:3015";

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
  iconButton: {},
  invisibleInput: {
    display: "none",
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
  dataContainer: {
    height: "500px",
  },
  flexImage: {
    maxWidth: "300px",
    maxHeight: "200px",
    height: "auto",
    margin: "0.5em",
    borderRadius: "1em",
  },
  selectedImg: {
    borderRadius: "1em",
    maxWidth: "300px",
    maxHeight: "200px",
    height: "auto",
    margin: "0.5em",
  },
  topButton: {
    zIndex: 2,
  },
  img: {
    width: "100%",
  },
}));

type idList = {
  id: number;
  order: number;
};

export default function AdBanner() {
  const classes = useStyles();
  const { register, handleSubmit, control, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        order: 1,
        link: "",
        redirect: false,
        banner: null,
      },
    });
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    AdBannerlist,
    isListSuccess,
    isListError,
    AdBanner,
    isBannerSuccess,
    isBannerError,
    isCreateAdBannerSuccess,
    isCreateAdBannerError,
    createAdBannerErrorMessage,
    isUpdateAdBannerSuccess,
    isUpdateAdBannerError,
    updateAdBannerErrorMessage,
    isDeleteAdBannerSuccess,
    isDeleteAdBannerError,
    deleteAdBannerErrorMessage,
  } = useSelector(AdBannerSelector);
  const [selectedFile, setSelectedFile] = useState("");
  const [idList, setIdList] = useState<number[]>([]);
  const [banner, setBanner] = useState("");
  const [fileArrayBuffer, setFileArrayBuffer] = useState<ArrayBuffer>();
  const [id, setId] = useState(0);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    dispatch(getAdBannerlist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isListSuccess) {
      setIdList(
        AdBannerlist.reduce((newlist: number[], data: idList) => {
          newlist[data.order - 1] = data.id;
          return [...newlist];
        }, [])
      );
    }

    if (isListError) {
      toast.error("Unable to the banner list");
    }
  }, [isListSuccess, isListError, AdBannerlist]);

  useEffect(() => {
    if (isBannerSuccess) {
      setValue("link", AdBanner.link);
      setValue("redirect", AdBanner.redirect_type ? true : false);
    }
    dispatch(clearState());
  }, [isBannerSuccess, isBannerError, AdBanner]);

  useEffect(() => {
    if (
      isCreateAdBannerSuccess ||
      isUpdateAdBannerSuccess ||
      isDeleteAdBannerSuccess
    ) {
      dispatch(getAdBannerlist({ token }));
      reset();
      setSelectedFile("");
    }

    if (isCreateAdBannerSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateAdBannerSuccess) {
      toast.success("Successfully updated.");
      location.reload();
    }

    if (isDeleteAdBannerSuccess) {
      toast.success("Successfully deleted.");
    }

    if (isCreateAdBannerError) {
      toast.error(`Save failed`);
    }

    if (isUpdateAdBannerError) {
      toast.error(`Update failed`);
    }

    if (isDeleteAdBannerError) {
      toast.error(`Delete failed`);
    }
    dispatch(clearState());
  }, [
    isCreateAdBannerSuccess,
    isCreateAdBannerError,
    isUpdateAdBannerSuccess,
    isUpdateAdBannerError,
    isDeleteAdBannerSuccess,
    isDeleteAdBannerError,
  ]);

  useMemo(() => {
    if (idList[0]) {
      setId(idList[0]);
      setBanner(`${api}/file/image/adbanner/${idList[0]}`);
      dispatch(getAdBannerById({ token, id: idList[0] }));
    } else {
      setBanner("");
      setId(0);
    }
  }, [idList]);

  const handleUpdate = (data: any) => {
    dispatch(
      updateAdBanner({
        token,
        id,
        payload: {
          order: getValues("order"),
          link: getValues("link"),
          redirect_type: getValues("redirect") ? 1 : 0,
          image: fileArrayBuffer ? fileArrayBuffer : null,
        },
      })
    );
  };

  const handleSave = (data: any) => {
    dispatch(
      createAdBanner({
        token,
        id,
        payload: {
          order: getValues("order"),
          link: getValues("link"),
          redirect_type: getValues("redirect") ? 1 : 0,
          image: fileArrayBuffer ? fileArrayBuffer : null,
        },
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteAdBanner({ token, id }));
  };

  const uploadTips = (e: any) => {
    const file = e?.target?.files[0];

    if (!file) {
      return setSelectedFile("");
    }
    setSelectedFile(file?.name);
    let reader = new FileReader();
    reader.onload = function (e) {
      if (e?.target?.result) {
        const arraybuffer = Buffer.from(e.target.result);
        setFileArrayBuffer(arraybuffer);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImageChange = (order: any) => {
    if (idList[order - 1]) {
      setId(idList[order - 1]);
      setBanner(`${api}/file/image/adbanner/${idList[order - 1]}`);
      dispatch(getAdBannerById({ token, id: idList[order - 1] }));
    } else {
      setId(0);
      setBanner("");
      setValue("link", "");
      setValue("redirect", false);
    }
  };
  return (
    <div className="ad-banner">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Ad Banner</h2>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={5}>
          <Grid item container xs={12} spacing={0}>
            <form
              className={classes.form}
              noValidate
              onSubmit={handleSubmit(handleUpdate)}
            >
              <Grid item container spacing={4} xs={12} alignItems="center">
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="order"
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="demo-mutiple-order-label"
                          id="demo-mutiple-order"
                          onChange={(e) => {
                            field.onChange(e);
                            handleImageChange(e.target.value);
                          }}
                        >
                          {[...Array.from({ length: 10 }, (_, i) => i + 1)].map(
                            (value, index) => (
                              <MenuItem key={index} value={value}>
                                {value === 6 || value === 7 || value === 8 || value === 9 || value === 10  ? "Not display - " + (value - 5) : value}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Banner:</Typography>
                  <Typography>(Recommended size: 580x526)</Typography>
                </Grid>
                <Grid item xs={9}>
                  {banner ? (
                    <img className={classes.img} src={banner} />
                  ) : (
                    <img className={classes.img} src="../000000.jpg" />
                  )}
                </Grid>
                <Grid item xs={3}>
                  <Typography>Hyperlink:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="link"
                      render={({ field }) => (
                        <TextField {...field} label="URL" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Redirect:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name="redirect"
                      render={({ field }) => (
                        <ListItem dense button>
                          <ListItemIcon>
                            <Checkbox
                              {...field}
                              edge="start"
                              tabIndex={-1}
                              checked={field.value}
                              disableRipple
                            />
                          </ListItemIcon>
                        </ListItem>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Upload banner:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl>
                    <Controller
                      name="banner"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            accept="image/*"
                            className={classes.invisibleInput}
                            id="icon-button-file"
                            type="file"
                            onChange={uploadTips}
                          />
                          <label htmlFor="icon-button-file">
                            <Fab
                              color="secondary"
                              size="small"
                              component="span"
                              aria-label="add"
                              variant="extended"
                            >
                              <CloudUpload />
                            </Fab>
                            &nbsp;{" "}
                            {selectedFile ? selectedFile : "No file chosen "}
                          </label>
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  {id ? (
                    <Button
                      style={{ marginRight: "2px", width: "49%" }}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit(handleSave)}
                    >
                      Update
                    </Button>
                  )}
                  {id ? (
                    <Button
                      style={{ marginLeft: "2px", width: "49%" }}
                      variant="contained"
                      color="secondary"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
