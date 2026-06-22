"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

// Unbeatable AI using optimal strategy
function aiMove(board: Board): number {
  const empty = board
    .map((cell, i) => (cell === null ? i : -1))
    .filter((i) => i !== -1);

  if (empty.length === 0) return -1;

  // 1. Win
  for (const i of empty) {
    const test = [...board]; test[i] = "O";
    if (checkWinner(test) === "O") return i;
  }

  // 2. Block
  for (const i of empty) {
    const test = [...board]; test[i] = "X";
    if (checkWinner(test) === "X") return i;
  }

  // 3. Fork: create two winning threats
  for (const i of empty) {
    const test = [...board]; test[i] = "O";
    let threats = 0;
    for (const j of empty) {
      if (j === i) continue;
      const t2 = [...test]; t2[j] = "O";
      if (checkWinner(t2) === "O") threats++;
    }
    if (threats >= 2) return i;
  }

  // 4. Block opponent's fork
  for (const i of empty) {
    const test = [...board]; test[i] = "X";
    let threats = 0;
    for (const j of empty) {
      if (j === i) continue;
      const t2 = [...test]; t2[j] = "X";
      if (checkWinner(t2) === "X") threats++;
    }
    if (threats >= 2) return i;
  }

  // 5. Center
  if (board[4] === null) return 4;

  // 6. Opposite corner
  const corners: [number, number][] = [[0, 8], [2, 6], [6, 2], [8, 0]];
  for (const [opp, _] of corners) {
    if (board[opp] === "X" && board[_] === null) return _;
  }

  // 7. Empty corner
  const cornerCells = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (cornerCells.length > 0) return cornerCells[0];

  // 8. Empty side
  const sideCells = [1, 3, 5, 7].filter((i) => board[i] === null);
  if (sideCells.length > 0) return sideCells[0];

  return empty[0];
}

type GameState = "playing" | "won" | "lost" | "draw";

function createInitialBoard(): Board {
  const b = Array(9).fill(null);
  b[4] = "O"; // AI starts at center
  return b;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [state, setState] = useState<GameState>("playing");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  const handleClick = useCallback(
    (i: number) => {
      if (board[i] !== null || state !== "playing" || aiThinking) return;

      const newBoard = [...board];
      newBoard[i] = "X";

      const winner = checkWinner(newBoard);
      if (winner === "X") {
        for (const line of WINNING_LINES) {
          if (
            newBoard[line[0]] === "X" &&
            newBoard[line[1]] === "X" &&
            newBoard[line[2]] === "X"
          ) {
            setWinningLine(line);
            break;
          }
        }
        setBoard(newBoard);
        setState("won");
        return;
      }

      if (isFull(newBoard)) {
        setBoard(newBoard);
        setState("draw");
        return;
      }

      // AI turn with slight delay for feel
      setAiThinking(true);
      setTimeout(() => {
        const ai = aiMove(newBoard);
        newBoard[ai] = "O";

        const aiWinner = checkWinner(newBoard);
        if (aiWinner === "O") {
          setBoard(newBoard);
          setState("lost");
          setAiThinking(false);
          return;
        }

        if (isFull(newBoard)) {
          setBoard(newBoard);
          setState("draw");
          setAiThinking(false);
          return;
        }

        setBoard(newBoard);
        setAiThinking(false);
      }, 300);
    },
    [board, state, aiThinking]
  );

  const reset = useCallback(() => {
    setBoard(createInitialBoard());
    setState("playing");
    setWinningLine(null);
    setAiThinking(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Board */}
      <div className="grid grid-cols-3 gap-px rounded-lg overflow-hidden ring-1 ring-zinc-200">
        {board.map((cell, i) => {
          const isWin = winningLine?.includes(i);
          const isCenter = i === 4;
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={state !== "playing" || cell !== null || aiThinking}
              className={`
                w-20 h-20 flex items-center justify-center text-2xl font-light
                bg-white transition-all duration-200
                disabled:cursor-default
                ${cell === null && state === "playing" && !aiThinking
                  ? "hover:bg-zinc-50 cursor-pointer"
                  : ""
                }
                ${isWin
                  ? "bg-emerald-50 text-emerald-600"
                  : cell === "X"
                    ? "text-zinc-800"
                    : cell === "O" && isCenter && state === "playing"
                      ? "text-zinc-400"
                      : "text-zinc-300"
                }
              `}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Game status */}
      <div className="text-center space-y-4">
        {state === "playing" && (
          <p className="text-sm text-zinc-400">
            {aiThinking ? "AI 思考中…" : "井字棋 · 你执 X · 平局即可进入"}
          </p>
        )}

        {(state === "won" || state === "draw") && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-emerald-600 text-lg font-medium">
              {state === "won" ? "胜局" : "平局 — 通过"}
            </p>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-all duration-300 hover:scale-105"
            >
              进入
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        )}

        {state === "lost" && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-zinc-500 text-sm leading-relaxed">
              建议修炼 IQ 值后进入
            </p>
            <button
              onClick={reset}
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors underline underline-offset-4"
            >
              再来一局
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
