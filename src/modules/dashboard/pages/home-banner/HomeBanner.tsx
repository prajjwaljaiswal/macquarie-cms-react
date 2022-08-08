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
import "./HomeBanner.css";
import {
  getHomeBannerlist,
  getHomeBannerById,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
  HomeBannerSelector,
  clearState,
} from "./HomeBannerSlice";
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

export default function HomeBanner() {
  const classes = useStyles();
  const [banner, setBanner] = useState("");
  const { register, handleSubmit, control, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        order: 0,
        link: "",
        banner: `${api}/file/image/homebanner/0`,
      },
    });
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    HomeBannerlist,
    isListSuccess,
    isListError,
    HomeBanner,
    isBannerSuccess,
    isBannerError,
    isCreateHomeBannerSuccess,
    isCreateHomeBannerError,
    createHomeBannerErrorMessage,
    isUpdateHomeBannerSuccess,
    isUpdateHomeBannerError,
    updateHomeBannerErrorMessage,
    isDeleteHomeBannerSuccess,
    isDeleteHomeBannerError,
    deleteHomeBannerErrorMessage,
  } = useSelector(HomeBannerSelector);
  const [selectedFile, setSelectedFile] = useState("");
  const [idList, setIdList] = useState<number[]>([]);
  const [data, setData] = useState<any>();
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
    dispatch(getHomeBannerlist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isListSuccess) {
      console.log("test break")
      console.log(HomeBannerlist)
      setIdList(HomeBannerlist.map((data: any) => data.id));
      setData(HomeBannerlist);
      setBanner(`${api}/file/image/homebanner/0`);
      dispatch(getHomeBannerById({ token, id: 0 }));
      // setIdList(
      //   HomeBannerlist.reduce((newlist: number[], data: idList) => {
      //     newlist[data.order - 1] = data.id;
      //     return [...newlist];
      //   }, [])
      // );
    }

    if (isListError) {
      toast.error("Unable to the banner list");
    }
  }, [isListSuccess, isListError, HomeBannerlist]);

  useEffect(() => {
    if (isBannerSuccess) {
      setValue("link", HomeBanner.link);
    }
    dispatch(clearState());
  }, [isBannerSuccess, isBannerError, HomeBanner]);

  useEffect(() => {
    if (
      isCreateHomeBannerSuccess ||
      isUpdateHomeBannerSuccess ||
      isDeleteHomeBannerSuccess
    ) {
      dispatch(getHomeBannerlist({ token }));
      reset();
      setSelectedFile("");
    }

    if (isCreateHomeBannerSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateHomeBannerSuccess) {
      toast.success("Successfully updated.");
      location.reload();
    }

    if (isDeleteHomeBannerSuccess) {
      toast.success("Successfully deleted.");
    }

    if (isCreateHomeBannerError) {
      toast.error(`Save failed`);
    }

    if (isUpdateHomeBannerError) {
      toast.error(`Update failed`);
    }

    if (isDeleteHomeBannerError) {
      toast.error(`Delete failed`);
    }
    dispatch(clearState());
  }, [
    isCreateHomeBannerSuccess,
    isCreateHomeBannerError,
    isUpdateHomeBannerSuccess,
    isUpdateHomeBannerError,
    isDeleteHomeBannerSuccess,
    isDeleteHomeBannerError,
  ]);

  useMemo(() => {
    if (idList[0]) {
      setId(idList[0]);
      setBanner(`${api}/file/image/homebanner/${idList[0]}`);
      dispatch(getHomeBannerById({ token, id: idList[0] }));
    } else {
      setBanner("");
      setId(0);
    }
  }, [idList]);

  const handleUpdate = (data: any) => {
    dispatch(
      updateHomeBanner({
        token,
        id,
        payload: {
          id: getValues("order"),
          desktop_link: getValues("link"),
          desktop_image: fileArrayBuffer ? fileArrayBuffer : null,
        },
      })
    );
  };

  const handleSave = (data: any) => {
    dispatch(
      createHomeBanner({
        token,
        id,
        payload: {
          order: getValues("order"),
          link: getValues("link"),
          image: fileArrayBuffer ? fileArrayBuffer : null,
        },
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteHomeBanner({ token, id }));
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
    console.log(idList);
    // if (idList[order] => 0) {
      setId(idList[order]);
      setBanner(`${api}/file/image/homebanner/${idList[order]}`);
      dispatch(getHomeBannerById({ token, id: idList[order] }));
      // console.log(data);
      const fetchLink:any = data[idList[order]];
      setValue("link", fetchLink.desktop_link);
    // } else {
    //   setId(0);
    //   setBanner("");
    //   setValue("link", "");
    // }
  };
  return (
    <div className="home-banner">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Home Banner</h2>
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
                          {[0, 1, 2, 3, 4, 5].map(
                            (value, index) => (

                              <MenuItem key={index} value={value}>
                                {value === 1 || value === 3 || value === 5  ? "Mobile Banner " + (value) : "Desktop Banner "+value}
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
                  <Typography>(Desk Recommended size: 1600x450)</Typography>
                  <Typography>(Mobile Recommended size: 766x373)</Typography>
                </Grid>
                <Grid item xs={9}>
                  {banner ? (
                    <img className={classes.img} src={banner} />
                  ) : (
                    <img className={classes.img} src={`${api}/file/image/homebanner/0`} />
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
                        <TextField {...field} />
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
