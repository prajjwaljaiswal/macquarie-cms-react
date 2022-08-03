import {
  makeStyles,
  Card,
  Grid,
  Typography,
  FormControl,
  TextField,
  ListItem,
  ListItemIcon,
  Checkbox,
  Fab,
  Button,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarExport,
  GridToolbarContainer,
} from "@material-ui/data-grid";
import { EditOutlined, DeleteOutline, NoteAdd } from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { loginSelector } from "../../../login/loginSlice";
import {
  SeminarRegSelector,
  getEnabledSeminar,
  getSeminarReglist,
  insertSeminarReg,
  deleteSeminarReg,
  clearState,
} from "./SeminarRegistrationSlice";
import { useDispatch, useSelector } from "react-redux";
import "./SeminarRegistration.css";
import toast, { Toaster } from "react-hot-toast";
import { Alert } from "@material-ui/lab";

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
}));

type titleList = {
  id: number;
  en_title: string;
  sign_up_limit: number;
};

type regList = {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  id: string;
};

export default function SeminarRegistration() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { token } = useSelector(loginSelector);
  const {
    SeminarReglist,
    isListSuccess,
    isListError,
    Enabledlist,
    isEnabledListSuccess,
    isEnabledListError,
    isInsertSeminarRegSuccess,
    isInsertSeminarRegError,
    isDeleteSeminarRegSuccess,
    isDeleteSeminarRegError,
    insertSeminarRegErrorMessage,
    deleteSeminarRegErrorMessage,
  } = useSelector(SeminarRegSelector);
  const [searchdata, setSearchdata] = useState<regList[]>([]);
  const [seminarTitleList, setSeminarTitleList] = useState<titleList[]>([]);
  const [seminarTableData, setSeminarTableData] = useState<regList[]>([]);
  const [searched, setSearched] = useState<string>("");
  const [limit, setLimit] = useState(0);
  const [button, setButton] = useState(true);
  const [pageSize, setPageSize] = useState<number>(100);
  const { register, handleSubmit, control, getValues, setValue, reset } =
    useForm({
      defaultValues: { id: 0, email: "" },
    });

  useEffect(() => {
    dispatch(getEnabledSeminar({ token }));

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isEnabledListSuccess) {
      setSeminarTitleList(Enabledlist);
      if (Enabledlist.length > 0) {
        setValue("id", Enabledlist[0].id);
        setLimit(Enabledlist[0].sign_up_limit);
        dispatch(getSeminarReglist({ token, id: Enabledlist[0].id }));
      }
    }
  }, [isEnabledListSuccess, isEnabledListError, Enabledlist]);

  useEffect(() => {
    if (isListSuccess) {
      setSearchdata(SeminarReglist);
      setSeminarTableData(SeminarReglist);
      if (SeminarReglist.length >= limit) {
        setButton(false);
      } else {
        setButton(true);
      }
    }

    if (isListError) {
      toast.error("Unable to load Registrant List");
    }
  }, [isListSuccess, isListError, SeminarReglist]);

  useEffect(() => {
    if (isInsertSeminarRegSuccess || isDeleteSeminarRegSuccess) {
      setValue("email", "");
      dispatch(getSeminarReglist({ token, id: getValues("id") }));
    }

    if (isInsertSeminarRegSuccess) {
      toast.success("Successfully saved registrant.");
    }

    if (isDeleteSeminarRegSuccess) {
      toast.success("Successfully removed registrant.");
    }

    if (isInsertSeminarRegError) {
      toast.error(`Save failed`);
    }

    if (isDeleteSeminarRegError) {
      toast.error(`Delete failed`);
    }
    dispatch(clearState());
  }, [
    isInsertSeminarRegSuccess,
    isInsertSeminarRegError,
    isDeleteSeminarRegSuccess,
    isDeleteSeminarRegError,
  ]);

  const handleSelect = () => {
    const tmp = seminarTitleList.find(
      (data: titleList) => data.id === getValues("id")
    );
    if (tmp) {
      setLimit(tmp.sign_up_limit);
    }
    dispatch(getSeminarReglist({ token, id: getValues("id") }));
  };

  const handleDelete = (userid: string) => {
    dispatch(
      deleteSeminarReg({
        token,
        payload: { user_id: userid, seminar_id: getValues("id") },
      })
    );
  };

  const requestSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setSeminarTableData(searchdata);
    }
    const filteredRows = searchdata.filter((row: regList) => {
      return (
        row?.first_name?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row?.last_name?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row?.user_id?.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row?.phone?.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setSeminarTableData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const onSubmit = (data: any) => {
    dispatch(
      insertSeminarReg({
        token,
        payload: {
          user_id: getValues("email"),
          seminar_id: getValues("id"),
        },
      })
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 2,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 2,
    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 2,
    },

    { field: "user_id", headerName: "Email", width: 150 },
    {
      field: "phone",
      headerName: "Mobile Number",
      flex: 2,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: (params: any) => {
        return (
          <>
            <DeleteOutline
              className="seminar-registration-delete"
              onClick={() => handleDelete(params.row.user_id)}
            />
          </>
        );
      },
    },
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  };

  return (
    <div className="seminar-registration">
      <Toaster />
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Seminar Registration</h2>
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
                    <Typography>Title:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Title"
                            onClick={handleSelect}
                          >
                            <MenuItem key="" value="" disabled>
                              List Of Seminars
                            </MenuItem>
                            {seminarTitleList.length === 0 && (
                              <MenuItem key={0} value={0} disabled>
                                No Available Seminar
                              </MenuItem>
                            )}
                            {seminarTitleList.map((data: titleList) => (
                              <MenuItem key={data.id} value={data.id}>
                                {data?.en_title}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Email: </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Email:"
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        )}
                        rules={{
                          required: "Email is required",
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}></Grid>
                  <Grid item xs={9}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={!button}
                    >
                      Add New Registrant
                    </Button>
                    {!button && (
                      <Alert severity="info">
                        No. of registrant reach the limit.
                      </Alert>
                    )}
                    <Alert severity="warning">
                      Note: The registrant must be a member and the email should
                      be the same as his/her login id of the Macquarie main
                      site.
                    </Alert>
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
                  rows={seminarTableData}
                  columns={columns}
                  pageSize={pageSize}
                  onPageSizeChange={pageSize => setPageSize(pageSize)}
                  rowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
                  components={{
                    Toolbar: CustomToolbar,
                  }}
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
