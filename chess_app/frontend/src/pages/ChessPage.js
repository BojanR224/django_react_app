import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ChessGame from "../components/ChessGame";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import ProgressBar from "../components/ProgressBar";

export default function ChessPage() {
  const { state } = useLocation();
  const [fen, setFen] = useState(state.fen);
  const [bestMoves, setBestMoves] = useState([]);
  const [winPercentage, setWinPercentage] = useState(0);

  const handleMove = (newFen) => {
    setFen(newFen);
  };

  const getChessStatistics = async (fen) => {
    try {
      const formData = new FormData();
      formData.append("fen", fen);
      const config = {
        headers: {
          accept: "application/json",
          "Content-type":
            "plain/test; multipart/form-data; boundary=${formData._boundary}",
        },
      };

      await axios
        .post("/api/get-chess-statistics", formData, config)
        .then((res) => {
          setWinPercentage(res.data["win_percentage"]);
          setBestMoves(
            res.data["top_3_moves"]
              .map((move) => move.Move)
              .map((move) => move.match(/.{1,2}/g))
          );

          console.log(res);
          console.log(fen);
          console.log(bestMoves);
          console.log(winPercentage);
        });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    handleMove(fen);
    getChessStatistics(fen);
  }, [fen]);

  return (
    <Grid container align="center" direction="row" alignItems="stretch">
      <Grid item xs={1} align="center">
        <ProgressBar progress={winPercentage} />
      </Grid>
      <Grid item xs={10} align="center">
        <ChessGame
          fen={state?.fen}
          arePiecesDraggable={true}
          onFenUpdate={handleMove}
          onMove={handleMove}
          bestMoves={bestMoves}
        />
      </Grid>
      <Grid item xs={1} align="center">
        <ProgressBar progress={winPercentage} />
      </Grid>
      <Grid item xs={12} align="center">
        <Link to="/edit" state={{ fen: fen }}>
          <Button>Back</Button>
        </Link>
      </Grid>
    </Grid>
  );
}
