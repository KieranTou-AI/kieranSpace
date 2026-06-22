"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
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

// AI: pick best move — win if possible, block player win, else center/corner/random
function aiMove(board: Board): number {
  const empty = board
    .map((cell, i) => (cell === null ? i : -1))
    .filter((i) => i !== -1);

  // Try to win
  for (const i of empty) {
    const test = [...board];
    test[i] = "O";
    if (checkWinner(test) === "O") return i;
  }

  // Block player win
  for (const i of empty) {
    const test = [...board];
    test[i] = "X";
    if (checkWinner(test) === "X") return i;
  }

  // Take center
  if (board[4] === null) return 4;

  // Take corners
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // Random
  return empty[Math.floor(Math.random() * empty.length)];
}

type GameState = "playing" | "won" | "lost" | "draw";

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [state, setState] = useState<GameState>("playing");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const handleClick = useCallback(
    (i: number) => {
      if (board[i] !== null || state !== "playing") return;

      const newBoard = [...board];
      newBoard[i] = "X";

      const winner = checkWinner(newBoard);
      if (winner === "X") {
        // Find the winning line
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

      // AI turn
      const ai = aiMove(newBoard);
      newBoard[ai] = "O";

      const aiWinner = checkWinner(newBoard);
      if (aiWinner === "O") {
        setBoard(newBoard);
        setState("lost");
        return;
      }

      if (isFull(newBoard)) {
        setBoard(newBoard);
        setState("draw");
        return;
      }

      setBoard(newBoard);
    },
    [board, state]
  );

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setState("playing");
    setWinningLine(null);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Board */}
      <div className="grid grid-cols-3 gap-px bg-white/10 rounded-lg overflow-hidden backdrop-blur">
        {board.map((cell, i) => {
          const isWin = winningLine?.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={state !== "playing" || cell !== null}
              className={`
                w-20 h-20 flex items-center justify-center text-2xl font-light
                bg-zinc-900 transition-colors duration-200
                disabled:cursor-default
                ${cell === null && state === "playing"
                  ? "hover:bg-zinc-800 cursor-pointer"
                  : ""
                }
                ${isWin
                  ? "bg-emerald-900/50 text-emerald-400"
                  : cell === "X"
                    ? "text-white"
                    : "text-white/60"
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
          <p className="text-sm text-white/40">井字棋 · 你执 X 先手 · 战胜 AI 即可进入</p>
        )}

        {state === "won" && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-emerald-400 text-lg font-medium">胜局</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-medium text-black hover:bg-white/90 transition-all duration-300 hover:scale-105"
            >
              进入
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        )}

        {state === "lost" && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-red-400/80 text-sm leading-relaxed">
              建议修炼 IQ 值后进入
            </p>
            <button
              onClick={reset}
              className="text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4"
            >
              再来一局
            </button>
          </div>
        )}

        {state === "draw" && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-white/40 text-sm">平局</p>
            <button
              onClick={reset}
              className="text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4"
            >
              再来一局
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
