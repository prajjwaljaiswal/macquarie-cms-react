import {
  Card,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  TextField,
  Button,
  makeStyles,
  IconButton,
  Fab,
  Typography,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  DeleteForeverOutlined,
  NoteAdd,
  ExitToApp,
  ArrowRightAltOutlined,
  CloudUpload,
  SentimentVeryDissatisfiedTwoTone,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import "./Newsletter.css";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getNewsletter,
  getNewsletterTips,
  getNewsletterNews,
  updateNewsletter,
  updateSendStatus,
  deleteNews,
  deleteTips,
  NewsletterlistSelector,
  clearState,
} from "./NewsletterSlice";
import {
  getLatestTitle,
  MMBlistSelector,
  clearState as MMBClear,
} from "../morning-market-buzz/MorningMarketBuzzSlice";

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
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  invisibleInput: {
    display: "none",
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
}));

type NewsletterList = {
  title: string;
  content: string;
  status: number;
  img_id: number;
  tips_link: string;
  img_link: string;
  option: string;
  news_img_id: number;
  news_link: string;
};

type ImageList = {
  id: number;
  image: string;
  link: string;
};

export default function Newsletter() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [newsletter, setNewsletter] = useState<NewsletterList>();
  const [latestTitle, setLatestTitle] = useState("");
  const [status, setStatus] = useState("ready");
  const [tips, setTips] = useState<ImageList[]>([]);
  const [news, setNews] = useState<ImageList[]>([]);
  const [selectedTip, setSelectedTip] = useState(0);
  const [selectedNews, setSelectedNews] = useState(0);
  const [uploadTipsFile, setUploadTipsFile] = useState<ArrayBuffer>();
  const [uploadNewsFile, setUploadNewsFile] = useState<ArrayBuffer>();
  const [tipsFilename, setTipsFilename] = useState("");
  const [newsFilename, setNewsFilename] = useState("");
  const [count, setCount] = useState(0);

  const { token } = useSelector(loginSelector);
  const { titleData, isTitleSuccess, isTitleError } =
    useSelector(MMBlistSelector);
  const {
    Newsletterlist,
    isSuccess,
    isError,
    Tipslist,
    isTipsSuccess,
    isTipsError,
    Newslist,
    isNewsSuccess,
    isNewsError,
    isUpdateNewsletterSuccess,
    isUpdateNewsletterError,
    isUpdateSendSuccess,
    isUpdateSendError,
    isDeleteTipsSuccess,
    isDeleteNewsSuccess,
    isDeleteTipsError,
    isDeleteNewsError,
    deleteTipsErrorMessage,
    deleteNewsErrorMessage,
    updateSendErrorMessage,
    updateNewsletterErrorMessage,
  } = useSelector(NewsletterlistSelector);

  const { register, control, handleSubmit, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        option: "0",
        title: "",
        tips_url: "",
        image_url: "",
        attachment1: null,
        attachment2: null,
        content: "",
      },
    });

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
    dispatch(getLatestTitle({ token }));
    dispatch(getNewsletter({ token }));
    dispatch(getNewsletterTips({ token }));
    dispatch(getNewsletterNews({ token }));
  }, [count]);

  useEffect(() => {
    if (isSuccess && isTipsSuccess && isNewsSuccess) {
      setNewsletter(Newsletterlist);
      setValue("image_url", Newsletterlist.news_link);
      setValue("tips_url", Newsletterlist.tips_link);
      setValue("content", Newsletterlist.content);
      setValue(
        "title",
        Newsletterlist.title ? Newsletterlist.title : latestTitle
      );
      setValue("option", Newsletterlist.option);
      setSelectedNews(Newsletterlist.news_img_id);
      setSelectedTip(Newsletterlist.img_id);
      if (Newsletterlist.status === 0) {
        setStatus("Ready");
      } else if (Newsletterlist.status === 1) {
        setStatus("Waiting to send");
      } else {
        setStatus("Sending in progress");
      }

      setTips(
        Tipslist.map((tips: any) => {
          return {
            id: tips.id,
            image: `${api}/file/image/tips/${tips.id}`,
            link: tips.link,
          };
        })
      );

      setNews(
        Newslist.map((news: any) => {
          return {
            id: news.id,
            image: `${api}/file/image/news/${news.id}`,
            link: news.link,
          };
        })
      );
      dispatch(clearState());
    }

    if (isNewsError) {
      toast.error("Unable to load Tips image");
    }

    if (isTipsError) {
      toast.error("Unable to load News image");
    }
    if (isError) {
      toast.error("Unable to load Newsletter");
    }
  }, [
    isSuccess,
    isError,
    Newsletterlist,
    isTipsSuccess,
    isTipsError,
    Tipslist,
    isNewsSuccess,
    isNewsError,
    Newslist,
  ]);

  useEffect(() => {
    if (isTitleSuccess) {
      setLatestTitle(titleData.en_title);
    }
    dispatch(MMBClear());
  }, [isTitleSuccess, isTitleError, titleData]);

  useEffect(() => {
    if (isDeleteNewsSuccess) {
      setNews(news.filter((data: ImageList) => data.id !== selectedNews));
      setSelectedNews(newsletter?.news_img_id ? newsletter.news_img_id : 0);
    }

    if (isDeleteTipsSuccess) {
      setTips(tips.filter((data: ImageList) => data.id !== selectedTip));
      setSelectedTip(newsletter?.img_id ? newsletter.img_id : 0);
    }

    if (isDeleteNewsError) {
      toast.error(`Delete failed`);
    }

    if (isDeleteTipsError) {
      toast.error(`Delete failed`);
    }

    dispatch(clearState());
  }, [
    isDeleteTipsSuccess,
    isDeleteNewsSuccess,
    isDeleteTipsError,
    isDeleteNewsError,
  ]);

  useEffect(() => {
    if (isUpdateSendSuccess) {
      toast.success("Successfully sent.");
    }

    if (isUpdateSendError) {
      toast.error(`Send failed`);
    }
    dispatch(clearState());
  }, [isUpdateSendSuccess, isUpdateSendError]);

  useEffect(() => {
    if (isUpdateNewsletterSuccess) {
      reset();
      setTipsFilename("");
      setNewsFilename("");
      setUploadTipsFile(undefined);
      setUploadNewsFile(undefined);
      setCount((prev) => prev + 1);
      toast.success("Successfully updated.");
    }

    if (isUpdateNewsletterError) {
      toast.error(`Update failed`);
    }
  }, [isUpdateNewsletterSuccess, isUpdateNewsletterError]);

  const onSubmit = (data: any) => {
    dispatch(
      updateNewsletter({
        token,
        payload: {
          title: data.title,
          content: "",
          img_id: selectedTip,
          img_link: data.tips_url,
          option: data.option,
          news_img_id: selectedNews,
          news_img_link: data.image_url,
          tipsfile: uploadTipsFile,
          newsfile: uploadNewsFile,
        },
      })
    );
  };

  const handleSend = () => {
    dispatch(updateSendStatus({ token }));
  };

  const handlePreview = () => {
    //  console.log(getValues("content").length);
    window.open("")?.document.write(getValues("content"));
  };

  const handleRefresh = () => {
    setCount((prev) => prev + 1);
  };

  const uploadTips = (e: any) => {
    const file = e?.target?.files[0];

    if (!file) {
      return setTipsFilename("");
    }
    setTipsFilename(file?.name);
    let reader = new FileReader();
    reader.onload = function (e) {
      if (e?.target?.result) {
        const arraybuffer = Buffer.from(e.target.result);
        setUploadTipsFile(arraybuffer);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadNews = (e: any) => {
    const file = e?.target?.files[0];

    if (!file) {
      return setNewsFilename("");
    }
    setNewsFilename(file?.name);
    let reader = new FileReader();
    reader.onload = function (e) {
      if (e?.target?.result) {
        const arraybuffer = Buffer.from(e.target.result);
        setUploadNewsFile(arraybuffer);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTipsChange = (e: any) => {
    setSelectedTip(e.target.value);
    tips.find((data: ImageList) => {
      if (data.id === e.target.value) {
        setValue("tips_url", data.link);
      }
    });
  };

  const handleTipsClick = (id: number) => {
    dispatch(deleteTips({ token, id }));
  };

  const handleNewsChange = (e: any) => {
    setSelectedNews(e.target.value);
    news.find((data: ImageList) => {
      if (data.id === e.target.value) {
        setValue("image_url", data.link);
      }
    });
  };

  const handleNewsClick = (id: number) => {
    dispatch(deleteNews({ token, id }));
  };

  return (
    <div className="newsletter">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Newsletter</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <Grid item container xs={12} spacing={3} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>Current Newsletter Subject:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <TextField
                        disabled
                        label="Current Newsletter Subject"
                        variant="filled"
                        value={
                          newsletter?.title ? newsletter.title : latestTitle
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Newsletter Status:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <TextField
                        disabled
                        label="Newsletter Status"
                        variant="filled"
                        value={status}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>New Newsletter Subject:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="New Newsletter Subject"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                        rules={{
                          required: "New Newsletter Subject is required",
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Change Tips:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-mutiple-checkbox-label">
                        Change Tips
                      </InputLabel>
                      <Select
                        fullWidth
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        onChange={handleTipsChange}
                        input={<Input />}
                        value={selectedTip}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value={0} disabled>
                          Tips
                        </MenuItem>
                        {tips.map((data: ImageList) => (
                          <MenuItem key={data.id} value={data.id}>
                            <Grid item container xs={12}>
                              <Grid item xs={10}>
                                <img
                                  className={classes.flexImage}
                                  src={data.image}
                                  style={{ height: "80px" }}
                                />
                              </Grid>
                              {data.id !== selectedTip && (
                                <Grid item xs={2} className={classes.topButton}>
                                  <IconButton
                                    color="primary"
                                    aria-label="delete banner"
                                    component="span"
                                    onClick={() => handleTipsClick(data.id)}
                                  >
                                    <DeleteForeverOutlined />
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Tips Url:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="tips_url"
                        control={control}
                        defaultValue="ready"
                        render={({ field }) => (
                          <TextField {...field} label="Tips Url" />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <FormControl>
                      <Typography>Upload New Tips:</Typography>
                      <Typography>(Recommended size: 550 x 203)</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl>
                      <Controller
                        key={count}
                        name="attachment1"
                        control={control}
                        render={({ field }) => (
                          <>
                            <input
                              accept="image/*"
                              className={classes.invisibleInput}
                              id="icon-button-tips"
                              type="file"
                              onChange={uploadTips}
                            />
                            <label htmlFor="icon-button-tips">
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
                              {tipsFilename
                                ? tipsFilename
                                : "No Image Selected "}
                            </label>
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>News:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl component="fieldset">
                      <Controller
                        control={control}
                        name="option"
                        render={({ field }) => (
                          <RadioGroup {...field} row aria-label="news-type">
                            <FormControlLabel
                              value="0"
                              control={<Radio />}
                              label="Morning Market Buzz"
                            />
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label="Image"
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Change Images:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-mutiple-checkbox-label">
                        Change Image
                      </InputLabel>
                      <Select
                        fullWidth
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        onChange={handleNewsChange}
                        input={<Input />}
                        value={selectedNews}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value={0} disabled>
                          Image
                        </MenuItem>
                        {news.map((data: ImageList) => (
                          <MenuItem key={data.id} value={data.id}>
                            <Grid item container xs={12}>
                              <Grid item xs={10}>
                                <img
                                  className={classes.flexImage}
                                  src={data.image}
                                  style={{ height: "80px" }}
                                />
                              </Grid>
                              {data.id !== selectedNews && (
                                <Grid item xs={2} className={classes.topButton}>
                                  <IconButton
                                    color="primary"
                                    aria-label="delete banner"
                                    component="span"
                                    onClick={() => handleNewsClick(data.id)}
                                  >
                                    <DeleteForeverOutlined />
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <FormControl>
                      <Typography>Upload Image:</Typography>
                      <Typography>(Recommended size: 550 x 412)</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl>
                      <Controller
                        key={count}
                        name="attachment2"
                        control={control}
                        render={({ field }) => (
                          <>
                            <input
                              accept="image/*"
                              className={classes.invisibleInput}
                              id="icon-button-news"
                              type="file"
                              onChange={uploadNews}
                            />
                            <label htmlFor="icon-button-news">
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
                              {newsFilename
                                ? newsFilename
                                : "No Image Selected "}
                            </label>
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Image Url:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="image_url"
                        control={control}
                        defaultValue="ready"
                        render={({ field }) => (
                          <TextField {...field} label="Image Url" />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleRefresh}
                    >
                      Refresh Status
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      Upload / Update
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handlePreview}
                    >
                      Preview
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    {newsletter?.status === 0 ? (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                      >
                        Send
                      </Button>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Card>
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Procedure</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button>
                <ListItemText
                  primary={`1. Update the content of each page which includes "Today's Top Picks", "Daily Highlight", "Market Commentary" and "Overnight Market Wrap".`}
                />
              </ListItem>
              <ListItem button>
                <ListItemText
                  primary={`2. Click the Update button. It will update the newsletter subject as well if the text box is not empty.`}
                />
              </ListItem>

              <ListItem button>
                <ListItemText
                  primary={`3. Click the Preview button to ensure that the newsletter is sent correctly.`}
                />
              </ListItem>

              <ListItem button>
                <ListItemText
                  primary={`4. Click the Send button. After clicking the Send button, the newsletter status will change. The Send button is only available when the status is "ready".`}
                />
              </ListItem>

              <ListItem button>
                <ListItemText
                  primary={`5. Click the Refresh status button to obtain the latest newsletter status.`}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
