import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import Board from "../../components/Board";
import {
  getCellPosition,
  getHomeCellPosition,
  getInitialPosition,
} from "../../utils/board";
import { useSearchParams } from "react-router-dom";

// ── Style-only constants ────────────────────────────────────────
const playerColorMap: Record<string, { glow: string; hex: string }> = {
  red: { glow: "rgba(239,68,68,0.35)", hex: "#ef4444" },
  green: { glow: "rgba(34,197,94,0.35)", hex: "#22c55e" },
  blue: { glow: "rgba(59,130,246,0.35)", hex: "#3b82f6" },
  yellow: { glow: "rgba(234,179,8,0.35)", hex: "#eab308" },
};
const dieLabels = ["Die 1", "Die 2", "Total"];
// ───────────────────────────────────────────────────────────────

type pieceState = "HOME" | "BOARD" | "HOME_STRETCH" | "FINISHED";
type playerState = "PLAYING" | "IDLE" | "WON";

type piece = {
  id: string;
  ownerId: number;
  position: number;
  state: pieceState;
  distance: number;
  hasGoneRound: boolean;
  initialPosition: number;
};

type player = {
  id: number;
  color: string;
  state: playerState;

  score: number;
  pieces: piece[];
};

type actionType =
  | { type: "ROLL_DICE"; payload: number[] }
  | { type: "SELECT_NUMBER"; payload: { result: number; dieIndex: number } }
  | {
      type: "MOVE_PIECE";
      payload: { pieceIndex: number; playerId: number };
    };

type gameStateType = {
  currentPlayerId: number;
  players: player[];
  rollResult: number[];
  rolledDoubleSix: boolean;
  currentMoveNumber: number | null;
  playing: number[];
  currentDieIndex: number | null;
  gamePhase: "WAITING" | "ROLLING";
};

function getStartPosition(playerIndex: number) {
  if (playerIndex === 0) {
    return 42;
  }
  if (playerIndex === 1) {
    return 3;
  }
  if (playerIndex === 2) {
    return 29;
  }
  if (playerIndex === 3) {
    return 16;
  }
  return 0;
}

