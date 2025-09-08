import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, Text, Pressable, StyleSheet, Switch } from "react-native";
import {
  Board as TBoard,
  emptyBoard,
  getWinner,
  isDraw,
  nextPlayer,
  playMove,
  getWinningLine,
} from "./src/game/rules";
import { randomAIMove } from "./src/game/ai";

export default function App() {
  const [board, setBoard] = useState<TBoard>(emptyBoard());
  const [vsAI, setVsAI] = useState(true);

  const winner = useMemo(() => getWinner(board), [board]);
  const draw = useMemo(() => isDraw(board), [board]);
  const turn = useMemo(() => nextPlayer(board), [board]);
  const winLine = useMemo(() => getWinningLine(board), [board]);

  // Let AI play as 'O' when it's O's turn
  useEffect(() => {
    if (!vsAI) return;
    if (winner || draw) return;
    if (turn === "O") {
      const idx = randomAIMove(board);
      if (idx !== null) {
        const t = setTimeout(() => setBoard((b) => playMove(b, idx, "O")), 300);
        return () => clearTimeout(t);
      }
    }
  }, [board, turn, vsAI, winner, draw]);

  function handlePress(i: number) {
    if (winner || draw) return;
    if (vsAI && turn === "O") return; // wait for AI
    setBoard((b) => playMove(b, i, turn));
  }

  function reset() {
    setBoard(emptyBoard());
  }

  const status = winner ? `Winner: ${winner}` : draw ? "Draw" : `Turn: ${turn}`;
  const disableHuman = !!winner || draw || (vsAI && turn === "O");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>

      <View style={styles.topRow}>
        <Text style={styles.status}>{status}</Text>
        <View style={styles.aiRow}>
          <Text style={styles.aiLabel}>Play vs AI</Text>
          <Switch value={vsAI} onValueChange={setVsAI} />
        </View>
      </View>

      <View style={styles.row}>
        <Square value={board[0]} onPress={() => handlePress(0)} highlight={!!winLine?.includes(0)} disabled={disableHuman} />
        <Square value={board[1]} onPress={() => handlePress(1)} highlight={!!winLine?.includes(1)} disabled={disableHuman} />
        <Square value={board[2]} onPress={() => handlePress(2)} highlight={!!winLine?.includes(2)} disabled={disableHuman} />
      </View>
      <View style={styles.row}>
        <Square value={board[3]} onPress={() => handlePress(3)} highlight={!!winLine?.includes(3)} disabled={disableHuman} />
        <Square value={board[4]} onPress={() => handlePress(4)} highlight={!!winLine?.includes(4)} disabled={disableHuman} />
        <Square value={board[5]} onPress={() => handlePress(5)} highlight={!!winLine?.includes(5)} disabled={disableHuman} />
      </View>
      <View style={styles.row}>
        <Square value={board[6]} onPress={() => handlePress(6)} highlight={!!winLine?.includes(6)} disabled={disableHuman} />
        <Square value={board[7]} onPress={() => handlePress(7)} highlight={!!winLine?.includes(7)} disabled={disableHuman} />
        <Square value={board[8]} onPress={() => handlePress(8)} highlight={!!winLine?.includes(8)} disabled={disableHuman} />
      </View>

      <Pressable onPress={reset} style={styles.button}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Square({
  value,
  onPress,
  highlight,
  disabled,
}: {
  value: "X" | "O" | null;
  onPress: () => void;
  highlight?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.square,
        pressed && styles.pressed,
        highlight && styles.highlight,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.mark, value === "X" ? styles.x : value === "O" ? styles.o : null]}>
        {value ?? ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 36, gap: 12 },
  title: { fontSize: 28, fontWeight: "900" },
  topRow: { alignItems: "center", gap: 8 },
  status: { fontSize: 18, fontWeight: "700" },
  aiRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4, justifyContent: "center" },
  aiLabel: { fontSize: 16 },
  row: { flexDirection: "row", gap: 8 },
  square: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
  mark: { fontSize: 44, fontWeight: "900" },
  x: { color: "#3b82f6" },
  o: { color: "#10b981" },
  highlight: { backgroundColor: "#fff3b0" },
  button: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 18, borderWidth: 2, borderRadius: 12 },
  buttonText: { fontSize: 18, fontWeight: "800" },
});
