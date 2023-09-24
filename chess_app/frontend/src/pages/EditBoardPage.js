import React, { useState, useRef, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ChessGame from "../components/ChessGame";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "@material-ui/core";

export default function EditBoardPage() {
  const { state } = useLocation();
  const [fen, setFen] = useState(state.fen);

  const handleMove = (newFen) => {
    setFen(newFen);
  };

  useEffect(() => {
    handleMove(fen);
  }, []);

  return (
    <div>
      <Grid
        container
        spacing={1}
        align="center"
        direction="row"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Typography component="h4" variant="h4">
            Edit Board
          </Typography>
          <Typography component="h6" variant="h6">
            Click on the squares to change the piece
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs={3}
          align="center"
          direction="row"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            <Button>White to Move</Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button>Long castle</Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button>Short castle</Button>
          </Grid>
        </Grid>
        <Grid item xs={6} align="center">
          <ChessGame
            fen={state?.fen}
            onFenUpdate={handleMove}
            onMove={handleMove}
            arePiecesDraggable={false}
          />
          {/* Ovoj ChessGame kje bide editable and piecesareDraggable kje bide false, on clickSquare kje menja figurite */}
        </Grid>
        <Grid
          container
          item
          xs={3}
          align="center"
          direction="row"
          alignItems="stretch"
        >
          <Grid item xs={12} align="center">
            <Button>Black to Move</Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button>Long castle</Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button>Short castle</Button>
          </Grid>
        </Grid>
        <Grid item xs={12} align="center">
          <Link to="/chess" state={{ fen: fen }}>
            <Button>Confirm</Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}
