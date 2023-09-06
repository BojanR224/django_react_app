import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import ChessGame from "./ChessGame";
import { Link } from "react-router-dom";
import { FormHelperText, Typography } from "@material-ui/core";

export default function Test(props) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3} align="center">
        <Typography component="h4" variant="h4">
          Chess Statistics
        </Typography>
      </Grid>
      <Grid item xs={6} align="center">
        <Typography component="h4" variant="h4">
          Chess Game
        </Typography>
        <ChessGame data={props} />
      </Grid>
      <Grid item xs={3} align="center">
        <Typography component="h4" variant="h4">
          Chess Statistics
        </Typography>
      </Grid>
      <Grid item xs={4} align="center">
        <Button
          color="secondary"
          variant="contained"
          to="/capture"
          component={Link}
        >
          Capture Photo
        </Button>
      </Grid>
      <Grid item xs={4} align="center">
        <Button color="secondary" variant="contained">
          Import Photo
        </Button>
      </Grid>
      <Grid item xs={4} align="center">
        <Button color="secondary" variant="contained">
          Show Statistics
        </Button>
      </Grid>
    </Grid>
  );
}
