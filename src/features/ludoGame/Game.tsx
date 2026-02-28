import { useEffect, useReducer, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import Board from "../../components/Board";
import {
  getCellPosition,
  getHomeCellPosition,
  getInitialPosition,
} from "../../utils/board";

type piece = {
  id: string;
  position: number;
  isPlayable: boolean;
  isOnHome: boolean;
  isOnBoard: boolean;
  hasGoneRound: boolean;
  isInHomeStretch: boolean;
  initialPosition: number;
};

type player = {
  color: string;
  isPlaying: boolean;

  pieces: piece[];
};

type actionType =
  | { type: "ROLL_DICE"; payload: number[] }
  | { type: "SELECT_NUMBER"; payload: { result: number; dieIndex: number } }
  | {
      type: "MOVE_PIECE";
      payload: { pieceIndex: number; playerIndex: number };
    };

type gameStateType = {
  currentPlayer: number;
  players: player[];
  rollResult: number[];
  currentMoveNumber: number | null;
  currentDieIndex: number | null;
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
      isPlaying: false,
      color: "red",
      pieces: [
        {
          id: `player-1-0`,
          position: 1,
          initialPosition: 1,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-1-1`,
          position: 2,
          initialPosition: 2,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-1-2`,
          position: 3,
          initialPosition: 3,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-1-3`,
          position: 4,
          initialPosition: 4,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
      ],
    },

    {
      isPlaying: false,

      color: "green",
      pieces: [
        {
          id: `player-2-0`,
          position: 5,
          initialPosition: 5,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-2-1`,
          position: 6,
          initialPosition: 6,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-2-2`,
          position: 7,
          initialPosition: 7,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-2-3`,
          position: 8,
          initialPosition: 8,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
      ],
    },
    {
      isPlaying: false,

      color: "blue",
      pieces: [
        {
          id: `player-3-0`,
          position: 9,
          initialPosition: 9,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-3-1`,
          position: 10,
          initialPosition: 10,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-3-2`,
          position: 11,
          initialPosition: 11,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-3-3`,
          position: 12,
          initialPosition: 12,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
      ],
    },
    {
      isPlaying: false,

      color: "yellow",
      pieces: [
        {
          id: `player-4-0`,
          position: 13,
          initialPosition: 13,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-4-1`,
          position: 14,
          initialPosition: 14,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-4-2`,
          position: 15,
          initialPosition: 15,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
        {
          id: `player-4-3`,
          position: 16,
          initialPosition: 16,
          isOnBoard: false,
          isOnHome: true,
          isPlayable: false,
          hasGoneRound: false,
          isInHomeStretch: false,
        },
      ],
    },
  ],
  currentPlayer: 0,
  currentMoveNumber: null,
  currentDieIndex: null,
  rollResult: [0, 0, 0],
};

function getNextPlayer(currentPlayer: number, totalPlayers: number = 4) {
  return (currentPlayer + 1) % totalPlayers;
}

function isInHomeStretch(
  newPosition: number,
  playerIndex: number,
  currentPiece: piece,
) {
  if (
    playerIndex === 0 &&
    currentPiece.hasGoneRound == true &&
    newPosition >= 7 &&
    newPosition <= 11
  )
    return true;
  else if (
    playerIndex === 1 &&
    currentPiece.hasGoneRound == true &&
    newPosition >= 2 &&
    newPosition <= 6
  ) {
    return true;
  } else if (
    playerIndex === 2 &&
    currentPiece.hasGoneRound == true &&
    newPosition >= 12 &&
    newPosition <= 16
  ) {
    return true;
  } else if (
    playerIndex === 3 &&
    currentPiece.hasGoneRound == true &&
    newPosition >= 17 &&
    newPosition <= 21
  ) {
    return true;
  }
  return false;
}

function getNextPosition(
  currentPosition: number,
  playerIndex: number,
  pieceIndex: number,
  state: gameStateType,
  currentMoveNumber: number,
  totalPosition: number = 51,
) {
  if (
    playerIndex === 0 &&
    currentPosition + currentMoveNumber > 40 &&
    state.players[playerIndex].pieces[pieceIndex].hasGoneRound == true
  ) {
    return ((currentPosition + currentMoveNumber) % 41) + 5;
  }
  if (
    playerIndex === 1 &&
    currentPosition + currentMoveNumber > 1 &&
    state.players[playerIndex].pieces[pieceIndex].hasGoneRound == true
  ) {
    const wrappedPosition = (currentMoveNumber + currentPosition) % 52;

    if (wrappedPosition > 1) return wrappedPosition;

    return wrappedPosition;
  }
  if (
    playerIndex === 2 &&
    currentPosition + currentMoveNumber > 27 &&
    state.players[playerIndex].pieces[pieceIndex].hasGoneRound == true
  ) {
    return ((currentPosition + currentMoveNumber) % 28) + 9;
  }
  if (
    playerIndex === 3 &&
    currentPosition + currentMoveNumber > 14 &&
    currentPosition + currentMoveNumber < 20 &&
    state.players[playerIndex].pieces[pieceIndex].hasGoneRound == true
  ) {
    return ((currentPosition + currentMoveNumber) % 15) + 15;
  } else return (currentPosition + currentMoveNumber) % totalPosition;
}

function hasGoneRound(playerIndex: number, currentPosition: number): boolean {
  console.log(playerIndex, currentPosition);
  if (playerIndex == 0 && currentPosition < 40 && currentPosition > 16)
    return true;
  else if (playerIndex == 1 && currentPosition > 40) return true;
  else if (playerIndex == 2 && currentPosition < 29 && currentPosition > 16)
    return true;
  else if (playerIndex == 3 && currentPosition > 27) return true;
  else return false;
}

function isPieceReadyToGoHome(playerIndex: number, position: number): boolean {
  if (playerIndex == 0 && position >= 5 && position <= 9) {
    return true;
  }
  if (playerIndex == 1 && position >= 0 && position <= 4) {
    return true;
  }
  if (playerIndex == 2 && position >= 10 && position <= 14) {
    return true;
  }
  if (playerIndex == 3 && position >= 15 && position <= 19) {
    return true;
  }
  return false;
}

function reducer(state: gameStateType, action: actionType) {
  switch (action.type) {
    case "ROLL_DICE": {
      const diceContainsSix =
        action.payload[0] === 6 || action.payload[1] === 6;

      let isPieceOnBoard;
      state.players[state.currentPlayer].pieces.some((piece) => {
        if (piece.isOnBoard) return (isPieceOnBoard = true);
      });

      const shouldSkipTurn = !isPieceOnBoard && !diceContainsSix;
      return {
        ...state,
        currentPlayer: shouldSkipTurn
          ? getNextPlayer(state.currentPlayer)
          : state.currentPlayer,
        rollResult: action.payload,
        players: state.players.map((player, index) => {
          if (index !== state.currentPlayer) return player;
          return {
            ...player,
            isPlaying: !shouldSkipTurn,
            pieces: player.pieces.map((piece) => ({
              ...piece,
              isPlayable: diceContainsSix || piece.isOnBoard,
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
      const currentPiece =
        state.players[state.currentPlayer].pieces[action.payload.pieceIndex];
      if (!currentPiece.isPlayable) {
        return state;
      }
      if (!state.currentMoveNumber) {
        return state;
      }
      if (currentPiece.isOnHome && state.currentMoveNumber !== 6) {
        return state;
      }

      const positionMap: Record<number, number[][]> = {};
      // new Map<number, number[]>();

      state.players.forEach((player, playerIndex) => {
        player.pieces.forEach((piece, pieceIndex) => {
          if (!piece.isOnHome && !piece.isInHomeStretch && piece.isOnBoard) {
            if (!positionMap[piece.position]) {
              positionMap[piece.position] = [];
            }
            positionMap[piece.position].push([playerIndex, pieceIndex]);
          }
        });
      });
      console.log(positionMap);

      const totalRollSelected = state.currentDieIndex == 2;
      const hasPlayerFinishedPlaying =
        state.rollResult[0] == 0 ||
        state.rollResult[1] == 0 ||
        totalRollSelected;
      return {
        ...state,
        rollResult: state.rollResult.map((rollNumber, index) => {
          if (totalRollSelected) return 0;
          if (index === 2) return rollNumber - state.currentMoveNumber!;
          if (index === state.currentDieIndex) return 0;
          return rollNumber;
        }),

        currentMoveNumber: null,
        currentPlayer: !hasPlayerFinishedPlaying
          ? state.currentPlayer
          : state.currentPlayer == 3
            ? 0
            : state.currentPlayer + 1,
        players: state.players.map((player, index) => {
          const newPosition = currentPiece.isOnHome
            ? getStartPosition(action.payload.playerIndex)
            : getNextPosition(
                currentPiece.position,
                action.payload.playerIndex,
                action.payload.pieceIndex,
                state,
                state.currentMoveNumber!,
              );
          const capturedPiece = positionMap[newPosition]?.filter(
            ([playerIndex]) => playerIndex != state.currentPlayer,
          )[0];
          console.log(capturedPiece);

          if (index !== state.currentPlayer) {
            if (capturedPiece && index === capturedPiece[0]) {
              console.log(capturedPiece[0], index);
              return {
                ...player,
                pieces: player.pieces.map((piece, index) => {
                  if (index !== capturedPiece[1]) return piece;
                  return {
                    ...piece,
                    position: piece.initialPosition,
                    isOnBoard: false,
                    isOnHome: true,
                  };
                }),
              };
            }
            return player;
          }
          if (capturedPiece) {
            return {
              ...player,
              pieces: player.pieces.map((piece, index) => {
                if (index !== action.payload.pieceIndex) return piece;
                return {
                  ...piece,
                  position: 100,
                  isOnBoard: false,
                };
              }),
            };
          }

          return {
            ...player,
            isPlaying: !hasPlayerFinishedPlaying,
            pieces: player.pieces.map((piece, index) => {
              if (index !== action.payload.pieceIndex)
                return {
                  ...piece,
                  isPlayable: hasPlayerFinishedPlaying ? false : true,
                };
              const newPosition = piece.isOnHome
                ? getStartPosition(action.payload.playerIndex)
                : getNextPosition(
                    piece.position,
                    action.payload.playerIndex,
                    action.payload.pieceIndex,
                    state,
                    state.currentMoveNumber!,
                  );
              const inHomeStretch = isInHomeStretch(
                newPosition,
                action.payload.playerIndex,
                currentPiece,
              );

              return {
                ...piece,
                hasGoneRound:
                  currentPiece.hasGoneRound ||
                  hasGoneRound(
                    action.payload.playerIndex,
                    currentPiece.position,
                  ),
                position: newPosition,
                isPlayable: hasPlayerFinishedPlaying ? false : true,
                isOnBoard: true,
                isOnHome: false,
                isInHomeStretch: inHomeStretch,
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
  const [{ players, rollResult, currentMoveNumber, currentPlayer }, dispatch] =
    useReducer(reducer, initialState);
  const diceBoxRef = useRef<DiceBox | null>(null);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  console.log(players);

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
            {currentPlayer == 0
              ? "Red"
              : currentPlayer == 1
                ? "Green"
                : currentPlayer == 2
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
            disabled={isDiceRolling || players[currentPlayer].isPlaying}
            className="w-[80%] h-10 border bg-white"
          >
            roll
          </button>
        </div>
        <Board>
          {players.map((player, playerIndex) =>
            player.pieces.map((piece, pieceIndex) => {
              const position = piece.isOnHome
                ? getInitialPosition(piece.position)
                : (piece.hasGoneRound &&
                      isPieceReadyToGoHome(playerIndex, piece.position)) ||
                    piece.isInHomeStretch
                  ? getHomeCellPosition(piece.position)
                  : getCellPosition(piece.position);
              // console.log(
              //   isPieceReadyToGoHome(playerIndex, piece.position),
              //   playerIndex,
              //   piece.hasGoneRound,
              //   piece.position,
              // );
              // const position = piece.position;
              // console.log(position, piece.position, piece.startPosition, piece);
              return (
                <div
                  key={piece.id}
                  onClick={() => {
                    dispatch({
                      type: "MOVE_PIECE",
                      payload: { pieceIndex, playerIndex },
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
                      // boxShadow: `0 0 0 2px white, 0 0 0 calc(2px + 2px) ${player.color}`,
                      backgroundColor: player.color,
                    }}
                  ></div>
                  {piece.isPlayable && (
                    <div className="absolute -inset-1 rounded-full animate-spin border-2 border-yellow-400 border-dashed opacity-70 z-0"></div>
                  )}
                </div>
                //     <div
                //       className="h-7 w-7 rounded-full z-1
                // shadow-[0_0_15px_rgba(0,0,0,0.4)]
                // "
                //       style={{
                //         ...getInitialPosition(position),
                //         // ...getCellPosition(position),
                //         boxShadow:
                //           `0 0 0 2px white, 0 0 0 calc(2px + 2px) ${player.color}`,
                //         backgroundColor: player.color,
                //       }}
                //     >
                //       {/* {position} */}
                //     </div>
              );
            }),
          )}
        </Board>
      </div>
    </>
  );
}

export default Game;
