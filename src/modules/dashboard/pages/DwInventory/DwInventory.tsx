import React, { useEffect, useState } from 'react';
import './DwInventory.css';
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import {
  Button,
  Card,
  FormControl,
  Grid,
  makeStyles,
  TextField
} from "@material-ui/core";
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { classNames } from 'react-select/src/utils';
import { DeleteOutline, EditOutlined, TextFields } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearState, deleteDwInventory, DwInventorySelector, getDailyInventorySearch, getDwInventorylist, insertDwInventory } from './DwInventorySlice';
import { loginSelector } from '../../../login/loginSlice';
import { Autocomplete } from '@material-ui/lab';
import { useForm } from 'react-hook-form';


const columns = [
  {
    field: "id",
    headerName: "ID",
    hide: true
  },
  {
    field: "symbol",
    headerName: "DW Symbol",
    flex: 1,
  },
  {
    field: "ric",
    headerName: "Ric",
    flex: 1,
  },
  {
    field: "last_trading_date",
    headerName: "Last Trading Date",
    flex: 1,
    renderCell: (params: any) => {
      return dayjs(params.formattedValue).format("YYYY-MM-DD");
    },
  },
];

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



const DwInventory = () => {
  const classes = useStyles();

  const { token } = useSelector(loginSelector);
  const {
    isSuccess,
    isError,
    DwInventorylist,
    isDataSearchSuccess,
    DailyInventoryDataSearch,
    insertDwInventorystatus,
    isInsertDwInventoryFetching,
    isInsertDwInventorySuccess,
    isInsertDwInventoryError,
    isDeleteSuccess,
    insertDwInventoryErrorMessage
  } = useSelector(DwInventorySelector);
  const dispatch = useDispatch();

  const [rows, setRows] = useState<any>([]);

  const [data, setData] = useState<any>([]);

  const [selected, setSelection] = useState<any>([]);

  const [searchedSymbol, setSearchedSymbol] = useState<any>([]);

  useEffect(() => {
    dispatch(getDwInventorylist({ token }));

    return () => {
      dispatch(clearState());
    }
  }, []);



  useEffect(() => {

    if (isDeleteSuccess) {
      dispatch(getDwInventorylist({ token }));
      toast.success(`Deleted Dw Inventory`);
      dispatch(clearState());
    }

    if (isSuccess) {
      setRows(DwInventorylist);
    }

    if (isError) {
      toast.error(`Unable to load dw Inventory`);
      dispatch(clearState());
    }

    if (isInsertDwInventorySuccess) {
      dispatch(getDwInventorylist({ token }));
      toast.success(`Added Dw Inventory`);
      dispatch(clearState());
    }

    if (isInsertDwInventoryError) {
      toast.error(`Something went wrong!`);
      dispatch(clearState());
    }
  }, [isDeleteSuccess, isSuccess, isError, DwInventorylist, isInsertDwInventorySuccess, isInsertDwInventoryError])

  useEffect(() => {
    const newArr = [];
    if (rows) {
      for (var i: number = 0; i < rows.length; i++) {
        newArr.push({
          id: i,
          symbol: rows[i].symbol,
          ric: rows[i].ric,
          last_trading_date: rows[i].last_trading_date
        })
      }
      // console.log(newArr);
      setData(newArr);
    }
  }, [rows]);


  const handleSearch = (e: any) => {
    const ric: string = e.target.value;
    dispatch(getDailyInventorySearch({ token, ric }));
    if (isDataSearchSuccess) {
      // console.log(DailyInventoryDataSearch);
      setSearchedSymbol(DailyInventoryDataSearch);
    }
  }

  const insertInput = (e: any, value: any) => {
    const s = e.target.value;
    console.log(DailyInventoryDataSearch);
    var payload = {};
    if (DailyInventoryDataSearch) {
      DailyInventoryDataSearch.map((data: any) => {
        if (value === data.symbol) {
          payload = {
            symbol: data.symbol,
            ric: data.ric
          }
        }
      })
    }

    dispatch(insertDwInventory({
      token,
      payload
    }))

  }

  const selectedChecksChangeHandler = (ids: any) => {
    let selectedList: Array<any> = [];
    if (data[0]) {
      ids.map((id: any, i: any) => {
        selectedList.push(data[id].symbol);
      });
      setSelection(selectedList);
    }
  }


  const handleDelete = () => {
    dispatch(deleteDwInventory({ token, selected }));
  };

  return (
    <>
      <div className="dw-inventory">
        <Toaster />
        <Card
          className={classes.cardLay}
          variant="outlined"
        >
          <Grid container spacing={4}>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={12}>
                <h2>Dw Inventory Sold Out</h2>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={5}>
              <Grid item xs={6}>
                <h4>DW Selection</h4>
              </Grid>
              <Grid item xs={6}>
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
                        label="Add a DW"
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container item xs={12} spacing={5}>
              <Grid item xs={6}>
                {selected[0] ? (<Button
                  style={{ marginLeft: "2px", width: "49%", backgroundColor: "rgba(63, 81, 181, 0.08)", }}
                  variant="contained"
                  onClick={handleDelete}
                >
                  Remove
                </Button>) : ("")}
              </Grid>
            </Grid>

            <Grid container item xs={12} className={classes.dataContainer}>
              <DataGrid
                rows={data}
                columns={columns}
                checkboxSelection
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onSelectionModelChange={(ids) => {
                  selectedChecksChangeHandler(ids);
                }}
                componentsProps={{
                  pagination: {
                    labelRowsPerPage: "Entries per page:",
                  },
                }}
              />
            </Grid>
          </Grid>

        </Card>

      </div>
    </>
  );
}

export default DwInventory;