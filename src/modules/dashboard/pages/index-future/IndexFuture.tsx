import {
  Card,
  Checkbox,
  emphasize,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Input,
  InputLabel,
  makeStyles,
  withStyles,
  MenuItem,
  Select,
  Typography,
  CheckboxProps,
  Button,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./IndexFuture.css";
import { useForm, Controller } from "react-hook-form";
import { loginSelector } from "../../../login/loginSlice";
import {
  getIFlist,
  getIFWarrantslist,
  updateIF,
  IFSelector,
  clearState,
} from "./IndexFutureSlice";
import { useDispatch, useSelector } from "react-redux";
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
  // root: {
  //   display: "flex",
  //   flexWrap: "wrap",
  // },
  isChecked: {
    backgroundColor: `${emphasize("rgb(220, 220, 220)", 0.08)}!important`,
    margin: theme.spacing(1),
    "&:hover, &:focus": {
      backgroundColor: emphasize("rgb(220, 220, 220)", 0.08),
    },
    "&:active": {
      backgroundColor: emphasize("rgb(220, 220, 220)", 0.18),
    },
    borderRadius: "0.5em",
    fontColor: "white",
    padding: "8px"
  },
  buttonContainer: {
    // margin: theme.spacing(1),
  },
  container: {
    margin: theme.spacing(1),
    backgroundColor: "rgb(240, 240, 240)",
    "&:hover, &:focus": {
      backgroundColor: emphasize("rgb(220, 220, 220)", 0.08),
    },
    "&:active": {
      backgroundColor: emphasize("rgb(220, 220, 220)", 0.18),
    },
    borderRadius: "0.5em",
    fontColor: "white",
    padding: "8px"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  dataContainer: {
    // height: "500px",
  },
}));

