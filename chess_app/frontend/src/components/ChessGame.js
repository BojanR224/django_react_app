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
  const [bestMoves, setBestMoves] = useState([]);
  const { onMove } = props;

  const handleSquareClick = (square) => {
    const piece = chess.get(square);

    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      highlightValidMoves(square);
    }
  };

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
      onMove?.(chess.fen());
    }
  };

  const fetchBestMoves = async () => {
    try {
      // Make an Axios GET request to your Django API endpoint
      const response = await axios.get("YOUR_API_ENDPOINT_HERE");

      // Assuming your API response contains an array of best moves
      setBestMoves(response.data.bestMoves);
    } catch (error) {
      console.error("Error fetching best moves:", error);
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
        onPieceDrop={(fromSquare, toSquare) => handleMove(fromSquare, toSquare)}
        // onSquareClick={(square) => handleSquareClick(square)}
        customArrows={props.customArrows}
      />
    </div>
  );
};

export default ChessGame;
