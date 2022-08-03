import {
  makeStyles,
  Card,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Fab,
  Modal,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { EditOutlined, DeleteOutline, CloudUpload } from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { loginSelector } from "../../../login/loginSlice";
import {
  getAlbumList,
  getAlbumById,
  AlbumlistSelector,
  clearState,
  insertAlbum,
  updateAlbum,
  deleteAlbum,
} from "./AlbumCoverSlice";
import { useDispatch, useSelector } from "react-redux";
import "./AlbumCover.css";
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
  root: {
    display: "flex",
    flexWrap: "wrap",
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
}));

type albumList = {
  count: string;
  en_title: string;
  id: number;
  last_update_time: string;
  status: number;
};

export default function Seminars() {
  const classes = useStyles();
  const statusList = ["Disable", "Enable"];
  const [searchdata, setSearchdata] = useState<albumList[]>([]);
  const [data, setData] = useState<albumList[]>([]);
  const [searched, setSearched] = useState<string>("");
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm({
      defaultValues: {
        date: dayjs().format("YYYY-MM-DD"),
        status: 0,
        title: "",
        cover: null,
        description: "",
      },
    });
  const [fileArrayBuffer, setFileArrayBuffer] = useState<ArrayBuffer>();
  const [selectedFile, setSelectedFile] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    Albumlist,
    isSuccess,
    isError,
    Cover,
    isCoverSuccess,
    isCoverError,
    isCreateAlbumSuccess,
    isUpdateAlbumSuccess,
    isDeleteAlbumSuccess,
    isCreateAlbumError,
    isUpdateAlbumError,
    isDeleteAlbumError,
    createAlbumErrorMessage,
    updateAlbumErrorMessage,
    deleteAlbumErrorMessage,
  } = useSelector(AlbumlistSelector);

  useEffect(() => {
    dispatch(getAlbumList({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setSearchdata(Albumlist);
      setData(Albumlist);
    }

    if (isError) {
      toast.error("Unable to load Album List");
    }
  }, [isSuccess, isError, Albumlist]);

  useEffect(() => {
    if (isCoverSuccess) {
      setValue("date", Cover.date);
      setValue("status", Cover.status);
      setValue("title", Cover.en_title);
      setValue("description", Cover.en_description);

      setImage(`${api}/file/image/album/${Cover.id}`);
    }

    if (isCoverError) {
      toast.error("Unable to load Album");
    }

    dispatch(clearState());
  }, [isCoverSuccess, isCoverError, Cover]);

  useEffect(() => {
    if (isCreateAlbumSuccess || isUpdateAlbumSuccess || isDeleteAlbumSuccess) {
      dispatch(getAlbumList({ token }));
      reset();
      setButton(true);
      setSelectedFile("");
    }

    if (isCreateAlbumSuccess) {
      toast.success("Successfully saved album.");
    }

    if (isUpdateAlbumSuccess) {
      toast.success("Successfully updated album.");
    }

    if (isDeleteAlbumSuccess) {
      toast.success("Successfully deleted album.");
    }

    if (isCreateAlbumError) {
      toast.error(`Save failed`);
    }

    if (isUpdateAlbumError) {
      toast.error(`Update failed`);
    }

    if (isDeleteAlbumError) {
      toast.error(`Delete failed`);
    }
    dispatch(clearState());
  }, [
    isCreateAlbumSuccess,
    isCreateAlbumError,
    isUpdateAlbumSuccess,
    isUpdateAlbumError,
    isDeleteAlbumSuccess,
    isDeleteAlbumError,
  ]);

  const handleEdit = (id: number) => {
    dispatch(getAlbumById({ token, id }));
    setId(id);
    setButton(false);
    setSelectedFile("");
    setFileArrayBuffer(undefined);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteAlbum({ token, id }));
    setFileArrayBuffer(undefined);
  };

  const handleUpdate = (data: any) => {
    dispatch(
      updateAlbum({
        token,
        id,
        payload: {
          date: getValues("date"),
          status: getValues("status"),
          en_title: getValues("title"),
          en_description: getValues("description"),
          cover: fileArrayBuffer ? fileArrayBuffer : null,
        },
      })
    );
  };

  const handleView = () => {
    setOpen(true);
  };

  const requestSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setData(searchdata);
    }
    const filteredRows = searchdata.filter((row: any) => {
      return row?.en_title?.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setData(filteredRows);
  };

  const uploadFile = (e: any) => {
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

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const onSubmit = (data: any) => {
    dispatch(
      insertAlbum({
        token,
        payload: {
          date: getValues("date"),
          status: getValues("status"),
          en_title: getValues("title"),
          en_description: getValues("description"),
          cover: fileArrayBuffer ? fileArrayBuffer : null,
        },
      })
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "last_update_time",
      headerName: "Last Update Time",
      flex: 2,
      renderCell: (param: any) => {
        return dayjs(param.formattedValue).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      renderCell: (param: any) => {
        return param.formattedValue === 0 ? "Disabled" : "Enabled";
      },
    },
    {
      field: "en_title",
      headerName: "Title (English)",
      flex: 2,
    },
    {
      field: "count",
      headerName: "No. of Photos",
      flex: 2,
      renderCell: (param: any) => {
        return param.formattedValue ? param.formattedValue : "0";
      },
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 2,
      renderCell: (params: any) => {
        return (
          <>
            <EditOutlined
              className="album-edit"
              onClick={() => handleEdit(params.row.id)}
            />
            /
            <DeleteOutline
              className="album-delete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="albums">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Photo Gallery Album Cover</h2>
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
                    <Typography>Update Time:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Update Time"
                            type="date"
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                        rules={{
                          required: "Seminar date required",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Title (English version): </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Title (English version)"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                        rules={{
                          required: "Title required",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <FormControl>
                      <Typography>File:</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl>
                      <Controller
                        name="cover"
                        control={control}
                        render={({ field }) => (
                          <>
                            <input
                              accept="image/*"
                              className={classes.invisibleInput}
                              id="icon-button-file"
                              type="file"
                              onChange={uploadFile}
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
                  <Grid item xs={4}>
                    <FormControl>
                      <Typography>(Recommended size: 1090x465)</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Status:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-mutiple-name-label">
                        Status
                      </InputLabel>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                          >
                            {statusList.map((value, index) => (
                              <MenuItem key={index} value={index}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Description (English version):"
                            multiline
                            fullWidth
                            rows={10}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    {button && (
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                      >
                        New
                      </Button>
                    )}
                    {!button && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginRight: "2px", width: "49%" }}
                        onClick={handleSubmit(handleUpdate)}
                      >
                        Update
                      </Button>
                    )}
                    {!button && (
                      <Button
                        style={{ marginLeft: "2px", width: "49%" }}
                        variant="contained"
                        onClick={handleView}
                      >
                        View Image
                      </Button>
                    )}
                    <Modal open={open} onClose={() => setOpen(false)}>
                      <Grid xs={12} className={classes.modal}>
                        <img className={classes.img} src={image} />
                      </Grid>
                    </Modal>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid container item xs={12} spacing={3}>
              <Grid container item justifyContent="flex-end">
                <Grid item xs={4}>
                  <SearchBar
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} className={classes.dataContainer}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={pageSize}
                  onPageSizeChange={ pageSize  => setPageSize(pageSize)}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  componentsProps={{
                    pagination: {
                      labelRowsPerPage: "Entries per page:",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
