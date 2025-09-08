import { Board, getWinner, isDraw } from "./rules";

/** Returns a random empty cell index or null if game over/no moves. */
export function randomAIMove(b: Board): number | null {
  if (getWinner(b) || isDraw(b)) return null;
  const open: number[] = [];
  for (let i = 0; i < 9; i++) if (!b[i]) open.push(i);
  if (!open.length) return null;
  return open[Math.floor(Math.random() * open.length)];
}
