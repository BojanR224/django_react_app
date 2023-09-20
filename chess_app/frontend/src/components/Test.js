import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ChessGame from "./ChessGame";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "@material-ui/core";

export default function Test() {
  const { state } = useLocation();

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
        <ChessGame fen={state?.fen} />
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
