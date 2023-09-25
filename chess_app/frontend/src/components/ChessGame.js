import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

//{ fen, arePiecesDraggable, customArrows }
const ChessGame = (props) => {
  const [boardPosition, setBoardPosition] = useState("start");
  const [fen, setFen] = useState(props?.fen);
  const [chess, setChess] = useState(
    new Chess(
      props.fen
        ? props.fen
        : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    )
  );
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [bestMoves, setBestMoves] = useState(props?.bestMoves);
  const { onMove } = props;

  // const handleSquareClick = (square) => {
  //   const piece = chess.get(square);

  //   if (piece && piece.color === chess.turn()) {
  //     setSelectedSquare(square);
  //     highlightValidMoves(square);
  //   }
  // };

  const handleFenUpdate = (newFen) => {
    setFen(newFen);
    if (typeof props.handleFenUpdate === "function") {
      props.handleFenUpdate(newFen);
    }
  };

  useEffect(() => {
    setBoardPosition(chess.fen());
    handleFenUpdate(fen);
  }, [fen]);

  // const highlightValidMoves = (square) => {
  //   const validMoves = chess.moves({ square, verbose: true });

  //   const highlightedSquares = validMoves.map((move) => move.to);
  //   highlightedSquares.push(square);

  //   setBoardPosition((prevPosition) => ({
  //     ...prevPosition,
  //     lastSquareToHighlight: highlightedSquares,
  //   }));
  // };

  const handleSquareClick = (square) => {
    var piece = chess.get(square);

    if (piece.type == "k") {
      return;
    }

    if (!piece) chess.put({ type: "p", color: "w" }, square);
    else {
      if (piece.type == "q") {
        if (piece.color == "w") piece.color = "b";
        else {
          chess.remove(square);
          piece = false;
        }
      }
      if (piece) {
        const pieceTypes = ["p", "n", "b", "r", "q"];
        const currentPieceIndex = pieceTypes.indexOf(piece.type);
        const nextPieceIndex = (currentPieceIndex + 1) % pieceTypes.length;
        const nextPieceType = pieceTypes[nextPieceIndex];

        chess.put({ type: nextPieceType, color: piece.color }, square);
      }
    }

    setBoardPosition(chess.fen());
    onMove?.(chess.fen());
    console.log(chess.fen());
  };

  const handleMove = (fromSquare, toSquare) => {
    const move = chess.move({
      from: fromSquare,
      to: toSquare,
      promotion: "q", // You can change the promotion piece if needed
    });

    if (move) {
      setSelectedSquare(null);
      setBoardPosition(chess.fen());
      onMove?.(chess.fen());
    }
  };

  const resetBoard = () => {
    chess.reset();
    setSelectedSquare(null);
    setBoardPosition(chess.fen());
  };

  return (
    <div className="chessboard">
      <Chessboard
        position={boardPosition}
        arePiecesDraggable={props.arePiecesDraggable}
        onPieceDrop={(fromSquare, toSquare) =>
          props?.arePiecesDraggable ? handleMove(fromSquare, toSquare) : {}
        }
        onSquareClick={(square) =>
          props?.arePiecesDraggable ? {} : handleSquareClick(square)
        }
        customArrows={props?.bestMoves}
        customArrowColor="rgb(255,170,0)"
      />
    </div>
  );
};

export default ChessGame;
