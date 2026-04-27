import { useReducer } from "react";
import type {
  actionType,
  gameStateType,
  piece,
  pieceState,
  playerState,
} from "../types/gameTypes";
import {
  getNextPlayer,
  getNextPosition,
  getStartPosition,
  isPiecePlayable,
} from "../utils/helpers";

const initialState = function (numPlayers: number): gameStateType {
  const playing =
    numPlayers === 2
      ? ["0", "3"]
      : numPlayers === 3
        ? ["0", "1", "2"]
        : numPlayers === 4
          ? ["0", "1", "2", "3"]
          : ["0"];

  return {
    players: [
      {
        id: "0",
        score: 0,
        playerIndex: 0,
        state: "IDLE",
        color: "red",
        pieces: [
          {
            id: `player-1-0`,
            position: 1,
            ownerId: "0",
            initialPosition: 1,
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-1-1`,
            position: 2,
            initialPosition: 2,
            ownerId: "0",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-1-2`,
            position: 3,
            initialPosition: 3,
            ownerId: "0",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-1-3`,
            position: 4,
            initialPosition: 4,
            ownerId: "0",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },

      {
        id: "1",
        score: 0,
        playerIndex: 1,
        state: "IDLE",
        color: "green",
        pieces: [
          {
            id: `player-2-0`,
            position: 5,
            initialPosition: 5,
            ownerId: "1",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-2-1`,
            position: 6,
            initialPosition: 6,
            ownerId: "1",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-2-2`,
            position: 7,
            initialPosition: 7,
            ownerId: "1",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-2-3`,
            position: 8,
            initialPosition: 8,
            ownerId: "1",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },
      {
        id: "2",
        score: 0,
        playerIndex: 2,
        state: "IDLE",
        color: "blue",
        pieces: [
          {
            id: `player-3-0`,
            position: 9,
            initialPosition: 9,
            ownerId: "2",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-3-1`,
            position: 10,
            initialPosition: 10,
            ownerId: "2",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-3-2`,
            position: 11,
            initialPosition: 11,
            ownerId: "2",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-3-3`,
            position: 12,
            initialPosition: 12,
            ownerId: "2",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },
      {
        id: "3",
        score: 0,
        playerIndex: 3,
        state: "IDLE",
        color: "yellow",
        pieces: [
          {
            id: `player-4-0`,
            position: 13,
            initialPosition: 13,
            ownerId: "3",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-4-1`,
            position: 14,
            initialPosition: 14,
            ownerId: "3",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-4-2`,
            position: 15,
            initialPosition: 15,
            ownerId: "3",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
          {
            id: `player-4-3`,
            position: 16,
            initialPosition: 16,
            ownerId: "3",
            state: "HOME",
            hasGoneRound: false,
            distance: 0,
          },
        ],
      },
    ],
    playing,
    state: "IN_PROGRESS",
    currentPlayerId: playing[0],
    currentMoveNumber: null,
    currentDieIndex: null,
    rolledDoubleSix: false,
    gamePhase: "ROLLING",
    rollResult: [0, 0, 0],
  };
};

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
        players: state.players.map((player) => {
          if (player.id !== state.currentPlayerId) return player;
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

      const positionMap: Record<number, [string, number][]> = {};
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
          ? getStartPosition(currentPlayer.playerIndex)
          : currentPiece.distance + state.currentMoveNumber! === 56
            ? 100
            : getNextPosition(
                currentPiece.position,
                currentPiece.distance,
                currentPlayer.playerIndex,
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

      const winner = newPlayers.find((player) => player.score === 4);
      if (winner) {
        return {
          ...state,
          players: newPlayers,
          state: "FINISHED",
        };
      }
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

function useLudoGame(numPlayers: number) {
  const [gameState, dispatch] = useReducer(reducer, initialState(+numPlayers));

  return {gameState, dispatch};
}

export default useLudoGame;
