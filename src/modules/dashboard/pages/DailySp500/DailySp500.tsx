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
    Checkbox,
    Fab,
  } from "@material-ui/core";
  import { DataGrid } from "@material-ui/data-grid";
  import { EditOutlined, DeleteOutline, CloudUpload } from "@material-ui/icons";
  import SearchBar from "material-ui-search-bar";
  import { useEffect, useState } from "react";
  import "./DailySp500.css";
  import {
    getDailySp500list,
    getDailySp500ById,
    getDailySp500Search,
    insertDailySp500,
    updateDailySp500,
    deleteDailySp500,
    DailySp500listSelector,
    clearState,
    updateDailySp500Image,
  } from "./DailySp500Slice";
  import { loginSelector } from "../../../login/loginSlice";
  import { useDispatch, useSelector } from "react-redux";
  import dayjs from "dayjs";
  import { CKEditor, CKEditorInstance } from "ckeditor4-react";
  import { useForm, Controller } from "react-hook-form";
  import toast, { Toaster } from "react-hot-toast";
import { Autocomplete } from "@material-ui/lab";
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
    imageUpload: {
      width: "100%",
    }
  }));




  export default function DailySp500() {    
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    DailySp500list,
    DailySp500DataSearch,
    isDataSearchSuccess,
    isSuccess,
    isInsertDailySp500Success,
    isUpdateDailySp500Success,
    isDeleteDailySp500Success,
    isError,
    isInsertDailySp500Error,
    insertDailySp500ErrorMessage,
    isUpdateDailySp500Error,
    isDeleteDailySp500Error,
    updateDailySp500ErrorMessage,
    deleteDailySp500ErrorMessage,
    isDataSuccess,
    isDataError,
    DailySp500Data,
  } = useSelector(DailySp500listSelector);
  const [searchdata, setSearchdata] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [dwData, setDwData] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileArrayBuffer, setFileArrayBuffer] = useState<any>("");
  const [image, setImage] = useState<string>("")
  const [searched, setSearched] = useState<string>("");
  const [searchedSymbol, setSearchedSymbol] = useState<any>([]);
  const [sEditor, setsEditor] = useState<CKEditorInstance>();
  const [fEditor, setfEditor] = useState<CKEditorInstance>();
  const [thaisEditor, setthaisEditor] = useState<CKEditorInstance>();
  const [thaifEditor, setthaifEditor] = useState<CKEditorInstance>();
  const [editId, setEditId] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);

  const [checkbox, setCheckbox] = useState<boolean>(false);

  const { register, handleSubmit, control, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        date: dayjs().format("YYYY-MM-DD"),
        id: 0,
        title: "",
        thai_title: "",
        daily_sp500_status: 1,
        en_short_content: "",
        en_full_content: "",
        thai_short_content: "",
        thai_full_content: "",
        thai_content: "",
        banner: ""
      },
    });

  useEffect(() => {
    dispatch(getDailySp500list({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(getDailySp500list({ token }));

    if (isInsertDailySp500Success) {
      toast.success("Successfully saved.");
    }

    if (isUpdateDailySp500Success) {
      toast.success("Successfully updated.");
    }

    if (isDeleteDailySp500Success) {
      toast.success("Successfully deleted.");
    }

    dispatch(clearState());
  }, [isInsertDailySp500Success, isUpdateDailySp500Success, isDeleteDailySp500Success]);

  useEffect(() => {
    if (isSuccess) {
      setSearchdata(DailySp500list);
      setData(DailySp500list);
    }

    if (isError) {
      toast.error(`Unable to load data list`);
      dispatch(clearState());
    }
  }, [isSuccess, isError, DailySp500list]);

  useEffect(() => {
    if (isDataSuccess) {
      setValue("date", dayjs(DailySp500Data[0].publish_date).format("YYYY-MM-DD"));
      setValue("title", DailySp500Data[0].en_title);
      setValue("thai_title", DailySp500Data[0].thai_title);
      setValue("id", DailySp500Data[0].id);
      setValue("daily_sp500_status", DailySp500Data[0].daily_sp500_status);
      setValue("en_short_content", DailySp500Data[0].en_short_content);
      sEditor?.setData(DailySp500Data[0].en_short_content);
      setValue("en_full_content", DailySp500Data[0].en_full_content);
      fEditor?.setData(DailySp500Data[0].en_full_content);
      setValue("thai_short_content", DailySp500Data[0].thai_short_content);
      thaisEditor?.setData(DailySp500Data[0].thai_short_content);
      setValue("thai_full_content", DailySp500Data[0].thai_full_content);
      thaifEditor?.setData(DailySp500Data[0].thai_full_content);
      dispatch(clearState());
    }

    if (isDataError) {
      toast.error(`Unable to retrieve data`);
      dispatch(clearState());
    }
  }, [isDataSuccess, isDataError, DailySp500Data]);

  useEffect(() => {
    if (isInsertDailySp500Error) {
      toast.error(`Save failed`);
      dispatch(clearState());
    }
    if (isUpdateDailySp500Error) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
    if (isDeleteDailySp500Error) {
      toast.error(`Delete failed`);
      dispatch(clearState());
    }
  }, [isInsertDailySp500Error, isUpdateDailySp500Error, isDeleteDailySp500Error]);

  const handleEdit = (id: number) => {
    dispatch(getDailySp500ById({ token, id }));
    setImage(`${api}/daily-sp-500/image/${id}`);
    setButton(false);
    setEditId(id);
  };

  const handleSearch = (e: any) => {
    const ric: string = e.target.value; 
    dispatch(getDailySp500Search({token, ric}));
    if(isDataSearchSuccess){
      console.log(DailySp500DataSearch);
      setSearchedSymbol(DailySp500DataSearch);
    }
  }


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

  const handleDelete = (id: number) => {
    dispatch(deleteDailySp500({ token, id }));
    reset();
    sEditor.setData();
    fEditor.setData();
    thaisEditor.setData();
    thaifEditor.setData();
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

  const submitDailySp500 = (e: any) => {
    if (e.symbol) {
      dispatch(
        insertDailySp500({
          token,
          payload: {
            update_date: e.date,
            top_pick_status: checkbox ? "Y" : "N",
            symbol: e.symbol,
            en_content: e.sContent,
            thai_content: e.fContent,
            time_scale: "1D",
            top_pick_order: e.top_pick_order
          },
        })
      );

      let payload = {
        image: fileArrayBuffer
      }
      const id: number = getValues("id");
      dispatch(updateDailySp500Image({token, id, payload}));
      reset();
      sEditor.setData();
      fEditor.setData();
    } else {
      toast.error(`Please input symbol`);
    }
  };

  const handleUpdate = () => {
    if (getValues("title")) {
      dispatch(
        updateDailySp500({
          token,
          id: editId,
          payload: {
            id: getValues("id"),
            publish_date: getValues("date"),
            daily_sp500_status: 1,
            en_title: getValues("title"),
            thai_title: getValues("thai_title"),
            en_short_content: getValues("en_short_content"),
            en_full_content: getValues("en_full_content"),
            thai_short_content: getValues("thai_short_content"),
            thai_full_content: getValues("thai_full_content"),
          },
        })
      );
      
      if(fileArrayBuffer !== ""){
        const id: number = getValues("id");
        let newPayload = {
          id: id,
          image: fileArrayBuffer
        }
        dispatch(updateDailySp500Image({token, id, newPayload}));
      }
   
      reset();
      sEditor.setData();
      fEditor.setData();
      setButton(true);
    } else {
      toast.error(`Please input Symbol`);
    }
  };


  const dwcolumns = [
    {
      field: "id",
      headerName: "ID",
      hide:true
    },
    {
      field: "symbol",
      headerName: "Dw Symbol",
      flex: 3,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 2
    },
    {
      field: "strike",
      headerName: "Strike",
      flex: 2
    },
    {
      field: "ratio",
      headerName: "Ratio",
      flex: 2
    },
    {
      field: "last_trading_date",
      headerName: "Last Trading Date",
      flex: 3
    }
  ]

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true
    },
    {
      field: "publish_date",
      headerName: "Publish Date",
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


  const insertInput = (e: any, value: any) => {
    const s = e.target.value;
    console.log(value);
    setValue("title", value);
  }



    return (
        <>
        <div className="today-top-pick">
        <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Daily S&P500 DW update</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                // onSubmit={handleSubmit(submitOMW)}
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
                    <Typography>
                    Add an existing DW::
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                      <FormControl fullWidth>
                      <Autocomplete
                            onChange={insertInput}
                            freeSolo
                            disableClearable
                            options={searchedSymbol.map((option: any) => option.symbol)}
                            renderInput={(params) => (
                              <TextField
                                name="symbol"
                                onInput={handleSearch}
                                {...params}
                                label="Add an existing DW"
                                InputProps={{
                                  ...params.InputProps,
                                  type: 'search',
                                }}
                              />
                            )}
                          />
                      </FormControl>
                  </Grid>
                  
                  {/* <Grid container item xs={12} className={classes.dataContainer}>
                <DataGrid
                  rows={dwData}
                  columns={dwcolumns}
                  pageSize={pageSize}
                  onPageSizeChange={pageSize => setPageSize(pageSize)}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  checkboxSelection
                  disableSelectionOnClick
                  componentsProps={{
                    pagination: {
                      labelRowsPerPage: "Entries per page:",
                    },
                  }}
                />
              </Grid> */}

                  <Grid item xs={3}>
                    <Typography>Content (Short English Version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <CKEditor
                        onInstanceReady={({ editor }) => {
                          setsEditor(editor);
                        }}
                        onChange={({ editor }) => {
                          setValue(
                            "en_short_content",
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
                            "en_full_content",
                            editor.document.getBody().$.innerHTML
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>


                  <Grid item xs={3}>
                    <Typography>Content (Short Thai version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <CKEditor
                        onInstanceReady={({ editor }) => {
                          setthaisEditor(editor);
                        }}
                        onChange={({ editor }) => {
                          setValue(
                            "thai_short_content",
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
                          setthaifEditor(editor);
                        }}
                        onChange={({ editor }) => {
                          setValue(
                            "thai_full_content",
                            editor.document.getBody().$.innerHTML
                          );
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}></Grid>
                  <Grid item xs={9}>
                       <img src={image} className={classes.imageUpload} /> 
                  </Grid>    

                  <Grid item xs={3}>
                    Upload Image:
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

                  {/* <Grid item xs={3}></Grid>
                  <Grid item xs={9}>
                  <Button
                        variant="contained"
                        component="label"
                      >
                        Upload File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage}
                          hidden
                      />
                    </Button>
                  </Grid> */}

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
    </>
    )
}
