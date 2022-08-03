import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutline } from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import {
  Card,
  Grid,
  Chip,
  makeStyles,
  Select,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Input,
  MenuItem,
  Popper,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import "./WarrantHotList.css";
import { getHotList, deleteHotList } from "./hotlistSlice";
import { loginSelector } from "../../../login/loginSlice";
import { hotlistSelector } from "./hotlistSlice";
import { useForm } from "react-hook-form";
import {
  getStockCodeList,
  updateStockCodeList,
  stockCodeSelector,
} from "./stockCodeSlice";
import toast, { Toaster } from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  dataContainer: {
    height: "500px",
  },
  popper: {
    maxWidth: "fit-content",
    minWidth: "450px",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing(1),
  },
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
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: theme.spacing(3),
  },
}));

export default function WarrantHotList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    hotlist,
    isHotListSuccess,
    isHotListError,
    isHotListDeleteSuccess,
    isHotListDeleteError,
  } = useSelector(hotlistSelector);
  const {
    stockCodeList,
    stockCodeUpdateStatus,
    isStockCodeUpdateSuccess,
    isStockCodeUpdateError,
    stockCodeUpdateErrorMessage,
  } = useSelector(stockCodeSelector);

  const [data, setData] = useState<any>([]);
  const [selectedId, setSelectedId] = useState(1);
  const [searched, setSearched] = useState<string>("");
  const [selectedStock, setSelectedStock] = useState<any>("");
  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const { register, handleSubmit, control } = useForm();
  const [pageSize, setPageSize] = useState<number>(10);

  const filterOptions = createFilterOptions({
    trim: true,
    stringify: (option: any) => JSON.stringify(option),
  });

  useEffect(() => {
    dispatch(getHotList({ token }));
  }, []);

  useEffect(() => {
    if (selectedStock?.underlying_name) {
      setSelectedCategory(selectedStock?.underlying_name);
    }
  }, [selectedStock?.underlying_name, stockCodeList]);

  useEffect(() => {
    if (isHotListSuccess) {
      const formattedHotlist = hotlist.map((hl: any, i: number) => ({
        ...hl,
        idx: hl.id,
        id: i,
      }));
      setData(formattedHotlist);
    }

    if (isHotListError) {
    }
  }, [isHotListSuccess, isHotListError, hotlist]);

  useEffect(() => {
    if (isStockCodeUpdateSuccess || isHotListDeleteSuccess) {
      dispatch(getHotList({ token }));
    }
  }, [
    isStockCodeUpdateSuccess,
    isStockCodeUpdateError,
    isHotListDeleteSuccess,
    isHotListDeleteError,
  ]);

  const requestSearch = (searchedVal: string) => {

    if (!searchedVal) {
      const formattedHotlist = hotlist.map((hl: any, i: number) => ({
        ...hl,
        idx: hl.id,
        id: i,
      }));
     
      setData(formattedHotlist);
      return;
    }

    var searchresult = [];

    // const filteredRow = hotlist.filter((row: any) => {
    //   return (
    //     row?.id === Number(searchedVal) ||
    //     (row?.category &&
    //       row?.category.toLowerCase().includes(searchedVal.toLowerCase())) ||
    //     (row?.ric &&
    //       row?.ric.toLowerCase().includes(searchedVal.toLowerCase())) ||
    //     (row?.ticker &&
    //       row?.ticker.toLowerCase().includes(searchedVal.toLowerCase())) ||
    //     (row?.type &&
    //       row?.type.toLowerCase().includes(searchedVal.toLowerCase()))
    //   );
    // });

    for(var i=0; i<hotlist.length; i++) {
      if( (hotlist[i]?.category && hotlist[i]?.category.toLowerCase().includes(searchedVal.toLowerCase())) ||
          (hotlist[i]?.ric && hotlist[i]?.ric.toLowerCase().includes(searchedVal.toLowerCase())) ||
          (hotlist[i]?.ticker && hotlist[i]?.ticker.toLowerCase().includes(searchedVal.toLowerCase())) ||
          (hotlist[i]?.type && hotlist[i]?.type.toLowerCase().includes(searchedVal.toLowerCase())))

          searchresult.push({
            category: hotlist[i].category, 
            categoryfull: hotlist[i].categoryfull, 
            id: i,
            idx: hotlist[i].id,
            ric: hotlist[i].ric,
            ticker: hotlist[i].ticker,
            type: hotlist[i].type
          });
    }

    setData(searchresult);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleDelete = (row: any) => {
    if (row?.categoryfull && row?.idx) {
      dispatch(
        deleteHotList({
          token,
          category: row?.categoryfull,
          id: row?.idx,
        })
      );
    } else {
      toast.error(`Please select a valid Hot List Item to delete`);
    }
  };

  const handleIdChange = (e: any) => {
    setSelectedId(e.target.value);
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

  const updateHotList = (e: any) => {
    if (
      selectedStock?.underlying_name &&
      selectedStock?.ric &&
      selectedCategory &&
      selectedId
    ) {
      dispatch(
        updateStockCodeList({
          token,
          ric: selectedStock?.ric,
          payload: {
            category: selectedCategory,
            id: selectedId,
          },
        })
      );
    } else {
      toast.error(`Please select a stock code, category, and a RIC to update.`);
    }
  };

  const CustomSelectDropDownOverlay = function (props: any) {
    return (
      <Popper {...props} className={classes.popper} placement="bottom-start" />
    );
  };

  const columns = [
    {
      field: "category",
      headerName: "Category",
      flex: 1
    },
    { 
      field: "idx", 
      headerName: "Id", 
      flex: 1
    },
    { 
      field: "ric", 
      headerName: "Ric", 
      flex: 1
    },
    {
      field: "ticker",
      headerName: "Warrant Code",
      flex: 1
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1
    },
    {
      field: "options",
      headerName: "Option",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>
            <DeleteOutline
              className="warrant-hotlist-delete"
              onClick={() => handleDelete(params?.row)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="warrant-hotlist">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Trending Warrants</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit(updateHotList)}
              >
                <Grid
                  alignItems="center"
                  container
                  spacing={0}
                  justifyContent="flex-end"
                >
                  <Grid item xs={3}>
                    <FormControl>
                      <TextField
                        autoFocus
                        label="Category:"
                        value={selectedStock?.underlying_name || ""}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    <FormControl>
                      <InputLabel id="demo-mutiple-name-label">ID</InputLabel>
                      <Select
                        labelId="demo-mutiple-name-label"
                        id="demo-mutiple-name"
                        value={selectedId}
                        onChange={handleIdChange}
                        input={<Input />}
                      >
                        {[...Array.from({ length: 6 }, (_, i) => i + 1)].map(
                          (value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <Autocomplete
                        id="stock-code"
                        style={{
                          width: 200,
                        }}
                        options={stockCodeList}
                        PopperComponent={CustomSelectDropDownOverlay}
                        getOptionLabel={(option: any) => `${option.ticker}`}
                        renderOption={(option) => (
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
                          <TextField {...params} label="Stock Code:" />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl>
                      <TextField
                        label="RIC"
                        type="text"
                        name="ric"
                        value={selectedStock?.ric || ""}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid container item justifyContent="flex-end">
              <Grid item xs={4}>
                <SearchBar
                  className='searchbar'
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
                pageSize={50}
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
      </Card>
    </div>
  );
}
