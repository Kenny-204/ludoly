export type pieceState = "HOME" | "BOARD" | "HOME_STRETCH" | "FINISHED";
export type playerState = "PLAYING" | "IDLE" | "WON";
export type color = "red" | "blue" | "yellow" | "green";

export type piece = {
  id: string;
  ownerId: string;
  position: number;
  state: pieceState;
  distance: number;
  hasGoneRound: boolean;
  initialPosition: number;
};

export type player = {
  id: string;
  color: string;
  state: playerState;
  playerNumber:number;
  playerIndex:number;
  isReady: boolean;
  score: number;
  pieces: piece[];
};

export type actionType =
  | { type: "ROLL_DICE"; payload: number[] }
  | { type: "SELECT_NUMBER"; payload: { result: number; dieIndex: number } }
  | {
      type: "MOVE_PIECE";
      payload: { pieceIndex: number; playerId: number };
    };

export type gameStateType = {
  currentPlayerId: string | undefined;
  players: player[];
  numPlayers: number;
  rollResult: number[];
  rolledDoubleSix: boolean;
  currentMoveNumber: number | null;
  playing: string[];
  currentDieIndex: number | null;
  gamePhase: "WAITING" | "ROLLING";
};