const initialState = function (numPlayers: number): gameStateType {
  const playing =
    numPlayers === 2
      ? [0, 3]
      : numPlayers === 3
        ? [0, 1, 2]
        : numPlayers === 4
          ? [0, 1, 2, 3]
          : [0];

  return {
    players: [
      {
        id: 0,
        score: 0,
        state: "IDLE",
        color: "red",
        pieces: [
          {
            id: `player-1-0`,
            position: 1,
            ownerId: 0,
            initialPosition: 1,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-1-1`,
            position: 2,
            initialPosition: 2,
            ownerId: 0,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-1-2`,
            position: 3,
            initialPosition: 3,
            ownerId: 0,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-1-3`,
            position: 4,
            initialPosition: 4,
            ownerId: 0,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },

      {
        id: 1,
        score: 0,
        state: "IDLE",
        color: "green",
        pieces: [
          {
            id: `player-2-0`,
            position: 5,
            initialPosition: 5,
            ownerId: 1,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-2-1`,
            position: 6,
            initialPosition: 6,
            ownerId: 1,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-2-2`,
            position: 7,
            initialPosition: 7,
            ownerId: 1,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-2-3`,
            position: 8,
            initialPosition: 8,
            ownerId: 1,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },
      {
        id: 2,
        score: 0,
        state: "IDLE",
        color: "blue",
        pieces: [
          {
            id: `player-3-0`,
            position: 9,
            initialPosition: 9,
            ownerId: 2,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-3-1`,
            position: 10,
            initialPosition: 10,
            ownerId: 2,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-3-2`,
            position: 11,
            initialPosition: 11,
            ownerId: 2,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-3-3`,
            position: 12,
            initialPosition: 12,
            ownerId: 2,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },
      {
        id: 3,
        score: 0,
        state: "IDLE",
        color: "yellow",
        pieces: [
          {
            id: `player-4-0`,
            position: 13,
            initialPosition: 13,
            ownerId: 3,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-4-1`,
            position: 14,
            initialPosition: 14,
            ownerId: 3,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-4-2`,
            position: 15,
            initialPosition: 15,
            ownerId: 3,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-4-3`,
            position: 16,
            initialPosition: 16,
            ownerId: 3,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },
    ],
    playing,
    currentPlayerId: playing[0],
    currentMoveNumber: null,
    currentDieIndex: null,
    rolledDoubleSix: false,
    gamePhase: "ROLLING",
    rollResult: [0, 0, 0],
  };
};

function getNextPlayer(currentPlayerId: number, playing: number[]) {
  const currentPlayerIndex = playing.findIndex(
    (playerId) => playerId === currentPlayerId,
  );

  return playing[(currentPlayerIndex + 1) % playing.length];
}

function getNextPosition(
  currentPosition: number,
  distance: number,
  playerId: number,
  currentMoveNumber: number,
  totalPosition: number = 51,
) {
  const shouldEnterHomeStretch = distance + currentMoveNumber > totalPosition;
  if (playerId === 0 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 7;
  }
  if (playerId === 1 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 2;
  }
  if (playerId === 2 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 12;
  }
  if (playerId === 3 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 17;
  } else return (currentPosition + currentMoveNumber) % totalPosition;
}

function isPiecePlayable(
  currentPiece: piece,
  dice: number | number[] | null,
  playerId: number,
  gamePhase: "WAITING" | "ROLLING",
): boolean {
  if (gamePhase === "WAITING") {
    console.log("It happened because the game phase was waiting");
    return false;
  }
  if (!dice || playerId !== currentPiece.ownerId) {
    console.log(
      "It happened because there was no dice or the player id was not equal to the current piece",
    );
    return false;
  }
  if (currentPiece.state === "FINISHED") {
    console.log("It happened because the piece was finished");
    return false;
  }

  const diceValues = Array.isArray(dice) ? dice : [dice];
  return diceValues.some((d, i) => {
    if (d <= 0) {
      console.log("It happened because thedie was -");
      return false;
    }
    if (currentPiece.state === "BOARD") {
      if (currentPiece.distance + d > 56) {
        console.log(
          "It happened because the it would have made the distance more than 56",
        );
        return false;
      }
      return d && true;
    } else if (currentPiece.state === "HOME") return i < 2 && d === 6;
    else if (currentPiece.state === "HOME_STRETCH") {
      if (currentPiece.distance + d > 56) {
        console.log(
          "It happened because the distance would have been more than 56",
        );
        return false;
      }

      return true;
    }
  });
}

// TODO: move the reducer logic to a custom hook

function reducer(state: gameStateType, action: actionType): gameStateType {
  switch (action.type) {
    case "ROLL_DICE": {
      const currentPlayer = state.players.find(
        (player) => player.id === state.currentPlayerId,
      )!;

      const rolledDoubleSix =
        action.payload[0] === 6 && action.payload[1] === 6;
      const isThereAnyPlayablePiece = state.players
        .find((player) => player.id === state.currentPlayerId)!
        .pieces.some((piece) =>
          isPiecePlayable(piece, action.payload, currentPlayer.id, "ROLLING"),
        );
      console.log("is there any piece playable", isThereAnyPlayablePiece);

      const shouldSkipTurn = !isThereAnyPlayablePiece;
      console.log(shouldSkipTurn ? "IDLE" : "PLAYING");
      return {
        ...state,
        currentPlayerId: shouldSkipTurn
          ? getNextPlayer(state.currentPlayerId, state.playing)
          : state.currentPlayerId,
        rollResult: action.payload,
        rolledDoubleSix,
        gamePhase: shouldSkipTurn ? "WAITING" : "ROLLING",
        players: state.players.map((player, index) => {
          if (index !== state.currentPlayerId) return player;
          return {
            ...player,
            state: shouldSkipTurn ? "IDLE" : "PLAYING",
            pieces: player.pieces.map((piece) => ({
              ...piece,
            })),
            currentMoveNumber: null,
          };
        }),
      };
    }
    case "SELECT_NUMBER":
      return {
        ...state,
        currentMoveNumber: action.payload.result,
        currentDieIndex: action.payload.dieIndex,
      };

    case "MOVE_PIECE": {
      // validate move

      const currentPlayer = state.players.find(
        (player) => player.id === state.currentPlayerId,
      )!;

      const currentPiece = currentPlayer.pieces[action.payload.pieceIndex];
      if (
        !isPiecePlayable(
          currentPiece,
          state.currentMoveNumber,
          state.currentPlayerId,
          state.gamePhase,
        )
      ) {
        return state;
      }

      // compute the new values

      const positionMap: Record<number, number[][]> = {};
      state.players.forEach((player) => {
        player.pieces.forEach((piece, pieceIndex) => {
          if (piece.state === "BOARD") {
            if (!positionMap[piece.position]) {
              positionMap[piece.position] = [];
            }
            positionMap[piece.position].push([player.id, pieceIndex]);
          }
        });
      });

      const totalRollSelected = state.currentDieIndex == 2;

      const newRollResult = state.rollResult.map((rollNumber, index) => {
        if (totalRollSelected) return 0;
        if (index === 2) return rollNumber - state.currentMoveNumber!;
        if (index === state.currentDieIndex) return 0;
        return rollNumber;
      });
      // compute moved piece
      // (where the piece is suppposed to go)
      const newPosition =
        currentPiece.state === "HOME"
          ? getStartPosition(action.payload.playerId)
          : currentPiece.distance + state.currentMoveNumber! === 56
            ? 100
            : getNextPosition(
                currentPiece.position,
                currentPiece.distance,
                action.payload.playerId,
                state.currentMoveNumber!,
              );
      // (check if it's in the home stretch)
      const inHomeStretch =
        currentPiece.distance + state.currentMoveNumber! > 50;
      // (the piece that has moved)
      const movedPiece: piece = {
        ...currentPiece,
        hasGoneRound: currentPiece.distance > 35,
        position: newPosition,
        distance:
          currentPiece.distance !== 0
            ? currentPiece.distance + state.currentMoveNumber!
            : 1,
        state: (currentPiece.distance + state.currentMoveNumber! === 56
          ? "FINISHED"
          : inHomeStretch
            ? "HOME_STRETCH"
            : "BOARD") as pieceState,
      };
      // check if there was a captured piece
      const capturedPiece = positionMap[newPosition]?.filter(
        ([playerId]) => playerId != state.currentPlayerId,
      )[0];
      // build the newPlayer object

      const newPlayers = state.players.map((player) => {
        //  send the captured piece to home if any
        if (player.id !== state.currentPlayerId) {
          if (capturedPiece && player.id === capturedPiece[0]) {
            return {
              ...player,

              pieces: player.pieces.map((piece, index) => {
                if (index !== capturedPiece[1]) return piece;
                return {
                  ...piece,
                  position: piece.initialPosition,
                  state: "HOME" as pieceState,
                  distance: 0,
                };
              }),
            };
          }
        }
        // move current player

        if (player.id === state.currentPlayerId) {
          if (capturedPiece) {
            return {
              ...player,
              state: "IDLE" as playerState,
              score: player.score + 1,
              pieces: player.pieces.map((piece, index) => {
                if (index !== action.payload.pieceIndex) return piece;
                return {
                  ...piece,
                  position: 100,
                  state: "FINISHED" as pieceState,
                };
              }),
            };
          }
          return {
            ...player,
            state: "IDLE" as playerState,
            score: movedPiece.distance === 56 ? player.score + 1 : player.score,
            pieces: player.pieces.map((piece, index) => {
              if (index === action.payload.pieceIndex) {
                return movedPiece;
              }
              return piece;
            }),
          };
        }
        return player;
      });
      // check if there's still any piece that can be played
      let isThereAnyPlayablePiece;
      newPlayers
        .find((player) => player.id === state.currentPlayerId)!
        .pieces.some((piece) => {
          if (
            isPiecePlayable(
              piece,
              newRollResult,
              currentPlayer.id,
              state.gamePhase,
            )
          )
            return (isThereAnyPlayablePiece = true);
        });
      const hasPlayerFinishedPlaying = !isThereAnyPlayablePiece;
      const nextPlayerId =
        !hasPlayerFinishedPlaying ||
        (hasPlayerFinishedPlaying && state.rolledDoubleSix)
          ? state.currentPlayerId
          : getNextPlayer(state.currentPlayerId, state.playing);
      const rolledDoubleSix =
        hasPlayerFinishedPlaying && state.rolledDoubleSix
          ? false
          : state.rolledDoubleSix;

      // const hasPlayerFinishedPlaying =
      //   state.rollResult[0] == 0 ||
      //   state.rollResult[1] == 0 ||
      //   totalRollSelected;
      // Build the new Player
      return {
        ...state,
        rollResult: newRollResult,
        gamePhase: hasPlayerFinishedPlaying ? "WAITING" : "ROLLING",
        currentMoveNumber: null,
        currentPlayerId: nextPlayerId,
        players: newPlayers.map((player) => {
          if (player.id === currentPlayer.id) {
            return {
              ...player,
              state: hasPlayerFinishedPlaying ? "IDLE" : "PLAYING",
            };
          }
          return player;
        }),
        rolledDoubleSix,
      };
    }
    default:
      return state;
  }
}

function Game() {
  const [searchParams] = useSearchParams();
  const numPlayers = searchParams.get("players") || 4;
  const [
    {
      players,
      playing,
      rollResult,
      currentMoveNumber,
      currentPlayerId,
      gamePhase,
    },
    dispatch,
  ] = useReducer(reducer, initialState(+numPlayers));

  const currentPlayer = useMemo(
    () => players.find((player) => player.id === currentPlayerId),
    [players, currentPlayerId],
  )!;
  console.log(players);

  const diceBoxRef = useRef<DiceBox | null>(null);
  const [isDiceRolling, setIsDiceRolling] = useState(false);

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
        dispatch({
          type: "ROLL_DICE",
          payload: [die1.value, die2.value, die1.value + die2.value],
        });
        setIsDiceRolling(false);
      };
    }
  }
  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center gap-6 p-6">
      {/* ── Left Panel ── */}
      <div className="w-52 shrink-0 flex flex-col gap-4">
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
                onClick={() =>
                  dispatch({
                    type: "SELECT_NUMBER",
                    payload: { result, dieIndex },
                  })
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
                  dispatch({
                    type: "MOVE_PIECE",
                    payload: { pieceIndex, playerId: player.id },
                  });
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

export default Game;
