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
  import "./DailySingleStock.css";
  import {
    getDailySingleStocklist,
    getDailySingleStockById,
    getDailySingleStockSearch,
    insertDailySingleStock,
    updateDailySingleStock,
    deleteDailySingleStock,
    DailySingleStocklistSelector,
    clearState,
    updateDailySingleStockImage,
  } from "./DailySingleStockSlice";
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




  export default function DailySingleStock() {    
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    DailySingleStocklist,
    DailySingleStockDataSearch,
    isDataSearchSuccess,
    isSuccess,
    isInsertDailySingleStockSuccess,
    isUpdateDailySingleStockSuccess,
    isDeleteDailySingleStockSuccess,
    isError,
    isInsertDailySingleStockError,
    insertDailySingleStockErrorMessage,
    isUpdateDailySingleStockError,
    isDeleteDailySingleStockError,
    updateDailySingleStockErrorMessage,
    deleteDailySingleStockErrorMessage,
    isDataSuccess,
    isDataError,
    DailySingleStockData,
  } = useSelector(DailySingleStocklistSelector);
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
    dispatch(getDailySingleStocklist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(getDailySingleStocklist({ token }));

    if (isInsertDailySingleStockSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateDailySingleStockSuccess) {
      toast.success("Successfully updated.");
    }

    if (isDeleteDailySingleStockSuccess) {
      toast.success("Successfully deleted.");
    }

    dispatch(clearState());
  }, [isInsertDailySingleStockSuccess, isUpdateDailySingleStockSuccess, isDeleteDailySingleStockSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setSearchdata(DailySingleStocklist);
      setData(DailySingleStocklist);
    }

    if (isError) {
      toast.error(`Unable to load data list`);
      dispatch(clearState());
    }
  }, [isSuccess, isError, DailySingleStocklist]);

  useEffect(() => {
    if (isDataSuccess) {
      setValue("date", dayjs(DailySingleStockData[0].publish_date).format("YYYY-MM-DD"));
      setValue("title", DailySingleStockData[0].en_title);
      setValue("thai_title", DailySingleStockData[0].thai_title);
      setValue("id", DailySingleStockData[0].id);
      setValue("daily_sp500_status", DailySingleStockData[0].daily_sp500_status);
      setValue("en_short_content", (DailySingleStockData[0].en_short_content) ? DailySingleStockData[0].en_short_content : "" );
      sEditor?.setData((DailySingleStockData[0].en_short_content) ? DailySingleStockData[0].en_short_content : "");
      setValue("en_full_content", DailySingleStockData[0].en_full_content);
      fEditor?.setData(DailySingleStockData[0].en_full_content);
      setValue("thai_short_content", DailySingleStockData[0].thai_short_content);
      thaisEditor?.setData(DailySingleStockData[0].thai_short_content);
      setValue("thai_full_content", DailySingleStockData[0].thai_full_content);
      thaifEditor?.setData(DailySingleStockData[0].thai_full_content);
      dispatch(clearState());
    }

    if (isDataError) {
      toast.error(`Unable to retrieve data`);
      dispatch(clearState());
    }
  }, [isDataSuccess, isDataError, DailySingleStockData]);

  useEffect(() => {
    if (isInsertDailySingleStockError) {
      toast.error(`Save failed`);
      dispatch(clearState());
    }
    if (isUpdateDailySingleStockError) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
    if (isDeleteDailySingleStockError) {
      toast.error(`Delete failed`);
      dispatch(clearState());
    }
  }, [isInsertDailySingleStockError, isUpdateDailySingleStockError, isDeleteDailySingleStockError]);

  const handleEdit = (id: number) => {
    dispatch(getDailySingleStockById({ token, id }));
    setImage(`${api}/daily-sp-500/image/${id}`);
    setButton(false);
    setEditId(id);
  };

  const handleSearch = (e: any) => {
    const ric: string = e.target.value; 
    dispatch(getDailySingleStockSearch({token, ric}));
    if(isDataSearchSuccess){
      console.log(DailySingleStockDataSearch);
      setSearchedSymbol(DailySingleStockDataSearch);
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
    dispatch(deleteDailySingleStock({ token, id }));
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

  const submitDailySingleStock = (e: any) => {
    if (e.title) {
      dispatch(
        insertDailySingleStock({
          token,
          payload: {
            publish_date: e.date,
            daily_sp500_status: 1,
            en_title: e.title,
            thai_title: e.thai_title,
            en_short_content: e.en_short_content,
            en_full_content: e.en_full_content,
            thai_short_content: e.thai_short_content,
            thai_full_content: e.thai_full_content,
            image: fileArrayBuffer
          },
        })
      );

      reset();
      sEditor.setData();
      fEditor.setData();
      thaisEditor.setData();
      thaifEditor.setData();
      setImage("");
    } else {
      toast.error(`Please input symbol`);
    }
  };

  const handleUpdate = () => {
    if (getValues("title")) {
      dispatch(
        updateDailySingleStock({
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
        dispatch(updateDailySingleStockImage({token, id, newPayload}));
      }
   
      reset();
      sEditor.setData();
      fEditor.setData();
      thaisEditor.setData();
      thaifEditor.setData();
      setImage("");
      setButton(true);
    } else {
      toast.error(`Please input Title`);
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
              <h2>Daily Single Stock update</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(submitDailySingleStock)}
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
