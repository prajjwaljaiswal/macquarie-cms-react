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
  ListItemText,
  Paper,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  NoteAdd,
  PhotoCamera,
  PlusOne,
  DeleteForeverOutlined,
} from "@material-ui/icons";
import React, { useState } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { VideoBannerData } from "../../../../mock/video-banner";
import "./VideoBanner.css";

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
}));

export default function VideoBanner() {
  const classes = useStyles();
  const { register, handleSubmit, control } = useForm();
  const [selectedFile, setSelectedFile] = useState("");
  const [idList, setIdList] = useState(VideoBannerData);
  const [selectedImage, setSelectedImage] = useState("");
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
    if (!selectedImage) {
      setSelectedImage(idList[0].url);
    }
  }, [selectedImage]);

  const handleUpdate = () => {};

  const uploadTips = (e: any) => {
    const file = e?.target?.files[0];
    if (!file) {
      return setSelectedFile("");
    }
    setSelectedFile(file?.name);
  };

  const handleImageChange = (img: any) => {
    if (img?.target?.value) {
      setSelectedImage(img.target.value);
    }
  };

  return (
    <div className="video-banner">
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Video Banner</h2>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={5}>
          <Grid item container xs={12} spacing={0}>
            <form className={classes.form} noValidate>
              <Grid item container spacing={4} xs={12} alignItems="center">
                <Grid item xs={3}>
                  <Typography>Change Banners:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-mutiple-checkbox-label">
                      Banner Images
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-mutiple-checkbox-label"
                      id="demo-mutiple-checkbox"
                      onChange={handleImageChange}
                      input={<Input />}
                      value={selectedImage}
                      renderValue={(selected: any) => (
                        <div>
                          {selected && (
                            <img
                              className={classes.selectedImg}
                              src={selected}
                            />
                          )}
                        </div>
                      )}
                      MenuProps={MenuProps}
                    >
                      {idList.map((img) => (
                        <MenuItem key={img.id} value={img.url}>
                          <Grid item container xs={12}>
                            <Grid item xs={10}>
                              <img
                                className={classes.flexImage}
                                src={img.url}
                              />
                            </Grid>
                            <Grid item xs={2} className={classes.topButton}>
                              <IconButton
                                color="primary"
                                aria-label="delete banner"
                                component="span"
                              >
                                <DeleteForeverOutlined />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Banners Url:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <TextField label="Banner Url" value="94MW" />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Upload New Tips:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl>
                    <Controller
                      name="attachments"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <input
                            accept="Image/*"
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
                              <PlusOne /> Tips
                            </Fab>
                            &nbsp;{" "}
                            {selectedFile ? selectedFile : "No Tips Selected "}
                          </label>
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}></Grid>

                <Grid item xs={9}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
