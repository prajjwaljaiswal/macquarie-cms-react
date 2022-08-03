import {
  makeStyles,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  TextField,
  Button,
  Typography,
  Checkbox,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@material-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { loginSelector } from "../../../login/loginSlice";
import {
  getEnabledAlbumList,
  getGalleryListById,
  insertGallery,
  deleteGallery,
  GallerylistSelector,
  clearState,
} from "./PhotoGallerySlice";
import { useDispatch, useSelector } from "react-redux";
import "./PhotoGallery.css";
import toast, { Toaster } from "react-hot-toast";
import { Pagination } from "@material-ui/lab";
import { DropzoneArea } from "material-ui-dropzone";

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
    justifyContent: "center",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  invisibleInput: {
    display: "none",
  },
  dataContainer: {
    height: "500px",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    width: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    maxWidth: "600px",
  },
  imageList: {
    width: "75vw",
    height: 450,
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

type EnabledAlbumList = {
  id: number;
  en_title: string;
  count: number;
};

type GalleryData = {
  id: number;
  last_update_time: string;
  photo: FileList;
};

export default function PhotoGallery() {
  const classes = useStyles();
  const [albums, setAlbums] = useState<EnabledAlbumList[]>([]);
  const [idList, setIdList] = useState<number[]>([]);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [album_id, setAlbum_id] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [photos, setPhotos] = useState([]);
  const [key, setKey] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm({
      defaultValues: {
        id: -1,
      },
    });
  const [fileArrayBuffer, setFileArrayBuffer] = useState<ArrayBuffer[]>([]);
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    Enabledlist,
    isSuccess,
    isError,
    galleryData,
    isDataSuccess,
    isDataError,
    isInsertGallerySuccess,
    isInsertGalleryError,
    insertGalleryErrorMessage,
    isDeleteGallerySuccess,
    isDeleteGalleryError,
    deleteGalleryErrorMessage,
  } = useSelector(GallerylistSelector);

  useEffect(() => {
    dispatch(getEnabledAlbumList({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setPage(1);
      setAlbums(Enabledlist);
      
      if (Enabledlist.length > 0) {
        if(album_id == 0){
          setAlbum_id(Enabledlist[0].id);
          
        }else{
          setAlbum_id(album_id);
          
          var element = document.getElementById("alb_select");
          console.log(element)
         
        }
        setValue("id", Enabledlist[0].id);
        setMaxPage(Math.ceil(Enabledlist[0].count / 6));
        setTotal(Enabledlist[0].count);
        setIdList(
          Enabledlist.reduce(
            (newlist: number[], data: EnabledAlbumList, idx: number) => {
              newlist[idx] = data.id;
              return [...newlist];
            },
            []
          )
        );
        // dispatch(getGalleryListById({ token, id: album_id, page: 1 }));
      } else {
        setValue("id", 0);
      }
    }

    if (isError) {
      toast.error("Unable to load Album list");
    }
    dispatch(clearState());
  }, [isSuccess, isError, Enabledlist]);

  useEffect(() => {
    if (isInsertGallerySuccess || isDeleteGallerySuccess) {
      dispatch(getEnabledAlbumList({ token }));
      reset();
      setKey((pervState) => pervState + 1);
    }

    if (isInsertGallerySuccess) {
      toast.success("Successfully saved photo(s).");
    }

    if (isDeleteGallerySuccess) {
      toast.success("Successfully removed photo(s).");
    }

    if (isInsertGalleryError) {
      toast.error(`Save failed`);
    }

    if (isDeleteGalleryError) {
      toast.error(`Delete failed`);
    }
    dispatch(clearState());
  }, [
    isInsertGallerySuccess,
    isDeleteGallerySuccess,
    isInsertGalleryError,
    isDeleteGalleryError,
  ]); 

  useEffect(() => {
    if (isDataSuccess) {
      setPhotos( 
        galleryData.map((data: GalleryData) => {
          return {
            id: data.id,
            src: `${api}/file/image/gallery/${data.id}`,
          };
        })
      );
    }
  }, [isDataSuccess, isDataError, galleryData]);

  useMemo(() => {
    if (idList[0]) {
      dispatch(getGalleryListById({ token, id: album_id, page: page }));
    }
  }, [idList]);

  const uploadFile = (files: any) => {
    setFileArrayBuffer([]);
    if (files.length > 0) {
      files.map((file: any) => {
        let reader = new FileReader();
        reader.onload = function (e) {
          if (e?.target?.result) {
            const arraybuffer = Buffer.from(e.target.result);
            setFileArrayBuffer((prevState) => [...prevState, arraybuffer]);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }
  };

  const handleSelect = (e: any) => {
    setPage(1);
    if (e.target.value) {
      setAlbum_id(e.target.value)
      dispatch(getGalleryListById({ token, id: e.target.value, page: 1 }));
      const album = albums.find(
        (album: EnabledAlbumList) => album.id === e.target.value
      );
      if (album) {
        setMaxPage(Math.ceil(album.count / 6));
        setTotal(album.count ? album.count : 0);
      } else {
        setMaxPage(0);
      }
    }
  };

  const handleCheck = (e: any, id: number) => {
    if (e.target.checked) {
      setSelected((prevState) => [...prevState, id]);
    } else {
      setSelected(selected.filter((item: number) => item !== id));
    }
  };

  const handlePageChange = (e: any, newPage: number) => {
    setPage(newPage);
    dispatch(getGalleryListById({ token, id: getValues("id"), page: newPage }));
  };

  const onSubmit = (data: any) => {
    if (fileArrayBuffer.length > 0) {
      dispatch(
        insertGallery({
          token,
          payload: { album_id: data.id, photo: fileArrayBuffer },
        })
      );
      setAlbum_id(data.id);
    } else {
      toast.error("No photo is chosen");
    }
  };

  const handleDelete = () => {
    if (selected.length > 0) {
      dispatch(deleteGallery({ token, payload: { ids: selected } }));
    } else {
      toast.error("No photo is chosen");
    }
  };

  return (
    <div className="gallery">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Photo Gallery</h2>
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
                  <Grid item xs={6}>
                    <Typography>
                      Please select an album to view photos.
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            id="alb_select"
                            {...field}
                            select
                            label="Album"
                            value={album_id}
                            onClick={handleSelect}
                          >
                            {console.log("album_id",album_id)}
                            <MenuItem key={-1} value={-1} disabled>
                              List Of Albums
                            </MenuItem>
                            {albums.length === 0 && (
                              <MenuItem key={0} value={0} disabled>
                                No Available Album
                              </MenuItem>
                            )}
                            {albums.map((data: EnabledAlbumList) => (
                              <MenuItem key={data.id}  value={data.id} selected={ data.id === album_id }>
                                {data?.en_title}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      Displaying{" "}
                      {total > 0 ? (page > 1 ? (page - 1) * 6 + 1 : 1) : 0} -{" "}
                      {total > 0
                        ? total > 6
                          ? page > 1
                            ? page * 6 > total
                              ? total
                              : page * 6
                            : 6
                          : total
                        : 0}{" "}
                      of {total} photos
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.root}>
                    {maxPage ? (
                      <>
                        <ImageList
                          rowHeight={200}
                          className={classes.imageList}
                          cols={3}
                        >
                          {photos.map((item: any) => (
                            <ImageListItem key={item.id} cols={1} rows={1}>
                              <img src={item.src} alt={item.id} style= {{ objectFit: "contain", height: "100%", width: "100%" }} />
                              <ImageListItemBar
                                className={classes.titleBar}
                                position="top"
                                actionIcon={
                                  <Checkbox
                                    style={{ backgroundColor: "white", top: "10px", margin: "10px" }}
                                    color="primary"
                                    onClick={(e) => handleCheck(e, item.id)}
                                  />
                                }
                                actionPosition="left"
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                        <Pagination
                          page={page}
                          count={maxPage}
                          onChange={handlePageChange}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <DropzoneArea
                      key={key}
                      acceptedFiles={["image/*"]}
                      dropzoneText={"Drag and drop an image here or click"}
                      onChange={(files) => uploadFile(files)}
                      filesLimit={6}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {maxPage ? (
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginRight: "2px", width: "49%" }}
                      >
                        UPLOAD
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                      >
                        UPLOAD
                      </Button>
                    )}
                    {maxPage ? (
                      <Button
                        style={{ marginLeft: "2px", width: "49%" }}
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                      >
                        DELETE SELECTED
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
    </div>
  );
}
