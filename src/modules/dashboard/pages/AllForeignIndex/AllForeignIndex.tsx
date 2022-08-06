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
import "./AllForeignIndex.css";
import {
  getAllForeignIndexlist,
  getAllForeignIndexById,
  insertAllForeignIndex,
  updateAllForeignIndex,
  deleteAllForeignIndex,
  AllForeignIndexlistSelector,
  clearState,
} from "./AllForeignIndexSlice";
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

export default function AllForeignIndex() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    AllForeignIndexlist,
    isSuccess,
    isInsertAllForeignIndexSuccess,
    isUpdateAllForeignIndexSuccess,
    isDeleteAllForeignIndexSuccess,
    isError,
    isInsertAllForeignIndexError,
    insertAllForeignIndexErrorMessage,
    isUpdateAllForeignIndexError,
    isDeleteAllForeignIndexError,
    updateAllForeignIndexErrorMessage,
    deleteAllForeignIndexErrorMessage,
    isDataSuccess,
    isDataError,
    AllForeignIndexData,
  } = useSelector(AllForeignIndexlistSelector);
  const [searchdata, setSearchdata] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [searched, setSearched] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState("");
  const [fileArrayBuffer, setFileArrayBuffer] = useState<any>();
  const [image, setImage] = useState<any>("")
  const [sEditor, setsEditor] = useState<CKEditorInstance>();
  const [fEditor, setfEditor] = useState<CKEditorInstance>();
  const [editId, setEditId] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const { register, handleSubmit, control, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        date: dayjs().format("YYYY-MM-DD"),
        title: "",
        thai_title: "",
        sContent: "",
        fContent: "",
        banner: "",
      },
    });

  useEffect(() => {
    dispatch(getAllForeignIndexlist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(getAllForeignIndexlist({ token }));

    if (isInsertAllForeignIndexSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateAllForeignIndexSuccess) {
      toast.success("Successfully updated.");
    }

    if (isDeleteAllForeignIndexSuccess) {
      toast.success("Successfully deleted.");
    }

    dispatch(clearState());
  }, [isInsertAllForeignIndexSuccess, isUpdateAllForeignIndexSuccess, isDeleteAllForeignIndexSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setSearchdata(AllForeignIndexlist);
      setData(AllForeignIndexlist);
    }

    if (isError) {
      toast.error(`Unable to load data list`);
      dispatch(clearState());
    }
  }, [isSuccess, isError, AllForeignIndexlist]);

  useEffect(() => {
    if (isDataSuccess) {
      setValue("date", dayjs(AllForeignIndexData[0].publish_date).format("YYYY-MM-DD"));
      setValue("title", AllForeignIndexData[0].en_title);
      setValue("thai_title", AllForeignIndexData[0].thai_title);
      setValue("sContent", AllForeignIndexData[0].en_full_content);
      sEditor?.setData(AllForeignIndexData[0].en_full_content);
      setValue("fContent", AllForeignIndexData[0].thai_full_content);
      fEditor?.setData(AllForeignIndexData[0].thai_full_content);
      dispatch(clearState());
      const arraybuffer = (AllForeignIndexData[0].image) ? AllForeignIndexData[0].image : "";
      const base64String =Buffer.from(arraybuffer).toString("base64");
        setFileArrayBuffer(arraybuffer);
        setImage(`data:image/png;base64,${base64String}`);
    }

    if (isDataError) {
      toast.error(`Unable to retrieve data`);
      dispatch(clearState());
    }
  }, [isDataSuccess, isDataError, AllForeignIndexData]);

  useEffect(() => {
    if (isInsertAllForeignIndexError) {
      toast.error(`Save failed`);
      dispatch(clearState());
    }
    if (isUpdateAllForeignIndexError) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
    if (isDeleteAllForeignIndexError) {
      toast.error(`Delete failed`);
      dispatch(clearState());
    }
  }, [isInsertAllForeignIndexError, isUpdateAllForeignIndexError, isDeleteAllForeignIndexError]);

  const handleEdit = (id: number) => {
    dispatch(getAllForeignIndexById({ token, id }));
    setButton(false);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteAllForeignIndex({ token, id }));
    reset();
    sEditor.setData();
    fEditor.setData();
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

  const submitAllForeignIndex = (e: any) => {
    if (e.title) {
      dispatch(
        insertAllForeignIndex({
          token,
          payload: {
            publish_date: e.date,
            dw_tips_status: 1,
            en_title: e.title,
            thai_title: e.thai_title,
            en_full_content: e.sContent,
            thai_full_content: e.fContent,
            image: (fileArrayBuffer) ? fileArrayBuffer : null
          },
        })
      );
      reset();
      sEditor.setData();
      fEditor.setData();
    } else {
      toast.error(`Please input title`);
    }
  };

  const handleUpdate = () => {
    if (getValues("title")) {
      dispatch(
        updateAllForeignIndex({
          token,
          id: editId,
          payload: {
            publish_date: getValues("date"),
            en_title: getValues("title"),
            dw_tips_status: 1,
            thai_title: getValues("thai_title"),
            en_full_content: getValues("sContent"),
            thai_full_content: getValues("fContent"),
            image: (fileArrayBuffer) ? fileArrayBuffer : null
          },
        })
      );
      reset();
      sEditor.setData();
      fEditor.setData();
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
              <h2>All foreign index DW trading tips</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(submitAllForeignIndex)}
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
                  Banner Image:
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

                  <Grid item xs={3}>
                    <Typography>Content (Full English Version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <CKEditor
                        onInstanceReady={({ editor }) => {
                          setsEditor(editor);
                        }}
                        onChange={({ editor }) => {
                          setValue(
                            "sContent",
                            editor.document.getBody().$.innerHTML
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Content (Full Thai version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <CKEditor
                        onInstanceReady={({ editor }) => {
                          setfEditor(editor);
                        }}
                        onChange={({ editor }) => {
                          setValue(
                            "fContent",
                            editor.document.getBody().$.innerHTML
                          );
                        }}
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
