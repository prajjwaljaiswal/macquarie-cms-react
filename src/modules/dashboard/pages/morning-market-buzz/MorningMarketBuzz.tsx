import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Typography,
  Select,
  TextField,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { EditOutlined, DeleteOutline } from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import { useEffect, useState } from "react";
import "./MorningMarketBuzz.css";
import {
  getMMBList,
  getMMBById,
  insertMMB,
  updateMMB,
  deleteMMB,
  MMBlistSelector,
  clearState,
} from "./MorningMarketBuzzSlice";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { CKEditor, CKEditorInstance } from "ckeditor4-react";
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

export default function MorningMarketBuzz() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    MMBlist,
    isSuccess,
    isInsertMMBSuccess,
    isUpdateMMBSuccess,
    isDeleteMMBSuccess,
    isError,
    isInsertMMBError,
    insertMMBErrorMessage,
    isUpdateMMBError,
    isDeleteMMBError,
    updateMMBErrorMessage,
    deleteMMBErrorMessage,
    isDataSuccess,
    isDataError,
    MMBData,
  } = useSelector(MMBlistSelector);

  const statusList = ["Disable", "Enable"];
  const [data, setData] = useState<any>([]);
  const [searchdata, setSerachdata] = useState<any>([]);
  const [searched, setSearched] = useState<string>("");
  const [sEditor, setsEditor] = useState<CKEditorInstance>();
  const [fEditor, setfEditor] = useState<CKEditorInstance>();
  const [editId, setEditId] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const { register, handleSubmit, control, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        status: 0,
        date: dayjs().format("YYYY-MM-DD"),
        title: "",
        sContent: "",
        fContent: "",
      },
    });

  useEffect(() => {
    dispatch(getMMBList({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(getMMBList({ token }));

    if (isInsertMMBSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateMMBSuccess) {
      toast.success("Successfully updated.");
    }

    if (isDeleteMMBSuccess) {
      toast.success("Successfully deleted.");
    }
    dispatch(clearState());
  }, [isInsertMMBSuccess, isUpdateMMBSuccess, isDeleteMMBSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setSerachdata(MMBlist);
      setData(MMBlist);
    }

    if (isError) {
      toast.error(`Unable to load data list`);
      dispatch(clearState());
    }
  }, [isSuccess, isError, MMBlist]);

  useEffect(() => {
    if (isDataSuccess) {
      setValue("status", MMBData.daily_highlight_status);
      setValue("date", dayjs(MMBData.publish_date).format("YYYY-MM-DD"));
      setValue("title", MMBData.en_title);
      setValue("sContent", MMBData.en_short_content);
      sEditor?.setData(MMBData.en_short_content);
      setValue("fContent", MMBData.en_full_content);
      fEditor?.setData(MMBData.en_full_content);
      dispatch(clearState());
    }

    if (isDataError) {
      toast.error(`Unable to retrieve data`);
      dispatch(clearState());
    }
  }, [isDataSuccess, isDataError, MMBData]);

  useEffect(() => {
    if (isInsertMMBError) {
      toast.error(`Save failed`);
      dispatch(clearState());
    }
    if (isUpdateMMBError) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
    if (isDeleteMMBError) {
      toast.error(`Delete failed`);
      dispatch(clearState());
    }
  }, [isInsertMMBError, isUpdateMMBError, isDeleteMMBError]);

  const handleEdit = (id: number) => {
    dispatch(getMMBById({ token, id }));
    setButton(false);
    setEditId(id);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteMMB({ token, id }));
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

  const submitMMB = (e: any) => {
    if (e.title) {
      dispatch(
        insertMMB({
          token,
          payload: {
            daily_highlight_status: e.status,
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
        updateMMB({
          token,
          id: editId,
          payload: {
            daily_highlight_status: getValues("status"),
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
      field: "daily_highlight_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: any) => {
        return params.formattedValue === 0 ? "Disable" : "Enable";
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
              className="morning-market-buzz-edit"
              onClick={() => handleEdit(params.row.id)}
            />
            /
            <DeleteOutline
              className="morning-market-buzz-delete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="morning-market-buzz">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Morning Market Buzz</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(submitMMB)}
              >
                <Grid item container xs={12} spacing={3}>
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
                        onClick={handleUpdate}
                        fullWidth
                        variant="contained"
                        color="primary"
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
