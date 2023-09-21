import React from "react";
import Grid from "@material-ui/core/Grid";
import ChessGame from "../components/ChessGame";
import { useLocation } from "react-router-dom";

export default function ChessPage() {
  return (
    <Grid container align="center" direction="row" alignItems="stretch">
      <Grid item xs={12} align="center">
        <ChessGame />
      </Grid>
    </Grid>
  );
}
