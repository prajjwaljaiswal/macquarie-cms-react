import {
  makeStyles,
  Card,
  Grid,
  FormControl,
  TextField,
  InputLabel,
  Select,
  Typography,
  Input,
  MenuItem,
  Button,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from "material-ui-search-bar";
import React, { useState, useEffect } from "react";
import "./GeneralAnnouncement.css";
import { GeneralAnnouncementData } from "./../../../../mock/general-announcements";
import { DeleteOutline, EditOutlined } from "@material-ui/icons";

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

export default function GeneralAnnouncement() {
  const classes = useStyles();
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusList = ["Enable", "Disable"];
  const [data, setData] = useState(GeneralAnnouncementData);
  const [searched, setSearched] = useState<string>("");

  useEffect(() => {
    setSelectedStatus(statusList[0]);
  }, [statusList]);

  const handleDelete = (id: number) => {
    setData(data.filter((item: any) => item.id !== id));
  };

  const requestSearch = (searchedVal: string) => {
    if (!searchedVal) {
      return setData(GeneralAnnouncementData);
    }
    const filteredRows = data.filter((row) => {
      return (
        row.id === Number(searchedVal) ||
        row.publish_date.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.status.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.title.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.simplified_content
          .toLowerCase()
          .includes(searchedVal.toLowerCase()) ||
        row.full_content.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "publish_date",
      headerName: "Published Date",
      width: 220,
    },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "title",
      headerName: "Title (English)",
      width: 400,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => {
        return (
          <>
            <EditOutlined
              className="general-announcement-edit"
              onClick={() => handleDelete(params.row.id)}
            />
            /
            <DeleteOutline
              className="general-announcement-delete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="general-announcement">
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>General Announcements</h2>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={0}>
              <form className={classes.form} noValidate>
                <Grid item container xs={12} spacing={3}>
                  <Grid item xs={3}>
                    <Typography>Status:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-mutiple-name-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-mutiple-name-label"
                        id="demo-mutiple-name"
                        value={selectedStatus}
                        input={<Input />}
                      >
                        {statusList.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Publish Date:</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <TextField
                        id="datetime-local"
                        label="Publish Date"
                        type="datetime-local"
                        defaultValue="2021-05-24T10:30"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Title (English Version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <TextField
                        label="Title (English Version)"
                        fullWidth
                        value=""
                        margin="normal"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>
                      Content (Simplified English Version):
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <TextField
                        label="Content (Simplified English version)"
                        multiline
                        rows={4}
                        fullWidth
                        value=""
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography>Content (Full English Version):</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <TextField
                        label="Content (Full English version)"
                        multiline
                        fullWidth
                        rows={10}
                        value=""
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
                    >
                      New
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={5}>
            <Grid item container xs={12} spacing={3}>
              <Grid container item justify="flex-end">
                <Grid item xs={4}>
                  <SearchBar
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} className={classes.dataContainer}>
                <DataGrid rows={data} columns={columns} pageSize={8} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
