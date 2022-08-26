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
  getWatchlist,
} from "./DailySp500Slice";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { CKEditor, CKEditorInstance } from "ckeditor4-react";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Autocomplete } from "@material-ui/lab";
import { AllHtmlEntities } from "html-entities";
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
    Watchlist,
    isWatchlistSuccess
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
  const [selected, setSelection] = useState<any>([]);
  const [dwId, setDwId] = useState<any>([]);
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [ArrayData, setArrayData] = useState<any>([]);
  const [notDeleted, setNotDelted] = useState<any>([]);
  const [allric, setAllric] = useState<any>([]);
  const [watchlistStr, setWatchlistStr] = useState<string>("");

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
      setValue("en_short_content", (DailySp500Data[0].en_short_content) ? AllHtmlEntities.decode(DailySp500Data[0].en_short_content) : "");
      sEditor?.setData((DailySp500Data[0].en_short_content) ? AllHtmlEntities.decode(DailySp500Data[0].en_short_content) : "");
      setValue("en_full_content", AllHtmlEntities.decode(DailySp500Data[0].en_full_content));
      fEditor?.setData(AllHtmlEntities.decode(DailySp500Data[0].en_full_content));
      setValue("thai_short_content", AllHtmlEntities.decode(DailySp500Data[0].thai_short_content));
      thaisEditor?.setData(AllHtmlEntities.decode(DailySp500Data[0].thai_short_content));
      let h = AllHtmlEntities.decode(DailySp500Data[0].thai_full_content);
      let thai_full_str = "";
      console.log(AllHtmlEntities.decode("&lt;h1&gt;Hello &lt;/h1&gt;"), "encoded str");
      if (h.indexOf("|") != -1) {
        let thai_full_str = h.split("|")[1].split("<br>").join("\n");
        thaifEditor?.setData(thai_full_str);
        dispatch(clearState());
        var list = h.split("|")[0].split(";");
        let str = "";

        for (var j = 0; j < list.length; j++) {
          if (list[j] != null && list[j] != "") {
            if (list[j].charAt(0) == '_') {
              console.log("GET _ ", "", list[j]);
            } else {
              str += `'${list[j]}',`;
              console.log("GET _ ", "", list[j]);
            }
          }
        }

        const allRic = str.slice(0, -1);
        const payload = {
          getRic: allRic,
        };
        dispatch(getWatchlist({ token, payload }))
      } else {
        thai_full_str = h.split("<br>").join("\n");
        setValue("thai_full_content", thai_full_str);
        thaifEditor?.setData(thai_full_str);
        dispatch(clearState());
      }
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
    setArrayData([]);
  };

  const handleSearch = (e: any) => {
    const ric: string = e.target.value;
    dispatch(getDailySp500Search({ token, ric }));
    if (isDataSearchSuccess) {
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
        const base64String = Buffer.from(arraybuffer).toString("base64");
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
    let thai_full_content = e.thai_full_content;
    if (e.title) {
      let ric = "";
      dwData.map((value: any, index: any) => {
        ric += `${value.ric};`;
      });

      const ricSliced = ric.slice(0, -1);
      thai_full_content = `${ricSliced}|${thai_full_content}`;

      dispatch(
        insertDailySp500({
          token,
          payload: {
            publish_date: e.date,
            daily_sp500_status: 1,
            en_title: e.title,
            thai_title: e.thai_title,
            en_short_content: AllHtmlEntities.encode(e.en_short_content),
            en_full_content: AllHtmlEntities.encode(e.en_full_content),
            thai_short_content: AllHtmlEntities.encode(e.thai_short_content),
            thai_full_content: AllHtmlEntities.encode(thai_full_content),
            image: fileArrayBuffer
          },
        })
      );

      reset();
      sEditor.setData();
      fEditor.setData();
      thaisEditor.setData();
      thaifEditor.setData();
      setArrayData([]);
      setImage("");
    } else {
      toast.error(`Please input symbol`);
    }
  };

  const handleUpdate = () => {
    if (getValues("title")) {

      let thai_full_content = getValues("thai_full_content");

      let ric = "";
      dwData.map((value: any, index: any) => {
        ric += `${value.ric};`;
      });

      const ricSliced = ric.slice(0, -1);
      thai_full_content = `${ricSliced}|${thai_full_content}`;

      console.log(thai_full_content);

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
            en_short_content: AllHtmlEntities.encode(getValues("en_short_content")),
            en_full_content: AllHtmlEntities.encode(getValues("en_full_content")),
            thai_short_content: AllHtmlEntities.encode(getValues("thai_short_content")),
            thai_full_content: AllHtmlEntities.encode(thai_full_content),
          },
        })
      );

      if (fileArrayBuffer !== "") {
        const id: number = getValues("id");
        let newPayload = {
          id: id,
          image: fileArrayBuffer
        }
        dispatch(updateDailySp500Image({ token, id, newPayload }));
      }

      reset();
      sEditor.setData();
      fEditor.setData();
      thaisEditor.setData();
      thaifEditor.setData();
      setImage("");
      setArrayData([]);
      setButton(true);
    } else {
      toast.error(`Please input Title`);
    }
  };


  const dwcolumns = [
    {
      field: "id",
      headerName: "ID",
      hide: true
    },
    {
      field: "ric",
      headerName: "Ric",
      hide: true
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
      flex: 3,
      renderCell: (params: any) => {
        return dayjs(params.formattedValue).format("DD MMM YY");
      },
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

  useEffect(() => {
    if (isWatchlistSuccess) {
      if (Watchlist) {
        if (Watchlist.length > 1) {
          setArrayData(Watchlist);
        } else {
          setArrayData([...ArrayData, Watchlist[0]]);
        }
      }

    }
  }, [isWatchlistSuccess]);

  const handleRemove = () => {
    var arr: Array<any> = []
    let ric = "";
    dwData.map((value: any, index: any) => {
      if (dwId.indexOf(value.id) == -1) {
        arr.push(value)
        ric += `${value.ric};`;
      }
    })
    const thai_full_content_str = getValues("thai_full_content");
    let str = `${ric}|${thai_full_content_str}`;

    setArrayData(arr);
  };


  const insertInput = (e: any, value: any) => {
    const s = e.target.value;

    const searchArray = searchedSymbol.filter((data: any) => data.symbol == value);
    const { ric, symbol } = searchArray[0];

    let payload = {};
    let newSymbol = "";
    if (symbol.charAt(0).indexOf("_") > -1) {
      newSymbol = symbol.replace("_", "");
      payload = {
        ric: "",
        symbol: newSymbol
      };
    } else {
      payload = {
        ric: ric,
        symbol: ""
      };
    }

    dispatch(getWatchlist({ token, payload }))

  }


  const selectedChecksChangeHandler = (ids: any) => {
    setDwId(ids);
  }

  useEffect(() => {
    console.log(ArrayData);
    let arr: any = []
    ArrayData.map((data: any, i: any) => {
      const finalData = {
        id: i,
        ...data
      }
      arr[i] = finalData;
    })
    console.log(arr);
    if (ArrayData) {
      setDwData(arr);
    }

  }, [ArrayData])


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
                  onSubmit={handleSubmit(submitDailySp500)}
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

                    <Grid item xs={3}>
                      {(dwId.length) > 0 ? (<Button
                        style={{ marginLeft: "2px", width: "49%", backgroundColor: "rgba(63, 81, 181, 0.08)", }}
                        variant="contained"
                        onClick={handleRemove}
                      >
                        Remove
                      </Button>) : ("")}
                    </Grid>
                    <Grid container item xs={9} className={classes.dataContainer}>
                      <DataGrid
                        rows={dwData}
                        columns={dwcolumns}
                        pageSize={pageSize}
                        onPageSizeChange={pageSize => setPageSize(pageSize)}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        onSelectionModelChange={(ids) => {
                          selectedChecksChangeHandler(ids);
                        }}
                        checkboxSelection
                        disableSelectionOnClick
                        componentsProps={{
                          pagination: {
                            labelRowsPerPage: "Entries per page:",
                          },
                        }}
                      />
                    </Grid>

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
