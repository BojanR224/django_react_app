import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessGame = () => {
  const [boardPosition, setBoardPosition] = useState("start");
  const [chess, setChess] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);

  const handleSquareClick = (square) => {
    const piece = chess.get(square);

    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      highlightValidMoves(square);
    }
  };

  const highlightValidMoves = (square) => {
    const validMoves = chess.moves({ square, verbose: true });

    const highlightedSquares = validMoves.map((move) => move.to);
    highlightedSquares.push(square);

    setBoardPosition((prevPosition) => ({
      ...prevPosition,
      lastSquareToHighlight: highlightedSquares,
    }));
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
        onPieceDrop={(fromSquare, toSquare) => handleMove(fromSquare, toSquare)}
        onSquareClick={(square) => handleSquareClick(square)}
      />
      {chess.inCheck() && <p>King is under attack!</p>}
      {chess.isCheckmate() && (
        <div>
          <p>Checkmate!</p>
          <button onClick={resetBoard}>New Game</button>
        </div>
      )}
    </div>
  );
};

export default ChessGame;
