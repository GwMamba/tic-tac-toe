export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[]; // 9 cells, 0..8

export const emptyBoard = (): Board => Array(9).fill(null);

const LINES: number[][] = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],         // diagonals
];

export function getWinner(b: Board): Player | null {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
}

export const isDraw = (b: Board) => b.every(Boolean) && !getWinner(b);

export const nextPlayer = (b: Board): Player =>
  (b.filter(x => x !== null).length % 2 === 0) ? 'X' : 'O';

export function playMove(b: Board, i: number, p: Player): Board {
  if (b[i] || getWinner(b)) return b; // ignore invalid or after game end
  const copy = b.slice();
  copy[i] = p;
  return copy;
}
