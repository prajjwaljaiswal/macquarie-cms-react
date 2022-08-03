import {
  makeStyles,
  Card,
  Grid,
  FormControl,
  InputLabel,
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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { loginSelector } from "../../../login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import "./ExpiryAdjustmentNotice.css";
import {
  getUnderlyings,
  getWarrants,
  stockCodeSelector,
  clearState as stockClear,
} from "../warrant-hotlist/stockCodeSlice";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import {
  getPendingList,
  getConfirmedList,
  getNoticeById,
  insertNotice,
  updateNotice,
  deleteNotice,
  NoticelistSelector,
  clearState,
} from "./ExpiryAdjustmentNoticeSlice";
import Select, { components, OptionProps } from "react-select";

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

type NoticeList = {
  id: number;
  date: string;
  file_name: string;
  headline: string;
  last_update_time: string;
};

type stockList = {
  ticker: string;
  dsply_name: string;
  underlying_name: string;
  underlying_ticker: string;
};

export default function ExpiryAdjustmentNotice() {
  const classes = useStyles();
  const [searchPendingData, setSearchPendingData] = useState<NoticeList[]>([]);
  const [pendingData, setPendingData] = useState<NoticeList[]>([]);
  const [searchConfirmedData, setSearchConfirmedData] = useState<NoticeList[]>(
    []
  );
  const [confirmedData, setConfirmedData] = useState<NoticeList[]>([]);
  const [pendingSearched, setPendingSearched] = useState<string>("");
  const [confirmedSearched, setConfirmedSearched] = useState<string>("");
  const [underlyings, setUnderlyings] = useState<stockList[]>([]);
  const [warrants, setWarrants] = useState<stockList[]>([]);
  const [savedUnderlyings, setSavedUnderlyings] = useState<any>([]);
  const [savedWarrants, setSavedWarrants] = useState<any>([]);
  const [selectedUnderlyings, setSelectUnderlyings] = useState<stockList[]>([]);
  const [selectedWarrants, setSelectWarrants] = useState<stockList[]>([]);
  const [count, setCount] = useState(0);
  const [id, setId] = useState(0);
  const [pageSizePend, setPageSizePend] = useState<number>(10);
  const [pageSizeConfirm, setPageSizeConfirm] = useState<number>(10);
  const [button, setButton] = useState(true);
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm({
      defaultValues: {
        file: null,
        date: dayjs().format("YYYY-MM-DD"),
        title: "",
        underlying: [],
        warrant: [],
      },
    });
  const [fileArrayBuffer, setFileArrayBuffer] = useState<ArrayBuffer>();
  const [selectedFile, setSelectedFile] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    warrantsList,
    isWarrantsSuccess,
    isWarrantsError,
    underlyingsList,
    isUnderlyingsSuccess,
    isUnderlyingsError,
  } = useSelector(stockCodeSelector);
  const {
    pendingList,
    confirmedList,
    noticeData,
    isPendingSuccess,
    isPendingError,
    isConfirmedSuccess,
    isConfirmedError,
    isNoticeSuccess,
    isNoticeError,
    isInsertNoticeSuccess,
    isInsertNoticeError,
    isUpdateNoticeSuccess,
    isUpdateNoticeError,
    isDeleteNoticeSuccess,
    isDeleteNoticeError,
    insertNoticeErrorMessage,
    updateNoticeErrorMessage,
    deleteNoticeErrorMessage,
  } = useSelector(NoticelistSelector);

  useEffect(() => {
    dispatch(getPendingList({ token }));
    dispatch(getConfirmedList({ token }));
    dispatch(getUnderlyings({ token }));
    dispatch(getWarrants({ token }));

    return () => {
      dispatch(clearState());
      dispatch(stockClear());
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
    isConfirmedSuccess,
    isConfirmedError,
    pendingList,
    confirmedList,
  ]);

  useEffect(() => {
    if (isWarrantsSuccess) {
      setWarrants(warrantsList);
    }
  }, [isWarrantsSuccess, isWarrantsError, warrantsList]);

  useMemo(() => {
    if (isUnderlyingsSuccess) {
      setUnderlyings(underlyingsList);
    }
  }, [isUnderlyingsSuccess, isUnderlyingsError, underlyingsList]);

  useEffect(() => {
    if (isPendingSuccess) {
      setPendingData(pendingList);
      setSearchPendingData(pendingList);
    }
    if (isConfirmedSuccess) {
      setConfirmedData(confirmedList);
      setSearchConfirmedData(confirmedList);
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
    if (isNoticeSuccess) {
      setValue("date", dayjs(noticeData.date).format("YYYY-MM-DD"));
      setValue("title", noticeData.headline);
      setSavedUnderlyings(
        noticeData.underlying.split(";").map((data: string, idx: number) => {
          return { id: idx, underlying: data };
        })
      );
      setSavedWarrants(
        noticeData.related_warrant
          .split(";")
          .map((data: string, idx: number) => {
            const tmp = data.split(/[\(\)]/g);
            return {
              id: idx,
              ticker: tmp[0] ? tmp[0] : "",
              dsply_name: tmp[1] ? tmp[1] : "",
            };
          })
      );
    }

    if (isNoticeError) {
      toast.error("Unable to load Notice");
    }
    dispatch(clearState());
  }, [isNoticeSuccess, isNoticeError, noticeData]);

  useEffect(() => {
    if (
      isInsertNoticeSuccess ||
      isUpdateNoticeSuccess ||
      isDeleteNoticeSuccess
    ) {
      dispatch(getPendingList({ token }));
      dispatch(getConfirmedList({ token }));
      reset();
      setSelectedFile("");
      setFileArrayBuffer(undefined);
      setCount((prevState) => prevState + 1);
      setButton(true);
      setId(0);
    }

    if (isInsertNoticeSuccess) {
      toast.success("Successfully saved notice.");
    }

    if (isUpdateNoticeSuccess) {
      toast.success("Successfully updated notice.");
    }

    if (isDeleteNoticeSuccess) {
      toast.success("Successfully deleted notice.");
    }

    if (isInsertNoticeError) {
      toast.error(`Save failed`);
    }

    if (isUpdateNoticeError) {
      toast.error(`Update failed`);
    }

    if (isDeleteNoticeError) {
      toast.error(`Delete failed`);
    }

    dispatch(clearState());
  }, [
    isInsertNoticeSuccess,
    isInsertNoticeError,
    isUpdateNoticeSuccess,
    isUpdateNoticeError,
    isDeleteNoticeSuccess,
    isDeleteNoticeError,
  ]);

  const filterOptions = createFilterOptions({
    trim: true,
    stringify: (option: any) => JSON.stringify(option),
  });

  const handleEdit = (id: number) => {
    setButton(false);
    setId(id);
    dispatch(getNoticeById({ token, id }));
  };

  const handleConfirm = (id: number) => {
    dispatch(
      updateNotice({
        token,
        id,
        payload: {
          is_confirm: 1,
        },
      })
    );
  };

  const handleDelete = (id: number) => {
    dispatch(deleteNotice({ token, id }));
  };

  const handleUpdate = (data: any) => {
    let underlying = "";
    let warrant = "";
    if (savedUnderlyings.length > 0 && selectedUnderlyings.length > 0) {
      underlying = `${selectedUnderlyings
        .map((data: stockList) => data.underlying_name)
        .join(";")};${savedUnderlyings
          .map(({ underlying }: { underlying: string }) => underlying)
          .join(";")}`;
    } else {
      underlying = `${selectedUnderlyings
        .map((data: stockList) => data.underlying_name)
        .join(";")}${savedUnderlyings
          .map(({ underlying }: { underlying: string }) => underlying)
          .join(";")}`;
    }

    if (savedWarrants.length > 0 && selectedWarrants.length > 0) {
      warrant = `${selectedWarrants
        .map((data: stockList) => `${data.ticker}(${data.dsply_name})`)
        .join(";")};${savedWarrants
          .map(
            ({ ticker, dsply_name }: { ticker: string; dsply_name: string }) =>
              `${ticker}(${dsply_name})`
          )
          .join(";")}`;
    } else {
      warrant = `${selectedWarrants
        .map((data: stockList) => `${data.ticker}(${data.dsply_name})`)
        .join(";")}${savedWarrants
          .map(
            ({ ticker, dsply_name }: { ticker: string; dsply_name: string }) =>
              `${ticker}(${dsply_name})`
          )
          .join(";")}`;
    }

     var ud = [];
    console.log(underlying);
    ud = underlying.split(';');
    var temp = "";
    
    for(var i=0;i<ud.length ;i++){
      // console.log("ddd",temp.indexOf(ud[i]));
      if(!(temp.indexOf(ud[i].trim()) !== -1)){
        console.log(temp.indexOf(ud[i]),"ddd", ud[i].trim())
        temp += ud[i].trim();
        if(i < ud.length-1){
          temp += ";";
        }
      }
    }
    underlying = temp;




    var wt = [];
    console.log(warrant);
    wt = warrant.split(';');
    var temp2 = "";
    
    for(var i=0;i<wt.length ;i++){
      // console.log("ddd",temp2.indexOf(wt[i]));
      if(!(temp2.indexOf(wt[i].trim()) !== -1)){
        console.log(temp2.indexOf(wt[i]),"ddd", wt[i].trim())
        temp2 += wt[i].trim();
        if(i < wt.length-1){
          temp2 += ";";
        }
      }
    }
    warrant = temp2;

    dispatch(
      updateNotice({
        token,
        id,
        payload: {
          date: data.date,
          headline: data.title,
          underlying: underlying,
          related_warrant: warrant,
          file_name: selectedFile,
          pdf: fileArrayBuffer,
        },
      })
    );
  };

  const requestPendingSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setPendingData(searchPendingData);
    }
    const filteredRows = searchPendingData.filter((row: NoticeList) => {
      return (
        row.headline.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.file_name.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setPendingData(filteredRows);
  };

  const requestConfirmedSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setConfirmedData(searchConfirmedData);
    }
    const filteredRows = searchConfirmedData.filter((row: NoticeList) => {
      return (
        row.headline.toLowerCase().includes(searchedVal.toLowerCase()) ||
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
    if (data.title) {
      if (selectedFile) {
        dispatch(
          insertNotice({
            token,
            payload: {
              date: data.date,
              headline: data.title,
              underlying: selectedUnderlyings
                .map((data: stockList) => data.underlying_name)
                .join(";"),
              related_warrant: selectedWarrants
                .map((data: stockList) => `${data.ticker}(${data.dsply_name})`)
                .join(";"),
              file_name: selectedFile,
              pdf: fileArrayBuffer,
            },
          })
        );
      } else {
        toast.error("No PDF is chosen");
      }
    } else {
      toast.error("Please input title");
    }
  };

  const handleUnderlyingChange = (value: any, action: any) => {
    setSelectUnderlyings(value);
  };

  const handleWarrantChange = (value: any, action: any) => {
    setSelectWarrants(value);
  };

  const CustomSelectDropDownOverlay = function (props: any) {
    return (
      <Popper {...props} className={classes.popper} placement="bottom-start" />
    );
  };

  const UnderlyingOption = (props: any) => {
    return (
      <components.Option {...props}>
        <Grid container xs={12}>
          <Grid item xs={6}>
            <Chip
              variant="outlined"
              size="small"
              label={props.data.underlying_ticker}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip
              variant="outlined"
              size="small"
              label={props.data.underlying_name}
            />
          </Grid>
        </Grid>
      </components.Option>
    );
  };

  const WarrantOption = (props: any) => {
    return (
      <components.Option {...props}>
        <Grid container xs={12}>
          <Grid item xs={6}>
            <Chip variant="outlined" size="small" label={props.data.ticker} />
          </Grid>
          <Grid item xs={6}>
            <Chip
              variant="outlined"
              size="small"
              label={props.data.dsply_name}
            />
          </Grid>
        </Grid>
      </components.Option>
    );
  };

  const pendingColumns = [
    {
      field: "last_update_time",
      headerName: "Last Update Time",
      flex: 2,
      renderCell: (param: any) => {
        return dayjs(param.formattedValue).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      field: "date",
      headerName: "Date",
      flex: 2,
      renderCell: (param: any) => {
        return dayjs(param.formattedValue).format("YYYY-MM-DD");
      },
    },
    {
      field: "headline",
      headerName: "Headline",
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
          <a href={`${api}/file/pdf/notice/${params.row.id}`} target="_blank">
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
            <CheckOutlined
              className="termsheet-confirm"
              onClick={() => handleConfirm(params.row.id)}
            />
            /
            <DeleteOutline
              className="termsheet-delete"
              onClick={() => handleDelete(params.row.id)}
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
      field: "date",
      headerName: "Date",
      flex: 2,
      renderCell: (param: any) => {
        return dayjs(param.formattedValue).format("YYYY-MM-DD");
      },
    },
    {
      field: "headline",
      headerName: "Headline",
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
          <a href={`${api}/file/pdf/notice/${params.row.id}`} target="_blank">
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
              onClick={() => handleEdit(params.row.id)}
            />
            /
            <DeleteOutline
              className="termsheet-delete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  const underlyingsColumn = [
    {
      field: "underlying",
      headerName: "Underlying",
      flex: 2,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 2,
      renderCell: (params: any) => {
        return (
          <>
            <DeleteOutline
              className="termsheet-delete"
              onClick={() =>
                setSavedUnderlyings(
                  savedUnderlyings.filter(
                    (data: any) => data.underlying !== params.row.underlying
                  )
                )
              }
            />
          </>
        );
      },
    },
  ];

  const warrantsColumn = [
    {
      field: "ticker",
      headerName: "Warrant",
      width: 200,
    },
    {
      field: "dsply_name",
      headerName: "Warrant Name",
      width: 200,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => {
        return (
          <>
            <DeleteOutline
              className="termsheet-delete"
              onClick={() =>
                setSavedWarrants(
                  savedWarrants.filter(
                    (data: any) => data.ticker !== params.row.ticker
                  )
                )
              }
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="expiry-adjustment-notice">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Expiry & Adjustment Notice</h2>
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
                    <Typography>Date:</Typography>
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
                            label="Date"
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
                    <Typography>Headline:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        control={control}
                        name="title"
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Headline"
                            fullWidth
                            margin="normal"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Add underlying:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="underlying"
                        control={control}
                        render={({ field }) => (
                          <Select
                            key={count}
                            isMulti
                            options={underlyings}
                            components={{ Option: UnderlyingOption }}
                            onChange={handleUnderlyingChange}
                            placeholder={"Search..."}
                            getOptionLabel={(option: stockList) =>
                              option.underlying_name
                            }
                            getOptionValue={(option: stockList) =>
                              option.underlying_ticker
                            }
                            filterOption={(option, input) => {
                              if (input) {
                                return (
                                  option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase()) ||
                                  option.value
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                );
                              }
                              return true;
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {!button && (
                    <Grid container item xs={12} style={{ height: 300 }}>
                      <DataGrid
                        rows={savedUnderlyings}
                        columns={underlyingsColumn}
                        pageSize={10}
                      />
                    </Grid>
                  )}
                  <Grid item xs={3}>
                    <Typography>Add warrant: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="warrant"
                        control={control}
                        render={({ field }) => (
                          <Select
                            key={count}
                            isMulti
                            options={warrants}
                            components={{ Option: WarrantOption }}
                            onChange={handleWarrantChange}
                            placeholder={"Search..."}
                            getOptionLabel={(option: stockList) =>
                              option.dsply_name
                            }
                            getOptionValue={(option: stockList) =>
                              option.ticker
                            }
                            filterOption={(option, input) => {
                              if (input) {
                                return (
                                  option.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase()) ||
                                  option.value
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                );
                              }
                              return true;
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {!button && (
                    <Grid container item xs={12} style={{ height: 300 }}>
                      <DataGrid
                        rows={savedWarrants}
                        columns={warrantsColumn}
                        pageSize={10}
                      />
                    </Grid>
                  )}

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
                  onPageSizeChange={ pageSize  => setPageSizePend(pageSize)}
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
                  onPageSizeChange={ pageSize  =>
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
