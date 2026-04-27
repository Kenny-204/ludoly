import { useEffect, useMemo, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import Board from "../../components/Board";
import {
  getCellPosition,
  getHomeCellPosition,
  getInitialPosition,
} from "../../utils/board";
import { useGameState } from "../../contexts/GameStateContext";
import { useSocket } from "../../contexts/socket";
import type { actionType } from "../../types/game.t";
import { isPiecePlayable } from "../ludoGame/utils/helpers";

// ── Style-only constants ────────────────────────────────────────
const playerColorMap: Record<string, { glow: string; hex: string }> = {
  red: { glow: "rgba(239,68,68,0.35)", hex: "#ef4444" },
  green: { glow: "rgba(34,197,94,0.35)", hex: "#22c55e" },
  blue: { glow: "rgba(59,130,246,0.35)", hex: "#3b82f6" },
  yellow: { glow: "rgba(234,179,8,0.35)", hex: "#eab308" },
};
const dieLabels = ["Die 1", "Die 2", "Total"];
// ───────────────────────────────────────────────────────────────

function OnlineGame() {
  const { gameState, playerId } = useGameState();
  const { socket } = useSocket();

  const {
    roomCode,
    players,
    playing,
    rollResult,
    currentMoveNumber,
    currentPlayerId,
    gamePhase,
  } = gameState!;

  const currentPlayer = useMemo(
    () => players.find((player) => player.id === currentPlayerId),
    [players, currentPlayerId],
  )!;

  const me = players.find((player) => player.id === playerId);

  const isMyTurn = playerId === currentPlayerId;

  const diceBoxRef = useRef<DiceBox | null>(null);
  const [isDiceRolling, setIsDiceRolling] = useState(false);

  useEffect(
    function () {
      if (!socket || !roomCode) return;
      socket.emit("rejoin-game", { roomCode, playerId });
    },
    [playerId, roomCode, socket],
  );

  useEffect(function () {
    const initDice = async () => {
      const box = new DiceBox({
        assetPath: "/assets/",
        container: "#dice-box",
        scale: 15,
        themeColor: "#ffffff",
        enableShadows: false,
      });
      await box.init();
      diceBoxRef.current = box;
    };
    initDice();
  }, []);

  async function handleRoll() {
    if (diceBoxRef.current) {
      diceBoxRef.current.roll(["2d6"]);
      setIsDiceRolling(true);
      diceBoxRef.current.onRollComplete = (rollResult) => {
        const [die1, die2] = rollResult[0].rolls;
        handleGameAction({
          type: "ROLL_DICE",
          payload: [die1.value, die2.value, die1.value + die2.value],
        });
        // dispatch({
        //   type: "ROLL_DICE",
        //   payload: [die1.value, die2.value, die1.value + die2.value],
        // });
        setIsDiceRolling(false);
      };
    }
  }

  function handleGameAction(action: actionType) {
    if (currentPlayerId !== playerId) return;
    socket?.emit("game-action", { roomCode, action });
  }
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center gap-6 p-6">
      {/* ── Left Panel ── */}
      <div className="w-52 shrink-0 flex flex-col gap-4">
        {/* You are */}
        {me && (
          <div className="rounded-xl border border-border bg-surface px-4 py-3 flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0 border border-white/10"
              style={{
                backgroundColor: playerColorMap[me.color]?.hex,
                boxShadow: `0 0 10px 0 ${playerColorMap[me.color]?.glow}`,
              }}
            />
            <span className="text-xs text-muted font-medium">
              You are{" "}
              <span
                className="capitalize"
                style={{ color: playerColorMap[me.color]?.hex }}
              >
                {me.color}
              </span>
            </span>
          </div>
        )}

        {/* Current player */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-3 font-medium">
            Current Turn
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border-2 border-white/10 shrink-0"
              style={{
                backgroundColor: playerColorMap[currentPlayer.color]?.hex,
                boxShadow: `0 0 12px 0 ${playerColorMap[currentPlayer.color]?.glow}`,
              }}
            />
            <p
              className="font-display text-2xl font-semibold capitalize"
              style={{ color: playerColorMap[currentPlayer.color]?.hex }}
            >
              {currentPlayer.color}
            </p>
          </div>
          <p className="text-xs text-muted mt-2">
            {gamePhase === "WAITING"
              ? "Waiting to roll…"
              : "Pick a piece to move"}
          </p>
        </div>

        {/* Dice */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-3 font-medium">
            Dice
          </p>
          <div className="grid grid-cols-3 gap-2">
            {rollResult.map((result, dieIndex) => (
              <button
                key={dieIndex}
                onClick={
                  () =>
                    handleGameAction({
                      type: "SELECT_NUMBER",
                      payload: { result, dieIndex },
                    })
                  //   dispatch({
                  //     type: "SELECT_NUMBER",
                  //     payload: { result, dieIndex },
                  //   })
                }
                className={[
                  "rounded-lg h-12 flex flex-col items-center justify-center gap-0.5 border transition-all duration-150 cursor-pointer",
                  currentMoveNumber !== null &&
                  rollResult[dieIndex] === currentMoveNumber
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : result > 0
                      ? "border-border bg-surface-2 text-text hover:border-accent/40"
                      : "border-border bg-surface-2 text-muted cursor-default",
                ].join(" ")}
              >
                <span className="font-display text-lg font-semibold leading-none">
                  {result > 0 ? result : "–"}
                </span>
                <span className="text-[9px] text-muted leading-none">
                  {dieLabels[dieIndex]}
                </span>
              </button>
            ))}
          </div>

          {currentMoveNumber !== null && (
            <div className="mt-3 flex items-center gap-2 px-1">
              <span className="text-xs text-muted">Moving:</span>
              <span className="font-display text-accent text-lg font-semibold">
                {currentMoveNumber}
              </span>
            </div>
          )}
        </div>

        {/* Roll button */}
        {isMyTurn ? (
          <button
            onClick={handleRoll}
            disabled={isDiceRolling || currentPlayer.state === "PLAYING"}
            className={[
              "w-full py-3.5 rounded-xl font-display text-lg font-semibold transition-all duration-150",
              isDiceRolling || currentPlayer.state === "PLAYING"
                ? "bg-surface-2 border border-border text-muted cursor-not-allowed opacity-50"
                : "bg-accent text-bg cursor-pointer hover:bg-accent-hover active:scale-95 shadow-accent",
            ].join(" ")}
          >
            {isDiceRolling ? "Rolling…" : "Roll Dice"}
          </button>
        ) : (
          <div className="w-full py-3.5 rounded-xl border border-border bg-surface-2 flex items-center justify-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: playerColorMap[currentPlayer.color]?.hex,
              }}
            />
            <span className="font-display text-sm text-muted capitalize">
              {currentPlayer.color}'s turn
            </span>
          </div>
        )}
      </div>

      {/* ── Board ── */}
      <Board>
        {players.map((player) =>
          player.pieces.map((piece, pieceIndex) => {
            const position = !playing.includes(piece.ownerId)
              ? getCellPosition(101)
              : piece.state === "HOME"
                ? getInitialPosition(piece.position)
                : piece.state === "HOME_STRETCH"
                  ? getHomeCellPosition(piece.position)
                  : getCellPosition(piece.position);

            return (
              <button
                key={piece.id}
                onClick={() => {
                  handleGameAction({
                    type: "MOVE_PIECE",
                    payload: { pieceIndex, playerId: player.id },
                  });
                  //   dispatch({
                  //     type: "MOVE_PIECE",
                  //     payload: { pieceIndex, playerId: player.id },
                  //   });
                }}
                className="relative w-7 h-7 top-0.5 left-1 col-start-9 col-end-10 row-start-1 row-end-2 z-20 bg-transparent border-none p-0 cursor-pointer"
                style={{ ...position }}
              >
                <div
                  className="absolute inset-0 rounded-full z-10 border-2 border-black/25 shadow-md "
                  style={{
                    backgroundColor: player.color,
                    boxShadow: `0 2px 8px 0 ${playerColorMap[player.color]?.glow}`,
                  }}
                />
                {piece.ownerId === currentPlayer.id &&
                  isPiecePlayable(
                    piece,
                    currentMoveNumber || rollResult,
                    player.id,
                    gamePhase,
                  ) && (
                    <div className="absolute -inset-1 rounded-full animate-spin border-2 border-accent border-dashed opacity-80 z-0" />
                  )}
              </button>
            );
          }),
        )}
      </Board>

      {/* ── Right Panel — Scores ── */}
      <div className="w-52 shrink-0 flex flex-col gap-3">
        <p className="text-[10px] text-muted uppercase tracking-widest font-medium px-1">
          Scoreboard
        </p>
        {players.map((player) => (
          <div
            key={player.id}
            className={[
              "rounded-xl border bg-surface p-4 flex items-center gap-3 transition-all duration-150",
              player.id === currentPlayerId
                ? "border-accent/40 shadow-[0_0_16px_0_rgba(245,197,24,0.08)]"
                : "border-border",
            ].join(" ")}
          >
            <div
              className="w-4 h-4 rounded-full border border-white/10 shrink-0"
              style={{
                backgroundColor: playerColorMap[player.color]?.hex,
                boxShadow: `0 0 8px 0 ${playerColorMap[player.color]?.glow}`,
              }}
            />
            <p className="font-display text-base capitalize flex-1">
              {player.color}
            </p>
            <p className="font-display text-xl text-accent font-semibold">
              {player.score}
            </p>
          </div>
        ))}

        {/* Pieces progress */}
        <div className="rounded-xl border border-border bg-surface p-4 mt-1">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-3 font-medium">
            Pieces Home
          </p>
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-2 mb-2 last:mb-0"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: playerColorMap[player.color]?.hex }}
              />
              <div className="flex gap-1">
                {player.pieces.map((p) => (
                  <div
                    key={p.id}
                    className={[
                      "w-2.5 h-2.5 rounded-full border border-white/10 transition-opacity duration-300",
                      p.state === "FINISHED" ? "opacity-100" : "opacity-20",
                    ].join(" ")}
                    style={{
                      backgroundColor: playerColorMap[player.color]?.hex,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted ml-auto">
                {player.pieces.filter((p) => p.state === "FINISHED").length}/4
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OnlineGame;