const PurpleCheckbox = withStyles({
  root: {
    color: "#3f51b5",
    "&$checked": {
      color: "#1329a2",
    },
    
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

type IFList = {
  ric: string;
  dsply_name: string;
  underlying_ticker: string;
};

type WarrantsList = {
  future_dsply_name: string;
  future_ric: string;
  ticker: string;
  wrnt_ric: string;
};

const itemsMap = {
  HSI: "HSML",
  HSTECH: "HSML",
  SP500: "SXML",
  SiMSCI: "MSML",
  NIKKEI225: "NIML",
};

const itemsMap2 = {
  HSI: "HSI",
  HSTECH: "HSTECH",
  SP500: "S&P",
  SiMSCI: "SIMSCI",
  NIKKEI225: "NKY",
};

type underlying = "HSI" | "HSTECH" | "SP500" | "SiMSCI" | "NIKKEI225";

export default function IndexFuture() {
  const [data, setData] = useState<IFList[]>([]);
  const [futureData, setFutureData] = useState<any>([]);
  const [futureIndexData, setFutureIndexData] = useState<any>([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [ric, setRic] = useState<string>("");
  const [dspName, setDspName] = useState<string>("");
  const [undlyTkr, setUndlyTkr] = useState<underlying>("HSI");
  const classes = useStyles();
  const { register, handleSubmit, control, getValues } = useForm();
  const [checkedStatus, setCheckedStatus] = useState(false);
  const {
    IFlist,
    IFWarrants,
    isListSuccess,
    isUpdateIFSuccess,
    isListError,
    isUpdateIFError,
    isWarrantsSuccess,
    isWarrantsError,
    updateIFErrorMessage,
  } = useSelector(IFSelector);
  const { token } = useSelector(loginSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIFlist({ token }));
    dispatch(getIFWarrantslist({ token }));
  }, []);

  useEffect(() => {
    if (isListSuccess) {
      if(IFlist){
        setData(IFlist);
        setSelectedIndex(
          `${IFlist[0]?.ric},${IFlist[0]?.dsply_name},${IFlist[0]?.underlying_ticker}`
        );
        setRic(IFlist[0]?.ric);
        setDspName(IFlist[0]?.dsply_name);
        setUndlyTkr(IFlist[0]?.underlying_ticker);
      }
    }

    if (isListError) {
      toast.error("Unable to load Index Future List");
    }
  }, [isListSuccess, isListError, IFlist]);

  useEffect(() => {
    if (
      futureIndexData.filter((v: string) => v !== "").length ===
      futureIndexData.length
    ) {
      setCheckedStatus(true);
    } else {
      setCheckedStatus(false);
    }
  }, [futureIndexData]);

  useEffect(() => {
    if (isWarrantsSuccess) {
      if(IFWarrants){
        IFWarrants.filter((data: any) =>{
          data.wrnt_ric.includes(itemsMap2[undlyTkr])
        }
        
      );
        setFutureData(
          IFWarrants.filter((data: any) => 
            data
          )
        );

    setFutureIndexData(
      IFWarrants.filter((data: WarrantsList) =>
        data
      ).map((data: WarrantsList) => {
        if (ric === data.future_ric) {
          return data.wrnt_ric;
        } else {
          return "";
        }
      })
    );
    }
    if (isWarrantsError) {
      toast.error("Unable to load Warrants");
    }
    }
  }, [isWarrantsSuccess, isWarrantsError, IFWarrants, undlyTkr, ric]);

  useEffect(() => {
    dispatch(getIFWarrantslist({ token }));

    if(isUpdateIFSuccess){
      toast.success(`Index Future Updated`);
      dispatch(clearState());
    }

    if (isUpdateIFError) {
      toast.error(`Update failed`);
      dispatch(clearState());
    }
  }, [isUpdateIFSuccess, isUpdateIFError]);

  const indexChange = () => {
    setSelectedIndex(getValues("future-index"));
    if (getValues("future-index")) {
      const e = getValues("future-index").split(",");
      if (e.length >= 3) {
        setRic(e[0]);
        setDspName(e[1]);
        setUndlyTkr(e[2]);
      }
    }
  };

  const handleIndexOptChange = (wrnt_ric: string, index: number) => {
    const newselected = [...futureIndexData];
    if (!newselected[index]) {
      newselected[index] = wrnt_ric;
    } else {
      newselected[index] = "";
    }
    setFutureIndexData(newselected);
  };

  const handleSave = () => {
    dispatch(
      updateIF({
        token,
        payload: {
          future_ric: ric,
          future_dsply_name: dspName,
          rics: futureIndexData.filter((v: string) => v !== ""),
        },
      })
    );
  };

  const handleSelectAll = () => {
    if (checkedStatus) {
      setCheckedStatus(false);
    } else {
      setCheckedStatus(true);
    }
    const newselected = futureData.map((d: WarrantsList) => {
      if (checkedStatus) {
        return "";
      } else {
        return d.wrnt_ric;
      }
    });
    setFutureIndexData(newselected);
  };
  

  return (
    <div className="index-future">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Index Future</h2>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={3} alignItems="center">
            <Grid item xs={6}>
              <Typography>
                Please select a future contract from the drop down box.
              </Typography>
            </Grid>
            <Grid container item xs={6} spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="demo-mutiple-name-label">
                  Index Future
                </InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  value={selectedIndex}
                  input={<Input />}
                  onClick={handleSubmit(indexChange)}
                  {...register("future-index")}
                >
                  <MenuItem value="" disabled>
                    Index Future List
                  </MenuItem>
                  {data.map(({ ric, dsply_name, underlying_ticker }, index) => (
                    <MenuItem
                      key={index}
                      value={`${ric},${dsply_name},${underlying_ticker}`}
                    >
                      {dsply_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
            </Grid>
          </Grid>

          <Grid item container xs={12}>
            {futureData.map(
              (
                { future_ric, future_dsply_name, wrnt_ric, ticker }: any,
                index: any
              ) => (
                <Grid
                  item
                  // spacing={4}
                  xs={3}
                  container
                  key={index}
                 
                >
                  <FormControl >
                    <Controller
                      name="selectedWarrants"
                      control={control}
                      render={() => (
                        <FormControlLabel
                        className={`${
                          !!futureIndexData[index]
                            ? classes.isChecked
                            : classes.container
                        }`}
                          control={
                            <PurpleCheckbox
                              onChange={() =>
                                handleIndexOptChange(wrnt_ric, index)
                              }
                              checked={!!futureIndexData[index]}
                            />
                          }
                          
                          key={index}
                          label={`${wrnt_ric} (${ticker})`}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              )
            )}
          </Grid>
          <Grid item container xs={12} spacing={3} alignItems="center">
            {futureIndexData && futureIndexData.length > 0 && (
              <Grid className={classes.buttonContainer} item container xs={5}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Grid>
            )}
            {futureIndexData && futureIndexData.length > 0 && (
              <Grid
                className={classes.buttonContainer}
                item
                container
                xs={5}
                spacing={3}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSelectAll}
                >
                  {!checkedStatus ? "Check All" : "UnCheck All"}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
