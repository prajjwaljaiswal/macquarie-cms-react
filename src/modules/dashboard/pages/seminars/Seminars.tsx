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
  Fab,
  Checkbox,
  ListItem,
  ListItemIcon,
  Modal,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  EditOutlined,
  DeleteOutline,
  NoteAdd,
  CloudUpload,
} from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getSeminarlist,
  getSeminarById,
  createSeminar,
  updateSeminar,
  deleteSeminar,
  SeminarSelector,
  clearState,
} from "./SeminarSlice";
import "./Seminars.css";
import { CKEditor, CKEditorInstance } from "ckeditor4-react";
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

type SeminarList = {
  id: number;
  seminar_date: string;
  en_title: string;
  en_seminar_time: string;
  sign_up_limit: number;
  seminar_status: string;
};

export default function Seminars() {
  const classes = useStyles();
  const [searchdata, setSearchdata] = useState<SeminarList[]>([]);
  const [data, setData] = useState<SeminarList[]>([]);
  const [searched, setSearched] = useState<string>("");
  const [editor, setEditor] = useState<CKEditorInstance>();
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [id, setId] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm({
      defaultValues: {
        date: dayjs().format("YYYY-MM-DD"),
        limit: "0",
        link: "",
        status: false,
        time: "",
        title: "",
        venue: "",
        content: "",
        file: null,
      },
    });
  const [fileArrayBuffer, setFileArrayBuffer] = useState<ArrayBuffer>();
  const [selectedFile, setSelectedFile] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    Seminarlist,
    Seminar,
    isListSuccess,
    isListError,
    isSeminarSuccess,
    isSeminarError,
    isCreateSeminarSuccess,
    isCreateSeminarError,
    isUpdateSeminarSuccess,
    isUpdateSeminarError,
    isDeleteSeminarSuccess,
    isDeleteSeminarError,
    seminarErrorMessage,
    createSeminarErrorMessage,
    updateSeminarErrorMessage,
    deleteSeminarErrorMessage,
  } = useSelector(SeminarSelector);

  useEffect(() => {
    dispatch(getSeminarlist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isListSuccess) {
      if(Seminarlist){
        setSearchdata(Seminarlist);
        setData(Seminarlist);
      }
    }

    if (isListError) {
      toast.error("Unable to load the Seminar List");
    }
  }, [isListSuccess, isListError, Seminarlist]);

  useEffect(() => {
    if (
      isCreateSeminarSuccess ||
      isUpdateSeminarSuccess ||
      isDeleteSeminarSuccess
    ) {
      dispatch(getSeminarlist({ token }));
      reset();
      setButton(true);
      editor.setData();
      setSelectedFile("");
    }

    if (isCreateSeminarSuccess) {
      toast.success("Successfully saved seminar.");
    }

    if (isUpdateSeminarSuccess) {
      toast.success("Successfully updated seminar.");
    }

    if (isDeleteSeminarSuccess) {
      toast.success("Successfully deleted seminar.");
    }

    if (isCreateSeminarError) {
      toast.error(`Save failed`);
    }

    if (isUpdateSeminarError) {
      toast.error(`Update failed`);
    }

    if (isDeleteSeminarError) {
      toast.error(`Delete failed`);
    }
    dispatch(clearState());
  }, [
    isCreateSeminarSuccess,
    isCreateSeminarError,
    isUpdateSeminarSuccess,
    isUpdateSeminarError,
    isDeleteSeminarSuccess,
    isDeleteSeminarError,
  ]);

  useEffect(() => {
    if (isSeminarSuccess) {
      setValue("date", Seminar.seminar_date);
      setValue("limit", Seminar.sign_up_limit);
      setValue("link", Seminar.registration_link);
      setValue("status", Seminar.seminar_status === "Y" ? true : false);
      setValue("time", Seminar.en_seminar_time);
      setValue("title", Seminar.en_title);
      setValue("venue", Seminar.en_venue);
      setValue("content", Seminar.en_introduce_content);
      editor?.setData(Seminar.en_introduce_content);
      setImage(`${api}/file/image/seminar/${Seminar.id}`);
    }

    if (isSeminarError) {
      toast.error("Unable to load Seminar");
    }
    dispatch(clearState());
  }, [isSeminarSuccess, isSeminarError, Seminar]);

  const handleEdit = (id: number) => {
    setId(id);
    setButton(false);
    dispatch(getSeminarById({ token, id }));
    setSelectedFile("");
    setFileArrayBuffer(undefined);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteSeminar({ token, id }));
    setFileArrayBuffer(undefined);
  };

  const handleUpdate = (data: any) => {
    dispatch(
      updateSeminar({
        token,
        id,
        payload: {
          seminar_date: getValues("date"),
          en_seminar_time: getValues("time"),
          sign_up_limit: parseInt(getValues("limit")),
          seminar_status: getValues("status") ? "Y" : "N",
          en_title: getValues("title"),
          en_venue: getValues("venue"),
          en_introduce_content: getValues("content"),
          en_poster: fileArrayBuffer ? fileArrayBuffer : null,
          registration_link: getValues("link")
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
    const filteredRows = searchdata.filter((row: SeminarList) => {
      return (
        row?.id === Number(searchedVal) ||
        row?.seminar_date?.includes(searchedVal.toLowerCase()) ||
        row?.en_title?.toLowerCase().includes(searchedVal.toLowerCase())
      );
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
      createSeminar({
        token,
        payload: {
          seminar_date: getValues("date"),
          en_seminar_time: getValues("time"),
          sign_up_limit: parseInt(getValues("limit")),
          seminar_status: getValues("status") ? "Y" : "N",
          en_title: getValues("title"),
          en_venue: getValues("venue"),
          en_introduce_content: getValues("content"),
          en_poster: fileArrayBuffer ? fileArrayBuffer : null,
          registration_link: getValues("link"),
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
      field: "seminar_date",
      headerName: "Date",
      flex: 2,
    },
    {
      field: "en_title",
      headerName: "Title",
      flex: 2,
    },
    {
      field: "en_seminar_time",
      headerName: "Time",
      flex: 2,
    },
    {
      field: "sign_up_limit",
      headerName: "Limit",
      flex: 2,
    },

    { field: "seminar_status", headerName: "Status", width: 120 },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: (params: any) => {
        return (
          <>
            <EditOutlined
              className="seminar-edit"
              onClick={() => handleEdit(params.row.id)}
            />
            /
            <DeleteOutline
              className="seminar-delete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="seminars">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Seminars</h2>
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
                    <Typography>Seminar date:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Seminar date"
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
                    <Typography>Sign up limit: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="limit"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Sign up limit"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                        rules={{
                          required: "Seminar date required",
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Registration link: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="link"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Registration link"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Enable:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <ListItem dense button>
                            <ListItemIcon>
                              <Checkbox
                                {...field}
                                edge="start"
                                checked={field.value}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                          </ListItem>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography style={{ fontStyle: "italic" }}>
                      (English version)
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Seminar time:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="time"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Seminar time"
                            placeholder="eg. 2.00-5.00 pm"
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                        rules={{
                          required: "Start Time required",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Title: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Title"
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
                    <Typography>Venue: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="venue"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Venue"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                        rules={{
                          required: "Venue is required",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* <Grid item xs={3}>
                    <Typography>Partner: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="partner"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Partner"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                        rules={{
                          required: "Partner is required",
                        }}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={3}>
                    <FormControl>
                      <Typography>Image:</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl>
                      <Controller
                        name="file"
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
                      <Typography>(Recommended size: 345x360)</Typography>
                    </FormControl>
                  </Grid>

                  {/* <Grid item xs={3}>
                    <Typography>Event is a webinar:</Typography>
                  </Grid> */}

                  {/* <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="webinar"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <ListItem dense button>
                            <ListItemIcon>
                              <Checkbox
                                {...field}
                                edge="start"
                                checked={field.value}
                                tabIndex={-1}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  if (e.target.checked) {
                                    setDisable(false);
                                  } else {
                                    setDisable(true);
                                    setValue("recorded", false);
                                  }
                                }}
                                disableRipple
                              />
                            </ListItemIcon>
                          </ListItem>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Webinar is recorded:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="recorded"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <ListItem dense button>
                            <ListItemIcon>
                              <Checkbox
                                {...field}
                                disabled={disable}
                                edge="start"
                                checked={field.value}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                          </ListItem>
                        )}
                      />
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <CKEditor
                        onInstanceReady={({ editor }) => {
                          setEditor(editor);
                        }}
                        onChange={({ editor }) => {
                          setValue(
                            "content",
                            editor.document.getBody().$.innerHTML
                          );
                        }}
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
                  </Grid>

                  <Modal open={open} onClose={() => setOpen(false)}>
                    <Grid xs={12} className={classes.modal}>
                      <img className={classes.img} src={image} />
                    </Grid>
                  </Modal>
                </Grid>
              </form>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={3}>
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
                  onPageSizeChange={pageSize => setPageSize(pageSize)}
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
