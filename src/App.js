import { useEffect, useState } from "react";
import "./App.css";

function Square({ value, onSquareClick, isWinning }) {
  const squareClassName = "square" + (isWinning ? " winning-square" : "");

  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, setHistory, resetMoves }) {
  const [gameState, setGameState] = useState("playing");
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 2000);
  }, []);

  function handleClick(i) {
    if (squares[i] || gameState !== "playing") {
      return;
    }

    const nextSquares = squares.slice(); //kopia tablicy, która tworzy nową tablicę zawierającą takie same elementy jak squares.

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);

    if (calculateWinner(nextSquares)) {
      setGameState("winner");
      return;
    }

    const isBoardFull = nextSquares.every((square) => square !== null);
    if (isBoardFull) {
      setGameState("draw");
      return;
    }
  }

  function newPlay() {
    setGameState("playing");
    setHistory([Array(9).fill(null)]);
    resetMoves();
  }

  return (
    <article className="board">
      <div className="status">
        {showTitle && <h1 className="title">Tic Tac Toe</h1>}
        {!showTitle && (
          <>
            {gameState === "playing" && (
              <>
                <img src="/playing.png" alt="Arrow" className="image-arrow" />
                <span>Next player: {xIsNext ? "X" : "O"}</span>
              </>
            )}
          </>
        )}
        {gameState === "winner" && (
          <>
            <span>Winner: {xIsNext ? "O" : "X"}</span>
            <img src="/winner.png" alt="Medal" className="image-medal" />
          </>
        )}
        {gameState === "draw" && (
          <>
            <span>Draw</span>
            <img src="/draw.png" alt="Handshake" className="image-handshake" />
          </>
        )}
      </div>

      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          isWinning={isWinningSquare(squares, 0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          isWinning={isWinningSquare(squares, 1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          isWinning={isWinningSquare(squares, 2)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          isWinning={isWinningSquare(squares, 3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          isWinning={isWinningSquare(squares, 4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          isWinning={isWinningSquare(squares, 5)}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          isWinning={isWinningSquare(squares, 6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          isWinning={isWinningSquare(squares, 7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          isWinning={isWinningSquare(squares, 8)}
        />
      </div>
      {(gameState === "winner" || gameState === "draw") && (
        <button className="button-try-again" onClick={newPlay}>
          Try again!
        </button>
      )}
    </article>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMoveState, setCurrentMoveState] = useState({
    currentMove: 0,
    currentHistoryMove: 0,
  });
  const xIsNext = currentMoveState.currentHistoryMove % 2 === 0;
  const currentSquares = history[currentMoveState.currentHistoryMove];

  function handlePlay(nextSquares) {
    if (currentMoveState.currentMove === currentMoveState.currentHistoryMove) {
      setHistory((prev) => [...prev, nextSquares]);
      setCurrentMoveState((prev) => {
        return {
          currentMove: prev.currentMove + 1,
          currentHistoryMove: prev.currentHistoryMove + 1,
        };
      });
    }
  }

  const moves = history.map((squares, move) => {
    let descritpion;
    if (move > 0) {
      descritpion = "Go to move #" + move;
    } else {
      descritpion = "Go to game start";
    }
    return (
      <li key={move}>
        <button
          onClick={() =>
            setCurrentMoveState((prev) => ({
              currentMove: prev.currentMove,
              currentHistoryMove: move,
            }))
          }
        >
          {descritpion}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          setHistory={setHistory}
          resetMoves={() =>
            setCurrentMoveState({ currentMove: 0, currentHistoryMove: 0 })
          }
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isWinningSquare(squares, squareIndex) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i].includes(squareIndex);
    }
  }
  return false;
}
