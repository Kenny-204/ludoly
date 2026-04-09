import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import Board from "../../components/Board";
import {
  getCellPosition,
  getHomeCellPosition,
  getInitialPosition,
} from "../../utils/board";

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
  currentMoveNumber: number | null;
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

const initialState: gameStateType = {
  players: [
    {
      id: 0,
      score: 0,
      state: "IDLE",
      color: "red",
      pieces: [
        {
          id: `player-1-0`,
          position: 40,
          ownerId: 0,
          initialPosition: 1,
          state: "BOARD",
          hasGoneRound: true,
          distance: 50,
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
  currentPlayerId: 0,
  currentMoveNumber: null,
  currentDieIndex: null,
  gamePhase: "ROLLING",
  rollResult: [0, 0, 0],
};

function getNextPlayer(currentPlayerId: number, totalPlayers: number = 4) {
  return (currentPlayerId + 1) % totalPlayers;
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
  if (gamePhase === "WAITING") return false;
  if (!dice || playerId !== currentPiece.ownerId) return false;
  if (currentPiece.state === "FINISHED") return false;

  const diceValues = Array.isArray(dice) ? dice : [dice];
  return diceValues.some((d, i) => {
    if (currentPiece.state === "BOARD") {
      if (currentPiece.distance + d > 56 && d > 0) return false;
      return d && true;
    } else if (currentPiece.state === "HOME") return i < 2 && d === 6;
    else if (currentPiece.state === "HOME_STRETCH") {
      if (currentPiece.distance + d > 56 && d > 0) return false;
      return true;
    }
  });
}

function reducer(state: gameStateType, action: actionType) {
  switch (action.type) {
    case "ROLL_DICE": {
      const currentPlayer = state.players.find(
        (player) => player.id === state.currentPlayerId,
      )!;

      const diceContainsSix =
        action.payload[0] === 6 || action.payload[1] === 6;

      // let isPieceOnBoard;
      // state.players
      //   .find((player) => player.id === state.currentPlayerId)!
      //   .pieces.some((piece) => {
      //     if (piece.state === "BOARD") return (isPieceOnBoard = true);
      //   });
      let isThereAnyPlayablePiece;
      state.players
        .find((player) => player.id === state.currentPlayerId)!
        .pieces.some((piece) => {
          if (
            isPiecePlayable(
              piece,
              action.payload,
              currentPlayer.id,
              state.gamePhase,
            )
          )
            return (isThereAnyPlayablePiece = true);
        });

      const shouldSkipTurn = !isThereAnyPlayablePiece;
      return {
        ...state,
        currentPlayerId: shouldSkipTurn
          ? getNextPlayer(state.currentPlayerId)
          : state.currentPlayerId,
        rollResult: action.payload,
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
      // console.log(positionMap);

      const totalRollSelected = state.currentDieIndex == 2;

      const newRollResult = state.rollResult.map((rollNumber, index) => {
        if (totalRollSelected) return 0;
        if (index === 2) return rollNumber - state.currentMoveNumber!;
        if (index === state.currentDieIndex) return 0;
        return rollNumber;
      });

      let isThereAnyPlayablePiece;
      state.players
        .find((player) => player.id === state.currentPlayerId)!
        .pieces.some((piece) => {
          console.log(
            isPiecePlayable(
              piece,
              state.rollResult,
              currentPlayer.id,
              state.gamePhase,
            ),
            piece.id,
          );
          console.log(piece, newRollResult, currentPlayer.id, state.gamePhase);
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
      // const hasPlayerFinishedPlaying =
      //   state.rollResult[0] == 0 ||
      //   state.rollResult[1] == 0 ||
      //   totalRollSelected;
      return {
        ...state,
        rollResult: newRollResult,
        gamePhase: hasPlayerFinishedPlaying ? "WAITING" : "ROLLING",
        currentMoveNumber: null,
        // state: !hasPlayerFinishedPlaying ? "PLAYING" : "IDLE",
        currentPlayerId: !hasPlayerFinishedPlaying
          ? state.currentPlayerId
          : getNextPlayer(state.currentPlayerId),
        players: state.players.map((player) => {
          const newPosition =
            currentPiece.state === "HOME"
              ? getStartPosition(action.payload.playerId)
              : getNextPosition(
                  currentPiece.position,
                  currentPiece.distance,
                  action.payload.playerId,
                  state.currentMoveNumber!,
                );
          const capturedPiece = positionMap[newPosition]?.filter(
            ([playerId]) => playerId != state.currentPlayerId,
          )[0];

          if (player.id !== state.currentPlayerId) {
            if (capturedPiece && player.id === capturedPiece[0]) {
              // console.log(capturedPiece[0], player.id);
              return {
                ...player,

                pieces: player.pieces.map((piece, index) => {
                  if (index !== capturedPiece[1]) return piece;
                  return {
                    ...piece,
                    position: piece.initialPosition,
                    state: "HOME",
                    distance: 0,
                  };
                }),
              };
            }
            return player;
          }
          if (capturedPiece) {
            return {
              ...player,
              state: "IDLE",
              pieces: player.pieces.map((piece, index) => {
                if (index !== action.payload.pieceIndex) return piece;
                return {
                  ...piece,
                  position: 100,
                  state: "FINISHED",
                };
              }),
            };
          }

          return {
            ...player,
            state: hasPlayerFinishedPlaying ? "IDLE" : "PLAYING",
            pieces: player.pieces.map((piece, index) => {
              if (index !== action.payload.pieceIndex)
                return {
                  ...piece,
                };
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

              const inHomeStretch =
                currentPiece.distance + state.currentMoveNumber! > 50;
              return {
                ...piece,
                hasGoneRound: currentPiece.distance > 35,
                position: newPosition,
                distance:
                  currentPiece.distance !== 0
                    ? currentPiece.distance + state.currentMoveNumber!
                    : 1,
                state:
                  currentPiece.distance + state.currentMoveNumber! === 56
                    ? "FINISHED"
                    : inHomeStretch
                      ? "HOME_STRETCH"
                      : "BOARD",
              };
            }),
          };
        }),
      };
    }
    default:
      return state;
  }
}

function Game() {
  const [
    { players, rollResult, currentMoveNumber, currentPlayerId, gamePhase },
    dispatch,
  ] = useReducer(reducer, initialState);

  const currentPlayer = useMemo(
    () => players.find((player) => player.id === currentPlayerId),
    [players, currentPlayerId],
  )!;

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
        // console.log(rollResult);
        dispatch({
          type: "ROLL_DICE",
          payload: [die1.value, die2.value, die1.value + die2.value],
        });
        setIsDiceRolling(false);
        // console.log(players);
      };
    }
  }
  return (
    <>
      <div className="flex justify-around mt-3 flex-wrap">
        <div className="w-60 h-40 border bg-red-500 flex flex-col justify-between py-4 items-center ">
          <p className="">
            {currentPlayerId == 0
              ? "Red"
              : currentPlayerId == 1
                ? "Green"
                : currentPlayerId == 2
                  ? "Blue"
                  : "Yellow"}{" "}
            player turn
          </p>
          <div className=" flex flex-wrap justify-around gap-3">
            {rollResult.map((result, dieIndex) => (
              <button
                key={dieIndex}
                className="bg-yellow-300 w-15 h-15 "
                onClick={() =>
                  dispatch({
                    type: "SELECT_NUMBER",
                    payload: { result, dieIndex },
                  })
                }
              >
                {result}
              </button>
            ))}
          </div>
          {currentMoveNumber && (
            <button
              className="bg-yellow-300 w-15 h-15 mt-5 "
              // onClick={() =>
              //   dispatch({ type: "SELECT_NUMBER", payload: result })
              // }
            >
              {currentMoveNumber}
            </button>
          )}
          <button
            onClick={handleRoll}
            disabled={isDiceRolling || currentPlayer.state === "PLAYING"}
            className="w-[80%] h-10 border bg-white"
          >
            roll
          </button>
        </div>
        <Board>
          {players.map((player) =>
            player.pieces.map((piece, pieceIndex) => {
              const position =
                piece.state === "HOME"
                  ? getInitialPosition(piece.position)
                  : piece.state === "HOME_STRETCH"
                    ? getHomeCellPosition(piece.position)
                    : getCellPosition(piece.position);

              return (
                <div
                  key={piece.id}
                  onClick={() => {
                    dispatch({
                      type: "MOVE_PIECE",
                      payload: { pieceIndex, playerId: player.id },
                    });
                  }}
                  className="relative w-7 h-7  top-0.5 left-1 col-start-9 col-end-10 row-start-1 row-end-2 z-20"
                  style={{
                    ...position,
                    // ...getInitialPosition(position),
                    // ...getCellPosition(position),
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full bg-red-700 z-1 border shadow"
                    style={{
                      backgroundColor: player.color,
                    }}
                  ></div>
                  {piece.ownerId === currentPlayer.id &&
                    isPiecePlayable(
                      piece,
                      currentMoveNumber || rollResult,
                      player.id,
                      gamePhase,
                    ) && (
                      <div className="absolute -inset-1 rounded-full animate-spin border-2 border-yellow-400 border-dashed opacity-70 z-0"></div>
                    )}
                </div>
              );
            }),
          )}
        </Board>
      </div>
    </>
  );
}

export default Game;
