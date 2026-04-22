import { randomBytes } from "crypto";
import type {
  color,
  gameStateType,
  piece,
  pieceState,
  player,
  playerState,
} from "../types/game.t.js";

// const initialState = function (numPlayers: number): gameStateType {
//   const playing =
//     numPlayers === 2
//       ? [0, 3]
//       : numPlayers === 3
//         ? [0, 1, 2]
//         : numPlayers === 4
//           ? [0, 1, 2, 3]
//           : [0];

//   return {
//     players: [
//       {
//         id: 0,
//         score: 0,
//         state: "IDLE",
//         color: "red",
//         pieces: [
//           {
//             id: `player-1-0`,
//             position: 1,
//             ownerId: 0,
//             initialPosition: 1,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-1-1`,
//             position: 2,
//             initialPosition: 2,
//             ownerId: 0,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-1-2`,
//             position: 3,
//             initialPosition: 3,
//             ownerId: 0,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-1-3`,
//             position: 4,
//             initialPosition: 4,
//             ownerId: 0,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//         ],
//       },

//       {
//         id: 1,
//         score: 0,
//         state: "IDLE",
//         color: "green",
//         pieces: [
//           {
//             id: `player-2-0`,
//             position: 5,
//             initialPosition: 5,
//             ownerId: 1,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-2-1`,
//             position: 6,
//             initialPosition: 6,
//             ownerId: 1,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-2-2`,
//             position: 7,
//             initialPosition: 7,
//             ownerId: 1,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-2-3`,
//             position: 8,
//             initialPosition: 8,
//             ownerId: 1,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//         ],
//       },
//       {
//         id: 2,
//         score: 0,
//         state: "IDLE",
//         color: "blue",
//         pieces: [
//           {
//             id: `player-3-0`,
//             position: 9,
//             initialPosition: 9,
//             ownerId: 2,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-3-1`,
//             position: 10,
//             initialPosition: 10,
//             ownerId: 2,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-3-2`,
//             position: 11,
//             initialPosition: 11,
//             ownerId: 2,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-3-3`,
//             position: 12,
//             initialPosition: 12,
//             ownerId: 2,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//         ],
//       },
//       {
//         id: 3,
//         score: 0,
//         state: "IDLE",
//         color: "yellow",
//         pieces: [
//           {
//             id: `player-4-0`,
//             position: 13,
//             initialPosition: 13,
//             ownerId: 3,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-4-1`,
//             position: 14,
//             initialPosition: 14,
//             ownerId: 3,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-4-2`,
//             position: 15,
//             initialPosition: 15,
//             ownerId: 3,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//           {
//             id: `player-4-3`,
//             position: 16,
//             initialPosition: 16,
//             ownerId: 3,
//             state: "HOME",
//             hasGoneRound: false,
//             distance: 0,
//           },
//         ],
//       },
//     ],
//     playing,
//     currentPlayerId: playing[0],
//     currentMoveNumber: null,
//     currentDieIndex: null,
//     rolledDoubleSix: false,
//     gamePhase: "ROLLING",
//     rollResult: [0, 0, 0],
//   };
// };

export function getStartPosition(playerIndex: number) {
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

export function getNextPlayer(currentPlayerId: string, playing: string[]) {
  const currentPlayerIndex = playing.findIndex(
    (playerId) => playerId === currentPlayerId,
  )!;

  return playing[(currentPlayerIndex + 1) % playing.length];
}

export function getNextPosition(
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

export function isPiecePlayable(
  currentPiece: piece,
  dice: number | number[] | null,
  playerId: string,
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

export class PlayerClass implements player {
  public id: string;
  public score: number;
  public state: playerState;
  public color: color;
  public playerIndex: number;
  public isReady: boolean;
  public pieces: PieceClass[];

  constructor(data: { playerId: string; color: color; playerIndex: number }) {
    this.isReady = false;
    this.id = data.playerId;
    this.playerIndex = data.playerIndex;
    this.color = data.color;
    this.state = "IDLE";
    this.score = 0;

    this.pieces = Array.from(
      { length: 4 },
      (_, i) =>
        new PieceClass(
          `${this.id}-${i}`,
          data.playerIndex == 1
            ? i + 1
            : data.playerIndex === 2
              ? i + 5
              : data.playerIndex === 3
                ? i + 9
                : i + 13,
          this.id,
        ),
    );
  }
}

class PieceClass implements piece {
  public position: number;
  public state: pieceState;
  public hasGoneRound: boolean;
  public distance: number;

  constructor(
    public id: string,
    public initialPosition: number,
    public ownerId: string,
  ) {
    this.position = initialPosition;
    this.state = "HOME";
    this.hasGoneRound = false;
    this.distance = 0;
  }
}

export function createInitialGameState(numPlayers: number): gameStateType {
  return {
    playing: [],
    numPlayers,
    currentPlayerId: undefined,
    currentMoveNumber: null,
    currentDieIndex: null,
    state: "WAITING",
    rolledDoubleSix: false,
    gamePhase: "ROLLING",
    rollResult: [0, 0, 0],
    players: [],
  };
}

export function getPlayerColor(playerIndex: number): color {
  if (playerIndex === 1) return "red";
  if (playerIndex === 2) return "yellow";
  if (playerIndex === 3) return "green";
  if (playerIndex === 4) return "blue";
  return "red";
}

export function generateRoomCode() {
  return randomBytes(3).toString("hex").toUpperCase();
}
