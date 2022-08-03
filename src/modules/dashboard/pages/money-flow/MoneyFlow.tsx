import {
  makeStyles,
  Card,
  Grid,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Fab,
  Typography,
  IconButton,
} from "@material-ui/core";
import { NoteAdd } from "@material-ui/icons";
import React from "react";
import "./MoneyFlow.css";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

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
  iconButton: {},
  invisibleInput: {
    display: "none",
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

export default function MoneyFlow() {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState("");
  const { register, handleSubmit, control } = useForm();

  const uploadCSV = (e: any) => {
    const file = e?.target?.files[0];
    if (!file) {
      return setSelectedFile("");
    }
    setSelectedFile(file?.name);
  };

  return (
    <div className="money-flow">
      <Card className={classes.cardLay} variant="outlined">
        <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <h2>Money Flow</h2>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={5}>
          <Grid item container xs={12} spacing={0}>
            <form className={classes.form} noValidate>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <FormControl>
                    <Typography>Upload daily money flow csv:</Typography>
                  </FormControl>
                </Grid>
                <Grid item xs={9}>
                  <FormControl>
                    <Controller
                      name="attachments"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <input
                            accept=".csv"
                            className={classes.invisibleInput}
                            id="icon-button-file"
                            type="file"
                            onChange={uploadCSV}
                          />
                          <label htmlFor="icon-button-file">
                            <Fab
                              color="secondary"
                              size="small"
                              component="span"
                              aria-label="add"
                              variant="extended"
                            >
                              <NoteAdd /> Upload CSV
                            </Fab>
                          </label>
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {selectedFile ? selectedFile : "No File Selected"}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
