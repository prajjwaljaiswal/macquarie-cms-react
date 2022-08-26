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
  Typography,
  Button,
  Fab,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { EditOutlined, DeleteOutline, CloudUpload } from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import { useEffect, useState } from "react";
import "./DailyMarketAnalysis.css";
import {
  getDailyMarketAnalysislist,
  getDailyMarketAnalysisById,
  insertDailyMarketAnalysis,
  updateDailyMarketAnalysis,
  deleteDailyMarketAnalysis,
  DailyMarketAnalysislistSelector,
  clearState,
} from "./DailyMarketAnalysisSlice";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { CKEditor, CKEditorInstance } from "ckeditor4-react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

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
  imageUpload: {
    width: "100%",
  }
}));

export default function DailyMarketAnalysis() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    DailyMarketAnalysislist,
    isSuccess,
    isInsertDailyMarketAnalysisSuccess,
    isUpdateDailyMarketAnalysisSuccess,
    isDeleteDailyMarketAnalysisSuccess,
    isError,
    isInsertDailyMarketAnalysisError,
    insertDailyMarketAnalysisErrorMessage,
    isUpdateDailyMarketAnalysisError,
    isDeleteDailyMarketAnalysisError,
    updateDailyMarketAnalysisErrorMessage,
    deleteDailyMarketAnalysisErrorMessage,
    isDataSuccess,
    isDataError,
    DailyMarketAnalysisData,
  } = useSelector(DailyMarketAnalysislistSelector);
  const [searchdata, setSearchdata] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [searched, setSearched] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState("");
  const [fileArrayBuffer, setFileArrayBuffer] = useState<any>();
  const [image, setImage] = useState<any>("")
  const [editId, setEditId] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const { register, handleSubmit, control, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        date: dayjs().format("YYYY-MM-DD"),
        title: "",
        thai_title: "",
        video_link: "",
        banner: "",
      },
    });

  useEffect(() => {
    dispatch(getDailyMarketAnalysislist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(getDailyMarketAnalysislist({ token }));

    if (isInsertDailyMarketAnalysisSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateDailyMarketAnalysisSuccess) {
      toast.success("Successfully updated.");
    }

    if (isDeleteDailyMarketAnalysisSuccess) {
      toast.success("Successfully deleted.");
    }

    dispatch(clearState());
  }, [isInsertDailyMarketAnalysisSuccess, isUpdateDailyMarketAnalysisSuccess, isDeleteDailyMarketAnalysisSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setSearchdata(DailyMarketAnalysislist);
      if(DailyMarketAnalysislist){
        setData(DailyMarketAnalysislist);
      }
    }

    if (isError) {
      toast.error(`Unable to load data list`);
      dispatch(clearState());
    }
  }, [isSuccess, isError, DailyMarketAnalysislist]);

  useEffect(() => {
    if (isDataSuccess) {
      setValue("date", dayjs(DailyMarketAnalysisData[0].publish_date).format("YYYY-MM-DD"));
      setValue("title", DailyMarketAnalysisData[0].en_title);
      setValue("thai_title", DailyMarketAnalysisData[0].thai_title);
      setValue("video_link", DailyMarketAnalysisData[0].link);
      dispatch(clearState());
      const arraybuffer = (DailyMarketAnalysisData[0].image) ? DailyMarketAnalysisData[0].image : "";
      const base64String =Buffer.from(arraybuffer).toString("base64");
        setFileArrayBuffer(arraybuffer);
        setImage(`data:image/png;base64,${base64String}`);
    }

    if (isDataError) {
      toast.error(`Unable to retrieve data`);
      dispatch(clearState());
    }
  }, [isDataSuccess, isDataError, DailyMarketAnalysisData]);

  useEffect(() => {
    if (isInsertDailyMarketAnalysisError) {
      toast.error(`Save failed`);
      dispatch(clearState());
    }
    if (isUpdateDailyMarketAnalysisError) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
    if (isDeleteDailyMarketAnalysisError) {
      toast.error(`Delete failed`);
      dispatch(clearState());
    }
  }, [isInsertDailyMarketAnalysisError, isUpdateDailyMarketAnalysisError, isDeleteDailyMarketAnalysisError]);

  const handleEdit = (id: number) => {
    dispatch(getDailyMarketAnalysisById({ token, id }));
    setButton(false);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteDailyMarketAnalysis({ token, id }));
    reset();
    setButton(true);
  };

  const requestSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setData(searchdata);
    }
    const filteredRows = searchdata.filter((row: any) => {
      return (
        row?.id === Number(searchedVal) ||
        row?.publish_date?.includes(searchedVal.toLowerCase()) ||
        row?.en_title?.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const submitDailyMarketAnalysis = (e: any) => {
    if (e.title) {
      dispatch(
        insertDailyMarketAnalysis({
          token,
          payload: {
            publish_date: e.date,
            en_title: e.title,
            link: getValues("video_link"),
            thai_title: e.thai_title,
            image: (fileArrayBuffer) ? fileArrayBuffer : null
          },
        })
      );
      reset();
    } else {
      toast.error(`Please input title`);
    }
  };

  const handleUpdate = () => {
    if (getValues("title")) {
      dispatch(
        updateDailyMarketAnalysis({
          token,
          id: editId,
          payload: {
            publish_date: getValues("date"),
            en_title: getValues("title"),
            link: getValues("video_link"),
            thai_title: getValues("thai_title"),
            image: (fileArrayBuffer) ? fileArrayBuffer : null
          },
        })
      );
      reset();
      setButton(true);
    } else {
      toast.error(`Please input title`);
    }
  };


  const uploadTips = (e: any) => {
    const file = e?.target?.files[0];
    console.log(file);
    if (!file) {
      return setSelectedFile("");
    }
    setSelectedFile(file?.name);
    let reader = new FileReader();
    reader.onload = function (e) {
      if (e?.target?.result) {
        const arraybuffer = Buffer.from(e.target.result);
        const base64String =Buffer.from(arraybuffer).toString("base64");
        setFileArrayBuffer(arraybuffer);
        setImage(`data:image/png;base64,${base64String}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true
    },
    {
      field: "publish_date",
      headerName: "Published Date",
      flex: 1,
      renderCell: (params: any) => {
        return dayjs(params.formattedValue).format("YYYY-MM-DD");
      },
    },
    {
      field: "en_title",
      headerName: "Title (English)",
      flex: 3,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>
            <EditOutlined
              className="overnight-market-wrap-edit"
              onClick={() => handleEdit(params.row.id)}
            />
            /
            <DeleteOutline
              className="overnight-market-wrap-delete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="overnight-market-wrap">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Daily Market Analysis</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(submitDailyMarketAnalysis)}
              >
                <Grid item container xs={12} spacing={3}>
                  <Grid item xs={3}>
                    <Typography>Publish Date:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="datetime-local"
                            label="Publish Date:"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Title (English version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name="title"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Title (English version)"
                            fullWidth
                            margin="normal"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>


                  <Grid item xs={3}>
                    <Typography>Title (Thai version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name="thai_title"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Title (Thai version)"
                            fullWidth
                            margin="normal"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={3}>
                    <Typography>Video Link:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name="video_link"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Video Link"
                            fullWidth
                            margin="normal"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                  Video Image:
                  </Grid>
                  <Grid item xs={9}>
                       <img src={image} className={classes.imageUpload} /> 
                  </Grid>    

                  <Grid item xs={3}>
                   
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
                        onClick={handleUpdate}
                      >
                        Update
                      </Button>
                    )}
                  </Grid>
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
