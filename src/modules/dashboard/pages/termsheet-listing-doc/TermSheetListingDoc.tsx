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
  Popper,
  Chip,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  EditOutlined,
  DeleteOutline,
  PictureAsPdf,
  CheckOutlined,
  CloudUpload,
} from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import "./TermSheetListingDoc.css";
import {
  getStockCodeList,
  stockCodeSelector,
} from "../warrant-hotlist/stockCodeSlice";
import {
  getPendingList,
  getConfirmedList,
  insertTermsheet,
  updateTermsheet,
  deleteTermsheet,
  TermsheetlistSelector,
  clearState,
} from "./TermSheetListingDocSlice";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

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
  popper: {
    maxWidth: "fit-content",
    minWidth: "450px",
  },
}));

type StockList = {
  dsply_name: string;
  dsply_nmll: string;
  ric: string;
  ticker: string;
  underlying_name: string;
  underlying_ric: string;
};

type TermsheetList = {
  ric: string;
  file_name: string;
  symbol: string;
  last_update_time: string;
};

export default function TermSheetListingDoc() {
  const classes = useStyles();
  const [searchPendingData, setSearchPendingData] = useState<TermsheetList[]>(
    []
  );
  const [pendingData, setPendingData] = useState<TermsheetList[]>([]);
  const [searchConfirmedData, setSearchConfirmedData] = useState<
    TermsheetList[]
  >([]);
  const [confirmedData, setConfirmedData] = useState<TermsheetList[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockList>();
  const [pendingSearched, setPendingSearched] = useState<string>("");
  const [confirmedSearched, setConfirmedSearched] = useState<string>("");
  const [count, setCount] = useState(0);
  const [disable, setDisable] = useState(false);
  const [id, setId] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSizePend, setPageSizePend] = useState<number>(10);
  const [pageSizeConfirm, setPageSizeConfirm] = useState<number>(10);
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm({
      defaultValues: {
        file: null,
      },
    });
  const [fileArrayBuffer, setFileArrayBuffer] = useState<ArrayBuffer>();
  const [selectedFile, setSelectedFile] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    stockCodeList,
    stockCodeUpdateStatus,
    isStockCodeUpdateFetching,
    isStockCodeUpdateSuccess,
    isStockCodeUpdateError,
    stockCodeUpdateErrorMessage,
  } = useSelector(stockCodeSelector);

  const {
    pendingList,
    confirmedList,
    isPendingSuccess,
    isPendingError,
    isConfirmedSuccess,
    isConfirmedError,
    isInsertTermsheetSuccess,
    isInsertTermsheetError,
    isUpdateTermsheetSuccess,
    isUpdateTermsheetError,
    isDeleteTermsheetSuccess,
    isDeleteTermsheetError,
    insertTermsheetErrorMessage,
    updateTermsheetErrorMessage,
    deleteTermsheetErrorMessage,
  } = useSelector(TermsheetlistSelector);

  useEffect(() => {
    dispatch(getPendingList({ token }));
    dispatch(getConfirmedList({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isPendingSuccess) {
      setPendingData(pendingList);
      setSearchPendingData(pendingList);
    }

    if (isConfirmedSuccess) {
      setConfirmedData(confirmedList);
      setSearchConfirmedData(confirmedList);
    }

    if (isPendingError) {
      toast.error("Unable to load pending list");
    }

    if (isConfirmedError) {
      toast.error("Unable to load confirmed list");
    }
  }, [
    isPendingSuccess,
    isPendingError,
    pendingList,
    isConfirmedSuccess,
    isConfirmedError,
    confirmedList,
  ]);

  useEffect(() => {
    if (
      isInsertTermsheetSuccess ||
      isUpdateTermsheetSuccess ||
      isDeleteTermsheetSuccess
    ) {
      dispatch(getPendingList({ token }));
      dispatch(getConfirmedList({ token }));
      reset();
      setSelectedFile("");
      setFileArrayBuffer(undefined);
      setSelectedStock(undefined);
      setCount((prevState) => prevState + 1);
      setButton(true);
      setDisable(false);
    }

    if (isInsertTermsheetSuccess) {
      toast.success("Successfully saved.");
    }

    if (isUpdateTermsheetSuccess) {
      toast.success("Successfully updated.");
    }

    if (isDeleteTermsheetSuccess) {
      toast.success("Successfully deleted.");
    }

    if (isInsertTermsheetError) {
      toast.error(`Save failed`);
    }

    if (isUpdateTermsheetError) {
      toast.error(`Update failed`);
    }

    if (isDeleteTermsheetError) {
      toast.error(`Delete failed`);
    }

    dispatch(clearState());
  }, [
    isInsertTermsheetSuccess,
    isInsertTermsheetError,
    isUpdateTermsheetSuccess,
    isUpdateTermsheetError,
    isDeleteTermsheetSuccess,
    isDeleteTermsheetError,
  ]);

  const filterOptions = createFilterOptions({
    trim: true,
    stringify: (option: any) => JSON.stringify(option),
  });

  const handleEdit = (symbol: string) => {
    setButton(false);
    setDisable(true);
    setSelectedStock({
      dsply_name: "",
      dsply_nmll: "",
      ric: "",
      ticker: symbol,
      underlying_name: "",
      underlying_ric: "",
    });
  };

  const handleConfirm = (symbol: string) => {
    dispatch(
      updateTermsheet({ token, ticker: symbol, payload: { is_confirm: 1 } })
    );
  };

  const handleDelete = (symbol: string) => {
    dispatch(deleteTermsheet({ token, ticker: symbol }));
  };

  const handleUpdate = (data: any) => {
    if (selectedFile) {
      dispatch(
        updateTermsheet({
          token,
          ticker: selectedStock?.ticker,
          payload: {
            pdf: fileArrayBuffer,
            file_name: selectedFile,
          },
        })
      );
    } else {
      toast.error("No PDF is chosen");
    }
  };

  const requestPendingSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setPendingData(searchPendingData);
    }
    const filteredRows = searchPendingData.filter((row: TermsheetList) => {
      return (
        row.symbol.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.ric.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.file_name.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setPendingData(filteredRows);
  };

  const requestConfirmedSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setConfirmedData(searchConfirmedData);
    }
    const filteredRows = searchConfirmedData.filter((row: TermsheetList) => {
      return (
        row.symbol.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.ric.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.file_name.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setConfirmedData(filteredRows);
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

  const cancelPendingSearch = () => {
    setPendingSearched("");
    requestPendingSearch(pendingSearched);
  };

  const cancelConfirmedSearch = () => {
    setConfirmedSearched("");
    requestConfirmedSearch(confirmedSearched);
  };

  const onSubmit = (data: any) => {
    if (selectedStock) {
      if (selectedFile) {
        dispatch(
          insertTermsheet({
            token,
            payload: {
              ric: selectedStock.ric,
              symbol: selectedStock.ticker,
              file_name: selectedFile,
              pdf: fileArrayBuffer,
            },
          })
        );
      } else {
        toast.error("No PDF is chosen");
      }
    } else {
      toast.error("No DW Symbol is chosen");
    }
  };

  const handleSelect = (e: any, newValue: any) => {
    setSelectedStock(newValue);
    if (selectedStock) {
      dispatch(
        getStockCodeList({
          token,
          ticker: selectedStock,
          dsply_name: selectedStock,
        })
      );
    }
  };

  const CustomSelectDropDownOverlay = function (props: any) {
    return (
      <Popper {...props} className={classes.popper} placement="bottom-start" />
    );
  };

  const pendingColumns = [
    {
      field: "last_update_time",
      headerName: "Last Update Time",
      flex: 1,
      renderCell: (param: any) => {
        return dayjs(param.formattedValue).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 1,
    },
    {
      field: "ric",
      headerName: "Ric",
      flex: 1,
    },
    {
      field: "file_name",
      headerName: "File name",
      flex: 2,
    },
    {
      field: "pdf",
      headerName: "File",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <a
            href={`${api}/file/pdf/termsheet/${params.row.symbol}`}
            target="_blank"
          >
            <PictureAsPdf className="termsheet-pdf" />
          </a>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>
            <CheckOutlined
              className="termsheet-confirm"
              onClick={() => handleConfirm(params.row.symbol)}
            />
            /
            <DeleteOutline
              className="termsheet-delete"
              onClick={() => handleDelete(params.row.symbol)}
            />
          </>
        );
      },
    },
  ];

  const confirmedColumns = [
    {
      field: "last_update_time",
      headerName: "Last Update Time",
      flex: 2,
      renderCell: (param: any) => {
        return dayjs(param.formattedValue).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 2,
    },
    {
      field: "ric",
      headerName: "Ric",
      flex: 2,
    },
    {
      field: "file_name",
      headerName: "File name",
      flex: 2,
    },
    {
      field: "pdf",
      headerName: "File",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <a
            href={`${api}/file/pdf/termsheet/${params.row.symbol}`}
            target="_blank"
          >
            <PictureAsPdf className="termsheet-pdf" />
          </a>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: (params: any) => {
        return (
          <>
            <EditOutlined
              className="termsheet-edit"
              onClick={() => handleEdit(params.row.symbol)}
            />
            /
            <DeleteOutline
              className="termsheet-delete"
              onClick={() => handleDelete(params.row.symbol)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="termsheet-listing-doc">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Termsheets & Listing Doc</h2>
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
                    <Typography>Select Warrant Symbol:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Autocomplete
                        disabled={disable}
                        key={count}
                        id="stock-code"
                        options={stockCodeList}
                        PopperComponent={CustomSelectDropDownOverlay}
                        getOptionLabel={(option: any) => `${option.ticker}`}
                        renderOption={(option: any) => (
                          <Grid container xs={12}>
                            <Grid item xs={6}>
                              <Chip
                                variant="outlined"
                                size="small"
                                label={option.ticker}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Chip
                                variant="outlined"
                                size="small"
                                label={option.dsply_name}
                              />
                            </Grid>
                          </Grid>
                        )}
                        filterOptions={filterOptions}
                        onChange={(event: any, newValue: any) => {
                          handleSelect(event, newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          handleSelect(event, newInputValue);
                        }}
                        renderInput={(params: any) => (
                          <TextField {...params} label="Search..." />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Selected Warrant: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <TextField
                        disabled={disable}
                        type="text"
                        name="Ticker"
                        value={selectedStock?.ticker || ""}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <FormControl>
                      <Typography>File:</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl>
                      <Controller
                        key={count}
                        name="file"
                        control={control}
                        render={({ field }) => (
                          <>
                            <input
                              accept="application/pdf"
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
                        onClick={handleSubmit(handleUpdate)}
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
              <Grid item xs={12}>
                <h3>Pending:</h3>
              </Grid>
              <Grid container item justifyContent="flex-end">
                <Grid item xs={4}>
                  <SearchBar
                    value={pendingSearched}
                    onChange={(searchVal) => requestPendingSearch(searchVal)}
                    onCancelSearch={() => cancelPendingSearch()}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} className={classes.dataContainer}>
                <DataGrid
                  rows={pendingData}
                  columns={pendingColumns}
                  pageSize={pageSizePend}
                  onPageSizeChange={ pageSize => setPageSizePend(pageSize)}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  componentsProps={{
                    pagination: {
                      labelRowsPerPage: "Entries per page:",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} spacing={3}>
              <Grid item xs={12}>
                <h3>Confirmed:</h3>
              </Grid>
              <Grid container item justifyContent="flex-end">
                <Grid item xs={4}>
                  <SearchBar
                    value={confirmedSearched}
                    onChange={(searchVal) => requestConfirmedSearch(searchVal)}
                    onCancelSearch={() => cancelConfirmedSearch()}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} className={classes.dataContainer}>
                <DataGrid
                  rows={confirmedData}
                  columns={confirmedColumns}
                  pageSize={pageSizeConfirm}
                  onPageSizeChange={pageSize =>
                    setPageSizeConfirm(pageSize)
                  }
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
