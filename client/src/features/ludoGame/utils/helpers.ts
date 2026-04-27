import type { piece } from "../types/gameTypes";

export function getNextPlayer(currentPlayerId: string, playing: string[]) {
  const currentPlayerIndex = playing.findIndex(
    (playerId) => playerId === currentPlayerId,
  );

  return playing[(currentPlayerIndex + 1) % playing.length];
}

export function getNextPosition(
  currentPosition: number,
  distance: number,
  playerIndex: number,
  currentMoveNumber: number,
  totalPosition: number = 51,
) {
  const shouldEnterHomeStretch = distance + currentMoveNumber > totalPosition;
  if (playerIndex === 0 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 7;
  }
  if (playerIndex === 1 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 2;
  }
  if (playerIndex === 2 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 12;
  }
  if (playerIndex === 3 && shouldEnterHomeStretch) {
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
    return false;
  }
  if (!dice || playerId !== currentPiece.ownerId) {
    return false;
  }
  if (currentPiece.state === "FINISHED") {
    return false;
  }

  const diceValues = Array.isArray(dice) ? dice : [dice];
  return diceValues.some((d, i) => {
    if (d <= 0) {
      return false;
    }
    if (currentPiece.state === "BOARD") {
      if (currentPiece.distance + d > 56) {
        return false;
      }
      return d && true;
    } else if (currentPiece.state === "HOME") return i < 2 && d === 6;
    else if (currentPiece.state === "HOME_STRETCH") {
      if (currentPiece.distance + d > 56) {
        return false;
      }

      return true;
    }
  });
}

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