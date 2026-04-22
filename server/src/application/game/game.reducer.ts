import {
  getNextPlayer,
  getNextPosition,
  getStartPosition,
  isPiecePlayable,
} from "../../core/utils/game.helper.js";

type pieceState = "HOME" | "BOARD" | "HOME_STRETCH" | "FINISHED";
type playerState = "PLAYING" | "IDLE" | "WON";

type piece = {
  id: string;
  ownerId: string;
  position: number;
  state: pieceState;
  distance: number;
  hasGoneRound: boolean;
  initialPosition: number;
};

type player = {
  id: string;
  color: string;
  state: playerState;
  playerNumber: number;
  playerIndex: number;
  isReady: boolean;
  score: number;
  pieces: piece[];
};

type actionType =
  | { type: "ROLL_DICE"; payload: number[] }
  | { type: "SELECT_NUMBER"; payload: { result: number; dieIndex: number } }
  | {
      type: "MOVE_PIECE";
      payload: { pieceIndex: number; playerId: string };
    };

type gameStateType = {
  currentPlayerId: string;
  players: player[];
  rollResult: number[];
  rolledDoubleSix: boolean;
  currentMoveNumber: number | null;
  playing: string[];
  currentDieIndex: number | null;
  gamePhase: "WAITING" | "ROLLING";
};

export default function gameReducer(state: gameStateType, action: actionType): gameStateType {
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

      const shouldSkipTurn = !isThereAnyPlayablePiece;
      return {
        ...state,
        currentPlayerId: shouldSkipTurn
          ? getNextPlayer(state.currentPlayerId, state.playing)!
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

      const currentPiece = currentPlayer.pieces[action.payload.pieceIndex]!;
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
      state.players.forEach((player, playerIndex) => {
        player.pieces.forEach((piece, pieceIndex) => {
          if (piece.state === "BOARD") {
            if (!positionMap[piece.position]) {
              positionMap[piece.position] = [];
            }
            positionMap[piece.position]!.push([player.id, pieceIndex]);
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
          ? getStartPosition(currentPlayer.playerNumber)
          : currentPiece.distance + state.currentMoveNumber! === 56
            ? 100
            : getNextPosition(
                currentPiece.position,
                currentPiece.distance,
                currentPlayer.playerNumber,
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
        currentPlayerId: nextPlayerId!,
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
