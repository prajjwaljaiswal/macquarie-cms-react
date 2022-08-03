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
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { EditOutlined, DeleteOutline } from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import { useEffect, useState } from "react";
import "./OvernightMarketWrap.css";
import {
  getOMWlist,
  getOMWById,
  insertOMW,
  updateOMW,
  deleteOMW,
  OMWlistSelector,
  clearState,
} from "./OvernightMarketWrapSlice";
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
  dataContainer: {
    height: "500px",
  },
}));

export default function OvernightMarketWrap() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    OMWlist,
    isSuccess,
    isInsertOMWSuccess,
    isUpdateOMWSuccess,
    isDeleteOMWSuccess,
    isError,
    isInsertOMWError,
    insertOMWErrorMessage,
    isUpdateOMWError,
    isDeleteOMWError,
    updateOMWErrorMessage,
    deleteOMWErrorMessage,
    isDataSuccess,
    isDataError,
    OMWData,
  } = useSelector(OMWlistSelector);
  const [searchdata, setSearchdata] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [searched, setSearched] = useState<string>("");
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
        sContent: "",
        fContent: "",
      },
    });

  useEffect(() => {
    dispatch(getOMWlist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(getOMWlist({ token }));

    if (isInsertOMWSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateOMWSuccess) {
      toast.success("Successfully updated.");
    }

    if (isDeleteOMWSuccess) {
      toast.success("Successfully deleted.");
    }

    dispatch(clearState());
  }, [isInsertOMWSuccess, isUpdateOMWSuccess, isDeleteOMWSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setSearchdata(OMWlist);
      setData(OMWlist);
    }

    if (isError) {
      toast.error(`Unable to load data list`);
      dispatch(clearState());
    }
  }, [isSuccess, isError, OMWlist]);

  useEffect(() => {
    if (isDataSuccess) {
      setValue("date", dayjs(OMWData.publish_date).format("YYYY-MM-DD"));
      setValue("title", OMWData.en_title);
      setValue("sContent", OMWData.en_short_content);
      sEditor?.setData(OMWData.en_short_content);
      setValue("fContent", OMWData.en_full_content);
      fEditor?.setData(OMWData.en_full_content);
      dispatch(clearState());
    }

    if (isDataError) {
      toast.error(`Unable to retrieve data`);
      dispatch(clearState());
    }
  }, [isDataSuccess, isDataError, OMWData]);

  useEffect(() => {
    if (isInsertOMWError) {
      toast.error(`Save failed`);
      dispatch(clearState());
    }
    if (isUpdateOMWError) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
    if (isDeleteOMWError) {
      toast.error(`Delete failed`);
      dispatch(clearState());
    }
  }, [isInsertOMWError, isUpdateOMWError, isDeleteOMWError]);

  const handleEdit = (id: number) => {
    dispatch(getOMWById({ token, id }));
    setButton(false);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteOMW({ token, id }));
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

  const submitOMW = (e: any) => {
    if (e.title) {
      dispatch(
        insertOMW({
          token,
          payload: {
            publish_date: e.date,
            en_title: e.title,
            en_short_content: e.sContent,
            en_full_content: e.fContent,
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
        updateOMW({
          token,
          id: editId,
          payload: {
            publish_date: getValues("date"),
            en_title: getValues("title"),
            en_short_content: getValues("sContent"),
            en_full_content: getValues("fContent"),
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
              <h2>Overnight Market Wrap</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(submitOMW)}
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
                    <Typography>Content (Preview):</Typography>
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
                    <Typography>Content (Full English version):</Typography>
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
