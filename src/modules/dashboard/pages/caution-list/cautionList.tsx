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
  Checkbox
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import { getHotList, updatecautionlist } from "./cautionSlice";
import { loginSelector } from "../../../login/loginSlice";
import { cautionSelector } from "./cautionSlice";
import { useForm } from "react-hook-form";

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

export default function Cautionlist() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    iscautionlistSuccess,
    iscautionlistError,
    iscautionlistUpdateSuccess,
    cautionlist
  } = useSelector(cautionSelector);
  

  const [data, setData] = useState<any>([]);
  const [filtereddata, setFilteredData] = useState<any>([]);
  
  const [pageSize, setPageSize] = useState<number>(10);
  const filterOptions = createFilterOptions({
    trim: true,
    stringify: (option: any) => JSON.stringify(option),
  });

  useEffect(() => {
   
    dispatch(getHotList({ token }));
  }, []);


  useEffect(() => {
    if (iscautionlistSuccess) {
        const formattedHotlist = cautionlist.map((hl: any, i: number) => ({
        ...hl,
        idx: hl.ticker,
        id: i,
        // status:hl.status
      }));
      setData(formattedHotlist);
    }
    

    if (iscautionlistError) {
    }
  }, [iscautionlistSuccess, iscautionlistError, cautionlist,]);

  useEffect(() => {
    if(iscautionlistUpdateSuccess){
      dispatch(getHotList({ token }));
    }
  },[iscautionlistUpdateSuccess])

  

  const onUpdate = () => {
    dispatch(
      updatecautionlist({
        token,
        payload: {
          data: data
        },
      })
    );
  };

  const handleCheck = (row: any) => {
    console.log(row)
    const newlist = data.map((hl: any, i: number) => ({
      ...hl,
      idx: hl.ticker,
      id: i,
      status: hl.ticker == row.ticker ? row.status==1? 0 : 1:hl.status
      // status:hl.status
    }));

    setData(newlist);

  };

  

  const columns = [
    {
      field: "options",
      headerName: "Caution List",
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>
            <Checkbox
              style={{ backgroundColor: "white", top: "10px", margin: "10px" }}
              color="primary"
              
              checked={params?.row.status =="1" ? true :false}
              onClick={() => handleCheck(params?.row)}
            />
          </>
        );
      },
    },
    
    { 
      field: "ticker", 
      headerName: "DW", 
      flex: 1
    },
   
    
    
  ];

  return (
    <div className="warrant-hotlist">
       
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
       
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Caution List</h2>
            </Grid>
          </Grid>
     
          <Grid container item xs={12} spacing={3}>
           
            <Grid container item xs={12} className={classes.dataContainer}>
              <DataGrid
                rows={data}
                columns={columns}
                // pageSize={100}
                // // onPageSizeChange={pageSize => setPageSize(pageSize)}
                // // rowsPerPageOptions={[10, 25, 50, 100,300]}
                // componentsProps={{
                //   pagination: {
                //     labelRowsPerPage: "Entries per page:",
                //   },
                // }}
              />
            </Grid>
            <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={onUpdate}
                  >
                    Update
                  </Button>
                </Grid>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
