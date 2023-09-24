import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ChessGame from "../components/ChessGame";
import { Link, useLocation } from "react-router-dom";

export default function ChessPage() {
  const { state } = useLocation();
  const [fen, setFen] = useState(state.fen);

  const handleMove = (newFen) => {
    setFen(newFen);
  };

  useEffect(() => {
    handleMove(fen);
  }, [fen]);

  return (
    <Grid container align="center" direction="row" alignItems="stretch">
      <Link to="/edit" state={{ fen: fen }}>
        <Button>Back</Button>
      </Link>
      <Grid item xs={12} align="center">
        <ChessGame
          fen={state?.fen}
          onFenUpdate={handleMove}
          onMove={handleMove}
        />
      </Grid>
    </Grid>
  );
}
