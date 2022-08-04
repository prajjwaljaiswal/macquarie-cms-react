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
  } from "@material-ui/core";
  import { DataGrid } from "@material-ui/data-grid";
  import { EditOutlined, DeleteOutline } from "@material-ui/icons";
  import SearchBar from "material-ui-search-bar";
  import { useEffect, useState } from "react";
  import "./TodayTopPick.css";
  import {
    getTTPlist,
    getTTPById,
    getTTPSearch,
    insertTTP,
    updateTTP,
    deleteTTP,
    TTPlistSelector,
    clearState,
  } from "./TodayTopPickSlice";
  import { loginSelector } from "../../../login/loginSlice";
  import { useDispatch, useSelector } from "react-redux";
  import dayjs from "dayjs";
  import { CKEditor, CKEditorInstance } from "ckeditor4-react";
  import { useForm, Controller } from "react-hook-form";
  import toast, { Toaster } from "react-hot-toast";
import { Autocomplete } from "@material-ui/lab";


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




  export default function TodayTopPick() {    
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    TTPlist,
    TTPDataSearch,
    isDataSearchSuccess,
    isSuccess,
    isInsertTTPSuccess,
    isUpdateTTPSuccess,
    isDeleteTTPSuccess,
    isError,
    isInsertTTPError,
    insertTTPErrorMessage,
    isUpdateTTPError,
    isDeleteTTPError,
    updateTTPErrorMessage,
    deleteTTPErrorMessage,
    isDataSuccess,
    isDataError,
    TTPData,
  } = useSelector(TTPlistSelector);
  const [searchdata, setSearchdata] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [searched, setSearched] = useState<string>("");
  const [searchedSymbol, setSearchedSymbol] = useState<any>([]);
  const [sEditor, setsEditor] = useState<CKEditorInstance>();
  const [fEditor, setfEditor] = useState<CKEditorInstance>();
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
        sContent: "",
        fContent: "",
        symbol: "",
        top_pick_status: "",
        time_scale: "",
        top_pick_order: "",
        thai_content: ""
      },
    });

  useEffect(() => {
    dispatch(getTTPlist({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(getTTPlist({ token }));

    if (isInsertTTPSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateTTPSuccess) {
      toast.success("Successfully updated.");
    }

    if (isDeleteTTPSuccess) {
      toast.success("Successfully deleted.");
    }

    dispatch(clearState());
  }, [isInsertTTPSuccess, isUpdateTTPSuccess, isDeleteTTPSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setSearchdata(TTPlist);
      setData(TTPlist);
    }

    if (isError) {
      toast.error(`Unable to load data list`);
      dispatch(clearState());
    }
  }, [isSuccess, isError, TTPlist]);

  useEffect(() => {
    if (isDataSuccess) {

        // console.log(TTPData[0]);
      (TTPData[0].top_pick_status) === 'Y' ? setCheckbox(true) : setCheckbox(false);
      setValue("date", dayjs(TTPData.publish_date).format("YYYY-MM-DD"));
      setValue("symbol", TTPData[0].symbol);
      setValue("id", TTPData[0].id);
      setValue("top_pick_status", TTPData[0].top_pick_status);
      setValue("sContent", TTPData[0].en_content);
      sEditor?.setData(TTPData[0].en_content);
      setValue("fContent", TTPData[0].thai_content);
      fEditor?.setData(TTPData[0].thai_content);
      setValue("time_scale", TTPData[0].time_scale);
      setValue("top_pick_order", TTPData[0].top_pick_order);
      dispatch(clearState());
    }

    if (isDataError) {
      toast.error(`Unable to retrieve data`);
      dispatch(clearState());
    }
  }, [isDataSuccess, isDataError, TTPData]);

  useEffect(() => {
    if (isInsertTTPError) {
      toast.error(`Save failed`);
      dispatch(clearState());
    }
    if (isUpdateTTPError) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
    if (isDeleteTTPError) {
      toast.error(`Delete failed`);
      dispatch(clearState());
    }
  }, [isInsertTTPError, isUpdateTTPError, isDeleteTTPError]);

  const handleEdit = (id: number) => {
    dispatch(getTTPById({ token, id }));
    setButton(false);
    setEditId(id);
  };

  const handleSearch = (e: any) => {
    const ric: string = e.target.value; 
    dispatch(getTTPSearch({token, ric}));
    if(isDataSearchSuccess){
      console.log(TTPDataSearch);
      setSearchedSymbol(TTPDataSearch);
    }
  }

  const handleDelete = (id: number) => {
    dispatch(deleteTTP({ token, id }));
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

  const submitTTP = (e: any) => {
    if (e.symbol) {
      dispatch(
        insertTTP({
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
      reset();
      sEditor.setData();
      fEditor.setData();
    } else {
      toast.error(`Please input symbol`);
    }
  };

  const handleUpdate = () => {
    if (getValues("symbol")) {
      dispatch(
        updateTTP({
          token,
          id: editId,
          payload: {
            id: getValues("id"),
            update_date: getValues("date"),
            top_pick_status: checkbox ? "Y" : "N",
            symbol: getValues("symbol"),
            en_content: getValues("sContent"),
            thai_content: getValues("fContent"),
            time_scale: getValues("time_scale"),
            top_pick_order: getValues("top_pick_order")
          },
        })
      );
      reset();
      sEditor.setData();
      fEditor.setData();
      setButton(true);
    } else {
      toast.error(`Please input Symbol`);
    }
  };


  const handleCheckbox = () => {

      console.log(getValues("top_pick_status"));

      if(checkbox){
        setCheckbox(false);
      }else{
        setCheckbox(true);
      } 
  }

  const handleSelect = (e: any) => {
      setValue("top_pick_order", e.target.value);
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true
    },
    {
      field: "update_date",
      headerName: "Update Time",
      flex: 1,
      renderCell: (params: any) => {
        return dayjs(params.formattedValue).format("YYYY-MM-DD");
      },
    },
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 3,
    },
    {
        field: "top_pick_status",
        headerName: "status",
        flex: 2,
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
    setValue("symbol", value);
  }


    return (
        <>
        <div className="today-top-pick">
        <Toaster />
         <Card className={classes.cardLay} variant="outlined"> 
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Today's Top Pick</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(submitTTP)}
              >
                <Grid item container xs={12} spacing={3}>

                  <Grid item xs={3}>
                    <Typography>
                    Select DW Symbol:
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
                                label="Search symbol"
                                InputProps={{
                                  ...params.InputProps,
                                  type: 'search',
                                }}
                              />
                            )}
                          />
                      </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Selected DW:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name="symbol"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="symbol"
                            label="Selected DW:"
                            type="text"
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Display Date:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                    <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="date"
                            label="Display Date:"
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
                    <Typography>Enable:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name="top_pick_status"
                        render={({ field }) => (

                          <Checkbox 
                            {...field}
                            onClick={handleCheckbox}
                            checked={checkbox ? true : false}
                          />
                                      
                        )}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={3}>
                    <Typography>Order:</Typography>
                  </Grid>

                  <Grid item xs={9}>
                    <FormControl fullWidth>
                          <Controller
                            control={control}
                            name="top_pick_order"
                            render={({ field }) => (
    
                              <Select 
                                {...field}
                                onChange={handleSelect}
                                id="top_pick_order"
                              >

                                <MenuItem value={1} >One</MenuItem>
                                <MenuItem value={2} >Two</MenuItem>
                                <MenuItem value={3} >Three</MenuItem>
                              </Select>
                                          
                            )}
                          />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Content (English Version):</Typography>
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
                    <Typography>Content (Thai Version):</Typography>
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
    </>
    )
}
